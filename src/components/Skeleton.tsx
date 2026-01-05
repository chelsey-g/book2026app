export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="p-2 bg-gray-100 rounded-lg">
          <div className="h-5 w-5 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-32 bg-gray-100 rounded" />
    </div>
  );
}

export function ChartSkeletonLoader() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 bg-gray-200 rounded flex-grow" />
          </div>
        ))}
      </div>
      <div className="mt-6 h-64 bg-gray-100 rounded" />
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 animate-pulse">
      <div className="h-40 bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-3/4 bg-gray-100 rounded" />
    </div>
  );
}
