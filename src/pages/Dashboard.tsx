import { useState, useMemo } from "react";
import {
  Plus,
  FolderKanban,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { PROJECT_STATUS_LABELS } from "@/utils/constants";

export const Dashboard = () => {
  const { projects, documents, todos, getProjectDocuments, getProjectMilestones, getProjectTodos } =
    useProjectStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const inProgress = projects.filter((p) => p.status === "in_progress").length;
    const pendingDocs = documents.filter((d) => d.status === "pending" || d.isMissing).length;
    const pendingTodos = todos.filter((t) => !t.isCompleted).length;
    const totalReduction = projects.reduce((sum, p) => {
      const calcs = useProjectStore.getState().getProjectCalculations(p.id);
      return sum + calcs.reduce((s, c) => s + c.reductionAmount, 0);
    }, 0);
    return { totalProjects, inProgress, pendingDocs, pendingTodos, totalReduction };
  }, [projects, documents, todos, getProjectDocuments, getProjectMilestones, getProjectTodos]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projects, statusFilter, searchQuery]);

  const statCards = [
    {
      label: "项目总数",
      value: stats.totalProjects,
      icon: FolderKanban,
      gradient: "from-primary-500 to-primary-700",
      bg: "bg-primary-50",
      iconBg: "bg-primary-100",
      iconColor: "text-primary-700",
    },
    {
      label: "进行中项目",
      value: stats.inProgress,
      icon: Clock,
      gradient: "from-blue-500 to-blue-700",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      label: "待处理资料",
      value: stats.pendingDocs,
      icon: AlertTriangle,
      gradient: "from-accent-500 to-accent-700",
      bg: "bg-accent-50",
      iconBg: "bg-accent-100",
      iconColor: "text-accent-700",
    },
    {
      label: "待办事项",
      value: stats.pendingTodos,
      icon: CheckCircle2,
      gradient: "from-rose-500 to-rose-700",
      bg: "bg-rose-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-700",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="card p-5 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                {stat.label === "项目总数" && (
                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    累计减排 {Math.round(stats.totalReduction).toLocaleString()} tCO₂e
                  </div>
                )}
              </div>
              <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">我的项目</h2>
          <p className="text-sm text-gray-500 mt-0.5">共 {filteredProjects.length} 个项目</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 appearance-none cursor-pointer"
            >
              <option value="all">全部状态</option>
              {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="搜索项目名称或客户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          />

          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新建项目
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            style={{ animationDelay: `${index * 30}ms` }}
            className="animate-fade-in-up"
          >
            <ProjectCard project={project} />
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-2 card p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <FolderKanban className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无项目</h3>
            <p className="text-sm text-gray-500 mb-5">点击下方按钮创建第一个碳减排项目</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              创建项目
            </button>
          </div>
        )}
      </div>

      {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
};
