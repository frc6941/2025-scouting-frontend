'use client';

import { useState, useMemo } from 'react';
import { Card } from "@heroui/react";
import { Select, SelectItem } from "@nextui-org/react";
import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

interface MatchRecord {
  team: number;
  autonomous: {
    coralCount: {
      l4: number;
      l3: number;
      l2: number;
      l1: number;
      dropOrMiss: number;
    };
    algaeCount: {
      netShot: number;
      processor: number;
      dropOrMiss: number;
    };
  };
  teleop: {
    coralCount: {
      l4: number;
      l3: number;
      l2: number;
      l1: number;
      dropOrMiss: number;
    };
    algaeCount: {
      netShot: number;
      processor: number;
      dropOrMiss: number;
    };
  };
  endAndAfterGame: {
    stopStatus: string;
  };
}

interface TeamStats {
  teamNumber: number;
  avgAutoScore: number;
  avgTeleopScore: number;
  avgTotalScore: number;
  deepClimbRate: number;
  shallowClimbRate: number;
  matches: number;
}

const sortOptions = [
  { value: 'totalScore', label: 'Total Score' },
  { value: 'autoScore', label: 'Auto Score' },
  { value: 'teleopScore', label: 'Teleop Score' },
  { value: 'deepClimb', label: 'Deep Climb Success' },
  { value: 'shallowClimb', label: 'Shallow Climb Success' },
];

export function TeamRankings({ matchRecords }: { matchRecords: MatchRecord[] }) {
  const [sortBy, setSortBy] = useState('totalScore');

  const teamStats = useMemo(() => {
    const stats = new Map<number, {
      matches: number;
      autoTotal: number;
      teleopTotal: number;
      endGameTotal: number;
      deepClimbs: number;
      shallowClimbs: number;
    }>();

    matchRecords.forEach(record => {
      const team = record.team;
      if (!team) return;

      // Calculate scores exactly like TeamPerformanceChart
      const autoScore = calculateScore(record.autonomous, true);
      const teleopScore = calculateScore(record.teleop, false);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame.stopStatus);

      if (!stats.has(team)) {
        stats.set(team, {
          matches: 0,
          autoTotal: 0,
          teleopTotal: 0,
          endGameTotal: 0,
          deepClimbs: 0,
          shallowClimbs: 0
        });
      }

      const teamStats = stats.get(team)!;
      teamStats.matches++;
      teamStats.autoTotal += autoScore;
      teamStats.teleopTotal += teleopScore;
      teamStats.endGameTotal += endGameScore;

      // Track climb success
      if (record.endAndAfterGame.stopStatus === 'Deep Climb') {
        teamStats.deepClimbs++;
      } else if (record.endAndAfterGame.stopStatus === 'Shallow Climb') {
        teamStats.shallowClimbs++;
      }
    });

    return Array.from(stats.entries()).map(([teamNumber, data]): TeamStats => ({
      teamNumber,
      avgAutoScore: data.autoTotal / data.matches,
      avgTeleopScore: (data.teleopTotal + data.endGameTotal) / data.matches, // Include endgame in teleop
      avgTotalScore: (data.autoTotal + data.teleopTotal + data.endGameTotal) / data.matches,
      deepClimbRate: (data.deepClimbs / data.matches) * 100,
      shallowClimbRate: (data.shallowClimbs / data.matches) * 100,
      matches: data.matches
    }));
  }, [matchRecords]);

  // Sort teams based on selected criteria
  const sortedTeams = useMemo(() => {
    return [...teamStats].sort((a, b) => {
      switch (sortBy) {
        case 'autoScore':
          return b.avgAutoScore - a.avgAutoScore;
        case 'teleopScore':
          return b.avgTeleopScore - a.avgTeleopScore;
        case 'deepClimb':
          return b.deepClimbRate - a.deepClimbRate;
        case 'shallowClimb':
          return b.shallowClimbRate - a.shallowClimbRate;
        default:
          return b.avgTotalScore - a.avgTotalScore;
      }
    });
  }, [teamStats, sortBy]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Rankings</h2>
        <Select
          label="Sort by"
          selectedKeys={[sortBy]}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-48"
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Rank</th>
              <th className="text-left py-3 px-4">Team</th>
              <th className="text-right py-3 px-4">Matches</th>
              <th className="text-right py-3 px-4">Avg Auto</th>
              <th className="text-right py-3 px-4">Avg Teleop</th>
              <th className="text-right py-3 px-4">Avg Total</th>
              <th className="text-right py-3 px-4">Deep %</th>
              <th className="text-right py-3 px-4">Shallow %</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr 
                key={team.teamNumber}
                className="border-b last:border-b-0 hover:bg-default-100 transition-colors"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{team.teamNumber}</td>
                <td className="text-right py-3 px-4">{team.matches}</td>
                <td className="text-right py-3 px-4">{team.avgAutoScore.toFixed(1)}</td>
                <td className="text-right py-3 px-4">{team.avgTeleopScore.toFixed(1)}</td>
                <td className="text-right py-3 px-4">{team.avgTotalScore.toFixed(1)}</td>
                <td className="text-right py-3 px-4">{team.deepClimbRate.toFixed(1)}%</td>
                <td className="text-right py-3 px-4">{team.shallowClimbRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 