"use client";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCSVReader } from "react-papaparse";
import CustomButton from "@/app/_components/CustomButtons/CustomButton";

export default function UploadButton() {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: { data: string[][] }) => {
        // TODO: map parsed rows to transactions and send to the backend
        console.log(results.data);
      }}
    >
      {({ getRootProps }: { getRootProps: () => Record<string, unknown> }) => (
        <div {...getRootProps()} className="lg:w-auto">
          <CustomButton
            handler={() => {}}
            label={
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faUpload} className="size-3.5" />
                <span>Upload</span>
              </div>
            }
            backgroundColor="bg-addAccount"
            extraCSS="lg:w-auto"
          />
        </div>
      )}
    </CSVReader>
  );
}
