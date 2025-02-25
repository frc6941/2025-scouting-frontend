'use client';

import { useState, useEffect } from 'react';
import { Card, Tab, Tabs } from "@heroui/react";
import { TeamSelector } from './components/TeamSelector';
import { TeamStats } from './components/TeamStats';
import { PitScoutingView } from './components/PitScoutingView';
import { MatchTypeFilter } from './components/MatchTypeFilter';
import { MatchRecordList } from './components/MatchRecordList';
import { TeamPerformanceChart } from './components/TeamPerformanceChart';

export default function DashboardPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedMatchType, setSelectedMatchType] = useState<string | null>(null);
  const [matchRecords, setMatchRecords] = useState([]);

  // Add effect to fetch match records when team changes
  useEffect(() => {
    if (!selectedTeam) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/${selectedTeam}/matches`)
      .then(res => res.json())
      .then(data => setMatchRecords(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching match records:', err));
  }, [selectedTeam]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Filters Section */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TeamSelector 
              selectedTeam={selectedTeam} 
              onTeamSelect={setSelectedTeam} 
            />
            <MatchTypeFilter 
              selectedType={selectedMatchType}
              onTypeSelect={setSelectedMatchType}
            />
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs>
          <Tab key="matches" title="Match Records">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Performance Charts */}
              <div className="space-y-6">
                <TeamStats teamNumber={selectedTeam} records={matchRecords} />
                <Card className="p-6">
                  <TeamPerformanceChart records={matchRecords} />
                </Card>
              </div>
              
              {/* Match Records List */}
              <div>
                <MatchRecordList 
                  teamNumber={selectedTeam}
                  matchType={selectedMatchType}
                />
              </div>
            </div>
          </Tab>
          <Tab key="pit" title="Pit Scouting">
            <PitScoutingView teamNumber={selectedTeam} />
          </Tab>
        </Tabs>
      </div>
    </main>
  );
} 