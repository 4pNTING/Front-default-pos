"use client";

import React from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import CustomAvatar from "@core/components/mui/Avatar";
import CustomChip from "@core/components/mui/Chip";
import { useKdsStore } from "../../store/kdsStore";
import { KdsProps, KdsStatusFilter } from "../../type/kdsType";

interface KdsHeaderProps {
  props: KdsProps;
  onRefresh: () => Promise<void>;
  totalTickets: number;
}

export const KdsHeaderComponent: React.FC<KdsHeaderProps> = ({
  props,
  onRefresh,
  totalTickets,
}) => {
  const { lang, dictionary: dic } = props;
  const {
    statusFilter,
    setStatusFilter,
    stationFilter,
    setStationFilter,
    categories,
    audioEnabled,
    setAudioEnabled,
    isFullscreen,
    setIsFullscreen,
    showDemo,
    setShowDemo,
    isRefetching,
    lastUpdated,
  } = useKdsStore();

  const toggleFullscreen = () => {
    if (typeof document === "undefined") {
      return;
    }
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const getBreadcrumbHome = (): string => {
    if (lang === "la") {
      return "ໜ້າຫຼັກ";
    }
    return "หน้าหลัก";
  };

  const getKdsTitle = (): string => {
    if (lang === "la") {
      return "ລະບົບຈໍສະແດງຜົນໃນຄົວ (KDS)";
    }
    return "ระบบจอแสดงผลในครัว (KDS)";
  };

  const getKdsSubtitle = (): string => {
    const timeStr = lastUpdated.toLocaleTimeString();
    if (lang === "la") {
      return `ອັບເດດອໍເດີຄົວອັດຕະໂນມັດ • ລ່າສຸດ: ${timeStr}`;
    }
    return `อัปเดตออเดอร์ครัวอัตโนมัติ • ล่าสุด: ${timeStr}`;
  };

  const getTicketCountLabel = (): string => {
    if (lang === "la") {
      return `${totalTickets} ອໍເດີ`;
    }
    return `${totalTickets} ออเดอร์`;
  };

  const getStationLabel = (): string => {
    if (lang === "la") {
      return "ສເຕຊັ່ນຄົວ";
    }
    return "สเตชั่นครัว";
  };

  const getAllStationsText = (): string => {
    if (lang === "la") {
      return "ທຸກສເຕຊັ່ນ (All Stations)";
    }
    return "ทุกสเตชั่น (All Stations)";
  };

  const getSoundTooltip = (): string => {
    if (audioEnabled) {
      if (lang === "la") {
        return "ປິດສຽງເຕືອນ";
      }
      return "ปิดเสียงเตือน";
    }
    if (lang === "la") {
      return "ເປີດສຽງເຕືອນ";
    }
    return "เปิดเสียงเตือน";
  };

  const getFullscreenTooltip = (): string => {
    if (isFullscreen) {
      if (lang === "la") {
        return "ອອກຈາກໂໝດເຕັມຈໍ";
      }
      return "ออกจากโหมดเต็มจอ";
    }
    if (lang === "la") {
      return "ເປີດໂໝດເຕັມຈໍ (Fullscreen)";
    }
    return "เปิดโหมดเต็มจอ (Fullscreen)";
  };

  const getPosButtonLabel = (): string => {
    if (lang === "la") {
      return "ໜ້າ POS";
    }
    return "หน้า POS";
  };

  const getRefreshIconClass = (): string => {
    if (isRefetching) {
      return "tabler-refresh animate-spin";
    }
    return "tabler-refresh";
  };

  const getFilterButtonVariant = (filterKey: KdsStatusFilter): "contained" | "tonal" => {
    if (statusFilter === filterKey) {
      return "contained";
    }
    return "tonal";
  };

  const getDemoButtonText = (): string => {
    if (showDemo) {
      if (lang === "la") {
        return "ປິດອໍເດີຕົວຢ່າງ";
      }
      return "ปิดออเดอร์ตัวอย่าง";
    }
    if (lang === "la") {
      return "ອໍເດີຕົວຢ່າງ";
    }
    return "ออเดอร์ตัวอย่าง";
  };

  const getDemoButtonIcon = (): string => {
    if (showDemo) {
      return "tabler-eye-check";
    }
    return "tabler-eye";
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        {/* Top Row: Breadcrumbs, Title & Global Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Breadcrumbs
              separator={<span style={{ margin: "0 8px" }}>›</span>}
              aria-label="breadcrumb"
            >
              <Link
                className="text-textSecondary hover:underline hover:underline-offset-1 text-sm"
                href={`/${lang}`}
              >
                {dic?.pageBreadcrumbs?.homePage || getBreadcrumbHome()}
              </Link>
              <Typography color="text.primary" className="font-semibold text-sm">
                {getKdsTitle()}
              </Typography>
            </Breadcrumbs>

            <div className="flex items-center gap-3">
              <CustomAvatar skin="light" variant="rounded" color="warning" size={46}>
                <i className="tabler-tools-kitchen-2 text-[26px]" />
              </CustomAvatar>
              <div>
                <div className="flex items-center gap-2">
                  <Typography variant="h4" className="font-bold">
                    {getKdsTitle()}
                  </Typography>
                  <CustomChip
                    round="true"
                    size="small"
                    variant="tonal"
                    color="warning"
                    icon={<i className="tabler-flame text-xs" />}
                    label={getTicketCountLabel()}
                  />
                </div>
                <Typography variant="body2" color="text.secondary">
                  {getKdsSubtitle()}
                </Typography>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Station Dropdown */}
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel id="kds-station-select-label">{getStationLabel()}</InputLabel>
              <Select
                labelId="kds-station-select-label"
                value={stationFilter}
                label={getStationLabel()}
                onChange={(e) => setStationFilter(e.target.value)}
              >
                <MenuItem value="all">{getAllStationsText()}</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sound Toggle */}
            <Tooltip title={getSoundTooltip()}>
              <IconButton
                onClick={() => setAudioEnabled(!audioEnabled)}
                color={audioEnabled ? "success" : "secondary"}
                sx={{
                  border: "1px solid",
                  borderColor: audioEnabled ? "success.main" : "divider",
                }}
              >
                <i className={audioEnabled ? "tabler-volume" : "tabler-volume-off"} />
              </IconButton>
            </Tooltip>

            {/* Refresh Button */}
            <Tooltip title={lang === "la" ? "ຣີເຟຣຊ" : "รีเฟรช"}>
              <IconButton
                onClick={onRefresh}
                disabled={isRefetching}
                color="secondary"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <i className={getRefreshIconClass()} />
              </IconButton>
            </Tooltip>

            {/* Fullscreen Button */}
            <Tooltip title={getFullscreenTooltip()}>
              <IconButton
                onClick={toggleFullscreen}
                color="secondary"
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <i className={isFullscreen ? "tabler-minimize" : "tabler-maximize"} />
              </IconButton>
            </Tooltip>

            {/* Demo Orders Button */}
            <Button
              variant={showDemo ? "contained" : "tonal"}
              color="warning"
              onClick={() => setShowDemo(!showDemo)}
              startIcon={<i className={getDemoButtonIcon()} />}
            >
              {getDemoButtonText()}
            </Button>

            {/* Back to POS Button */}
            <Link href={`/${lang}/pos`} passHref>
              <Button
                variant="tonal"
                color="primary"
                startIcon={<i className="tabler-cash-register" />}
              >
                {getPosButtonLabel()}
              </Button>
            </Link>
          </div>
        </div>

        {/* Bottom Row: Status Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-divider">
          <Button
            size="small"
            variant={getFilterButtonVariant("all_active")}
            color="warning"
            onClick={() => setStatusFilter("all_active")}
            startIcon={<i className="tabler-flame" />}
          >
            {lang === "la" ? "ທັງໝົດທີ່ຕ້ອງປຸງ" : "ทั้งหมดที่ต้องปรุง"}
          </Button>

          <Button
            size="small"
            variant={getFilterButtonVariant("confirmed")}
            color="info"
            onClick={() => setStatusFilter("confirmed")}
            startIcon={<i className="tabler-clock" />}
          >
            {lang === "la" ? "ອໍເດີໃໝ່ (New)" : "ออเดอร์ใหม่ (New)"}
          </Button>

          <Button
            size="small"
            variant={getFilterButtonVariant("preparing")}
            color="primary"
            onClick={() => setStatusFilter("preparing")}
            startIcon={<i className="tabler-tools-kitchen-2" />}
          >
            {lang === "la" ? "ກຳລັງປຸງ (Cooking)" : "กำลังปรุง (Cooking)"}
          </Button>

          <Button
            size="small"
            variant={getFilterButtonVariant("served")}
            color="success"
            onClick={() => setStatusFilter("served")}
            startIcon={<i className="tabler-check" />}
          >
            {lang === "la" ? "ເສີບແລ້ວ (Served)" : "เสิร์ฟแล้ว (Served)"}
          </Button>

          <Button
            size="small"
            variant={getFilterButtonVariant("all")}
            color="secondary"
            onClick={() => setStatusFilter("all")}
            startIcon={<i className="tabler-list-details" />}
          >
            {lang === "la" ? "ອໍເດີທັງໝົດ (All)" : "ออเดอร์ทั้งหมด (All)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
