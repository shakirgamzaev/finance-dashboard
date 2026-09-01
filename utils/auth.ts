import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import {Pool} from "pg"

export const auth = betterAuth({
   baseURL: process.env.BETTER_AUTH_URL,
   database: new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_DATABASENAME,
        options: "-c search_path=authentication,public"
   }),
   emailAndPassword: {
    enabled: true
   },
   account: {
      accountLinking: {
         trustedProviders: ["google"],
      },
   },
   socialProviders: {
      google: {
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
   },
   plugins: [
      jwt()
   ]
});