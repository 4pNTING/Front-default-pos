"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "@apollo/client";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useTheme } from "@mui/material/styles";

// Vuexy Components & Style Imports
import HorizontalWithSubtitle from "@/components/card-statistics/HorizontalWithSubtitle";
import CustomAvatar from "@core/components/mui/Avatar";
import CustomChip from "@core/components/mui/Chip";
import OptionMenu from "@core/components/option-menu";
import tableStyles from "@core/styles/table.module.css";

// GraphQL Queries
import { LOAD_ORDER } from "@/gql/queries/order";
import { LOAD_TABLE } from "@/gql/queries/table";
import { LOAD_ZONE } from "@/gql/queries/zone";
import { LOAD_MENU_ITEM } from "@/gql/queries/menuItem";
import { LOAD_CUSTOMER } from "@/gql/queries/customer";

// Type Imports
import { OrderType, POSTableType, IPosTableStatus, IPosOrderStatus } from "@/views/pos/type/posType";
import type { ApexOptions } from "apexcharts";

// Dynamic ApexCharts (Disable SSR)
const AppReactApexCharts = dynamic(() => import("@/libs/styles/AppReactApexCharts"), {
  ssr: false,
});

export interface PosDashboardViewProps {
  dictionary: any;
  lang: string;
}

export const PosDashboardView: React.FC<PosDashboardViewProps> = ({ dictionary: dic, lang }) => {
  const theme = useTheme();
  const [isRefetching, setIsRefetching] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // 1. Fetch live orders from backend
  const {
    data: ordersData,
    loading: ordersLoading,
    refetch: refetchOrders,
  } = useQuery(LOAD_ORDER, {
    variables: { input: { limit: 100 } },
    fetchPolicy: "cache-and-network",
  });

  // 2. Fetch live tables from backend
  const {
    data: tablesData,
    loading: tablesLoading,
    refetch: refetchTables,
  } = useQuery(LOAD_TABLE, {
    variables: { input: { limit: 100, isActive: "active" } },
    fetchPolicy: "cache-and-network",
  });

  // 3. Fetch zones
  const {
    data: zonesData,
    loading: zonesLoading,
    refetch: refetchZones,
  } = useQuery(LOAD_ZONE, {
    variables: { input: { limit: 100, isActive: "active" } },
    fetchPolicy: "cache-and-network",
  });

  // 4. Fetch menu items
  const {
    data: menuItemsData,
    loading: menuLoading,
    refetch: refetchMenuItems,
  } = useQuery(LOAD_MENU_ITEM, {
    variables: { input: { limit: 200, isActive: "active" } },
    fetchPolicy: "cache-and-network",
  });

  // 5. Fetch registered customers
  const {
    data: customersData,
    loading: customersLoading,
    refetch: refetchCustomers,
  } = useQuery(LOAD_CUSTOMER, {
    variables: { input: { limit: 200, isActive: "active" } },
    fetchPolicy: "cache-and-network",
  });

  const orders: OrderType[] = useMemo(() => ordersData?.loadOrder?.order || [], [ordersData]);
  const tables: POSTableType[] = useMemo(() => tablesData?.loadTable?.table || [], [tablesData]);
  const zones: { _id: string; name: string }[] = useMemo(() => zonesData?.loadZone?.zone || [], [zonesData]);
  const menuItems = useMemo(() => menuItemsData?.loadMenuItem?.menuItem || [], [menuItemsData]);
  const customers = useMemo(() => customersData?.loadCustomer?.customer || [], [customersData]);

  const isLoadingInitial = ordersLoading && tablesLoading && orders.length === 0;

  // Manual Refresh Handler
  const handleRefreshAll = async () => {
    setIsRefetching(true);
    try {
      await Promise.all([
        refetchOrders(),
        refetchTables(),
        refetchZones(),
        refetchMenuItems(),
        refetchCustomers(),
      ]);
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.error("Dashboard refetch error:", err);
    } finally {
      setIsRefetching(false);
    }
  };

  // KPI Calculations
  const kpiStats = useMemo(() => {
    let revenue = 0;
    let completedCount = 0;
    let activeCount = 0;
    let cancelledCount = 0;

    for (const order of orders) {
      if (order.status === IPosOrderStatus.paid || order.status === IPosOrderStatus.completed) {
        revenue += Number(order.total) || 0;
        completedCount += 1;
      } else if (order.status === IPosOrderStatus.cancelled) {
        cancelledCount += 1;
      } else {
        activeCount += 1;
      }
    }

    const totalOrders = orders.length;

    let avgBill = 0;
    if (completedCount > 0) {
      avgBill = Math.round(revenue / completedCount);
    }

    // Tables Occupancy
    const totalTables = tables.length;
    let occupiedTables = 0;
    let availableTables = 0;

    for (const table of tables) {
      if (table.status === IPosTableStatus.occupied) {
        occupiedTables += 1;
      } else {
        availableTables += 1;
      }
    }

    let occupancyRate = 0;
    if (totalTables > 0) {
      occupancyRate = Math.round((occupiedTables / totalTables) * 100);
    }

    return {
      revenue,
      totalOrders,
      completedCount,
      activeCount,
      cancelledCount,
      avgBill,
      totalTables,
      occupiedTables,
      availableTables,
      occupancyRate,
      totalCustomers: customers.length,
      totalMenuItems: menuItems.length,
    };
  }, [orders, tables, customers, menuItems]);

  // Top 5 Best-Selling Dishes
  const topDishes = useMemo(() => {
    const itemMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    let grandTotalQty = 0;

    for (const order of orders) {
      if (order.status !== IPosOrderStatus.cancelled && order.items) {
        for (const it of order.items) {
          const key = it.menuItemName || "Unnamed";
          if (!itemMap[key]) {
            itemMap[key] = { name: key, quantity: 0, revenue: 0 };
          }
          const q = Number(it.quantity) || 1;
          const p = Number(it.totalPrice) || Number(it.unitPrice) * q || 0;
          itemMap[key].quantity += q;
          itemMap[key].revenue += p;
          grandTotalQty += q;
        }
      }
    }

    const sorted = Object.values(itemMap).sort((a, b) => b.quantity - a.quantity);
    const top5 = sorted.slice(0, 5);

    return top5.map((item, index) => {
      let percent = 0;
      if (grandTotalQty > 0) {
        percent = Math.round((item.quantity / grandTotalQty) * 100);
      }
      return {
        rank: index + 1,
        name: item.name,
        quantity: item.quantity,
        revenue: item.revenue,
        percent,
      };
    });
  }, [orders]);

  // Zone & Table Occupancy
  const zoneStats = useMemo(() => {
    if (!zones || zones.length === 0) return [];

    return zones.map((zone) => {
      const zoneTables = tables.filter((t) => t.zoneId === zone._id);
      const total = zoneTables.length;
      let occupied = 0;
      let available = 0;

      for (const t of zoneTables) {
        if (t.status === IPosTableStatus.occupied) {
          occupied += 1;
        } else {
          available += 1;
        }
      }

      let rate = 0;
      if (total > 0) {
        rate = Math.round((occupied / total) * 100);
      }

      return {
        _id: zone._id,
        name: zone.name,
        total,
        occupied,
        available,
        rate,
      };
    });
  }, [zones, tables]);

  // Recent Orders (Top 7)
  const recentOrders = useMemo(() => {
    const list = [...orders];
    list.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });
    return list.slice(0, 7);
  }, [orders]);

  // Sales Trend Chart (Group by Day / Order Batch)
  const salesChartData = useMemo(() => {
    const dateMap: Record<string, { date: string; sales: number; count: number }> = {};

    // Group completed orders by date
    for (const order of orders) {
      if ((order.status === IPosOrderStatus.paid || order.status === IPosOrderStatus.completed) && order.createdAt) {
        const d = new Date(order.createdAt);
        const dateKey = `${d.getMonth() + 1}/${d.getDate()}`;
        if (!dateMap[dateKey]) {
          dateMap[dateKey] = { date: dateKey, sales: 0, count: 0 };
        }
        dateMap[dateKey].sales += Number(order.total) || 0;
        dateMap[dateKey].count += 1;
      }
    }

    const categories = Object.keys(dateMap);
    let salesSeries: number[] = [];
    let countSeries: number[] = [];

    if (categories.length > 0) {
      salesSeries = categories.map((cat) => Math.round(dateMap[cat].sales / 1000));
      countSeries = categories.map((cat) => dateMap[cat].count);
    } else {
      categories.push("Today");
      salesSeries.push(Math.round(kpiStats.revenue / 1000));
      countSeries.push(kpiStats.completedCount);
    }

    return {
      categories,
      salesSeries,
      countSeries,
    };
  }, [orders, kpiStats.revenue, kpiStats.completedCount]);

  // Helpers with strict NO nested ternary operators
  const getDashboardTitle = (): string => {
    if (lang === "la") {
      return "ພາບລວມລະບົບຮ້ານອາຫານ & ຍອດຂາຍ";
    }
    return "ภาพรวมระบบร้านอาหาร & ยอดขาย";
  };

  const getDashboardSubtitle = (): string => {
    const timeStr = lastRefreshedAt.toLocaleTimeString();
    if (lang === "la") {
      return `ຂໍ້ມູນຈິງຈາກລະບົບ POS • ອັບເດດລ່າສຸດ: ${timeStr}`;
    }
    return `ข้อมูลสดจากระบบ POS • อัปเดตล่าสุด: ${timeStr}`;
  };

  const getLiveChipLabel = (): string => {
    if (lang === "la") {
      return "ຂໍ້ມູນ Real-time";
    }
    return "ข้อมูล Real-time";
  };

  const getRefreshTooltip = (): string => {
    if (lang === "la") {
      return "ຣີເຟຣຊຂໍ້ມູນໃໝ່";
    }
    return "รีเฟรชข้อมูล";
  };

  const getRefreshButtonLabel = (): string => {
    if (lang === "la") {
      return "ຣີເຟຣຊ";
    }
    return "รีเฟรช";
  };

  const getPosButtonLabel = (): string => {
    if (lang === "la") {
      return "ເປີດລະບົບຂາຍ (POS)";
    }
    return "เปิดระบบขาย (POS)";
  };

  const getRevenueTitle = (): string => {
    if (lang === "la") {
      return "ຍອດຂາຍລວມ";
    }
    return "ยอดขายรวม";
  };

  const getRevenueSubtitle = (): string => {
    if (lang === "la") {
      return `${kpiStats.completedCount} ບິນທີ່ຊຳລະແລ້ວ`;
    }
    return `${kpiStats.completedCount} บิลที่ชำระแล้ว`;
  };

  const getOrdersTitle = (): string => {
    if (lang === "la") {
      return "ອໍເດີທັງໝົດ";
    }
    return "ออเดอร์ทั้งหมด";
  };

  const getOrdersSubtitle = (): string => {
    if (lang === "la") {
      return `ກຳລັງດຳເນີນ: ${kpiStats.activeCount}`;
    }
    return `กำลังดำเนินการ: ${kpiStats.activeCount}`;
  };

  const getOccupancyTitle = (): string => {
    if (lang === "la") {
      return "ອັດຕາຄອງໂຕະ";
    }
    return "อัตราครองโต๊ะ";
  };

  const getOccupancySubtitle = (): string => {
    if (lang === "la") {
      return `ມີແຂກ: ${kpiStats.occupiedTables}/${kpiStats.totalTables} ໂຕະ`;
    }
    return `มีลูกค้า: ${kpiStats.occupiedTables}/${kpiStats.totalTables} โต๊ะ`;
  };

  const getAvgBillTitle = (): string => {
    if (lang === "la") {
      return "ຍອດສະເລ່ຍຕໍ່ບິນ";
    }
    return "เฉลี่ยต่อบิล";
  };

  const getAvgBillSubtitle = (): string => {
    if (lang === "la") {
      return "ຕໍ່ບິນທີ່ເຊັກແລ້ວ";
    }
    return "ต่อบิลที่ปิดยอด";
  };

  const getCustomersTitle = (): string => {
    if (lang === "la") {
      return "ສະມາຊິກໃນລະບົບ";
    }
    return "สมาชิกลูกค้า";
  };

  const getCustomersSubtitle = (): string => {
    if (lang === "la") {
      return `${kpiStats.totalMenuItems} ລາຍການເມນູ`;
    }
    return `${kpiStats.totalMenuItems} เมนูทั้งหมด`;
  };

  const getSalesChartTitle = (): string => {
    if (lang === "la") {
      return "ແນວໂນ້ມຍອດຂາຍ & ຈຳນວນບິນ";
    }
    return "แนวโน้มยอดขาย & จำนวนบิล";
  };

  const getSalesChartSubheader = (): string => {
    if (lang === "la") {
      return "ສະຫຼຸບຍອດຂາຍລາຍວັນຈາກບິນຊຳລະເງິນຕົວຈິງ";
    }
    return "สรุปยอดขายรายวันจากบิลชำระเงินจริง";
  };

  const getDonutChartTitle = (): string => {
    if (lang === "la") {
      return "ສະັດສ່ວນສະຖານະອໍເດີ";
    }
    return "สัดส่วนสถานะออเดอร์";
  };

  const getDonutChartSubheader = (): string => {
    if (lang === "la") {
      return `ທັງໝົດ ${kpiStats.totalOrders} ອໍເດີ`;
    }
    return `ทั้งหมด ${kpiStats.totalOrders} ออเดอร์ในระบบ`;
  };

  const getTopDishesTitle = (): string => {
    if (lang === "la") {
      return "🔥 5 ອັນດັບເມນູຂາຍດີທີ່ສຸດ";
    }
    return "🔥 5 อันดับเมนูขายดีที่สุด";
  };

  const getTopDishesSubheader = (): string => {
    if (lang === "la") {
      return "ຄຳນວນຈາກຈຳນວນຈານທີ່ຂາຍໄດ້ທັງໝົດ";
    }
    return "คำนวณจากจำนวนจานที่ขายได้ทั้งหมด";
  };

  const getTopDishesEmptyText = (): string => {
    if (lang === "la") {
      return "ຍັງບໍ່ມີຂໍ້ມູນເມນູທີ່ສັ່ງ";
    }
    return "ยังไม่มีข้อมูลเมนูที่ขาย";
  };

  const getZoneStatsTitle = (): string => {
    if (lang === "la") {
      return "🗺️ ສະຖານະໂຕະແຍກຕາມໂຊນ";
    }
    return "🗺️ สถานะโต๊ะแยกตามโซน";
  };

  const getZoneStatsSubheader = (): string => {
    if (lang === "la") {
      return "ອັດຕາການຄອງໂຕະໃນແຕ່ລະພື້ນທີ່ຂອງຮ້ານ";
    }
    return "อัตราการครองโต๊ะในแต่ละพื้นที่ของร้าน";
  };

  const getZoneStatsEmptyText = (): string => {
    if (lang === "la") {
      return "ບໍ່ມີຂໍ້ມູນໂຊນ";
    }
    return "ไม่มีข้อมูลโซน";
  };

  const getRecentOrdersTitle = (): string => {
    if (lang === "la") {
      return "📋 ລາຍການອໍເດີຫຼ້າສຸດ";
    }
    return "📋 รายการออเดอร์ล่าสุด";
  };

  const getRecentOrdersSubheader = (): string => {
    if (lang === "la") {
      return "ອໍເດີທີ່ເຂົ້າມາຫຼ້າສຸດໃນລະບົບ";
    }
    return "ออเดอร์ล่าสุดที่บันทึกในระบบ POS";
  };

  const getRecentOrdersEmptyText = (): string => {
    if (lang === "la") {
      return "ບໍ່ມີຂໍ້ມູນອໍເດີ";
    }
    return "ไม่มีข้อมูลออเดอร์";
  };

  const getRecentOrdersActionLabel = (): string => {
    if (lang === "la") {
      return "ເບິ່ງໃນ POS ທັງໝົດ";
    }
    return "ดูใน POS ทั้งหมด";
  };

  const getOrderHeader = (): string => {
    if (lang === "la") {
      return "ເລກອໍເດີ";
    }
    return "เลขออเดอร์";
  };

  const getTableHeader = (): string => {
    if (lang === "la") {
      return "ໂຕະ";
    }
    return "โต๊ะ";
  };

  const getItemsHeader = (): string => {
    if (lang === "la") {
      return "ລາຍການອາຫານ";
    }
    return "รายการอาหาร";
  };

  const getTotalHeader = (): string => {
    if (lang === "la") {
      return "ຍອດລວມ";
    }
    return "ยอดรวม";
  };

  const getStatusHeader = (): string => {
    if (lang === "la") {
      return "ສະຖານະ";
    }
    return "สถานะ";
  };

  const getTimeHeader = (): string => {
    if (lang === "la") {
      return "ເວລາ";
    }
    return "เวลา";
  };

  const getDishUnitLabel = (): string => {
    if (lang === "la") {
      return "ຈານ";
    }
    return "จาน";
  };

  const getTableUnitLabel = (): string => {
    if (lang === "la") {
      return "ໂຕະ";
    }
    return "โต๊ะ";
  };

  const getRankMedal = (rank: number): string => {
    if (rank === 1) {
      return "🥇";
    }
    if (rank === 2) {
      return "🥈";
    }
    if (rank === 3) {
      return "🥉";
    }
    return `#${rank}`;
  };

  const getRankColor = (rank: number): "primary" | "warning" | "info" | "secondary" => {
    if (rank === 1) {
      return "primary";
    }
    if (rank === 2) {
      return "warning";
    }
    if (rank === 3) {
      return "info";
    }
    return "secondary";
  };

  const getZoneChipColor = (rate: number): "success" | "warning" | "error" => {
    if (rate >= 80) {
      return "error";
    }
    if (rate >= 40) {
      return "warning";
    }
    return "success";
  };

  const getProgressBarColor = (chipColor: "success" | "warning" | "error"): string => {
    if (chipColor === "error") {
      return "var(--mui-palette-error-main)";
    }
    if (chipColor === "warning") {
      return "var(--mui-palette-warning-main)";
    }
    return "var(--mui-palette-success-main)";
  };

  const getStatusLabel = (status: string): string => {
    if (status === IPosOrderStatus.paid || status === IPosOrderStatus.completed) {
      if (lang === "la") {
        return "ຊຳລະແລ້ວ";
      }
      return "ชำระแล้ว";
    }
    if (status === IPosOrderStatus.served) {
      if (lang === "la") {
        return "ເສີບແລ້ວ";
      }
      return "เสิร์ฟแล้ว";
    }
    if (status === IPosOrderStatus.preparing || status === IPosOrderStatus.cooking) {
      if (lang === "la") {
        return "ກຳລັງປຸງ";
      }
      return "กำลังปรุง";
    }
    if (status === IPosOrderStatus.confirmed) {
      if (lang === "la") {
        return "ຢືນຢັນແລ້ວ";
      }
      return "ยืนยันแล้ว";
    }
    if (status === IPosOrderStatus.pending) {
      if (lang === "la") {
        return "ລໍຖ້າ";
      }
      return "รอดำเนินการ";
    }
    if (status === IPosOrderStatus.cancelled) {
      if (lang === "la") {
        return "ຍົກເລີກ";
      }
      return "ยกเลิก";
    }
    return status;
  };

  const getStatusChipColor = (
    status: string
  ): "success" | "warning" | "info" | "error" | "default" | "secondary" | "primary" => {
    if (status === IPosOrderStatus.paid || status === IPosOrderStatus.completed) {
      return "success";
    }
    if (status === IPosOrderStatus.served) {
      return "info";
    }
    if (
      status === IPosOrderStatus.preparing ||
      status === IPosOrderStatus.cooking ||
      status === IPosOrderStatus.confirmed
    ) {
      return "warning";
    }
    if (status === IPosOrderStatus.pending) {
      return "secondary";
    }
    if (status === IPosOrderStatus.cancelled) {
      return "error";
    }
    return "default";
  };

  const formatPrice = (val: number): string => {
    if (!val || isNaN(val)) {
      return "0 ₭";
    }
    return `${val.toLocaleString()} ₭`;
  };

  const getTableNumberById = (tableId: string): string => {
    const found = tables.find((t) => t._id === tableId);
    if (found) {
      return `${found.number}`;
    }
    return "-";
  };

  const formatTimeAgo = (dateStr?: string): string => {
    if (!dateStr) {
      return "-";
    }
    const orderDate = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) {
      if (lang === "la") {
        return "ມື້ກີ້";
      }
      return "เมื่อสักครู่";
    }
    if (diffMin < 60) {
      if (lang === "la") {
        return `${diffMin} ນາທີກ່ອນ`;
      }
      return `${diffMin} นาทีที่แล้ว`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      if (lang === "la") {
        return `${diffHours} ຊົ່ວໂມງກ່ອນ`;
      }
      return `${diffHours} ชม. ที่แล้ว`;
    }
    return orderDate.toLocaleDateString();
  };

  const getRefreshIconClass = (): string => {
    if (isRefetching) {
      return "tabler-refresh animate-spin";
    }
    return "tabler-refresh";
  };

  const renderOtherItemsText = (otherCount: number, itemCount: number): string => {
    if (otherCount <= 0) {
      return "";
    }
    if (lang === "la") {
      return `+${otherCount} ລາຍການອື່ນ (${itemCount} ຈານ)`;
    }
    return `+${otherCount} รายการอื่น (${itemCount} จาน)`;
  };

  // ApexCharts Configs
  const yaxisSalesTitle = lang === "la" ? "ຍອດຂາຍ (ພັນກີບ / k LAK)" : "ยอดขาย (k LAK)";
  const yaxisOrdersTitle = lang === "la" ? "ຈຳນວນບິນ (Orders)" : "จำนวนบิล (Orders)";
  const seriesSalesName = lang === "la" ? "ຍອດຂາຍ (LAK)" : "ยอดขาย (LAK)";
  const seriesOrdersName = lang === "la" ? "ຈຳນວນບິນ (Orders)" : "จำนวนบิล (Orders)";
  const donutTotalLabel = lang === "la" ? "ອໍເດີທັງໝົດ" : "ออเดอร์ทั้งหมด";

  const chartTooltipTheme: "dark" | "light" = theme.palette.mode === "dark" ? "dark" : "light";

  const salesChartOptions: ApexOptions = {
    chart: {
      type: "area",
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: [3, 2] },
    colors: ["var(--mui-palette-primary-main)", "var(--mui-palette-success-main)"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.8,
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: salesChartData.categories,
      labels: {
        style: {
          colors: "var(--mui-palette-text-secondary)",
          fontSize: "12px",
          fontFamily: theme.typography.fontFamily,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: {
          text: yaxisSalesTitle,
          style: { color: "var(--mui-palette-primary-main)", fontSize: "11px", fontWeight: 500 },
        },
        labels: {
          formatter: (val: number) => `${val.toLocaleString()}k`,
          style: { colors: "var(--mui-palette-text-secondary)", fontSize: "11px", fontFamily: theme.typography.fontFamily },
        },
      },
      {
        opposite: true,
        title: {
          text: yaxisOrdersTitle,
          style: { color: "var(--mui-palette-success-main)", fontSize: "11px", fontWeight: 500 },
        },
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { colors: "var(--mui-palette-text-secondary)", fontSize: "11px", fontFamily: theme.typography.fontFamily },
        },
      },
    ],
    tooltip: {
      theme: chartTooltipTheme,
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, { seriesIndex }) => {
          if (seriesIndex === 0) {
            return `${(val * 1000).toLocaleString()} ₭`;
          }
          const unit = lang === "la" ? "ບິນ" : "บิล";
          return `${val} ${unit}`;
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "var(--mui-palette-text-primary)" },
    },
    grid: {
      borderColor: "var(--mui-palette-divider)",
      strokeDashArray: 4,
    },
  };

  const salesChartSeries = [
    {
      name: seriesSalesName,
      data: salesChartData.salesSeries,
    },
    {
      name: seriesOrdersName,
      data: salesChartData.countSeries,
    },
  ];

  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
      parentHeightOffset: 0,
    },
    labels: [
      lang === "la" ? "ສຳເລັດແລ້ວ (Completed)" : "สำเร็จแล้ว (Completed)",
      lang === "la" ? "ກຳລັງດຳເນີນການ (Active)" : "กำลังดำเนินการ (Active)",
      lang === "la" ? "ຍົກເລີກ (Cancelled)" : "ยกเลิก (Cancelled)",
    ],
    colors: ["var(--mui-palette-success-main)", "var(--mui-palette-warning-main)", "var(--mui-palette-error-main)"],
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      labels: { colors: "var(--mui-palette-text-primary)" },
    },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: donutTotalLabel,
              formatter: () => `${kpiStats.totalOrders}`,
              color: "var(--mui-palette-text-primary)",
            },
          },
        },
      },
    },
  };

  const donutSeries = [
    kpiStats.completedCount,
    kpiStats.activeCount,
    kpiStats.cancelledCount,
  ];

  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <CircularProgress size={44} color="primary" />
        <Typography variant="body1" color="text.secondary">
          {lang === "la" ? "ກຳລັງໂຫຼດຂໍ້ມູນ Dashboard..." : "กำลังโหลดข้อมูล Dashboard..."}
        </Typography>
      </div>
    );
  }

  return (
    <Grid container spacing={6}>
      {/* 1. Header Banner & Action Bar (Vuexy Standard) */}
      <Grid item xs={12}>
        <Card>
          <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
            <div className="flex gap-2.5 flex-col">
              <Breadcrumbs
                separator={<span style={{ margin: "0 8px" }}>›</span>}
                aria-label="breadcrumb"
              >
                <Link
                  className="text-textSecondary hover:underline hover:underline-offset-1 text-sm"
                  href={`/${lang}`}
                >
                  {dic?.pageBreadcrumbs?.homePage || (lang === "la" ? "ໜ້າຫຼັກ" : "หน้าหลัก")}
                </Link>
                <Typography color="text.primary" className="font-semibold text-sm">
                  {dic?.dashboard || (lang === "la" ? "ແດຊບອດ" : "แดชบอร์ด")}
                </Typography>
              </Breadcrumbs>
              <div className="flex items-center gap-3">
                <CustomAvatar skin="light" variant="rounded" color="primary" size={44}>
                  <i className="tabler-chart-pie text-[24px]" />
                </CustomAvatar>
                <div>
                  <div className="flex items-center gap-2">
                    <Typography variant="h4" className="font-bold">
                      {getDashboardTitle()}
                    </Typography>
                    <CustomChip
                      round="true"
                      size="small"
                      variant="tonal"
                      color="primary"
                      label={getLiveChipLabel()}
                    />
                  </div>
                  <Typography variant="body2" color="text.secondary">
                    {getDashboardSubtitle()}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Tooltip title={getRefreshTooltip()}>
                <Button
                  variant="tonal"
                  color="secondary"
                  onClick={handleRefreshAll}
                  disabled={isRefetching}
                  startIcon={<i className={getRefreshIconClass()} />}
                >
                  {getRefreshButtonLabel()}
                </Button>
              </Tooltip>

              <Link href={`/${lang}/pos`} passHref>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<i className="tabler-device-laptop" />}
                >
                  {getPosButtonLabel()}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* 2. Top 5 Key Metrics (Vuexy HorizontalWithSubtitle KPI Cards) */}
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <HorizontalWithSubtitle
          title={getRevenueTitle()}
          stats={formatPrice(kpiStats.revenue)}
          avatarIcon="tabler-currency-dollar"
          avatarColor="success"
          trend="positive"
          trendNumber={`${kpiStats.completedCount}`}
          subtitle={getRevenueSubtitle()}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <HorizontalWithSubtitle
          title={getOrdersTitle()}
          stats={`${kpiStats.totalOrders}`}
          avatarIcon="tabler-shopping-bag"
          avatarColor="primary"
          trend="positive"
          trendNumber={`${kpiStats.activeCount}`}
          subtitle={getOrdersSubtitle()}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <HorizontalWithSubtitle
          title={getOccupancyTitle()}
          stats={`${kpiStats.occupancyRate}%`}
          avatarIcon="tabler-armchair"
          avatarColor="warning"
          trend="positive"
          trendNumber={`${kpiStats.occupiedTables}/${kpiStats.totalTables}`}
          subtitle={getOccupancySubtitle()}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <HorizontalWithSubtitle
          title={getAvgBillTitle()}
          stats={formatPrice(kpiStats.avgBill)}
          avatarIcon="tabler-chart-arrows-vertical"
          avatarColor="info"
          trend="positive"
          trendNumber="AOV"
          subtitle={getAvgBillSubtitle()}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <HorizontalWithSubtitle
          title={getCustomersTitle()}
          stats={`${kpiStats.totalCustomers}`}
          avatarIcon="tabler-users"
          avatarColor="secondary"
          trend="positive"
          trendNumber={`${kpiStats.totalMenuItems}`}
          subtitle={getCustomersSubtitle()}
        />
      </Grid>

      {/* 3. Charts Row: Sales Performance (8 cols) + Order Distribution Donut (4 cols) */}
      <Grid item xs={12} lg={8}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={getSalesChartTitle()}
            subheader={getSalesChartSubheader()}
            action={
              <CustomChip
                round="true"
                label={getLiveChipLabel()}
                color="primary"
                size="small"
                variant="tonal"
              />
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <AppReactApexCharts
              type="area"
              height={320}
              options={salesChartOptions}
              series={salesChartSeries}
            />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={getDonutChartTitle()}
            subheader={getDonutChartSubheader()}
            action={<OptionMenu options={["Today", "This Week", "This Month"]} />}
          />
          <CardContent sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            <AppReactApexCharts
              type="donut"
              height={320}
              options={donutOptions}
              series={donutSeries}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* 4. Middle Row: Top 5 Best-Selling Items (6 cols) + Zone Occupancy (6 cols) */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={getTopDishesTitle()}
            subheader={getTopDishesSubheader()}
            action={<OptionMenu options={["Top 5", "Top 10"]} />}
          />
          <CardContent className="flex flex-col gap-4">
            {topDishes.length === 0 ? (
              <div className="py-8 text-center text-textSecondary text-sm">
                {getTopDishesEmptyText()}
              </div>
            ) : (
              topDishes.map((dish) => {
                const medal = getRankMedal(dish.rank);
                const rankColor = getRankColor(dish.rank);

                return (
                  <div key={dish.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <CustomAvatar
                          size={34}
                          variant="rounded"
                          skin="light"
                          color={rankColor}
                          className="text-sm font-bold"
                        >
                          {medal}
                        </CustomAvatar>
                        <Typography className="font-medium" color="text.primary">
                          {dish.name}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" color="text.secondary">
                          {dish.quantity} {getDishUnitLabel()}
                        </Typography>
                        <CustomChip
                          round="true"
                          size="small"
                          variant="tonal"
                          color="success"
                          label={formatPrice(dish.revenue)}
                        />
                      </div>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={dish.percent}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "var(--mui-palette-action-hover)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          bgcolor:
                            dish.rank === 1
                              ? "var(--mui-palette-primary-main)"
                              : "var(--mui-palette-success-main)",
                        },
                      }}
                    />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ height: "100%" }}>
          <CardHeader
            title={getZoneStatsTitle()}
            subheader={getZoneStatsSubheader()}
            action={<OptionMenu options={["All Zones"]} />}
          />
          <CardContent className="flex flex-col gap-4">
            {zoneStats.length === 0 ? (
              <div className="py-8 text-center text-textSecondary text-sm">
                {getZoneStatsEmptyText()}
              </div>
            ) : (
              zoneStats.map((z) => {
                const chipColor = getZoneChipColor(z.rate);

                return (
                  <div key={z._id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5">
                        <CustomAvatar
                          size={34}
                          variant="rounded"
                          skin="light"
                          color="primary"
                        >
                          <i className="tabler-map-pin text-[18px]" />
                        </CustomAvatar>
                        <Typography className="font-medium" color="text.primary">
                          {z.name}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" color="text.secondary">
                          {z.occupied} / {z.total} {getTableUnitLabel()}
                        </Typography>
                        <CustomChip
                          round="true"
                          size="small"
                          variant="tonal"
                          color={chipColor}
                          label={`${z.rate}%`}
                        />
                      </div>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={z.rate}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "var(--mui-palette-action-hover)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          bgcolor: getProgressBarColor(chipColor),
                        },
                      }}
                    />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* 5. Bottom Row: Recent Orders Table (Vuexy Table Style) */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={getRecentOrdersTitle()}
            subheader={getRecentOrdersSubheader()}
            action={
              <Link href={`/${lang}/pos`} passHref>
                <Button
                  size="small"
                  variant="tonal"
                  color="primary"
                  endIcon={<i className="tabler-arrow-right" />}
                >
                  {getRecentOrdersActionLabel()}
                </Button>
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{getOrderHeader()}</th>
                  <th>{getTableHeader()}</th>
                  <th>{getItemsHeader()}</th>
                  <th>{getTotalHeader()}</th>
                  <th>{getStatusHeader()}</th>
                  <th>{getTimeHeader()}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-textSecondary">
                      {getRecentOrdersEmptyText()}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => {
                    const itemCount = order.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 0;
                    let firstItem = "-";
                    if (order.items && order.items.length > 0) {
                      firstItem = order.items[0].menuItemName;
                    }
                    let otherCount = 0;
                    if (order.items && order.items.length > 1) {
                      otherCount = order.items.length - 1;
                    }
                    const otherItemsText = renderOtherItemsText(otherCount, itemCount);
                    const orderNum = order.orderNumber || order._id.slice(-6);
                    const tableNum = getTableNumberById(order.tableId);
                    const tableText = lang === "la" ? `ໂຕະ ${tableNum}` : `โต๊ะ ${tableNum}`;

                    return (
                      <tr key={order._id}>
                        <td>{index + 1}</td>
                        <td>
                          <Typography className="font-semibold text-primary" variant="body2">
                            #{orderNum}
                          </Typography>
                        </td>
                        <td>
                          <CustomChip
                            size="small"
                            variant="tonal"
                            color="secondary"
                            icon={<i className="tabler-armchair text-xs" />}
                            label={tableText}
                          />
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <Typography variant="body2" className="font-medium" color="text.primary">
                              {firstItem}
                            </Typography>
                            {otherCount > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                {otherItemsText}
                              </Typography>
                            )}
                          </div>
                        </td>
                        <td>
                          <Typography variant="body2" className="font-bold" color="text.primary">
                            {formatPrice(order.total)}
                          </Typography>
                        </td>
                        <td>
                          <CustomChip
                            round="true"
                            size="small"
                            variant="tonal"
                            color={getStatusChipColor(order.status)}
                            label={getStatusLabel(order.status)}
                          />
                        </td>
                        <td>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(order.createdAt)}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PosDashboardView;
