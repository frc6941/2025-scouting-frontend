'use client'

import { FormProvider } from "@/app/scouting/contexts/FormContent";
import {Tabs, Tab} from "@heroui/tabs";
import {usePathname} from "next/navigation";

export default function RootLayout({ children }) {

  const pathname = usePathname();
  return (
      <main className="pl-16 pt-4" suppressHydrationWarning>
        <Tabs aria-label="Options" selectedKey={pathname}>
          <Tab key="basicInfo" title="basicInfo" href="/scouting/step1">
          </Tab>
          <Tab key="StartingPoint" title="StartingPoint" href="/scouting/step2">
          </Tab>
          <Tab key="Autonomous" title="Autonomous" href="/scouting/step3">
          </Tab>
          <Tab key="Teleop" title="Teleop" href="/scouting/step4">
          </Tab>
          <Tab key="End" title="End" href="/scouting/step5">
          </Tab>
        </Tabs>
        <FormProvider>{children}</FormProvider>
      </main>
  );
}
