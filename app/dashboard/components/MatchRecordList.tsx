'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

interface MatchRecord {
  id: string;
  matchType: string;
  matchNumber: number;
  alliance: string;
  autonomous: {
    autoStart: number;
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
    comments: string;
  };
}

function calculateScore(phase: { coralCount: any; algaeCount: any }) {
  if (!phase) return 0;
  
  const coralPoints = {
    l4: 5,
    l3: 4,
    l2: 3,
    l1: 2
  };

  let score = 0;

  // Calculate coral points
  if (phase.coralCount) {
    Object.entries(coralPoints).forEach(([level, points]) => {
      score += (phase.coralCount[level] || 0) * points;
    });
  }

  // Calculate algae points
  if (phase.algaeCount) {
    score += (phase.algaeCount.netShot || 0) * 3;
    score += (phase.algaeCount.processor || 0) * 2;
  }

  return score;
}

export function MatchRecordList({ teamNumber, matchType }) {
  const [records, setRecords] = useState<MatchRecord[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!teamNumber) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/${teamNumber}/matches${matchType ? `?type=${matchType}` : ''}`)
      .then(res => res.json())
      .then(data => {
        console.log('Match records:', data);
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error fetching match records:', err));
  }, [teamNumber, matchType]);

  const renderDetailSection = (title: string, data: any) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="bg-default-50 p-4 rounded-lg">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 gap-2 mb-2">
            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            {typeof value === 'object' ? (
              <div className="pl-4">
                {Object.entries(value as object).map(([subKey, subValue]) => (
                  <div key={subKey} className="grid grid-cols-2 gap-2">
                    <span className="text-gray-600 capitalize">{subKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>{subValue}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Match Records</h2>
        <div className="space-y-4">
          {Array.isArray(records) && records.length > 0 ? (
            records.map(record => (
              <div key={record.id} className="p-4 border rounded-lg bg-default-50 hover:bg-default-100 transition-colors">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Match {record.matchNumber}</h3>
                  <span className={`px-3 py-1 rounded-full ${
                    record.alliance === 'Red' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {record.alliance}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Auto Score</p>
                    <p className="font-medium">
                      {calculateScore(record.autonomous)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teleop Score</p>
                    <p className="font-medium">
                      {calculateScore(record.teleop)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Game</p>
                    <p className="font-medium">{record.endAndAfterGame.stopStatus}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button 
                    color="primary"
                    variant="light"
                    onPress={() => {
                      setSelectedMatch(record);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No match records found
            </div>
          )}
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMatch(null);
        }}
        size="2xl"
        className="mx-2 mb-[5vh] sm:mx-4 max-h-[95vh] mt-[2vh] sm:mt-[5vh]"
      >
        <ModalContent className="p-3 sm:p-6 min-h-[90vh] sm:min-h-[80vh]">
          {selectedMatch && (
            <>
              <ModalHeader className="border-b pb-4">
                <h2 className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  Match {selectedMatch.matchNumber} Details
                  <span className={`px-3 py-1 text-base rounded-full ${
                    selectedMatch.alliance === 'Red' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedMatch.alliance}
                  </span>
                </h2>
              </ModalHeader>
              <ModalBody className="py-4 sm:py-6 overflow-y-auto">
                <div className="space-y-6">
                  {renderDetailSection('Autonomous', selectedMatch.autonomous)}
                  {renderDetailSection('Teleop', selectedMatch.teleop)}
                  {renderDetailSection('End Game', selectedMatch.endAndAfterGame)}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
} 