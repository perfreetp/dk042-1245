import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Save, Building2, User, Calendar, MapPin, Leaf, Edit3 } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/utils/helpers";
import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_LABELS } from "@/utils/constants";
import type { ProjectStatus } from "@/types";

export const ProjectDetail = () => {
  const { id } = useParams();
  const project = useProjectStore((s) => s.getCurrentProject());
  const updateProject = useProjectStore((s) => s.updateProject);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    projectType: "",
    projectBoundary: "",
    constructionStartDate: "",
    constructionEndDate: "",
    expectedReductionSource: "",
    status: "draft" as ProjectStatus,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        clientName: project.clientName,
        projectType: project.projectType,
        projectBoundary: project.projectBoundary,
        constructionStartDate: project.constructionStartDate,
        constructionEndDate: project.constructionEndDate,
        expectedReductionSource: project.expectedReductionSource,
        status: project.status,
      });
    }
  }, [project]);

  if (!project || !id) {
    return <div className="text-center py-20 text-gray-500">项目不存在</div>;
  }

  const handleSave = () => {
    updateProject(id, formData);
    setIsEditing(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value } as typeof prev));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{formData.name}</h1>
                <StatusBadge type="project" status={formData.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{formData.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  取消
                </button>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  保存修改
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                编辑项目
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="label-text flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-400" />
              项目名称
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="input-field"
              />
            ) : (
              <div className="text-gray-900">{formData.name || "-"}</div>
            )}
          </div>

          <div>
            <label className="label-text flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" />
              客户名称
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                className="input-field"
              />
            ) : (
              <div className="text-gray-900">{formData.clientName || "-"}</div>
            )}
          </div>

          <div>
            <label className="label-text">项目类型</label>
            {isEditing ? (
              <select
                value={formData.projectType}
                onChange={(e) => updateField("projectType", e.target.value)}
                className="input-field"
              >
                {PROJECT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-gray-900">{formData.projectType || "-"}</div>
            )}
          </div>

          <div>
            <label className="label-text">项目状态</label>
            {isEditing ? (
              <select
                value={formData.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="input-field"
              >
                {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <StatusBadge type="project" status={formData.status} />
            )}
          </div>

          <div className="col-span-2">
            <label className="label-text flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              项目边界
            </label>
            {isEditing ? (
              <textarea
                rows={2}
                value={formData.projectBoundary}
                onChange={(e) => updateField("projectBoundary", e.target.value)}
                className="input-field resize-none"
              />
            ) : (
              <div className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                {formData.projectBoundary || "暂无描述"}
              </div>
            )}
          </div>

          <div>
            <label className="label-text flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              建设开始日期
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.constructionStartDate}
                onChange={(e) => updateField("constructionStartDate", e.target.value)}
                className="input-field"
              />
            ) : (
              <div className="text-gray-900">{formatDate(formData.constructionStartDate)}</div>
            )}
          </div>

          <div>
            <label className="label-text flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              建设完成日期
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.constructionEndDate}
                onChange={(e) => updateField("constructionEndDate", e.target.value)}
                className="input-field"
              />
            ) : (
              <div className="text-gray-900">{formatDate(formData.constructionEndDate) || "-"}</div>
            )}
          </div>

          <div className="col-span-2">
            <label className="label-text flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-gray-400" />
              预期减排来源
            </label>
            {isEditing ? (
              <textarea
                rows={2}
                value={formData.expectedReductionSource}
                onChange={(e) => updateField("expectedReductionSource", e.target.value)}
                className="input-field resize-none"
              />
            ) : (
              <div className="text-gray-700 leading-relaxed bg-primary-50 rounded-lg p-3 border border-primary-100">
                {formData.expectedReductionSource || "暂无描述"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">创建时间</div>
          <div className="text-gray-900 font-medium">{formatDate(project.createdAt)}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">最后更新</div>
          <div className="text-gray-900 font-medium">{formatDate(project.updatedAt)}</div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-gray-500 mb-1">项目编号</div>
          <div className="text-gray-900 font-mono font-medium">{project.id}</div>
        </div>
      </div>
    </div>
  );
};
