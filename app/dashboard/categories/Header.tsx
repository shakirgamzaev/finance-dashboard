import CustomButton from "@/app/_components/CustomButtons/CustomButton";

type HeaderProps = {
  setNewCategoriesOpened: (value: boolean) => void;
};

export default function Header({ setNewCategoriesOpened }: HeaderProps) {
  return (
    <div className="flex flex-col justify-center  gap-4 max-w-200 w-full lg:flex-row lg:justify-between lg:items-center">
      <h2 className="font-bold">Categories page</h2>
      <CustomButton
        handler={() => setNewCategoriesOpened(true)}
        label="+ Add new"
        backgroundColor="bg-addAccount"
        extraCSS="lg:w-auto"
      />
    </div>
  );
}
