'use client';

import { useState, useEffect } from 'react';
import { Select, SelectItem } from "@heroui/react";

interface Team {
  number: number;
  name?: string;
}

export function TeamSelector({ selectedTeam, onTeamSelect }) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/findAll`)
      .then(res => res.json())
      .then(data => {
        console.log('Teams:', data);
        setTeams(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, []);

  return (
    <Select
      label="Select Team"
      placeholder="Choose a team"
      selectedKeys={selectedTeam ? new Set([selectedTeam.toString()]) : new Set()}
      onSelectionChange={(keys) => onTeamSelect(Number([...keys][0]))}
      className="min-w-[200px]"
    >
      {teams.map((team) => (
        <SelectItem 
          key={team.number.toString()} 
          textValue={team.number.toString()}
        >
          Team {team.number}
        </SelectItem>
      ))}
    </Select>
  );
} 