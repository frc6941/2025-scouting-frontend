'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

interface PerformanceData {
  matchNumbers: number[];
  autoScores: { 
    l1: number[]; 
    l2: number[]; 
    l3: number[]; 
    l4: number[];
    processor: number[];
    net: number[];
    leftZone: number[];
  };
  teleopScores: { 
    l1: number[]; 
    l2: number[]; 
    l3: number[]; 
    l4: number[];
    processor: number[];
    net: number[];
    deepClimb: number[];
    shallowClimb: number[];
    park: number[];
  };
  totalScores: number[];
  autoTotalScores: number[];
  teleopTotalScores: number[];
  endGameScores: number[];
}

export function TeamPerformanceChart({ records }) {
  const autoChartRef = useRef(null);
  const teleopChartRef = useRef(null);
  const totalScoreChartRef = useRef(null);

  useEffect(() => {
    if (!records || !autoChartRef.current || !teleopChartRef.current || !totalScoreChartRef.current) return;

    const data = {
      matchNumbers: [],
      autoScores: {
        l1: [],
        l2: [],
        l3: [],
        l4: [],
        processor: [],
        net: [],
        leftZone: []
      },
      teleopScores: {
        l1: [],
        l2: [],
        l3: [],
        l4: [],
        processor: [],
        net: [],
        deepClimb: [],
        shallowClimb: [],
        park: []
      },
      autoTotalScores: [],
      teleopTotalScores: [],
      endGameScores: [],
      totalScores: []
    };

    records.sort((a, b) => a.matchNumber - b.matchNumber).forEach(record => {
      data.matchNumbers.push(record.matchNumber);

      // Auto scores (multiply by points)
      data.autoScores.l1.push((record.autonomous.coralCount.l1 || 0) * 3);
      data.autoScores.l2.push((record.autonomous.coralCount.l2 || 0) * 4);
      data.autoScores.l3.push((record.autonomous.coralCount.l3 || 0) * 6);
      data.autoScores.l4.push((record.autonomous.coralCount.l4 || 0) * 7);
      data.autoScores.processor.push((record.autonomous.algaeCount.processor || 0) * 6);
      data.autoScores.net.push((record.autonomous.algaeCount.netShot || 0) * 4);
      data.autoScores.leftZone.push(record.autonomous.leftStartingZone ? 2 : 0);

      const autoScore = calculateScore(record.autonomous, true);
      data.autoTotalScores.push(autoScore);

      // Teleop scores (multiply by points)
      data.teleopScores.l1.push((record.teleop.coralCount.l1 || 0) * 2);
      data.teleopScores.l2.push((record.teleop.coralCount.l2 || 0) * 3);
      data.teleopScores.l3.push((record.teleop.coralCount.l3 || 0) * 4);
      data.teleopScores.l4.push((record.teleop.coralCount.l4 || 0) * 5);
      data.teleopScores.processor.push((record.teleop.algaeCount.processor || 0) * 6);
      data.teleopScores.net.push((record.teleop.algaeCount.netShot || 0) * 4);

      // End game scores
      data.teleopScores.deepClimb.push(record.endAndAfterGame.stopStatus === 'Deep Climb' ? 12 : 0);
      data.teleopScores.shallowClimb.push(record.endAndAfterGame.stopStatus === 'Shallow Climb' ? 6 : 0);
      data.teleopScores.park.push(record.endAndAfterGame.stopStatus === 'Park' ? 2 : 0);

      const teleopScore = calculateScore(record.teleop, false);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame.stopStatus);

      data.teleopTotalScores.push(teleopScore + endGameScore);
      data.endGameScores.push(endGameScore);
      data.totalScores.push(autoScore + teleopScore + endGameScore);
    });

    // Auto Chart
    const autoChart = echarts.init(autoChartRef.current);
    const autoOption = {
      title: {
        text: 'Autonomous Performance',
        left: 'center',
        top: 0,
        subtext: `Average: ${average(data.autoTotalScores).toFixed(1)} points`,
        textStyle: {
          fontSize: 16
        },
        subtextStyle: {
          fontSize: 12
        },
        padding: [0, 0, 10, 0]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function(params) {
          let total = 0;
          let tooltip = `Match ${params[0].axisValue}<br/>`;
          params.forEach(param => {
            // Check if the series name contains points information
            const pointsMatch = param.seriesName.match(/\((\d+)pts\)/);
            if (pointsMatch) {
              const points = parseInt(pointsMatch[1]);
              const count = param.value / points;
              tooltip += `${param.seriesName}: ${count} (${param.value} pts)<br/>`;
            } else {
              // Handle series without point values in the name (like 'Left Zone')
              tooltip += `${param.seriesName}: ${param.value} pts<br/>`;
            }
            total += param.value;
          });
          tooltip += `<br/><strong>Total: ${total} points</strong>`;
          return tooltip;
        }
      },
      legend: {
        data: [
          'L1 (3pts)', 'L2 (4pts)', 'L3 (6pts)', 'L4 (7pts)',
          'Processor (6pts)', 'Net (4pts)', 'Left Zone'
        ],
        top: 50,
        padding: [5, 10],
        itemGap: 10,
        textStyle: {
          fontSize: 10
        },
        type: 'scroll',
        pageButtonItemGap: 5,
        pageButtonGap: 5,
        pageIconSize: 12
      },
      grid: {
        top: 120,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.matchNumbers.map(num => `Match ${num}`),
      },
      yAxis: {
        type: 'value',
        name: 'Points'
      },
      series: [
        {
          name: 'L1 (3pts)',
          type: 'bar',
          stack: 'total',
          data: data.autoScores.l1
        },
        {
          name: 'L2 (4pts)',
          type: 'bar',
          stack: 'total',
          data: data.autoScores.l2
        },
        {
          name: 'L3 (6pts)',
          type: 'bar',
          stack: 'total',
          data: data.autoScores.l3
        },
        {
          name: 'L4 (7pts)',
          type: 'bar',
          stack: 'total',
          data: data.autoScores.l4
        },
        {
          name: 'Processor (6pts)',
          type: 'bar',
          stack: 'total',
          data: data.autoScores.processor
        },
        {
          name: 'Net (4pts)',
          type: 'bar',
          stack: 'total',
          data: data.autoScores.net
        },
        {
          name: 'Left Zone',
          type: 'bar',
          stack: 'total',
          data: data.autoScores.leftZone
        }
      ]
    };

    // Teleop Chart
    const teleopChart = echarts.init(teleopChartRef.current);
    const teleopOption = {
      title: {
        text: 'Teleop Performance',
        left: 'center',
        top: 0,
        subtext: `Average: ${average(data.teleopTotalScores).toFixed(1)} points`,
        textStyle: {
          fontSize: 16
        },
        subtextStyle: {
          fontSize: 12
        },
        padding: [0, 0, 10, 0]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function(params) {
          let total = 0;
          let tooltip = `Match ${params[0].axisValue}<br/>`;
          params.forEach(param => {
            // Check if the series name contains points information
            const pointsMatch = param.seriesName.match(/\((\d+)pts\)/);
            if (pointsMatch) {
              const points = parseInt(pointsMatch[1]);
              const count = param.value / points;
              tooltip += `${param.seriesName}: ${count} (${param.value} pts)<br/>`;
            } else {
              // Handle series without point values in the name (like 'Left Zone')
              tooltip += `${param.seriesName}: ${param.value} pts<br/>`;
            }
            total += param.value;
          });
          tooltip += `<br/><strong>Total: ${total} points</strong>`;
          return tooltip;
        }
      },
      legend: {
        data: [
          'L1 (2pts)', 'L2 (3pts)', 'L3 (4pts)', 'L4 (5pts)',
          'Processor (6pts)', 'Net (4pts)', 
          'Deep Climb (12pts)', 'Shallow Climb (6pts)', 'Park (2pts)'
        ],
        top: 50,
        padding: [5, 10],
        itemGap: 10,
        textStyle: {
          fontSize: 10
        },
        type: 'scroll',
        pageButtonItemGap: 5,
        pageButtonGap: 5,
        pageIconSize: 12
      },
      grid: {
        top: 120,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.matchNumbers.map(num => `Match ${num}`),
      },
      yAxis: {
        type: 'value',
        name: 'Points'
      },
      series: [
        {
          name: 'L1 (2pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.l1
        },
        {
          name: 'L2 (3pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.l2
        },
        {
          name: 'L3 (4pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.l3
        },
        {
          name: 'L4 (5pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.l4
        },
        {
          name: 'Processor (6pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.processor
        },
        {
          name: 'Net (4pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.net
        },
        {
          name: 'Deep Climb (12pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.deepClimb
        },
        {
          name: 'Shallow Climb (6pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.shallowClimb
        },
        {
          name: 'Park (2pts)',
          type: 'bar',
          stack: 'total',
          data: data.teleopScores.park
        }
      ]
    };

    // Total Score Chart
    const totalScoreChart = echarts.init(totalScoreChartRef.current);
    const totalScoreOption = {
      title: {
        text: 'Total Match Scores',
        left: 'center',
        top: 0,
        subtext: `Average: ${average(data.totalScores).toFixed(1)} points`,
        textStyle: {
          fontSize: 16
        },
        subtextStyle: {
          fontSize: 12
        },
        padding: [0, 0, 10, 0]
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function(params) {
          const matchIndex = params[0].dataIndex;
          return `Match ${data.matchNumbers[matchIndex]}<br/>` +
                 `Auto: ${data.autoTotalScores[matchIndex]} pts<br/>` +
                 `Teleop: ${data.teleopTotalScores[matchIndex]} pts<br/>` +
                 `Endgame: ${data.endGameScores[matchIndex]} pts<br/>` +
                 `<br/><strong>Total: ${data.totalScores[matchIndex]} points</strong>`;
        }
      },
      grid: {
        top: 100,
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.matchNumbers.map(num => `Match ${num}`),
      },
      yAxis: {
        type: 'value',
        name: 'Points'
      },
      series: [
        {
          name: 'Total Score',
          type: 'bar',
          data: data.totalScores,
          itemStyle: {
            color: '#1a73e8'
          },
          markLine: {
            data: [{ type: 'average', name: 'Average' }]
          }
        }
      ]
    };

    autoChart.setOption(autoOption);
    teleopChart.setOption(teleopOption);
    totalScoreChart.setOption(totalScoreOption);

    const handleResize = () => {
      autoChart.resize();
      teleopChart.resize();
      totalScoreChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      autoChart.dispose();
      teleopChart.dispose();
      totalScoreChart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [records]);

  // Define CustomTooltip inside the component so it has access to records
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const record = records.find(r => `Match ${r.matchNumber}` === label);
      const leftZonePoints = record?.autonomous.leftStartingZone ? 2 : 0;
      
      return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {entry.value}
                {entry.name === "Auto Score" && record?.autonomous.leftStartingZone && " (incl. 2pts for leaving zone)"}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pt-4">
      <div ref={autoChartRef} style={{ width: '100%', height: '350px' }} className="min-h-[300px]" />
      <div ref={teleopChartRef} style={{ width: '100%', height: '350px' }} className="min-h-[300px]" />
      <div ref={totalScoreChartRef} style={{ width: '100%', height: '350px' }} className="min-h-[300px]" />
    </div>
  );
}

function average(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
} 