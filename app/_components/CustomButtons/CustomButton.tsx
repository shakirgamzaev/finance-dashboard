type CustomBtnProps = {
    handler: () => void;
    backgroundColor: string
    label: string
}


export default function CustomButton(props: CustomBtnProps) {
    return (
        <button
        type="button"
        onClick={() => props.handler()}
        className={`p-2 ${props.backgroundColor} rounded-md cursor-pointer w-full max-w-[600px] active:opacity-80`}
      >
        <p className="text-[0.9rem] text-white ">{props.label}</p>
      </button>
    )
}