'use client';

import { useEffect, useState } from 'react';
import { Card } from "@heroui/react";

interface MatchRecord {
  autonomous: {
    autoStart: number;
    coralCount: {
      l1: number;
      l2: number;
      l3: number;
      l4: number;
    };
  };
  teleop: {
    coralCount: {
      l1: number;
      l2: number;
      l3: number;
      l4: number;
    };
  };
  endAndAfterGame: {
    stopStatus: string;
  };
}

interface AverageStats {
  auto: {
    l1: number;
    l2: number;
    l3: number;
    l4: number;
    total: number;
  };
  teleop: {
    l1: number;
    l2: number;
    l3: number;
    l4: number;
    total: number;
  };
  autoStartPositions: { [key: string]: number };
  climbSuccess: {
    total: number;
    successful: number;
    percentage: number;
  };
}

export function TeamStats({ teamNumber, records }) {
  const [stats, setStats] = useState<AverageStats | null>(null);

  useEffect(() => {
    if (!records || !Array.isArray(records)) return;

    const totalMatches = records.length;
    if (totalMatches === 0) return;

    // Initialize stats
    const stats: AverageStats = {
      auto: { l1: 0, l2: 0, l3: 0, l4: 0, total: 0 },
      teleop: { l1: 0, l2: 0, l3: 0, l4: 0, total: 0 },
      autoStartPositions: {},
      climbSuccess: {
        total: totalMatches,
        successful: 0,
        percentage: 0
      }
    };

    // Calculate sums
    records.forEach(record => {
      // Auto coral counts
      ['l1', 'l2', 'l3', 'l4'].forEach(level => {
        const count = record.autonomous.coralCount[level] || 0;
        stats.auto[level] += count;
        stats.auto.total += count;
      });

      // Teleop coral counts
      ['l1', 'l2', 'l3', 'l4'].forEach(level => {
        const count = record.teleop.coralCount[level] || 0;
        stats.teleop[level] += count;
        stats.teleop.total += count;
      });

      // Auto start positions
      const startPos = record.autonomous.autoStart?record.autonomous.autoStart?.toString(): "not entered";
      stats.autoStartPositions[startPos] = (stats.autoStartPositions[startPos] || 0) + 1;

      // Climb success
      if (['DEEP', 'SHALLOW'].includes(record.endAndAfterGame.stopStatus)) {
        stats.climbSuccess.successful++;
      }
    });

    // Calculate averages
    ['l1', 'l2', 'l3', 'l4', 'total'].forEach(key => {
      stats.auto[key] = Number((stats.auto[key] / totalMatches).toFixed(2));
      stats.teleop[key] = Number((stats.teleop[key] / totalMatches).toFixed(2));
    });

    // Calculate climb success percentage
    stats.climbSuccess.percentage = Number(((stats.climbSuccess.successful / totalMatches) * 100).toFixed(1));

    setStats(stats);
  }, [records]);

  if (!teamNumber || !stats) return null;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Team {teamNumber} Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Autonomous Averages */}
        <div className="bg-default-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Auto Averages (per match)</h3>
          <div className="space-y-2">
            {Object.entries(stats.auto)
              .filter(([key]) => key !== 'total')
              .map(([level, avg]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="text-gray-600">Level {level.toUpperCase()}</span>
                  <span className="font-medium">{avg}</span>
                </div>
              ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{stats.auto.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teleop Averages */}
        <div className="bg-default-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Teleop Averages (per match)</h3>
          <div className="space-y-2">
            {Object.entries(stats.teleop)
              .filter(([key]) => key !== 'total')
              .map(([level, avg]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="text-gray-600">Level {level.toUpperCase()}</span>
                  <span className="font-medium">{avg}</span>
                </div>
              ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total</span>
                <span>{stats.teleop.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auto Start Positions */}
        <div className="bg-default-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Start Positions</h3>
          <div className="space-y-2">
            {Object.entries(stats.autoStartPositions)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([pos, count]) => (
                <div key={pos} className="flex justify-between items-center">
                  <span className="text-gray-600">Position {pos}</span>
                  <span className="font-medium">{count} time{count !== 1 ? 's' : ''}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Climb Success Rate */}
        <div className="bg-default-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Climb Success</h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">
              {stats.climbSuccess.percentage}%
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {stats.climbSuccess.successful} successful out of {stats.climbSuccess.total} matches
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
} 