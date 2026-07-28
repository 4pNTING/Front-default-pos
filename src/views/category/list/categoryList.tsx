"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { LOAD_CATEGORY } from "@/gql/queries/category";
import { CategoryListProps, CategoryType } from "@/views/category/type/categoryType";
import { useCategoryStore } from "@/views/category/store/categoryStore";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import FromInputComponent from "./components/formCreate.component";
import FormUpdateComponent from "./components/formUpdate.component";
import LazyLoading from "@/utils/lazyLoading";

export const List = ({ props }: { props: CategoryListProps }) => {
  const { lang, dictionary: dic } = props;
  const { data } = useSession();
  const user = data?.user;

  const { toggleCreateComponent, loadCategoryAPI } = useCategoryStore();

  const [loadCategoryCall] = useLazyQuery(LOAD_CATEGORY, {
    fetchPolicy: "network-only",
  });

  const [render, setRender] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryType | undefined>(
    undefined,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Ref to track if initial data has been loaded
  const hasFetchedRef = useRef(false);

  const init = useCallback(async () => {
    try {
      const { categoryList } = useCategoryStore.getState();
      if (categoryList && categoryList.length > 0) {
        hasFetchedRef.current = true;
        setRender(true);
        return;
      }

      if (hasFetchedRef.current) {
        return;
      }
      hasFetchedRef.current = true;

      await loadCategoryAPI({
        props: {
          query: loadCategoryCall,
          dictionary: dic,
        },
      });
    } catch (error: any) {
      hasFetchedRef.current = false;
      toast.error(error?.message);
    } finally {
      setRender(true);
    }
  }, [loadCategoryAPI, loadCategoryCall, dic]);

  const handleEditClick = (item: CategoryType) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingItem(undefined);
  };

  const handleEditSuccess = () => {};

  useEffect(() => {
    init();
  }, [user, init]);

  return (
    <>
      {render === true ? (
        // loading success
        <div className="grid grid-cols-1 gap-[15px]">
          <HeaderComponent props={props} loadCategoryCall={loadCategoryCall} />
          <TableComponent
            props={props}
            onEditClick={handleEditClick}
            loadCategoryCall={loadCategoryCall}
          />
          {toggleCreateComponent === true ? (
            <FromInputComponent props={props} />
          ) : (
            ""
          )}

          {/* Edit Modal */}
          <FormUpdateComponent
            props={props}
            item={editingItem}
            open={isEditModalOpen}
            onClose={handleEditClose}
            onSuccess={handleEditSuccess}
          />
        </div>
      ) : (
        // still loading
        <LazyLoading />
      )}
    </>
  );
};
