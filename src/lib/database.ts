export interface Diaria {
  id: string;
  empresa: string;
  valor: number;
  data: string;
  situacao: 'Pago' | 'Pendente' | 'A Receber';
  motorista?: string | null;
  comprovante_base64: string | null;
  comprovante_nome: string | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'minhas_diarias_db';

export class Database {
  static getDiarias(): Diaria[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao ler diárias:', error);
      return [];
    }
  }

  static saveDiarias(diarias: Diaria[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(diarias));
    } catch (error) {
      console.error('Erro ao salvar diárias:', error);
      if (error instanceof Error && error.message.includes('QuotaExceededError')) {
        this.cleanOldComprovantes();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(diarias));
      }
    }
  }

  static addDiaria(diaria: Diaria): void {
    const diarias = this.getDiarias();
    diarias.push(diaria);
    this.saveDiarias(diarias);
  }

  static updateDiaria(id: string, updates: Partial<Diaria>): void {
    const diarias = this.getDiarias();
    const index = diarias.findIndex(d => d.id === id);
    if (index !== -1) {
      diarias[index] = { ...diarias[index], ...updates };
      this.saveDiarias(diarias);
    }
  }

  static deleteDiaria(id: string): void {
    const diarias = this.getDiarias();
    this.saveDiarias(diarias.filter(d => d.id !== id));
  }

  static getDiariaById(id: string): Diaria | null {
    const diarias = this.getDiarias();
    return diarias.find(d => d.id === id) || null;
  }

  static private cleanOldComprovantes(): void {
    const diarias = this.getDiarias();
    const sortedByDate = [...diarias].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    for (const diaria of sortedByDate) {
      if (diaria.comprovante_base64) {
        diaria.comprovante_base64 = null;
        diaria.comprovante_nome = null;
        this.saveDiarias(diarias);
      }
    }
  }

  static getStorageInfo(): { used: number; available: number } {
    const data = localStorage.getItem(STORAGE_KEY) || '';
    const bytes = new Blob([data]).size;
    return {
      used: bytes,
      available: 5 * 1024 * 1024,
    };
  }

  static exportData(): string {
    const diarias = this.getDiarias();
    return JSON.stringify(diarias, null, 2);
  }

  static importData(jsonString: string): void {
    try {
      const diarias = JSON.parse(jsonString);
      if (Array.isArray(diarias)) {
        this.saveDiarias(diarias);
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw new Error('Formato de importação inválido');
    }
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
