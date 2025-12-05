import type { StateCreator } from 'zustand';
import type { UIState, ModalType, Position } from '../../types';

export interface UISlice {
  ui: UIState;

  // View actions
  setCurrentView: (view: UIState['currentView']) => void;

  // Selection actions
  selectDevice: (deviceId: string | undefined) => void;
  selectConnection: (connectionId: string | undefined) => void;

  // Display toggles
  toggleDataFlow: () => void;
  toggleLabels: () => void;
  setShowDataFlow: (show: boolean) => void;
  setShowLabels: (show: boolean) => void;

  // Zoom and pan
  setZoom: (zoom: number) => void;
  setPan: (pan: Position) => void;
  resetView: () => void;

  // Modal actions
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;

  // Tutorial
  setTutorialStep: (step: number | undefined) => void;
  setHighlightedElements: (elements: string[]) => void;
  addHighlightedElement: (element: string) => void;
  removeHighlightedElement: (element: string) => void;
}

const initialUIState: UIState = {
  currentView: 'network',
  selectedDevice: undefined,
  selectedConnection: undefined,
  showDataFlow: true,
  showLabels: true,
  zoom: 1,
  pan: { x: 0, y: 0 },
  activeModal: undefined,
  modalData: undefined,
  tutorialStep: undefined,
  highlightedElements: [],
};

export const createUISlice: StateCreator<UISlice> = (set) => ({
  ui: initialUIState,

  setCurrentView: (view) =>
    set((state) => ({
      ui: {
        ...state.ui,
        currentView: view,
      },
    })),

  selectDevice: (deviceId) =>
    set((state) => ({
      ui: {
        ...state.ui,
        selectedDevice: deviceId,
        selectedConnection: undefined, // Deselect connection when selecting device
      },
    })),

  selectConnection: (connectionId) =>
    set((state) => ({
      ui: {
        ...state.ui,
        selectedConnection: connectionId,
        selectedDevice: undefined, // Deselect device when selecting connection
      },
    })),

  toggleDataFlow: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        showDataFlow: !state.ui.showDataFlow,
      },
    })),

  toggleLabels: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        showLabels: !state.ui.showLabels,
      },
    })),

  setShowDataFlow: (show) =>
    set((state) => ({
      ui: {
        ...state.ui,
        showDataFlow: show,
      },
    })),

  setShowLabels: (show) =>
    set((state) => ({
      ui: {
        ...state.ui,
        showLabels: show,
      },
    })),

  setZoom: (zoom) =>
    set((state) => ({
      ui: {
        ...state.ui,
        zoom: Math.max(0.25, Math.min(2, zoom)),
      },
    })),

  setPan: (pan) =>
    set((state) => ({
      ui: {
        ...state.ui,
        pan,
      },
    })),

  resetView: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        zoom: 1,
        pan: { x: 0, y: 0 },
      },
    })),

  openModal: (type, data) =>
    set((state) => ({
      ui: {
        ...state.ui,
        activeModal: type,
        modalData: data,
      },
    })),

  closeModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        activeModal: undefined,
        modalData: undefined,
      },
    })),

  setTutorialStep: (step) =>
    set((state) => ({
      ui: {
        ...state.ui,
        tutorialStep: step,
      },
    })),

  setHighlightedElements: (elements) =>
    set((state) => ({
      ui: {
        ...state.ui,
        highlightedElements: elements,
      },
    })),

  addHighlightedElement: (element) =>
    set((state) => ({
      ui: {
        ...state.ui,
        highlightedElements: [...state.ui.highlightedElements, element],
      },
    })),

  removeHighlightedElement: (element) =>
    set((state) => ({
      ui: {
        ...state.ui,
        highlightedElements: state.ui.highlightedElements.filter(
          (e) => e !== element
        ),
      },
    })),
});
