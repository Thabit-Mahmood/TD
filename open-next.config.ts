import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  overrides: {
    wrapper: {
      external: ["@libsql/client"],
    },
  },
});
