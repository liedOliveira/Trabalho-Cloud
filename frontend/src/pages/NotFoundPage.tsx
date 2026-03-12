import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-gray-600 mt-4 font-medium">Página não encontrada</p>
        <p className="text-gray-400 mt-2">A página que você procura não existe ou foi removida.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          ← Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
