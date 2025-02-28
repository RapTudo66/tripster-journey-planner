
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Plus, Wallet, CalendarIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Expense } from "@/lib/supabase";
import { useSearchParams } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Hospedagem",
  "Transporte",
  "Lazer",
  "Compras",
  "Outros"
];

const COLORS = ['#F97316', '#FDBA74', '#C2410C', '#FB923C', '#EA580C', '#FFB78C'];

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('trip');

  useEffect(() => {
    if (user && tripId) {
      loadExpenses();
    }
  }, [user, tripId]);

  const loadExpenses = async () => {
    if (!user || !tripId) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as despesas",
        variant: "destructive",
      });
      return;
    }

    setExpenses(data || []);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar despesas",
        variant: "destructive",
      });
      return;
    }

    if (!tripId) {
      toast({
        title: "Erro",
        description: "ID da viagem não encontrado",
        variant: "destructive",
      });
      return;
    }

    if (!category || !amount || !description || !expenseDate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const newExpense = {
      user_id: user.id,
      trip_id: tripId,
      category,
      amount: parseFloat(amount),
      description,
      date: expenseDate.toISOString().split('T')[0],
    };

    const { error } = await supabase
      .from('expenses')
      .insert([newExpense]);

    if (error) {
      console.error("Erro ao salvar despesa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a despesa",
        variant: "destructive",
      });
      return;
    }

    await loadExpenses();
    setCategory("");
    setAmount("");
    setDescription("");
    setExpenseDate(new Date());

    toast({
      title: "Despesa adicionada",
      description: "Sua despesa foi registrada com sucesso",
    });
  };

  const expensesByCategory = EXPENSE_CATEGORIES.map(cat => ({
    name: cat,
    value: expenses
      .filter(expense => expense.category === cat)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(cat => cat.value > 0);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Corrigido: Formatador customizado para o Recharts Tooltip
  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return `${value.toFixed(2)} €`;
    }
    return `${value} €`;
  };

  // Corrigido: Formatador customizado para o label do Pie chart
  const renderCustomizedLabel = ({ name, value }: { name: string, value: number }) => {
    return `${name}: ${value.toFixed(2)} €`;
  };

  if (!tripId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Nenhuma viagem selecionada
            </h1>
            <p className="mt-2 text-muted-foreground">
              Por favor, selecione uma viagem para ver suas despesas
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário de Adição de Despesas */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-primary" />
              Adicionar Despesa
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-input bg-background">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Digite uma descrição"
                  className="border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label>Data da Despesa</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-input bg-background"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {expenseDate ? (
                        format(expenseDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 bg-card border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={expenseDate}
                      onSelect={setExpenseDate}
                      initialFocus
                      className="bg-card text-foreground"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Despesa
              </Button>
            </form>
          </div>

          {/* Gráfico de Pizza */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Distribuição de Despesas
            </h2>
            <div className="h-[300px]">
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={renderCustomizedLabel}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatTooltipValue(value), 'Valor']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhuma despesa registrada para mostrar no gráfico
                </div>
              )}
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Despesas por Categoria
            </h2>
            <div className="h-[300px]">
              {expensesByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expensesByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: "#D1D5DB" }} />
                    <YAxis tick={{ fill: "#D1D5DB" }} />
                    <Tooltip
                      formatter={(value) => [formatTooltipValue(value), 'Valor']}
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Valor (€)" fill="#F97316" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhuma despesa registrada para mostrar no gráfico
                </div>
              )}
            </div>
          </div>

          {/* Lista de Despesas */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Histórico de Despesas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-foreground">Data</th>
                    <th className="text-left p-2 text-foreground">Categoria</th>
                    <th className="text-left p-2 text-foreground">Descrição</th>
                    <th className="text-right p-2 text-foreground">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border">
                      <td className="p-2 text-foreground">
                        {expense.date 
                          ? new Date(expense.date).toLocaleDateString('pt-BR')
                          : new Date(expense.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2 text-foreground">{expense.category}</td>
                      <td className="p-2 text-foreground">{expense.description}</td>
                      <td className="p-2 text-right text-foreground">
                        {expense.amount.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-muted-foreground">
                        Nenhuma despesa registrada
                      </td>
                    </tr>
                  )}
                </tbody>
                {expenses.length > 0 && (
                  <tfoot>
                    <tr className="border-t border-border font-semibold">
                      <td colSpan={3} className="p-2 text-right text-foreground">Total:</td>
                      <td className="p-2 text-right text-primary">
                        {totalExpenses.toFixed(2)} €
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
