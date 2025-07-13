import { api } from "../../app/api/api";
import { User } from "../../types/user";

export async function checkSession(): Promise<User | null> {
  try {
    const response = await api.get("/auth/session");
    return response.data;
  } catch (error) {
    return null;
  }
}
