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
import { CustomerListProps } from "../../type/customerType";
import { Button, Collapse, TablePagination, Typography } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useStore } from "../../store/customerStore";
import classNames from "classnames";
import TableFetchPaginationComponent from "@/components/TableFetchPaginationComponent";
import CustomChip from "@/@core/components/mui/Chip";
import LineLoader from "@/components/loading/line/LineLoader";
import Link from "next/link";
import { currencyFormatInput, IEntityStatus, IRoleConfigLevel } from "@/utils/base";
import { ToastContainer, toast } from "react-toastify";
import { ButtonOption } from "./btnOption";
import { CustomerType } from "../../type/customerType";
import { StatusBadge } from "@/utils/StatusBadge";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import { ICustomerSortField } from "@/utils/enumSortField";
import {
  initializeSortingState,
  createSortingChangeHandler,
} from "@/utils/sortUtils";

type ListAction = CustomerType & {
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

interface CustomerTableComponentProps {
  props: CustomerListProps;
  globalFilter?: string;
  onGlobalFilterChange?: Dispatch<SetStateAction<string>>;
  loadCustomerCall?: any;
}

const TableComponent = ({
  props,
  globalFilter,
  onGlobalFilterChange,
  loadCustomerCall,
}: CustomerTableComponentProps) => {
  const { lang, dictionary: dic } = props;

  const [rowSelection, setRowSelection] = useState({});

  // Drag to scroll hook
  const tableScrollRef = useDragToScroll<HTMLDivElement>();

  const {
    pageIndex,
    pageSize,
    count,
    setPagination,
    setSorting,
    sortField,
    sortOrder,
    loading,
    loadCustomerAPI,
    customerList,
    toggleCreateComponent,
    setToggleCreateComponent,
    genderList,
    nationList,
  } = useStore();

  // Map column IDs to ICustomerSortField enum values
  const columnToSortFieldMap: Record<string, ICustomerSortField> = useMemo(
    () => ({
      firstName: ICustomerSortField.firstName,
      lastName: ICustomerSortField.lastName,
      gender: ICustomerSortField.gender,
      nationality: ICustomerSortField.nationality,
      province: ICustomerSortField.province,
      district: ICustomerSortField.district,
      village: ICustomerSortField.village,
      phoneNumber: ICustomerSortField.phoneNumber,
    }),
    [],
  );

  // Initialize sorting state from store
  const [sorting, setSortingState] = useState<SortingState>(() =>
    initializeSortingState(sortField, sortOrder, columnToSortFieldMap),
  );

  // Handle sorting change
  const handleSortingChange = createSortingChangeHandler({
    columnToSortFieldMap,
    setSortingState,
    setSorting,
    loadAPI: async () => {
      await loadCustomerAPI({
        props: {
          dictionary: dic,
          query: loadCustomerCall,
        },
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const columns = useMemo<ColumnDef<ListAction, any>[]>(
    () => [
      columnHelper.accessor("_id", {
        header: () => (
          <div className="text-center font-bold text-[16px]">#</div>
        ),
        cell: ({ row }) => (
          <div className="text-l text-center text-blue-600 ">
            {row.index + 1}
          </div>
        ),
        size: 50,
        enableSorting: false,
      }),
      columnHelper.accessor("firstName", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.fullName}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left pl-4">
            <div className="font-medium text-l">
              {[row?.original?.firstName || "", row?.original?.lastName || ""]
                .filter(Boolean)
                .join(" ")}
            </div>
          </div>
        ),
        size: 40,
        sortingFn: "text",
      }),
      columnHelper.accessor("gender", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.gender}</span>
          </div>
        ),
        cell: ({ row }) => {
          const genderValue = row?.original?.gender || "";
          const genderLabel =
            genderList.find((g) => g._id === genderValue)?.laName ||
            genderValue;
          return (
            <div className="text-center">
              <div className="font-medium text-l">{genderLabel}</div>
            </div>
          );
        },
        size: 80,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          return value === "" || row.getValue(id) === value;
        },
        sortingFn: "text",
      }),
      columnHelper.accessor("nationality", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.nationality}</span>
          </div>
        ),
        cell: ({ row }) => {
          const nationalityValue = row?.original?.nationality || "";
          const nationalityLabel =
            nationList.find((n) => n._id === nationalityValue)?.laName ||
            nationalityValue;
          return (
            <div className="text-center">
              <div className="font-medium text-l">{nationalityLabel}</div>
            </div>
          );
        },
        size: 100,
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
          return value === "" || row.getValue(id) === value;
        },
        sortingFn: "text",
      }),
      columnHelper.accessor("province", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.province}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left pl-4">
            <div className="font-medium text-l text-gray-600">
              {row?.original?.province || ""}
            </div>
          </div>
        ),
        size: 120,
        sortingFn: "text",
      }),
      columnHelper.accessor("district", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.district}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left pl-4">
            <div className="font-medium text-l text-gray-600">
              {row?.original?.district || ""}
            </div>
          </div>
        ),
        size: 100,
        sortingFn: "text",
      }),
      columnHelper.accessor("village", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.village}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-left pl-4">
            <div className="font-medium text-l text-gray-600">
              {row?.original?.village || ""}
            </div>
          </div>
        ),
        size: 100,
        sortingFn: "text",
      }),
      columnHelper.accessor("phoneNumber", {
        header: () => (
          <div className="flex justify-center items-center mx-auto w-full">
            <span className="font-bold text-[16px]">{dic?.phone}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right pr-4">
            <div className="font-medium text-l text-gray-600">
              {row?.original?.phoneNumber || ""}
            </div>
          </div>
        ),
        size: 120,
        sortingFn: "alphanumeric",
      }),
      columnHelper.accessor("action", {
        header: () => (
          <div className="text-center font-bold text-[16px]">
            {dic?.tableAction}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <ButtonOption
              props={props}
              currentToView={row.original}
              loadCustomerCall={loadCustomerCall}
            />
          </div>
        ),
        size: 100,
        enableSorting: false,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dic, genderList, nationList, loadCustomerCall, props],
  );

  const table = useReactTable({
    data: customerList,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      sorting,
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
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      handleSortingChange(newSorting);
    },
    onGlobalFilterChange: onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),

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

  function openCreateComponent() {
    setToggleCreateComponent(!toggleCreateComponent);
  }

  async function onSelectChangePageIndex(page: number) {
    try {
      setPagination({
        pageIndex: page - 1,
        pageSize: pageSize,
      });

      await loadCustomerAPI({
        props: {
          dictionary: dic,
          query: loadCustomerCall,
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
      setPagination({
        pageIndex: 0,
        pageSize: Number(event?.target?.value),
      });

      await loadCustomerAPI({
        props: {
          dictionary: dic,
          query: loadCustomerCall,
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="">
          {/* Search and Create Button moved to HeaderComponent */}

          <div ref={tableScrollRef} className="overflow-x-auto ">
            <Collapse
              unmountOnExit={true}
              orientation={"vertical"}
              in={loading}
            >
              <LineLoader />
            </Collapse>

            <table className={`${tableStyles.table} w-full `}>
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
                        key={`customer-row-${row?.original?._id || ""}-${index}`}
                        className={classNames(
                          { selected: row.getIsSelected() },
                          "even:bg-[#F3FAFB] hover:bg-[rgba(14,116,144,0.10)] transition-colors",
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={`customer-cell-${cell.id}-${index}`}
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
    </>
  );
};

export default TableComponent;
