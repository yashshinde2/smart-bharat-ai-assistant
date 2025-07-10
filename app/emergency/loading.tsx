export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 mb-4"></div>
      <p className="text-red-500 font-semibold text-lg">Loading emergency page...</p>
    </div>
  );
}
