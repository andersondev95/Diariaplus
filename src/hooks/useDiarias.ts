import { useState, useEffect } from 'react';
import { Database, Diaria } from '../lib/database';

export function useDiarias() {
  const [diarias, setDiarias] = useState<Diaria[]>([]);
  const [loading, setLoading] = useState(true);

  const generateId = () => {
    return `diaria-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const loadDiarias = () => {
    const data = Database.getDiarias();
    setDiarias(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDiarias();
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createDiaria = async (data: {
    empresa: string;
    valor: number;
    data: string;
    situacao: 'Pago' | 'Pendente' | 'A Receber';
    motorista?: string;
    file?: File;
  }) => {
    try {
      let comprovanteBase64: string | null = null;
      let comprovanteName: string | null = null;

      if (data.file) {
        comprovanteBase64 = await fileToBase64(data.file);
        comprovanteName = data.file.name;
      }

      const newDiaria: Diaria = {
        id: generateId(),
        empresa: data.empresa,
        valor: data.valor,
        data: data.data,
        situacao: data.situacao,
        motorista: data.motorista || null,
        comprovante_base64: comprovanteBase64,
        comprovante_nome: comprovanteName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      Database.addDiaria(newDiaria);
      loadDiarias();
    } catch (error) {
      console.error('Erro ao criar diária:', error);
      throw error;
    }
  };

  const updateDiaria = async (id: string, data: {
    empresa: string;
    valor: number;
    data: string;
    situacao: 'Pago' | 'Pendente' | 'A Receber';
    motorista?: string;
    file?: File;
  }) => {
    try {
      const updateData: Partial<Diaria> = {
        empresa: data.empresa,
        valor: data.valor,
        data: data.data,
        situacao: data.situacao,
        motorista: data.motorista || null,
        updated_at: new Date().toISOString(),
      };

      if (data.file) {
        updateData.comprovante_base64 = await fileToBase64(data.file);
        updateData.comprovante_nome = data.file.name;
      }

      Database.updateDiaria(id, updateData);
      loadDiarias();
    } catch (error) {
      console.error('Erro ao atualizar diária:', error);
      throw error;
    }
  };

  const deleteDiaria = async (id: string) => {
    try {
      Database.deleteDiaria(id);
      loadDiarias();
    } catch (error) {
      console.error('Erro ao excluir diária:', error);
      throw error;
    }
  };

  return {
    diarias,
    loading,
    createDiaria,
    updateDiaria,
    deleteDiaria,
  };
}
