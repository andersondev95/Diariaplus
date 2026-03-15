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
  onMarkAsPaid?: (diaria: Diaria) => void;
}

export function CompanySection({
  empresa,
  diarias,
  onEdit,
  onDelete,
  onMarkAsPaid,
}: CompanySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalAReceber = diarias
    .filter(d => d.situacao === 'A Receber')
    .reduce((sum, d) => sum + Number(d.valor), 0);

  const total = totalAReceber;

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
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:border-white/40 transition-all group">
      <div
        className="bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700 px-6 py-5 cursor-pointer transition-all group-hover:shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {isExpanded ? (
              <ChevronUp size={22} className="text-white flex-shrink-0 transition-transform" />
            ) : (
              <ChevronDown size={22} className="text-white flex-shrink-0 transition-transform" />
            )}
            <h2 className="text-2xl font-bold text-white">{empresa}</h2>
          </div>
          <div className="text-right text-white">
            <p className="text-2xl font-bold">{formatCurrency(total)}</p>
            <p className="text-sm text-blue-100">{diarias.length} diária(s)</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-6 bg-gradient-to-b from-white/5 to-white/0">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-5 backdrop-blur-sm">
            <p className="text-sm font-medium text-red-300 mb-2">A Receber</p>
            <p className="text-3xl font-bold text-red-400">
              {formatCurrency(totalAReceber)}
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              title="Exportar relatório em PDF"
            >
              <Download size={18} />
              <span className="font-medium">Exportar PDF</span>
            </button>
          </div>

          <div className="border-t border-white/10 pt-6">
            {diarias.length === 0 ? (
              <p className="text-center text-white/50">Nenhuma diária nesta empresa</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diarias.map(diaria => (
                  <DiariaCard
                    key={diaria.id}
                    diaria={diaria}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMarkAsPaid={onMarkAsPaid}
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
