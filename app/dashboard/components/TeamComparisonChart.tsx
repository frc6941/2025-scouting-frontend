'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

export function TeamComparisonChart({ records }) {
  const chartRef = useRef(null);
  const scatterRef = useRef(null);

  useEffect(() => {
    if (!records || !chartRef.current || !scatterRef.current) return;
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
      if (['DEEP', 'SHALLOW'].includes(record.endAndAfterGame.stopStatus)) {
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
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: Math.max(...Object.values(teamData).map(d => (d as TeamData).matches.length!)) }, (_, i) => `Match ${i + 1}`),
        name: 'Match Number'
      },
      yAxis: {
        type: 'value',
        name: ''
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

    // Team Statistics Scatter Plot
    const scatter = echarts.init(scatterRef.current);
    const scatterOption = {
      title: {
        text: 'Team Performance Analysis',
        left: 'center'
      },
      tooltip: {
        formatter: function(params) {
          const team = params.data[3];
          const deepClimbRate = (teamData[team].climbSuccess / teamData[team].matchCount * 100).toFixed(1);
          const shallowClimbRate = (teamData[team].climbSuccess / teamData[team].matchCount * 100).toFixed(1);
          return `Team ${team}<br/>` +
                 `Avg Auto: ${params.data[0].toFixed(1)}<br/>` +
                 `Avg Teleop: ${params.data[1].toFixed(1)}<br/>` +
                 `Deep Climb: ${deepClimbRate}%<br/>` +
                 `Shallow Climb: ${shallowClimbRate}%`;
        }
      },
      grid: {
        left: '10%',
        right: '10%'
      },
      xAxis: {
        name: 'Auto',
        type: 'value'
      },
      yAxis: {
        name: 'Teleop',
        type: 'value'
      },
      series: [{
        type: 'scatter',
        symbolSize: function(data) {
          return (data[2] * 20) + 20; // Size based on climb success rate
        },
        data: Object.entries(teamData).map(([team, data]: [string, any]) => [
          average((data as any).autoScores),
          average((data as any).teleopScores),
          (data as any).climbSuccess / (data as any).matchCount,
          team // Store team number for tooltip
        ])
      }]
    };

    chart.setOption(trendOption);
    scatter.setOption(scatterOption);

    const handleResize = () => {
      chart.resize();
      scatter.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      scatter.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [records]);

  return (
    <div className="space-y-8">
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      <div ref={scatterRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
}

function average(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
} 
