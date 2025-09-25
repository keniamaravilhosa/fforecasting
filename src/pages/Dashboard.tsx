import Header from "@/components/Header";
import BrandDashboard from "@/components/BrandDashboard";
import StylistDashboard from "@/components/StylistDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProfile } from "@/hooks/useProfile";

const Dashboard = () => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireProfile={true}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {profile?.user_type === 'brand' ? (
            <BrandDashboard />
          ) : (
            <StylistDashboard hasPremiumAccess={false} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;