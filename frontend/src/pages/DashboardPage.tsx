import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import type { Appointment } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function DashboardPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await apiService.appointments.findAll();
      setAppointments(res.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao carregar dados do dashboard.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === 'CONFIRMED').length,
    pending: appointments.filter((a) => a.status === 'PENDING').length,
    cancelled: appointments.filter((a) => a.status === 'CANCELLED').length,
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700';
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmado';
      case 'PENDING': return 'Pendente';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  if (isLoading) return <LoadingSpinner message="Carregando dashboard..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Aqui está o resumo da sua conta.</p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: '📊', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Confirmados', value: stats.confirmed, icon: '✅', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pendentes', value: stats.pending, icon: '⏳', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
          { label: 'Cancelados', value: stats.cancelled, icon: '❌', color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Agendamentos Recentes</h2>
        </div>
        {appointments.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">Nenhum agendamento encontrado.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.slice(0, 5).map((appointment) => (
              <div key={appointment.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{appointment.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.date).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor(appointment.status)}`}>
                  {statusLabel(appointment.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
