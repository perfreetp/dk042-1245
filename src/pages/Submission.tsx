import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  FileText,
  FolderTree,
  BarChart2,
  AlertTriangle,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  Leaf,
  Flag,
  MessageSquare,
  CheckSquare,
  Users,
  MessageCircle,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { ProgressRing } from "@/components/ProgressRing";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DOCUMENT_CATEGORY_LABELS,
  MILESTONE_STAGE_LABELS,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { useState } from "react";
import type { DocumentCategory } from "@/types";

export const Submission = () => {
  const { id } = useParams();
  const {
    getCurrentProject,
    getProjectDocuments,
    getProjectCalculations,
    getProjectMilestones,
    getProjectTodos,
    getProjectCommunications,
  } = useProjectStore();

  const project = getCurrentProject();
  const documents = id ? getProjectDocuments(id) : [];
  const calculations = id ? getProjectCalculations(id) : [];
  const milestones = id ? getProjectMilestones(id) : [];
  const todos = id ? getProjectTodos(id) : [];
  const communications = id ? getProjectCommunications(id) : [];

  const [expandedCategories, setExpandedCategories] = useState<Set<DocumentCategory>>(
    new Set(["contract", "invoice", "monitoring", "photo"])
  );

  const toggleCategory = (cat: DocumentCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const metrics = useMemo(() => {
    const totalDocs = documents.length;
    const approvedDocs = documents.filter((d) => d.status === "approved").length;
    const missingDocs = documents.filter((d) => d.isMissing).length;
    const rejectedDocs = documents.filter((d) => d.status === "rejected").length;

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m) => m.status === "completed").length;

    const docProgress = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;
    const milestoneProgress =
      totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    const overallProgress = Math.round((docProgress + milestoneProgress) / 2);

    const pendingTodos = todos.filter((t) => !t.isCompleted).length;
    const issues = [
      ...documents.filter((d) => d.isMissing || d.status === "rejected").map((d) => ({
        type: "资料问题",
        content: d.reviewComment || `${d.name}${d.isMissing ? "：资料缺失" : "：审核未通过"}`,
      })),
      ...todos.filter((t) => !t.isCompleted).map((t) => ({
        type: "待办事项",
        content: t.title,
      })),
    ];

    const totalReduction = calculations.reduce((sum, c) => sum + c.reductionAmount, 0);

    return {
      totalDocs,
      approvedDocs,
      missingDocs,
      rejectedDocs,
      totalMilestones,
      completedMilestones,
      docProgress,
      milestoneProgress,
      overallProgress,
      pendingTodos,
      issues,
      totalReduction,
    };
  }, [documents, milestones, todos, calculations]);

  const categories: DocumentCategory[] = ["contract", "invoice", "monitoring", "photo"];

  if (!project) {
    return <div className="text-center py-20 text-gray-500">项目不存在</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">申报材料汇总</h2>
              <p className="text-sm text-gray-500 mt-0.5">{project.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Printer className="w-4 h-4" />
              打印报告
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出申报包
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <ProgressRing
              progress={metrics.overallProgress}
              size={110}
              strokeWidth={10}
              color="#0F766E"
              label={`${metrics.overallProgress}%`}
              sublabel="总体完成度"
            />
          </div>
          <div className="text-center">
            <ProgressRing
              progress={metrics.docProgress}
              size={110}
              strokeWidth={10}
              color="#3B82F6"
              label={`${metrics.docProgress}%`}
              sublabel="资料完整度"
            />
          </div>
          <div className="text-center">
            <ProgressRing
              progress={metrics.milestoneProgress}
              size={110}
              strokeWidth={10}
              color="#D97706"
              label={`${metrics.milestoneProgress}%`}
              sublabel="里程碑进度"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-center">
              <Leaf className="w-5 h-5 text-primary-600 mx-auto mb-1" />
              <div className="text-3xl font-bold text-primary-700">
                {Math.round(metrics.totalReduction).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">累计减排 (tCO₂e)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="card">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">申报材料目录</h3>
              <span className="badge bg-blue-100 text-blue-700">
                {metrics.approvedDocs}/{metrics.totalDocs} 已通过
              </span>
            </div>
            <div className="p-5">
              <div className="space-y-1">
                {categories.map((cat) => {
                  const catDocs = documents.filter((d) => d.category === cat);
                  const approvedCount = catDocs.filter((d) => d.status === "approved").length;
                  const expanded = expandedCategories.has(cat);

                  return (
                    <div key={cat}>
                      <div
                        onClick={() => toggleCategory(cat)}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        {expanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                        <Folder className="w-4 h-4 text-accent-500" />
                        <span className="font-medium text-gray-800 flex-1">
                          {DOCUMENT_CATEGORY_LABELS[cat]}
                        </span>
                        <span className="text-xs text-gray-500">
                          {approvedCount}/{catDocs.length}
                        </span>
                      </div>
                      {expanded && (
                        <div className="ml-9 space-y-0.5 mb-2">
                          {catDocs.length === 0 ? (
                            <div className="text-xs text-gray-400 py-1.5 px-3">暂无资料</div>
                          ) : (
                            catDocs.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center gap-2 py-1.5 px-3 rounded hover:bg-gray-50"
                              >
                                <File
                                  className={`w-3.5 h-3.5 ${
                                    doc.status === "approved"
                                      ? "text-green-500"
                                      : doc.status === "rejected"
                                      ? "text-red-500"
                                      : "text-gray-400"
                                  }`}
                                />
                                <span
                                  className={`text-sm flex-1 ${
                                    doc.isMissing ? "text-orange-600" : "text-gray-700"
                                  }`}
                                >
                                  {doc.name}
                                  {doc.isMissing && (
                                    <span className="ml-1 text-xs text-orange-500">(缺失)</span>
                                  )}
                                </span>
                                <StatusBadge type="document" status={doc.status} className="scale-90" />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">项目进度报告</h3>
            </div>
            <div className="p-5 space-y-6">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-accent-500" />
                  里程碑进度
                </div>
                <div className="space-y-2">
                  {(["initiation", "monitoring", "verification", "issuance"] as const).map(
                    (stage) => {
                      const stageMs = milestones.filter((m) => m.stage === stage);
                      const completed = stageMs.filter((m) => m.status === "completed").length;
                      const total = stageMs.length;
                      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                      return (
                        <div key={stage}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">{MILESTONE_STAGE_LABELS[stage]}</span>
                            <span className="text-gray-500">
                              {completed}/{total} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  沟通统计
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "会议", icon: Users, count: communications.filter((c) => c.type === "meeting").length, color: "bg-blue-50 text-blue-700" },
                    { label: "电话", icon: Clock, count: communications.filter((c) => c.type === "phone").length, color: "bg-green-50 text-green-700" },
                    { label: "邮件", icon: FileText, count: communications.filter((c) => c.type === "email").length, color: "bg-purple-50 text-purple-700" },
                    { label: "微信", icon: MessageCircle, count: communications.filter((c) => c.type === "wechat").length, color: "bg-primary-50 text-primary-700" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-xl p-3 text-center ${item.color}`}>
                      <item.icon className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-lg font-bold">{item.count}</div>
                      <div className="text-xs opacity-75">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary-500" />
                  减排量测算
                </div>
                <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">累计测算减排量</div>
                      <div className="text-2xl font-bold text-primary-700">
                        {Math.round(metrics.totalReduction).toLocaleString()} tCO₂e
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">测算版本数</div>
                      <div className="text-2xl font-bold text-gray-700">{calculations.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">问题清单</h3>
            <span className="badge bg-red-100 text-red-700">{metrics.issues.length}</span>
          </div>
          <div className="p-5 max-h-[700px] overflow-y-auto">
            {metrics.issues.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <p className="text-gray-500 text-sm">暂无待处理问题</p>
                <p className="text-gray-400 text-xs mt-1">项目进展顺利！</p>
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="bg-red-50/50 rounded-xl p-4 border border-red-100 animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        {issue.type === "资料问题" ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-red-700">
                            {issue.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{issue.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <CheckCircle2 className="w-5 h-5 mx-auto text-green-500 mb-1" />
                  <div className="text-lg font-bold text-gray-900">{metrics.approvedDocs}</div>
                  <div className="text-xs text-gray-500">资料已通过</div>
                </div>
                <div>
                  <Clock className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
                  <div className="text-lg font-bold text-gray-900">{metrics.pendingTodos}</div>
                  <div className="text-xs text-gray-500">待办事项</div>
                </div>
                <div>
                  <AlertTriangle className="w-5 h-5 mx-auto text-red-500 mb-1" />
                  <div className="text-lg font-bold text-gray-900">
                    {metrics.missingDocs + metrics.rejectedDocs}
                  </div>
                  <div className="text-xs text-gray-500">问题资料</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
