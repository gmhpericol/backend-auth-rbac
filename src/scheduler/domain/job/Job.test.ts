import { describe, it, expect } from "vitest";
import { Job } from "./Job";
import { JobStatus } from "./JobStatus";

function createJob(overrides: Partial<any> = {}) {
  return new Job({
    id: "job-1",
    jobKey: "key-1",
    type: "SEND_EMAIL",
    payload: {},
    maxAttempts: 3,
    nextRunAt: new Date(),
    ...overrides,
  });
}

describe("Job domain", () => {
  it("starts in PENDING state", () => {
    const job = createJob();
    expect(job.getStatus()).toBe(JobStatus.PENDING);
  });

  it("can start execution from PENDING", () => {
    const job = createJob();
    job.startExecution(new Date(), "exec-1");

    expect(job.getStatus()).toBe(JobStatus.RUNNING);
    expect(job.getAttempt()).toBe(1);
  });

  it("cannot start execution twice", () => {
    const job = createJob();
    job.startExecution(new Date(), "exec-1");

    expect(() =>
      job.startExecution(new Date(), "exec-2")
    ).toThrow();
  });

  it("marks job as FAILED on execution failure", () => {
    const job = createJob();
    job.startExecution(new Date(), "exec-1");
    job.failExecution(new Date(), "boom");

    expect(job.getStatus()).toBe(JobStatus.FAILED);
  });

  it("becomes DEAD after exceeding max attempts", () => {
    const job = createJob({ maxAttempts: 1 });
    job.startExecution(new Date(), "exec-1");
    job.failExecution(new Date(), "boom");

    expect(job.canRetry()).toBe(false);
  });
});
