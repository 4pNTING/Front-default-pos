import { CustomerListProps, CustomerType } from "../type/customerType";
import HeaderComponent from "./components/header.compoenet";
import TableComponent from "./components/table.component";
import { useSession } from "next-auth/react";
import { useStore } from "../store/customerStore";
import CreateComponent from "./components/formCreate.component";
import UpdateComponent from "./components/formUpdate.component";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { LOAD_CUSTOMER } from "@/gql/queries";
import { useLazyQuery } from "@apollo/client";
import LazyLoading from "@/utils/lazyLoading";

export const List = ({ props }: { props: CustomerListProps }) => {
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
    loadCustomerAPI,
    customerList,
  } = useStore();

  const [render, setRender] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [loadCustomerCall] = useLazyQuery(LOAD_CUSTOMER, {
    fetchPolicy: "network-only",
  });

  const init = useCallback(async () => {
    try {
      const promises: Promise<any>[] = [];

      // Skip fetch if data already exists in store
      if (!customerList || customerList.length === 0) {
        promises.push(
          loadCustomerAPI({
            props: {
              query: loadCustomerCall,
              dictionary: dic,
            },
          }),
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    } catch (error) {}
  }, [loadCustomerAPI, loadCustomerCall, dic, customerList]);

  useEffect(() => {
    init().then(() => {
      setRender(true);
    });
  }, [user, init]);

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

    if (!customerList || customerList.length === 0) {
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
        const { searchCustomerAPI } = useStore.getState();

        await searchCustomerAPI({
          props: {
            query: loadCustomerCall,
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
              loadCustomerCall={loadCustomerCall}
            />
            <TableComponent
              props={props}
              globalFilter={globalFilter}
              onGlobalFilterChange={handleGlobalFilterChange}
              loadCustomerCall={loadCustomerCall}
            />
          </div>
        </div>
      ) : (
        <LazyLoading />
      )}
    </>
  );
};
