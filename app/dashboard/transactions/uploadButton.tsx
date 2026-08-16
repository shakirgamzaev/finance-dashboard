"use client";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCSVReader } from "react-papaparse";
import CustomButton from "@/app/_components/CustomButtons/CustomButton";

//parsed CSV contents: header names in file order + one object per row keyed by header
export type CsvUpload = {
  headers: string[];
  rows: Record<string, string>[];
};

type UploadButtonProps = {
  onUploaded: (upload: CsvUpload) => void;
};

export default function UploadButton({ onUploaded }: UploadButtonProps) {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      config={{ header: true, skipEmptyLines: true }}
      onUploadAccepted={(results: {
        data: Record<string, string>[];
        meta: { fields?: string[] };
      }) => {
        onUploaded({
          headers: results.meta.fields ?? Object.keys(results.data[0] ?? {}),
          rows: results.data,
        });
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
