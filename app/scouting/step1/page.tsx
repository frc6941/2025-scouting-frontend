"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";
import {Input} from "@heroui/input";
import {Button} from "@heroui/react";

export default function Step1() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push("/scouting/step2");
  };

  function handleGoBack(){
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full pb-16">
      <div className="w-full h-full max-w-6xl flex flex-col gap-8">
        <h1 className="text-5xl font-bold text-center mb-6 ">Match Information</h1>

        <div className="grid grid-cols-2 gap-8 flex-grow w-full">
          {/* Left Section */}
          <div className="flex flex-col gap-8">
            {/* Match Number */}
            <div>
              <label
                className="block text-xl font-semibold mb-2 "
                htmlFor="matchNumber"
              >
                Match Number
              </label>
              <Input
                size="lg"
                label="Match Number"
                className="focus:ring  focus:outline-none"
                value={formData.matchType}
                onChange={(e)=>{setFormData({...formData, matchType: e.target.value})}}/>
            </div>

            {/* Scouter Initials */}
            <div>
              <label
                className="block text-xl font-semibold mb-2 "
                htmlFor="initials"
              >
                Scouter Initials
              </label>
              <Input
                size="lg"
                label="Scouter Name"
                className="focus:ring  focus:outline-none"
                value={formData.scouter}
                onChange={(e)=>{setFormData({...formData, scouter: e.target.value})}}/>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-8 w-full">
            {/* Select Team */}
            <div>
              <label className="block text-xl font-semibold mb-2 ">Select Team</label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  size="lg"
                  label="team"
                  className="focus:ring  focus:outline-none w-full"
                 value={formData.team}
                 onChange={(e)=>{setFormData({...formData, team: e.target.value})}}/>
              </div>
            </div>

            {/* Select Alliance */}
            <div>
              <label className="block text-xl font-medium mb-2 ">
                Select Alliance
              </label>
              <div className="flex gap-8">
                <button
                  className={`flex-1 px-4 py-4 rounded-md text-xl border ${
                    formData.alliance === "red"
                      ? "bg-red-500 "
                      : " "
                  }`}
                  onClick={() => setFormData({ ...formData, alliance: "red" })}
                >
                  Red
                </button>
                <button
                  className={`flex-1 px-4 py-4 rounded-md text-xl border ${
                    formData.alliance === "blue"
                      ? "bg-blue-500 "
                      : ""
                  }`}
                  onClick={() => setFormData({ ...formData, alliance: "blue" })}
                >
                  Blue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between mt-8">
          <Button  variant="bordered" className="px-8 py-8 text-2xl" onPressStart={handleGoBack}>
            Back
          </Button>
          <Button  variant="bordered" className="px-8 py-8 text-2xl"
           onPressStart={handleNext}>
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
