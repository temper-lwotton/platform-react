import {
  ConditionalLogic,
  ConditionalRule,
  ComparisonOperator,
  FormField,
  ValidationRule,
} from '@/types/form-builder';

/**
 * Evaluates a single conditional rule against form data
 */
export function evaluateConditionRule(
  rule: ConditionalRule,
  formData: Record<string, any>
): boolean {
  const fieldValue = formData[rule.fieldId];
  const compareValue = rule.value;

  switch (rule.operator) {
    case 'equals':
      return fieldValue === compareValue;

    case 'notEquals':
      return fieldValue !== compareValue;

    case 'contains':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        return fieldValue.toLowerCase().includes(compareValue.toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(compareValue);
      }
      return false;

    case 'notContains':
      if (typeof fieldValue === 'string' && typeof compareValue === 'string') {
        return !fieldValue.toLowerCase().includes(compareValue.toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(compareValue);
      }
      return true;

    case 'greaterThan':
      return parseFloat(fieldValue) > parseFloat(compareValue);

    case 'lessThan':
      return parseFloat(fieldValue) < parseFloat(compareValue);

    case 'greaterThanOrEqual':
      return parseFloat(fieldValue) >= parseFloat(compareValue);

    case 'lessThanOrEqual':
      return parseFloat(fieldValue) <= parseFloat(compareValue);

    case 'isEmpty':
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    case 'isNotEmpty':
      return !(
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    default:
      return false;
  }
}

/**
 * Evaluates conditional logic for a field
 */
export function evaluateConditionalLogic(
  logic: ConditionalLogic,
  formData: Record<string, any>
): boolean {
  if (!logic.conditions || logic.conditions.length === 0) {
    return false;
  }

  const results = logic.conditions.map((condition) =>
    evaluateConditionRule(condition, formData)
  );

  // Evaluate based on logic type
  if (logic.logicType === 'all') {
    // ALL conditions must be true (AND)
    return results.every((result) => result === true);
  } else {
    // ANY condition can be true (OR)
    return results.some((result) => result === true);
  }
}

/**
 * Determines if a field should be visible based on its conditional logic
 */
export function isFieldVisible(
  field: FormField,
  formData: Record<string, any>
): boolean {
  if (!field.conditionalLogic) {
    return true; // No conditional logic means always visible
  }

  const conditionsMet = evaluateConditionalLogic(field.conditionalLogic, formData);

  // If action is 'show', field is visible when conditions are met
  // If action is 'hide', field is visible when conditions are NOT met
  if (field.conditionalLogic.action === 'show') {
    return conditionsMet;
  } else if (field.conditionalLogic.action === 'hide') {
    return !conditionsMet;
  }

  // For 'enable', 'disable', 'require' - field is always visible
  return true;
}

/**
 * Determines if a field should be disabled based on its conditional logic
 */
export function isFieldDisabled(
  field: FormField,
  formData: Record<string, any>
): boolean {
  if (!field.conditionalLogic) {
    return false; // No conditional logic means not disabled
  }

  const conditionsMet = evaluateConditionalLogic(field.conditionalLogic, formData);

  // If action is 'disable', field is disabled when conditions are met
  // If action is 'enable', field is disabled when conditions are NOT met
  if (field.conditionalLogic.action === 'disable') {
    return conditionsMet;
  } else if (field.conditionalLogic.action === 'enable') {
    return !conditionsMet;
  }

  return false;
}

/**
 * Determines if a field is required based on its conditional logic
 */
export function isFieldRequired(
  field: FormField,
  formData: Record<string, any>
): boolean {
  // Check base required validation
  const hasRequiredValidation = field.validations.some((v) => v.type === 'required');

  if (!field.conditionalLogic) {
    return hasRequiredValidation;
  }

  // If there's conditional logic with 'require' action
  if (field.conditionalLogic.action === 'require') {
    const conditionsMet = evaluateConditionalLogic(field.conditionalLogic, formData);
    return hasRequiredValidation || conditionsMet;
  }

  return hasRequiredValidation;
}

/**
 * Validates a field value against all validation rules
 */
export function validateField(
  field: FormField,
  value: any,
  formData: Record<string, any>,
  allFields: FormField[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Skip validation if field is not visible
  if (!isFieldVisible(field, formData)) {
    return { valid: true, errors: [] };
  }

  for (const validation of field.validations) {
    let isValid = true;

    switch (validation.type) {
      case 'required':
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          isValid = false;
        }
        break;

      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = emailRegex.test(value);
        }
        break;

      case 'url':
        if (value && typeof value === 'string') {
          try {
            new URL(value);
            isValid = true;
          } catch {
            isValid = false;
          }
        }
        break;

      case 'min':
        if (value !== undefined && value !== null && value !== '') {
          isValid = parseFloat(value) >= (validation.value as number);
        }
        break;

      case 'max':
        if (value !== undefined && value !== null && value !== '') {
          isValid = parseFloat(value) <= (validation.value as number);
        }
        break;

      case 'minLength':
        if (value && typeof value === 'string') {
          isValid = value.length >= (validation.value as number);
        }
        break;

      case 'maxLength':
        if (value && typeof value === 'string') {
          isValid = value.length <= (validation.value as number);
        }
        break;

      case 'pattern':
        if (value && typeof value === 'string' && validation.value) {
          try {
            const regex = new RegExp(validation.value as string);
            isValid = regex.test(value);
          } catch {
            isValid = false;
          }
        }
        break;

      case 'custom':
        if (validation.customFunction) {
          try {
            // eslint-disable-next-line no-eval
            const fn = eval(`(${validation.customFunction})`);
            if (typeof fn === 'function') {
              isValid = fn(value);
            }
          } catch (error) {
            console.error('Custom validation function error:', error);
            isValid = false;
          }
        }
        break;

      case 'crossField':
        if (validation.compareToFieldId && validation.comparisonOperator) {
          const compareToValue = formData[validation.compareToFieldId];
          const rule: ConditionalRule = {
            id: 'validation',
            fieldId: validation.compareToFieldId,
            operator: validation.comparisonOperator,
            value: value,
          };
          // For cross-field, we swap: check if compareToValue meets the condition with current value
          isValid = evaluateConditionRule(
            { ...rule, value: value },
            { [validation.compareToFieldId]: compareToValue }
          );
        }
        break;
    }

    if (!isValid) {
      errors.push(validation.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates all visible fields in a form
 */
export function validateForm(
  fields: FormField[],
  formData: Record<string, any>
): { valid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  let isFormValid = true;

  for (const field of fields) {
    const result = validateField(field, formData[field.id], formData, fields);
    if (!result.valid) {
      errors[field.id] = result.errors;
      isFormValid = false;
    }
  }

  return {
    valid: isFormValid,
    errors,
  };
}
