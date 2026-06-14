import { useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { Project } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/utils/helpers";
import { useProjectStore } from "@/store/useProjectStore";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { setCurrentProjectId, getProjectDocuments, getProjectMilestones, getProjectTodos } =
    useProjectStore();

  const documents = getProjectDocuments(project.id);
  const milestones = getProjectMilestones(project.id);
  const todos = getProjectTodos(project.id);

  const docProgress =
    documents.length > 0
      ? Math.round(
          (documents.filter((d) => d.status === "approved").length / documents.length) * 100
        )
      : 0;

  const milestoneProgress =
    milestones.length > 0
      ? Math.round(
          (milestones.filter((m) => m.status === "completed").length / milestones.length) * 100
        )
      : 0;

  const pendingTodos = todos.filter((t) => !t.isCompleted).length;

  const handleClick = () => {
    setCurrentProjectId(project.id);
    navigate(`/projects/${project.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="card card-hover cursor-pointer animate-fade-in-up"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-primary-600" />
              <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
            </div>
            <p className="text-sm text-gray-500 truncate ml-6">{project.clientName}</p>
          </div>
          <StatusBadge type="project" status={project.status} />
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 ml-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(project.constructionStartDate)}
          </span>
          <span className="text-gray-300">|</span>
          <span>{project.projectType}</span>
        </div>

        <div className="space-y-3 ml-6">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 text-gray-500">
                <FileText className="w-3.5 h-3.5" />
                资料完成度
              </span>
              <span className="font-medium text-gray-700">{docProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${docProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                里程碑进度
              </span>
              <span className="font-medium text-gray-700">{milestoneProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            {pendingTodos > 0 ? (
              <span className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-3.5 h-3.5" />
                {pendingTodos} 项待办
              </span>
            ) : (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                无待办事项
              </span>
            )}
            <span className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              更新于 {formatDate(project.updatedAt)}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
