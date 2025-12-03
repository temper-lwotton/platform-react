import { apiFetch } from './api-client';
import type { FormField, FormSection } from '@/types/form-builder';

// Form Settings Type
export interface FormBuilderSettings {
  submitButtonText?: string;
  successMessage?: string;
  allowMultipleSubmissions?: boolean;
}

// API Response Types
export interface FormListItem {
  id: number;
  title: string;
  description: string | null;
  settings: FormBuilderSettings;
  fieldCount: number;
  sectionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormListResponse {
  data: FormListItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface Form {
  id: number;
  title: string;
  description: string | null;
  settings: FormBuilderSettings;
  fields: FormField[];
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListItem {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  isOwner: boolean;
  formTitle: string;
  formDescription: string | null;
  fieldCount: number;
  sectionCount: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListResponse {
  data: TemplateListItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface Template {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  isOwner: boolean;
  formTitle: string;
  formDescription: string | null;
  templateData: {
    fields: Omit<FormField, 'id'>[];
    sections: Omit<FormSection, 'id' | 'fieldIds'>[];
    sectionFieldMapping?: { sectionIndex: number; fieldIndices: number[] }[];
  };
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateLoadResponse {
  formTitle: string;
  formDescription: string | null;
  fields: Omit<FormField, 'id'>[];
  sections: Omit<FormSection, 'id' | 'fieldIds'>[];
  sectionFieldMapping?: { sectionIndex: number; fieldIndices: number[] }[];
}

export interface CreateFormData {
  title: string;
  description?: string;
  settings?: Partial<FormBuilderSettings>;
  sections?: Array<{
    title: string;
    description?: string;
    displayOrder: number;
    isCollapsible: boolean;
    isCollapsedByDefault: boolean;
  }>;
  fields?: Array<{
    type: string;
    label: string;
    placeholder?: string;
    helpText?: string;
    isRequired: boolean;
    displayOrder: number;
    sectionIndex?: number;
    config: Record<string, any>;
    validationRules?: Record<string, any> | null;
    conditionalLogic?: Record<string, any> | null;
  }>;
}

export interface UpdateFormData extends Partial<CreateFormData> {}

export interface CreateTemplateData {
  name: string;
  description?: string;
  isPublic: boolean;
  formTitle: string;
  formDescription?: string;
  templateData: {
    fields: Omit<FormField, 'id'>[];
    sections: Omit<FormSection, 'id' | 'fieldIds'>[];
    sectionFieldMapping?: { sectionIndex: number; fieldIndices: number[] }[];
  };
}

export interface FormExportData {
  version: string;
  exportDate: string;
  form: {
    title: string;
    description: string | null;
    settings: FormBuilderSettings;
    fields: FormField[];
    sections: FormSection[];
  };
}

// Query Parameters
export interface FormListParams {
  page?: number;
  limit?: number;
  sort?: 'createdAt' | 'updatedAt' | 'title';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface TemplateListParams {
  page?: number;
  limit?: number;
  includePublic?: boolean;
  sort?: 'createdAt' | 'updatedAt' | 'name';
  order?: 'asc' | 'desc';
}

// Helper to convert camelCase to snake_case for API
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Forms API Functions
export async function getForms(params?: FormListParams): Promise<FormListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.sort) queryParams.append('sort', toSnakeCase(params.sort));
  if (params?.order) queryParams.append('order', params.order);
  if (params?.search) queryParams.append('search', params.search);

  const query = queryParams.toString();
  return apiFetch<FormListResponse>(`/api/forms${query ? `?${query}` : ''}`);
}

export async function getForm(id: number): Promise<Form> {
  return apiFetch<Form>(`/api/forms/${id}`);
}

export async function createForm(data: CreateFormData): Promise<Form> {
  return apiFetch<Form>('/api/forms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateForm(id: number, data: UpdateFormData): Promise<Form> {
  return apiFetch<Form>(`/api/forms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteForm(id: number): Promise<void> {
  return apiFetch<void>(`/api/forms/${id}`, {
    method: 'DELETE',
  });
}

export async function duplicateForm(id: number, title?: string): Promise<Form> {
  return apiFetch<Form>(`/api/forms/${id}/duplicate`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function exportForm(id: number): Promise<FormExportData> {
  return apiFetch<FormExportData>(`/api/forms/${id}/export`);
}

export async function importForm(data: { version: string; form: any }): Promise<Form> {
  return apiFetch<Form>('/api/forms/import', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Templates API Functions
export async function getTemplates(params?: TemplateListParams): Promise<TemplateListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.includePublic !== undefined) queryParams.append('includePublic', String(params.includePublic));
  if (params?.sort) queryParams.append('sort', toSnakeCase(params.sort));
  if (params?.order) queryParams.append('order', params.order);

  const query = queryParams.toString();
  return apiFetch<TemplateListResponse>(`/api/templates${query ? `?${query}` : ''}`);
}

export async function getTemplate(id: number): Promise<Template> {
  return apiFetch<Template>(`/api/templates/${id}`);
}

export async function createTemplate(data: CreateTemplateData): Promise<Template> {
  return apiFetch<Template>('/api/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTemplate(id: number, data: Partial<CreateTemplateData>): Promise<Template> {
  return apiFetch<Template>(`/api/templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTemplate(id: number): Promise<void> {
  return apiFetch<void>(`/api/templates/${id}`, {
    method: 'DELETE',
  });
}

export async function loadTemplate(id: number): Promise<TemplateLoadResponse> {
  return apiFetch<TemplateLoadResponse>(`/api/templates/${id}/load`, {
    method: 'POST',
  });
}

// Field Operations
export async function addField(formId: number, field: any): Promise<FormField> {
  return apiFetch<FormField>(`/api/forms/${formId}/fields`, {
    method: 'POST',
    body: JSON.stringify(field),
  });
}

export async function updateField(formId: number, fieldId: string, field: any): Promise<FormField> {
  return apiFetch<FormField>(`/api/forms/${formId}/fields/${fieldId}`, {
    method: 'PUT',
    body: JSON.stringify(field),
  });
}

export async function deleteField(formId: number, fieldId: string): Promise<void> {
  return apiFetch<void>(`/api/forms/${formId}/fields/${fieldId}`, {
    method: 'DELETE',
  });
}

export async function reorderFields(formId: number, fieldOrders: Array<{ id: string; displayOrder: number }>): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/api/forms/${formId}/fields/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldOrders }),
  });
}

export async function bulkUpdateFields(formId: number, fieldIds: string[], updates: any): Promise<{ success: boolean; updatedCount: number; fields: FormField[] }> {
  return apiFetch<{ success: boolean; updatedCount: number; fields: FormField[] }>(`/api/forms/${formId}/fields/bulk-update`, {
    method: 'PATCH',
    body: JSON.stringify({ fieldIds, updates }),
  });
}

export async function bulkDeleteFields(formId: number, fieldIds: string[]): Promise<{ success: boolean; deletedCount: number }> {
  return apiFetch<{ success: boolean; deletedCount: number }>(`/api/forms/${formId}/fields/bulk-delete`, {
    method: 'DELETE',
    body: JSON.stringify({ fieldIds }),
  });
}

// Section Operations
export async function addSection(formId: number, section: any): Promise<FormSection> {
  return apiFetch<FormSection>(`/api/forms/${formId}/sections`, {
    method: 'POST',
    body: JSON.stringify(section),
  });
}

export async function updateSection(formId: number, sectionId: string, section: any): Promise<FormSection> {
  return apiFetch<FormSection>(`/api/forms/${formId}/sections/${sectionId}`, {
    method: 'PUT',
    body: JSON.stringify(section),
  });
}

export async function deleteSection(formId: number, sectionId: string, moveFieldsTo?: number): Promise<void> {
  const queryParams = moveFieldsTo ? `?moveFieldsTo=${moveFieldsTo}` : '';
  return apiFetch<void>(`/api/forms/${formId}/sections/${sectionId}${queryParams}`, {
    method: 'DELETE',
  });
}

export async function reorderSections(formId: number, sectionOrders: Array<{ id: string; displayOrder: number }>): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>(`/api/forms/${formId}/sections/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ sectionOrders }),
  });
}
