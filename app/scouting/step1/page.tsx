'use client';

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button, Card } from "@heroui/react";
import { toast } from "@/hooks/use-toast";
import { Select, SelectItem } from "@heroui/react";

export enum MatchType {
  QUAL = 'Qualification',
  PRAC = 'Practice',
  MATCH = 'Match',
  FINAL = 'Final',
}

export enum Alliance {
  RED = 'Red',
  BLUE = 'Blue',
}

export default function Step1() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {


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
    <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl min-h-screen">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-google-sans font-extrabold mb-3">
          Match Information
        </h1>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"/>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <section className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
          <Card className="p-4 sm:p-8 backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-1 border-black dark:border-white">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <label className="text-lg sm:text-xl text-default-600 block font-google-sans font-extrabold pb-2">
                  Match Type
                </label>
                <Select
                  label="Match Type"
                  selectedKeys={new Set([formData.matchType])}
                  onSelectionChange={(keys) => handleInputChange('matchType', keys)}
                  isRequired
                >
                  <SelectItem key={MatchType.QUAL}>{MatchType.QUAL}</SelectItem>
                  <SelectItem key={MatchType.PRAC}>{MatchType.PRAC}</SelectItem>
                  <SelectItem key={MatchType.MATCH}>{MatchType.MATCH}</SelectItem>
                  <SelectItem key={MatchType.FINAL}>{MatchType.FINAL}</SelectItem>
                </Select>
              </div>

              <div>
                <label className="text-lg sm:text-xl text-default-600 block font-google-sans font-extrabold">
                  Scouter Initials
                </label>
                <Input
                  size="lg"
                  className="w-full backdrop-blur-sm text-base sm:text-lg"
                  label="Enter your initials"
                  variant="underlined"
                  description="Enter Scouter Name"
                  value={formData.scouter}
                  onChange={(e) => setFormData({
                    ...formData,
                    scouter: e.target.value,
                  })}
                  isRequired
                />
              </div>
            </div>
          </Card>
        </section>

        <section className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
          <Card className="h-full p-4 sm:p-8 backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-1 border-black dark:border-white">
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div>
                  <label className="text-lg sm:text-xl text-default-600 block font-google-sans font-extrabold pb-2">
                    Match Number
                  </label>
                  <Input
                    type="number"
                    label="Match Number"
                    placeholder="Enter match number"
                    value={formData.matchNumber || ''}
                    onChange={(e) => handleInputChange('matchNumber', e.target.value)}
                    min={0}
                    isRequired
                  />
                </div>
                <div>
                  <label className="text-lg sm:text-xl text-default-600 block font-google-sans font-extrabold pb-2">
                    Team Number
                  </label>
                  <Input
                    type="number"
                    label="Team Number"
                    placeholder="Enter team number"
                    value={formData.team || ''}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    min={1}
                    isRequired
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  type="button"
                  className={`
                    flex-1 px-6 sm:px-8 py-6 sm:py-8 rounded-lg 
                    font-google-sans text-xl sm:text-2xl font-semibold
                    transition-all duration-300 transform hover:scale-105
                    ${formData.alliance === 'Red'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'border-3 border-red-500  bg-transparent hover:bg-red-500 hover:text-white'}
                  `}
                  onClick={() => setFormData({...formData, alliance: 'Red'})}
                >
                  Red Alliance
                </button>
                <button
                  type="button"
                  className={`
                    flex-1 px-6 sm:px-8 py-6 sm:py-8 rounded-lg 
                    font-google-sans text-xl sm:text-2xl font-semibold
                    transition-all duration-300 transform hover:scale-105
                    ${formData.alliance === 'Blue'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'border-3 border-blue-500 bg-transparent hover:bg-blue-500 hover:text-white'}
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

      <div className="flex justify-between mt-8 sm:mt-16 px-2 sm:px-6">
        <Button
          variant="flat"
          size="lg"
          className="font-google-sans px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl"
          onPress={handleGoBack}
        >
          Back
        </Button>
        <Button
          color="primary"
          size="lg"
          className="font-google-sans px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl"
          onPress={handleNext}
        >
          Next
        </Button>
      </div>
    </main>
  );
}