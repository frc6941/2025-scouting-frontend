"use client";

import { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";

interface Team { number: number; name?: string; }
type Props = { selectedTeam: number | null; onTeamSelect: (n: number|null)=>void; };

export function TeamSelector({ selectedTeam, onTeamSelect }: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/findAll`)
      .then((r) => r.json())
      .then((d) => setTeams(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const customFilter = (text: string, input: string) => {
    const q = input.trim();
    if (!q) return true;
    const num = text.replace(/^Team\s+/, "");
    return num.includes(q);
  };

  return (
    <Autocomplete
      className="min-w-[220px]"
      value={selectedTeam?.toString() ?? null}
      onValueChange={(key) => onTeamSelect(key ? Number(key) : null)}
      inputValue={query}
      onInputValueChange={setQuery}
      placeholder="输入队号搜索…"
      defaultItems={teams}
      defaultFilter={customFilter}
      allowsCustomValue={false}
      menuTrigger="input"
      loading={loading}
    >
      {teams.map((team) => (
        <AutocompleteItem
          key={team.number.toString()}
          textValue={`Team ${team.number}`}
        >
          <div className="flex flex-col">
            <span className="font-medium">Team {team.number}</span>
            {team.name && (
              <span className="text-sm text-gray-500">{team.name}</span>
            )}
          </div>
        </AutocompleteItem>
      ))}
      {loading && (
        <div className="flex items-center justify-center py-4" role="status">
          <Spinner size="sm" className="mr-2" />
          加载中…
        </div>
      )}
    </Autocomplete>
  );
}
