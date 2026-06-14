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

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: mockProjects,
  documents: mockDocuments,
  calculations: mockCalculations,
  milestones: mockMilestones,
  communications: mockCommunications,
  todos: mockTodos,

  currentProjectId: null,
  setCurrentProjectId: (id) => set({ currentProjectId: id }),

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
  },

  updateProject: (id, project) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...project, updatedAt: new Date().toISOString() } : p
      ),
    }));
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
  },

  updateDocument: (id, doc) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, ...doc } : d
      ),
    }));
  },

  toggleDocumentMissing: (id) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, isMissing: !d.isMissing } : d
      ),
    }));
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
  },

  updateMilestone: (id, milestone) => {
    set((state) => ({
      milestones: state.milestones.map((m) =>
        m.id === id ? { ...m, ...milestone } : m
      ),
    }));
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
  },

  toggleTodo: (id) => {
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    }));
  },

  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    }));
  },
}));
