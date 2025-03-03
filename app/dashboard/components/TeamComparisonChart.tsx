'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

export function TeamComparisonChart({ records }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!records || !chartRef.current) return;
    
    interface TeamData {
      matches: any[],
      autoScores: any[],
      teleopScores: any[],
      totalScores: any[],
      climbSuccess: number,
      matchCount: number
    };

    // Group records by team
    const teamData = records.reduce((acc, record) => {
      if (!acc[record.team]) {
        acc[record.team] = {
          matches: [],
          autoScores: [],
          teleopScores: [],
          totalScores: [],
          climbSuccess: 0,
          matchCount: 0
        };
      }

      const autoScore = calculateScore(record.autonomous, true);
      const teleopScore = calculateScore(record.teleop, false);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame.stopStatus);
      const totalScore = autoScore + teleopScore + endGameScore;

      acc[record.team].matches.push(record.matchNumber);
      acc[record.team].autoScores.push(autoScore);
      acc[record.team].teleopScores.push(teleopScore);
      acc[record.team].totalScores.push(totalScore);
      acc[record.team].matchCount++;
      if (['Deep Climb', 'Shallow Climb'].includes(record.endAndAfterGame.stopStatus)) {
        acc[record.team].climbSuccess++;
      }

      return acc;
    }, {});

    // Performance Trend Chart
    const chart = echarts.init(chartRef.current);
    const trendOption = {
      title: {
        text: 'Team Performance Comparison',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: Object.keys(teamData).map(team => `Team ${team}`),
        top: 30,
        type: 'scroll',
        textStyle: {
          fontSize: 10
        },
        pageButtonItemGap: 5,
        pageButtonGap: 5,
        pageIconSize: 12
      },
      grid: {
        left: '10%',
        right: '5%',
        bottom: '15%',
        top: '30%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: Math.max(...Object.values(teamData).map(d => (d as TeamData).matches.length!)) }, (_, i) => `Match ${i + 1}`),
        name: 'Match Number'
      },
      yAxis: {
        type: 'value',
        name: 'Points'
      },
      series: Object.entries(teamData).map(([team, data]) => ({
        name: `Team ${team}`,
        type: 'line',
        data: (data as any).totalScores,
        smooth: true,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        }
      }))
    };

    chart.setOption(trendOption);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [records]);

  return (
    <div className="space-y-4">
      <div ref={chartRef} style={{ width: '100%', height: '350px' }} className="min-h-[300px]" />
    </div>
  );
}

function average(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
} 
