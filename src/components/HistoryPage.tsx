import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useState } from 'react';
import { Diaria } from '../lib/database';
import { DiariaCard } from './DiariaCard';
import { exportToPDF } from '../utils/pdfExport';

interface HistoryPageProps {
  diarias: Diaria[];
  onEdit: (diaria: Diaria) => void;
  onDelete: (id: string) => void;
}

export function HistoryPage({
  diarias,
  onEdit,
  onDelete,
}: HistoryPageProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

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

  const toggleCompany = (empresa: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(empresa)) {
      newExpanded.delete(empresa);
    } else {
      newExpanded.add(empresa);
    }
    setExpandedCompanies(newExpanded);
  };

  const groupedDiarias = getGroupedByCompany();
  const empresas = Object.keys(groupedDiarias).sort();

  const totalPago = diarias.reduce((sum, d) => sum + Number(d.valor), 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const handleExportPDF = (empresa: string, diariasEmpresa: Diaria[]) => {
    exportToPDF(empresa, diariasEmpresa);
  };

  if (diarias.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <img
          src="/IMG_20260217_131245.png"
          alt="Nenhuma diária"
          className="mx-auto mb-4 h-[80px] w-auto opacity-40"
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Nenhuma diária paga</h2>
        <p className="text-gray-600">As diárias marcadas como pagas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Total em Histórico</h3>
        <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPago)}</p>
        <p className="text-sm text-gray-500 mt-2">{diarias.length} diária(s) paga(s)</p>
      </div>

      {empresas.map(empresa => {
        const diariasEmpresa = groupedDiarias[empresa];
        const empresaTotal = diariasEmpresa.reduce((sum, d) => sum + Number(d.valor), 0);
        const isExpanded = expandedCompanies.has(empresa);

        return (
          <div key={empresa} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 cursor-pointer hover:from-green-700 hover:to-green-800 transition-all"
              onClick={() => toggleCompany(empresa)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-white flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-white flex-shrink-0" />
                  )}
                  <h2 className="text-2xl font-bold text-white">{empresa}</h2>
                </div>
                <div className="text-right text-white">
                  <p className="text-lg font-semibold">{formatCurrency(empresaTotal)}</p>
                  <p className="text-sm opacity-90">{diariasEmpresa.length} diária(s)</p>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleExportPDF(empresa, diariasEmpresa)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                    title="Exportar relatório em PDF"
                  >
                    <Download size={18} />
                    <span>Exportar PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                  {diariasEmpresa.map(diaria => (
                    <div key={diaria.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-lg font-bold text-green-600">{formatCurrency(diaria.valor)}</p>
                          <p className="text-xs text-gray-500">{formatDate(diaria.data)}</p>
                        </div>
                      </div>

                      {diaria.motorista && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Motorista:</span> {diaria.motorista}
                        </p>
                      )}

                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-300 mb-3">
                        Pago
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(diaria)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(diaria.id)}
                          className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
