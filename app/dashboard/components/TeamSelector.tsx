"use client";

import React, { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface Team {
  number: number;
  name?: string;
}

type Props = {
  selectedTeam: number | null;
  onTeamSelect: (n: number | null) => void;
};

export function TeamSelector({ selectedTeam, onTeamSelect }: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/findAll`)
      .then((r) => r.json())
      .then((d) => setTeams(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onSelectionChange = (key: React.Key | null) => {
    onTeamSelect(key ? Number(key) : null);
  };

  const onInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <Autocomplete
      className="min-w-[220px]"
      defaultItems={teams}
      label="选择队伍"
      placeholder="输入队号搜索…"
      allowsCustomValue={false}
      onInputChange={onInputChange}
      onSelectionChange={onSelectionChange}
      isLoading={loading}
    >
      {(team) => (
        <AutocompleteItem key={team.number.toString()} textValue={team.number.toString()}>
          <div className="flex flex-col">
              <span className="font-medium">Team {team.number}</span>
              {team.name && (
              <span className="text-sm text-gray-500">{team.name}</span>
              )}
          </div>
            </AutocompleteItem>
        )}
    </Autocomplete>
  );
}
