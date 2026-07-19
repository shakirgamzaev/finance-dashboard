
import Image from "next/image";
import googleLogo from "@/public/googleLogo.svg.webp";


export default function GoogleSignInBtn({ handler }: { handler: () => void }) {
  return (
    <button
      type="button"
      onClick={handler}
      className="flex items-center justify-center gap-2 w-full p-1.5 cursor-pointer rounded-[8px] shadow-sm border-1 border-[rgba(0,0,0,0.15)] active:opacity-70" 
    >
      <Image src={googleLogo} alt="Google logo" className="w-4 h-auto lg:w-5" />
      <p className="text-[0.8rem] text-textGray font-semibold lg:text-[0.9rem]">Continue with Google</p>
    </button>
  );
}
