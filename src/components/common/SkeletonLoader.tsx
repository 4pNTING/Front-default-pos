'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';

type Variant = 'menu' | 'list' | 'card' | 'table';

export type SkeletonLoaderProps = {
  /** รูปแบบโครงโหลด (ค่าเริ่มต้น: 'menu') */
  variant?: Variant;
  /** จำนวนแถวสำหรับเมนู/ลิสต์/ตาราง */
  rows?: number;
  /** เปิด/ปิดแอนิเมชัน */
  animation?: 'pulse' | 'wave' | false;
  /** className เสริม */
  className?: string;
  /** ความสูงกำหนดเอง (เฉพาะบางโหมด) */
  height?: number | string;
};

/**
 * SkeletonLoader – โครงโหลดอเนกประสงค์ใช้กับเมนู/ลิสต์/การ์ด/ตาราง
 * ใช้ร่วมกับ MUI Skeleton
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'menu',
  rows = 8,
  animation = 'wave',
  className,
  height
}) => {
  if (variant === 'menu') {
    // โครงโหลดเมนูแนวตั้ง (เหมือน sidebar)
    return (
      <Box className={className} aria-label="loading menu" sx={{ p: 2 }}>
        {/* โลโก้/ส่วนหัว */}
        <Skeleton variant="rectangular" animation={animation} height={48} sx={{ borderRadius: 1, mb: 2 }} />

        {/* กลุ่มเมนูที่ 1 */}
        <Skeleton variant="text" animation={animation} width="40%" height={22} sx={{ mb: 1 }} />
        <Stack spacing={1}>
          {Array.from({ length: Math.max(3, Math.min(rows, 6)) }).map((_, i) => (
            <Stack key={`menu-1-${i}`} direction="row" alignItems="center" spacing={1.5}>
              <Skeleton variant="circular" animation={animation} width={18} height={18} />
              <Skeleton variant="text" animation={animation} width="70%" height={20} />
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 2, opacity: 0.4 }} />

        {/* กลุ่มเมนูที่ 2 */}
        <Skeleton variant="text" animation={animation} width="45%" height={22} sx={{ mb: 1 }} />
        <Stack spacing={1}>
          {Array.from({ length: Math.max(2, Math.floor(rows / 2)) }).map((_, i) => (
            <Stack key={`menu-2-${i}`} direction="row" alignItems="center" spacing={1.5}>
              <Skeleton variant="circular" animation={animation} width={18} height={18} />
              <Skeleton variant="text" animation={animation} width="65%" height={20} />
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 2, opacity: 0.4 }} />

        {/* แถวท้าย ๆ เช่น ภาษา / ธีม / ออกจากระบบ */}
        <Stack spacing={1}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Stack key={`menu-bottom-${i}`} direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Skeleton variant="circular" animation={animation} width={18} height={18} />
                <Skeleton variant="text" animation={animation} width={120} height={20} />
              </Stack>
              <Skeleton variant="text" animation={animation} width={40} height={18} />
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  }

  if (variant === 'list') {
    // โครงโหลดลิสต์ทั่วไป (เช่น รายการลูกค้า)
    return (
      <Stack className={className} aria-label="loading list" spacing={1.5} sx={{ p: 2 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Stack key={`list-${i}`} direction="row" alignItems="center" spacing={1.5}>
            <Skeleton variant="circular" animation={animation} width={36} height={36} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" animation={animation} width="55%" height={20} />
              <Skeleton variant="text" animation={animation} width="35%" height={18} />
            </Box>
            <Skeleton variant="rectangular" animation={animation} width={64} height={28} sx={{ borderRadius: 1 }} />
          </Stack>
        ))}
      </Stack>
    );
  }

  if (variant === 'card') {
    // โครงโหลดการ์ดเดี่ยว
    return (
      <Box className={className} aria-label="loading card" sx={{ p: 2 }}>
        <Skeleton variant="rectangular" animation={animation} height={height ?? 160} sx={{ borderRadius: 2 }} />
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <Skeleton variant="text" animation={animation} width="60%" height={22} />
          <Skeleton variant="text" animation={animation} width="90%" height={18} />
          <Skeleton variant="text" animation={animation} width="80%" height={18} />
        </Stack>
      </Box>
    );
  }

  // table
  return (
    <Box className={className} aria-label="loading table" sx={{ p: 2 }}>
      {/* header */}
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`th-${i}`} variant="rectangular" animation={animation} height={28} width={`${20 + i * 10}%`} sx={{ borderRadius: 1 }} />
        ))}
      </Stack>
      {/* rows */}
      <Stack spacing={1}>
        {Array.from({ length: rows }).map((_, r) => (
          <Stack key={`tr-${r}`} direction="row" spacing={1}>
            {Array.from({ length: 5 }).map((_, c) => (
              <Skeleton
                key={`td-${r}-${c}`}
                variant="rectangular"
                animation={animation}
                height={32}
                width={`${20 + c * 10}%`}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default SkeletonLoader;
