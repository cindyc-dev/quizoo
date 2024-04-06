export const getPusherEnvVars = () => {
  const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const appCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
  if (appKey && appCluster) {
    return {
      appKey,
      appCluster,
    };
  }
  console.error("Pusher Environment Variables Not Found!");
  throw Error("Pusher Environment Variables Not Found!");
};