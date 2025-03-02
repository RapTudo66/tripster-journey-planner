
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import Expenses from './pages/Expenses';
import NewTrip from './pages/NewTrip';
import TripDetails from './pages/TripDetails';
import PointOfInterestDetail from './pages/PointOfInterestDetail';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/trips/:id" element={<TripDetails />} />
              <Route path="/trips/:id/poi/:poiId" element={<PointOfInterestDetail />} />
              <Route path="/newtrip" element={<NewTrip />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
