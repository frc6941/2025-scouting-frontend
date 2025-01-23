'use client'

import { FormProvider } from "@/app/scouting/contexts/FormContent";
import {Tabs, Tab} from "@heroui/tabs";
import {usePathname, useRouter} from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  console.log(pathname)


  return (
      <main className="pl-16 pt-4 w-full"  suppressHydrationWarning>
        <div className="hidden md:block pt-1 pl-6">
          <Tabs
            selectedKey={pathname}
            variant="bordered"
            onSelectionChange={(key) => router.push(key.toString())}
          >
            <Tab
              key="/scouting/step1"
              title="Basic Info"
              value="/scouting/step1"
            />
            <Tab
              key="/scouting/step2"
              title="Starting Point"
              value="/scouting/step2"
            />
            <Tab
              key="/scouting/step3"
              title="Autonomous"
              value="/scouting/step3"
            />
            <Tab
              key="/scouting/step4"
              title="Teleop"
              value="/scouting/step4"
            />
            <Tab
              key="/scouting/step5"
              title="End"
              value="/scouting/step5"
            />
          </Tabs>
        </div>
        <FormProvider>{children}</FormProvider>
      </main>
  );
}
