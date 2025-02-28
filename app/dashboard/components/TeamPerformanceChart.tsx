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
  };
  teleopScores: { 
    l1: number[]; 
    l2: number[]; 
    l3: number[]; 
    l4: number[];
    processor: number[];
    net: number[];
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

    const data: PerformanceData = {
      matchNumbers: [],
      autoScores: { 
        l1: [], l2: [], l3: [], l4: [], 
        processor: [], net: [] 
      },
      teleopScores: { 
        l1: [], l2: [], l3: [], l4: [], 
        processor: [], net: [] 
      },
      totalScores: [],
      autoTotalScores: [],
      teleopTotalScores: [],
      endGameScores: []
    };

    records.sort((a, b) => a.matchNumber - b.matchNumber).forEach(record => {
      data.matchNumbers.push(record.matchNumber);
      
      // Auto scores
      data.autoScores.l1.push(record.autonomous.coralCount.l1 || 0);
      data.autoScores.l2.push(record.autonomous.coralCount.l2 || 0);
      data.autoScores.l3.push(record.autonomous.coralCount.l3 || 0);
      data.autoScores.l4.push(record.autonomous.coralCount.l4 || 0);
      data.autoScores.processor.push(record.autonomous.algaeCount.processor || 0);
      data.autoScores.net.push(record.autonomous.algaeCount.netShot || 0);

      // Calculate auto total points
      const autoTotal = calculateScore(record.autonomous, true);
      data.autoTotalScores.push(autoTotal);

      // Teleop scores
      data.teleopScores.l1.push(record.teleop.coralCount.l1 || 0);
      data.teleopScores.l2.push(record.teleop.coralCount.l2 || 0);
      data.teleopScores.l3.push(record.teleop.coralCount.l3 || 0);
      data.teleopScores.l4.push(record.teleop.coralCount.l4 || 0);
      data.teleopScores.processor.push(record.teleop.algaeCount.processor || 0);
      data.teleopScores.net.push(record.teleop.algaeCount.netShot || 0);

      // Calculate teleop and endgame
      const teleopTotal = calculateScore(record.teleop, false);
      const endGameScore = calculateEndGameScore(record.endAndAfterGame.stopStatus);
      data.teleopTotalScores.push(teleopTotal + endGameScore);
      data.endGameScores.push(endGameScore);

      // Total match score
      data.totalScores.push(autoTotal + teleopTotal);
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
            tooltip += `${param.seriesName}: ${param.value} (${param.value * parseInt(param.seriesName.match(/\((\d+)pts\)/)[1])} pts)<br/>`;
            total += param.value * parseInt(param.seriesName.match(/\((\d+)pts\)/)[1]);
          });
          tooltip += `<br/><strong>Total: ${total} points</strong>`;
          return tooltip;
        }
      },
      legend: {
        data: [
          'L1 (3pts)', 'L2 (4pts)', 'L3 (6pts)', 'L4 (7pts)',
          'Processor (6pts)', 'Net (4pts)'
        ],
        top: 50,
        padding: [5, 10],
        itemGap: 20,
      },
      grid: {
        top: 140,
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
        name: 'Count'
      },
      series: [
        {
          name: 'L1 (3pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l1
        },
        {
          name: 'L2 (4pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l2
        },
        {
          name: 'L3 (6pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l3
        },
        {
          name: 'L4 (7pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l4
        },
        {
          name: 'Processor (6pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.processor
        },
        {
          name: 'Net (4pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.net
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
        subtext: `Average: ${average(data.teleopTotalScores).toFixed(1)} points (including endgame)`,
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
            tooltip += `${param.seriesName}: ${param.value} (${param.value * parseInt(param.seriesName.match(/\((\d+)pts\)/)[1])} pts)<br/>`;
            total += param.value * parseInt(param.seriesName.match(/\((\d+)pts\)/)[1]);
          });
          const endGameScore = data.endGameScores[params[0].dataIndex];
          tooltip += `Endgame: ${endGameScore} pts<br/>`;
          tooltip += `<br/><strong>Total: ${total + endGameScore} points</strong>`;
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
        itemGap: 20,
      },
      grid: {
        top: 140,
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
        name: 'Count'
      },
      series: [
        {
          name: 'L1 (2pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l1
        },
        {
          name: 'L2 (3pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l2
        },
        {
          name: 'L3 (4pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l3
        },
        {
          name: 'L4 (5pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l4
        },
        {
          name: 'Processor (6pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.processor
        },
        {
          name: 'Net (4pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.net
        },
        {
          name: 'Deep Climb (12pts)',
          type: 'bar',
          stack: 'teleop',
          data: records.map(record => record.endAndAfterGame.stopStatus === 'Deep Climb' ? 1 : 0)
        },
        {
          name: 'Shallow Climb (6pts)',
          type: 'bar',
          stack: 'teleop',
          data: records.map(record => record.endAndAfterGame.stopStatus === 'Shallow Climb' ? 1 : 0)
        },
        {
          name: 'Park (2pts)',
          type: 'bar',
          stack: 'teleop',
          data: records.map(record => record.endAndAfterGame.stopStatus === 'Park' ? 1 : 0)
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
                 `Teleop: ${data.teleopTotalScores[matchIndex] - data.endGameScores[matchIndex]} pts<br/>` +
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

  return (
    <div className="space-y-8 pt-8">
      <div ref={autoChartRef} style={{ width: '100%', height: '400px' }} />
      <div ref={teleopChartRef} style={{ width: '100%', height: '400px' }} />
      <div ref={totalScoreChartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
}

function average(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
} 