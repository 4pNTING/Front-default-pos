// 'use client';

// // React Imports
// import { useEffect, useState, useMemo } from 'react';

// // Next Imports

// // MUI Imports
// import Card from '@mui/material/Card';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import TablePagination from '@mui/material/TablePagination';
// import type { TextFieldProps } from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';

// // Third-party Imports
// import classnames from 'classnames';
// import { rankItem } from '@tanstack/match-sorter-utils';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getFilteredRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFacetedMinMaxValues,
//   getPaginationRowModel,
//   getSortedRowModel,
// } from '@tanstack/react-table';
// import type { ColumnDef, FilterFn } from '@tanstack/react-table';

// // Type Imports

// // Component Imports
// import TablePaginationComponent from '@components/TablePaginationComponent';
// import CustomTextField from '@core/components/mui/TextField';

// // Style Imports
// import tableStyles from '@core/styles/table.module.css';
// import { useModalStore } from '@/modal/store/modalStore';
// import CustomAlert from '@/components/alert/view/CustomAlert';
// import LineLoader from '@/components/loading/line/LineLoader';
// import { Collapse } from '@mui/material';
// import { useLazyQuery, useMutation } from '@apollo/client';
// // import { POSITION_DELETE } from '@/gql/queries/position';
// import { Role } from '@/gql/models/graphql';
// import { roleMTs, RolesListProps } from '../type/roleTypes';
// import { useRoleStore } from '../store/roleStore';
// // import { ROLE_FIND_MANY } from '@/gql/queries/role'

// // declare module '@tanstack/table-core' {
// //     interface FilterFns {
// //         fuzzy: FilterFn<unknown>
// //     }
// //     interface FilterMeta {
// //         itemRank: RankingInfo
// //     }
// // }

// type RoleWithAction = Role & {
//   action?: string;
// };

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   // Rank the item
//   const itemRank = rankItem(row.getValue(columnId), value);

//   // Store the itemRank info
//   addMeta({
//     itemRank,
//   });

//   // Return if the item should be filtered in/out
//   return itemRank.passed;
// };

// const DebouncedInput = ({
//   value: initialValue,
//   onChange,
//   debounce = 500,
//   ...props
// }: {
//   value: string | number;
//   onChange: (value: string | number) => void;
//   debounce?: number;
// } & Omit<TextFieldProps, 'onChange'>) => {
//   // States
//   const [value, setValue] = useState(initialValue);

//   useEffect(() => {
//     setValue(initialValue);
//   }, [initialValue]);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       onChange(value);
//     }, debounce);

//     return () => clearTimeout(timeout);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);

//   return (
//     <CustomTextField
//       {...props}
//       variant="filled"
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//     />
//   );
// };

// // Column Definitions
// const columnHelper = createColumnHelper<RoleWithAction>();

// const RoleListTable = ({ props }: { props: RolesListProps }) => {
//   // Hooks
//   const { loading, roles, queryRoles, setToUpdate } = useRoleStore();

//   // Var
//   const dic = props.dictionary;
//   // States
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState('');
//   //   const [mutateDeletePos] = useMutation(POSITION_DELETE);
//   //   const [rolesQuery] = useLazyQuery(ROLE_FIND_MANY, {
//   //     fetchPolicy: 'network-only',
//   //   });
//   const openModal = useModalStore((state) => state.openModal);

//   const columns = useMemo<ColumnDef<RoleWithAction, any>[]>(
//     () => [
//       columnHelper.accessor('_id', {
//         header: () => <div className="text-center w-full">NO</div>,
//         cell: ({ row }) => (
//           <Typography className="capitalize text-center" color="text.primary">
//             {row.index + 1}
//           </Typography>
//         ),
//       }),
//       columnHelper.accessor('systemCode', {
//         header: () => <div className="text-center w-full">{dic.code}</div>,
//         cell: ({ row }) => (
//           <Typography className="capitalize text-center" color="text.primary">
//             {row.original?.systemCode ?? '-'}
//           </Typography>
//         ),
//       }),
//       columnHelper.accessor('laName', {
//         header: () => (
//           <div className="text-left w-full">
//             {dic.name} ({dic.lao})
//           </div>
//         ),
//         cell: ({ row }) => (
//           <div className="flex flex-col items-left">
//             <Typography color="text.primary" className="font-medium text-left">
//               {row.original?.laName ?? '*'}
//             </Typography>
//           </div>
//         ),
//       }),
//       columnHelper.accessor('enName', {
//         header: () => (
//           <div className="text-left w-full">
//             {dic.name} ({dic.english})
//           </div>
//         ),
//         cell: ({ row }) => (
//           <div className="flex flex-col items-left">
//             <Typography color="text.primary" className="font-medium text-left">
//               {row.original?.enName ?? '*'}
//             </Typography>
//           </div>
//         ),
//       }),

//       columnHelper.accessor('menus', {
//         header: () => <div className="text-center w-full">{dic.role}</div>,
//         cell: ({ row }) => (
//           <Typography className="capitalize text-center" color="text.primary">
//             {row.original?.menus.length ?? '0'}
//           </Typography>
//         ),
//       }),

//       columnHelper.accessor('action', {
//         header: () => <div className="text-center w-full">{dic.manage}</div>,
//         cell: ({ row }) => (
//           <div className="flex items-center justify-center gap-2">
//             <CustomAlert
//               title={dic.deleteDataQuestionMark}
//               msg={dic.pleaseConfirmToProceed}
//               posText={dic.confirm}
//               dictionary={dic}
//               posClicked={() => {}}
//               indicator={
//                 <IconButton onClick={() => {}}>
//                   <i className="tabler-trash text-textSecondary" />
//                 </IconButton>
//               }
//             />
//             <IconButton
//               onClick={() => {
//                 // setToUpdate(row?.original ?? null)
//                 // openModal(positionMTs.update)
//               }}
//             >
//               <i className="tabler-edit text-textSecondary" />
//             </IconButton>
//           </div>
//         ),
//         enableSorting: false,
//       }),
//     ],
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [roles]
//   );

//   const table = useReactTable({
//     data: roles,
//     columns,
//     filterFns: {
//       fuzzy: fuzzyFilter,
//     },
//     state: {
//       rowSelection,
//       globalFilter,
//     },
//     initialState: {
//       pagination: {
//         pageSize: 10,
//       },
//     },
//     enableRowSelection: true, //enable row selection for all rows
//     // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
//     globalFilterFn: fuzzyFilter,
//     onRowSelectionChange: setRowSelection,
//     getCoreRowModel: getCoreRowModel(),
//     onGlobalFilterChange: setGlobalFilter,
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     getFacetedMinMaxValues: getFacetedMinMaxValues(),
//   });

//   useEffect(() => {
//     queryRoles({
//       props: { dictionary: props.dictionary },
//     });
//   }, []);

//   return (
//     <>
//       <Card>
//         <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 gap-4">
//           <CustomTextField
//             select
//             value={table.getState().pagination.pageSize}
//             onChange={(e) => table.setPageSize(Number(e.target.value))}
//             className="is-[70px]"
//           >
//             <MenuItem value="10">10</MenuItem>
//             <MenuItem value="25">25</MenuItem>
//             <MenuItem value="50">50</MenuItem>
//           </CustomTextField>
//           <div className="flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4">
//             <DebouncedInput
//               value={globalFilter ?? ''}
//               onChange={(value) => setGlobalFilter(String(value))}
//               placeholder={dic.search + ' ' + dic.position}
//               className="is-full sm:is-auto"
//             />
//             <Button
//               color="secondary"
//               variant="tonal"
//               startIcon={<i className="tabler-upload" />}
//               className="is-full sm:is-auto"
//             >
//               {dic.export}
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<i className="tabler-plus" />}
//               onClick={() => openModal(roleMTs.create)}
//               className="is-full sm:is-auto"
//             >
//               {dic.addNew}
//             </Button>
//           </div>
//         </div>
//         <Collapse unmountOnExit={true} orientation={'vertical'} in={loading}>
//           <LineLoader />
//         </Collapse>
//         <div className="overflow-x-auto">
//           <table className={tableStyles.table}>
//             <thead>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <th key={header.id}>
//                       {header.isPlaceholder ? null : (
//                         <>
//                           <div
//                             className={classnames({
//                               'flex items-center': header.column.getIsSorted(),
//                               'cursor-pointer select-none':
//                                 header.column.getCanSort(),
//                             })}
//                             onClick={header.column.getToggleSortingHandler()}
//                           >
//                             {flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                             {{
//                               asc: <i className="tabler-chevron-up text-xl" />,
//                               desc: (
//                                 <i className="tabler-chevron-down text-xl" />
//                               ),
//                             }[header.column.getIsSorted() as 'asc' | 'desc'] ??
//                               null}
//                           </div>
//                         </>
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             {table.getFilteredRowModel().rows.length === 0 ? (
//               <tbody>
//                 <tr>
//                   <td
//                     colSpan={table.getVisibleFlatColumns().length}
//                     className="text-center"
//                   >
//                     {dic.noDataAvailable}
//                   </td>
//                 </tr>
//               </tbody>
//             ) : (
//               <tbody>
//                 {table
//                   .getRowModel()
//                   .rows.slice(0, table.getState().pagination.pageSize)
//                   .map((row) => {
//                     return (
//                       <tr
//                         key={row.id}
//                         className={classnames({
//                           selected: row.getIsSelected(),
//                         })}
//                       >
//                         {row.getVisibleCells().map((cell) => (
//                           <td key={cell.id}>
//                             {flexRender(
//                               cell.column.columnDef.cell,
//                               cell.getContext()
//                             )}
//                           </td>
//                         ))}
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             )}
//           </table>
//         </div>
//         <TablePagination
//           component={() => (
//             <TablePaginationComponent
//               dictionary={props.dictionary}
//               table={table}
//             />
//           )}
//           count={table.getFilteredRowModel().rows.length}
//           rowsPerPage={table.getState().pagination.pageSize}
//           page={table.getState().pagination.pageIndex}
//           onPageChange={(_, page) => {
//             table.setPageIndex(page);
//           }}
//         />
//       </Card>
//     </>
//   );
// };

// export default RoleListTable;
