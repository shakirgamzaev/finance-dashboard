type InputFieldProps = {
  gap: number;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholderText?: string;
  extraCSS?: string;
};

export default function InputField(fieldProps: InputFieldProps) {
  return (
    <div
      style={{ gap: `${fieldProps.gap}px` }}
      className={`flex flex-col w-full ${fieldProps.extraCSS ?? ""}`}
    >
      <p className="text-[0.78rem] md:text-[0.9rem]">{fieldProps.label}</p>
      <input
        type={fieldProps.type}
        value={fieldProps.value}
        placeholder={fieldProps.placeholderText}
        onChange={(e) => fieldProps.onChange(e.target.value)}
        className={`rounded-md p-1 border-[1.4px] border-[rgba(0,0,0,0.1)] shadow-xs text-[14px] `}
      />
    </div>
  );
}
