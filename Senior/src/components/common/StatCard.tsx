import React from 'react';

interface StatCardProps {
  id?: string;
  icon: React.ReactNode;
  /** Tailwind bg + text classes for the icon tile, e.g. "bg-[#FEF3C7] text-[#D97706]". */
  iconColorClass: string;
  value: React.ReactNode;
  /** Tailwind text color class for the big number, e.g. "text-[#D97706]". */
  valueColorClass: string;
  label: string;
}

/**
 * The "icon tile + big number + label" stat card repeated across the
 * student dashboard, admin dashboard, and admin raise-capacity
 * dashboard (12 identical usages before this extraction). Only the
 * icon, colors, value, and label vary between call sites.
 */
export const StatCard: React.FC<StatCardProps> = ({
  id,
  icon,
  iconColorClass,
  value,
  valueColorClass,
  label,
}) => (
  <div
    id={id}
    className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center gap-4"
  >
    <div
      className={`w-12 h-12 rounded-xl ${iconColorClass} flex items-center justify-center font-bold text-xl`}
    >
      {icon}
    </div>
    <div>
      <span className={`text-2xl font-extrabold ${valueColorClass} tracking-tight`}>{value}</span>
      <p className="text-xs font-medium text-[#6B7280]">{label}</p>
    </div>
  </div>
);
