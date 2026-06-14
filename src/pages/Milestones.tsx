import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Flag,
  CheckCircle2,
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

const emptyFormData = {
  name: "",
  stage: "initiation" as MilestoneStage,
  plannedDate: today(),
  actualDate: "",
  status: "not_started" as MilestoneStatus,
  assignee: "",
  remark: "",
};

interface MilestoneFormProps {
  formData: typeof emptyFormData;
  onChange: (data: typeof emptyFormData) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const MilestoneForm = ({ formData, onChange, onCancel, onSubmit, isEditing }: MilestoneFormProps) => {
  return (
    <div className="card p-4 border-primary-200 bg-primary-50/30 ml-2 animate-fade-in-up">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label className="label-text">节点名称</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            className="input-field"
            placeholder="例如：项目立项备案"
            autoFocus
          />
        </div>
        <div>
          <label className="label-text">阶段</label>
          <select
            value={formData.stage}
            onChange={(e) => onChange({ ...formData, stage: e.target.value as MilestoneStage })}
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
            onChange={(e) => onChange({ ...formData, status: e.target.value as MilestoneStatus })}
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
            onChange={(e) => onChange({ ...formData, plannedDate: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">实际完成日期</label>
          <input
            type="date"
            value={formData.actualDate}
            onChange={(e) => onChange({ ...formData, actualDate: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text">责任人</label>
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => onChange({ ...formData, assignee: e.target.value })}
            className="input-field"
            placeholder="例如：张顾问"
          />
        </div>
        <div className="col-span-2">
          <label className="label-text">备注</label>
          <input
            type="text"
            value={formData.remark}
            onChange={(e) => onChange({ ...formData, remark: e.target.value })}
            className="input-field"
            placeholder="备注说明..."
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button onClick={onCancel} className="btn-secondary py-1.5 px-3 text-sm">
          <X className="w-3.5 h-3.5 inline mr-1" />
          取消
        </button>
        <button
          onClick={onSubmit}
          disabled={!formData.name.trim()}
          className="btn-primary py-1.5 px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-3.5 h-3.5 inline mr-1" />
          {isEditing ? "保存" : "添加"}
        </button>
      </div>
    </div>
  );
};

export const Milestones = () => {
  const { id } = useParams();
  const allMilestones = useProjectStore((s) => s.milestones);
  const addMilestone = useProjectStore((s) => s.addMilestone);
  const updateMilestone = useProjectStore((s) => s.updateMilestone);
  const milestones = id ? allMilestones.filter((m) => m.projectId === id) : [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyFormData);

  const handleResetForm = () => {
    setFormData(emptyFormData);
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
    setShowAddForm(false);
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
              setEditingId(null);
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

        {showAddForm && (
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg ${stageConfig[formData.stage].bgColor} flex items-center justify-center`}>
                <Flag className={`w-4 h-4 ${stageConfig[formData.stage].iconColor}`} />
              </div>
              <h4 className={`font-semibold ${stageConfig[formData.stage].color}`}>
                新增里程碑节点
              </h4>
            </div>
            <MilestoneForm
              formData={formData}
              onChange={setFormData}
              onCancel={handleCancel}
              onSubmit={handleAdd}
              isEditing={false}
            />
          </div>
        )}

        <div className="relative">
          {groupedMilestones.map((group) => (
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
                {group.items.length === 0 ? (
                  <div className="text-xs text-gray-400 py-2 ml-2">暂无节点</div>
                ) : (
                  group.items.map((ms) => {
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
                          {ms.status === "in_progress" && (
                            <Clock className="w-4 h-4 text-white" />
                          )}
                          {ms.status === "delayed" && (
                            <AlertTriangle className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {isEditing ? (
                          <MilestoneForm
                            formData={formData}
                            onChange={setFormData}
                            onCancel={handleCancel}
                            onSubmit={handleSave}
                            isEditing={true}
                          />
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
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2 flex-wrap">
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
                              <Edit3 className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
