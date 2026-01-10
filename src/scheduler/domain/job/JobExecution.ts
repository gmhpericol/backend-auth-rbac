import { ExecutionStatus } from "./ExecutionStatus.js";

export interface JobExecution {
  id: string;
  attempt: number;
  status: ExecutionStatus;
  startedAt: Date;
  finishedAt?: Date;
  error?: string;
}
