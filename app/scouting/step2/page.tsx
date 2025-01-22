// app/form/step2/page.js
"use client";

import { useForm } from "@/app/scouting/contexts/FormContent";
import { useRouter } from "next/navigation";

export default function Step2() {
  // @ts-ignore
  const { formData, setFormData } = useForm();
  const router = useRouter();

  const handleNext = () => {
    router.push("/scouting/step3");
  };

  function handleGoBack(){
    router.push("/scouting/step1");
  }

  return (
    <div>
      <h1>Step 2: Contact Information</h1>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button onClick={handleNext}>Next</button>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}
