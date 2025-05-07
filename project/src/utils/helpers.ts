import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Gerar ID único
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Formatar valor para moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatar data para exibição
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

// Formatar mês para exibição
export const formatMonth = (month: number, year: number): string => {
  const date = new Date(year, month, 1);
  return format(date, 'MMMM yyyy', { locale: ptBR });
};

// Obter mês e ano atual em formato de string
export const getCurrentMonthYearString = (): string => {
  const now = new Date();
  return format(now, 'MMMM yyyy', { locale: ptBR });
};

// Calcular porcentagem
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Derivar cor mais clara baseada em uma cor base
export const getLighterColor = (color: string, opacity: number = 0.2): string => {
  // Remover o # do início se existir
  const hex = color.replace('#', '');
  
  // Converter hex para rgb
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};