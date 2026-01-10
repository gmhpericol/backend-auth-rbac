import { describe, it, expect, vi } from "vitest";
import { JobService } from "./JobService.js";
import { Job } from "../../domain/job/Job.js";

function mockRepo() {
  return {
    findByJobKey: vi.fn(),
    findById: vi.fn(),
    findNextRunnable: vi.fn(),
    save: vi.fn(),
  };
}

describe("JobService", () => {
  it("creates job idempotently", async () => {
    const repo = mockRepo();
    repo.findByJobKey.mockResolvedValue(null);

    const service = new JobService(repo as any);

    const job = await service.createJob({
      jobKey: "key-1",
      type: "SEND_EMAIL",
      payload: {},
      maxAttempts: 3,
    });

    expect(repo.save).toHaveBeenCalledOnce();
    expect(job.getStatus()).toBe("PENDING");
  });

  it("returns existing job for same jobKey", async () => {
    const existing = new Job({
      id: "job-1",
      jobKey: "key-1",
      type: "SEND_EMAIL",
      payload: {},
      maxAttempts: 3,
      nextRunAt: new Date(),
    });

    const repo = mockRepo();
    repo.findByJobKey.mockResolvedValue(existing);

    const service = new JobService(repo as any);

    const job = await service.createJob({
      jobKey: "key-1",
      type: "SEND_EMAIL",
      payload: {},
      maxAttempts: 3,
    });

    expect(repo.save).not.toHaveBeenCalled();
    expect(job).toBe(existing);
  });
});
