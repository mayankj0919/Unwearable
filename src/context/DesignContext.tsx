"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type { Template, ColorOption, PlacementSlot } from "@/types";

// ─── State ────────────────────────────────────────────────────────────────────

export interface DesignState {
  step: 1 | 2 | 3 | 4;
  template: Template | null;
  selectedColor: ColorOption | null;
  selectedPlacement: PlacementSlot | null;
  previewImageUrl: string | null;
  savedDesignId: string | null;
  isSaving: boolean;
  saveError: string | null;
}

const initialState: DesignState = {
  step: 1,
  template: null,
  selectedColor: null,
  selectedPlacement: null,
  previewImageUrl: null,
  savedDesignId: null,
  isSaving: false,
  saveError: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type DesignAction =
  | { type: "SET_TEMPLATE"; payload: Template }
  | { type: "SET_COLOR"; payload: ColorOption }
  | { type: "SET_PLACEMENT"; payload: PlacementSlot }
  | { type: "SET_STEP"; payload: 1 | 2 | 3 | 4 }
  | { type: "SET_PREVIEW_URL"; payload: string }
  | { type: "SET_SAVED_DESIGN"; payload: string }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_SAVE_ERROR"; payload: string | null }
  | { type: "RESET" };

function designReducer(state: DesignState, action: DesignAction): DesignState {
  switch (action.type) {
    case "SET_TEMPLATE":
      return {
        ...state,
        template: action.payload,
        // Reset downstream selections when template changes
        selectedColor: null,
        selectedPlacement: null,
        previewImageUrl: null,
        step: 2,
      };
    case "SET_COLOR":
      return { ...state, selectedColor: action.payload };
    case "SET_PLACEMENT":
      return { ...state, selectedPlacement: action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "SET_PREVIEW_URL":
      return { ...state, previewImageUrl: action.payload };
    case "SET_SAVED_DESIGN":
      return { ...state, savedDesignId: action.payload };
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    case "SET_SAVE_ERROR":
      return { ...state, saveError: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface DesignContextValue {
  state: DesignState;
  setTemplate: (template: Template) => void;
  setColor: (color: ColorOption) => void;
  setPlacement: (placement: PlacementSlot) => void;
  goToStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPreviewUrl: (url: string) => void;
  setSavedDesign: (id: string) => void;
  setSaving: (saving: boolean) => void;
  setSaveError: (error: string | null) => void;
  reset: () => void;
  canProceed: boolean;
}

const DesignContext = createContext<DesignContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DesignProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(designReducer, initialState);

  const setTemplate = (template: Template) =>
    dispatch({ type: "SET_TEMPLATE", payload: template });

  const setColor = (color: ColorOption) =>
    dispatch({ type: "SET_COLOR", payload: color });

  const setPlacement = (placement: PlacementSlot) =>
    dispatch({ type: "SET_PLACEMENT", payload: placement });

  const goToStep = (step: 1 | 2 | 3 | 4) =>
    dispatch({ type: "SET_STEP", payload: step });

  const nextStep = () => {
    if (state.step < 4) {
      dispatch({ type: "SET_STEP", payload: (state.step + 1) as 1 | 2 | 3 | 4 });
    }
  };

  const prevStep = () => {
    if (state.step > 1) {
      dispatch({ type: "SET_STEP", payload: (state.step - 1) as 1 | 2 | 3 | 4 });
    }
  };

  const setPreviewUrl = (url: string) =>
    dispatch({ type: "SET_PREVIEW_URL", payload: url });

  const setSavedDesign = (id: string) =>
    dispatch({ type: "SET_SAVED_DESIGN", payload: id });

  const setSaving = (saving: boolean) =>
    dispatch({ type: "SET_SAVING", payload: saving });

  const setSaveError = (error: string | null) =>
    dispatch({ type: "SET_SAVE_ERROR", payload: error });

  const reset = () => dispatch({ type: "RESET" });

  // Whether user can advance to the next step
  const canProceed =
    state.step === 1 ? !!state.template :
    state.step === 2 ? !!state.selectedColor :
    state.step === 3 ? !!state.selectedPlacement :
    true;

  return (
    <DesignContext.Provider
      value={{
        state,
        setTemplate,
        setColor,
        setPlacement,
        goToStep,
        nextStep,
        prevStep,
        setPreviewUrl,
        setSavedDesign,
        setSaving,
        setSaveError,
        reset,
        canProceed,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error("useDesign must be used within a DesignProvider");
  return ctx;
}
