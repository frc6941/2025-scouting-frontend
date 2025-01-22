/**
 * @fileoverview Match Information form component - Step 1
 * Created: 2025-01-22 18:23:50 UTC
 * Author: eR3R3
 */

'use client';

import {useForm} from '@/app/scouting/contexts/FormContent';
import {useRouter} from 'next/navigation';
import {Input} from '@heroui/input';
import {Button} from '@heroui/react';

/**
 * Step1 component handles the first step of match scouting form.
 * @return {JSX.Element} The rendered form component
 */
export default function Step1() {
  // @ts-ignore
  const {formData, setFormData} = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push('/scouting/step2');
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-4 sm:p-6 md:p-8">
      <div className="w-full h-full max-w-6xl flex flex-col gap-4 sm:gap-6 md:gap-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6">
          Match Information
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 flex-grow w-full">
          {/* Left Section */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            {/* Match Type Input */}
            <div>
              <label className="block text-lg sm:text-xl font-semibold mb-2">
                Match Type
              </label>
              <Input
                size="lg"
                label="Match Number"
                className="focus:ring focus:outline-none w-full"
                value={formData.matchType}
                onChange={(e) => setFormData({
                  ...formData,
                  matchType: e.target.value,
                })}
              />
            </div>

            {/* Scouter Initials Input */}
            <div>
              <label
                className="block text-lg sm:text-xl font-semibold mb-2"
                htmlFor="initials"
              >
                Scouter Initials
              </label>
              <Input
                size="lg"
                label="Scouter Name"
                className="focus:ring focus:outline-none w-full"
                value={formData.scouter}
                onChange={(e) => setFormData({
                  ...formData,
                  scouter: e.target.value,
                })}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full">
            {/* Match Number and Team Number Inputs */}
            <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-5">
              <div className="w-full">
                <label className="block text-lg sm:text-xl font-semibold w-full mb-2">
                  Enter Match Number
                </label>
                <Input
                  size="lg"
                  label="Match Number"
                  className="focus:ring focus:outline-none w-full"
                  value={formData.matchNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    matchNumber: e.target.value,
                  })}
                />
              </div>
              <div className="w-full">
                <label className="block text-lg sm:text-xl font-semibold mb-2">
                  Enter Team Number
                </label>
                <Input
                  size="lg"
                  label="Team Number"
                  className="focus:ring focus:outline-none w-full"
                  value={formData.team}
                  onChange={(e) => setFormData({
                    ...formData,
                    team: e.target.value,
                  })}
                />
              </div>
            </div>

            {/* Alliance Selection */}
            <div>
              <label className="block text-lg sm:text-xl font-medium mb-2">
                Select Alliance
              </label>
              <div className="flex gap-4 sm:gap-8">
                <button
                  className={`
                    flex-1 px-2 sm:px-4 py-3 sm:py-4 rounded-md 
                    text-base sm:text-xl border transition-colors
                    ${formData.alliance === 'red'
                    ? 'bg-red-500 text-white'
                    : 'hover:bg-red-100'}
                  `}
                  onClick={() => setFormData({...formData, alliance: 'red'})}
                >
                  Red
                </button>
                <button
                  className={`
                    flex-1 px-2 sm:px-4 py-3 sm:py-4 rounded-md 
                    text-base sm:text-xl border transition-colors
                    ${formData.alliance === 'blue'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-100'}
                  `}
                  onClick={() => setFormData({...formData, alliance: 'blue'})}
                >
                  Blue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4 sm:mt-6 md:mt-8">
          <Button
            variant="bordered"
            className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8
                     text-lg sm:text-xl md:text-2xl"
            onPressStart={handleGoBack}
          >
            Back
          </Button>
          <Button
            variant="bordered"
            className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8
                     text-lg sm:text-xl md:text-2xl"
            onPressStart={handleNext}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}