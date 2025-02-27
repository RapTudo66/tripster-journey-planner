
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

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

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

  if (!tripId) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-800">
              Nenhuma viagem selecionada
            </h1>
            <p className="mt-2 text-neutral-600">
              Por favor, selecione uma viagem para ver suas despesas
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário de Adição de Despesas */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Adicionar Despesa
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Digite uma descrição"
                />
              </div>

              <div className="space-y-2">
                <Label>Data da Despesa</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {expenseDate ? (
                        format(expenseDate, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span className="text-muted-foreground">Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expenseDate}
                      onSelect={setExpenseDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Despesa
              </Button>
            </form>
          </div>

          {/* Gráfico de Pizza */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              Distribuição de Despesas
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value.toFixed(2)} €`}
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="bg-white p-6 rounded-lg border shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              Despesas por Categoria
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expensesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Valor (€)" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lista de Despesas */}
          <div className="bg-white p-6 rounded-lg border shadow-sm md:col-span-2">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">
              Histórico de Despesas
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">Categoria</th>
                    <th className="text-left p-2">Descrição</th>
                    <th className="text-right p-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b">
                      <td className="p-2">
                        {expense.date 
                          ? new Date(expense.date).toLocaleDateString('pt-BR')
                          : new Date(expense.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2">{expense.category}</td>
                      <td className="p-2">{expense.description}</td>
                      <td className="p-2 text-right">
                        {expense.amount.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4 text-neutral-500">
                        Nenhuma despesa registrada
                      </td>
                    </tr>
                  )}
                </tbody>
                {expenses.length > 0 && (
                  <tfoot>
                    <tr className="border-t font-semibold">
                      <td colSpan={3} className="p-2 text-right">Total:</td>
                      <td className="p-2 text-right">
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
