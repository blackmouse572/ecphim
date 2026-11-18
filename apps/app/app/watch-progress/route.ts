// Beacon endpoint for saving watch progress on page unload.
//
// POST /watch-progress with a JSON body {movieSlug, episodeSlug, currentTime,
// duration}, sent as application/json or text/plain (navigator.sendBeacon).
// Auth is the better-auth session cookie. Lives outside /api because
// next.config rewrites /api/* to the movie API.
//
// 204 saved or skipped, 400 bad JSON or out-of-range input, 401 signed out.
import { currentUser } from "@repo/auth/server";
import { saveWatchProgressToCloud } from "@/lib/watch-progress-cloud";
import { parseWatchProgressInput } from "@/lib/watch-progress-input";

const MAX_BODY_BYTES = 2048;

const badRequest = (error: string) =>
  Response.json({ error }, { status: 400 });

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.text();

  if (raw.length > MAX_BODY_BYTES) {
    return badRequest("Payload too large");
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return badRequest("Invalid JSON");
  }

  const input = parseWatchProgressInput(body);

  if (!input) {
    return badRequest("Invalid payload");
  }

  const { movieSlug, episodeSlug, ...update } = input;
  await saveWatchProgressToCloud(movieSlug, episodeSlug, update);

  return new Response(null, { status: 204 });
}
