"use client";
import React, { useMemo } from "react";
import tableStyles from "@core/styles/table.module.css";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableListProps, TableType, TableStatus } from "../../type/tableType";
import { Collapse, TablePagination } from "@mui/material";
import { useTableStore } from "../../store/tableStore";
import classNames from "classnames";
import TableFetchPaginationComponent from "@/components/TableFetchPaginationComponent";
import LineLoader from "@/components/loading/line/LineLoader";
import { ButtonOption } from "./btnOption";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import CustomChip from "@/@core/components/mui/Chip";

const columnHelper = createColumnHelper<TableType>();

const TableComponent = ({
  props,
  onRefresh,
  onEditClick,
}: {
  props: TableListProps;
  onRefresh: () => Promise<void>;
  onEditClick?: (item: TableType) => void;
}) => {
  const { dictionary: dic } = props;
  const labels = dic.tablePage;

  const tableScrollRef = useDragToScroll<HTMLDivElement>();

  const {
    tableList,
    count,
    pageIndex,
    pageSize,
    isActive,
    keyword,
    selectedZone,
    setPagination,
    loading,
    zoneList,
  } = useTableStore();

  const getZoneName = (zoneId?: string) => {
    if (!zoneId) return "-";
    const zone = zoneList.find((z) => z._id === zoneId);
    return zone ? zone.name : zoneId;
  };

  const getTableStatusChip = (status: TableStatus) => {
    switch (status) {
      case "available":
        return (
          <CustomChip
            round="true"
            size="small"
            variant="tonal"
            color="success"
            label={labels.statusAvailable}
            icon={<i className="tabler-circle-check text-[14px]" />}
          />
        );
      case "occupied":
        return (
          <CustomChip
            round="true"
            size="small"
            variant="tonal"
            color="error"
            label={labels.statusOccupied}
            icon={<i className="tabler-user-check text-[14px]" />}
          />
        );
      case "reserved":
        return (
          <CustomChip
            round="true"
            size="small"
            variant="tonal"
            color="warning"
            label={labels.statusReserved}
            icon={<i className="tabler-clock text-[14px]" />}
          />
        );
      default:
        return <CustomChip size="small" label={status} />;
    }
  };

  const columns = useMemo<ColumnDef<TableType, any>[]>(
    () => [
      columnHelper.accessor("_id", {
        size: 5,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">#</div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium text-blue-600 text-[15px]">
            {row.index + 1 + pageIndex * pageSize}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("number", {
        size: 20,
        header: () => (
          <div className="text-left font-bold text-[14px] text-white pl-2">
            {labels.number}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              <i className="tabler-armchair text-[18px]" />
            </div>
            <span className="font-semibold text-gray-800 text-[15px]">
              {row.original.number}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("zoneId", {
        size: 20,
        header: () => (
          <div className="text-left font-bold text-[14px] text-white">
            {labels.zone}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
            <i className="tabler-map-pin text-[16px] text-gray-400" />
            <span>{getZoneName(row.original.zoneId)}</span>
          </div>
        ),
      }),
      columnHelper.accessor("capacity", {
        size: 15,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.capacity}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1 text-gray-700">
            <i className="tabler-users text-[16px] text-gray-400" />
            <span className="font-semibold">{row.original.capacity || 0}</span>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        size: 15,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.status}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            {getTableStatusChip(row.original.status)}
          </div>
        ),
      }),
      columnHelper.accessor("isActive", {
        size: 15,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {dic.status}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <CustomChip
              round="true"
              size="small"
              variant="tonal"
              color={row.original.isActive === "inactive" ? "secondary" : "primary"}
              label={
                row.original.isActive === "inactive"
                  ? dic["inactive"]
                  : dic["active"]
              }
            />
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        size: 10,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.actions}
          </div>
        ),
        cell: ({ row }) => (
          <ButtonOption
            props={props}
            currentToView={row.original}
            onEditClick={onEditClick}
          />
        ),
      }),
    ],
    [pageIndex, pageSize, labels, dic, zoneList, onRefresh, onEditClick, props]
  );

  const table = useReactTable({
    data: tableList ?? [],
    columns,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(count / pageSize),
    getCoreRowModel: getCoreRowModel(),
  });

  const onSelectChangePageIndex = async (page: number) => {
    setPagination({
      pageIndex: page - 1,
      pageSize,
      isActive,
      keyword,
      selectedZone,
    });
    await onRefresh();
  };

  const onSelectChangePageSize = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPagination({
      pageIndex: 0,
      pageSize: Number(event?.target?.value),
      isActive,
      keyword,
      selectedZone,
    });
    await onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div>
        <Collapse in={loading}>
          <LineLoader />
        </Collapse>

        <div
          ref={tableScrollRef}
          className="overflow-x-auto cursor-grab active:cursor-grabbing select-none"
        >
          <table className={classNames(tableStyles.table, "w-full")}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={`table-header-${headerGroup.id}`}
                  style={{ backgroundColor: "#2F57AB" }}
                  className="border-b"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={`table-header-cell-${header.id}`}
                      style={{
                        width: header.column.getSize(),
                        minWidth: `${header.column.columnDef.minSize}px`,
                      }}
                      className="py-4 px-3 text-white font-semibold text-[14px]"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {(!tableList || tableList.length === 0) ? (
              <tbody>
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-16 text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <i className="tabler-armchair-off text-5xl text-gray-300" />
                      <span className="text-base font-medium">
                        {labels.noData}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={`table-row-${row.id}-${index}`}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={`table-cell-${cell.id}-${index}`}
                        className="py-3 px-1"
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
            )}
          </table>
        </div>

        {count > 0 ? (
          <div className="mt-4 px-6 pb-4">
            <TablePagination
              component={() => (
                <TableFetchPaginationComponent
                  table={table}
                  count={count}
                  dictionary={dic}
                  onPageChange={async (page) => {
                    await onSelectChangePageIndex(page);
                  }}
                  cb={onSelectChangePageSize}
                />
              )}
              count={count}
              rowsPerPage={pageSize}
              page={pageIndex}
              onPageChange={(_, page) => {
                table.setPageIndex(page);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TableComponent;
