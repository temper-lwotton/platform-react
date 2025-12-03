import FormBuilder from '@/components/form-builder/FormBuilder';

export const metadata = {
  title: 'New Form - Form Builder',
  description: 'Create a new form with drag-and-drop interface',
};

export default function NewFormPage() {
  return <FormBuilder formId={null} />;
}
