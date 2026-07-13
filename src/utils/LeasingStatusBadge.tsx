import React from 'react';


interface LeasingStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LeasingStatusBadge: React.FC<LeasingStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const getStatusConfig = (value: string) => {
    const configs: Record<string, { label: string; bgColor: string; textColor: string }> = {
      'review': {
        label: 'ກຳລັງກວດສອບ',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      },
      'accept': {
        label: 'ຍອມຮັບ',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      'reject': {
        label: 'ປະຕິເສດ',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
      'active': {
        label: 'ໃຊ້ງານ',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
      'expired': {
        label: 'ໝົດອາຍຸ',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
      },
      'cancel': {
        label: 'ຍົກເລີກ',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
      'pending': {
        label: 'ລໍຖ້າ',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
      },
    };

    return configs[value] || {
      label: value,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    };
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-medium
        ${config.bgColor}
        ${config.textColor}
        ${sizeClasses[size]}
      `}
    >
      {config.label}
    </span>
  );
};

export default LeasingStatusBadge;
