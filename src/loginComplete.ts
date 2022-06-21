import type { ILoginData } from "./types/index";
import type { AxiosResponse } from "axios";
import { verifyLoginData } from "./api";
import { AuthenticationError } from "./exceptions";
import { publicDecrypt } from "crypto";
import { AUTH_PUBLIC_KEY } from "./constants";

function isLoginData(data: any): data is ILoginData {
  return data ? "email" in data && "clientAssertionResponse" in data : false;
}

function getAuthKeyFromB64(b64: string): string {
  return Buffer.from(b64, "base64").toString();
}

interface Options {
  authPublicKey?: string;
  customServerBaseUrl?: string;
}

export default async function (
  data: any,
  passwordlessPrivateKey: string,
  options?: Options
) {
  if (!isLoginData(data)) {
    throw new AuthenticationError("Passed in data is not valid.");
  }

  let resp: AxiosResponse | null = null;
  try {
    resp = await verifyLoginData(
      data,
      passwordlessPrivateKey,
      options?.customServerBaseUrl
    );
  } catch (err) {
    throw new AuthenticationError("API call failed.");
  }

  if (resp && resp.status === 200 && resp.data?.signedMessage) {
    const decrypted = publicDecrypt(
      getAuthKeyFromB64(options?.authPublicKey || AUTH_PUBLIC_KEY),
      Buffer.from(resp.data.signedMessage, "base64")
    );
    const signedDataEquals = decrypted.equals(Buffer.from(data.email));
    if (!signedDataEquals) {
      throw new AuthenticationError("Response data has been tampered with.");
    }

    return true;
  }

  throw new AuthenticationError("Failed to authenticate user.");
}
