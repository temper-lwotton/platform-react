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
  | 'custom'
  | 'crossField';

export interface ValidationRule {
  id: string;
  type: ValidationType;
  value?: string | number | RegExp;
  message: string;
  // For custom validation
  customFunction?: string; // JavaScript function as string
  // For cross-field validation
  compareToFieldId?: string;
  comparisonOperator?: ComparisonOperator;
}

export type ComparisonOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';

export interface ConditionalRule {
  id: string;
  fieldId: string; // The field to check
  operator: ComparisonOperator;
  value?: any; // The value to compare against
}

export interface ConditionalLogic {
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require'; // What to do when conditions are met
  logicType: 'all' | 'any'; // AND or OR
  conditions: ConditionalRule[]; // Array of conditions
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

  // Conditional logic
  conditionalLogic?: ConditionalLogic;

  // Layout
  width?: 'full' | 'half' | 'third';
  required?: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  collapsed?: boolean;
  isCollapsible?: boolean;
  isCollapsedByDefault?: boolean;
  fieldIds: string[]; // References to field IDs
}

export interface FormSnapshot {
  formId?: string | number;
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
  sections: FormSection[];
  selectedFieldIds: string[];
  selectedSectionId?: string | null;
}

export interface FormBuilderState {
  formId?: string | number;
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
  sections: FormSection[];
  selectedFieldIds: string[];
  selectedSectionId?: string | null;
  clipboard: FormField[];
  templates: FieldTemplate[];
  formTemplates: FormTemplate[]; // User-saved form templates
  recentFieldTypes: FieldType[]; // Track recently used field types
  favoriteFieldTypes: FieldType[]; // Track favorited field types
  mode: 'builder' | 'preview';
  history: FormSnapshot[];
  historyIndex: number;
}

export type FormBuilderAction =
  | { type: 'SET_FORM_TITLE'; payload: string }
  | { type: 'SET_FORM_DESCRIPTION'; payload: string }
  | { type: 'ADD_FIELD'; payload: { field: FormField; sectionId?: string; index?: number } }
  | { type: 'UPDATE_FIELD'; payload: { id: string; updates: Partial<FormField> } }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'DUPLICATE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: { fromIndex: number; toIndex: number; fromSectionId?: string; toSectionId?: string } }
  | { type: 'SELECT_FIELD'; payload: { id: string; multi?: boolean; range?: boolean } }
  | { type: 'SELECT_ALL_FIELDS' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'BULK_DELETE_FIELDS'; payload: string[] }
  | { type: 'BULK_DUPLICATE_FIELDS'; payload: string[] }
  | { type: 'COPY_FIELDS'; payload: string[] }
  | { type: 'PASTE_FIELDS'; payload: { sectionId?: string } }
  | { type: 'ADD_SECTION'; payload: { section: FormSection; index?: number } }
  | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<FormSection> } }
  | { type: 'DELETE_SECTION'; payload: string }
  | { type: 'DUPLICATE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'TOGGLE_SECTION'; payload: string }
  | { type: 'ADD_TEMPLATE'; payload: FieldTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'UPDATE_TEMPLATE'; payload: { id: string; updates: Partial<FieldTemplate> } }
  | { type: 'ADD_FIELD_FROM_TEMPLATE'; payload: { templateId: string; sectionId?: string } }
  | { type: 'SAVE_FORM_TEMPLATE'; payload: { name: string; description?: string } }
  | { type: 'LOAD_FORM_TEMPLATE'; payload: string } // template ID
  | { type: 'DELETE_FORM_TEMPLATE'; payload: string }
  | { type: 'UPDATE_FORM_TEMPLATE'; payload: { id: string; updates: Partial<FormTemplate> } }
  | { type: 'TOGGLE_FAVORITE_FIELD_TYPE'; payload: FieldType }
  | { type: 'IMPORT_FORM'; payload: FormExport }
  | { type: 'SET_MODE'; payload: 'builder' | 'preview' }
  | { type: 'CLEAR_FORM' }
  | { type: 'LOAD_FORM'; payload: FormBuilderState }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// Export format for forms
export interface FormExport {
  version: string; // Schema version for future compatibility
  exportedAt: number; // Timestamp
  formTitle: string;
  formDescription?: string;
  fields: FormField[];
  sections: FormSection[];
  customTemplates?: FieldTemplate[]; // Only custom templates, not built-in
}

// Field palette item definition
export interface FieldPaletteItem {
  type: FieldType;
  icon: string;
  label: string;
  description: string;
  defaultConfig: Partial<FormField>;
}

// Field template definition
export interface FieldTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'custom' | 'contact' | 'address' | 'payment' | 'date-time' | 'personal' | 'other';
  field: Omit<FormField, 'id'>; // Field without ID (will be generated on use)
  isBuiltIn?: boolean; // Built-in templates can't be deleted
  createdAt?: number;
}

// Form template definition (entire form configuration)
export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  formTitle: string;
  formDescription?: string;
  fields: Omit<FormField, 'id'>[]; // Fields without IDs (will be generated on use)
  sections: Omit<FormSection, 'id' | 'fieldIds'>[]; // Sections without IDs, fieldIds will be mapped
  sectionFieldMapping: { sectionIndex: number; fieldIndices: number[] }[]; // Maps section to field indices
  createdAt: number;
  updatedAt: number;
}

// Form submission types (for runtime validation)
export interface FormSubmissionData {
  [fieldId: string]: any;
}

export interface FormValidationError {
  fieldId: string;
  message: string;
}
