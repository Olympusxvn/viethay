// Generates a cohesive >=30s product ad as 4 PixVerse shots via the CLI,
// then writes the real shot URLs to web/public/demo-reel.json for the app.
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../web/public/demo-reel.json");

const SHOTS = [
  {
    title: "Hook",
    prompt:
      "Cinematic vertical product ad, extreme close-up of a frosted glass bottle of Vietnamese cold-brew coffee on a marble cafe table, warm morning sunlight, condensation droplets sliding down, slow push-in, shallow depth of field, premium commercial look",
  },
  {
    title: "Product action",
    prompt:
      "Vertical commercial shot, dark rich cold-brew coffee pouring over clear ice cubes into a glass, dynamic splash, slow motion, warm backlight, appetizing food cinematography, high detail",
  },
  {
    title: "Lifestyle",
    prompt:
      "Vertical lifestyle ad, a young Vietnamese woman smiling and sipping iced cold-brew coffee at a cozy Saigon cafe, soft natural light, bokeh background, gentle camera movement, commercial look",
  },
  {
    title: "CTA hero",
    prompt:
      "Vertical hero shot of a Vietnamese cold-brew coffee bottle standing on a table with warm rim light, brand-style background, subtle sparkle, upbeat energetic ending, product centered and clearly visible",
  },
];

const COMMON =
  '--model v6 --quality 720p --aspect-ratio 9:16 --duration 8 --no-audio --json';

const results = [];

for (let i = 0; i < SHOTS.length; i++) {
  const shot = SHOTS[i];
  console.error(`[${i + 1}/${SHOTS.length}] Generating: ${shot.title}...`);
  const out = execSync(
    `pixverse create video --prompt "${shot.prompt}" ${COMMON}`,
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }
  );
  const data = JSON.parse(out);
  results.push({
    title: shot.title,
    prompt: shot.prompt,
    videoUrl: data.video_url,
    coverUrl: data.cover_url,
    duration: data.duration,
    model: data.model,
    cost: data.cost_credits ?? 0,
  });
  console.error(`   done: ${data.video_url} (${data.cost_credits ?? 0} credits)`);
}

const totalDuration = results.reduce((s, r) => s + (r.duration || 0), 0);
const totalCost = results.reduce((s, r) => s + (r.cost || 0), 0);

const payload = {
  product: "Vietnamese Cold-Brew Coffee",
  generatedAt: new Date().toISOString(),
  totalDuration,
  totalCost,
  shots: results,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(payload, null, 2));
console.error(`\nWrote ${OUT}`);
console.error(`Total: ${totalDuration}s across ${results.length} shots, ${totalCost} credits`);
