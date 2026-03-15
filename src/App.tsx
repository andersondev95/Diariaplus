import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { DiariaForm } from './components/DiariaForm';
import { CompanySection } from './components/CompanySection';
import { HistoryPage } from './components/HistoryPage';
import { useDiarias } from './hooks/useDiarias';
import { Diaria } from './lib/database';

function App() {
  const { diarias, loading, createDiaria, updateDiaria, deleteDiaria } = useDiarias();
  const [showForm, setShowForm] = useState(false);
  const [editingDiaria, setEditingDiaria] = useState<Diaria | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const handleSave = async (data: {
    empresa: string;
    valor: number;
    data: string;
    situacao: 'Pago' | 'A Receber';
    motorista?: string;
    file?: File;
  }) => {
    if (editingDiaria) {
      await updateDiaria(editingDiaria.id, data);
    } else {
      await createDiaria(data);
    }
  };

  const handleEdit = (diaria: Diaria) => {
    setEditingDiaria(diaria);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta diária?')) {
      await deleteDiaria(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDiaria(null);
  };

  const handleMarkAsPaid = (diaria: Diaria) => {
    updateDiaria(diaria.id, {
      empresa: diaria.empresa,
      valor: diaria.valor,
      data: diaria.data,
      situacao: 'Pago',
      motorista: diaria.motorista,
    });
  };

  const getGroupedByCompany = (diariasList: Diaria[]) => {
    const grouped: { [key: string]: Diaria[] } = {};
    diariasList.forEach(diaria => {
      if (!grouped[diaria.empresa]) {
        grouped[diaria.empresa] = [];
      }
      grouped[diaria.empresa].push(diaria);
    });
    return grouped;
  };

  const diariasCurrent = diarias.filter(d => d.situacao !== 'Pago');
  const diariasHistory = diarias.filter(d => d.situacao === 'Pago');

  const groupedDiarias = getGroupedByCompany(diariasCurrent);
  const empresas = Object.keys(groupedDiarias).sort();

  const totalAReceber = diariasCurrent
    .filter(d => d.situacao === 'A Receber')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <img
                  src="/IMG_20260217_131245.png"
                  alt="Minhas Diárias"
                  className="h-[50px] w-auto filter brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Minhas Diárias</h1>
                <p className="text-slate-400 text-sm">Gerencie suas diárias com facilidade</p>
              </div>
            </div>
            {activeTab === 'current' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                aria-label="Adicionar nova diária"
                title="Nova Diária"
              >
                <Plus size={20} />
                <span className="font-medium">Nova Diária</span>
              </button>
            )}
          </div>

          <div className="flex gap-1 mb-8 bg-slate-700/50 backdrop-blur-sm p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'current'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              A Receber
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Histórico Pago
            </button>
          </div>

          {activeTab === 'current' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm hover:border-red-500/50 transition-all">
              <h3 className="text-sm font-medium text-red-300 mb-2">A Receber</h3>
              <p className="text-3xl font-bold text-red-400">{formatCurrency(totalAReceber)}</p>
              <p className="text-xs text-red-300/70 mt-2">Aguardando pagamento</p>
            </div>
          </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600">Carregando diárias...</p>
          </div>
        ) : activeTab === 'current' ? (
          diariasCurrent.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <img
                src="/IMG_20260217_131245.png"
                alt="Nenhuma diária"
                className="mx-auto mb-4 h-[80px] w-auto opacity-40"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Nenhuma diária cadastrada</h2>
              <p className="text-gray-600 mb-6">Comece adicionando sua primeira diária de trabalho.</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>Adicionar Primeira Diária</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {empresas.map(empresa => (
                <CompanySection
                  key={empresa}
                  empresa={empresa}
                  diarias={groupedDiarias[empresa]}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMarkAsPaid={handleMarkAsPaid}
                />
              ))}
            </div>
          )
        ) : (
          <HistoryPage
            diarias={diariasHistory}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showForm && (
        <DiariaForm
          diaria={editingDiaria}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;
