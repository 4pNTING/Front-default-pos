import { Breadcrumbs, Button } from "@mui/material";
import Link from "next/link";
import { HomeListProps } from "../../type/homeType";
import { useStore } from "../../store/homeStore";
import CustomTextField from "@/@core/components/mui/TextField";

const HeaderComponent = ({
  props,
  globalFilter,
  setGlobalFilter,
  onGlobalFilterChange,
  loadHomeCall,
}: {
  props: HomeListProps;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onGlobalFilterChange?: (value: string) => void;
  loadHomeCall?: any;
}) => {
  const { dictionary: dic } = props;
  const { setToggleCreateComponent } = useStore();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-5">
          <div className="grid md:grid-cols-2">
            <div className="flex gap-2 flex-col">
              <Breadcrumbs
                separator={<span style={{ margin: "0 8px" }}>›</span>}
                aria-label="breadcrumb"
              >
                <Link
                  className="text-[#333] hover:underline hover:underline-offset-1"
                  href="/"
                >
                  {dic.pageBreadcrumbs?.homePage}
                </Link>
              </Breadcrumbs>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="form-group flex flex-col mt-5">
              <CustomTextField
                sx={{ maxWidth: 300, width: 300 }}
                type="search"
                placeholder={dic.placeHolder?.search}
                value={globalFilter ?? ""}
                onChange={(e) =>
                  onGlobalFilterChange
                    ? onGlobalFilterChange(e.target.value)
                    : setGlobalFilter(e.target.value)
                }
                inputProps={{ autoComplete: "off" }}
              />
            </div>

            <div className="flex-grow"></div>

            <div className="form-group flex flex-col ml-auto mt-5">
              <Button
                size="medium"
                onClick={() => setToggleCreateComponent(true)}
                variant="contained"
                className="flex gap-4 items-center"
                sx={{ minWidth: 150 }}
              >
                <div className="tabler-circle-plus text-[20px]"></div>
                <span>{dic.create}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;
