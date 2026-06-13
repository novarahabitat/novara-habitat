export function getPermissionRegistry() {
  return [
    {
      role: "Super Admin",
      level: 100,
      access: "FULL",
    },
    {
      role: "Brain",
      level: 95,
      access: "ANALYZE_PROPOSE",
    },
    {
      role: "Admin",
      level: 80,
      access: "MANAGE",
    },
    {
      role: "Sales",
      level: 60,
      access: "COMMERCIAL",
    },
    {
      role: "Employee",
      level: 40,
      access: "FIELD",
    },
    {
      role: "Client",
      level: 10,
      access: "VIEW",
    },
  ];
}
