"use client";

interface ResultTableProps {
  data: any[];
}

export default function ResultTable({ data }: ResultTableProps) {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="mt-8 overflow-auto max-h-[500px] border rounded-xl">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 bg-green-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border px-4 py-2 text-left whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header}
                  className="border px-4 py-2 whitespace-nowrap"
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}