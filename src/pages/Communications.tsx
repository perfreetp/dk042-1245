import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  Users,
  CalendarDays,
  Plus,
  Check,
  Trash2,
  Clock,
  FileText,
  Paperclip,
  Send,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { COMMUNICATION_TYPE_LABELS } from "@/utils/constants";
import { formatDate, formatDateTime, today } from "@/utils/helpers";
import type { CommunicationType } from "@/types";

const typeIcons: Record<CommunicationType, typeof MessageSquare> = {
  meeting: Users,
  phone: Phone,
  email: Mail,
  wechat: MessageCircle,
};

const typeColors: Record<CommunicationType, string> = {
  meeting: "bg-blue-100 text-blue-700",
  phone: "bg-green-100 text-green-700",
  email: "bg-purple-100 text-purple-700",
  wechat: "bg-primary-100 text-primary-700",
};

export const Communications = () => {
  const { id } = useParams();
  const allCommunications = useProjectStore((s) => s.communications);
  const allTodos = useProjectStore((s) => s.todos);
  const addCommunication = useProjectStore((s) => s.addCommunication);
  const addTodo = useProjectStore((s) => s.addTodo);
  const toggleTodo = useProjectStore((s) => s.toggleTodo);
  const deleteTodo = useProjectStore((s) => s.deleteTodo);
  const communications = id ? allCommunications.filter((c) => c.projectId === id) : [];
  const todos = id ? allTodos.filter((t) => t.projectId === id) : [];

  const [showCommForm, setShowCommForm] = useState(false);
  const [commType, setCommType] = useState<CommunicationType>("meeting");
  const [commContent, setCommContent] = useState("");
  const [commContact, setCommContact] = useState("");

  const [showTodoForm, setShowTodoForm] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const [todoDueDate, setTodoDueDate] = useState("");

  const handleAddComm = () => {
    if (!id || !commContent.trim()) return;
    addCommunication({
      projectId: id,
      type: commType,
      content: commContent.trim(),
      contactPerson: commContact.trim() || "未指定",
      communicatedAt: new Date().toISOString(),
    });
    setCommContent("");
    setCommContact("");
    setShowCommForm(false);
  };

  const handleAddTodo = () => {
    if (!id || !todoTitle.trim()) return;
    addTodo({
      projectId: id,
      title: todoTitle.trim(),
      description: todoDesc.trim() || undefined,
      dueDate: todoDueDate || undefined,
    });
    setTodoTitle("");
    setTodoDesc("");
    setTodoDueDate("");
    setShowTodoForm(false);
  };

  const sortedComms = [...communications].sort(
    (a, b) => new Date(b.communicatedAt).getTime() - new Date(a.communicatedAt).getTime()
  );

  const pendingTodos = todos.filter((t) => !t.isCompleted);
  const completedTodos = todos.filter((t) => t.isCompleted);

  const commTypes: CommunicationType[] = ["meeting", "phone", "email", "wechat"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-5 gap-4">
        {commTypes.map((type) => {
          const Icon = typeIcons[type];
          const count = communications.filter((c) => c.type === type).length;
          return (
            <div key={type} className="card p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${typeColors[type]} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{COMMUNICATION_TYPE_LABELS[type]}</div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">待办事项</div>
              <div className="text-2xl font-bold text-gray-900">{pendingTodos.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">沟通记录</h3>
              <span className="badge bg-gray-100 text-gray-600">{communications.length}</span>
            </div>
            <button
              onClick={() => setShowCommForm(true)}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-3"
            >
              <Plus className="w-4 h-4" />
              记录沟通
            </button>
          </div>

          <div className="p-5 max-h-[600px] overflow-y-auto">
            {showCommForm && (
              <div className="mb-5 bg-primary-50 rounded-xl p-4 border border-primary-100">
                <div className="mb-3">
                  <label className="label-text">沟通方式</label>
                  <div className="flex gap-2">
                    {commTypes.map((type) => {
                      const Icon = typeIcons[type];
                      return (
                        <button
                          key={type}
                          onClick={() => setCommType(type)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            commType === type
                              ? typeColors[type]
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {COMMUNICATION_TYPE_LABELS[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="label-text">联系人</label>
                  <input
                    type="text"
                    value={commContact}
                    onChange={(e) => setCommContact(e.target.value)}
                    className="input-field"
                    placeholder="客户联系人姓名"
                  />
                </div>
                <div className="mb-4">
                  <label className="label-text">沟通内容</label>
                  <textarea
                    rows={3}
                    value={commContent}
                    onChange={(e) => setCommContent(e.target.value)}
                    className="input-field resize-none"
                    placeholder="详细记录沟通内容..."
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => setShowCommForm(false)} className="btn-secondary text-sm py-2">
                    取消
                  </button>
                  <button onClick={handleAddComm} className="btn-primary text-sm py-2 flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    保存记录
                  </button>
                </div>
              </div>
            )}

            {sortedComms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">暂无沟通记录</p>
                <p className="text-gray-400 text-sm mt-1">点击右上角按钮添加第一条记录</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedComms.map((comm, index) => {
                  const Icon = typeIcons[comm.type];
                  return (
                    <div
                      key={comm.id}
                      className="relative pl-8 animate-fade-in-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {index < sortedComms.length - 1 && (
                        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-100" />
                      )}
                      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${typeColors[comm.type]} flex items-center justify-center`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`badge ${typeColors[comm.type]}`}>
                              {COMMUNICATION_TYPE_LABELS[comm.type]}
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {comm.contactPerson}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDateTime(comm.communicatedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{comm.content}</p>
                        {comm.attachments && comm.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {comm.attachments.map((att, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-gray-600"
                              >
                                <Paperclip className="w-3 h-3" />
                                {att}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-600" />
              <h3 className="font-semibold text-gray-900">待办事项</h3>
            </div>
            <button
              onClick={() => setShowTodoForm(true)}
              className="btn-accent flex items-center gap-2 text-sm py-2 px-3"
            >
              <Plus className="w-4 h-4" />
              添加待办
            </button>
          </div>

          <div className="p-5 max-h-[600px] overflow-y-auto">
            {showTodoForm && (
              <div className="mb-4 bg-accent-50 rounded-xl p-4 border border-accent-100">
                <div className="mb-3">
                  <label className="label-text">任务标题</label>
                  <input
                    type="text"
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    className="input-field"
                    placeholder="例如：跟进设备采购发票"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label className="label-text">详细说明</label>
                  <textarea
                    rows={2}
                    value={todoDesc}
                    onChange={(e) => setTodoDesc(e.target.value)}
                    className="input-field resize-none"
                    placeholder="可选，补充详细说明..."
                  />
                </div>
                <div className="mb-4">
                  <label className="label-text">截止日期</label>
                  <input
                    type="date"
                    value={todoDueDate}
                    onChange={(e) => setTodoDueDate(e.target.value)}
                    min={today()}
                    className="input-field"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => setShowTodoForm(false)} className="btn-secondary text-sm py-2">
                    取消
                  </button>
                  <button onClick={handleAddTodo} className="btn-accent text-sm py-2">
                    添加
                  </button>
                </div>
              </div>
            )}

            {pendingTodos.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  进行中 ({pendingTodos.length})
                </div>
                <div className="space-y-2">
                  {pendingTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group bg-white rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 flex items-center justify-center flex-shrink-0 transition-colors"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{todo.title}</div>
                          {todo.description && (
                            <p className="text-xs text-gray-500 mt-1">{todo.description}</p>
                          )}
                          {todo.dueDate && (
                            <div className="flex items-center gap-1 mt-2 text-xs">
                              <CalendarDays className="w-3 h-3 text-gray-400" />
                              <span
                                className={
                                  new Date(todo.dueDate) < new Date()
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }
                              >
                                截止：{formatDate(todo.dueDate)}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTodos.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  已完成 ({completedTodos.length})
                </div>
                <div className="space-y-2">
                  {completedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="mt-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-400 text-sm line-through">
                            {todo.title}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {todos.length === 0 && !showTodoForm && (
              <div className="text-center py-12">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <FileText className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">暂无待办事项</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
