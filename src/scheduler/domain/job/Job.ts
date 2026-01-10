import { JobStatus } from "./JobStatus.js";
import { ExecutionStatus } from "./ExecutionStatus.js";
import { JobExecution } from "./JobExecution.js";
import { DomainError } from "./DomainError.js";

interface JobProps {
  id: string;
  jobKey: string;
  type: string;
  payload: unknown;
  maxAttempts: number;
  nextRunAt: Date;
  createdAt?: Date;
}

export class Job {
  getType() {
    return this.type;
  }
  canRetry(): boolean {
    return this.attempt < this.maxAttempts;
  }
  
  markDead(_now: Date): void {
    if (this.status === "COMPLETED") {
      throw new Error("Cannot mark COMPLETED job as DEAD");
    }

    this.status = JobStatus.DEAD;
  }
  readonly id: string;
  readonly jobKey: string;
  readonly type: string;
  readonly payload: unknown;

  private status: JobStatus;
  private attempt: number;
  private maxAttempts: number;
  private nextRunAt: Date;

  private executions: JobExecution[] = [];
  private readonly createdAt: Date;

  constructor(props: JobProps) {
    if (props.maxAttempts < 1) {
      throw new DomainError("maxAttempts must be >= 1");
    }

    this.id = props.id;
    this.jobKey = props.jobKey;
    this.type = props.type;
    this.payload = props.payload;

    this.status = JobStatus.PENDING;
    this.attempt = 0;
    this.maxAttempts = props.maxAttempts;
    this.nextRunAt = props.nextRunAt;
    this.createdAt = props.createdAt ?? new Date();

  }

  /* =====================
     Query methods
     ===================== */

  getStatus(): JobStatus {
    return this.status;
  }

  getAttempt(): number {
    return this.attempt;
  }

  getNextRunAt(): Date {
    return this.nextRunAt;
  }

  getExecutions(): readonly JobExecution[] {
    return this.executions;
  }

  getActiveExecution(): JobExecution | undefined {
    return this.executions.find(e => e.status === ExecutionStatus.RUNNING);
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getPayload(): unknown {
    return this.payload;
  }

  getJobKey(): string {
    return this.jobKey;
  }

  /* =====================
     Domain behavior
     ===================== */

  startExecution(startedAt: Date, executionId: string): void {
  if (this.status !== JobStatus.PENDING) {
    throw new Error("Job is not pending");
  }

  this.attempt += 1;

  this.status = JobStatus.RUNNING;

  this.executions.push({
    id: executionId,
    attempt: this.attempt,
    status: ExecutionStatus.RUNNING,
    startedAt,
  });
}


  completeExecution(now: Date): void {
    if (this.status !== JobStatus.RUNNING) {
      throw new DomainError("Job is not RUNNING");
    }

    const execution = this.getActiveExecution();
    if (!execution) {
      throw new DomainError("No active execution found");
    }

    execution.status = ExecutionStatus.COMPLETED;
    execution.finishedAt = now;

    this.status = JobStatus.COMPLETED;
  }

  failExecution(now: Date, error: string): void {
    if (this.status !== JobStatus.RUNNING) {
      throw new DomainError("Job is not RUNNING");
    }

    const execution = this.getActiveExecution();
    if (!execution) {
      throw new DomainError("No active execution found");
    }

    execution.status = ExecutionStatus.FAILED;
    execution.finishedAt = now;
    execution.error = error;

    if (this.attempt >= this.maxAttempts) {
      this.status = JobStatus.DEAD;
    } else {
      this.status = JobStatus.FAILED;
    }

  }

  scheduleRetry(nextRunAt: Date): void {
    if (this.status !== JobStatus.FAILED) {
      throw new Error("Can only retry a FAILED job");
    }


    this.status = JobStatus.PENDING;
    this.nextRunAt = nextRunAt;
  }
  
}
