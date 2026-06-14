export type ProjectStatus =
  | "draft"
  | "in_progress"
  | "under_review"
  | "submitted"
  | "completed";

export type DocumentStatus = "pending" | "approved" | "rejected";

export type DocumentCategory = "contract" | "invoice" | "monitoring" | "photo";

export type MilestoneStage = "initiation" | "monitoring" | "verification" | "issuance";

export type MilestoneStatus = "not_started" | "in_progress" | "completed" | "delayed";

export type CommunicationType = "meeting" | "phone" | "email" | "wechat";

export interface Project {
  id: string;
  name: string;
  clientName: string;
  projectType: string;
  projectBoundary: string;
  constructionStartDate: string;
  constructionEndDate: string;
  expectedReductionSource: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  projectId: string;
  category: DocumentCategory;
  name: string;
  fileName?: string;
  status: DocumentStatus;
  isMissing: boolean;
  reviewComment?: string;
  uploadedAt?: string;
}

export interface EmissionCalculation {
  id: string;
  projectId: string;
  baselineYear: string;
  baselineEnergy: number;
  baselineFactor: number;
  monitoredPeriod: string;
  monitoredEnergy: number;
  monitoredFactor: number;
  reductionAmount: number;
  version: string;
  calculatedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  stage: MilestoneStage;
  plannedDate: string;
  actualDate?: string;
  status: MilestoneStatus;
  assignee: string;
  remark?: string;
}

export interface Communication {
  id: string;
  projectId: string;
  type: CommunicationType;
  content: string;
  contactPerson: string;
  communicatedAt: string;
  attachments?: string[];
}

export interface TodoItem {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface ProjectStore {
  projects: Project[];
  documents: DocumentItem[];
  calculations: EmissionCalculation[];
  milestones: Milestone[];
  communications: Communication[];
  todos: TodoItem[];

  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;

  getCurrentProject: () => Project | undefined;
  getProjectDocuments: (projectId: string) => DocumentItem[];
  getProjectCalculations: (projectId: string) => EmissionCalculation[];
  getProjectMilestones: (projectId: string) => Milestone[];
  getProjectCommunications: (projectId: string) => Communication[];
  getProjectTodos: (projectId: string) => TodoItem[];

  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  addDocument: (doc: Omit<DocumentItem, "id">) => void;
  updateDocument: (id: string, doc: Partial<DocumentItem>) => void;
  toggleDocumentMissing: (id: string) => void;

  addCalculation: (calc: Omit<EmissionCalculation, "id" | "calculatedAt" | "reductionAmount">) => void;

  addMilestone: (milestone: Omit<Milestone, "id">) => void;
  updateMilestone: (id: string, milestone: Partial<Milestone>) => void;

  addCommunication: (comm: Omit<Communication, "id">) => void;

  addTodo: (todo: Omit<TodoItem, "id" | "createdAt" | "isCompleted">) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}
