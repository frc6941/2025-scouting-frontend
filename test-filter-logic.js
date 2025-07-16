// 测试新的过滤逻辑
function customFilter(textValue, inputValue) {
  if (!inputValue.trim()) return true; // 空输入显示所有队伍
  
  // 从textValue中提取团队编号（去掉"Team "前缀）
  const teamNumber = textValue.replace(/^Team\s+/, '').trim();
  
  // 只匹配编号开头或包含输入的数字
  return teamNumber.includes(inputValue.trim());
}

// 测试用例
const testTeams = [
  { textValue: "Team 5", expected: true },
  { textValue: "Team 15", expected: true },
  { textValue: "Team 25", expected: true },
  { textValue: "Team 105", expected: true },
  { textValue: "Team 123", expected: false },
  { textValue: "Team 9999", expected: false }, // 即使名称是"Fantastic Five"
];

console.log("测试输入 '5' 的过滤结果:");
testTeams.forEach(team => {
  const result = customFilter(team.textValue, "5");
  const status = result === team.expected ? "✅" : "❌";
  console.log(`${status} ${team.textValue}: ${result}`);
});

console.log("\n测试输入 '15' 的过滤结果:");
const test15Teams = [
  { textValue: "Team 15", expected: true },
  { textValue: "Team 150", expected: true },
  { textValue: "Team 1510", expected: true },
  { textValue: "Team 5", expected: false },
  { textValue: "Team 25", expected: false },
];

test15Teams.forEach(team => {
  const result = customFilter(team.textValue, "15");
  const status = result === team.expected ? "✅" : "❌";
  console.log(`${status} ${team.textValue}: ${result}`);
});

console.log("\n✅ 过滤逻辑验证完成!"); 