const AppointmentTabs = ({ filterStatus, setFilterStatus }) => {
  return (
    <div className="flex gap-10 border-b border-[var(--color-border)] mb-10 pb-3">
      {["upcoming", "history"].map((tab) => (
        <button
          key={tab}
          onClick={() => setFilterStatus(tab)}
          className={`pb-2 text-sm font-bold uppercase relative tracking-wide transition-all ${
            filterStatus === tab
              ? "text-[var(--color-primary)] scale-110"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
          }`}
        >
          {tab}
          {filterStatus === tab && (
            <span className="absolute -bottom-[10px] left-0 w-full h-[3px] bg-[var(--color-primary)] rounded-full shadow"></span>
          )}
        </button>
      ))}
    </div>
  );
};

export default AppointmentTabs;
