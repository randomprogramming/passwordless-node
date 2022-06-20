import type { ILoginData } from "./types/index";
import axios from "axios";
import { PASSWORDLESS_SERVER_BASE_URL } from "./constants";

export async function verifyLoginData(
  data: ILoginData,
  privateKey: string,
  customServerBaseUrl?: string
) {
  return await axios.post(
    `${customServerBaseUrl || PASSWORDLESS_SERVER_BASE_URL}/assertion/complete`,
    { ...data },
    {
      headers: {
        Authorization: `Basic ${privateKey}`,
      },
    }
  );
}
