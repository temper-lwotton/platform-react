// Form Builder Type Definitions

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'tel'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkbox-group'
  | 'date'
  | 'time'
  | 'file'
  | 'switch'
  | 'rating'
  | 'slider'
  | 'signature'
  | 'color'
  | 'url'
  | 'currency'
  | 'file-multiple';

export type ValidationType =
  | 'required'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'url'
  | 'custom';

export interface ValidationRule {
  id: string;
  type: ValidationType;
  value?: string | number | RegExp;
  message: string;
}

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;

  // Validation
  validations: ValidationRule[];

  // Field-specific config
  options?: FieldOption[]; // For select, radio, checkbox-group
  multiple?: boolean; // For select, file
  accept?: string; // For file uploads
  min?: number; // For number, slider, rating
  max?: number; // For number, slider, rating
  step?: number; // For number, slider
  rows?: number; // For textarea

  // Conditional logic (future enhancement)
  conditionalLogic?: {
    show: boolean;
    when: string; // field id
    is: any; // value to compare
  };

  // Layout
  width?: 'full' | 'half' | 'third';
  required?: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormSnapshot {
  formId?: string;
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
  selectedFieldId?: string | null;
}

export interface FormBuilderState {
  formId?: string;
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
  selectedFieldId?: string | null;
  mode: 'builder' | 'preview';
  history: FormSnapshot[];
  historyIndex: number;
}

export type FormBuilderAction =
  | { type: 'SET_FORM_TITLE'; payload: string }
  | { type: 'SET_FORM_DESCRIPTION'; payload: string }
  | { type: 'ADD_FIELD'; payload: { field: FormField; index?: number } }
  | { type: 'UPDATE_FIELD'; payload: { id: string; updates: Partial<FormField> } }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'DUPLICATE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SELECT_FIELD'; payload: string | null }
  | { type: 'SET_MODE'; payload: 'builder' | 'preview' }
  | { type: 'CLEAR_FORM' }
  | { type: 'LOAD_FORM'; payload: FormBuilderState }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// Field palette item definition
export interface FieldPaletteItem {
  type: FieldType;
  icon: string;
  label: string;
  description: string;
  defaultConfig: Partial<FormField>;
}

// Form submission types (for runtime validation)
export interface FormSubmissionData {
  [fieldId: string]: any;
}

export interface FormValidationError {
  fieldId: string;
  message: string;
}
