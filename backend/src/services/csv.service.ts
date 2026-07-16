import Papa from "papaparse";

export function parseCSV(buffer: Buffer): Record<string, string>[] {
  const csvData = buffer.toString("utf-8");

  const result = Papa.parse<Record<string, string>>(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data;
}