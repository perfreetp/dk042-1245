import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { useNavigate } from "react-router-dom";
import { PROJECT_TYPE_OPTIONS } from "@/utils/constants";
import { today } from "@/utils/helpers";

interface CreateProjectModalProps {
  onClose: () => void;
}

export const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
  const navigate = useNavigate();
  const { addProject, setCurrentProjectId } = useProjectStore();

  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    projectType: PROJECT_TYPE_OPTIONS[0],
    projectBoundary: "",
    constructionStartDate: today(),
    constructionEndDate: "",
    expectedReductionSource: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      ...formData,
      status: "draft" as const,
    };
    addProject(newProject);
    const projects = useProjectStore.getState().projects;
    const latest = projects[projects.length - 1];
    setCurrentProjectId(latest.id);
    navigate(`/projects/${latest.id}`);
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-700" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">创建新项目</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="label-text">项目名称 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="input-field"
                placeholder="例如：河北某钢铁企业余热回收项目"
              />
            </div>

            <div>
              <label className="label-text">客户名称 *</label>
              <input
                type="text"
                required
                value={formData.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                className="input-field"
                placeholder="例如：河北鑫达钢铁集团"
              />
            </div>

            <div>
              <label className="label-text">项目类型 *</label>
              <select
                required
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
            </div>

            <div>
              <label className="label-text">建设开始日期</label>
              <input
                type="date"
                value={formData.constructionStartDate}
                onChange={(e) => updateField("constructionStartDate", e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="label-text">建设完成日期</label>
              <input
                type="date"
                value={formData.constructionEndDate}
                onChange={(e) => updateField("constructionEndDate", e.target.value)}
                className="input-field"
              />
            </div>

            <div className="col-span-2">
              <label className="label-text">项目边界</label>
              <textarea
                rows={2}
                value={formData.projectBoundary}
                onChange={(e) => updateField("projectBoundary", e.target.value)}
                className="input-field resize-none"
                placeholder="描述项目的地理范围、设施范围等边界信息"
              />
            </div>

            <div className="col-span-2">
              <label className="label-text">预期减排来源</label>
              <textarea
                rows={2}
                value={formData.expectedReductionSource}
                onChange={(e) => updateField("expectedReductionSource", e.target.value)}
                className="input-field resize-none"
                placeholder="说明减排量的具体来源，如能源替代、能效提升等"
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={onClose} className="btn-secondary">
            取消
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            创建项目
          </button>
        </div>
      </div>
    </div>
  );
};
