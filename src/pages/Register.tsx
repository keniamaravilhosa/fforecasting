import { useState } from "react";
import Header from "@/components/Header";
import UserTypeSelection from "@/components/UserTypeSelection";
import BrandRegistration from "@/components/BrandRegistration";
import StylistRegistration from "@/components/StylistRegistration";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const [selectedType, setSelectedType] = useState<'stylist' | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

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

  if (!user) {
    return null; // Will redirect in useEffect
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