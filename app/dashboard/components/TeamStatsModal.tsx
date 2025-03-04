import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

export function TeamStatsModal({ team }) {
  const autoScore = calculateScore(team.autonomous, true);
  const teleopScore = calculateScore(team.teleop, false);
  const endGameScore = calculateEndGameScore(team.endAndAfterGame.stopStatus);
  const totalTeleopScore = teleopScore + endGameScore;
  const leftZonePoints = team.autonomous.leftStartingZone ? 3 : 0;

  return (
    <div className="space-y-6">
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
          <p className="text-sm text-gray-600">Total Score</p>
          <p className="font-medium">{autoScore + totalTeleopScore}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-default-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Auto Movement</p>
          <p className="font-medium">{team.endAndAfterGame.autonomousMove ? "Yes" : "No"}</p>
        </div>
        <div className="bg-default-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Teleop Movement</p>
          <p className="font-medium">{team.endAndAfterGame.teleopMove ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-default-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">End Game</p>
          <p className="font-medium">{team.endAndAfterGame.stopStatus || "None"}</p>
        </div>
        <div className="bg-default-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Climbing Time</p>
          <p className="font-medium">{team.endAndAfterGame.climbingTime || "N/A"} sec</p>
        </div>
        <div className="bg-default-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Left Starting Zone</p>
          <p className="font-medium">{team.autonomous.leftStartingZone ? `Yes (+3 pts)` : "No"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-default-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Ranking Points</p>
          <p className="font-medium">{team.endAndAfterGame.rankingPoint || 0}</p>
        </div>
        <div className="bg-default-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Coop Point</p>
          <p className="font-medium">{team.endAndAfterGame.coopPoint ? "Yes" : "No"}</p>
        </div>
      </div>

      {team.endAndAfterGame.comments && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Comments</p>
          <p className="whitespace-pre-wrap bg-default-50 p-4 rounded-lg">
            {team.endAndAfterGame.comments}
          </p>
        </div>
      )}
    </div>
  );
} 