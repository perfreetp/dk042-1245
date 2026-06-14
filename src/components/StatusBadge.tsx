import { cn } from "@/utils/helpers";
import {
  PROJECT_STATUS_COLORS,
  PROJECT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
  DOCUMENT_STATUS_LABELS,
  MILESTONE_STATUS_COLORS,
  MILESTONE_STATUS_LABELS,
} from "@/utils/constants";

type BadgeType = "project" | "document" | "milestone";

interface StatusBadgeProps {
  type: BadgeType;
  status: string;
  className?: string;
}

export const StatusBadge = ({ type, status, className }: StatusBadgeProps) => {
  const colors =
    type === "project"
      ? PROJECT_STATUS_COLORS
      : type === "document"
      ? DOCUMENT_STATUS_COLORS
      : MILESTONE_STATUS_COLORS;

  const labels =
    type === "project"
      ? PROJECT_STATUS_LABELS
      : type === "document"
      ? DOCUMENT_STATUS_LABELS
      : MILESTONE_STATUS_LABELS;

  return (
    <span className={cn("badge", colors[status], className)}>
      {labels[status] || status}
    </span>
  );
};
