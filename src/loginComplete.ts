import type { ILoginData } from "./types/index";
import type { AxiosResponse } from "axios";
import { verifyLoginData } from "./api";
import { AuthenticationError } from "./exceptions";
import { publicDecrypt } from "crypto";
import { AUTH_PUBLIC_KEY } from "./constants";

function isLoginData(data: any): data is ILoginData {
  return data ? "email" in data && "clientAssertionResponse" in data : false;
}

export default async function (data: any, passwordlessPrivateKey: string) {
  if (!isLoginData(data)) {
    throw new AuthenticationError("Passed in data is not valid.");
  }

  let resp: AxiosResponse | null = null;
  try {
    resp = await verifyLoginData(data, passwordlessPrivateKey);
  } catch (err) {
    throw new AuthenticationError("API call failed.");
  }

  try {
    if (resp && resp.status === 200 && resp.data?.signedMessage) {
      const decrypted = publicDecrypt(
        AUTH_PUBLIC_KEY,
        Buffer.from(resp.data.signedMessage, "base64")
      );
      const signedDataEquals = decrypted.equals(Buffer.from(data.email));
      if (!signedDataEquals) {
        throw new AuthenticationError("Response data has been tampered with.");
      }

      return true;
    }
  } catch (err) {
    throw new AuthenticationError("Failed to verify API response.");
  }

  throw new AuthenticationError("Authentication failed for unknown reason.");
}
