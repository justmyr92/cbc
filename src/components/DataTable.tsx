import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    PaginationState,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

type DataTableProps = {
    data: any[]; // Specify your data type here
    columns: any[]; // You can further define this based on your column structure
};

const DataTable = ({ data, columns }: DataTableProps) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });
    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
    });

    return (
        <>
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full border-collapse border border-gray-300 bg-white table table-zebra table-lg">
                    <thead className="bg-amber-600 text-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border border-gray-300 px-4 py-2 text-left font-semibold uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="border border-gray-300 px-4 py-2 text-gray-700"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between my-4">
                <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            className="border border-gray-300 rounded p-2 hover:bg-gray-200 transition duration-150"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<<"}
                        </button>
                        <button
                            className="border border-gray-300 rounded p-2 hover:bg-gray-200 transition duration-150"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<"}
                        </button>
                        <button
                            className="border border-gray-300 rounded p-2 hover:bg-gray-200 transition duration-150"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {">"}
                        </button>
                        <button
                            className="border border-gray-300 rounded p-2 hover:bg-gray-200 transition duration-150"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            {">>"}
                        </button>
                    </div>
                    <span className="flex items-center gap-2">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </strong>
                    </span>
                </div>
                <div className="flex gap-3">
                    <span className="flex items-center gap-2">
                        | Go to page:
                        <input
                            type="number"
                            min="1"
                            max={table.getPageCount()}
                            defaultValue={
                                table.getState().pagination.pageIndex + 1
                            }
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                table.setPageIndex(page);
                            }}
                            className="border border-gray-300 p-1 rounded w-16"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="border border-gray-300 rounded p-1"
                    >
                        {[25, 50, 75, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="text-gray-600">
                {table.getRowModel().rows.length} Rows
            </div>
        </>
    );
};

export default DataTable;
