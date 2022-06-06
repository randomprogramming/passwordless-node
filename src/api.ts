import type { ILoginData } from "./types/index";
import axios from "axios";

const PASSWORDLESS_SERVER_BASE_URL = "http://localhost:3003";

export async function verifyLoginData(data: ILoginData) {
  return await axios.post(
    `${PASSWORDLESS_SERVER_BASE_URL}/api/assertion/complete`,
    { ...data }
  );
}
