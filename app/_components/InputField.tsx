type InputFieldProps = {
  gap: number;
  label: string;
  type: string
};

export default function InputField(fieldProps: InputFieldProps) {
  return (
    <div style={{ gap: `${fieldProps.gap}px` }} className="flex flex-col w-full">
      <p className="text-[0.78rem] md:text-[0.9rem]">{fieldProps.label}</p>
      <input type={fieldProps.type} className="rounded-md p-1 border-[1.4px] border-[rgba(0,0,0,0.1)] shadow-xs" />
    </div>
  );
}
