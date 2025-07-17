'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';
import { toast } from "@/hooks/use-toast";
import { getCookie } from 'cookies-next/client';

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
    leftStartingZone: boolean;
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
    rankingPoint: number;
    coopPoint: boolean;
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

// Fix scrolling issues in the MatchStatsModal component
function MatchStatsModal({ match, onClose }) {
  const stats = calculateMatchStats(match.teams);
  
  return (
    <div className="flex flex-col h-full">
      <ModalHeader className="border-b pb-4 sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">
            Match {match.matchNumber} Statistics
          </h2>
          <Button color="primary" variant="light" size="sm" onPress={onClose}>
            Close
          </Button>
        </div>
      </ModalHeader>
      
      <ModalBody className="py-4 overflow-y-auto flex-grow">
        <div className="space-y-6">
          {/* Overall Scores */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Overall Scores</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-default-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg Auto Score</p>
                <p className="text-xl font-bold">{stats.avgAutoScore.toFixed(1)}</p>
              </div>
              <div className="bg-default-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg Teleop Score</p>
                <p className="text-xl font-bold">{stats.avgTeleopScore.toFixed(1)}</p>
              </div>
              <div className="bg-default-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Auto Score</p>
                <p className="text-xl font-bold">{stats.totalAutoScore}</p>
              </div>
              <div className="bg-default-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Teleop Score</p>
                <p className="text-xl font-bold">{stats.totalTeleopScore}</p>
              </div>
            </div>
          </div>
          
          {/* Climb Success Rate */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Climb Success Rate</h3>
            <div className="bg-default-50 p-4 rounded-lg">
              <p className="text-xl font-bold">{stats.climbSuccessRate.toFixed(1)}%</p>
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
    </div>
  );
}

// Update the TeamStatsModal component to include team number and match number fields
function TeamStatsModal({ team, matchNumber, onDelete }) {
  const autoScore = calculateScore(team.autonomous, true);
  const teleopScore = calculateScore(team.teleop, false);
  const endGameScore = calculateEndGameScore(team.endAndAfterGame.stopStatus);
  const totalTeleopScore = teleopScore + endGameScore;
  
  // Add state for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState({...team});
  
  // Add state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMatchNumber, setDeleteMatchNumber] = useState("");
  
  // Handle field changes
  const handleChange = (section, field, value) => {
    setEditedTeam(prev => {
      if (section === 'root') {
        return { ...prev, [field]: value };
      } else if (section === 'autonomous') {
        return {
          ...prev,
          autonomous: {
            ...prev.autonomous,
            [field]: value
          }
        };
      } else if (section === 'teleop') {
        return {
          ...prev,
          teleop: {
            ...prev.teleop,
            [field]: value
          }
        };
      } else if (section === 'endAndAfterGame') {
        return {
          ...prev,
          endAndAfterGame: {
            ...prev.endAndAfterGame,
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
  };
  
  // Handle nested field changes (for coral and algae counts)
  const handleNestedChange = (section, subsection, field, value) => {
    setEditedTeam(prev => {
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [field]: value
          }
        }
      };
    });
  };
  
  // Handle save/update
  const handleSave = async () => {
    console.log(editedTeam);
    try {
      // Check if API URL is defined
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (!apiUrl) {
        console.error("API URL is not defined");
        toast({
          title: "Configuration Error",
          description: "API URL is not configured. Please check your environment variables.",
          variant: "destructive"
        });
        return;
      }
      
      const response = await fetch(`${apiUrl}/scouting/update/${editedTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('Authorization')}`
        },
        body: JSON.stringify(editedTeam)
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Record updated successfully",
          variant: "default"
        });
        setIsEditing(false);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update record",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating record:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the API server. Please check if the server is running.",
        variant: "destructive"
      });
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteMatchNumber !== matchNumber.toString()) {
      toast({
        title: "Error",
        description: "Match number does not match. Please enter the correct match number.",
        variant: "destructive"
      });
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (!apiUrl) {
        toast({
          title: "Configuration Error",
          description: "API URL is not configured.",
          variant: "destructive"
        });
        return;
      }
      
      const response = await fetch(`${apiUrl}/scouting/delete/${team.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getCookie('Authorization')}`
        }
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Record deleted successfully",
          variant: "default"
        });
        setShowDeleteModal(false);
        setDeleteMatchNumber("");
        if (onDelete) {
          onDelete();
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete record",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the API server.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
    <div className="overflow-y-auto">
        {/* Add Edit/Save/Delete buttons at the top */}
        <div className="flex justify-end mb-4 sticky top-0 bg-white dark:bg-zinc-900 z-10 py-2 gap-2">
        {isEditing ? (
          <>
            <Button 
              color="success" 
              size="sm" 
              onPress={handleSave}
            >
              Save
            </Button>
            <Button 
              color="danger" 
              size="sm"
              onPress={() => {
                setIsEditing(false);
                setEditedTeam({...team}); // Reset to original
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
            <>
              <Button 
                color="danger" 
                size="sm"
                variant="light"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
          <Button 
            color="primary" 
            size="sm"
            onPress={() => setIsEditing(true)}
          >
            Edit
          </Button>
            </>
        )}
      </div>
      
      {/* Team Number and Match Number fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-default-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Team Number</span>
            {isEditing ? (
              <input
                type="number"
                value={editedTeam.team}
                onChange={(e) => handleChange('root', 'team', parseInt(e.target.value) || 0)}
                className="w-24 p-1 border rounded"
              />
            ) : (
              <span className="font-medium">{team.team}</span>
            )}
          </div>
        </div>
        <div className="bg-default-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Match Number</span>
            {isEditing ? (
              <input
                type="number"
                value={editedTeam.matchNumber}
                onChange={(e) => handleChange('root', 'matchNumber', parseInt(e.target.value) || 0)}
                className="w-24 p-1 border rounded"
              />
            ) : (
              <span className="font-medium">{team.matchNumber}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Auto Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Autonomous</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Coral Counts</h4>
            <div className="space-y-2">
              {Object.entries(isEditing ? editedTeam.autonomous.coralCount : team.autonomous.coralCount).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={count as number}
                      onChange={(e) => handleNestedChange('autonomous', 'coralCount', level, parseInt(e.target.value) || 0)}
                      className="w-16 p-1 border rounded"
                    />
                  ) : (
                    <span className="font-medium">{count as number}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Algae Counts</h4>
            <div className="space-y-2">
              {Object.entries(isEditing ? editedTeam.autonomous.algaeCount : team.autonomous.algaeCount).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={count as number}
                      onChange={(e) => handleNestedChange('autonomous', 'algaeCount', type, parseInt(e.target.value) || 0)}
                      className="w-16 p-1 border rounded"
                    />
                  ) : (
                    <span className="font-medium">{count as number}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="bg-default-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Auto Start Position</span>
              {isEditing ? (
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={editedTeam.autonomous.autoStart}
                  onChange={(e) => handleChange('autonomous', 'autoStart', parseInt(e.target.value) || 1)}
                  className="w-16 p-1 border rounded"
                />
              ) : (
                <span className="font-medium">{team.autonomous.autoStart}</span>
              )}
            </div>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Left Starting Zone</span>
              {isEditing ? (
                <input
                  type="checkbox"
                  checked={editedTeam.autonomous.leftStartingZone}
                  onChange={(e) => handleChange('autonomous', 'leftStartingZone', e.target.checked)}
                  className="h-5 w-5"
                />
              ) : (
                <span className="font-medium">{team.autonomous.leftStartingZone ? "Yes (+3 pts)" : "No"}</span>
              )}
            </div>
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
              {Object.entries(isEditing ? editedTeam.teleop.coralCount : team.teleop.coralCount).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="capitalize">{level.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={count as number}
                      onChange={(e) => handleNestedChange('teleop', 'coralCount', level, parseInt(e.target.value) || 0)}
                      className="w-16 p-1 border rounded"
                    />
                  ) : (
                    <span className="font-medium">{count as number}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-2">Algae Counts</h4>
            <div className="space-y-2">
              {Object.entries(isEditing ? editedTeam.teleop.algaeCount : team.teleop.algaeCount).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={count as number}
                      onChange={(e) => handleNestedChange('teleop', 'algaeCount', type, parseInt(e.target.value) || 0)}
                      className="w-16 p-1 border rounded"
                    />
                  ) : (
                    <span className="font-medium">{count as number}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* End Game Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-3">End Game</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-default-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Stop Status</span>
              {isEditing ? (
                <select
                  value={editedTeam.endAndAfterGame.stopStatus}
                  onChange={(e) => handleChange('endAndAfterGame', 'stopStatus', e.target.value)}
                  className="p-1 border rounded"
                >
                    <option value="NONE">None</option>
                    <option value="SHALLOW">Shallow</option>
                    <option value="DEEP">Deep</option>
                </select>
              ) : (
                  <span className="font-medium">{team.endAndAfterGame.stopStatus}</span>
              )}
            </div>
          </div>
          <div className="bg-default-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <span>Ranking Point</span>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  value={editedTeam.endAndAfterGame.rankingPoint || 0}
                  onChange={(e) => handleChange('endAndAfterGame', 'rankingPoint', parseInt(e.target.value) || 0)}
                  className="w-16 p-1 border rounded"
                />
              ) : (
                <span className="font-medium">{team.endAndAfterGame.rankingPoint || 0}</span>
              )}
            </div>
          </div>
          </div>
          <div className="mt-2">
          <div className="bg-default-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>Coop Point</span>
              {isEditing ? (
                <input
                  type="checkbox"
                  checked={editedTeam.endAndAfterGame.coopPoint}
                  onChange={(e) => handleChange('endAndAfterGame', 'coopPoint', e.target.checked)}
                  className="h-5 w-5"
                />
              ) : (
                <span className="font-medium">{team.endAndAfterGame.coopPoint ? "Yes" : "No"}</span>
              )}
            </div>
          </div>
        </div>
          <div className="mt-2">
        <div className="bg-default-50 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="mb-2">Comments</span>
          {isEditing ? (
            <textarea
              value={editedTeam.endAndAfterGame.comments || ""}
              onChange={(e) => handleChange('endAndAfterGame', 'comments', e.target.value)}
                    className="w-full p-2 border rounded min-h-[80px]"
                    placeholder="Enter comments..."
            />
          ) : (
                  <span className="font-medium">{team.endAndAfterGame.comments || "No comments"}</span>
          )}
        </div>
      </div>
    </div>
        </div>
        
        {/* Score Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Score Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-default-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Auto Score</p>
              <p className="text-xl font-bold">{autoScore}</p>
            </div>
            <div className="bg-default-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Teleop Score</p>
              <p className="text-xl font-bold">{totalTeleopScore}</p>
            </div>
            <div className="bg-default-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Score</p>
              <p className="text-xl font-bold">{autoScore + totalTeleopScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="sm">
        <ModalContent className="max-w-md mx-auto">
          <ModalHeader className="text-center">Confirm Delete</ModalHeader>
          <ModalBody className="text-center">
            <p className="mb-4">
              Are you sure you want to delete this record for Team {team.team} in Match {matchNumber}?
            </p>
            <p className="mb-4 text-sm text-gray-600">
              This action cannot be undone. Please enter the match number to confirm.
            </p>
            <div className="flex justify-center">
              <Input
                type="number"
                label="Match Number"
                placeholder={`Enter ${matchNumber} to confirm`}
                value={deleteMatchNumber}
                onChange={(e) => setDeleteMatchNumber(e.target.value)}
                className="max-w-32"
              />
            </div>
          </ModalBody>
          <ModalFooter className="justify-center gap-2">
            <Button color="danger" size="sm" onPress={handleDeleteConfirm}>
              Delete
            </Button>
            <Button color="default" size="sm" onPress={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// Add this helper function to calculate alliance total score
const calculateAllianceScore = (teams) => {
  return teams.reduce((total, team) => {
    const autoScore = calculateScore(team.autonomous, true);
    const teleopScore = calculateScore(team.teleop, false);
    const endGameScore = calculateEndGameScore(team.endAndAfterGame.stopStatus);
    return total + autoScore + teleopScore + endGameScore;
  }, 0);
};

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
    const leftZonePoints = team.autonomous.leftStartingZone ? 3 : 0;
    
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
              setSelectedTeam({
                ...team,
                matchNumber: matchNumber
              });
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
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Left Zone</p>
            <p className="font-medium">{team.autonomous.leftStartingZone ? "Yes (+3 pts)" : "No"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ranking Pts</p>
            <p className="font-medium">{team.endAndAfterGame.rankingPoint || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Coop Point</p>
            <p className="font-medium">{team.endAndAfterGame.coopPoint ? "Yes" : "No"}</p>
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
              <div key={match.matchNumber} className="p-3 border rounded-lg bg-default-50 hover:bg-default-100 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <div className="flex items-center gap-2 cursor-pointer mb-2 sm:mb-0" onClick={() => toggleMatchExpand(match.matchNumber)}>
                    <h3 className="text-lg font-semibold">Match {match.matchNumber}</h3>
                    {expandedMatches.includes(match.matchNumber) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex flex-row justify-between items-center gap-2 flex-wrap">
                    {/* Compact alliance score display */}
                    <div className="flex items-center">
                      <div className="flex items-center text-xs bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded-md">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-0.5"></div>
                        <span className="font-medium">{calculateAllianceScore(match.teams.filter(t => t.alliance === 'Red'))}</span>
                      </div>
                      <span className="text-gray-500 mx-0.5">vs</span>
                      <div className="flex items-center text-xs bg-blue-100 dark:bg-blue-900/30 px-1 py-0.5 rounded-md">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-0.5"></div>
                        <span className="font-medium">{calculateAllianceScore(match.teams.filter(t => t.alliance === 'Blue'))}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        color="primary"
                        variant="light"
                        size="sm"
                        className="px-2 py-1 text-xs"
                        onPress={() => {
                          setSelectedMatch(match);
                          setShowStats(true);
                          setIsModalOpen(true);
                        }}
                      >
                        Stats
                      </Button>
                      <Button 
                        color="primary"
                        variant="light"
                        size="sm"
                        className="px-2 py-1 text-xs"
                        onPress={() => {
                          setSelectedMatch(match);
                          setShowStats(false);
                          setIsModalOpen(true);
                        }}
                      >
                        Details
                      </Button>
                    </div>
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
        size="full" 
        scrollBehavior="inside"
        className="sm:!max-w-3xl"
      >
        <ModalContent className="p-0 h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col">
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
              <ModalHeader className="border-b pb-4 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    Team {selectedTeam.team} Stats {selectedTeam.matchNumber && `- Match ${selectedTeam.matchNumber}`}
                  </h2>
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    onPress={() => {
                      setShowTeamStats(false);
                      setIsModalOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody className="py-4 overflow-y-auto flex-grow">
                <TeamStatsModal 
                  team={selectedTeam} 
                  matchNumber={selectedTeam.matchNumber} 
                  onDelete={() => {
                    setSelectedTeam(null);
                    setShowTeamStats(false);
                    setIsModalOpen(false);
                    // Refresh the data
                    window.location.reload();
                  }} 
                />
              </ModalBody>
            </>
          ) : selectedMatch && selectedMatch.teams ? (
            <>
              <ModalHeader className="border-b pb-4 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-bold">
                    Match {selectedMatch.matchNumber} Details
                  </h2>
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    onPress={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody className="py-4 overflow-y-auto flex-grow">
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
            </>
          ) : null}
        </ModalContent>
      </Modal>
    </>
  );
} 
