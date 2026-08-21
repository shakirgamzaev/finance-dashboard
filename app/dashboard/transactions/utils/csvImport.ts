import type { TransactionPayload } from "@/app/models/transaction";
import type { CsvUpload } from "../uploadButton";

//TransactionPayload fields that can be filled from a CSV column;
//required ones mirror the backend TransactionCreate model (payee/amount/date non-nullable)
export const CSV_FIELD_OPTIONS = [
  { value: "date", label: "Date", required: true },
  { value: "payee", label: "Payee", required: true },
  { value: "amount", label: "Amount", required: true },
  { value: "notes", label: "Notes", required: false },
] as const;

export type CsvField = (typeof CSV_FIELD_OPTIONS)[number]["value"];

export const REQUIRED_CSV_FIELDS = CSV_FIELD_OPTIONS.filter(
  (option) => option.required,
);

//csv header -> payload field it fills; null means the column is skipped
export type CsvMapping = Record<string, CsvField | null>;

//labels of required fields not yet mapped to any CSV column
export function missingRequiredFields(mapping: CsvMapping): string[] {
  const mapped = new Set(Object.values(mapping));
  return CSV_FIELD_OPTIONS.filter(
    (option) => option.required && !mapped.has(option.value),
  ).map((option) => option.label);
}

//assign a field to a header, unassigning it from any other header first
export function assignField(
  mapping: CsvMapping,
  header: string,
  field: CsvField | null,
): CsvMapping {
  const next = { ...mapping };
  if (field != null) {
    for (const key of Object.keys(next)) {
      if (next[key] === field) next[key] = null;
    }
  }
  next[header] = field;
  return next;
}

export type CsvPayloadResult =
  | { ok: true; payloads: TransactionPayload[] }
  | { ok: false; error: string };

//build payloads from the mapped columns, validating the mapping first
export function buildCsvPayloads(
  upload: CsvUpload,
  mapping: CsvMapping,
  accountId: number,
  categoryId: number | null,
): CsvPayloadResult {
  //invert mapping: payload field -> csv header
  const headerByField = new Map<CsvField, string>();
  for (const [header, field] of Object.entries(mapping)) {
    if (field != null) headerByField.set(field, header);
  }
  const dateHeader = headerByField.get("date");
  const payeeHeader = headerByField.get("payee");
  const amountHeader = headerByField.get("amount");
  const notesHeader = headerByField.get("notes");

  if (!dateHeader || !payeeHeader || !amountHeader) {
    return {
      ok: false,
      error: "Please map the Date, Payee and Amount columns first",
    };
  }

  const payloads: TransactionPayload[] = [];
  for (const row of upload.rows) {
    const amount = Number(row[amountHeader]);
    //take the YYYY-MM-DD part of e.g. "2026-01-05 09:14:22"
    const date = (row[dateHeader] ?? "").trim().slice(0, 10);
    const payee = (row[payeeHeader] ?? "").trim();
    if (Number.isNaN(amount) || date === "" || payee === "") continue;
    payloads.push({
      accountId,
      categoryId,
      payee,
      amount,
      notes: notesHeader ? row[notesHeader]?.trim() || null : null,
      date,
    });
  }

  if (payloads.length === 0) {
    return { ok: false, error: "No valid rows found to import" };
  }
  return { ok: true, payloads };
}
