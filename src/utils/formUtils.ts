
import { FieldValues, UseFormReturn, Path, FieldError } from "react-hook-form";

// Get form error for a specific field
export function getFormError<T extends FieldValues>(
  form: UseFormReturn<T>,
  field: Path<T>
): FieldError | undefined {
  return form.formState.errors[field];
}

// Get error message for a specific field
export function getFormErrorMessage<T extends FieldValues>(
  form: UseFormReturn<T>,
  field: Path<T>
): string | undefined {
  const error = getFormError(form, field);
  return error?.message;
}

// Check if form has errors
export function hasFormErrors<T extends FieldValues>(form: UseFormReturn<T>): boolean {
  return Object.keys(form.formState.errors).length > 0;
}

// Reset multiple fields
export function resetFields<T extends FieldValues>(
  form: UseFormReturn<T>,
  fields: Path<T>[]
): void {
  fields.forEach(field => {
    form.resetField(field);
  });
}

// Clear all form errors
export function clearFormErrors<T extends FieldValues>(form: UseFormReturn<T>): void {
  form.clearErrors();
}

// Format form values before submission
export function formatFormValues<T extends FieldValues>(
  values: T,
  formatters: Partial<Record<keyof T, (value: any) => any>>
): T {
  const formattedValues = { ...values };
  
  Object.entries(formatters).forEach(([key, formatter]) => {
    if (key in values && formatter) {
      (formattedValues as any)[key] = formatter(values[key as keyof T]);
    }
  });
  
  return formattedValues;
}

// Transform API errors to form errors
export function transformApiErrorsToFormErrors(
  apiErrors: Record<string, string>
): Record<string, { message: string }> {
  const formErrors: Record<string, { message: string }> = {};
  
  Object.entries(apiErrors).forEach(([field, message]) => {
    formErrors[field] = { message };
  });
  
  return formErrors;
}
