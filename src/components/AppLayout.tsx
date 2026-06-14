import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useProjectStore } from "@/store/useProjectStore";
import { ArrowLeft, Bell, Search } from "lucide-react";

export const AppLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setCurrentProjectId = useProjectStore((s) => s.setCurrentProjectId);
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const currentProject = useProjectStore(
    (s) => id ? s.projects.find((p) => p.id === id) : undefined
  );

  useEffect(() => {
    if (id && id !== currentProjectId) {
      setCurrentProjectId(id);
    }
  }, [id, currentProjectId, setCurrentProjectId]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {id && (
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                返回列表
              </button>
            )}
            <div className="text-lg font-semibold text-gray-900">
              {id ? currentProject?.name || "项目详情" : "项目总览"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索项目、资料..."
                className="w-64 pl-9 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
              />
            </div>
            <button className="relative w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  );
};
