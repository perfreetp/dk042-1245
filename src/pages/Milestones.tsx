import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Flag,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Plus,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { StatusBadge } from "@/components/StatusBadge";
import {
  MILESTONE_STAGE_LABELS,
  MILESTONE_STATUS_LABELS,
} from "@/utils/constants";
import { formatDate, today } from "@/utils/helpers";
import type { MilestoneStatus, MilestoneStage, Milestone } from "@/types";

const stageOrder: MilestoneStage[] = ["initiation", "monitoring", "verification", "issuance"];

const stageConfig: Record<MilestoneStage, { color: string; bgColor: string; iconColor: string }> = {
  initiation: { color: "text-blue-700", bgColor: "bg-blue-100", iconColor: "text-blue-500" },
  monitoring: { color: "text-purple-700", bgColor: "bg-purple-100", iconColor: "text-purple-500" },
  verification: { color: "text-accent-700", bgColor: "bg-accent-100", iconColor: "text-accent-500" },
  issuance: { color: "text-primary-700", bgColor: "bg-primary-100", iconColor: "text-primary-500" },
};

export const Milestones = () => {
  const { id } = useParams();
  const { getProjectMilestones, addMilestone, updateMilestone } = useProjectStore();
  const milestones = id ? getProjectMilestones(id) : [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    stage: "initiation" as MilestoneStage,
    plannedDate: today(),
    actualDate: "",
    status: "not_started" as MilestoneStatus,
    assignee: "",
    remark: "",
  });

  const handleResetForm = () => {
    setFormData({
      name: "",
      stage: "initiation",
      plannedDate: today(),
      actualDate: "",
      status: "not_started",
      assignee: "",
      remark: "",
    });
  };

  const handleAdd = () => {
    if (!id || !formData.name.trim()) return;
    addMilestone({
      projectId: id,
      ...formData,
    });
    setShowAddForm(false);
    handleResetForm();
  };

  const startEdit = (ms: Milestone) => {
    setEditingId(ms.id);
    setFormData({
      name: ms.name,
      stage: ms.stage,
      plannedDate: ms.plannedDate,
      actualDate: ms.actualDate || "",
      status: ms.status,
      assignee: ms.assignee,
      remark: ms.remark || "",
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    updateMilestone(editingId, formData);
    setEditingId(null);
    handleResetForm();
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    handleResetForm();
  };

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "delayed":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const sortedMilestones = [...milestones].sort((a, b) => {
    const stageA = stageOrder.indexOf(a.stage);
    const stageB = stageOrder.indexOf(b.stage);
    if (stageA !== stageB) return stageA - stageB;
    return a.plannedDate.localeCompare(b.plannedDate);
  });

  const groupedMilestones = stageOrder.map((stage) => ({
    stage,
    items: sortedMilestones.filter((m) => m.stage === stage),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="section-title mb-1">项目里程碑</h3>
            <p className="text-sm text-gray-500">
              已完成 {completedCount} / {milestones.length} 个节点
            </p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              handleResetForm();
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加里程碑
          </button>
        </div>

        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative">
          {groupedMilestones.map((group, gIndex) => (
            <div key={group.stage} className="mb-8 last:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg ${stageConfig[group.stage].bgColor} flex items-center justify-center`}
                >
                  <Flag className={`w-4 h-4 ${stageConfig[group.stage].iconColor}`} />
                </div>
                <h4 className={`font-semibold ${stageConfig[group.stage].color}`}>
                  {MILESTONE_STAGE_LABELS[group.stage]}阶段
                </h4>
                <span className="text-xs text-gray-400">
                  {group.items.length} 个节点
                </span>
              </div>

              <div className="relative ml-4 pl-8 border-l-2 border-gray-100 last:border-l-0">
                {group.items.map((ms, index) => {
                  const config = stageConfig[ms.stage];
                  const isEditing = editingId === ms.id;

                  return (
                    <div
                      key={ms.id}
                      className="relative pb-6 last:pb-0 animate-fade-in-up"
                    >
                      <div
                        className={`absolute -left-[41px] top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                          ms.status === "completed"
                            ? "bg-green-500"
                            : ms.status === "in_progress"
                            ? "bg-blue-500"
                            : ms.status === "delayed"
                            ? "bg-red-500"
                            : "bg-gray-300"
                        }`}
                      >
                        {ms.status === "completed" && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {isEditing || (showAddForm && gIndex === groupedMilestones.length - 1 && index === group.items.length - 1 && false) ? (
                        <div className="card p-4 border-primary-200 bg-primary-50/30">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                              <label className="label-text">节点名称</label>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                placeholder="例如：项目立项备案"
                              />
                            </div>
                            <div>
                              <label className="label-text">阶段</label>
                              <select
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value as MilestoneStage })}
                                className="input-field"
                              >
                                {stageOrder.map((s) => (
                                  <option key={s} value={s}>
                                    {MILESTONE_STAGE_LABELS[s]}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="label-text">状态</label>
                              <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as MilestoneStatus })}
                                className="input-field"
                              >
                                {Object.entries(MILESTONE_STATUS_LABELS).map(([v, l]) => (
                                  <option key={v} value={v}>
                                    {l}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="label-text">计划完成日期</label>
                              <input
                                type="date"
                                value={formData.plannedDate}
                                onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                                className="input-field"
                              />
                            </div>
                            <div>
                              <label className="label-text">实际完成日期</label>
                              <input
                                type="date"
                                value={formData.actualDate}
                                onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                                className="input-field"
                              />
                            </div>
                            <div>
                              <label className="label-text">责任人</label>
                              <input
                                type="text"
                                value={formData.assignee}
                                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                className="input-field"
                                placeholder="例如：张顾问"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="label-text">备注</label>
                              <input
                                type="text"
                                value={formData.remark}
                                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                                className="input-field"
                                placeholder="备注说明..."
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={handleCancel} className="btn-secondary py-1.5 px-3 text-sm">
                              <X className="w-3.5 h-3.5 inline mr-1" />
                              取消
                            </button>
                            <button onClick={isEditing ? handleSave : handleAdd} className="btn-primary py-1.5 px-3 text-sm">
                              <Save className="w-3.5 h-3.5 inline mr-1" />
                              保存
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => startEdit(ms)}
                          className="card p-4 card-hover cursor-pointer ml-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium text-gray-900">{ms.name}</h5>
                                <StatusBadge type="milestone" status={ms.status} />
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  计划：{formatDate(ms.plannedDate)}
                                </span>
                                {ms.actualDate && (
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    实际：{formatDate(ms.actualDate)}
                                  </span>
                                )}
                                {ms.assignee && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" />
                                    {ms.assignee}
                                  </span>
                                )}
                              </div>
                              {ms.remark && (
                                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                                  {ms.remark}
                                </p>
                              )}
                            </div>
                            <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {showAddForm && group.items.length === 0 && gIndex === 0 && (
                  <div className="card p-4 border-primary-200 bg-primary-50/30 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="label-text">节点名称</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input-field"
                          placeholder="例如：项目立项备案"
                        />
                      </div>
                      <div>
                        <label className="label-text">阶段</label>
                        <select
                          value={formData.stage}
                          onChange={(e) => setFormData({ ...formData, stage: e.target.value as MilestoneStage })}
                          className="input-field"
                        >
                          {stageOrder.map((s) => (
                            <option key={s} value={s}>
                              {MILESTONE_STAGE_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label-text">状态</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as MilestoneStatus })}
                          className="input-field"
                        >
                          {Object.entries(MILESTONE_STATUS_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label-text">计划完成日期</label>
                        <input
                          type="date"
                          value={formData.plannedDate}
                          onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label-text">实际完成日期</label>
                        <input
                          type="date"
                          value={formData.actualDate}
                          onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="label-text">责任人</label>
                        <input
                          type="text"
                          value={formData.assignee}
                          onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                          className="input-field"
                          placeholder="例如：张顾问"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="label-text">备注</label>
                        <input
                          type="text"
                          value={formData.remark}
                          onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                          className="input-field"
                          placeholder="备注说明..."
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleCancel} className="btn-secondary py-1.5 px-3 text-sm">
                        取消
                      </button>
                      <button onClick={handleAdd} className="btn-primary py-1.5 px-3 text-sm">
                        添加
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
