'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useFormBuilder } from '../FormBuilderProvider';
import FieldRenderer from '../fields/FieldRenderer';
import { Button } from '@/components/ui/primitives/Button';
import { FormSubmissionData } from '@/types/form-builder';
import { CheckCircle2 } from 'lucide-react';
import styles from './FormPreview.module.scss';

export default function FormPreview() {
  const { state } = useFormBuilder();
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<FormSubmissionData | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: state.fields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || '';
      return acc;
    }, {} as FormSubmissionData),
  });

  const onSubmit = (data: FormSubmissionData) => {
    console.log('Form submitted:', data);
    setSubmittedData(data);
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
    setSubmittedData(null);
  };

  if (state.fields.length === 0) {
    return (
      <div className={styles.preview}>
        <div className={styles.emptyState}>
          <p>Add fields to see the form preview</p>
        </div>
      </div>
    );
  }

  if (submitted && submittedData) {
    return (
      <div className={styles.preview}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={48} />
          </div>
          <h2>Form Submitted Successfully!</h2>
          <p>This is a preview of your form. In production, the data would be sent to your backend.</p>

          <div className={styles.submittedData}>
            <h3>Submitted Data:</h3>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>

          <Button onClick={handleReset} variant="primary">
            Reset Form
          </Button>
        </div>
      </div>
    );
  }

  // Build validation rules for React Hook Form
  const getValidationRules = (field: any) => {
    const rules: any = {};

    field.validations.forEach((validation: any) => {
      switch (validation.type) {
        case 'required':
          rules.required = validation.message || 'This field is required';
          break;
        case 'minLength':
          rules.minLength = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'maxLength':
          rules.maxLength = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'min':
          rules.min = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'max':
          rules.max = {
            value: validation.value,
            message: validation.message,
          };
          break;
        case 'pattern':
          rules.pattern = {
            value: new RegExp(validation.value),
            message: validation.message,
          };
          break;
        case 'email':
          rules.pattern = {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: validation.message,
          };
          break;
      }
    });

    return rules;
  };

  return (
    <div className={styles.preview}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>{state.formTitle}</h1>
          {state.formDescription && <p>{state.formDescription}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.fieldsGrid}>
            {state.fields.map((field) => (
              <Controller
                key={field.id}
                name={field.id}
                control={control}
                rules={getValidationRules(field)}
                render={({ field: { value, onChange } }) => (
                  <FieldRenderer
                    field={field}
                    value={value}
                    onChange={onChange}
                    error={errors[field.id]?.message as string}
                  />
                )}
              />
            ))}
          </div>

          <div className={styles.formActions}>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
