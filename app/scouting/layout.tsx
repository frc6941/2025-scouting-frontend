'use client'

import { FormProvider } from "@/app/scouting/contexts/FormContent";
import {Tabs, Tab} from "@heroui/tabs";
import {usePathname} from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname()
  console.log(pathname)


  return (
      <main className="pl-16 pt-4 w-full"  suppressHydrationWarning>
        <Tabs aria-label="Options" className="pt-1 pl-6" selectedKey={pathname} variant="bordered">
          <Tab key="/scouting/step1" title="basicInfo" href="/scouting/step1">
          </Tab>
          <Tab key="/scouting/step2" title="StartingPoint" href="/scouting/step2">
          </Tab>
          <Tab key="/scouting/step3" title="Autonomous" href="/scouting/step3">
          </Tab>
          <Tab key="/scouting/step4" title="Teleop" href="/scouting/step4">
          </Tab>
          <Tab key="/scouting/step5" title="End" href="/scouting/step5">
          </Tab>
        </Tabs>
        <FormProvider>{children}</FormProvider>
      </main>
  );
}
