
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Data não definida';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};
