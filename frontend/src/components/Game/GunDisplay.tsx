interface GunDisplayProps {
  gun: number[]; // [fakeCount, realCount]
  actionResponse: any;
}

export default function GunDisplay({ gun, actionResponse }: GunDisplayProps) {
  const [fakeCount, realCount] = gun;
  const totalBullets = fakeCount + realCount;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border-2 border-red-900">
      <div className="text-center">
        <div className="text-6xl mb-4">🔫</div>

        {/* Bullet Counter */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400">{fakeCount}</div>
            <div className="text-sm text-gray-500">Đạn giả</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{realCount}</div>
            <div className="text-sm text-gray-500">Đạn thật</div>
          </div>
        </div>

        {/* Bullet Visualizer */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {Array.from({ length: totalBullets }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-8 bg-yellow-600 rounded-sm"
            />
          ))}
        </div>

        {/* Action Message */}
        {actionResponse && (
          <div className="mt-4 p-3 bg-red-900 rounded text-white">
            <p className="font-semibold">{actionResponse.action}</p>
            {actionResponse.message && (
              <p className="text-sm">{actionResponse.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

