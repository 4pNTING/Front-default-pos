"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import CustomAvatar from "@core/components/mui/Avatar";
import { KdsProps } from "../type/kdsType";
import { useKdsStore } from "../store/kdsStore";
import { KdsHeaderComponent } from "./components/kdsHeader.component";
import { KdsTicketCardComponent } from "./components/kdsTicketCard.component";

import { LOAD_ORDER, UPDATE_ORDER_STATUS } from "@/gql/queries/order";
import { LOAD_TABLE } from "@/gql/queries/table";
import { LOAD_CATEGORY } from "@/gql/queries/category";
import { OrderType, POSTableType, IPosOrderStatus, IPosTableStatus } from "@/views/pos/type/posType";
import { ToastService } from "@/utils/toastService";

export const KdsList: React.FC<{ props: KdsProps }> = ({ props }) => {
  const { lang, dictionary: dic } = props;
  const {
    statusFilter,
    setStatusFilter,
    stationFilter,
    audioEnabled,
    showDemo,
    setShowDemo,
    setOrders,
    setTables,
    setCategories,
    setLastUpdated,
    setIsRefetching,
  } = useKdsStore();

  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const prevOrdersCountRef = useRef<number>(0);

  // Demo orders state for instant testing
  const [demoOrdersList, setDemoOrdersList] = useState<OrderType[]>([
    {
      _id: "demo_1",
      orderNumber: "1001",
      tableId: "table_demo_1",
      staffId: "staff_1",
      status: IPosOrderStatus.pending,
      note: "ບໍ່ໃສ່ຜັກຊີ / ไม่ใส่ผักชี",
      subTotal: 85000,
      discount: 0,
      total: 85000,
      createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      items: [
        {
          _id: "item_1",
          menuItemId: "m1",
          menuItemName: "ຕົ້ມຍຳກຸ້ງ (Tom Yum Kung)",
          quantity: 1,
          unitPrice: 50000,
          totalPrice: 50000,
          note: "ເຜັດໜ້ອຍ / เผ็ดน้อย",
        },
        {
          _id: "item_2",
          menuItemId: "m2",
          menuItemName: "ເຂົ້າຜັດທະເລ (Seafood Fried Rice)",
          quantity: 2,
          unitPrice: 35000,
          totalPrice: 70000,
        },
      ],
    },
    {
      _id: "demo_2",
      orderNumber: "1002",
      tableId: "table_demo_2",
      staffId: "staff_1",
      status: IPosOrderStatus.preparing,
      subTotal: 65000,
      discount: 0,
      total: 65000,
      createdAt: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
      items: [
        {
          _id: "item_3",
          menuItemId: "m3",
          menuItemName: "ລາບໝູ (Larb Moo)",
          quantity: 1,
          unitPrice: 40000,
          totalPrice: 40000,
          note: "ເຜັດກາງ / เผ็ดปานกลาง",
        },
        {
          _id: "item_4",
          menuItemId: "m4",
          menuItemName: "ຕຳໝາກຮຸ່ງ (Papaya Salad)",
          quantity: 1,
          unitPrice: 25000,
          totalPrice: 25000,
        },
      ],
    },
    {
      _id: "demo_3",
      orderNumber: "1003",
      tableId: "table_demo_3",
      staffId: "staff_1",
      status: IPosOrderStatus.preparing,
      note: "ລູກຄ້າຮີບດ່ວນ / ลูกค้ารีบด่วน",
      subTotal: 120000,
      discount: 0,
      total: 120000,
      createdAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
      items: [
        {
          _id: "item_5",
          menuItemId: "m5",
          menuItemName: "ສະເຕັກຊີ້ນງົວ (Beef Steak)",
          quantity: 2,
          unitPrice: 60000,
          totalPrice: 120000,
          note: "Medium Rare",
        },
      ],
    },
    {
      _id: "demo_4",
      orderNumber: "1004",
      tableId: "table_demo_4",
      staffId: "staff_1",
      status: IPosOrderStatus.served,
      subTotal: 45000,
      discount: 0,
      total: 45000,
      createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      items: [
        {
          _id: "item_6",
          menuItemId: "m6",
          menuItemName: "ກາເຟເຢັນ (Iced Latte)",
          quantity: 2,
          unitPrice: 20000,
          totalPrice: 40000,
        },
      ],
    },
  ]);

  const demoTables: POSTableType[] = useMemo(() => [
    { _id: "table_demo_1", number: "01", zoneId: "z1", zoneName: "VIP Zone", capacity: 4, status: IPosTableStatus.occupied, isActive: "active" },
    { _id: "table_demo_2", number: "04", zoneId: "z2", zoneName: "Indoor", capacity: 4, status: IPosTableStatus.occupied, isActive: "active" },
    { _id: "table_demo_3", number: "07", zoneId: "z3", zoneName: "Outdoor", capacity: 6, status: IPosTableStatus.occupied, isActive: "active" },
    { _id: "table_demo_4", number: "02", zoneId: "z1", zoneName: "Terrace", capacity: 2, status: IPosTableStatus.occupied, isActive: "active" },
  ], []);

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

  // Source list: use demo if showDemo is enabled, or fallback to demo if no orders and showDemo toggled
  const activeSourceOrders = useMemo(() => {
    if (showDemo) {
      return demoOrdersList;
    }
    return rawOrders;
  }, [showDemo, demoOrdersList, rawOrders]);

  // Filter Active Tickets for KDS
  const filteredOrders = useMemo(() => {
    return activeSourceOrders.filter((order) => {
      // Status filter
      if (statusFilter === "all") {
        return true;
      }
      if (statusFilter === "all_active") {
        if (
          order.status === IPosOrderStatus.paid ||
          order.status === IPosOrderStatus.completed ||
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
  }, [activeSourceOrders, statusFilter, stationFilter]);

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
    // If it's a demo order, update local demo state
    if (order._id.startsWith("demo_")) {
      setDemoOrdersList((prev) =>
        prev.map((o) => {
          if (o._id === order._id) {
            return { ...o, status: newStatus as any };
          }
          return o;
        })
      );
      if (newStatus === IPosOrderStatus.preparing) {
        ToastService.success(lang === "la" ? "ເລີ່ມປຸງແຕ່ງອໍເດີແລ້ວ" : "เริ่มปรุงอาหารแล้ว");
      } else if (newStatus === IPosOrderStatus.served) {
        ToastService.success(lang === "la" ? "ເສີບອາຫານຮຽບຮ້ອຍ" : "เสิร์ฟอาหารเรียบร้อย");
      }
      return;
    }

    // Real backend mutation
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
    if (showDemo) {
      return demoTables.find((t) => t._id === tableId);
    }
    const found = rawTables.find((t) => t._id === tableId);
    if (found) {
      return found;
    }
    return demoTables.find((t) => t._id === tableId);
  };

  const isLoadingInitial = ordersLoading && rawOrders.length === 0 && !showDemo;

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

  // Render empty state card
  const renderEmptyState = () => {
    if (rawOrders.length > 0 && !showDemo) {
      return (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <CustomAvatar skin="light" variant="rounded" color="info" size={72}>
              <i className="tabler-checkup-list text-[38px]" />
            </CustomAvatar>
            <Typography variant="h5" className="font-bold">
              {lang === "la"
                ? "ບໍ່ມີອໍເດີທີ່ຄ້າງປຸງແຕ່ງໃນຄິວ"
                : "ไม่มีออเดอร์ที่ค้างปรุงในคิว"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
              {lang === "la"
                ? `ມີອໍເດີໃນລະບົບ ${rawOrders.length} ລາຍການ ແຕ່ທຸກລາຍການຖືກຊຳລະເງິນ ຫຼື ເສີບຄົບຖ້ວນແລ້ວ. ທ່ານສາມາດເລືອກແຖບ "ອໍເດີທັງໝົດ" ເພື່ອກວດສອບປະຫວັດໄດ້.`
                : `มีออเดอร์ในระบบ ${rawOrders.length} รายการ แต่ทุกรายการถูกชำระเงินหรือเสิร์ฟครบถ้วนแล้ว คุณสามารถเลือกแท็บ "ออเดอร์ทั้งหมด" เพื่อตรวจสอบประวัติได้`}
            </Typography>
            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<i className="tabler-list-details" />}
                onClick={() => setStatusFilter("all")}
              >
                {lang === "la"
                  ? `ເບິ່ງອໍເດີທັງໝົດ (${rawOrders.length})`
                  : `ดูออเดอร์ทั้งหมด (${rawOrders.length})`}
              </Button>
              <Button
                variant="tonal"
                color="warning"
                size="small"
                startIcon={<i className="tabler-eye" />}
                onClick={() => setShowDemo(true)}
              >
                {lang === "la" ? "ເປີດອໍເດີຕົວຢ່າງ (Demo)" : "เปิดออเดอร์ตัวอย่าง (Demo)"}
              </Button>
              <Link href={`/${lang}/pos`} passHref>
                <Button
                  variant="tonal"
                  color="primary"
                  size="small"
                  startIcon={<i className="tabler-cash-register" />}
                >
                  {lang === "la" ? "ສັ່ງອໍເດີໃໝ່ໃນ POS" : "สั่งออเดอร์ใหม่ใน POS"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <CustomAvatar skin="light" variant="rounded" color="success" size={72}>
            <i className="tabler-soup text-[38px]" />
          </CustomAvatar>
          <Typography variant="h5" className="font-bold">
            {lang === "la" ? "ຄິວອາຫານໃນຄົວວ່າງ!" : "คิวอาหารในครัวว่าง!"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460 }}>
            {lang === "la"
              ? "ຍັງບໍ່ມີອໍເດີທີ່ກຳລັງປຸງແຕ່ງ. ອໍເດີໃໝ່ຈາກໜ້າຮ້ານ POS ຈະສະແດງຢູ່ນີ້ອັດຕະໂນມັດ ພ້ອມສຽງແຈ້ງເຕືອນ ຫຼື ທ່ານສາມາດເປີດອໍເດີຕົວຢ່າງເພື່ອທົດລອງລະບົບໄດ້."
              : "ยังไม่มีออเดอร์ที่กำลังปรุง ออเดอร์ใหม่จากหน้าร้าน POS จะปรากฏที่นี่อัตโนมัติพร้อมเสียงเตือน หรือคุณสามารถเปิดออเดอร์ตัวอย่างเพื่อทดลองระบบได้"}
          </Typography>
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <Button
              variant="contained"
              color="warning"
              size="small"
              startIcon={<i className="tabler-eye" />}
              onClick={() => setShowDemo(true)}
            >
              {lang === "la" ? "ເປີດອໍເດີຕົວຢ່າງ (Demo Tickets)" : "เปิดออเดอร์ตัวอย่าง (Demo Tickets)"}
            </Button>
            <Link href={`/${lang}/pos`} passHref>
              <Button
                variant="tonal"
                color="primary"
                size="small"
                startIcon={<i className="tabler-cash-register" />}
              >
                {lang === "la" ? "ໄປໜ້າ POS ເພື່ອສັ່ງອາຫານ" : "ไปหน้า POS เพื่อสั่งอาหาร"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

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
        renderEmptyState()
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
