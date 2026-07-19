type AuthButtonProps = {
  label: string;
  handler: () => void;
  additionalStyling?: string;
};

export default function AuthButton({
  label,
  handler,
  additionalStyling = "",
}: AuthButtonProps) {
  return (
    <button
      type="button"
      className={`w-full flex justify-center p-1.5 bg-linear-to-b from-black/80 to-black/85 text-white rounded-md cursor-pointer active:opacity-70 ${additionalStyling}`}
      onClick={handler}
    >
      <p className="text-[0.86rem]">{label}</p>
    </button>
  );
}
