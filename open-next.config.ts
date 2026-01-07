import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  cloudflare: {
    overrides: {
      wrapper: {
        external: ["@libsql/client"],
      },
    },
  },
});
