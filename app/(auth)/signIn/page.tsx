
import Link from "next/link"

export default function SignIn() {
    return (
        <div className=" flex flex-col items-center gap-3">
            <h1 className="text-2xl">Sign in page</h1>
            <Link href="/signUp">Sign Up</Link>
        </div>
    )
}