/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  publicRuntimeConfig: {
    // Exposing pusher env variables to the client
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
  },
};

export default config;
