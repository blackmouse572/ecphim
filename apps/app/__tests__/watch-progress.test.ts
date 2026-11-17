import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const save = vi.fn();
const get = vi.fn();

vi.mock("@/lib/watch-progress-cloud", () => ({
  saveWatchProgressToCloud: (...args: unknown[]) => save(...args),
  getCloudWatchProgress: (...args: unknown[]) => get(...args),
}));

const flushPromises = () => new Promise((r) => setTimeout(r, 0));

describe("watch progress", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    save.mockReset().mockResolvedValue({ signedIn: true, progress: null });
    get.mockReset().mockResolvedValue({ signedIn: true, progress: null });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test("saves finished episodes so they show as watched", async () => {
    const wp = await import("@/lib/watch-progress");
    wp.saveWatchProgress("m", "e1", { currentTime: 600, duration: 600 });
    const p = wp.getWatchProgress("m", "e1");
    expect(p?.watchedPercentage).toBe(100);
    expect(p && wp.isVideoWatched(p.currentTime, p.duration)).toBe(true);
    expect(p && wp.shouldRestoreProgress(p)).toBe(false);
  });

  test("embed visits are remembered for resume", async () => {
    const wp = await import("@/lib/watch-progress");
    wp.markEpisodeVisited("m", "e2");
    expect(wp.getResumeEpisode("m")?.episodeSlug).toBe("e2");
  });

  test("cloud sync is throttled and coalesced", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const sync = await import("@/lib/watch-progress-sync");
    sync.queueCloudSync("m", "e1", { currentTime: 10, duration: 600 });
    await flushPromises();
    expect(save).toHaveBeenCalledTimes(1);

    // Within the interval: queued, not sent.
    sync.queueCloudSync("m", "e1", { currentTime: 15, duration: 600 });
    sync.queueCloudSync("m", "e1", { currentTime: 20, duration: 600 });
    await flushPromises();
    expect(save).toHaveBeenCalledTimes(1);

    // Forced (pause): only the latest position goes out.
    sync.flushCloudSync();
    await flushPromises();
    expect(save).toHaveBeenCalledTimes(2);
    expect(save.mock.calls[1][2]).toMatchObject({ currentTime: 20 });
  });

  test("stops calling the server once it says the user is a guest", async () => {
    save.mockResolvedValue({ signedIn: false, progress: null });
    const sync = await import("@/lib/watch-progress-sync");
    sync.queueCloudSync("m", "e1", { currentTime: 10, duration: 600 });
    await flushPromises();
    sync.queueCloudSync(
      "m",
      "e1",
      { currentTime: 50, duration: 600 },
      { force: true },
    );
    await flushPromises();
    expect(save).toHaveBeenCalledTimes(1);
  });

  test("unload sends a beacon", async () => {
    const beacon = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "sendBeacon", {
      value: beacon,
      configurable: true,
    });
    const sync = await import("@/lib/watch-progress-sync");
    sync.queueCloudSync("m", "e1", { currentTime: 10, duration: 600 });
    await flushPromises();
    sync.queueCloudSync("m", "e1", { currentTime: 40, duration: 600 });
    sync.flushCloudSyncOnExit();
    expect(beacon).toHaveBeenCalledWith(
      "/watch-progress",
      JSON.stringify({
        movieSlug: "m",
        episodeSlug: "e1",
        currentTime: 40,
        duration: 600,
      }),
    );
  });

  test("hook writes locally at most every 5s and on pagehide", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { useWatchProgress } = await import("@/lib/use-watch-progress");
    const wp = await import("@/lib/watch-progress");
    const { result } = renderHook(() =>
      useWatchProgress({ movieSlug: "m", episodeSlug: "e1" }),
    );
    act(() =>
      result.current.updateProgress({ currentTime: 31, duration: 600 }),
    );
    expect(wp.getWatchProgress("m", "e1")?.currentTime).toBe(31);
    act(() =>
      result.current.updateProgress({ currentTime: 33, duration: 600 }),
    );
    expect(wp.getWatchProgress("m", "e1")?.currentTime).toBe(31);
    act(() => {
      window.dispatchEvent(new Event("pagehide"));
    });
    expect(wp.getWatchProgress("m", "e1")?.currentTime).toBe(33);
  });

  test("pushes a local position the cloud missed", async () => {
    const wp = await import("@/lib/watch-progress");
    wp.saveWatchProgress("m", "e1", { currentTime: 300, duration: 600 });
    get.mockResolvedValue({
      signedIn: true,
      progress: {
        currentTime: 100,
        duration: 600,
        updatedAt: new Date().toISOString(),
      },
    });
    const { useWatchProgress } = await import("@/lib/use-watch-progress");
    renderHook(() => useWatchProgress({ movieSlug: "m", episodeSlug: "e1" }));
    await act(flushPromises);
    await act(flushPromises);
    expect(save).toHaveBeenCalledWith("m", "e1", {
      currentTime: 300,
      duration: 600,
    });
  });
});
