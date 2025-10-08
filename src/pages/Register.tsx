// src/pages/Register.tsx
import { useState } from "react";
import Header from "@/components/Header";
import UserTypeSelection from "@/components/UserTypeSelection";
import StylistRegistration from "@/components/StylistRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const [selectedType, setSelectedType] = useState<'stylist' | null>(null);
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
  }, [user, profile, profileLoading]); // Removed navigate from deps

  const handleSelectType = (type: 'stylist') => {
    setSelectedType(type);
  };

  const renderContent = () => {
    if (!selectedType) {
      return <UserTypeSelection onSelectType={handleSelectType} />;
    }

    if (selectedType === 'stylist') {
      return <StylistRegistration onBack={() => setSelectedType(null)} />;
    }

    return null;
  };

  if (!user || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-primary">Carregando...</p>
          <p className="text-sm text-muted-foreground mt-2">Verificando seu perfil</p>
        </div>
      </div>
    );
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
