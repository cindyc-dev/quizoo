import crypto from "crypto";
import { env } from "~/env";

interface generateAuthSigProps {
  requestMethod: "POST" | "GET";
  requestPath: string;
  queryParameters: string;
}

/**
 * Reference: https://pusher.com/docs/channels/library_auth_reference/rest-api/#generating-authentication-signatures
 */
export const getHttpUrl = ({
  requestMethod,
  requestPath,
  queryParameters,
}: generateAuthSigProps) => {
  const defaultParams = {
    auth_key: env.PUSHER_APP_KEY,
    auth_timestamp: Math.floor(Date.now() / 1000),
    auth_version: "1.0",
  };
  const params = `auth_key=${defaultParams.auth_key}&auth_timestamp=${defaultParams.auth_timestamp}&auth_version=${defaultParams.auth_version}&${queryParameters}`;

  const stringToSign = `${requestMethod}\n${requestPath}\n${params}`;

  const signature = generateHmacSha256(env.PUSHER_APP_SECRET, stringToSign);

  return `http://api-${env.PUSHER_APP_CLUSTER}.pusher.com${requestPath}?${params}&auth_signature=${signature}`;
};

const generateHmacSha256 = (
  secretKey: string,
  stringToSign: string,
): string => {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(stringToSign);
  const digest = hmac.digest("hex");
  return digest;
};
