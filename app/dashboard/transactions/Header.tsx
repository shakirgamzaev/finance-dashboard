import CustomButton from "@/app/_components/CustomButtons/CustomButton";
import UploadButton from "./uploadButton";

type HeaderProps = {
  setNewTransactionsOpened: (value: boolean) => void;
};

export default function Header({ setNewTransactionsOpened }: HeaderProps) {
  return (
    <div className="flex flex-col justify-center  gap-4 max-w-200 w-full lg:flex-row lg:justify-between lg:items-center">
      <h2 className="font-bold">Transactions page</h2>
      <div className="flex flex-col lg:flex-row gap-3">
        <CustomButton
          handler={() => setNewTransactionsOpened(true)}
          label="+ Add new"
          backgroundColor="bg-addAccount"
          extraCSS="lg:w-auto"
        />
        <UploadButton />
      </div>
    </div>
  );
}
