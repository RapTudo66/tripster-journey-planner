
import { Map, Wallet, BarChart3, Calendar } from "lucide-react";

export const FeaturesGrid = () => {
  const features = [
    {
      icon: Map,
      title: "Interactive Maps",
      description: "Visualize your journey with interactive maps and route planning.",
    },
    {
      icon: Wallet,
      title: "Expense Tracking",
      description: "Keep track of your travel expenses and stay within budget.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Get insights about your travel patterns and spending habits.",
    },
    {
      icon: Calendar,
      title: "Trip Planning",
      description: "Create detailed itineraries and organize your activities.",
    },
  ];

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-800 mb-4">
            Everything You Need for Perfect Travel Planning
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our comprehensive suite of tools helps you plan, track, and enjoy your
            travels to the fullest.
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
