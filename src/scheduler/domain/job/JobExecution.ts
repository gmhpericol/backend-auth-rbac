import { ExecutionStatus } from "./ExecutionStatus";

export interface JobExecution {
  id: string;
  attempt: number;
  status: ExecutionStatus;
  startedAt: Date;
  finishedAt?: Date;
  error?: string;
}
