import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { DiariaForm } from './components/DiariaForm';
import { CompanySection } from './components/CompanySection';
import { useDiarias } from './hooks/useDiarias';
import { Diaria } from './lib/database';

function App() {
  const { diarias, loading, createDiaria, updateDiaria, deleteDiaria } = useDiarias();
  const [showForm, setShowForm] = useState(false);
  const [editingDiaria, setEditingDiaria] = useState<Diaria | null>(null);

  const handleSave = async (data: {
    empresa: string;
    valor: number;
    data: string;
    situacao: 'Pago' | 'Pendente' | 'A Receber';
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

  const getGroupedByCompany = () => {
    const grouped: { [key: string]: Diaria[] } = {};
    diarias.forEach(diaria => {
      if (!grouped[diaria.empresa]) {
        grouped[diaria.empresa] = [];
      }
      grouped[diaria.empresa].push(diaria);
    });
    return grouped;
  };

  const groupedDiarias = getGroupedByCompany();
  const empresas = Object.keys(groupedDiarias).sort();

  const totalPago = diarias
    .filter(d => d.situacao === 'Pago')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const totalPendente = diarias
    .filter(d => d.situacao === 'Pendente')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const totalAReceber = diarias
    .filter(d => d.situacao === 'A Receber')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <img
              src="/IMG_20260217_131245.png"
              alt="Minhas Diárias"
              className="h-[60px] w-auto"
            />
            <button
              onClick={() => setShowForm(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              aria-label="Adicionar nova diária"
              title="Nova Diária"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Pago</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Pendente</h3>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPendente)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <h3 className="text-sm font-medium text-gray-600 mb-1">A Receber</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalAReceber)}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-600">Carregando diárias...</p>
          </div>
        ) : diarias.length === 0 ? (
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
              />
            ))}
          </div>
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
