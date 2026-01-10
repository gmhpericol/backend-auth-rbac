import { Job } from "../domain/job/Job.js";

export interface JobRepository {
  create(job: Job): Promise<void>;
  save(job: Job): Promise<void>;

  findById(id: string): Promise<Job | null>;
  findByJobKey(jobKey: string): Promise<Job | null>;
  findNextRunnable(now: Date): Promise<Job | null>;
}
