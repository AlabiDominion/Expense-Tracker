export default function Topbar({ page, mode, workspace, onWorkspaceChange }) {
  return (
    <header className="flex h-[74px] items-center justify-between border-b border-[#e6ebe7] bg-white px-[38px] text-[11px] text-[#93a094] [&_strong]:font-medium [&_strong]:text-[#516457] max-[1100px]:px-[22px] max-[780px]:h-[52px] print:hidden">
      <span>
        Workspace <span className="mx-[15px] text-[#c5ccc6]">/</span>{" "}
        <strong>{page}</strong>
      </span>
      <div className="flex items-center gap-[22px] [&_select]:text-[11px] max-[780px]:gap-2 max-[780px]:[&_select]:max-w-[135px] max-[780px]:[&_select]:p-[6px]">
        <select
          aria-label="Data workspace"
          value={workspace}
          onChange={(event) => onWorkspaceChange(event.target.value)}
        >
          <option value="live">Live database</option>
          <option value="demo">Presentation demo</option>
        </select>
        <span
          className={`flex items-center gap-[6px] text-[10px] [&_i]:size-[6px] [&_i]:rounded-full [&_i]:bg-[#d6ac5b] max-[480px]:text-[9px] ${mode === "MySQL API" ? "[&_i]:bg-[#298664]!" : ""} `}
        >
          <i />
          {mode}
        </span>
        <span className="text-[11px] font-medium text-[#516457] max-[480px]:hidden">
          Alabi Dominion
        </span>
        <span
          title="Alabi Dominion"
          className="grid size-[30px] place-items-center rounded-full bg-[#e9eee5] text-[10px] font-semibold text-[#66815d]"
        >
          AD
        </span>
      </div>
    </header>
  );
}
