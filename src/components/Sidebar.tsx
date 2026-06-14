import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Calculator,
  Flag,
  MessageSquare,
  Package,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { cn } from "@/utils/helpers";
import { useProjectStore } from "@/store/useProjectStore";

interface SidebarProps {
  compact?: boolean;
}

export const Sidebar = ({ compact = false }: SidebarProps) => {
  const { id } = useParams();
  const currentProject = useProjectStore((s) => s.getCurrentProject());
  const projectName = currentProject?.name || "项目详情";

  const navItems = id
    ? [
        { to: `/projects/${id}`, label: "项目信息", icon: FolderKanban },
        { to: `/projects/${id}/documents`, label: "资料清单", icon: FileText },
        { to: `/projects/${id}/calculation`, label: "减排测算", icon: Calculator },
        { to: `/projects/${id}/milestones`, label: "里程碑", icon: Flag },
        { to: `/projects/${id}/communications`, label: "沟通记录", icon: MessageSquare },
        { to: `/projects/${id}/submission`, label: "申报包", icon: Package },
      ]
    : [];

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300",
        compact ? "w-20" : "w-64"
      )}
    >
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-sm">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          {!compact && (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm">碳减排管理</span>
              <span className="text-xs text-gray-500">Carbon Reduction</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn("nav-item mb-1", isActive && "nav-item-active")
          }
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!compact && <span>项目总览</span>}
        </NavLink>

        {id && (
          <>
            {!compact && (
              <div className="mt-4 mb-2 px-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                  当前项目
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {projectName}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    {currentProject?.clientName}
                  </div>
                </div>
              </div>
            )}

            {!compact && (
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium px-4 mb-2 mt-4">
                项目管理
              </div>
            )}

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn("nav-item mb-1 group", isActive && "nav-item-active")
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!compact && <span className="flex-1">{item.label}</span>}
                {!compact && (
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {!compact && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-medium text-sm">
              张
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">张顾问</div>
              <div className="text-xs text-gray-500 truncate">高级咨询顾问</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
