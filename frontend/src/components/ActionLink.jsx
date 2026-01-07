import React from "react";

const ActionLink = ({ icon, text, last }) => (
  <div className={`flex items-center gap-3 py-3 cursor-pointer hover:translate-x-1 transition ${!last ? 'border-b border-[var(--color-border)]' : ''}`}>
    <div className="text-[var(--color-primary)]">
      {icon}
    </div>
    <span className="font-semibold text-sm text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition">
      {text}
    </span>
  </div>
);

export default ActionLink;