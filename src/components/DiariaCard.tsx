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
    'Pago': 'bg-green-100 text-green-800 border-green-300',
    'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'A Receber': 'bg-red-100 text-red-800 border-red-300'
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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{diaria.empresa}</h3>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(diaria.valor)}</p>
        </div>
        <div className="flex gap-2">
          {diaria.situacao !== 'Pago' && onMarkAsPaid && (
            <button
              onClick={() => onMarkAsPaid(diaria)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              aria-label="Marcar como pago"
              title="Marcar como pago"
            >
              <CheckCircle size={20} />
            </button>
          )}
          <button
            onClick={() => onEdit(diaria)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Editar"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => onDelete(diaria.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Excluir"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Data:</span>
          <span className="text-gray-800 font-medium">{formatDate(diaria.data)}</span>
        </div>

        {diaria.motorista && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Motorista:</span>
            <span className="text-gray-800 font-medium">{diaria.motorista}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Situação:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${situacaoColors[diaria.situacao]}`}>
            {diaria.situacao}
          </span>
        </div>

        {diaria.comprovante_base64 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Comprovante:</span>
            <a
              href={diaria.comprovante_base64}
              download={diaria.comprovante_nome || 'comprovante'}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FileText size={16} />
              <span className="text-sm">{diaria.comprovante_nome || 'Download'}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
