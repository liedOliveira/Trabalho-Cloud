export default function LoadingSpinner({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 animate-spin border-t-indigo-600"></div>
      </div>
      <p className="mt-4 text-sm text-gray-500 font-medium">{message}</p>
    </div>
  );
}
