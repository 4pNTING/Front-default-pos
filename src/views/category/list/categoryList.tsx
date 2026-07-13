"use client";

import { useEffect, useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { LOAD_CATEGORY } from "@/gql/queries";
import { CategoryListProps } from "@/views/category/type/categoryType";
import { useCategoryStore } from "@/views/category/store/categoryStore";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import CreateComponent from "./components/formCreate.component";
import UpdateComponent from "./components/formUpdate.component";
import LazyLoading from "@/utils/lazyLoading";

export const List = ({ props }: { props: CategoryListProps }) => {
  const { lang, dictionary: dic } = props;
  const { data } = useSession();
  const user = data?.user;

  const {
    toggleCreateComponent,
    setToggleCreateComponent,
    toggleUpdateComponent,
    setToggleUpdateComponent,
    selectedItem,
    setSelectedItem,
    loadCategoryAPI,
    categoryList,
  } = useCategoryStore();

  const [render, setRender] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [loadCategoryCall] = useLazyQuery(LOAD_CATEGORY, {
    fetchPolicy: "network-only",
  });

  async function init() {
    try {
      const promises: Promise<any>[] = [];

      if (!categoryList || categoryList.length === 0) {
        promises.push(
          loadCategoryAPI({
            props: {
              query: loadCategoryCall,
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

    if (!categoryList || categoryList.length === 0) {
      init();
    }
  };

  const handleFormSuccess = async () => {
    handleClose();
    // Refresh table
    loadCategoryAPI({
        props: {
            query: loadCategoryCall,
            dictionary: dic
        }
    })
  };

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { searchCategoryAPI } = useCategoryStore.getState();

        await searchCategoryAPI({
          props: {
            query: loadCategoryCall,
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
              loadCategoryCall={loadCategoryCall}
            />
            <TableComponent
              props={props}
              globalFilter={globalFilter}
              onGlobalFilterChange={handleGlobalFilterChange}
              loadCategoryCall={loadCategoryCall}
            />
          </div>
        </div>
      ) : (
        <LazyLoading />
      )}
    </>
  );
};
