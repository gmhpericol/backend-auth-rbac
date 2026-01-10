import { Job } from "../domain/job/Job";

export interface JobRepository {
  findById(id: string): Promise<Job | null>;
  findByJobKey(jobKey: string): Promise<Job | null>;
  findNextRunnable(now: Date): Promise<Job | null>;
  save(job: Job): Promise<void>;
}
