"use client";
import { TableListProps } from "../type/tableType";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import CreateComponent from "./components/formCreate.component";
import UpdateComponent from "./components/formUpdate.component";
import { useEffect, useCallback, useRef, useState } from "react";
import { useTableStore } from "../store/tableStore";
import { LOAD_TABLE, LOAD_ZONE } from "@/gql/queries";
import { useLazyQuery } from "@apollo/client";
import { ToastService } from "@/utils/toastService";

export const TableList = ({ props }: { props: TableListProps }) => {
  const {
    loadTableAPI,
    searchTableAPI,
    setZoneList,
    setSelectedZone,
    setIsActive,
    removeListenerState,
  } = useTableStore();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const [loadTableCall] = useLazyQuery(LOAD_TABLE, {
    fetchPolicy: "network-only",
  });

  const [loadZoneCall] = useLazyQuery(LOAD_ZONE, {
    fetchPolicy: "network-only",
  });

  const refreshList = useCallback(async () => {
    await loadTableAPI({
      props: { query: loadTableCall },
    });
  }, [loadTableAPI, loadTableCall]);

  const hasFetchedRef = useRef(false);

  const initData = useCallback(async () => {
    try {
      const { tableList } = useTableStore.getState();
      if (tableList && tableList.length > 0) {
        hasFetchedRef.current = true;
        return;
      }

      if (hasFetchedRef.current) {
        return;
      }
      hasFetchedRef.current = true;

      const [, zoneRes] = await Promise.all([
        refreshList(),
        loadZoneCall({
          variables: { input: { page: 1, limit: 1000, isActive: "active" } },
        }),
      ]);

      if (zoneRes?.data?.loadZone?.zone) {
        setZoneList(zoneRes.data.loadZone.zone);
      }
    } catch (err) {
      hasFetchedRef.current = false;
      ToastService.error(
        err instanceof Error
          ? err.message
          : props.dictionary?.tablePage?.loadError || "Error loading tables"
      );
    }
  }, [refreshList, loadZoneCall, setZoneList, props.dictionary]);

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
      void searchTableAPI({
        props: { query: loadTableCall },
        keyword: value,
      });
    }, 400);
  };

  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
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
        onZoneChange={handleZoneChange}
        onStatusChange={handleStatusChange}
      />
      <TableComponent props={props} onRefresh={refreshList} />
      <CreateComponent props={props} onSuccess={refreshList} />
      <UpdateComponent props={props} onSuccess={refreshList} />
    </div>
  );
};

export default TableList;
