'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  FormBuilderState,
  FormBuilderAction,
  FormField,
} from '@/types/form-builder';

const initialState: FormBuilderState = {
  formTitle: 'Untitled Form',
  formDescription: '',
  fields: [],
  selectedFieldId: null,
  mode: 'builder',
};

function formBuilderReducer(
  state: FormBuilderState,
  action: FormBuilderAction
): FormBuilderState {
  switch (action.type) {
    case 'SET_FORM_TITLE':
      return { ...state, formTitle: action.payload };

    case 'SET_FORM_DESCRIPTION':
      return { ...state, formDescription: action.payload };

    case 'ADD_FIELD': {
      const { field, index } = action.payload;
      const newFields = [...state.fields];
      if (index !== undefined) {
        newFields.splice(index, 0, field);
      } else {
        newFields.push(field);
      }
      return {
        ...state,
        fields: newFields,
        selectedFieldId: field.id,
      };
    }

    case 'UPDATE_FIELD': {
      const { id, updates } = action.payload;
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.id === id ? { ...field, ...updates } : field
        ),
      };
    }

    case 'DELETE_FIELD':
      return {
        ...state,
        fields: state.fields.filter((field) => field.id !== action.payload),
        selectedFieldId:
          state.selectedFieldId === action.payload
            ? null
            : state.selectedFieldId,
      };

    case 'REORDER_FIELDS': {
      const { fromIndex, toIndex } = action.payload;
      const newFields = [...state.fields];
      const [removed] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, removed);
      return { ...state, fields: newFields };
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
  reorderFields: (fromIndex: number, toIndex: number) => void;
  selectField: (id: string | null) => void;
  setMode: (mode: 'builder' | 'preview') => void;
  clearForm: () => void;
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

  return (
    <FormBuilderContext.Provider
      value={{
        state,
        dispatch,
        addField,
        updateField,
        deleteField,
        reorderFields,
        selectField,
        setMode,
        clearForm,
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
