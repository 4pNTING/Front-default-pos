import { MenuItemListProps } from "../type/menuItemType";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import CreateComponent from "./components/formCreate.component";
import UpdateComponent from "./components/formUpdate.component";
import { useEffect, useCallback, useRef, useState } from "react";
import { useMenuItemStore } from "../store/menuItemStore";
import { LOAD_MENU_ITEM, LOAD_CATEGORY } from "@/gql/queries";
import { useLazyQuery } from "@apollo/client";
import { ToastService } from "@/utils/toastService";

export const MenuItemList = ({ props }: { props: MenuItemListProps }) => {
  const {
    loadMenuItemAPI,
    searchMenuItemAPI,
    setCategoryList,
    setSelectedCategory,
    setIsActive,
    removeListenerState,
  } = useMenuItemStore();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const [loadMenuItemCall] = useLazyQuery(LOAD_MENU_ITEM, {
    fetchPolicy: "network-only",
  });

  const [loadCategoryCall] = useLazyQuery(LOAD_CATEGORY, {
    fetchPolicy: "network-only",
  });

  const refreshList = useCallback(async () => {
    await loadMenuItemAPI({
      props: { query: loadMenuItemCall },
    });
  }, [loadMenuItemAPI, loadMenuItemCall]);

  const initData = useCallback(async () => {
    try {
      const [, catRes] = await Promise.all([
        refreshList(),
        loadCategoryCall({
          variables: { input: { page: 1, limit: 1000, isActive: "active" } },
        }),
      ]);

      if (catRes?.data?.loadCategory?.category) {
        setCategoryList(catRes.data.loadCategory.category);
      }
    } catch (err) {
      ToastService.error(err instanceof Error ? err.message : props.dictionary.menuItemPage.loadError);
    }
  }, [refreshList, loadCategoryCall, setCategoryList]);

  useEffect(() => {
    void initData();
    return () => {
      removeListenerState();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [initData, removeListenerState]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      void searchMenuItemAPI({
        props: { query: loadMenuItemCall },
        keyword: value,
      });
    }, 400);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    void refreshList();
  };

  const handleStatusChange = (status: string) => {
    setIsActive(status);
    void refreshList();
  };

  return (
    <div className="space-y-4">
      <HeaderComponent
        props={props}
        searchValue={searchValue}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
      />
      <TableComponent props={props} onRefresh={refreshList} />
      <CreateComponent props={props} onSuccess={refreshList} />
      <UpdateComponent props={props} onSuccess={refreshList} />
    </div>
  );
};
