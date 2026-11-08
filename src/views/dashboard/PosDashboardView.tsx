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
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

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
      salesSeries = categories.map((cat) => Math.round(dateMap[cat].sales / 1000)); // In Thousands K
      countSeries = categories.map((cat) => dateMap[cat].count);
    } else {
      // Default sample if newly created today
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

  // Sales Area Chart Options
  const salesChartOptions: ApexOptions = {
    chart: {
      type: "area",
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: [3, 2] },
    colors: ["#2F57AB", "#10B981"],
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
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: {
          text: lang === "la" ? "ຍອດຂາຍ (ພັນກີບ / k LAK)" : "Sales (k LAK)",
          style: { color: "#2F57AB", fontSize: "11px", fontWeight: 500 },
        },
        labels: {
          formatter: (val: number) => `${val.toLocaleString()}k`,
          style: { colors: "var(--mui-palette-text-secondary)", fontSize: "11px" },
        },
      },
      {
        opposite: true,
        title: {
          text: lang === "la" ? "ຈຳນວນບິນ (Orders)" : "Orders Count",
          style: { color: "#10B981", fontSize: "11px", fontWeight: 500 },
        },
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { colors: "var(--mui-palette-text-secondary)", fontSize: "11px" },
        },
      },
    ],
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number, { seriesIndex }) => {
          if (seriesIndex === 0) {
            return `${(val * 1000).toLocaleString()} ₭`;
          }
          return `${val} ${lang === "la" ? "ບິນ" : "orders"}`;
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
      name: lang === "la" ? "ຍອດຂາຍ (LAK)" : "Revenue (LAK)",
      data: salesChartData.salesSeries,
    },
    {
      name: lang === "la" ? "ຈຳນວນບິນ (Orders)" : "Orders Count",
      data: salesChartData.countSeries,
    },
  ];

  // Order Status Donut Options
  const donutOptions: ApexOptions = {
    chart: {
      type: "donut",
      parentHeightOffset: 0,
    },
    labels: [
      lang === "la" ? "ສຳເລັດແລ້ວ (Completed)" : "Completed",
      lang === "la" ? "ກຳລັງດຳເນີນການ (Active)" : "Active / Cooking",
      lang === "la" ? "ຍົກເລີກ (Cancelled)" : "Cancelled",
    ],
    colors: ["#10B981", "#F59E0B", "#EF4444"],
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
              label: lang === "la" ? "ອໍເດີທັງໝົດ" : "Total Orders",
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

  // Helper formatting functions (Using if/else, NO nested ternaries)
  const getStatusLabel = (status: string): string => {
    if (status === IPosOrderStatus.paid || status === IPosOrderStatus.completed) {
      if (lang === "la") {
        return "ຊຳລະແລ້ວ";
      }
      return "Paid";
    }
    if (status === IPosOrderStatus.served) {
      if (lang === "la") {
        return "ເສີບແລ້ວ";
      }
      return "Served";
    }
    if (status === IPosOrderStatus.preparing || status === IPosOrderStatus.cooking) {
      if (lang === "la") {
        return "ກຳລັງປຸງ";
      }
      return "Cooking";
    }
    if (status === IPosOrderStatus.confirmed) {
      if (lang === "la") {
        return "ຢືນຢັນແລ້ວ";
      }
      return "Confirmed";
    }
    if (status === IPosOrderStatus.pending) {
      if (lang === "la") {
        return "ລໍຖ້າ";
      }
      return "Pending";
    }
    if (status === IPosOrderStatus.cancelled) {
      if (lang === "la") {
        return "ຍົກເລີກ";
      }
      return "Cancelled";
    }
    return status;
  };

  const getStatusChipColor = (
    status: string
  ): "success" | "warning" | "info" | "error" | "default" => {
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
      return "info";
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
      return "Just now";
    }
    if (diffMin < 60) {
      if (lang === "la") {
        return `${diffMin} ນາທີກ່ອນ`;
      }
      return `${diffMin}m ago`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      if (lang === "la") {
        return `${diffHours} ຊົ່ວໂມງກ່ອນ`;
      }
      return `${diffHours}h ago`;
    }
    return orderDate.toLocaleDateString();
  };

  if (isLoadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <CircularProgress size={44} sx={{ color: "#2F57AB" }} />
        <Typography variant="body1" color="text.secondary">
          {lang === "la" ? "ກຳລັງໂຫຼດຂໍ້ມູນ Dashboard..." : "Loading Dashboard Analytics..."}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Banner & Action Bar */}
      <Card
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(135deg, #2F57AB 0%, #1e3a8a 100%)",
          color: "#fff",
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          boxShadow: "0 10px 25px -5px rgba(47, 87, 171, 0.3)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <i className="tabler-chart-pie text-2xl text-white" />
            </div>
            <div>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
                {lang === "la" ? "ພາບລວມລະບົບຮ້ານອາຫານ & ຍອດຂາຍ" : "Restaurant & POS Analytics"}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {lang === "la"
                  ? `ຂໍ້ມູນຈິງຈາກລະບົບ POS • ອັບເດດລ່າສຸດ: ${lastRefreshedAt.toLocaleTimeString()}`
                  : `Real-time POS live data • Last updated: ${lastRefreshedAt.toLocaleTimeString()}`}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip title={lang === "la" ? "ຣີເຟຣຊຂໍ້ມູນໃໝ່" : "Refresh Data"}>
              <IconButton
                onClick={handleRefreshAll}
                disabled={isRefetching}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.25)" },
                }}
              >
                <i
                  className={`tabler-refresh text-lg ${
                    isRefetching ? "animate-spin" : ""
                  }`}
                />
              </IconButton>
            </Tooltip>

            <Link href={`/${lang}/pos`} passHref>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "#2F57AB",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#f1f5f9" },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                startIcon={<i className="tabler-device-laptop" />}
              >
                {lang === "la" ? "ເປີດລະບົບຂາຍ (POS)" : "Launch POS"}
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 2. Top 5 Key Metrics (KPI Cards) */}
      <Grid container spacing={4}>
        {/* KPI 1: Total Revenue */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {lang === "la" ? "ຍອດຂາຍລວມ" : "Total Revenue"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <i className="tabler-currency-dollar text-lg" />
                </div>
              </div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                {formatPrice(kpiStats.revenue)}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {lang === "la"
                  ? `${kpiStats.completedCount} ບິນທີ່ຊຳລະແລ້ວ`
                  : `From ${kpiStats.completedCount} paid bills`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 2: Total Orders */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {lang === "la" ? "ອໍເດີທັງໝົດ" : "Total Orders"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <i className="tabler-shopping-bag text-lg" />
                </div>
              </div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                {kpiStats.totalOrders}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {lang === "la"
                  ? `ກຳລັງດຳເນີນ: ${kpiStats.activeCount} | ຍົກເລີກ: ${kpiStats.cancelledCount}`
                  : `Active: ${kpiStats.activeCount} | Cancelled: ${kpiStats.cancelledCount}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 3: Table Occupancy */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {lang === "la" ? "ອັດຕາຄອງໂຕະ" : "Occupancy Rate"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <i className="tabler-armchair text-lg" />
                </div>
              </div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                {kpiStats.occupancyRate}%
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {lang === "la"
                  ? `ມີແຂກ: ${kpiStats.occupiedTables} / ${kpiStats.totalTables} ໂຕະ`
                  : `Occupied: ${kpiStats.occupiedTables} / ${kpiStats.totalTables} tables`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 4: Average Bill (AOV) */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {lang === "la" ? "ຍອດສະເລ່ຍຕໍ່ບິນ" : "Average Ticket"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <i className="tabler-chart-arrows-vertical text-lg" />
                </div>
              </div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                {formatPrice(kpiStats.avgBill)}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {lang === "la" ? "ຕໍ່ບິນທີ່ເຊັກແລ້ວ" : "Per closed receipt"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* KPI 5: Active Customers */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {lang === "la" ? "ສະມາຊິກໃນລະບົບ" : "Members / Customers"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <i className="tabler-users text-lg" />
                </div>
              </div>
              <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
                {kpiStats.totalCustomers}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {lang === "la"
                  ? `${kpiStats.totalMenuItems} ລາຍການເມນູທັງໝົດ`
                  : `Across ${kpiStats.totalMenuItems} menu items`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 3. Charts Row: Sales Trend (Left 8) + Order Status Donut (Right 4) */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardHeader
              title={lang === "la" ? "ແນວໂນ້ມຍອດຂາຍ & ຈຳນວນບິນ" : "Sales & Orders Performance"}
              subheader={
                lang === "la"
                  ? "ສະຫຼຸບຍອດຂາຍລາຍວັນຈາກບິນຊຳລະເງິນຕົວຈິງ"
                  : "Daily revenue & completed orders volume"
              }
              action={
                <Chip
                  label={lang === "la" ? "ຂໍ້ມູນ Real-time" : "Live Data"}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <AppReactApexCharts
                type="area"
                height={300}
                options={salesChartOptions}
                series={salesChartSeries}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardHeader
              title={lang === "la" ? "ສະັດສ່ວນສະຖານະອໍເດີ" : "Order Status Distribution"}
              subheader={
                lang === "la"
                  ? `ທັງໝົດ ${kpiStats.totalOrders} ອໍເດີ`
                  : `Total ${kpiStats.totalOrders} orders in system`
              }
            />
            <CardContent sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
              <AppReactApexCharts
                type="donut"
                height={300}
                options={donutOptions}
                series={donutSeries}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 4. Middle Row: Top 5 Best-Selling Dishes (6) + Zone Table Occupancy (6) */}
      <Grid container spacing={4}>
        {/* Top 5 Dishes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardHeader
              title={lang === "la" ? "🔥 5 ອັນດັບເມນູຂາຍດີທີ່ສຸດ" : "🔥 Top 5 Best-Selling Items"}
              subheader={
                lang === "la"
                  ? "ຄຳນວນຈາກຈຳນວນຈານທີ່ຂາຍໄດ້ທັງໝົດ"
                  : "Ranked by total quantity ordered"
              }
            />
            <CardContent sx={{ pt: 1 }}>
              {topDishes.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                  {lang === "la" ? "ຍັງບໍ່ມີຂໍ້ມູນເມນູທີ່ສັ່ງ" : "No sales items recorded yet"}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {topDishes.map((dish) => {
                    let medalBadge = `#${dish.rank}`;
                    if (dish.rank === 1) medalBadge = "🥇";
                    else if (dish.rank === 2) medalBadge = "🥈";
                    else if (dish.rank === 3) medalBadge = "🥉";

                    return (
                      <div key={dish.name} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base w-6">{medalBadge}</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-100">
                              {dish.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              {dish.quantity} {lang === "la" ? "ຈານ" : "dishes"}
                            </span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {formatPrice(dish.revenue)}
                            </span>
                          </div>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={dish.percent}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "var(--mui-palette-divider)",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: dish.rank === 1 ? "#2F57AB" : "#10B981",
                            },
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Zone Table Occupancy */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2.5, boxShadow: 1 }}>
            <CardHeader
              title={lang === "la" ? "🗺️ ສະຖານະໂຕະແຍກຕາມໂຊນ" : "🗺️ Table Occupancy by Zone"}
              subheader={
                lang === "la"
                  ? "ອັດຕາການຄອງໂຕະໃນແຕ່ລະພື້ນທີ່ຂອງຮ້ານ"
                  : "Live seat occupancy across restaurant zones"
              }
            />
            <CardContent sx={{ pt: 1 }}>
              {zoneStats.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">
                  {lang === "la" ? "ບໍ່ມີຂໍ້ມູນໂຊນ" : "No zones defined"}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {zoneStats.map((z) => {
                    let progressColor = "#10B981"; // green
                    if (z.rate >= 80) {
                      progressColor = "#EF4444"; // red
                    } else if (z.rate >= 40) {
                      progressColor = "#F59E0B"; // amber
                    }

                    return (
                      <div key={z._id} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                            <i className="tabler-map-pin text-sm text-gray-400" />
                            {z.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">
                              {z.occupied} / {z.total} {lang === "la" ? "ໂຕະ" : "tables"}
                            </span>
                            <span
                              className="font-bold px-1.5 py-0.5 rounded text-[11px]"
                              style={{
                                backgroundColor: `${progressColor}20`,
                                color: progressColor,
                              }}
                            >
                              {z.rate}%
                            </span>
                          </div>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={z.rate}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "var(--mui-palette-divider)",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: progressColor,
                            },
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 5. Bottom Row: Recent Orders Table */}
      <Card sx={{ borderRadius: 2.5, boxShadow: 1 }}>
        <CardHeader
          title={lang === "la" ? "📋 ລາຍການອໍເດີຫຼ້າສຸດ" : "📋 Recent Orders & Transactions"}
          subheader={
            lang === "la"
              ? "ອໍເດີທີ່ເຂົ້າມາຫຼ້າສຸດໃນລະບົບ"
              : "Latest order activities recorded in POS"
          }
          action={
            <Link href={`/${lang}/pos`} passHref>
              <Button
                size="small"
                endIcon={<i className="tabler-arrow-right" />}
                sx={{ textTransform: "none" }}
              >
                {lang === "la" ? "ເບິ່ງໃນ POS ທັງໝົດ" : "View all in POS"}
              </Button>
            </Link>
          }
        />
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "var(--mui-palette-action-hover)" }}>
                <TableCell sx={{ fontWeight: 600 }}>
                  {lang === "la" ? "ເລກອໍເດີ" : "Order #"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {lang === "la" ? "ໂຕະ" : "Table"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {lang === "la" ? "ລາຍການອາຫານ" : "Items Summary"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {lang === "la" ? "ຍອດລວມ" : "Total"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {lang === "la" ? "ສະຖານະ" : "Status"}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {lang === "la" ? "ເວລາ" : "Time"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    {lang === "la" ? "ບໍ່ມີຂໍ້ມູນອໍເດີ" : "No orders found"}
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => {
                  const itemCount = order.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 0;
                  const firstItem = order.items && order.items.length > 0 ? order.items[0].menuItemName : "-";
                  const otherCount = order.items && order.items.length > 1 ? order.items.length - 1 : 0;

                  return (
                    <TableRow key={order._id} hover>
                      <TableCell sx={{ fontWeight: 600, color: "#2F57AB" }}>
                        #{order.orderNumber || order._id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<i className="tabler-armchair text-xs" />}
                          label={`${lang === "la" ? "ໂຕະ" : "Table"} ${getTableNumberById(order.tableId)}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{firstItem}</span>
                          {otherCount > 0 && (
                            <span className="text-xs text-gray-500">
                              +{otherCount} {lang === "la" ? "ລາຍການອື່ນ" : "more items"} ({itemCount} {lang === "la" ? "ຈານ" : "total"})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(order.status)}
                          color={getStatusChipColor(order.status)}
                          size="small"
                          variant="tonal"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: "12px" }}>
                        {formatTimeAgo(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default PosDashboardView;
