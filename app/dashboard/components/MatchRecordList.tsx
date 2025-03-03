'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

interface MatchRecord {
  id: string;
  team: number;
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

interface GroupedMatchRecord {
  matchNumber: number;
  matchType: string;
  teams: {
    id: string;
    team: number;
    alliance: string;
    autonomous: MatchRecord['autonomous'];
    teleop: MatchRecord['teleop'];
    endAndAfterGame: MatchRecord['endAndAfterGame'];
  }[];
}

function calculateMatchStats(teams) {
  const stats = {
    totalAutoScore: 0,
    totalTeleopScore: 0,
    avgAutoScore: 0,
    avgTeleopScore: 0,
    climbSuccessRate: 0,
    coralLevelStats: {
      auto: { l1: 0, l2: 0, l3: 0, l4: 0 },
      teleop: { l1: 0, l2: 0, l3: 0, l4: 0 }
    }
  };

  teams.forEach(team => {
    const autoScore = calculateScore(team.autonomous, true);
    const teleopScore = calculateScore(team.teleop, false);
    stats.totalAutoScore += autoScore;
    stats.totalTeleopScore += teleopScore;

    // Count coral levels
    ['l1', 'l2', 'l3', 'l4'].forEach(level => {
      stats.coralLevelStats.auto[level] += team.autonomous.coralCount[level] || 0;
      stats.coralLevelStats.teleop[level] += team.teleop.coralCount[level] || 0;
    });

    if (['DEEP', 'SHALLOW'].includes(team.endAndAfterGame.stopStatus)) {
      stats.climbSuccessRate++;
    }
  });

  stats.avgAutoScore = stats.totalAutoScore / teams.length;
  stats.avgTeleopScore = stats.totalTeleopScore / teams.length;
  stats.climbSuccessRate = (stats.climbSuccessRate / teams.length) * 100;

  return stats;
}

function MatchStatsModal({ match, onClose }) {
  const stats = calculateMatchStats(match.teams);
  
  return (
    <ModalContent className="p-3 sm:p-6">
      <ModalHeader className="border-b pb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Match {match.matchNumber} Statistics
        </h2>
      </ModalHeader>
      <ModalBody className="py-4 sm:py-6 overflow-y-auto">
        <div className="space-y-8">
          {/* Overall Scores */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-default-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg Auto Score</p>
                <p className="text-2xl font-bold">{stats.avgAutoScore.toFixed(1)}</p>
              </div>
              <div className="bg-default-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg Teleop Score</p>
                <p className="text-2xl font-bold">{stats.avgTeleopScore.toFixed(1)}</p>
              </div>
              <div className="bg-default-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Score</p>
                <p className="text-2xl font-bold">{(stats.totalAutoScore + stats.totalTeleopScore).toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Coral Level Distribution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Coral Level Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-3">Autonomous</h4>
                <div className="space-y-2">
                  {Object.entries(stats.coralLevelStats.auto).map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center">
                      <span>Level {level.toUpperCase()}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium mb-3">Teleop</h4>
                <div className="space-y-2">
                  {Object.entries(stats.coralLevelStats.teleop).map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center">
                      <span>Level {level.toUpperCase()}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" variant="light" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

// Add this new component for individual team stats
function TeamStatsModal({ team }) {
  return (
    <div className="space-y-6">
      {/* Auto Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Autonomous</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Coral Counts</h4>
            <div className="space-y-2">
              {Object.entries(team.autonomous.coralCount).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Algae Counts</h4>
            <div className="space-y-2">
              {Object.entries(team.autonomous.algaeCount).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 bg-default-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Auto Start Position</span>
            <span className="font-medium">{team.autonomous.autoStart}</span>
          </div>
        </div>
      </div>

      {/* Teleop Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Teleop</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Coral Counts</h4>
            <div className="space-y-2">
              {Object.entries(team.teleop.coralCount).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Algae Counts</h4>
            <div className="space-y-2">
              {Object.entries(team.teleop.algaeCount).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* End Game Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-3">End Game</h3>
        <div className="bg-default-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Stop Status</span>
              <span className="font-medium">{team.endAndAfterGame.stopStatus}</span>
            </div>
            {team.endAndAfterGame.comments && (
              <div className="mt-2">
                <span className="block text-sm text-gray-600">Comments:</span>
                <p className="mt-1">{team.endAndAfterGame.comments}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MatchRecordList({ teamNumber, matchType }) {
  const [records, setRecords] = useState<GroupedMatchRecord[] | MatchRecord[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<GroupedMatchRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamStats, setShowTeamStats] = useState(false);
  const [expandedMatches, setExpandedMatches] = useState<number[]>([]);

  useEffect(() => {
    if (!teamNumber) {
      // Fetch all teams' records
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/teams`)
        .then(res => res.json())
        .then((data: MatchRecord[]) => {
          // Group records by match
          const groupedRecords = data.reduce((acc, record) => {
            const matchKey = `${record.matchNumber}`;
            if (!acc[matchKey]) {
              acc[matchKey] = {
                matchNumber: record.matchNumber,
                matchType: record.matchType,
                teams: []
              };
            }
            acc[matchKey].teams.push({
              id: record.id,
              team: record.team,
              alliance: record.alliance,
              autonomous: record.autonomous,
              teleop: record.teleop,
              endAndAfterGame: record.endAndAfterGame
            });
            return acc;
          }, {} as Record<string, GroupedMatchRecord>);

          const sortedRecords = Object.values(groupedRecords)
            .sort((a, b) => a.matchNumber - b.matchNumber);

          setRecords(sortedRecords);
        })
        .catch(err => console.error('Error fetching match records:', err));
    } else {
      // Fetch single team records
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/${teamNumber}/matches${matchType ? `?type=${matchType}` : ''}`)
        .then(res => res.json())
        .then((data: MatchRecord[]) => {
          // Group records by match and include all teams in those matches
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouting/teams`)
            .then(res => res.json())
            .then((allRecords: MatchRecord[]) => {
              const matchNumbers = new Set(data?.map(r => r.matchNumber));
              const relevantRecords = allRecords.filter(r => matchNumbers.has(r.matchNumber));
              
              const groupedRecords = relevantRecords.reduce((acc, record) => {
                const matchKey = `${record.matchNumber}`;
                if (!acc[matchKey]) {
                  acc[matchKey] = {
                    matchNumber: record.matchNumber,
                    matchType: record.matchType,
                    teams: []
                  };
                }
                acc[matchKey].teams.push({
                  id: record.id,
                  team: record.team,
                  alliance: record.alliance,
                  autonomous: record.autonomous,
                  teleop: record.teleop,
                  endAndAfterGame: record.endAndAfterGame
                });
                return acc;
              }, {} as Record<string, GroupedMatchRecord>);

              const sortedRecords = Object.values(groupedRecords)
                .sort((a, b) => a.matchNumber - b.matchNumber);

              setRecords(sortedRecords);
            });
        })
        .catch(err => console.error('Error fetching match records:', err));
    }
  }, [teamNumber, matchType]);

  const renderTeamDetails = (team, matchNumber) => {
    const autoScore = calculateScore(team.autonomous, true);
    const teleopScore = calculateScore(team.teleop, false);
    const endGameScore = calculateEndGameScore(team.endAndAfterGame.stopStatus);
    const totalTeleopScore = teleopScore + endGameScore;
    
    return (
      <div key={team.id} className="border-b last:border-b-0 py-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-semibold">Team {team.team}</h4>
            <span className={`px-3 py-1 rounded-full ${
              team.alliance === 'Red' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {team.alliance}
            </span>
          </div>
          <Button
            color="primary"
            variant="light"
            size="sm"
            onPress={() => {
              setSelectedMatch({ 
                matchNumber, 
                matchType: "",
                teams: []
              });
              setSelectedTeam(team);
              setShowTeamStats(true);
              setShowStats(false);
              setIsModalOpen(true);
            }}
          >
            View Stats
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Auto Score</p>
            <p className="font-medium">{autoScore}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Teleop Score</p>
            <p className="font-medium">{totalTeleopScore}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Game</p>
            <p className="font-medium">{team.endAndAfterGame.stopStatus}</p>
          </div>
        </div>
      </div>
    );
  };

  const toggleMatchExpand = (matchNumber: number) => {
    setExpandedMatches(prev => 
      prev.includes(matchNumber) 
        ? prev.filter(m => m !== matchNumber)
        : [...prev, matchNumber]
    );
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Match Records</h2>
        <div className="space-y-4">
          {(records as GroupedMatchRecord[])
            .filter(match => !teamNumber || match.teams.some(t => t.team === teamNumber))
            .map((match) => (
              <div key={match.matchNumber} className="p-4 border rounded-lg bg-default-50 hover:bg-default-100 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleMatchExpand(match.matchNumber)}
                  >
                    <h3 className="text-lg font-semibold">Match {match.matchNumber}</h3>
                    {expandedMatches.includes(match.matchNumber) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      color="primary"
                      variant="light"
                      onPress={() => {
                        setSelectedMatch(match);
                        setShowStats(true);
                        setIsModalOpen(true);
                      }}
                    >
                      View Stats
                    </Button>
                    <Button 
                      color="primary"
                      variant="light"
                      onPress={() => {
                        setSelectedMatch(match);
                        setShowStats(false);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                
                {/* Collapsible content */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  expandedMatches.includes(match.matchNumber) ? 'max-h-96' : 'max-h-0'
                }`}>
                  {teamNumber ? (
                    // Show only selected team's details
                    match.teams
                      .filter(t => t.team === teamNumber)
                      .map(team => renderTeamDetails(team, match.matchNumber))
                  ) : (
                    // Show all teams grouped by alliance
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-2">Red Alliance</h4>
                        {match.teams
                          .filter(t => t.alliance === 'Red')
                          .map(team => (
                            <div key={team.id} className="text-sm py-1">
                              Team {team.team}
                            </div>
                          ))}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-700 mb-2">Blue Alliance</h4>
                        {match.teams
                          .filter(t => t.alliance === 'Blue')
                          .map(team => (
                            <div key={team.id} className="text-sm py-1">
                              Team {team.team}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMatch(null);
          setShowStats(false);
          setShowTeamStats(false);
          setSelectedTeam(null);
        }}
        size="3xl"
      >
        <ModalContent className="p-0">
          {showStats && selectedMatch ? (
            <MatchStatsModal 
              match={selectedMatch} 
              onClose={() => {
                setShowStats(false);
                setIsModalOpen(false);
              }} 
            />
          ) : showTeamStats && selectedTeam ? (
            <>
              <ModalHeader className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Team {selectedTeam.team} Stats {selectedMatch && `- Match ${selectedMatch.matchNumber}`}
                  </h2>
                  <Button
                    color="primary"
                    variant="light"
                    onPress={() => {
                      setShowTeamStats(false);
                      setIsModalOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody className="py-4 sm:py-6 overflow-y-auto">
                <TeamStatsModal team={selectedTeam} />
              </ModalBody>
            </>
          ) : selectedMatch && selectedMatch.teams ? (
            <>
              <ModalHeader className="border-b pb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Match {selectedMatch.matchNumber} Details
                </h2>
              </ModalHeader>
              <ModalBody className="py-4 sm:py-6 overflow-y-auto">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-red-700">Red Alliance</h3>
                      {selectedMatch.teams
                        .filter(t => t.alliance === 'Red')
                        .map(team => renderTeamDetails(team, selectedMatch.matchNumber))}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-blue-700">Blue Alliance</h3>
                      {selectedMatch.teams
                        .filter(t => t.alliance === 'Blue')
                        .map(team => renderTeamDetails(team, selectedMatch.matchNumber))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </ModalFooter>
            </>
          ) : null}
        </ModalContent>
      </Modal>
    </>
  );
} 
