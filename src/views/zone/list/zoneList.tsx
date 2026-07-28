"use client";

import { ZoneListProps, ZoneType } from "../type/zoneType";
import HeaderComponent from "./components/header.component";
import TableComponent from "./components/table.component";
import { useSession } from "next-auth/react";
import { useStore, useZoneMutations } from "../store/zoneStore";
import { useEffect, useState, useRef, useCallback } from "react";
import { delay } from "@/utils/base";
import { toast } from "react-toastify";
import LazyLoading from "@/utils/lazyLoading";
import FromInputComponent from "./components/fromCreate.component";
import FormUpdateComponent from "./components/formUpdate.component";
import { useLazyQuery } from "@apollo/client";
import { LOAD_ZONE } from "@/gql/queries/zone";

export const List = ({ props }: { props: ZoneListProps }) => {
  const { lang, dictionary: dic } = props;
  const { data } = useSession();
  const user = data?.user;

  const { removeListenerState, toggleCreateComponent, loadZoneAPI } =
    useStore();

  const [loadZoneCall] = useLazyQuery(LOAD_ZONE, {
    fetchPolicy: "network-only",
  });

  const [render, setRender] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [editingItem, setEditingItem] = useState<ZoneType | undefined>(
    undefined,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Ref to track if initial data has been loaded
  const hasFetchedRef = useRef(false);

  const init = useCallback(async () => {
    try {
      const { zoneList } = useStore.getState();
      if (zoneList) {
        hasFetchedRef.current = true;
        setRender(true);
        return;
      }

      if (hasFetchedRef.current) {
        return;
      }
      hasFetchedRef.current = true;

      await loadZoneAPI({
        props: {
          query: loadZoneCall,
          dictionary: dic,
        },
      });
    } catch (error: any) {
      hasFetchedRef.current = false;
      toast.error(error?.message );
    } finally {
      setRender(true);
    }
  }, [loadZoneAPI, loadZoneCall, dic]);

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { searchZoneAPI } = useStore.getState();

        await searchZoneAPI({
          props: {
            query: loadZoneCall,
            dictionary: dic,
          },
          keyword: value,
        });
      } catch (error: any) {
        toast.error(error.message);
      }
    }, 500);
  };

  const handleEditClick = (item: ZoneType) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingItem(undefined);
  };

  const handleEditSuccess = () => {
    // init(); // Removed to prevent reload, store updates locally
  };

  useEffect(() => {
    init();
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [user, init]);

  return (
    <>
      {render === true ? (
        // loading success
        <div className="grid grid-cols-1 gap-[15px] ">
          <HeaderComponent
            props={props}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            onGlobalFilterChange={handleGlobalFilterChange}
            loadZoneCall={loadZoneCall}
          />
          <TableComponent
            props={props}
            globalFilter={globalFilter}
            onGlobalFilterChange={handleGlobalFilterChange}
            onEditClick={handleEditClick}
            loadZoneCall={loadZoneCall}
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
