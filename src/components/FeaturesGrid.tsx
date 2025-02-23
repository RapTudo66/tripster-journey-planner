
import { Map, Wallet, BarChart3, Calendar } from "lucide-react";

export const FeaturesGrid = () => {
  const features = [
    {
      icon: Map,
      title: "Mapas Interativos",
      description: "Visualize sua jornada com mapas interativos e planejamento de rotas.",
    },
    {
      icon: Wallet,
      title: "Controle de Despesas",
      description: "Acompanhe seus gastos de viagem e mantenha-se dentro do orçamento.",
    },
    {
      icon: BarChart3,
      title: "Painel Analítico",
      description: "Obtenha insights sobre seus padrões de viagem e hábitos de gastos.",
    },
    {
      icon: Calendar,
      title: "Planejamento de Viagem",
      description: "Crie roteiros detalhados e organize suas atividades.",
    },
  ];

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Tudo que Você Precisa para um Planejamento Perfeito
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Nosso conjunto completo de ferramentas ajuda você a planejar, 
            acompanhar e aproveitar suas viagens ao máximo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-white border border-neutral-200 hover:border-primary transition-colors duration-200 group"
            >
              <feature.icon
                size={32}
                className="text-primary mb-4 group-hover:scale-110 transition-transform duration-200"
              />
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
