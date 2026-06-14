import { create } from "zustand";
import type { ProjectStore } from "@/types";
import {
  mockProjects,
  mockDocuments,
  mockCalculations,
  mockMilestones,
  mockCommunications,
  mockTodos,
} from "@/data/mockData";
import { generateId, calculateReduction } from "@/utils/helpers";

const STORAGE_KEY = "carbon-reduction-store";

interface PersistState {
  projects: ProjectStore["projects"];
  documents: ProjectStore["documents"];
  calculations: ProjectStore["calculations"];
  milestones: ProjectStore["milestones"];
  communications: ProjectStore["communications"];
  todos: ProjectStore["todos"];
  currentProjectId: ProjectStore["currentProjectId"];
}

const loadFromStorage = (): PersistState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.projects) &&
      Array.isArray(parsed.documents) &&
      Array.isArray(parsed.calculations) &&
      Array.isArray(parsed.milestones) &&
      Array.isArray(parsed.communications) &&
      Array.isArray(parsed.todos)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

const saveToStorage = (state: PersistState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

const persisted = loadFromStorage();

const initialState: PersistState = persisted ?? {
  projects: mockProjects,
  documents: mockDocuments,
  calculations: mockCalculations,
  milestones: mockMilestones,
  communications: mockCommunications,
  todos: mockTodos,
  currentProjectId: null,
};

const persist = (s: ProjectStore) => {
  saveToStorage({
    projects: s.projects,
    documents: s.documents,
    calculations: s.calculations,
    milestones: s.milestones,
    communications: s.communications,
    todos: s.todos,
    currentProjectId: s.currentProjectId,
  });
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: initialState.projects,
  documents: initialState.documents,
  calculations: initialState.calculations,
  milestones: initialState.milestones,
  communications: initialState.communications,
  todos: initialState.todos,

  currentProjectId: initialState.currentProjectId,
  setCurrentProjectId: (id) => {
    set({ currentProjectId: id });
    persist(get());
  },

  getCurrentProject: () => {
    const { projects, currentProjectId } = get();
    return projects.find((p) => p.id === currentProjectId);
  },

  getProjectDocuments: (projectId) =>
    get().documents.filter((d) => d.projectId === projectId),

  getProjectCalculations: (projectId) =>
    get().calculations.filter((c) => c.projectId === projectId),

  getProjectMilestones: (projectId) =>
    get().milestones.filter((m) => m.projectId === projectId),

  getProjectCommunications: (projectId) =>
    get().communications.filter((c) => c.projectId === projectId),

  getProjectTodos: (projectId) =>
    get().todos.filter((t) => t.projectId === projectId),

  addProject: (project) => {
    const now = new Date().toISOString();
    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...project,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        },
      ],
    }));
    persist(get());
  },

  updateProject: (id, project) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...project, updatedAt: new Date().toISOString() } : p
      ),
    }));
    persist(get());
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      documents: state.documents.filter((d) => d.projectId !== id),
      calculations: state.calculations.filter((c) => c.projectId !== id),
      milestones: state.milestones.filter((m) => m.projectId !== id),
      communications: state.communications.filter((c) => c.projectId !== id),
      todos: state.todos.filter((t) => t.projectId !== id),
    }));
    persist(get());
  },

  addDocument: (doc) => {
    set((state) => ({
      documents: [
        ...state.documents,
        {
          ...doc,
          id: generateId(),
        },
      ],
    }));
    persist(get());
  },

  updateDocument: (id, doc) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, ...doc } : d
      ),
    }));
    persist(get());
  },

  toggleDocumentMissing: (id) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, isMissing: !d.isMissing } : d
      ),
    }));
    persist(get());
  },

  addCalculation: (calc) => {
    const reductionAmount = calculateReduction(
      calc.baselineEnergy,
      calc.baselineFactor,
      calc.monitoredEnergy,
      calc.monitoredFactor
    );
    set((state) => ({
      calculations: [
        ...state.calculations,
        {
          ...calc,
          id: generateId(),
          reductionAmount,
          calculatedAt: new Date().toISOString(),
        },
      ],
    }));
    persist(get());
  },

  addMilestone: (milestone) => {
    set((state) => ({
      milestones: [
        ...state.milestones,
        {
          ...milestone,
          id: generateId(),
        },
      ],
    }));
    persist(get());
  },

  updateMilestone: (id, milestone) => {
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === id ? { ...m, ...milestone } : m
      ),
    }));
    persist(get());
  },

  addCommunication: (comm) => {
    set((state) => ({
      communications: [
        ...state.communications,
        {
          ...comm,
          id: generateId(),
        },
      ],
    }));
    persist(get());
  },

  addTodo: (todo) => {
    set((state) => ({
      todos: [
        ...state.todos,
        {
          ...todo,
          id: generateId(),
          isCompleted: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    persist(get());
  },

  toggleTodo: (id) => {
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    }));
    persist(get());
  },

  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    }));
    persist(get());
  },
}));
