import { useState } from "react";
import Header from "@/components/Header";
import UserTypeSelection from "@/components/UserTypeSelection";
import BrandRegistration from "@/components/BrandRegistration";
import StylistRegistration from "@/components/StylistRegistration";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const [selectedType, setSelectedType] = useState<'stylist' | 'brand' | null>(null);
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  // Redirect based on auth and profile status
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (!profileLoading && profile) {
      // User is logged in and has profile, redirect to dashboard
      navigate("/dashboard");
    }
  }, [user, profile, profileLoading, navigate]);

  const handleSelectType = (type: 'stylist' | 'brand') => {
    setSelectedType(type);
  };

  const renderContent = () => {
    if (!selectedType) {
      return <UserTypeSelection onSelectType={handleSelectType} />;
    }

    if (selectedType === 'stylist') {
      return <StylistRegistration onBack={() => setSelectedType(null)} />;
    }

    if (selectedType === 'brand') {
      return <BrandRegistration onBack={() => setSelectedType(null)} />;
    }

    return null;
  };

  if (!user || profileLoading) {
    return null; // Will redirect in useEffect or show loading
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  );
};

export default Register;
