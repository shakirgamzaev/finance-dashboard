import { authClient } from "../auth-client";

export async function LogOut() {
    await authClient.signOut()
}