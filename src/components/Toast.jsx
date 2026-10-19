export default function Toast({ message }) {
  return message ? (
    <div
      className="fixed bottom-[25px] left-1/2 z-50 -translate-x-1/2 rounded-[10px] bg-[#254d3d] px-[25px] py-[15px] text-xs text-white shadow-[0_7px_30px_#14302022] print:hidden"
      role="status"
    >
      {message}
    </div>
  ) : null;
}
