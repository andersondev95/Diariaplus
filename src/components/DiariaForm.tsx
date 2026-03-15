import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Diaria } from '../lib/database';

interface DiariaFormProps {
  diaria?: Diaria | null;
  onSave: (data: {
    empresa: string;
    valor: number;
    data: string;
    situacao: 'Pago' | 'A Receber';
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
  const [situacao, setSituacao] = useState<'Pago' | 'A Receber'>('A Receber');
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 border-b border-white/10 px-6 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {diaria ? 'Editar Diária' : 'Nova Diária'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="empresa" className="block text-sm font-semibold text-white/90 mb-2">
              Nome da Empresa *
            </label>
            <input
              type="text"
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="valor" className="block text-sm font-semibold text-white/90 mb-2">
              Valor (R$) *
            </label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="data" className="block text-sm font-semibold text-white/90 mb-2">
              Data *
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="motorista" className="block text-sm font-semibold text-white/90 mb-2">
              Motorista
            </label>
            <input
              type="text"
              id="motorista"
              value={motorista}
              onChange={(e) => setMotorista(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Nome do motorista (opcional)"
            />
          </div>

          <div>
            <label htmlFor="situacao" className="block text-sm font-semibold text-white/90 mb-2">
              Situação *
            </label>
            <select
              id="situacao"
              value={situacao}
              onChange={(e) => setSituacao(e.target.value as 'Pago' | 'A Receber')}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            >
              <option value="A Receber" className="bg-slate-800">A Receber</option>
              <option value="Pago" className="bg-slate-800">Pago</option>
            </select>
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-semibold text-white/90 mb-2">
              Comprovante (opcional)
            </label>
            <div className="mt-2 flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-white/20 hover:border-blue-500 rounded-lg transition-colors bg-white/5 hover:bg-blue-500/10">
                  <Upload size={20} className="mr-2 text-white/60" />
                  <span className="text-sm text-white/70">
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
                  className="p-2.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/30"
                  aria-label="Remover arquivo"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-white/40">JPG, PNG ou PDF (máx. 5MB)</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-all font-medium"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all shadow-lg hover:shadow-xl"
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
