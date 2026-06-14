import type { DocumentCategory, MilestoneStage } from "@/types";

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  draft: "草稿",
  in_progress: "进行中",
  under_review: "审核中",
  submitted: "已提交",
  completed: "已完成",
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  under_review: "bg-accent-100 text-accent-700",
  submitted: "bg-primary-100 text-primary-700",
  completed: "bg-green-100 text-green-700",
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已驳回",
};

export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  contract: "合同",
  invoice: "发票",
  monitoring: "监测记录",
  photo: "现场照片",
};

export const DOCUMENT_CATEGORY_ICONS: Record<DocumentCategory, string> = {
  contract: "FileText",
  invoice: "Receipt",
  monitoring: "Activity",
  photo: "Image",
};

export const MILESTONE_STAGE_LABELS: Record<MilestoneStage, string> = {
  initiation: "立项",
  monitoring: "监测",
  verification: "核查",
  issuance: "签发",
};

export const MILESTONE_STATUS_LABELS: Record<string, string> = {
  not_started: "未开始",
  in_progress: "进行中",
  completed: "已完成",
  delayed: "已延迟",
};

export const MILESTONE_STATUS_COLORS: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  delayed: "bg-red-100 text-red-700",
};

export const COMMUNICATION_TYPE_LABELS: Record<string, string> = {
  meeting: "会议",
  phone: "电话",
  email: "邮件",
  wechat: "微信",
};

export const PROJECT_TYPE_OPTIONS = [
  "可再生能源发电",
  "能效提升改造",
  "工业减排",
  "林业碳汇",
  "甲烷回收利用",
  "废弃物处理",
  "交通减排",
  "建筑节能",
];

export const DEFAULT_DOCUMENT_TEMPLATES: Record<DocumentCategory, string[]> = {
  contract: [
    "项目开发合同",
    "咨询服务合同",
    "减排量购买协议",
  ],
  invoice: [
    "设备采购发票",
    "工程服务发票",
    "咨询费用发票",
  ],
  monitoring: [
    "月度能耗监测报告",
    "排放因子检测报告",
    "第三方监测报告",
  ],
  photo: [
    "项目现场照片",
    "设备安装照片",
    "竣工验收照片",
  ],
};
