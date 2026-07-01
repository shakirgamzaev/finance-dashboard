"use client";

export default function HamburgerIcon({
  toggleShow,
}: {
  toggleShow: () => void;
}) {
  return (
    <button
      type="button"
      className="flex flex-col gap-1 p-3 active:opacity-60 lg:hidden w-[40px] bg-hamburger rounded-[6px] hover:cursor-pointer"
      onClick={toggleShow}
    >
      <div className="h-[2px] bg-white"></div>
      <div className="h-[2px] bg-white"></div>
      <div className="h-[2px] bg-white"></div>
    </button>
  );
}
