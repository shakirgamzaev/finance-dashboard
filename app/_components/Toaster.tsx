export default function Toaster({
  isShown,
  children,
}: {
  isShown: boolean;
  children: React.ReactNode;
}) {
  return (
    <output
      className={`fixed bottom-10 right-4 z-50 block w-[95%] max-w-[200px] rounded-md bg-green-600 px-4 py-3 text-[0.85rem] text-white shadow-lg transition-transform duration-300 ease-in-out ${
        isShown ? "translate-y-0" : "translate-y-[calc(100%+40px)]"
      }`}
    >
      {children}
    </output>
  );
}
