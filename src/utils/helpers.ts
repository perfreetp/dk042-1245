export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
};

export const formatDate = (date: string): string => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateTime = (date: string): string => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const today = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const calculateReduction = (
  baselineEnergy: number,
  baselineFactor: number,
  monitoredEnergy: number,
  monitoredFactor: number
): number => {
  const baselineEmission = baselineEnergy * baselineFactor;
  const monitoredEmission = monitoredEnergy * monitoredFactor;
  return Math.round((baselineEmission - monitoredEmission) * 100) / 100;
};

export const cn = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

export const getInitials = (name: string): string => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};
