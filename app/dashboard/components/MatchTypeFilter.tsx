'use client';

import { Select, SelectItem } from "@heroui/react";

export enum MatchType {
  QUAL = 'Qualification',
  PRAC = 'Practice',
  MATCH = 'Match',
  FINAL = 'Final',
}

export function MatchTypeFilter({ selectedType, onTypeSelect }) {
  return (
    <Select
      label="Match Type"
      placeholder="Filter by match type"
      selectedKeys={selectedType ? new Set([selectedType]) : new Set()}
      onSelectionChange={(keys) => {
        const selected = [...keys][0];
        onTypeSelect(selected || null);
      }}
      className="min-w-[200px]"
    >
      {Object.entries(MatchType).map(([key, value]) => (
        <SelectItem key={value}>{value}</SelectItem>
      ))}
    </Select>
  );
} 