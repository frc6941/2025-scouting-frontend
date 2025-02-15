'use client';

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button, Card } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectItem } from "@heroui/react";

export default function Step1() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const validateForm = (formData: any) => {
    const errors = [];

    // Match Type Validation
    const validMatchTypes = ["Qualification", "Practice", "Match", "Final"];
    if (!validMatchTypes.includes(formData.matchType)) {
      errors.push("Match type must be Qualification, Practice, Match, or Final");
    }

    // Match Number Validation
    if (!Number.isInteger(Number(formData.matchNumber))) {
      errors.push("Match number must be a whole number");
    }
    if (Number(formData.matchNumber) < 0) {
      errors.push("Match number cannot be negative");
    }

    // Alliance Validation
    const validAlliances = ["Red", "Blue"];
    if (!validAlliances.includes(formData.alliance)) {
      errors.push("Alliance must be either Red or Blue");
    }

    // Team Number Validation
    if (!Number.isInteger(Number(formData.team))) {
      errors.push("Team number must be a whole number");
    }
    if (Number(formData.team) < 1) {
      errors.push("Team number must be greater than 0");
    }

    // Required Objects Validation
    if (!formData.autonomous) {
      errors.push("Autonomous data is required");
    }
    if (!formData.teleop) {
      errors.push("Teleop data is required");
    }
    if (!formData.endAndAfterGame) {
      errors.push("End game data is required");
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
      return;
    }

    router.push("/scouting/step2");
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: field === 'matchNumber' || field === 'team' 
        ? Number(value) 
        : value.currentKey || value,
    });
  };

  return (
    <main className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-google-sans font-extrabold mb-3">
          Match Information
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"/>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Section */}
        <section className="space-y-8 h-full">
          <Card className="p-8 h-full backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-1 border-black dark:border-white">
            <div className="space-y-8">
              <div>
                <label className="text-xl text-default-600 block font-google-sans font-extrabold pb-2">
                  Match Type
                </label>
                <Select
                  label="Match Type"
                  selectedKeys={new Set([formData.matchType])}
                  onSelectionChange={(keys) => handleInputChange('matchType', keys)}
                  required
                >
                  <SelectItem key="QUAL">Qualification</SelectItem>
                  <SelectItem key="PRAC">Practice</SelectItem>
                  <SelectItem key="MATCH">Match</SelectItem>
                  <SelectItem key="FIANL">Final</SelectItem>
                </Select>
              </div>

              <div>
                <label className="text-xl text-default-600 block font-google-sans font-extrabold">
                  Scouter Initials
                </label>
                <Input
                  size="lg"
                  className="w-full backdrop-blur-sm text-lg "
                  label="Enter your initials"
                  variant="underlined"
                  description="Enter Scouter Name"
                  value={formData.scouter}
                  onChange={(e) => setFormData({
                    ...formData,
                    scouter: e.target.value,
                  })}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Right Section */}
        <section className="space-y-8 h-full">
          <Card className="h-full p-8 backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-1 border-black dark:border-white">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xl text-default-600 block  font-google-sans font-extrabold pb-2">
                    Match Number
                  </label>
                  <Input
                    type="number"
                    label="Match Number"
                    placeholder="Enter match number"
                    value={formData.matchNumber || ''}
                    onChange={(e) => handleInputChange('matchNumber', e.target.value)}
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="text-xl text-default-600 block  font-google-sans font-extrabold pb-2">
                    Team Number
                  </label>
                  <Input
                    type="number"
                    label="Team Number"
                    placeholder="Enter team number"
                    value={formData.team || ''}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    min={1}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <button
                  type="button"
                  className={`
                    flex-1 px-8 py-8 rounded-lg font-google-sans text-2xl font-semibold
                    transition-all duration-300 transform hover:scale-105
                    ${formData.alliance === 'Red'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'border-3 border-red-500 text-white bg-transparent hover:bg-red-500 hover:text-white'}
                  `}
                  onClick={() => setFormData({...formData, alliance: 'Red'})}
                >
                  Red Alliance
                </button>
                <button
                  type="button"
                  className={`
                    flex-1 px-8 py-8 rounded-lg font-google-sans text-2xl font-semibold
                    transition-all duration-300 transform hover:scale-105
                    ${formData.alliance === 'Blue'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'border-3 border-blue-500  bg-transparent hover:bg-blue-500 hover:text-white'}
                  `}
                  onClick={() => setFormData({...formData, alliance: 'Blue'})}
                >
                  Blue Alliance
                </button>
              </div>
            </div>
          </Card>
        </section>
      </div>

      <div className="flex justify-between mt-16 px-6">
        <Button
          variant="flat"
          size="lg"
          className="font-google-sans px-12 py-6 text-xl"
          onPress={handleGoBack}>
          Back
        </Button>
        <Button
          color="primary"
          size="lg"
          className="font-google-sans px-12 py-6 text-xl"
          onPress={handleNext}>
          Next
        </Button>
      </div>
    </main>
  );
}