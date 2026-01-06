import React from "react";

const ActivityItem = ({ day, month, title, sub, status, statusColor, isRescue }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-[var(--color-border)] last:border-0">
      <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl ${isRescue ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-[var(--color-bg-toggle)]'}`}>
        <span className={`font-extrabold text-lg ${isRescue ? 'text-orange-600' : 'text-[var(--color-text-main)]'}`}>{day}</span>
        <span className="text-[10px] font-bold uppercase text-[var(--color-text-muted)]">{month}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-[var(--color-text-main)]">{title}</h4>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{sub}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${colors[statusColor]}`}>
        {status}
      </span>
    </div>
  );
};

export default ActivityItem;