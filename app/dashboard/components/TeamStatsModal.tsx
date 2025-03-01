import { calculateScore, calculateEndGameScore } from '@/app/lib/utils';

export function TeamStatsModal({ team }) {
  const autoScore = calculateScore(team.autonomous, true);
  const teleopScore = calculateScore(team.teleop, false);
  const endGameScore = calculateEndGameScore(team.endAndAfterGame.stopStatus);
  const totalTeleopScore = teleopScore + endGameScore;

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