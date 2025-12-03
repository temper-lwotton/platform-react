'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  FormBuilderState,
  FormBuilderAction,
  FormField,
  FormSection,
  FormSnapshot,
  FieldTemplate,
  FormExport,
  FieldType,
  FormTemplate,
} from '@/types/form-builder';
import { BUILT_IN_TEMPLATES } from './built-in-templates';
import { getForm, createForm, updateForm as updateFormApi, type CreateFormData } from '@/lib/forms';

const MAX_HISTORY = 50;
const MAX_RECENT_FIELDS = 10;

// Load favorites and recent from localStorage
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToLocalStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore errors
  }
};

const getInitialState = (formId?: number | null): FormBuilderState => ({
  formId: formId || undefined,
  formTitle: 'Untitled Form',
  formDescription: '',
  fields: [],
  sections: [],
  selectedFieldIds: [],
  selectedSectionId: null,
  clipboard: [],
  templates: BUILT_IN_TEMPLATES,
  formTemplates: loadFromLocalStorage<FormTemplate[]>('formBuilder.formTemplates', []),
  recentFieldTypes: loadFromLocalStorage<FieldType[]>('formBuilder.recentFieldTypes', []),
  favoriteFieldTypes: loadFromLocalStorage<FieldType[]>('formBuilder.favoriteFieldTypes', []),
  mode: 'builder',
  history: [],
  historyIndex: -1,
});

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
    sections: JSON.parse(JSON.stringify(state.sections)), // Deep copy
    selectedFieldIds: [...state.selectedFieldIds],
    selectedSectionId: state.selectedSectionId,
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
    sections: JSON.parse(JSON.stringify(snapshot.sections)), // Deep copy
    selectedFieldIds: [...snapshot.selectedFieldIds],
    selectedSectionId: snapshot.selectedSectionId,
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
      const { field, sectionId, index } = action.payload;
      const newFields = [...stateWithHistory.fields];

      if (index !== undefined) {
        newFields.splice(index, 0, field);
      } else {
        newFields.push(field);
      }

      let newSections = [...stateWithHistory.sections];
      if (sectionId) {
        newSections = newSections.map((section) =>
          section.id === sectionId
            ? { ...section, fieldIds: [...section.fieldIds, field.id] }
            : section
        );
      }

      // Track recently used field types
      const newRecentFieldTypes = [
        field.type,
        ...stateWithHistory.recentFieldTypes.filter((t) => t !== field.type),
      ].slice(0, MAX_RECENT_FIELDS);

      saveToLocalStorage('formBuilder.recentFieldTypes', newRecentFieldTypes);

      return {
        ...stateWithHistory,
        fields: newFields,
        sections: newSections,
        selectedFieldIds: [field.id],
        selectedSectionId: null,
        recentFieldTypes: newRecentFieldTypes,
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
      const fieldId = action.payload;

      // Remove field from sections
      const newSections = stateWithHistory.sections.map((section) => ({
        ...section,
        fieldIds: section.fieldIds.filter((id) => id !== fieldId),
      }));

      return {
        ...stateWithHistory,
        fields: stateWithHistory.fields.filter((field) => field.id !== fieldId),
        sections: newSections,
        selectedFieldIds: stateWithHistory.selectedFieldIds.filter((id) => id !== fieldId),
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
        validations: fieldToDuplicate.validations ? fieldToDuplicate.validations.map((v) => ({ ...v })) : [],
        options: fieldToDuplicate.options?.map((o) => ({ ...o })),
      };

      // Insert the duplicated field right after the original
      const originalIndex = stateWithHistory.fields.findIndex((f) => f.id === action.payload);
      const newFields = [...stateWithHistory.fields];
      newFields.splice(originalIndex + 1, 0, duplicatedField);

      return {
        ...stateWithHistory,
        fields: newFields,
        selectedFieldIds: [duplicatedField.id],
        selectedSectionId: null,
      };
    }

    case 'REORDER_FIELDS': {
      const stateWithHistory = saveToHistory(state);
      const { fromIndex, toIndex, fromSectionId, toSectionId } = action.payload;

      // Get the field being moved
      const fieldId = stateWithHistory.fields[fromIndex]?.id;
      if (!fieldId) return stateWithHistory;

      // Reorder in the fields array
      const newFields = [...stateWithHistory.fields];
      const [removed] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, removed);

      // Update sections if moving between sections
      let newSections = [...stateWithHistory.sections];

      // Remove from source section
      if (fromSectionId) {
        newSections = newSections.map((section) =>
          section.id === fromSectionId
            ? { ...section, fieldIds: section.fieldIds.filter((id) => id !== fieldId) }
            : section
        );
      }

      // Add to destination section
      if (toSectionId) {
        newSections = newSections.map((section) => {
          if (section.id === toSectionId) {
            // Add field if not already in the section
            if (!section.fieldIds.includes(fieldId)) {
              return { ...section, fieldIds: [...section.fieldIds, fieldId] };
            }
          }
          return section;
        });
      }

      return {
        ...stateWithHistory,
        fields: newFields,
        sections: newSections,
      };
    }

    case 'SELECT_FIELD': {
      const { id, multi, range } = action.payload;
      let newSelectedIds: string[] = [];

      if (range && state.selectedFieldIds.length > 0) {
        // Shift-click: select range
        const lastSelectedId = state.selectedFieldIds[state.selectedFieldIds.length - 1];
        const lastIndex = state.fields.findIndex((f) => f.id === lastSelectedId);
        const currentIndex = state.fields.findIndex((f) => f.id === id);

        if (lastIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastIndex, currentIndex);
          const end = Math.max(lastIndex, currentIndex);
          newSelectedIds = state.fields.slice(start, end + 1).map((f) => f.id);
        } else {
          newSelectedIds = [id];
        }
      } else if (multi) {
        // Cmd/Ctrl-click: toggle selection
        if (state.selectedFieldIds.includes(id)) {
          newSelectedIds = state.selectedFieldIds.filter((fid) => fid !== id);
        } else {
          newSelectedIds = [...state.selectedFieldIds, id];
        }
      } else {
        // Normal click: single select
        newSelectedIds = [id];
      }

      return {
        ...state,
        selectedFieldIds: newSelectedIds,
        selectedSectionId: null,
      };
    }

    case 'SELECT_ALL_FIELDS':
      return {
        ...state,
        selectedFieldIds: state.fields.map((f) => f.id),
        selectedSectionId: null,
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedFieldIds: [],
      };

    case 'ADD_SECTION': {
      const stateWithHistory = saveToHistory(state);
      const { section, index } = action.payload;
      const newSections = [...stateWithHistory.sections];
      if (index !== undefined) {
        newSections.splice(index, 0, section);
      } else {
        newSections.push(section);
      }
      return {
        ...stateWithHistory,
        sections: newSections,
        selectedSectionId: section.id,
        selectedFieldIds: [],
      };
    }

    case 'UPDATE_SECTION': {
      const stateWithHistory = saveToHistory(state);
      const { id, updates } = action.payload;
      return {
        ...stateWithHistory,
        sections: stateWithHistory.sections.map((section) =>
          section.id === id ? { ...section, ...updates } : section
        ),
      };
    }

    case 'DELETE_SECTION': {
      const stateWithHistory = saveToHistory(state);
      const sectionId = action.payload;
      const section = stateWithHistory.sections.find((s) => s.id === sectionId);

      // Remove fields that belong to this section
      const fieldsToRemove = section?.fieldIds || [];
      const newFields = stateWithHistory.fields.filter(
        (field) => !fieldsToRemove.includes(field.id)
      );

      return {
        ...stateWithHistory,
        sections: stateWithHistory.sections.filter((s) => s.id !== sectionId),
        fields: newFields,
        selectedSectionId:
          stateWithHistory.selectedSectionId === sectionId
            ? null
            : stateWithHistory.selectedSectionId,
      };
    }

    case 'DUPLICATE_SECTION': {
      const stateWithHistory = saveToHistory(state);
      const sectionToDuplicate = stateWithHistory.sections.find((s) => s.id === action.payload);
      if (!sectionToDuplicate) return stateWithHistory;

      // Duplicate the section
      const duplicatedSection: FormSection = {
        ...sectionToDuplicate,
        id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: incrementLabel(sectionToDuplicate.title),
        fieldIds: [],
      };

      // Duplicate fields in the section
      const duplicatedFields: FormField[] = [];
      const newFieldIds: string[] = [];

      sectionToDuplicate.fieldIds.forEach((fieldId) => {
        const originalField = stateWithHistory.fields.find((f) => f.id === fieldId);
        if (originalField) {
          const newFieldId = `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          duplicatedFields.push({
            ...originalField,
            id: newFieldId,
            validations: originalField.validations.map((v) => ({ ...v })),
            options: originalField.options?.map((o) => ({ ...o })),
          });
          newFieldIds.push(newFieldId);
        }
      });

      duplicatedSection.fieldIds = newFieldIds;

      // Insert section after the original
      const originalIndex = stateWithHistory.sections.findIndex((s) => s.id === action.payload);
      const newSections = [...stateWithHistory.sections];
      newSections.splice(originalIndex + 1, 0, duplicatedSection);

      return {
        ...stateWithHistory,
        sections: newSections,
        fields: [...stateWithHistory.fields, ...duplicatedFields],
        selectedSectionId: duplicatedSection.id,
        selectedFieldIds: [],
      };
    }

    case 'REORDER_SECTIONS': {
      const stateWithHistory = saveToHistory(state);
      const { fromIndex, toIndex } = action.payload;
      const newSections = [...stateWithHistory.sections];
      const [removed] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, removed);
      return { ...stateWithHistory, sections: newSections };
    }

    case 'BULK_DELETE_FIELDS': {
      const stateWithHistory = saveToHistory(state);
      const fieldIdsToDelete = action.payload;

      // Remove fields from sections
      const newSections = stateWithHistory.sections.map((section) => ({
        ...section,
        fieldIds: section.fieldIds.filter((id) => !fieldIdsToDelete.includes(id)),
      }));

      return {
        ...stateWithHistory,
        fields: stateWithHistory.fields.filter((field) => !fieldIdsToDelete.includes(field.id)),
        sections: newSections,
        selectedFieldIds: [],
      };
    }

    case 'BULK_DUPLICATE_FIELDS': {
      const stateWithHistory = saveToHistory(state);
      const fieldIdsToDuplicate = action.payload;
      const newFields = [...stateWithHistory.fields];
      const duplicatedIds: string[] = [];

      fieldIdsToDuplicate.forEach((fieldId) => {
        const fieldToDuplicate = stateWithHistory.fields.find((f) => f.id === fieldId);
        if (!fieldToDuplicate) return;

        const duplicatedField: FormField = {
          ...fieldToDuplicate,
          id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          label: incrementLabel(fieldToDuplicate.label),
          validations: fieldToDuplicate.validations ? fieldToDuplicate.validations.map((v) => ({ ...v })) : [],
          options: fieldToDuplicate.options?.map((o) => ({ ...o })),
        };

        const originalIndex = newFields.findIndex((f) => f.id === fieldId);
        newFields.splice(originalIndex + 1, 0, duplicatedField);
        duplicatedIds.push(duplicatedField.id);
      });

      return {
        ...stateWithHistory,
        fields: newFields,
        selectedFieldIds: duplicatedIds,
      };
    }

    case 'COPY_FIELDS': {
      const fieldIdsToCopy = action.payload;
      const fieldsToCopy = state.fields.filter((f) => fieldIdsToCopy.includes(f.id));

      return {
        ...state,
        clipboard: fieldsToCopy.map((field) => ({
          ...field,
          validations: field.validations ? field.validations.map((v) => ({ ...v })) : [],
          options: field.options?.map((o) => ({ ...o })),
        })),
      };
    }

    case 'PASTE_FIELDS': {
      if (state.clipboard.length === 0) return state;

      const stateWithHistory = saveToHistory(state);
      const { sectionId } = action.payload;
      const newFields = [...stateWithHistory.fields];
      const pastedIds: string[] = [];

      state.clipboard.forEach((field) => {
        const pastedField: FormField = {
          ...field,
          id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          validations: field.validations ? field.validations.map((v) => ({ ...v })) : [],
          options: field.options?.map((o) => ({ ...o })),
        };

        newFields.push(pastedField);
        pastedIds.push(pastedField.id);
      });

      let newSections = [...stateWithHistory.sections];
      if (sectionId) {
        newSections = newSections.map((section) =>
          section.id === sectionId
            ? { ...section, fieldIds: [...section.fieldIds, ...pastedIds] }
            : section
        );
      }

      return {
        ...stateWithHistory,
        fields: newFields,
        sections: newSections,
        selectedFieldIds: pastedIds,
      };
    }

    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.payload, selectedFieldIds: [] };

    case 'TOGGLE_SECTION': {
      const sectionId = action.payload;
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === sectionId
            ? { ...section, collapsed: !section.collapsed }
            : section
        ),
      };
    }

    case 'SET_MODE':
      return { ...state, mode: action.payload };

    case 'CLEAR_FORM':
      return {
        ...getInitialState(),
        formTitle: 'Untitled Form',
      };

    case 'LOAD_FORM':
      return action.payload;

    case 'TOGGLE_FAVORITE_FIELD_TYPE': {
      const fieldType = action.payload;
      const isFavorite = state.favoriteFieldTypes.includes(fieldType);

      const newFavoriteFieldTypes = isFavorite
        ? state.favoriteFieldTypes.filter((t) => t !== fieldType)
        : [...state.favoriteFieldTypes, fieldType];

      saveToLocalStorage('formBuilder.favoriteFieldTypes', newFavoriteFieldTypes);

      return {
        ...state,
        favoriteFieldTypes: newFavoriteFieldTypes,
      };
    }

    case 'IMPORT_FORM': {
      const importData = action.payload;
      const stateWithHistory = saveToHistory(state);

      // Import custom templates if any
      const customTemplates = importData.customTemplates || [];
      const newTemplates = [
        ...BUILT_IN_TEMPLATES,
        ...customTemplates.filter((t) => !t.isBuiltIn),
      ];

      return {
        ...stateWithHistory,
        formTitle: importData.formTitle,
        formDescription: importData.formDescription,
        fields: importData.fields,
        sections: importData.sections,
        templates: newTemplates,
        selectedFieldIds: [],
        selectedSectionId: null,
      };
    }

    case 'ADD_TEMPLATE': {
      return {
        ...state,
        templates: [...state.templates, action.payload],
      };
    }

    case 'DELETE_TEMPLATE': {
      return {
        ...state,
        templates: state.templates.filter((t) => t.id !== action.payload),
      };
    }

    case 'UPDATE_TEMPLATE': {
      const { id, updates } = action.payload;
      return {
        ...state,
        templates: state.templates.map((template) =>
          template.id === id ? { ...template, ...updates } : template
        ),
      };
    }

    case 'ADD_FIELD_FROM_TEMPLATE': {
      const { templateId, sectionId } = action.payload;
      const template = state.templates.find((t) => t.id === templateId);

      if (!template) return state;

      const stateWithHistory = saveToHistory(state);

      // Create a new field from the template
      const newField: FormField = {
        ...template.field,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const newFields = [...stateWithHistory.fields, newField];
      let newSections = [...stateWithHistory.sections];

      // If a section is specified, add the field to that section
      if (sectionId) {
        newSections = newSections.map((section) =>
          section.id === sectionId
            ? { ...section, fieldIds: [...section.fieldIds, newField.id] }
            : section
        );
      }

      return {
        ...stateWithHistory,
        fields: newFields,
        sections: newSections,
        selectedFieldIds: [newField.id],
      };
    }

    case 'SAVE_FORM_TEMPLATE': {
      const { name, description } = action.payload;

      // Create field mapping for sections
      const sectionFieldMapping = state.sections.map((section, sectionIndex) => ({
        sectionIndex,
        fieldIndices: section.fieldIds.map((fieldId) =>
          state.fields.findIndex((f) => f.id === fieldId)
        ).filter((index) => index !== -1),
      }));

      // Remove IDs from fields
      const fieldsWithoutIds = state.fields.map(({ id, ...field }) => field);

      // Remove IDs and fieldIds from sections
      const sectionsWithoutIds = state.sections.map(({ id, fieldIds, ...section }) => section);

      const newTemplate: FormTemplate = {
        id: `form-template-${Date.now()}`,
        name,
        description,
        formTitle: state.formTitle,
        formDescription: state.formDescription,
        fields: fieldsWithoutIds,
        sections: sectionsWithoutIds,
        sectionFieldMapping,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const newFormTemplates = [...state.formTemplates, newTemplate];
      saveToLocalStorage('formBuilder.formTemplates', newFormTemplates);

      return {
        ...state,
        formTemplates: newFormTemplates,
      };
    }

    case 'LOAD_FORM_TEMPLATE': {
      const templateId = action.payload;
      const template = state.formTemplates.find((t) => t.id === templateId);

      if (!template) return state;

      const stateWithHistory = saveToHistory(state);

      // Generate new IDs for all fields
      const newFields: FormField[] = template.fields.map((field, index) => ({
        ...field,
        id: `field-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      // Generate new IDs for sections and map field IDs
      const newSections: FormSection[] = template.sections.map((section, sectionIndex) => {
        // Find the mapping for this section
        const mapping = template.sectionFieldMapping.find((m) => m.sectionIndex === sectionIndex);
        const fieldIds = mapping
          ? mapping.fieldIndices.map((fieldIndex) => newFields[fieldIndex]?.id).filter(Boolean)
          : [];

        return {
          ...section,
          id: `section-${Date.now()}-${sectionIndex}`,
          fieldIds,
        };
      });

      return {
        ...stateWithHistory,
        formTitle: template.formTitle,
        formDescription: template.formDescription,
        fields: newFields,
        sections: newSections,
        selectedFieldIds: [],
        selectedSectionId: null,
      };
    }

    case 'DELETE_FORM_TEMPLATE': {
      const newFormTemplates = state.formTemplates.filter((t) => t.id !== action.payload);
      saveToLocalStorage('formBuilder.formTemplates', newFormTemplates);

      return {
        ...state,
        formTemplates: newFormTemplates,
      };
    }

    case 'UPDATE_FORM_TEMPLATE': {
      const { id, updates } = action.payload;
      const newFormTemplates = state.formTemplates.map((template) =>
        template.id === id ? { ...template, ...updates, updatedAt: Date.now() } : template
      );
      saveToLocalStorage('formBuilder.formTemplates', newFormTemplates);

      return {
        ...state,
        formTemplates: newFormTemplates,
      };
    }

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
  // Field helper functions
  addField: (field: FormField, sectionId?: string, index?: number) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  deleteField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number, fromSectionId?: string, toSectionId?: string) => void;
  selectField: (id: string, multi?: boolean, range?: boolean) => void;
  selectAllFields: () => void;
  clearSelection: () => void;
  // Bulk operations
  bulkDeleteFields: (ids: string[]) => void;
  bulkDuplicateFields: (ids: string[]) => void;
  copyFields: (ids: string[]) => void;
  pasteFields: (sectionId?: string) => void;
  // Template helper functions
  addTemplate: (template: FieldTemplate) => void;
  deleteTemplate: (id: string) => void;
  updateTemplate: (id: string, updates: Partial<FieldTemplate>) => void;
  addFieldFromTemplate: (templateId: string, sectionId?: string) => void;
  saveFieldAsTemplate: (fieldId: string, name: string, description?: string) => void;
  // Form Template helper functions
  saveFormAsTemplate: (name: string, description?: string) => void;
  loadFormTemplate: (id: string) => void;
  deleteFormTemplate: (id: string) => void;
  updateFormTemplate: (id: string, updates: Partial<FormTemplate>) => void;
  // Import/Export functions
  exportForm: () => FormExport;
  exportFormAsJSON: () => string;
  downloadFormJSON: () => void;
  importForm: (json: string) => { success: boolean; error?: string };
  // Favorites helper function
  toggleFavoriteFieldType: (fieldType: FieldType) => void;
  // Section helper functions
  addSection: (section: FormSection, index?: number) => void;
  updateSection: (id: string, updates: Partial<FormSection>) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  selectSection: (id: string | null) => void;
  toggleSection: (id: string) => void;
  // General functions
  setMode: (mode: 'builder' | 'preview') => void;
  clearForm: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // API functions
  saveForm: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
  loadError: Error | null;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(
  undefined
);

export function FormBuilderProvider({ children, formId }: { children: ReactNode; formId?: number | null }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(formBuilderReducer, getInitialState(formId));
  const [isInitialized, setIsInitialized] = useState(false);

  // Load form from API if formId is provided
  const { data: loadedForm, isLoading, error: loadError } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => getForm(formId!),
    enabled: !!formId && formId > 0,
  });

  // Initialize form data when loaded
  useEffect(() => {
    if (loadedForm && !isInitialized) {
      // Load the form data into state
      dispatch({ type: 'SET_FORM_TITLE', payload: loadedForm.title });
      dispatch({ type: 'SET_FORM_DESCRIPTION', payload: loadedForm.description || '' });

      // Load sections first with proper transformation
      loadedForm.sections.forEach((apiSection, index) => {
        const section: FormSection = {
          ...apiSection,
          id: String(apiSection.id), // Ensure ID is a string
          fieldIds: apiSection.fieldIds.map(id => String(id)), // Ensure field IDs are strings
        };
        dispatch({ type: 'ADD_SECTION', payload: { section, index } });
      });

      // Load fields with proper transformation
      loadedForm.fields.forEach((apiField, index) => {
        const sectionId = loadedForm.sections.find(s =>
          s.fieldIds.includes(apiField.id)
        )?.id;
        const transformedSectionId = sectionId ? String(sectionId) : undefined;

        // Transform API field to FormField format
        const field: FormField = {
          id: String(apiField.id), // Ensure ID is a string
          type: apiField.type,
          label: apiField.label || '',
          placeholder: apiField.placeholder,
          helpText: apiField.helpText,
          required: apiField.required || false,
          validations: [], // Initialize empty validations array
          // Copy other properties
          ...(apiField as any),
        };

        dispatch({ type: 'ADD_FIELD', payload: { field, sectionId: transformedSectionId, index } });
      });

      setIsInitialized(true);
    }
  }, [loadedForm, isInitialized]);

  // Save form mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const formData: CreateFormData = {
        title: state.formTitle,
        description: state.formDescription || undefined,
        settings: {
          submitButtonText: 'Submit',
          successMessage: 'Form submitted successfully!',
          allowMultipleSubmissions: true,
        },
        fields: state.fields.map((field, index) => {
          const sectionIndex = state.sections.findIndex(s => s.fieldIds.includes(field.id));
          return {
            type: field.type,
            label: field.label || '',
            placeholder: (field as any).placeholder,
            helpText: (field as any).helpText,
            isRequired: field.required || false,
            displayOrder: index,
            sectionIndex: sectionIndex >= 0 ? sectionIndex : undefined,
            config: (field as any).config || {},
            validationRules: field.validations && field.validations.length > 0
              ? field.validations.reduce((acc, v) => ({ ...acc, [v.type]: v.value }), {})
              : null,
            conditionalLogic: (field as any).conditionalLogic || null,
          };
        }),
        sections: state.sections.map((section, index) => ({
          title: section.title,
          description: section.description,
          displayOrder: index,
          isCollapsible: section.isCollapsible || false,
          isCollapsedByDefault: section.isCollapsedByDefault || false,
        })),
      };

      if (formId && formId > 0) {
        return updateFormApi(formId, formData);
      } else {
        return createForm(formData);
      }
    },
    onSuccess: (savedForm) => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['form', formId] });

      // If this was a new form, redirect to edit page
      if (!formId || formId <= 0) {
        router.push(`/form-builder/${savedForm.id}`);
      }
    },
  });

  const saveForm = async () => {
    await saveMutation.mutateAsync();
  };

  // Field helper functions
  const addField = (field: FormField, sectionId?: string, index?: number) => {
    dispatch({ type: 'ADD_FIELD', payload: { field, sectionId, index } });
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

  const reorderFields = (fromIndex: number, toIndex: number, fromSectionId?: string, toSectionId?: string) => {
    dispatch({ type: 'REORDER_FIELDS', payload: { fromIndex, toIndex, fromSectionId, toSectionId } });
  };

  const selectField = (id: string, multi: boolean = false, range: boolean = false) => {
    dispatch({ type: 'SELECT_FIELD', payload: { id, multi, range } });
  };

  const selectAllFields = () => {
    dispatch({ type: 'SELECT_ALL_FIELDS' });
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  // Bulk operations
  const bulkDeleteFields = (ids: string[]) => {
    dispatch({ type: 'BULK_DELETE_FIELDS', payload: ids });
  };

  const bulkDuplicateFields = (ids: string[]) => {
    dispatch({ type: 'BULK_DUPLICATE_FIELDS', payload: ids });
  };

  const copyFields = (ids: string[]) => {
    dispatch({ type: 'COPY_FIELDS', payload: ids });
  };

  const pasteFields = (sectionId?: string) => {
    dispatch({ type: 'PASTE_FIELDS', payload: { sectionId } });
  };

  // Template helper functions
  const addTemplate = (template: FieldTemplate) => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const deleteTemplate = (id: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  };

  const updateTemplate = (id: string, updates: Partial<FieldTemplate>) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: { id, updates } });
  };

  const addFieldFromTemplate = (templateId: string, sectionId?: string) => {
    dispatch({ type: 'ADD_FIELD_FROM_TEMPLATE', payload: { templateId, sectionId } });
  };

  const saveFieldAsTemplate = (fieldId: string, name: string, description?: string) => {
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field) return;

    const template: FieldTemplate = {
      id: `template-custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      category: 'custom',
      field: {
        type: field.type,
        label: field.label,
        placeholder: field.placeholder,
        helpText: field.helpText,
        defaultValue: field.defaultValue,
        validations: field.validations ? JSON.parse(JSON.stringify(field.validations)) : [],
        options: field.options ? JSON.parse(JSON.stringify(field.options)) : undefined,
        multiple: field.multiple,
        accept: field.accept,
        min: field.min,
        max: field.max,
        step: field.step,
        rows: field.rows,
        width: field.width,
        required: field.required,
      },
      isBuiltIn: false,
      createdAt: Date.now(),
    };

    addTemplate(template);
  };

  // Section helper functions
  const addSection = (section: FormSection, index?: number) => {
    dispatch({ type: 'ADD_SECTION', payload: { section, index } });
  };

  const updateSection = (id: string, updates: Partial<FormSection>) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { id, updates } });
  };

  const deleteSection = (id: string) => {
    dispatch({ type: 'DELETE_SECTION', payload: id });
  };

  const duplicateSection = (id: string) => {
    dispatch({ type: 'DUPLICATE_SECTION', payload: id });
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: { fromIndex, toIndex } });
  };

  const selectSection = (id: string | null) => {
    dispatch({ type: 'SELECT_SECTION', payload: id });
  };

  const toggleSection = (id: string) => {
    dispatch({ type: 'TOGGLE_SECTION', payload: id });
  };

  // Import/Export functions
  const exportForm = (): FormExport => {
    const customTemplates = state.templates.filter((t) => !t.isBuiltIn);

    return {
      version: '1.0',
      exportedAt: Date.now(),
      formTitle: state.formTitle,
      formDescription: state.formDescription,
      fields: state.fields,
      sections: state.sections,
      customTemplates: customTemplates.length > 0 ? customTemplates : undefined,
    };
  };

  const exportFormAsJSON = (): string => {
    return JSON.stringify(exportForm(), null, 2);
  };

  const downloadFormJSON = () => {
    const json = exportFormAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importForm = (json: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(json);

      // Validate the structure
      if (!parsed.version || !parsed.formTitle || !Array.isArray(parsed.fields)) {
        return {
          success: false,
          error: 'Invalid form format: missing required fields',
        };
      }

      // Check version compatibility
      if (parsed.version !== '1.0') {
        return {
          success: false,
          error: `Unsupported version: ${parsed.version}. Expected 1.0`,
        };
      }

      // Validate fields
      if (!parsed.fields.every((f: any) => f.id && f.type && f.label)) {
        return {
          success: false,
          error: 'Invalid field format in imported data',
        };
      }

      // Validate sections
      if (parsed.sections && !Array.isArray(parsed.sections)) {
        return {
          success: false,
          error: 'Invalid sections format',
        };
      }

      dispatch({ type: 'IMPORT_FORM', payload: parsed as FormExport });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to parse JSON',
      };
    }
  };

  // Form Template helper functions
  const saveFormAsTemplate = (name: string, description?: string) => {
    dispatch({ type: 'SAVE_FORM_TEMPLATE', payload: { name, description } });
  };

  const loadFormTemplate = (id: string) => {
    dispatch({ type: 'LOAD_FORM_TEMPLATE', payload: id });
  };

  const deleteFormTemplate = (id: string) => {
    dispatch({ type: 'DELETE_FORM_TEMPLATE', payload: id });
  };

  const updateFormTemplate = (id: string, updates: Partial<FormTemplate>) => {
    dispatch({ type: 'UPDATE_FORM_TEMPLATE', payload: { id, updates } });
  };

  // Favorites helper function
  const toggleFavoriteFieldType = (fieldType: FieldType) => {
    dispatch({ type: 'TOGGLE_FAVORITE_FIELD_TYPE', payload: fieldType });
  };

  // General functions
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

  // Show loading state while fetching form
  if (formId && formId > 0 && isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p>Loading form...</p>
      </div>
    );
  }

  // Show error state if form failed to load
  if (formId && formId > 0 && loadError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <h2>Failed to load form</h2>
        <p>{loadError.message}</p>
        <button onClick={() => router.push('/forms')} style={{
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          Back to Forms
        </button>
      </div>
    );
  }

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
        selectAllFields,
        clearSelection,
        bulkDeleteFields,
        bulkDuplicateFields,
        copyFields,
        pasteFields,
        addTemplate,
        deleteTemplate,
        updateTemplate,
        addFieldFromTemplate,
        saveFieldAsTemplate,
        saveFormAsTemplate,
        loadFormTemplate,
        deleteFormTemplate,
        updateFormTemplate,
        exportForm,
        exportFormAsJSON,
        downloadFormJSON,
        importForm,
        toggleFavoriteFieldType,
        addSection,
        updateSection,
        deleteSection,
        duplicateSection,
        reorderSections,
        selectSection,
        toggleSection,
        setMode,
        clearForm,
        undo,
        redo,
        canUndo,
        canRedo,
        saveForm,
        isSaving: saveMutation.isPending,
        isLoading,
        loadError,
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
