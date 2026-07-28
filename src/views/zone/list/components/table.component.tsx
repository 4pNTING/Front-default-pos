// views/zone/list/components/table.component.tsx
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
} from "@tanstack/react-table";
import { ZoneListProps, ZoneType } from "../../type/zoneType";
import { Button, Collapse, TablePagination, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../store/zoneStore";
import classNames from "classnames";
import TableFetchPaginationComponent from "@/components/TableFetchPaginationComponent";
import LineLoader from "@/components/loading/line/LineLoader";
import { useSession } from "next-auth/react";
import { currencyFormatInput, IEntityStatus, IRoleConfigLevel } from "@/utils/base";
import { ToastContainer, toast } from "react-toastify";
import { ButtonOption } from "./btnOption";
import { StatusBadge } from "@/utils/StatusBadge";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import CustomChip from "@/@core/components/mui/Chip";

type ListAction = ZoneType & {
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
  onEditClick,
  loadZoneCall,
}: {
  props: ZoneListProps;
  onEditClick?: (item: ZoneType) => void;
  loadZoneCall: any;
}) => {
  // Var
  const { lang, dictionary: dic } = props;

  // States
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Drag to scroll hook
  const tableScrollRef = useDragToScroll<HTMLDivElement>();

  // Hooks
  const {
    pageIndex,
    pageSize,
    count,
    isActive,
    search,
    setPagination,
    loading,
    loadZoneAPI,
    zoneList,
    toggleCreateComponent,
    setToggleCreateComponent,
  } = useStore();

  // Config
  const columns = useMemo<ColumnDef<ListAction, any>[]>(
    () => [
      columnHelper.accessor("_id", {
        size: 8,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">#</div>
        ),
        cell: ({ row }) => <div className="text-center text-blue-600">{row.index + 1}</div>,
        enableSorting: false,
      }),
      columnHelper.accessor("name", {
        size: 55,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {dic.zone}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <div className="font-medium">{row?.original?.name || ""}</div>
          </div>
        ),
        sortingFn: "alphanumeric",
      }),
      columnHelper.accessor("isActive", {
        size: 22,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {dic?.status}
          </div>
        ),
        cell: ({ row }) => {
          const isActive = row.original.isActive === IEntityStatus.active;
          return (
            <div className="flex justify-center">
              <CustomChip
                size="small"
                round="true"
                variant="tonal"
                label={isActive ? (dic?.active || "Active") : (dic?.inactive || "Inactive")}
                color={isActive ? "success" : "secondary"}
                sx={{ fontWeight: 600 }}
              />
            </div>
          );
        },
        enableSorting: false,
      }),

      columnHelper.accessor("action", {
        size: 15,
        header: () => (
          <div className="text-center font-bold text-[16px] text-white flex justify-center pr-6">
            {dic.tableAction}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center pr-6">
            <ButtonOption
              props={props}
              currentToView={row.original}
              onEditClick={onEditClick}
              loadZoneCall={loadZoneCall}
            />
          </div>
        ),
        enableSorting: false,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dic, pageIndex, pageSize],
  );

  const table = useReactTable({
    data: zoneList,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
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
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: Math.max(1, Math.ceil(count / pageSize)),
    onPaginationChange: (updater) => {
      const state = useStore.getState();
      const newPagination =
        typeof updater === "function"
          ? updater({
              pageIndex: state.pageIndex,
              pageSize: state.pageSize,
            })
          : updater;
      setPagination({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
        search: state.search,
        isActive: state.isActive,
      });
    },
  });

  // Functions
  function openCreateComponent() {
    setToggleCreateComponent(!toggleCreateComponent);
  }

  async function onSelectChangePageIndex(page: number) {
    try {
      const newPageIndex = page - 1;

      // Set pagination in store
      setPagination({
        pageIndex: newPageIndex,
        pageSize: pageSize,
        search: search,
        isActive: isActive,
      });

      // Pass parameters directly to loadZoneAPI (include isActive to maintain filter)
      await loadZoneAPI({
        props: {
          query: loadZoneCall,
          dictionary: dic,
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function onSelectChangePageSize(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    try {
      const newPageSize = Number(event?.target?.value);

      // Set pagination in store
      setPagination({
        pageIndex: 0,
        pageSize: newPageSize,
        search: search,
        isActive: isActive,
      });

      // Pass parameters directly to loadZoneAPI
      await loadZoneAPI({
        props: {
          query: loadZoneCall,
          dictionary: dic,
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      {/* Table Section */}
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
                  <tr className="h-[50px]" key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th key={header.id} className="relative">
                        {index < headerGroup.headers.length - 1 && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[33%] w-px bg-white/30" />
                        )}
                        {header.isPlaceholder ? null : (
                          <div
                            className={classNames({
                              "flex items-center justify-center":
                                header.column.getIsSorted(),
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: <i className="tabler-chevron-up text-xl" />,
                              desc: (
                                <i className="tabler-chevron-down text-xl" />
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

              {!zoneList ||
              !Array.isArray(zoneList) ||
              zoneList.length === 0 ||
              table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr key={"no-data"}>
                    <td
                      colSpan={table.getVisibleFlatColumns().length}
                      className="text-center"
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
                        key={`floor-row-${row?.original?._id || ""}-${index}`}
                        className={classNames(
                          { selected: row.getIsSelected() },
                          "even:bg-[#F3FAFB] hover:bg-[rgba(14,116,144,0.10)] transition-colors",
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={`floor-cell-${cell.id}-${index}`}>
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
            <div className="px-5 pt-2 mb-4">
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
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default TableComponent;
