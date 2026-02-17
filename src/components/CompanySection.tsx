import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useState } from 'react';
import { Diaria } from '../lib/database';
import { DiariaCard } from './DiariaCard';
import { exportToPDF } from '../utils/pdfExport';

interface CompanySectionProps {
  empresa: string;
  diarias: Diaria[];
  onEdit: (diaria: Diaria) => void;
  onDelete: (id: string) => void;
}

export function CompanySection({
  empresa,
  diarias,
  onEdit,
  onDelete,
}: CompanySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalPago = diarias
    .filter(d => d.situacao === 'Pago')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const totalPendente = diarias
    .filter(d => d.situacao === 'Pendente')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const totalAReceber = diarias
    .filter(d => d.situacao === 'A Receber')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const total = totalPago + totalPendente + totalAReceber;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleExportPDF = () => {
    exportToPDF(empresa, diarias);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
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
            <p className="text-lg font-semibold">{formatCurrency(total)}</p>
            <p className="text-sm opacity-90">{diarias.length} diária(s)</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">Pago</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(totalPago)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm font-medium text-yellow-700 mb-1">Pendente</p>
              <p className="text-2xl font-bold text-yellow-700">
                {formatCurrency(totalPendente)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <p className="text-sm font-medium text-red-700 mb-1">A Receber</p>
              <p className="text-2xl font-bold text-red-700">
                {formatCurrency(totalAReceber)}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              title="Exportar relatório em PDF"
            >
              <Download size={18} />
              <span>Exportar PDF</span>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {diarias.length === 0 ? (
              <p className="text-center text-gray-500">Nenhuma diária nesta empresa</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diarias.map(diaria => (
                  <DiariaCard
                    key={diaria.id}
                    diaria={diaria}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
