import { HomeListProps, HomeType } from "../type/homeType";
import { useStore } from "../store/homeStore";
import tableStyles from "@core/styles/table.module.css";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  Updater,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import classNames from "classnames";
import { ButtonOption } from "./btnOption";

type ListAction = HomeType & {
  action?: string;
};

const columnHelper = createColumnHelper<ListAction>();

const TableComponent = ({
  props,
  globalFilter,
  onGlobalFilterChange,
  loadHomeCall,
}: {
  props: HomeListProps;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  loadHomeCall?: any;
}) => {
  const { dictionary: dic } = props;
  const { homeList, loading, pageIndex, pageSize, count, setPagination } =
    useStore();

  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<ListAction, any>[]>(
    () => [
      columnHelper.accessor("_id", {
        header: () => (
          <div className="text-center font-bold text-[16px]">#</div>
        ),
        cell: ({ row }) => (
          <div className="text-l text-center text-blue-600">
            {row.index + 1}
          </div>
        ),
        size: 50,
        enableSorting: false,
      }),
      columnHelper.accessor("name", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.name}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left pl-4">
            <div className="font-medium text-l">{row?.original?.name || ""}</div>
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor("isActive", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic?.status}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <div className="font-medium text-l">
              {row?.original?.isActive || ""}
            </div>
          </div>
        ),
        size: 100,
      }),
      columnHelper.accessor("action", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic?.tableAction}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <ButtonOption props={props} currentToView={row.original} />
          </div>
        ),
        size: 100,
        enableSorting: false,
      }),
    ],
    [dic, props],
  );

  const table = useReactTable({
    data: homeList,
    columns,
    state: {
      rowSelection,
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(count / pageSize),
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPagination({ pageIndex: newPagination.pageIndex, pageSize: newPagination.pageSize });
    },
  });

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div>
          <div className="overflow-x-auto">
            <table className={`${tableStyles.table} w-full`}>
              <thead
                className="text-white"
                style={{ backgroundColor: "#2F57AB" }}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="h-[60px]" key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th key={header.id} className="relative">
                        {index < headerGroup.headers.length - 1 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[33%] w-px bg-white/30" />
                        )}
                        {header.isPlaceholder ? null : (
                          <div
                            className={classNames(
                              "flex items-center justify-center",
                              {
                                "cursor-pointer select-none":
                                  header.column.getCanSort(),
                              },
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr key="no-data">
                    <td
                      colSpan={table.getVisibleFlatColumns().length}
                      className="text-center py-8"
                    >
                      <div className="flex flex-col items-center text-gray-500">
                        <i className="tabler-database-off text-4xl mb-2"></i>
                        <span>{dic.noDataAvailable}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table
                    .getRowModel()
                    .rows.slice(0, table.getState().pagination.pageSize)
                    .map((row, index) => (
                      <tr
                        key={`home-row-${row?.original?._id || ""}-${index}`}
                        className={classNames(
                          { selected: row.getIsSelected() },
                          "even:bg-[#F3FAFB] hover:bg-[rgba(14,116,144,0.10)] transition-colors",
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={`home-cell-${cell.id}-${index}`}
                            className="py-3 px-1"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableComponent;
