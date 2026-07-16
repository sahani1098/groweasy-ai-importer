"use client";

interface PreviewTableProps {
  data: Record<string, string>[];
}

export default function PreviewTable({ data }: PreviewTableProps) {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Title */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">
          📄 CSV Preview
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[500px]">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-3 text-left font-semibold whitespace-nowrap border-b border-blue-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="even:bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-5 py-3 whitespace-nowrap border-b border-gray-200 text-gray-700"
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}