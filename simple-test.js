// 模拟HeroUI的过滤逻辑
function testFilter() {
  console.log("🧪 测试TeamSelector过滤逻辑");
  
  // 模拟团队数据
  const teams = [
    { number: 5, name: "Team Five" },
    { number: 15, name: "Team Fifteen" },
    { number: 25, name: "Team Twenty-Five" },
    { number: 105, name: "Team One Hundred Five" },
    { number: 123, name: "Team One Two Three" },
    { number: 9999, name: "Fantastic Five" }
  ];
  
  // 测试输入"5"的过滤结果
  console.log("\n📝 输入 '5' 应该显示:");
  teams.forEach(team => {
    const textValue = team.number.toString(); // 关键：只使用编号作为textValue
    const matches = textValue.includes("5");
    const status = matches ? "✅" : "❌";
    console.log(`${status} Team ${team.number} (${team.name})`);
  });
  
  // 测试输入"15"的过滤结果
  console.log("\n📝 输入 '15' 应该显示:");
  teams.forEach(team => {
    const textValue = team.number.toString();
    const matches = textValue.includes("15");
    const status = matches ? "✅" : "❌";
    console.log(`${status} Team ${team.number} (${team.name})`);
  });
  
  console.log("\n🎯 关键修复点:");
  console.log("✅ textValue = team.number.toString()");
  console.log("✅ 只搜索编号，不搜索团队名称");
  console.log("✅ 输入'5'不会显示'Fantastic Five'的Team 9999");
}

testFilter(); 