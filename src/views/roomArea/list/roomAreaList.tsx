"use client";

import React, { useEffect, useState, useRef } from "react";
import { RoomAreaListProps } from "../type/roomAreaType";
import { useStore } from "../store/roomAreaStore";
import { useSession } from "next-auth/react";
import { useLazyQuery } from "@apollo/client";
import { LOAD_ROOM_AREA } from "@/gql/queries/roomArea";
import { LOAD_ZONE } from "@/gql/queries/zone";
import { LOAD_ROOM_AREA_CATEGORY } from "@/gql/queries/roomAreaCategory";
import { toast } from "react-toastify";
import LazyLoading from "@/utils/lazyLoading";
import HeaderComponent from "../components/header.component";
import TableComponent from "../components/table.component";
import FormCreateComponent from "../components/formCreate.component";
import FormUpdateComponent from "../components/formUpdate.component";

const RoomAreaList = ({ props }: { props: RoomAreaListProps }) => {
  // Var
  const { lang, dictionary: dic } = props;
  const { data } = useSession();
  const user = data?.user;

  // State
  const [render, setRender] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks
  const {
    loadRoomAreaAPI,
    toggleCreateComponent,
    setToggleCreateComponent,
    toggleUpdateComponent,
    setToggleUpdateComponent,
    selectedItem,
    setSelectedItem,
    removeListenerState,
  } = useStore();

  const [loadRoomAreaCall] = useLazyQuery(LOAD_ROOM_AREA, {
    fetchPolicy: "network-only",
  });

  const [loadZoneCall] = useLazyQuery(LOAD_ZONE, {
    fetchPolicy: "network-only",
  });

  const [loadCategoryCall] = useLazyQuery(LOAD_ROOM_AREA_CATEGORY, {
    fetchPolicy: "network-only",
  });

  // Ref to track if initial data has been loaded
  const hasFetchedRef = useRef(false);

  // funcs
  async function init() {
    try {
      // Skip fetch if data already exists in store
      const { roomAreaList } = useStore.getState();
      if (roomAreaList && roomAreaList.length > 0 && hasFetchedRef.current) {
        setRender(true);
        return;
      }

      await loadRoomAreaAPI({
        props: {
          query: loadRoomAreaCall,
          dictionary: dic,
        },
      });

      hasFetchedRef.current = true;
      setRender(true);
    } catch (error: any) {
      toast.error(error.message);
      setRender(true);
    }
  }

  useEffect(() => {
    setRender(false);
    init();
  }, [user]);

  useEffect(() => {
    setToggleCreateComponent(false);
    setToggleUpdateComponent(false);
    return () => {
      setToggleCreateComponent(false);
      setToggleUpdateComponent(false);
      // Cleanup debounce timer on unmount
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [setToggleCreateComponent, setToggleUpdateComponent]);

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer with 500ms debounce
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { searchRoomAreaAPI } = useStore.getState();

        await searchRoomAreaAPI({
          props: {
            query: loadRoomAreaCall,
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
          {toggleCreateComponent === true ? (
            <FormCreateComponent props={props} />
          ) : toggleUpdateComponent === true ? (
            <FormUpdateComponent props={props} />
          ) : (
            <>
              <HeaderComponent
                props={props}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                onGlobalFilterChange={handleGlobalFilterChange}
                loadRoomAreaCall={loadRoomAreaCall}
                loadZoneCall={loadZoneCall}
                loadCategoryCall={loadCategoryCall}
              />
              <TableComponent
                props={props}
                globalFilter={globalFilter}
                onGlobalFilterChange={handleGlobalFilterChange}
                loadRoomAreaCall={loadRoomAreaCall}
              />
            </>
          )}
        </div>
      ) : (
        <LazyLoading />
      )}
    </>
  );
};

export default RoomAreaList;
