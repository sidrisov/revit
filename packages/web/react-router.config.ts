import type { Config } from "@react-router/dev/config";

export default {
  // Set the app directory to src instead of default app/
  appDirectory: "src",
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;
