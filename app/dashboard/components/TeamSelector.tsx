"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteList,
  AutocompleteItem,
} from "@heroui/react";
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
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/findAll`)
      .then((r) => r.json())
      .then((d) => setTeams(Array.isArray(d) ? d : []))
      .catch((e) => console.error("Error fetching teams:", e))
      .finally(() => setLoading(false));
  }, []);

  const filteredTeams = useMemo(() => {
    if (!query.trim()) return teams;
    return teams.filter((t) =>
      t.number.toString().includes(query.trim())
    );
  }, [teams, query]);

  return (
    <Autocomplete
      id="team-autocomplete"
      className="min-w-[220px]"
      value={selectedTeam?.toString() ?? null}
      onValueChange={(key) => onTeamSelect(key ? Number(key) : null)}
      inputValue={query}
      onInputValueChange={setQuery}
      placeholder="输入队号搜索…"
      aria-labelledby="team-autocomplete"
    >
      <AutocompleteInput />

      <AutocompleteList>
        {loading ? (
          <div className="flex items-center justify-center py-4" role="status">
            <Spinner size="sm" className="mr-2" />
            加载中…
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="py-2 px-4 text-sm text-gray-500">无匹配队伍</div>
        ) : (
          filteredTeams.map((team) => (
            <AutocompleteItem key={team.number.toString()}>
              <span className="font-medium">Team {team.number}</span>
              {team.name && (
                <span className="ml-2 text-gray-500">{team.name}</span>
              )}
            </AutocompleteItem>
          ))
        )}
      </AutocompleteList>
    </Autocomplete>
  );
}
