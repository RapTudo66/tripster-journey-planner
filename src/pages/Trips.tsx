
import { Navigation } from "@/components/Navigation";

const Trips = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">My Trips</h1>
        {/* Trips list will be implemented later */}
      </div>
    </div>
  );
};

export default Trips;
