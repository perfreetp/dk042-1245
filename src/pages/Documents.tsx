import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Upload,
  FileText,
  Receipt,
  Activity,
  Image,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Plus,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_STATUS_LABELS,
  DEFAULT_DOCUMENT_TEMPLATES,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import type { DocumentCategory, DocumentStatus, DocumentItem } from "@/types";

const categoryIcons: Record<DocumentCategory, typeof FileText> = {
  contract: FileText,
  invoice: Receipt,
  monitoring: Activity,
  photo: Image,
};

const categoryColors: Record<DocumentCategory, string> = {
  contract: "bg-blue-50 text-blue-700",
  invoice: "bg-green-50 text-green-700",
  monitoring: "bg-purple-50 text-purple-700",
  photo: "bg-pink-50 text-pink-700",
};

export const Documents = () => {
  const { id } = useParams();
  const allDocuments = useProjectStore((s) => s.documents);
  const addDocument = useProjectStore((s) => s.addDocument);
  const updateDocument = useProjectStore((s) => s.updateDocument);
  const toggleDocumentMissing = useProjectStore((s) => s.toggleDocumentMissing);
  const documents = id ? allDocuments.filter((d) => d.projectId === id) : [];
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>("contract");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");

  const filteredDocs = useMemo(
    () => documents.filter((d) => d.category === activeCategory),
    [documents, activeCategory]
  );

  const categoryStats = useMemo(() => {
    const stats: Record<DocumentCategory, { total: number; approved: number; missing: number }> = {
      contract: { total: 0, approved: 0, missing: 0 },
      invoice: { total: 0, approved: 0, missing: 0 },
      monitoring: { total: 0, approved: 0, missing: 0 },
      photo: { total: 0, approved: 0, missing: 0 },
    };
    documents.forEach((d) => {
      stats[d.category].total++;
      if (d.status === "approved") stats[d.category].approved++;
      if (d.isMissing) stats[d.category].missing++;
    });
    return stats;
  }, [documents]);

  const totalStats = useMemo(() => {
    const total = documents.length;
    const approved = documents.filter((d) => d.status === "approved").length;
    const missing = documents.filter((d) => d.isMissing).length;
    const pending = documents.filter((d) => d.status === "pending").length;
    const rejected = documents.filter((d) => d.status === "rejected").length;
    return { total, approved, missing, pending, rejected };
  }, [documents]);

  const handleAddDocument = () => {
    if (!id || !newDocName.trim()) return;
    addDocument({
      projectId: id,
      category: activeCategory,
      name: newDocName.trim(),
      status: "pending",
      isMissing: false,
    });
    setNewDocName("");
    setShowAddModal(false);
  };

  const handleStatusChange = (docId: string, status: DocumentStatus) => {
    updateDocument(docId, { status });
  };

  const handleSaveComment = (docId: string) => {
    updateDocument(docId, { reviewComment: commentText });
    setEditingComment(null);
    setCommentText("");
  };

  const startEditComment = (doc: DocumentItem) => {
    setEditingComment(doc.id);
    setCommentText(doc.reviewComment || "");
  };

  const categories: DocumentCategory[] = ["contract", "invoice", "monitoring", "photo"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="text-xs text-gray-500 mb-1">资料总数</div>
          <div className="text-2xl font-bold text-gray-900">{totalStats.total}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            已通过
          </div>
          <div className="text-2xl font-bold text-green-600">{totalStats.approved}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-yellow-500" />
            待审核
          </div>
          <div className="text-2xl font-bold text-yellow-600">{totalStats.pending}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-500" />
            已驳回
          </div>
          <div className="text-2xl font-bold text-red-600">{totalStats.rejected}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-orange-500" />
            缺失项
          </div>
          <div className="text-2xl font-bold text-orange-600">{totalStats.missing}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-1">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              const stats = categoryStats[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {DOCUMENT_CATEGORY_LABELS[cat]}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${isActive ? "bg-primary-200 text-primary-700" : "bg-gray-100 text-gray-500"}`}>
                    {stats.total}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 text-sm py-2 px-3"
          >
            <Plus className="w-4 h-4" />
            添加资料项
          </button>
        </div>

        <div className="p-5">
          <div className="space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${categoryColors[activeCategory]}`}>
                  {(() => {
                    const Icon = categoryIcons[activeCategory];
                    return <Icon className="w-7 h-7" />;
                  })()}
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  暂无{DOCUMENT_CATEGORY_LABELS[activeCategory]}资料
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-secondary text-sm py-2"
                >
                  添加第一项
                </button>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    doc.isMissing
                      ? "bg-orange-50 border-orange-200"
                      : "bg-gray-50 border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[doc.category]}`}>
                    {(() => {
                      const Icon = categoryIcons[doc.category];
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{doc.name}</span>
                      {doc.isMissing && (
                        <span className="badge bg-orange-100 text-orange-700">缺失</span>
                      )}
                    </div>
                    {doc.fileName && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="truncate">{doc.fileName}</span>
                        {doc.uploadedAt && <span>· {formatDate(doc.uploadedAt)}</span>}
                      </div>
                    )}
                    {editingComment === doc.id ? (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="填写审核意见..."
                          className="input-field text-sm py-1.5 flex-1"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveComment(doc.id)}
                          className="btn-primary text-sm py-1.5 px-3"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => setEditingComment(null)}
                          className="btn-secondary text-sm py-1.5 px-3"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      doc.reviewComment && (
                        <div
                          onClick={() => startEditComment(doc)}
                          className="mt-2 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-300 inline-flex items-center gap-2"
                        >
                          <MessageSquare className="w-3 h-3" />
                          {doc.reviewComment}
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge type="document" status={doc.status} />

                    <div className="flex items-center gap-1 border-l border-gray-200 pl-2 ml-2">
                      <button
                        onClick={() => handleStatusChange(doc.id, "approved")}
                        className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center text-green-600 transition-colors"
                        title="标记通过"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(doc.id, "rejected")}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-600 transition-colors"
                        title="标记驳回"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleDocumentMissing(doc.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          doc.isMissing
                            ? "bg-orange-100 text-orange-600"
                            : "hover:bg-orange-50 text-gray-400 hover:text-orange-600"
                        }`}
                        title="标记缺失"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                      {!editingComment && (
                        <button
                          onClick={() => startEditComment(doc)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                          title="添加审核意见"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              添加{DOCUMENT_CATEGORY_LABELS[activeCategory]}资料
            </h3>
            <label className="label-text">资料名称</label>
            <input
              type="text"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder={`例如：${DEFAULT_DOCUMENT_TEMPLATES[activeCategory][0]}`}
              className="input-field mb-4"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddDocument()}
            />
            <div className="mb-4">
              <div className="label-text">快速选择</div>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_DOCUMENT_TEMPLATES[activeCategory].map((name) => (
                  <button
                    key={name}
                    onClick={() => setNewDocName(name)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      newDocName === name
                        ? "bg-primary-100 border-primary-200 text-primary-700"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary">
                取消
              </button>
              <button onClick={handleAddDocument} className="btn-primary">
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
