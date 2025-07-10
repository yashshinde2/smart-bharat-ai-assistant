export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-orange mb-4"></div>
      <p className="text-brand-orange font-semibold text-lg">Loading updates...</p>
    </div>
  );
}
