// MUI Imports
import CustomTextField from "@/@core/components/mui/TextField";
import { getDictionary } from "@/utils/getDictionary";
import { MenuItem } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

// Third Party Imports
import type { useReactTable } from "@tanstack/react-table";
import { ReactElement } from "react";

const TableFetchPaginationComponent = ({
  table,
  count,
  startChild,
  dictionary,
  onPageChange,
  cb,
}: {
  table: ReturnType<typeof useReactTable>;
  count: number;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  onPageChange?: (page: number) => void;
  startChild?: ReactElement;
  cb?: (e) => void;
}) => {
  return (
    <div
      className="
      flex
      gap-[10px]
      justify-between
     "
    >
      <Typography
        className="
      flex
      items-center
      "
        color="text.disabled"
      >
        {`${dictionary.showing} ${
          count === 0
            ? 0
            : table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
              1
        }
        ${dictionary.to.toLocaleLowerCase()} ${Math.min(
          (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
          count,
        )}  ${dictionary.from.toLocaleLowerCase()} ${count} ${dictionary.entries.toLocaleLowerCase()}`}
      </Typography>
      <div className="flex">
        <div className="flex gap-[10px]">
          <div className="flex">
            <div className="form-group flex flex-col">
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => cb && cb(e)}
                id="country"
                name="country"
                className="
                      h-[38px] 
                      border 
                      border-[1px] 
                      rounded-[5px] 
                      outline-none 
                      focus:border-[1.8px] 
                      focus:border-[#41669D] 
                      focus:shadow-md
                      pl-[10px]
                      pr-[20px]
                      md:w-[80px]
                  "
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="200">200</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row items-center ">
            {startChild && startChild}
            <Pagination
              shape="rounded"
              color="primary"
              variant="tonal"
              count={Math.ceil(count / table.getState().pagination.pageSize)}
              page={table.getState().pagination.pageIndex + 1}
              onChange={(_, page) => {
                if (onPageChange) onPageChange(page);
              }}
              showFirstButton
              showLastButton
              siblingCount={0}
              boundaryCount={1}
            />
          </div>
        </div>
      </div>
    </div>
    // <div className="flex items-center border-bs bs-auto  gap-2 w-[100%]">
    //   <div className="flex md:w-[50%] sm:w-[30%] mt-[25px]">
    //     <Typography color="text.disabled">
    //       {`${dictionary.showing} ${
    //         count === 0
    //           ? 0
    //           : table.getState().pagination.pageIndex *
    //               table.getState().pagination.pageSize +
    //             1
    //       }
    //     ${dictionary.to.toLocaleLowerCase()} ${Math.min(
    //       (table.getState().pagination.pageIndex + 1) *
    //         table.getState().pagination.pageSize,
    //       count
    //     )}  ${dictionary.from.toLocaleLowerCase()} ${count} ${dictionary.entries.toLocaleLowerCase()}`}
    //     </Typography>
    //   </div>
    //   <div className="flex gap-2 md:w-[50%] sm:w-[70%] justify-end mt-[25px]">
    //     <div className="flex justify-end">
    //       <CustomTextField
    //         select
    //         value={table.getState().pagination.pageSize}
    //         onChange={(e) => cb(e)}
    //         className="is-[50%]"
    //       >
    //         <MenuItem value="1">1</MenuItem>
    //         <MenuItem value="5">5</MenuItem>
    //         <MenuItem value="10">10</MenuItem>
    //         <MenuItem value="25">25</MenuItem>
    //         <MenuItem value="50">50</MenuItem>
    //       </CustomTextField>
    //     </div>
    //     <div className="flex flex-row items-center ">
    //       {startChild && startChild}
    //       <Pagination
    //         shape="rounded"
    //         color="primary"
    //         variant="tonal"
    //         count={Math.ceil(count / table.getState().pagination.pageSize)}
    //         page={table.getState().pagination.pageIndex + 1}
    //         onChange={(_, page) => {
    //           if (onPageChange) onPageChange(page);
    //         }}
    //         showFirstButton
    //         showLastButton
    //       />
    //     </div>
    //   </div>
    // </div>
  );
};

export default TableFetchPaginationComponent;
