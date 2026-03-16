import { useState, useEffect, type FormEvent } from 'react';
import { apiService } from '../services/apiService';
import type { Appointment } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await apiService.appointments.findAll();
      setAppointments(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar agendamentos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiService.appointments.create({ title, description, date });
      setTitle('');
      setDescription('');
      setDate('');
      setShowForm(false);
      await loadAppointments();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao criar agendamento.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este agendamento?')) return;
    try {
      await apiService.appointments.delete(id);
      await loadAppointments();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao excluir agendamento.');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  if (isLoading) return <LoadingSpinner message="Carregando agendamentos..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie seus compromissos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showForm ? 'Cancelar' : 'Novo Agendamento'}
        </button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Agendamento</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="apt-title" className="block text-sm font-semibold text-gray-700 mb-1.5">Título</label>
              <input
                id="apt-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                placeholder="Ex: Consultoria de Marketing"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
              />
            </div>
            <div>
              <label htmlFor="apt-date" className="block text-sm font-semibold text-gray-700 mb-1.5">Data e Hora</label>
              <input
                id="apt-date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="apt-desc" className="block text-sm font-semibold text-gray-700 mb-1.5">Descrição (opcional)</label>
              <textarea
                id="apt-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                placeholder="Detalhes do agendamento..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit" disabled={formLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-60 cursor-pointer"
              >
                {formLoading ? 'Criando...' : 'Criar Agendamento'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Nenhum agendamento encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Crie seu primeiro agendamento clicando no botão acima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 group">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColor(apt.status)}`}>
                  {statusLabel(apt.status)}
                </span>
                <button
                  onClick={() => handleDelete(apt.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Excluir"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{apt.title}</h3>
              {apt.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{apt.description}</p>}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(apt.date).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </div>
              {apt.user && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {apt.user.name.charAt(0)}
                  </div>
                  <span className="text-xs text-gray-500">{apt.user.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
