'use client';

import { useEffect, useState } from 'react';
import { Card, Chip } from "@heroui/react";
import Image from 'next/image';
import { TeamPerformanceChart } from './TeamPerformanceChart';

interface PitScoutingData {
  autoType: string;
  capabilities: {
    amp: boolean;
    speaker: boolean;
    trap: boolean;
  };
  chassisType: string;
  cycleTime: string;
  photos: string[];
}

export function PitScoutingView({ teamNumber }) {
  const [data, setData] = useState<PitScoutingData | null>(null);
  const [matchRecords, setMatchRecords] = useState([]);

  useEffect(() => {
    if (!teamNumber) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pit-scouting/${teamNumber}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setData(data)
      })
      .catch(err => console.error('Error fetching pit scouting data:', err));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/${teamNumber}/matches`)
      .then(res => res.json())
      .then(data => setMatchRecords(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching match records:', err));
  }, [teamNumber]);

  if (!teamNumber || !data) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Team {teamNumber} Pit Scouting</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Capabilities</h3>
              <div className="flex gap-2 mt-2">
                {data.capabilities && Object.entries(data.capabilities).map(([key, value]) => (
                  value && (
                    <Chip key={key} color="primary">
                      {key.toUpperCase()}
                    </Chip>
                  )
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Chassis Type</h3>
              <p>{data.chassisType}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Auto Type</h3>
              <p>{data.autoType}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Cycle Time</h3>
              <p>{data.cycleTime}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Robot Photos</h3>
            <div className="grid grid-cols-2 gap-4">
              {data?.photos?.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={`data:image/jpeg;base64,${photo}`}
                    alt={`Robot photo ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 