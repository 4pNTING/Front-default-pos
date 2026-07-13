// MUI Imports
import { getDictionary } from '@/utils/getDictionary'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

// Third Party Imports
import type { useReactTable } from '@tanstack/react-table'
import { ReactElement } from 'react'

const TablePaginationComponent = ({ table, startChild, dictionary, onPageChange }: { table: ReturnType<typeof useReactTable>, dictionary: Awaited<ReturnType<typeof getDictionary>>, onPageChange?: (page: number) => void, startChild?: ReactElement }) => {
  return (
    <div className='flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2'>

      <Typography color='text.disabled'>
        {`${dictionary.showing} ${table.getFilteredRowModel().rows.length === 0
          ? 0
          : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
          }
        ${dictionary.to.toLocaleLowerCase()} ${Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}  ${dictionary.from.toLocaleLowerCase()} ${table.getFilteredRowModel().rows.length} ${dictionary.entries.toLocaleLowerCase()}`}
      </Typography>
      <div className='flex flex-row items-center'>
        {startChild && startChild}
        <Pagination
          shape='rounded'
          color='primary'
          variant='tonal'
          count={Math.ceil(table.getFilteredRowModel().rows.length / table.getState().pagination.pageSize)}
          page={table.getState().pagination.pageIndex + 1}
          onChange={(_, page) => {
            if (onPageChange)
              onPageChange(page);
          }}
          showFirstButton
          showLastButton
        />
      </div>
    </div>
  )
}

export default TablePaginationComponent
