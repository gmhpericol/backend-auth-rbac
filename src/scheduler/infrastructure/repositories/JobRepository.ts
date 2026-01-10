import { Job } from "../../domain/job/Job.js";

export interface JobRepository {
  findNextRunnable(now: Date): unknown;
  findById(id: string): Promise<Job | null>;
  findByJobKey(jobKey: string): Promise<Job | null>;
  save(job: Job): Promise<void>;
}
