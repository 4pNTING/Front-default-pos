import { rankItem } from "@tanstack/match-sorter-utils";
import tableStyles from "@core/styles/table.module.css";
import {
  ColumnDef,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { RoomAreaListProps, RoomAreaType } from "../type/roomAreaType";
import { Button, Collapse, TablePagination, Chip } from "@mui/material";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useStore } from "../store/roomAreaStore";
import classNames from "classnames";
import TableFetchPaginationComponent from "@/components/TableFetchPaginationComponent";
import LineLoader from "@/components/loading/line/LineLoader";
import { useSession } from "next-auth/react";
import {
  IRoleConfigLevel,
  getCurrencyColor,
  formatCurrency,
} from "@/utils/base";
import { formatAmount } from "@/utils/formatUtils";
import { ToastContainer, toast } from "react-toastify";
import { ButtonOption } from "./btnOption";
import {
  getHoldStatusInfo,
  getAgentHoldStatusInfo,
  StatusBadge,
} from "@/utils/StatusBadge";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import { IRoomAreaSortField } from "@/utils/enumSortField";
import {
  initializeSortingState,
  createSortingChangeHandler,
} from "@/utils/sortUtils";

type ListAction = RoomAreaType & {
  action?: string;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const columnHelper = createColumnHelper<ListAction>();

const TableComponent = ({
  props,
  globalFilter,
  onGlobalFilterChange,
  loadRoomAreaCall,
}: {
  props: RoomAreaListProps;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  loadRoomAreaCall: any;
}) => {
  // Var
  const { lang, dictionary: dic } = props;

  // States
  const [rowSelection, setRowSelection] = useState({});

  // Drag to scroll hook
  const tableScrollRef = useDragToScroll<HTMLDivElement>();

  // Hooks
  const {
    loading,
    pageIndex,
    pageSize,
    count,
    isActive,
    selectedZoneId,
    selectedCategoryId,
    sortField,
    sortOrder,
    setPagination,
    setSorting,
    loadRoomAreaAPI,
    roomAreaList,
    toggleCreateComponent,
    setToggleCreateComponent,
    zoneList,
    categoryList,
  } = useStore();

  // Map column IDs to IRoomAreaSortField enum values
  const columnToSortFieldMap: Record<string, IRoomAreaSortField> = useMemo(
    () => ({
      name: IRoomAreaSortField.name,
      zone: IRoomAreaSortField.zoneName,
      roomAreaCategory: IRoomAreaSortField.roomAreaCategoryName,
      totalArea: IRoomAreaSortField.totalArea,
      amount: IRoomAreaSortField.amount,
      totalAmount: IRoomAreaSortField.totalAmount,
      status: IRoomAreaSortField.status,
      uniqueId: IRoomAreaSortField.uniqueId,
      createdAt: IRoomAreaSortField.createdAt,
      updatedAt: IRoomAreaSortField.updatedAt,
    }),
    [],
  );

  // Initialize sorting state from store
  const [sorting, setSortingState] = useState<SortingState>(() =>
    initializeSortingState(sortField, sortOrder, columnToSortFieldMap),
  );

  // Handle sorting change
  const handleSortingChange = useCallback(
    createSortingChangeHandler({
      columnToSortFieldMap,
      setSortingState,
      setSorting,
      loadAPI: async () => {
        await loadRoomAreaAPI({
          props: {
            dictionary: dic,
            query: loadRoomAreaCall,
          },
        });
      },
      onError: (error) => toast.error(error.message),
    }),
    [columnToSortFieldMap, dic, loadRoomAreaCall, loadRoomAreaAPI, setSorting],
  );

  // Config
  const columns = useMemo<ColumnDef<ListAction, any>[]>(
    () => [
      columnHelper.accessor("_id", {
        header: () => (
          <div className="text-center font-bold text-[16px]">#</div>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-center text-blue-600 ">
            {row.index + 1}
          </div>
        ),
        size: 60,
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row?.zone?.name, {
        id: "zone",
        header: () => (
          <div className="text-center font-bold text-[16px]">{dic.zone}</div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center">
              <div className="font-medium text-sm">
                {row?.original?.zone?.name || ""}
              </div>
            </div>
          );
        },
        size: 50,
        sortingFn: "alphanumeric",
      }),
      columnHelper.accessor("name", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.roomCode}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <div className="font-medium  text-sm">
              {row?.original?.name || ""}
            </div>
          </div>
        ),
        size: 100,
        sortingFn: "alphanumeric",
      }),

      columnHelper.accessor((row) => row?.roomAreaCategory?.name, {
        id: "roomAreaCategory",
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.roomCategory}
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center">
              {row?.original?.roomAreaCategory?.name || ""}
            </div>
          );
        },
        size: 120,
        sortingFn: "text",
      }),
      columnHelper.accessor("totalArea", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.totalArea}
            <span className="text-xs" style={{ textTransform: "none" }}>
              (m²)
            </span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="font-medium text-sm  ">
              {row?.original?.totalArea != null
                ? row?.original?.totalArea.toFixed(2)
                : "0.00"}
            </div>
          </div>
        ),
        size: 100,
        sortingFn: "basic",
      }),
      columnHelper.accessor("amount", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.rentPrice}{" "}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-end">
            <div className="font-medium text-sm text-sm ">
              {formatAmount(row?.original?.amount || 0)}
            </div>
          </div>
        ),
        size: 100,
        sortingFn: "basic",
      }),
      columnHelper.accessor("centralAmount", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.averagePrice}{" "}
            {/* <span className="text-xs" style={{ textTransform: "none" }}>
              (m²)
            </span> */}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-end">
            <div className="font-medium text-sm text-sm ">
              {formatAmount(row?.original?.centralAmount || 0)}
            </div>
          </div>
        ),
        size: 100,
        sortingFn: "basic",
      }),

      columnHelper.accessor("totalAmount", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.totalAmount}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-end">
            <div className="font-bold text-sm text-red-600">
              {formatAmount(row?.original?.totalAmount || 0)}
            </div>
          </div>
        ),
        size: 140,
        sortingFn: "basic",
      }),
      columnHelper.accessor("currency", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.currency}
          </div>
        ),
        cell: ({ row }) => {
          const currencyCode = row?.original?.currency || "";
          const color = getCurrencyColor(currencyCode);
          return (
            <div className="text-center">
              <div className="font-bold text-sm" style={{ color }}>
                {currencyCode}
              </div>
            </div>
          );
        },
        size: 80,
        sortingFn: "text",
      }),

      columnHelper.accessor("holdStatus", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.ownership}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusBadge status={row?.original?.holdStatus || ""} size="md" />
          </div>
        ),
        size: 100,
        sortingFn: "text",
      }),
      columnHelper.accessor("status", {
        header: () => (
          <div className="text-center font-bold text-[16px]">{dic.status}</div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusBadge
              status={row?.original?.status || ""}
              dictionary={dic}
              size="md"
            />
          </div>
        ),
        size: 100,
        sortingFn: "text",
      }),
      columnHelper.accessor("action", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic.tableAction}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <ButtonOption
              props={props}
              currentToView={row.original}
              loadRoomAreaCall={loadRoomAreaCall}
            />
          </div>
        ),
        size: 100,
        enableSorting: false,
      }),
    ],
    [dic, zoneList, categoryList, pageIndex, pageSize],
  );

  const table = useReactTable({
    data: roomAreaList,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      sorting,
      // Removed globalFilter to prevent auto-search
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      handleSortingChange(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
    // Removed onGlobalFilterChange to prevent auto-search
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: Math.ceil(count / pageSize),
    onPaginationChange: setPagination,
  });

  // Functions
  function openCreateComponent() {
    setToggleCreateComponent(!toggleCreateComponent);
  }

  async function onSelectChangePageIndex(page: number) {
    try {
      setPagination({
        pageIndex: page - 1,
        pageSize: pageSize,
        isActive: isActive,
        zoneId: selectedZoneId,
        categoryId: selectedCategoryId,
      });

      await loadRoomAreaAPI({
        props: {
          dictionary: dic,
          query: loadRoomAreaCall,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function onSelectChangePageSize(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    try {
      setPagination({
        pageIndex: 0,
        pageSize: Number(event?.target?.value),
        isActive: isActive,
        zoneId: selectedZoneId,
        categoryId: selectedCategoryId,
      });

      await loadRoomAreaAPI({
        props: {
          dictionary: dic,
          query: loadRoomAreaCall,
        },
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="">
          <div ref={tableScrollRef} className="overflow-x-auto">
            <Collapse
              unmountOnExit={true}
              orientation={"vertical"}
              in={loading}
            >
              <LineLoader />
            </Collapse>

            <table className={tableStyles.table}>
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
                            {{
                              asc: (
                                <i className="tabler-chevron-up text-lg ml-1" />
                              ),
                              desc: (
                                <i className="tabler-chevron-down text-lg ml-1" />
                              ),
                            }[header.column.getIsSorted() as "asc" | "desc"] ??
                              null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr key={"no-data"}>
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
                        key={`room-row-${row?.original?._id || ""}-${index}`}
                        className={classNames(
                          { selected: row.getIsSelected() },
                          "even:bg-[#F3FAFB] hover:bg-[rgba(14,116,144,0.10)] transition-colors",
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={`room-cell-${cell.id}-${index}`}
                            className="py-3 px-2"
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
    </>
  );
};

export default TableComponent;
