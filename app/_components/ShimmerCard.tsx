//shimmering placeholder card shown while page data is loading
export default function ShimmerCard() {
  return (
    <div className="relative overflow-hidden flex flex-col w-full h-75 max-w-212.5 justify-center -mt-17.5 gap-6 p-6 rounded-[13px] shadow-[3px_3px_8px_rgba(0,0,0,0.12)] bg-white">
      {/* full-width 50px shimmer rectangle, sweeps top → bottom */}
      <div className="absolute top-0 left-0 w-[200%] h-[170px] animate-shimmer bg-linear-to-b from-transparent via-gray-300 to-transparent" />
    </div>
  );
}
