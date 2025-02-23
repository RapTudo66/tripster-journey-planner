
import { Navigation } from "@/components/Navigation";
import { useParams } from "react-router-dom";

const TripDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">Trip Details</h1>
        {/* Trip details content will be implemented later */}
      </div>
    </div>
  );
};

export default TripDetails;
