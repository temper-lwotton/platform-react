'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  FormBuilderState,
  FormBuilderAction,
  FormField,
  FormSnapshot,
} from '@/types/form-builder';

const MAX_HISTORY = 50;

const initialState: FormBuilderState = {
  formTitle: 'Untitled Form',
  formDescription: '',
  fields: [],
  selectedFieldId: null,
  mode: 'builder',
  history: [],
  historyIndex: -1,
};

// Helper function to increment label if it ends with a number
function incrementLabel(label: string): string {
  const match = label.match(/^(.+?)(\d+)$/);
  if (match) {
    const base = match[1].trim();
    const number = parseInt(match[2], 10);
    return `${base} ${number + 1}`;
  }
  return `${label} 2`;
}

// Helper to create a snapshot of the current state
function createSnapshot(state: FormBuilderState): FormSnapshot {
  return {
    formId: state.formId,
    formTitle: state.formTitle,
    formDescription: state.formDescription,
    fields: JSON.parse(JSON.stringify(state.fields)), // Deep copy
    selectedFieldId: state.selectedFieldId,
  };
}

// Helper to restore state from a snapshot
function restoreFromSnapshot(state: FormBuilderState, snapshot: FormSnapshot): FormBuilderState {
  return {
    ...state,
    formId: snapshot.formId,
    formTitle: snapshot.formTitle,
    formDescription: snapshot.formDescription,
    fields: JSON.parse(JSON.stringify(snapshot.fields)), // Deep copy
    selectedFieldId: snapshot.selectedFieldId,
  };
}

// Helper to save current state to history (before making a change)
function saveToHistory(state: FormBuilderState): FormBuilderState {
  const snapshot = createSnapshot(state);
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(snapshot);

  // Limit history size
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }

  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState {
  switch (action.type) {
    case 'SET_FORM_TITLE': {
      const stateWithHistory = saveToHistory(state);
      return { ...stateWithHistory, formTitle: action.payload };
    }

    case 'SET_FORM_DESCRIPTION': {
      const stateWithHistory = saveToHistory(state);
      return { ...stateWithHistory, formDescription: action.payload };
    }

    case 'ADD_FIELD': {
      const stateWithHistory = saveToHistory(state);
      const { field, index } = action.payload;
      const newFields = [...stateWithHistory.fields];
      if (index !== undefined) {
        newFields.splice(index, 0, field);
      } else {
        newFields.push(field);
      }
      return {
        ...stateWithHistory,
        fields: newFields,
        selectedFieldId: field.id,
      };
    }

    case 'UPDATE_FIELD': {
      const stateWithHistory = saveToHistory(state);
      const { id, updates } = action.payload;
      return {
        ...stateWithHistory,
        fields: stateWithHistory.fields.map((field) =>
          field.id === id ? { ...field, ...updates } : field
        ),
      };
    }

    case 'DELETE_FIELD': {
      const stateWithHistory = saveToHistory(state);
      return {
        ...stateWithHistory,
        fields: stateWithHistory.fields.filter((field) => field.id !== action.payload),
        selectedFieldId:
          stateWithHistory.selectedFieldId === action.payload
            ? null
            : stateWithHistory.selectedFieldId,
      };
    }

    case 'DUPLICATE_FIELD': {
      const stateWithHistory = saveToHistory(state);
      const fieldToDuplicate = stateWithHistory.fields.find((f) => f.id === action.payload);
      if (!fieldToDuplicate) return stateWithHistory;

      // Create a deep copy of the field
      const duplicatedField: FormField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        label: incrementLabel(fieldToDuplicate.label),
        validations: fieldToDuplicate.validations.map((v) => ({ ...v })),
        options: fieldToDuplicate.options?.map((o) => ({ ...o })),
      };

      // Insert the duplicated field right after the original
      const originalIndex = stateWithHistory.fields.findIndex((f) => f.id === action.payload);
      const newFields = [...stateWithHistory.fields];
      newFields.splice(originalIndex + 1, 0, duplicatedField);

      return {
        ...stateWithHistory,
        fields: newFields,
        selectedFieldId: duplicatedField.id,
      };
    }

    case 'REORDER_FIELDS': {
      const stateWithHistory = saveToHistory(state);
      const { fromIndex, toIndex } = action.payload;
      const newFields = [...stateWithHistory.fields];
      const [removed] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, removed);
      return { ...stateWithHistory, fields: newFields };
    }

    case 'SELECT_FIELD':
      return { ...state, selectedFieldId: action.payload };

    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'CLEAR_FORM':
      return {
        ...initialState,
        formTitle: 'Untitled Form',
      };

    case 'LOAD_FORM':
      return action.payload;

    case 'UNDO': {
      if (state.historyIndex > 0) {
        const previousSnapshot = state.history[state.historyIndex - 1];
        return {
          ...restoreFromSnapshot(state, previousSnapshot),
          history: state.history,
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    }

    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const nextSnapshot = state.history[state.historyIndex + 1];
        return {
          ...restoreFromSnapshot(state, nextSnapshot),
          history: state.history,
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

interface FormBuilderContextType {
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
  // Helper functions
  addField: (field: FormField, index?: number) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  deleteField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (id: string | null) => void;
  setMode: (mode: 'builder' | 'preview') => void;
  clearForm: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(
  undefined
);

export function FormBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  const addField = (field: FormField, index?: number) => {
    dispatch({ type: 'ADD_FIELD', payload: { field, index } });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { id, updates } });
  };

  const deleteField = (id: string) => {
    dispatch({ type: 'DELETE_FIELD', payload: id });
  };

  const duplicateField = (id: string) => {
    dispatch({ type: 'DUPLICATE_FIELD', payload: id });
  };

  const reorderFields = (fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_FIELDS', payload: { fromIndex, toIndex } });
  };

  const selectField = (id: string | null) => {
    dispatch({ type: 'SELECT_FIELD', payload: id });
  };

  const setMode = (mode: 'builder' | 'preview') => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  const clearForm = () => {
    dispatch({ type: 'CLEAR_FORM' });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        dispatch,
        addField,
        updateField,
        deleteField,
        duplicateField,
        reorderFields,
        selectField,
        setMode,
        clearForm,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within FormBuilderProvider');
  }
  return context;
}
