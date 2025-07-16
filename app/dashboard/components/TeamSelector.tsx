"use client";

import { useState, useEffect, useMemo } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { Spinner } from "@heroui/react";

interface Team {
  number: number;
  name?: string;
}

type Props = {
  selectedTeam: number | null;
  onTeamSelect: (teamNumber: number | null) => void;
};

export function TeamSelector({ selectedTeam, onTeamSelect }: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/findAll`)
      .then((r) => r.json())
      .then((d) => setTeams(Array.isArray(d) ? d : []))
      .catch((e) => console.error("Error fetching teams:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectionChange = (key: React.Key | null) => {
    onTeamSelect(key ? Number(key) : null);
  };

  return (
    <Autocomplete
      className="min-w-[220px]"
      selectedKey={selectedTeam?.toString() ?? null}
      onSelectionChange={handleSelectionChange}
      placeholder="输入队号搜索…"
      label="选择队伍"
      items={teams}
      isLoading={loading}
      allowsCustomValue={false}
      menuTrigger="input"
    >
      {(team) => (
        <AutocompleteItem key={team.number.toString()} textValue={`Team ${team.number}${team.name ? ` - ${team.name}` : ''}`}>
          <div className="flex flex-col">
            <span className="font-medium">Team {team.number}</span>
            {team.name && (
              <span className="text-small text-gray-500">{team.name}</span>
            )}
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
