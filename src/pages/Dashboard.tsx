import { useState } from "react";
import Header from "@/components/Header";
import BrandDashboard from "@/components/BrandDashboard";
import StylistDashboard from "@/components/StylistDashboard";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Mock user type - in a real app this would come from authentication
  const [userType] = useState<'brand' | 'stylist'>('brand');
  const [hasPremiumAccess] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {userType === 'brand' ? (
          <BrandDashboard />
        ) : (
          <StylistDashboard hasPremiumAccess={hasPremiumAccess} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;