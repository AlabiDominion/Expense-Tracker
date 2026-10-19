const navigation = [
  ["Overview", "▦"],
  ["Transactions", "⇄"],
  ["Reports", "▤"],
  ["Categories", "◈"],
];
export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 flex w-[235px] flex-col border-r border-[#e5eae6] bg-white px-5 py-[30px] max-[1100px]:w-[195px] max-[1100px]:px-[14px] max-[1100px]:py-[25px] max-[780px]:relative max-[780px]:h-auto max-[780px]:w-full max-[780px]:flex-row max-[780px]:items-center max-[780px]:gap-5 max-[780px]:border-b max-[780px]:px-5 max-[780px]:py-4 max-[480px]:gap-[5px] max-[480px]:px-3 max-[480px]:py-[15px] print:hidden">
      <a
        className="flex flex-col items-start gap-[10px] text-[32px] font-bold tracking-normal text-[#233f31] no-underline max-[780px]:shrink-0 max-[780px]:gap-[5px]"
        href="#"
        onClick={(e) => e.preventDefault()}
      >
        <img
          src="/ecews-logo.png"
          alt="ECEWS"
          className="block h-auto w-[172px] max-w-full object-contain max-[1100px]:w-[155px] max-[780px]:w-[130px] max-[480px]:w-[116px]"
        />
        <span className="text-[10px] font-medium tracking-[2px] text-[#7c8e81] uppercase max-[780px]:text-[8px] max-[780px]:tracking-[1.2px]">
          Expense Tracker
        </span>
      </a>
      <div className="my-[34px] flex items-center gap-[10px] rounded-[9px] border border-[#e6ece7] px-[9px] py-3 [&_strong]:text-[11px] [&_small]:mt-1 [&_small]:block [&_small]:text-[10px] [&_small]:text-[#96a096] max-[780px]:hidden">
        <span className="rounded-md bg-[#f0f4ed] p-[9px] text-[#77916a]">
          E
        </span>
        <div>
          <strong>ECEWS workspace</strong>
          <small>Your money, in focus</small>
        </div>
      </div>
      <div className="px-[13px] pb-[13px] text-[9px] tracking-[1.4px] text-[#98a399] max-[780px]:hidden">
        WORKSPACE
      </div>
      <nav className="grid gap-[7px] [&_button]:flex [&_button]:items-center [&_button]:gap-[13px] [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-[13px] [&_button]:text-left [&_button]:text-[#7c8880] [&_button>span]:w-[23px] [&_button>span]:text-[21px] [&_i]:ml-auto [&_i]:size-[6px] [&_i]:rounded-full [&_i]:bg-[#258562] max-[780px]:ml-auto max-[780px]:flex max-[780px]:gap-[3px] max-[780px]:[&_button]:gap-[5px] max-[780px]:[&_button]:p-[9px] max-[780px]:[&_button]:text-[10px] max-[780px]:[&_button>span]:w-auto max-[780px]:[&_button>span]:text-[17px] max-[780px]:[&_i]:hidden max-[480px]:[&_button]:p-[10px] max-[480px]:[&_button]:text-[0px] max-[480px]:[&_button_span]:text-[21px]">
        {navigation.map(([name, icon]) => (
          <button
            key={name}
            className={
              page === name ? "bg-[#eaf3ed]! font-semibold text-[#247b59]!" : ""
            }
            onClick={() => {
              onNavigate(name);
            }}
          >
            <span>{icon}</span>
            {name}
            {page === name && <i />}
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-10 max-[780px]:hidden">
        <div className="mt-[22px] flex items-center gap-[10px] border-t border-[#edf0ec] pt-5 [&_strong]:text-[11px] [&_small]:mt-1 [&_small]:block [&_small]:text-[10px] [&_small]:text-[#96a096] [&>span:last-child]:ml-auto">
          <span className="grid size-[35px] place-items-center rounded-full bg-[#e9eee5] text-[11px] font-semibold text-[#66815d]">
            AD
          </span>
          <div>
            <strong>Alabi Dominion</strong>
            <small>Expense Tracker</small>
          </div>
          <span>⌄</span>
        </div>
      </div>
    </aside>
  );
}
