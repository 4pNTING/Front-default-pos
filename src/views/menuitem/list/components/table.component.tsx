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
import { MenuItemListProps, MenuItemType } from "../../type/menuItemType";
import { Avatar, Collapse, TablePagination } from "@mui/material";
import { useMenuItemStore } from "../../store/menuItemStore";
import classNames from "classnames";
import TableFetchPaginationComponent from "@/components/TableFetchPaginationComponent";
import LineLoader from "@/components/loading/line/LineLoader";
import { ButtonOption } from "./btnOption";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import { IEntityStatus } from "@/utils/base";
import CustomChip from "@/@core/components/mui/Chip";

const columnHelper = createColumnHelper<MenuItemType>();

const TableComponent = ({
  props,
  onRefresh,
  onEditClick,
}: {
  props: MenuItemListProps;
  onRefresh: () => Promise<void>;
  onEditClick?: (item: MenuItemType) => void;
}) => {
  const { dictionary: dic } = props;
  const labels = dic.menuItemPage;

  const tableScrollRef = useDragToScroll<HTMLDivElement>();

  const {
    menuItemList,
    count,
    pageIndex,
    pageSize,
    isActive,
    keyword,
    selectedCategory,
    setPagination,
    loading,
    categoryList,
  } = useMenuItemStore();

  const getBackendBaseUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
    if (apiUrl.includes("/api-gateway")) {
      return apiUrl.replace("/api-gateway", "");
    }
    return apiUrl;
  };

  const resolveImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return "";
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      return photoUrl;
    }
    return `${getBackendBaseUrl()}${photoUrl}`;
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "-";
    const cat = categoryList.find((item: any) => item._id === categoryId);
    return cat ? cat.name : categoryId;
  };

  const columns = useMemo<ColumnDef<MenuItemType, any>[]>(
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
      columnHelper.accessor("photo", {
        size: 8,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.image}
          </div>
        ),
        cell: ({ row }) => {
          const imgUrl = resolveImageUrl(row.original.photo);
          return (
            <div className="flex justify-center">
              {imgUrl ? (
                <Avatar
                  src={imgUrl}
                  alt={row.original.name}
                  variant="rounded"
                  sx={{ width: 44, height: 44, borderRadius: "8px" }}
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "8px",
                    bgcolor: "rgba(10, 57, 129, 0.1)",
                    color: "#0A3981",
                  }}
                >
                  <i className="tabler-meat text-[22px]" />
                </Avatar>
              )}
            </div>
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor("name", {
        size: 25,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.name}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-semibold text-gray-800 text-[15px]">
            {row.original.name}
          </div>
        ),
      }),
      columnHelper.accessor("categoryId", {
        size: 15,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.category}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <CustomChip
              size="small"
              round="true"
              variant="tonal"
              label={getCategoryName(row.original.categoryId)}
              color="info"
              sx={{ fontWeight: 500 }}
            />
          </div>
        ),
      }),
      columnHelper.accessor("price", {
        size: 15,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.price} ({labels.currency})
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-bold text-[#0A3981] text-[15px]">
            {Number(row.original.price ?? 0).toLocaleString()} ₭
          </div>
        ),
      }),
      columnHelper.accessor("description", {
        size: 20,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {labels.description}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center text-gray-600 text-sm line-clamp-2 px-2">
            {row.original.description || "-"}
          </div>
        ),
      }),
      columnHelper.accessor("isActive", {
        size: 12,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {dic.status}
          </div>
        ),
        cell: ({ row }) => {
          const isItemActive = row.original.isActive !== IEntityStatus.inactive;
          return (
            <div className="flex justify-center">
              <CustomChip
                size="small"
                round="true"
                variant="tonal"
                label={isItemActive ? dic.active : dic.inactive}
                color={isItemActive ? "success" : "secondary"}
                sx={{ fontWeight: 600 }}
              />
            </div>
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor("action" as any, {
        size: 10,
        header: () => (
          <div className="text-center font-bold text-[16px] text-white flex justify-center pr-6">
            {dic.action}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center pr-6">
            <ButtonOption
              props={props}
              currentToView={row.original}
              onEditClick={onEditClick}
              onRefresh={onRefresh}
            />
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [labels, dic, pageIndex, pageSize, categoryList, onRefresh, onEditClick, props],
  );

  const table = useReactTable({
    data: menuItemList ?? [],
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
      selectedCategory,
    });
    await onRefresh();
  };

  const onSelectChangePageSize = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPagination({
      pageIndex: 0,
      pageSize: Number(event?.target?.value),
      isActive,
      keyword,
      selectedCategory,
    });
    await onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div>
        <div ref={tableScrollRef} className="overflow-x-auto">
          <Collapse unmountOnExit={true} orientation="vertical" in={loading}>
            <LineLoader />
          </Collapse>

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
                        <div className="flex items-center justify-center">
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

            {(!menuItemList || menuItemList.length === 0) ? (
              <tbody>
                <tr key="no-data">
                  <td
                    colSpan={columns.length}
                    className="text-center py-8"
                  >
                    <div className="flex flex-col items-center text-gray-500">
                      <i className="tabler-database-off text-4xl mb-2"></i>
                      <span>{labels.noData}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={`menuitem-row-${row?.original?._id ?? ""}-${index}`}
                    className={classNames(
                      "even:bg-[#F3FAFB] hover:bg-[rgba(14,116,144,0.10)] transition-colors",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={`menuitem-cell-${cell.id}-${index}`}
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
