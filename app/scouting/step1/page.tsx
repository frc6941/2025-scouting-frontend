'use client';

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button, Card } from "@heroui/react";

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

  return (
    <main className="container mx-auto px-6 py-12 max-w-7xl min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-google-sans font-extrabold mb-3">
          Match Information
        </h1>
        <div className="h-2 w-24 bg-primary mx-auto rounded-full"/>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Section */}
        <section className="space-y-8">
          <Card className="p-8 backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-2 border-black dark:border-white">
            <div className="space-y-8">
              <div>
                <label className="text-xl text-default-600 block mb-3 font-google-sans font-extrabold">
                  Match Type
                </label>
                <Input
                  size="lg"
                  className="w-full backdrop-blur-sm text-lg py-6"
                  placeholder="Enter match type"
                  value={formData.matchType}
                  onChange={(e) => setFormData({
                    ...formData,
                    matchType: e.target.value,
                  })}
                />
              </div>

              <div>
                <label className="text-xl text-default-600 block mb-3 font-google-sans font-extrabold">
                  Scouter Initials
                </label>
                <Input
                  size="lg"
                  className="w-full backdrop-blur-sm text-lg py-6"
                  placeholder="Enter your initials"
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
        <section className="space-y-8">
          <Card className="p-8 backdrop-blur-md hover:shadow-xl transition-shadow duration-300 border-2 border-black dark:border-white">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xl text-default-600 block mb-3 font-google-sans font-extrabold">
                    Match Number
                  </label>
                  <Input
                    size="lg"
                    className="w-full backdrop-blur-sm text-lg py-6"
                    placeholder="Enter match #"
                    value={formData.matchNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      matchNumber: e.target.value,
                    })}
                  />
                </div>
                <div>
                  <label className="text-xl text-default-600 block mb-3 font-google-sans font-extrabold">
                    Team Number
                  </label>
                  <Input
                    size="lg"
                    className="w-full backdrop-blur-sm text-lg py-6"
                    placeholder="Enter team #"
                    value={formData.team}
                    onChange={(e) => setFormData({
                      ...formData,
                      team: e.target.value,
                    })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xl text-default-600 block mb-3 font-google-sans font-extrabold">
                  Select Alliance
                </label>
                <div className="flex gap-6">
                  <button
                    className={`
                      flex-1 px-6 py-5 rounded-lg font-google-sans text-xl
                      transition-all duration-300 transform hover:scale-105
                      ${formData.alliance === 'red'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'hover:bg-red-100 border-2 border-red-500'}
                    `}
                    onClick={() => setFormData({...formData, alliance: 'red'})}
                  >
                    Red Alliance
                  </button>
                  <button
                    className={`
                      flex-1 px-6 py-5 rounded-lg font-google-sans text-xl
                      transition-all duration-300 transform hover:scale-105
                      ${formData.alliance === 'blue'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'hover:bg-blue-100 border-2 border-blue-500'}
                    `}
                    onClick={() => setFormData({...formData, alliance: 'blue'})}
                  >
                    Blue Alliance
                  </button>
                </div>
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