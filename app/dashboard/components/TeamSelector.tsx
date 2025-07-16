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

  // 自定义过滤函数，只按团队编号精确搜索
  const customFilter = (textValue: string, inputValue: string) => {
    if (!inputValue.trim()) return true; // 空输入显示所有队伍
    
    // 从textValue中提取团队编号（去掉"Team "前缀）
    const teamNumber = textValue.replace(/^Team\s+/, '').trim();
    
    // 只匹配编号开头或包含输入的数字
    // 例如：输入"5"匹配"5", "15", "25"等，但不匹配名称中的"5"
    return teamNumber.includes(inputValue.trim());
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
      defaultFilter={customFilter}
    >
      {(team) => (
        <AutocompleteItem 
          key={team.number.toString()} 
          textValue={`Team ${team.number}`}
        >
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
