"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import CustomAvatar from "@core/components/mui/Avatar";
import { KdsProps } from "../type/kdsType";
import { useKdsStore } from "../store/kdsStore";
import { KdsHeaderComponent } from "./components/kdsHeader.component";
import { KdsTicketCardComponent } from "./components/kdsTicketCard.component";

import { LOAD_ORDER, UPDATE_ORDER_STATUS } from "@/gql/queries/order";
import { LOAD_TABLE } from "@/gql/queries/table";
import { LOAD_CATEGORY } from "@/gql/queries/category";
import { OrderType, POSTableType, IPosOrderStatus } from "@/views/pos/type/posType";
import { ToastService } from "@/utils/toastService";

export const KdsList: React.FC<{ props: KdsProps }> = ({ props }) => {
  const { lang, dictionary: dic } = props;
  const {
    statusFilter,
    stationFilter,
    audioEnabled,
    setOrders,
    setTables,
    setCategories,
    setLastUpdated,
    setIsRefetching,
  } = useKdsStore();

  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const prevOrdersCountRef = useRef<number>(0);

  // 1. Fetch Orders with Auto-Polling every 5 seconds
  const {
    data: ordersData,
    loading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery(LOAD_ORDER, {
    variables: { input: { limit: 100 } },
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  // 2. Fetch Tables
  const {
    data: tablesData,
    loading: tablesLoading,
    refetch: refetchTables,
  } = useQuery(LOAD_TABLE, {
    variables: { input: { limit: 100, isActive: "active" } },
    fetchPolicy: "cache-and-network",
  });

  // 3. Fetch Categories (Stations)
  const {
    data: categoriesData,
    refetch: refetchCategories,
  } = useQuery(LOAD_CATEGORY, {
    variables: { input: { limit: 100, isActive: "active" } },
    fetchPolicy: "cache-and-network",
  });

  // 4. Update Order Status Mutation
  const [updateOrderStatusMutation] = useMutation(UPDATE_ORDER_STATUS);

  const rawOrders: OrderType[] = useMemo(() => {
    return ordersData?.loadOrder?.order || [];
  }, [ordersData]);

  const rawTables: POSTableType[] = useMemo(() => {
    return tablesData?.loadTable?.table || [];
  }, [tablesData]);

  const rawCategories = useMemo(() => {
    return categoriesData?.loadCategory?.category || [];
  }, [categoriesData]);

  // Sync to Store
  useEffect(() => {
    setOrders(rawOrders);
  }, [rawOrders, setOrders]);

  useEffect(() => {
    setTables(rawTables);
  }, [rawTables, setTables]);

  useEffect(() => {
    setCategories(rawCategories);
  }, [rawCategories, setCategories]);

  // 1-second live ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio Chime on new orders
  const playNewOrderChime = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!audioEnabled) {
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        return;
      }
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignored if browser blocks audio before user interaction
    }
  }, [audioEnabled]);

  // Filter Active Tickets for KDS
  const filteredOrders = useMemo(() => {
    return rawOrders.filter((order) => {
      // Status filter
      if (statusFilter === "all_active") {
        if (
          order.status === IPosOrderStatus.paid ||
          order.status === IPosOrderStatus.cancelled
        ) {
          return false;
        }
      } else if (statusFilter === "confirmed") {
        if (
          order.status !== IPosOrderStatus.confirmed &&
          order.status !== IPosOrderStatus.pending
        ) {
          return false;
        }
      } else if (statusFilter === "preparing") {
        if (
          order.status !== IPosOrderStatus.preparing &&
          order.status !== "cooking"
        ) {
          return false;
        }
      } else if (statusFilter === "served") {
        if (order.status !== IPosOrderStatus.served) {
          return false;
        }
      }

      // Station filter
      if (stationFilter !== "all") {
        const items = order.items || [];
        const hasMatchingItem = items.some((item: any) => {
          return item.categoryId === stationFilter;
        });
        if (!hasMatchingItem) {
          return false;
        }
      }

      return true;
    });
  }, [rawOrders, statusFilter, stationFilter]);

  // Detect incoming orders and trigger audio alert
  useEffect(() => {
    if (filteredOrders.length > prevOrdersCountRef.current && prevOrdersCountRef.current > 0) {
      playNewOrderChime();
    }
    prevOrdersCountRef.current = filteredOrders.length;
  }, [filteredOrders.length, playNewOrderChime]);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setIsRefetching(true);
    try {
      await Promise.all([
        refetchOrders(),
        refetchTables(),
        refetchCategories(),
      ]);
      setLastUpdated(new Date());
    } catch (err: any) {
      ToastService.error(err?.message || "Failed to refresh");
    } finally {
      setIsRefetching(false);
    }
  };

  // Status transition handler from tickets
  const handleUpdateStatus = async (order: OrderType, newStatus: string) => {
    try {
      await updateOrderStatusMutation({
        variables: {
          input: {
            orderId: order._id,
            status: newStatus,
          },
        },
      });
      await refetchOrders();
      setLastUpdated(new Date());

      if (newStatus === IPosOrderStatus.preparing) {
        ToastService.success(lang === "la" ? "ເລີ່ມປຸງແຕ່ງອໍເດີແລ້ວ" : "เริ่มปรุงอาหารแล้ว");
      } else if (newStatus === IPosOrderStatus.served) {
        ToastService.success(lang === "la" ? "ເສີບອາຫານຮຽບຮ້ອຍ" : "เสิร์ฟอาหารเรียบร้อย");
      }
    } catch (err: any) {
      ToastService.error(err?.message || "Failed to update status");
    }
  };

  const getTableById = (tableId: string): POSTableType | undefined => {
    return rawTables.find((t) => t._id === tableId);
  };

  const isLoadingInitial = ordersLoading && tablesLoading && rawOrders.length === 0;

  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <CircularProgress size={44} color="warning" />
        <Typography variant="body1" color="text.secondary">
          {lang === "la" ? "ກຳລັງໂຫຼດຂໍ້ມູນຄົວ (KDS)..." : "กำลังโหลดข้อมูลครัว (KDS)..."}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. KDS Header & Controls Bar */}
      <KdsHeaderComponent
        props={props}
        onRefresh={handleRefresh}
        totalTickets={filteredOrders.length}
      />

      {/* 2. Tickets Grid Display */}
      {filteredOrders.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <CustomAvatar skin="light" variant="rounded" color="success" size={72}>
              <i className="tabler-soup text-[38px]" />
            </CustomAvatar>
            <Typography variant="h5" className="font-bold">
              {lang === "la" ? "ຄິວອາຫານໃນຄົວວ່າງ!" : "คิวอาหารในครัวว่าง!"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
              {lang === "la"
                ? "ທຸກລາຍການອາຫານຖືກປຸງແຕ່ງ ແລະ ເສີບຄົບຖ້ວນແລ້ວ. ອໍເດີໃໝ່ຈາກໜ້າຮ້ານ POS ຈະສະແດງຢູ່ນີ້ອັດຕະໂນມັດ ພ້ອມສຽງແຈ້ງເຕືອນ."
                : "ทุกรายการอาหารถูกปรุงและเสิร์ฟครบถ้วนแล้ว ออเดอร์ใหม่จากหน้าร้าน POS จะปรากฏที่นี่อัตโนมัติพร้อมเสียงเตือน"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {filteredOrders.map((order) => {
            const table = getTableById(order.tableId);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={order._id}>
                <KdsTicketCardComponent
                  order={order}
                  table={table}
                  currentTime={currentTime}
                  lang={lang}
                  onUpdateStatus={handleUpdateStatus}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default KdsList;
