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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center">
        <img
          src="/IMG_20260217_131245.png"
          alt="Nenhuma diária"
          className="mx-auto mb-4 h-[80px] w-auto opacity-20"
        />
        <h2 className="text-2xl font-bold text-white mb-2">Nenhuma diária paga</h2>
        <p className="text-white/50">As diárias marcadas como pagas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600/40 to-green-700/40 border border-green-500/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-sm font-medium text-green-300 mb-2">Total em Histórico</h3>
        <p className="text-4xl font-bold text-green-400">{formatCurrency(totalPago)}</p>
        <p className="text-sm text-green-300/70 mt-2">{diarias.length} diária(s) paga(s)</p>
      </div>

      {empresas.map(empresa => {
        const diariasEmpresa = groupedDiarias[empresa];
        const empresaTotal = diariasEmpresa.reduce((sum, d) => sum + Number(d.valor), 0);
        const isExpanded = expandedCompanies.has(empresa);

        return (
          <div key={empresa} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:border-white/40 transition-all group">
            <div
              className="bg-gradient-to-r from-green-600/80 to-green-700/80 hover:from-green-600 hover:to-green-700 px-6 py-5 cursor-pointer transition-all group-hover:shadow-lg"
              onClick={() => toggleCompany(empresa)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {isExpanded ? (
                    <ChevronUp size={22} className="text-white flex-shrink-0" />
                  ) : (
                    <ChevronDown size={22} className="text-white flex-shrink-0" />
                  )}
                  <h2 className="text-2xl font-bold text-white">{empresa}</h2>
                </div>
                <div className="text-right text-white">
                  <p className="text-2xl font-bold">{formatCurrency(empresaTotal)}</p>
                  <p className="text-sm text-green-100">{diariasEmpresa.length} diária(s)</p>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-6 space-y-4 bg-gradient-to-b from-white/5 to-white/0">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleExportPDF(empresa, diariasEmpresa)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    title="Exportar relatório em PDF"
                  >
                    <Download size={18} />
                    <span className="font-medium">Exportar PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/10 pt-4">
                  {diariasEmpresa.map(diaria => (
                    <div key={diaria.id} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-lg font-bold text-green-400">{formatCurrency(diaria.valor)}</p>
                          <p className="text-xs text-white/50">{formatDate(diaria.data)}</p>
                        </div>
                      </div>

                      {diaria.motorista && (
                        <p className="text-sm text-white/80 mb-2">
                          <span className="font-medium">Motorista:</span> {diaria.motorista}
                        </p>
                      )}

                      <span className="inline-block px-2 py-1 bg-green-500/30 text-green-300 text-xs font-semibold rounded-full border border-green-500/50 mb-3">
                        Pago
                      </span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(diaria)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all border border-blue-500/30"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(diaria.id)}
                          className="flex-1 px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
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
