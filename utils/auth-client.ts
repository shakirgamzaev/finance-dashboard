
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// baseURL omitted — the auth server runs on the same domain (/api/auth)
export const authClient = createAuthClient({
    plugins: [
        jwtClient()
    ]
});

