'use client';

import { useState, useEffect } from 'react';
import { Card, Tab, Tabs } from "@heroui/react";
import { TeamSelector } from './components/TeamSelector';
import { TeamStats } from './components/TeamStats';
import { PitScoutingView } from './components/PitScoutingView';
import { MatchTypeFilter } from './components/MatchTypeFilter';
import { MatchRecordList } from './components/MatchRecordList';
import { TeamPerformanceChart } from './components/TeamPerformanceChart';
import { TeamComparisonChart } from './components/TeamComparisonChart';

export default function DashboardPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedMatchType, setSelectedMatchType] = useState<string | null>(null);
  const [matchRecords, setMatchRecords] = useState([]);

  // Separate fetch function for reusability
  const fetchMatchRecords = async () => {
    try {
      const url = selectedTeam 
        ? `${process.env.NEXT_PUBLIC_API_URL}/scouting/${selectedTeam}/matches${selectedMatchType ? `?type=${selectedMatchType}` : ''}`
        : `${process.env.NEXT_PUBLIC_API_URL}/scouting/teams${selectedMatchType ? `?type=${selectedMatchType}` : ''}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched records:", data);
      setMatchRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching match records:', err);
      setMatchRecords([]);
    }
  };

  // Effect for initial load and when filters change
  useEffect(() => {
    fetchMatchRecords();
  }, [selectedTeam, selectedMatchType]);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Filters Section */}
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
              <div className="flex flex-col gap-6 mt-4">
                {/* Performance Charts */}
                {selectedTeam ? (
                  <>
                    <TeamStats teamNumber={selectedTeam} records={matchRecords} />
                    <Card className="p-6">
                      <TeamPerformanceChart records={matchRecords} />
                    </Card>
                  </>
                ) : (
                  <Card className="p-6">
                    <TeamComparisonChart records={matchRecords} />
                  </Card>
                )}
                
                {/* Match Records List */}
                <MatchRecordList 
                  teamNumber={selectedTeam}
                  matchType={selectedMatchType}
                />
              </div>
            </Tab>
            <Tab key="pit" title="Pit Scouting">
              <PitScoutingView teamNumber={selectedTeam} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </main>
  );
} 