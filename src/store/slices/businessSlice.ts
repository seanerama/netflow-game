import type { StateCreator } from 'zustand';
import type { Business, Employee, Office } from '../../types';

export interface BusinessSlice {
  business: Business;

  // Financial actions
  modifyCash: (amount: number) => void;
  setITBudget: (amount: number) => void;

  // Employee actions
  addEmployee: (employee: Employee) => void;
  removeEmployee: (employeeId: string) => void;
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  assignComputerToEmployee: (employeeId: string, computerId: string) => void;

  // Business growth
  setReputation: (reputation: number) => void;
  levelUp: () => void;

  // Office actions
  addOffice: (office: Office) => void;
}

const initialBusinessState: Business = {
  id: 'oakwood-design',
  name: 'Oakwood Design Co.',
  type: 'design-agency',
  founded: 1,
  cash: 500,
  monthlyRevenue: 5000,
  monthlyExpenses: 4000,
  itBudget: 500,
  level: 1,
  reputation: 50,
  employees: [
    {
      id: 'emp-sarah',
      name: 'Sarah Chen',
      role: 'designer',
      avatar: 'sarah.png',
      hireDate: 1,
      salary: 4000,
      productivity: 50,
      satisfaction: 60,
      trafficProfile: {
        webBrowsing: 7,
        email: 5,
        fileTransfers: 8,
        videoConferencing: 3,
        cloudApps: 6,
      },
    },
    {
      id: 'emp-mike',
      name: 'Mike Rodriguez',
      role: 'designer',
      avatar: 'mike.png',
      hireDate: 1,
      salary: 3800,
      productivity: 50,
      satisfaction: 55,
      trafficProfile: {
        webBrowsing: 8,
        email: 4,
        fileTransfers: 7,
        videoConferencing: 2,
        cloudApps: 5,
      },
    },
    {
      id: 'emp-lisa',
      name: 'Lisa Park',
      role: 'manager',
      avatar: 'lisa.png',
      hireDate: 1,
      salary: 5000,
      productivity: 50,
      satisfaction: 65,
      trafficProfile: {
        webBrowsing: 6,
        email: 9,
        fileTransfers: 4,
        videoConferencing: 7,
        cloudApps: 8,
      },
    },
  ],
  maxEmployees: 5,
  offices: [
    {
      id: 'office-main',
      name: 'Main Office',
      location: '123 Oak Street',
      size: 'small',
      maxWorkstations: 6,
      networkZone: 'zone-1',
    },
  ],
};

export const createBusinessSlice: StateCreator<BusinessSlice> = (set) => ({
  business: initialBusinessState,

  modifyCash: (amount) =>
    set((state) => ({
      business: {
        ...state.business,
        cash: Math.max(0, state.business.cash + amount),
      },
    })),

  setITBudget: (amount) =>
    set((state) => ({
      business: {
        ...state.business,
        itBudget: amount,
      },
    })),

  addEmployee: (employee) =>
    set((state) => ({
      business: {
        ...state.business,
        employees: [...state.business.employees, employee],
      },
    })),

  removeEmployee: (employeeId) =>
    set((state) => ({
      business: {
        ...state.business,
        employees: state.business.employees.filter((e) => e.id !== employeeId),
      },
    })),

  updateEmployee: (employeeId, updates) =>
    set((state) => ({
      business: {
        ...state.business,
        employees: state.business.employees.map((e) =>
          e.id === employeeId ? { ...e, ...updates } : e
        ),
      },
    })),

  assignComputerToEmployee: (employeeId, computerId) =>
    set((state) => ({
      business: {
        ...state.business,
        employees: state.business.employees.map((e) =>
          e.id === employeeId ? { ...e, assignedComputer: computerId } : e
        ),
      },
    })),

  setReputation: (reputation) =>
    set((state) => ({
      business: {
        ...state.business,
        reputation: Math.max(0, Math.min(100, reputation)),
      },
    })),

  levelUp: () =>
    set((state) => ({
      business: {
        ...state.business,
        level: state.business.level + 1,
        maxEmployees: state.business.maxEmployees + 2,
      },
    })),

  addOffice: (office) =>
    set((state) => ({
      business: {
        ...state.business,
        offices: [...state.business.offices, office],
      },
    })),
});
