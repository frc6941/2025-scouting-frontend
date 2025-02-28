'use client';

import { useEffect, useState } from 'react';
import { Card } from "@heroui/react";
import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

interface MatchRecord {
  autonomous: {
    autoStart: number;
    coralCount: {
      l1: number;
      l2: number;
      l3: number;
      l4: number;
    };
    algaeCount: {
      netShot: number;
      processor: number;
    };
  };
  teleop: {
    coralCount: {
      l1: number;
      l2: number;
      l3: number;
      l4: number;
    };
    algaeCount: {
      netShot: number;
      processor: number;
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
    dropOrMiss: number;
    netShot: number;
    processor: number;
    total: number;
  };
  teleop: {
    l1: number;
    l2: number;
    l3: number;
    l4: number;
    dropOrMiss: number;
    netShot: number;
    processor: number;
    total: number;
  };
  autoStartPositions: { [key: string]: number };
  climbSuccess: {
    total: number;
    deepSuccessful: number;
    shallowSuccessful: number;
    deepPercentage: number;
    shallowPercentage: number;
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
      auto: { 
        l1: 0, l2: 0, l3: 0, l4: 0, 
        dropOrMiss: 0, 
        netShot: 0, processor: 0,
        total: 0 
      },
      teleop: { 
        l1: 0, l2: 0, l3: 0, l4: 0, 
        dropOrMiss: 0,
        netShot: 0, processor: 0, 
        total: 0 
      },
      autoStartPositions: {},
      climbSuccess: {
        total: totalMatches,
        deepSuccessful: 0,
        shallowSuccessful: 0,
        deepPercentage: 0,
        shallowPercentage: 0
      }
    };

    // Calculate sums
    records.forEach(record => {
      // Add coral counts for auto
      ['l1', 'l2', 'l3', 'l4', 'dropOrMiss'].forEach(level => {
        stats.auto[level] += record.autonomous.coralCount[level] || 0;
      });

      // Add algae counts for auto
      ['netShot', 'processor'].forEach(type => {
        stats.auto[type] += record.autonomous.algaeCount[type] || 0;
      });

      // Add coral counts for teleop
      ['l1', 'l2', 'l3', 'l4', 'dropOrMiss'].forEach(level => {
        stats.teleop[level] += record.teleop.coralCount[level] || 0;
      });

      // Add algae counts for teleop
      ['netShot', 'processor'].forEach(type => {
        stats.teleop[type] += record.teleop.algaeCount[type] || 0;
      });

      // Calculate total scores
      const autoScore = calculateScore(record.autonomous, true);
      const teleopScore = calculateScore(record.teleop, false);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame.stopStatus);

      stats.auto.total += autoScore;
      stats.teleop.total += teleopScore + endGameScore;

      // Auto start positions
      const startPos = record.autonomous.autoStart?.toString() || "not entered";
      stats.autoStartPositions[startPos] = (stats.autoStartPositions[startPos] || 0) + 1;

      // Climb success
      if (record.endAndAfterGame.stopStatus === "Deep Climb") {
        stats.climbSuccess.deepSuccessful++;
      } else if (record.endAndAfterGame.stopStatus === "Shallow Climb") {
        stats.climbSuccess.shallowSuccessful++;
      }
    });

    // Calculate averages for all stats
    ['l1', 'l2', 'l3', 'l4', 'dropOrMiss', 'netShot', 'processor'].forEach(key => {
      stats.auto[key] = Number((stats.auto[key] / totalMatches).toFixed(1));
      stats.teleop[key] = Number((stats.teleop[key] / totalMatches).toFixed(1));
    });

    // Calculate total score averages
    stats.auto.total = Number((stats.auto.total / totalMatches).toFixed(1));
    stats.teleop.total = Number((stats.teleop.total / totalMatches).toFixed(1));

    // Calculate climb success percentages
    stats.climbSuccess.deepPercentage = Number(((stats.climbSuccess.deepSuccessful / totalMatches) * 100).toFixed(1));
    stats.climbSuccess.shallowPercentage = Number(((stats.climbSuccess.shallowSuccessful / totalMatches) * 100).toFixed(1));

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
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium mb-3">Coral</h4>
              <div className="space-y-2">
                {['l1', 'l2', 'l3', 'l4'].map((level) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="text-gray-600">Level {level.toUpperCase()}</span>
                    <span className="font-medium">{stats.auto[level].toFixed(1)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Drop/Miss</span>
                  <span className="font-medium">{stats.auto.dropOrMiss?.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h4 className="text-sm font-medium mb-3">Algae</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Net Shot</span>
                  <span className="font-medium">{stats.auto.netShot.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processor</span>
                  <span className="font-medium">{stats.auto.processor.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Score</span>
                <span>{stats.auto.total.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teleop Averages */}
        <div className="bg-default-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Teleop Averages (per match)</h3>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium mb-3">Coral</h4>
              <div className="space-y-2">
                {['l1', 'l2', 'l3', 'l4'].map((level) => (
                  <div key={level} className="flex justify-between items-center">
                    <span className="text-gray-600">Level {level.toUpperCase()}</span>
                    <span className="font-medium">{stats.teleop[level].toFixed(1)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Drop/Miss</span>
                  <span className="font-medium">{stats.teleop.dropOrMiss.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h4 className="text-sm font-medium mb-3">Algae</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Net Shot</span>
                  <span className="font-medium">{stats.teleop.netShot.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processor</span>
                  <span className="font-medium">{stats.teleop.processor.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Score</span>
                <span>{stats.teleop.total.toFixed(1)}</span>
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

        {/* Climb Success */}
        <div className="bg-default-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Climb Success</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {stats.climbSuccess.deepPercentage}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Deep Climb</p>
              <p className="text-xs text-gray-500">
                {stats.climbSuccess.deepSuccessful} of {stats.climbSuccess.total}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {stats.climbSuccess.shallowPercentage}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Shallow Climb</p>
              <p className="text-xs text-gray-500">
                {stats.climbSuccess.shallowSuccessful} of {stats.climbSuccess.total}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 