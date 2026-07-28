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
import { CategoryListProps, CategoryType } from "../../type/categoryType";
import { Collapse, TablePagination, Typography } from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useCategoryStore } from "../../store/categoryStore";
import classNames from "classnames";
import TableFetchPaginationComponent from "@/components/TableFetchPaginationComponent";
import LineLoader from "@/components/loading/line/LineLoader";
import { toast } from "react-toastify";
import { ButtonOption } from "./btnOption";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import { ICategorySortField } from "@/utils/enumSortField";
import {
  initializeSortingState,
  createSortingChangeHandler,
} from "@/utils/sortUtils";
import { formatDateLocalUse } from "@/utils/dateTimeFormatter";
import { IEntityStatus } from "@/utils/base";
import CustomChip from "@/@core/components/mui/Chip";

type ListAction = CategoryType & {
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

interface CategoryTableComponentProps {
  props: CategoryListProps;
  onEditClick?: (item: CategoryType) => void;
  globalFilter?: string;
  onGlobalFilterChange?: Dispatch<SetStateAction<string>>;
  loadCategoryCall?: any;
}

const TableComponent = ({
  props,
  onEditClick,
  globalFilter,
  onGlobalFilterChange,
  loadCategoryCall,
}: CategoryTableComponentProps) => {
  const { dictionary: dic } = props;

  const [rowSelection, setRowSelection] = useState({});
  const tableScrollRef = useDragToScroll<HTMLDivElement>();

  const {
    pageIndex,
    pageSize,
    count,
    isActive,
    keyword,
    setPagination,
    setSorting,
    sortField,
    sortOrder,
    loading,
    loadCategoryAPI,
    categoryList,
  } = useCategoryStore();

  const columnToSortFieldMap: Record<string, ICategorySortField> = useMemo(
    () => ({
      name: ICategorySortField.name,
      description: ICategorySortField.description,
      createdAt: ICategorySortField.createdAt,
    }),
    [],
  );

  const [sorting, setSortingState] = useState<SortingState>(() =>
    initializeSortingState(sortField, sortOrder, columnToSortFieldMap),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSortingChange = useCallback(
    createSortingChangeHandler({
      columnToSortFieldMap,
      setSortingState,
      setSorting,
      loadAPI: async () => {
        await loadCategoryAPI({
          props: {
            dictionary: dic,
            query: loadCategoryCall,
          },
        });
      },
      onError: (error) => toast.error(error.message),
    }),
    [columnToSortFieldMap, dic, loadCategoryCall, loadCategoryAPI, setSorting],
  );

  const columns = useMemo<ColumnDef<ListAction, any>[]>(
    () => [
      columnHelper.accessor("_id", {
        size: 8,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">#</div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium text-blue-600 text-[15px]">
            {row.index + 1}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("name", {
        size: 55,
        header: () => (
          <div className="text-center font-bold text-[14px] text-white">
            {dic?.name}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.name}
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
        size: 8,
        header: () => (
          <div className="text-center font-bold text-[16px] text-white flex justify-center pr-6">
            {dic?.tableAction || dic?.action}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center pr-6">
            <ButtonOption
              props={props}
              currentToView={row.original}
              onEditClick={onEditClick}
              loadCategoryCall={loadCategoryCall}
            />
          </div>
        ),
        enableSorting: false,
      }),
    ],
    [dic, props, onEditClick, loadCategoryCall],
  );

  const table = useReactTable({
    data: categoryList,
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

  async function onSelectChangePageIndex(page: number) {
    try {
      setPagination({
        pageIndex: page - 1,
        pageSize: pageSize,
        isActive: isActive,
        keyword: keyword,
        sortField: sortField,
        sortOrder: sortOrder,
      });

      await loadCategoryAPI({
        props: {
          dictionary: dic,
          query: loadCategoryCall,
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
        keyword: keyword,
        sortField: sortField,
        sortOrder: sortOrder,
      });

      await loadCategoryAPI({
        props: {
          dictionary: dic,
          query: loadCategoryCall,
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
                        key={`category-row-${row?.original?._id || ""}-${index}`}
                        className={classNames(
                          { selected: row.getIsSelected() },
                          "even:bg-[#F3FAFB] hover:bg-[rgba(14,116,144,0.10)] transition-colors",
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={`category-cell-${cell.id}-${index}`}
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
