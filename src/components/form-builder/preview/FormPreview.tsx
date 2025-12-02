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
    watch,
  } = useForm({
    defaultValues: state.fields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || '';
      return acc;
    }, {} as FormSubmissionData),
  });

  // Watch all form values for conditional logic
  const formValues = watch();

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

  // Evaluate if a field should be visible based on conditional logic
  const isFieldVisible = (field: any): boolean => {
    if (!field.conditionalLogic) return true;

    const { show, when, is } = field.conditionalLogic;
    const targetValue = formValues[when];

    // Compare values
    let conditionMet = false;
    if (typeof is === 'boolean') {
      conditionMet = targetValue === is;
    } else if (typeof targetValue === 'boolean') {
      conditionMet = targetValue.toString() === is.toString();
    } else {
      conditionMet = String(targetValue) === String(is);
    }

    // Return visibility based on show flag
    return show ? conditionMet : !conditionMet;
  };

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
        case 'url':
          rules.pattern = {
            value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
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
          {/* Render sections */}
          {state.sections.length > 0 && (
            <div className={styles.sections}>
              {state.sections.map((section) => {
                const sectionFields = state.fields.filter((field) =>
                  section.fieldIds.includes(field.id)
                );
                const visibleFields = sectionFields.filter(isFieldVisible);

                if (visibleFields.length === 0) return null;

                return (
                  <div key={section.id} className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <h3>{section.title}</h3>
                      {section.description && <p>{section.description}</p>}
                    </div>
                    <div className={styles.fieldsGrid}>
                      {visibleFields.map((field) => (
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
                  </div>
                );
              })}
            </div>
          )}

          {/* Render unsectioned fields */}
          {(() => {
            const fieldsInSections = state.sections.flatMap((s) => s.fieldIds);
            const unsectionedFields = state.fields.filter(
              (field) => !fieldsInSections.includes(field.id)
            );
            const visibleUnsectionedFields = unsectionedFields.filter(isFieldVisible);

            if (visibleUnsectionedFields.length === 0) return null;

            return (
              <div className={styles.fieldsGrid}>
                {visibleUnsectionedFields.map((field) => (
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
            );
          })()}

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
