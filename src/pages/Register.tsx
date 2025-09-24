import { useState } from "react";
import Header from "@/components/Header";
import UserTypeSelection from "@/components/UserTypeSelection";
import BrandRegistration from "@/components/BrandRegistration";
import StylistRegistration from "@/components/StylistRegistration";

const Register = () => {
  const [selectedType, setSelectedType] = useState<'brand' | 'stylist' | null>(null);

  const handleSelectType = (type: 'brand' | 'stylist') => {
    setSelectedType(type);
  };

  const renderContent = () => {
    if (!selectedType) {
      return <UserTypeSelection onSelectType={handleSelectType} />;
    }

    if (selectedType === 'brand') {
      return <BrandRegistration onBack={() => setSelectedType(null)} />;
    }

    if (selectedType === 'stylist') {
      return <StylistRegistration onBack={() => setSelectedType(null)} />;
    }

    return null;
  };

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