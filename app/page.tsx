'use client'

import Image from "next/image";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import {ThemeSwitcher} from "@/components/ThemeSwitcher";
import { useState } from "react";
import { TeamRankings } from "@/app/dashboard/components/TeamRankings";
export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedMatchType, setSelectedMatchType] = useState<string | null>(null);
  const [matchRecords, setMatchRecords] = useState([]);

  // Add effect to fetch match records when team changes
  useEffect(() => {
    if (!selectedTeam) {
      console.log("fetching all records");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/teams`)
        .then(res => res.json())
        .then(data => {
          console.log("all records", data);
          setMatchRecords(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error('Error fetching match records:', err));
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/${selectedTeam}/matches`)
        .then(res => res.json())
        .then(data => setMatchRecords(Array.isArray(data) ? data : []))
        .catch(err => console.error('Error fetching match records:', err));
    }
  }, [selectedTeam]);
  return (
    <div className="flex flex-col justify-between p-6" suppressHydrationWarning>
      <TeamRankings matchRecords={matchRecords} />
    </div>
  );
}
