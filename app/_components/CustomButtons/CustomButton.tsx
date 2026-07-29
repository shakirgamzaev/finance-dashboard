type CustomBtnProps = {
  handler: () => void;
  backgroundColor: string;
  label: React.ReactNode;
  disabled?: boolean;
  extraCSS?: string;
};

export default function CustomButton(props: CustomBtnProps) {
  return (
    <button
      type="button"
      onClick={() => props.handler()}
      disabled={props.disabled}
      className={`p-2 ${props.backgroundColor} rounded-md cursor-pointer w-full active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${props.extraCSS ?? ""}`}
    >
      <div className="text-[0.9rem] text-white ">{props.label}</div>
    </button>
  );
}
