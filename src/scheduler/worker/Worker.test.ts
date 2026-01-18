import { describe, it, expect, vi } from "vitest";
import { Worker } from "./Worker.js";

describe("Worker", () => {
  it("executes and completes a job", async () => {
    const service = {
      startNextJob: vi.fn(),
      completeJob: vi.fn(),
      failJob: vi.fn(),
      scheduleRetry: vi.fn(),
    };

    const executor = {
      execute: vi.fn(),
    };

    service.startNextJob.mockResolvedValue({
      id: "job-1",
    });

    const worker = new Worker(service as any, executor as any);
    await worker.tickOnce();

    expect(executor.execute).toHaveBeenCalled();
    expect(service.completeJob).toHaveBeenCalled();
  });
});
