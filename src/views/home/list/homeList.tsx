import { HomeListProps, HomeType } from "../type/homeType";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import { useSession } from "next-auth/react";
import { useStore } from "../store/homeStore";
import CreateComponent from "./components/formCreate.component";
import UpdateComponent from "./components/formUpdate.component";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { LOAD_HOME } from "@/gql/queries/home";
import { useLazyQuery } from "@apollo/client";
import LazyLoading from "@/utils/lazyLoading";

export const List = ({ props }: { props: HomeListProps }) => {
  const { lang, dictionary: dic } = props;
  const { data } = useSession();
  const user = data?.user;

  const {
    removeListenerState,
    toggleCreateComponent,
    setToggleCreateComponent,
    toggleUpdateComponent,
    setToggleUpdateComponent,
    selectedItem,
    setSelectedItem,
    loadHomeAPI,
    homeList,
  } = useStore();

  const [render, setRender] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [loadHomeCall] = useLazyQuery(LOAD_HOME, {
    fetchPolicy: "network-only",
  });

  async function init() {
    try {
      const promises: Promise<any>[] = [];

      if (!homeList || homeList.length === 0) {
        promises.push(
          loadHomeAPI({
            props: {
              query: loadHomeCall,
              dictionary: dic,
            },
          }),
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    } catch (error) {}
  }

  useEffect(() => {
    init().then(() => {
      setRender(true);
    });
  }, [user]);

  useEffect(() => {
    setToggleCreateComponent(false);
    setToggleUpdateComponent(false);
    return () => {
      setToggleCreateComponent(false);
      setToggleUpdateComponent(false);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [setToggleCreateComponent, setToggleUpdateComponent]);

  const handleClose = () => {
    setSelectedItem(null);
    setToggleCreateComponent(false);
    setToggleUpdateComponent(false);

    if (!homeList || homeList.length === 0) {
      init();
    }
  };

  const handleFormSuccess = async () => {
    handleClose();
  };

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { searchHomeAPI } = useStore.getState();

        await searchHomeAPI({
          props: {
            query: loadHomeCall,
            dictionary: dic,
          },
          keyword: value,
        });
      } catch (error: any) {
        toast.error(error.message);
      }
    }, 500);
  };

  return (
    <>
      {render === true ? (
        <div className="grid grid-cols-1 gap-[15px]">
          {toggleCreateComponent && (
            <CreateComponent
              props={props}
              onClose={handleClose}
              onSuccess={handleFormSuccess}
            />
          )}

          {toggleUpdateComponent && selectedItem && (
            <UpdateComponent
              props={props}
              onClose={handleClose}
              onSuccess={handleFormSuccess}
              selectedItem={selectedItem}
            />
          )}

          <div
            className={
              toggleCreateComponent || toggleUpdateComponent
                ? "hidden"
                : "flex flex-col gap-[15px]"
            }
          >
            <HeaderComponent
              props={props}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              onGlobalFilterChange={handleGlobalFilterChange}
              loadHomeCall={loadHomeCall}
            />
            <TableComponent
              props={props}
              globalFilter={globalFilter}
              onGlobalFilterChange={handleGlobalFilterChange}
              loadHomeCall={loadHomeCall}
            />
          </div>
        </div>
      ) : (
        <LazyLoading />
      )}
    </>
  );
};
