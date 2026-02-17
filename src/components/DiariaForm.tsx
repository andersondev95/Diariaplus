import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Diaria } from '../lib/database';

interface DiariaFormProps {
  diaria?: Diaria | null;
  onSave: (data: {
    empresa: string;
    valor: number;
    data: string;
    situacao: 'Pago' | 'Pendente' | 'A Receber';
    motorista?: string;
    file?: File;
  }) => Promise<void>;
  onClose: () => void;
}

export function DiariaForm({ diaria, onSave, onClose }: DiariaFormProps) {
  const [empresa, setEmpresa] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [motorista, setMotorista] = useState('');
  const [situacao, setSituacao] = useState<'Pago' | 'Pendente' | 'A Receber'>('Pendente');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (diaria) {
      setEmpresa(diaria.empresa);
      setValor(diaria.valor.toString());
      setData(diaria.data);
      setMotorista(diaria.motorista || '');
      setSituacao(diaria.situacao);
    }
  }, [diaria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!empresa || !valor || !data) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        empresa,
        valor: parseFloat(valor),
        data,
        motorista: motorista || undefined,
        situacao,
        file: file || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar a diária. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

      if (!validTypes.includes(selectedFile.type)) {
        alert('Por favor, selecione um arquivo válido (JPG, PNG ou PDF).');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB.');
        return;
      }

      setFile(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {diaria ? 'Editar Diária' : 'Nova Diária'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa *
            </label>
            <input
              type="text"
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$) *
            </label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="motorista" className="block text-sm font-medium text-gray-700 mb-1">
              Motorista
            </label>
            <input
              type="text"
              id="motorista"
              value={motorista}
              onChange={(e) => setMotorista(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do motorista (opcional)"
            />
          </div>

          <div>
            <label htmlFor="situacao" className="block text-sm font-medium text-gray-700 mb-1">
              Situação *
            </label>
            <select
              id="situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value as 'Pago' | 'Pendente' | 'A Receber')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="Pendente">Pendente</option>
              <option value="A Receber">A Receber</option>
              <option value="Pago">Pago</option>
            </select>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Comprovante (opcional)
            </label>
            <div className="mt-1 flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  <Upload size={20} className="mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {file ? file.name : 'Selecionar arquivo'}
                  </span>
                </div>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  className="hidden"
                />
              </label>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remover arquivo"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">JPG, PNG ou PDF (máx. 5MB)</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
