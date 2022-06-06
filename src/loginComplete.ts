import type { ILoginData } from "./types/index";
import { verifyLoginData } from "./api";
import { AuthenticationError } from "./exceptions";

function isLoginData(data: any): data is ILoginData {
  return data ? "email" in data && "clientAssertionResponse" in data : false;
}

export default async function (data: any) {
  if (!isLoginData(data)) {
    throw new Error("TODO: Add proper error");
  }

  try {
    const resp = await verifyLoginData(data);
    if (resp && resp.status === 200) {
      // TODO: Verify signature
      return true;
    }
  } catch (err) {
    throw new AuthenticationError("API call failed.");
  }

  throw new AuthenticationError("Authentication failed for unknown reason.");
}
