import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import {Pool} from "pg"

export const auth = betterAuth({
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
   plugins: [
      jwt()
   ]
});