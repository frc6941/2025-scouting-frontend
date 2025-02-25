'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PerformanceData {
  matchNumbers: number[];
  autoScores: { l1: number[]; l2: number[]; l3: number[]; l4: number[] };
  teleopScores: { l1: number[]; l2: number[]; l3: number[]; l4: number[] };
  totalScores: number[];
}

export function TeamPerformanceChart({ records }) {
  const autoChartRef = useRef(null);
  const teleopChartRef = useRef(null);

  useEffect(() => {
    if (!records || !autoChartRef.current || !teleopChartRef.current) return;

    const data: PerformanceData = {
      matchNumbers: [],
      autoScores: { l1: [], l2: [], l3: [], l4: [] },
      teleopScores: { l1: [], l2: [], l3: [], l4: [] },
      totalScores: []
    };

    records.sort((a, b) => a.matchNumber - b.matchNumber).forEach(record => {
      data.matchNumbers.push(record.matchNumber);
      
      data.autoScores.l1.push(record.autonomous.coralCount.l1 || 0);
      data.autoScores.l2.push(record.autonomous.coralCount.l2 || 0);
      data.autoScores.l3.push(record.autonomous.coralCount.l3 || 0);
      data.autoScores.l4.push(record.autonomous.coralCount.l4 || 0);

      data.teleopScores.l1.push(record.teleop.coralCount.l1 || 0);
      data.teleopScores.l2.push(record.teleop.coralCount.l2 || 0);
      data.teleopScores.l3.push(record.teleop.coralCount.l3 || 0);
      data.teleopScores.l4.push(record.teleop.coralCount.l4 || 0);

      const totalScore = 
        (record.autonomous.coralCount.l1 || 0) * 1 +
        (record.autonomous.coralCount.l2 || 0) * 2 +
        (record.autonomous.coralCount.l3 || 0) * 3 +
        (record.autonomous.coralCount.l4 || 0) * 4 +
        (record.teleop.coralCount.l1 || 0) * 1 +
        (record.teleop.coralCount.l2 || 0) * 2 +
        (record.teleop.coralCount.l3 || 0) * 3 +
        (record.teleop.coralCount.l4 || 0) * 4;
      
      data.totalScores.push(totalScore);
    });

    const autoAverages = {
      l1: average(data.autoScores.l1),
      l2: average(data.autoScores.l2),
      l3: average(data.autoScores.l3),
      l4: average(data.autoScores.l4)
    };

    const teleopAverages = {
      l1: average(data.teleopScores.l1),
      l2: average(data.teleopScores.l2),
      l3: average(data.teleopScores.l3),
      l4: average(data.teleopScores.l4)
    };

    const autoChart = echarts.init(autoChartRef.current);
    const autoOption = {
      title: {
        text: 'Autonomous Performance',
        left: 'center',
        top: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['L1 (1pt)', 'L2 (2pts)', 'L3 (3pts)', 'L4 (4pts)'],
        top: 25
      },
      grid: {
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
          name: 'L1 (1pt)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l1,
          markLine: {
            data: [{ yAxis: autoAverages.l1, name: 'L1 Avg' }]
          }
        },
        {
          name: 'L2 (2pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l2,
          markLine: {
            data: [{ yAxis: autoAverages.l2, name: 'L2 Avg' }]
          }
        },
        {
          name: 'L3 (3pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l3,
          markLine: {
            data: [{ yAxis: autoAverages.l3, name: 'L3 Avg' }]
          }
        },
        {
          name: 'L4 (4pts)',
          type: 'bar',
          stack: 'auto',
          data: data.autoScores.l4,
          markLine: {
            data: [{ yAxis: autoAverages.l4, name: 'L4 Avg' }]
          }
        }
      ]
    };

    const teleopChart = echarts.init(teleopChartRef.current);
    const teleopOption = {
      title: {
        text: 'Teleop Performance',
        left: 'center',
        top: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['L1 (1pt)', 'L2 (2pts)', 'L3 (3pts)', 'L4 (4pts)'],
        top: 25
      },
      grid: {
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
          name: 'L1 (1pt)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l1,
          markLine: {
            data: [{ yAxis: teleopAverages.l1, name: 'L1 Avg' }]
          }
        },
        {
          name: 'L2 (2pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l2,
          markLine: {
            data: [{ yAxis: teleopAverages.l2, name: 'L2 Avg' }]
          }
        },
        {
          name: 'L3 (3pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l3,
          markLine: {
            data: [{ yAxis: teleopAverages.l3, name: 'L3 Avg' }]
          }
        },
        {
          name: 'L4 (4pts)',
          type: 'bar',
          stack: 'teleop',
          data: data.teleopScores.l4,
          markLine: {
            data: [{ yAxis: teleopAverages.l4, name: 'L4 Avg' }]
          }
        }
      ]
    };

    autoChart.setOption(autoOption);
    teleopChart.setOption(teleopOption);

    const handleResize = () => {
      autoChart.resize();
      teleopChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      autoChart.dispose();
      teleopChart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [records]);

  return (
    <div className="space-y-8 pt-8">
      <div ref={autoChartRef} style={{ width: '100%', height: '400px' }} />
      <div ref={teleopChartRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
}

function average(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
} 