import { Pencil, Trash2, FileText, CheckCircle } from 'lucide-react';
import { Diaria } from '../lib/database';

interface DiariaCardProps {
  diaria: Diaria;
  onEdit: (diaria: Diaria) => void;
  onDelete: (id: string) => void;
  onMarkAsPaid?: (diaria: Diaria) => void;
}

export function DiariaCard({ diaria, onEdit, onDelete, onMarkAsPaid }: DiariaCardProps) {
  const situacaoColors = {
    'Pago': 'bg-green-500/20 text-green-300 border-green-500/50',
    'A Receber': 'bg-red-500/20 text-red-300 border-red-500/50'
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:border-white/40 hover:bg-white/15 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{diaria.empresa}</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{formatCurrency(diaria.valor)}</p>
        </div>
        <div className="flex gap-1.5">
          {diaria.situacao !== 'Pago' && onMarkAsPaid && (
            <button
              onClick={() => onMarkAsPaid(diaria)}
              className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-all hover:scale-110"
              aria-label="Marcar como pago"
              title="Marcar como pago"
            >
              <CheckCircle size={20} />
            </button>
          )}
          <button
            onClick={() => onEdit(diaria)}
            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all hover:scale-110"
            aria-label="Editar"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => onDelete(diaria.id)}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all hover:scale-110"
            aria-label="Excluir"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-white/10">
          <span className="text-white/60">Data:</span>
          <span className="text-white/90 font-medium">{formatDate(diaria.data)}</span>
        </div>

        {diaria.motorista && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/60">Motorista:</span>
            <span className="text-white/90 font-medium">{diaria.motorista}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <span className="text-white/60">Situação:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${situacaoColors[diaria.situacao]}`}>
            {diaria.situacao}
          </span>
        </div>

        {diaria.comprovante_base64 && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-white/60">Comprovante:</span>
            <a
              href={diaria.comprovante_base64}
              download={diaria.comprovante_nome || 'comprovante'}
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <FileText size={16} />
              <span>{diaria.comprovante_nome || 'Download'}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
