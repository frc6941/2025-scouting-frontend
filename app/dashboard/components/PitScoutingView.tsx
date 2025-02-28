'use client';

import { useEffect, useState } from 'react';
import { Card, Chip, Textarea } from "@heroui/react";
import Image from 'next/image';

interface PitScoutingData {
  autoType: string;
  capabilities: {
    l1: boolean;
    l2: boolean;
    l3: boolean;
    l4: boolean;
    processor: boolean;
    barge: boolean;
    noClimb: boolean;
    shallowClimb: boolean;
    deepClimb: boolean;
  };
  chassisType: string;
  cycleTime: string;
  photos: string[];
  comments?: string;
}

export function PitScoutingView({ teamNumber }) {
  const [data, setData] = useState<PitScoutingData | null>(null);

  useEffect(() => {
    if (!teamNumber) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pit-scouting/${teamNumber}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setData(data)
      })
      .catch(err => console.error('Error fetching pit scouting data:', err));
  }, [teamNumber]);

  if (!teamNumber || !data) return null;

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Team {teamNumber} Pit Scouting
      </h2>
      
      <div className="space-y-6">
        {/* Capabilities Section */}
        <section>
          <h3 className="text-lg font-semibold mb-3">能放 Coral</h3>
          <div className="flex flex-wrap gap-2">
            {['l1', 'l2', 'l3', 'l4'].map((level) => (
              data.capabilities[level] && (
                <Chip key={level} color="primary" size="sm">
                  {level.toUpperCase()}
                </Chip>
              )
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">能放 Algae</h3>
          <div className="flex flex-wrap gap-2">
            {['processor', 'barge'].map((type) => (
              data.capabilities[type] && (
                <Chip key={type} color="primary" size="sm">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Chip>
              )
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">爬升</h3>
          <div className="flex flex-wrap gap-2">
            {['noClimb', 'shallowClimb', 'deepClimb'].map((climb) => (
              data.capabilities[climb] && (
                <Chip key={climb} color="primary" size="sm">
                  {climb === 'noClimb' ? '不能爬' : 
                   climb === 'shallowClimb' ? 'Shallow Climb' : 'Deep Climb'}
                </Chip>
              )
            ))}
          </div>
        </section>

        {/* Robot Details */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-default-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">底盘类型</h3>
            <p>{data.chassisType}</p>
          </div>

          <div className="bg-default-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">自动类型</h3>
            <p>{data.autoType}</p>
          </div>

          <div className="bg-default-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Cycle 时间</h3>
            <p>{data.cycleTime}</p>
          </div>
        </section>

        {/* Photos Section */}
        {data.photos && data.photos.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-3">Robot Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
              {data.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square w-full">
                  <Image
                    src={`data:image/jpeg;base64,${photo}`}
                    alt={`Robot photo ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        {data.comments && (
          <section className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
            <div className="bg-default-50 p-4 rounded-lg whitespace-pre-wrap">
              {data.comments}
            </div>
          </section>
        )}
      </div>
    </Card>
  );
} 