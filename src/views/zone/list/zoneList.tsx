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
  const [editingItem, setEditingItem] = useState<ZoneType | undefined>(
    undefined,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Ref to track if initial data has been loaded
  const hasFetchedRef = useRef(false);

  const init = useCallback(async () => {
    try {
      const { zoneList } = useStore.getState();
      if (zoneList && zoneList.length > 0) {
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
    // if (
    //   !user?.level ||
    //   !Object.values([
    //     IRoleConfigLevel.admin,
    //     IRoleConfigLevel.superAdmin,
    //   ]).includes(user?.level as IRoleConfigLevel)
    // ) {
    //   return;
    // }

    init();
  }, [user, init]);

  return (
    <>
      {render === true ? (
        // loading success
        <div className="grid grid-cols-1 gap-[15px] ">
          <HeaderComponent props={props} loadZoneCall={loadZoneCall} />
          <TableComponent
            props={props}
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
