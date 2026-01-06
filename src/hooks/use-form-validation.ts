import { useState, useEffect, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FormField {
  value: string;
  error: string;
  touched: boolean;
  valid: boolean;
}

export interface FormValidation {
  [key: string]: ValidationRule;
}

export const useFormValidation = (initialValues: Record<string, string>, validationRules: FormValidation) => {
  const [fields, setFields] = useState<Record<string, FormField>>(() => {
    const initialFields: Record<string, FormField> = {};
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        value: initialValues[key],
        error: '',
        touched: false,
        valid: false
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = useCallback((name: string, value: string): string => {
    const rules = validationRules[name];
    if (!rules) return '';

    // Required validation
    if (rules.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} é obrigatório`;
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !rules.required) return '';

    // Minimum length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} deve ter pelo menos ${rules.minLength} caracteres`;
    }

    // Maximum length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} deve ter no máximo ${rules.maxLength} caracteres`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      switch (name) {
        case 'email':
          return 'Por favor, insira um email válido';
        case 'phone':
          return 'Por favor, insira um telefone válido';
        default:
          return `Formato inválido para ${name}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
  }, [validationRules]);

  const updateField = useCallback((name: string, value: string, shouldValidate = true) => {
    setFields(prev => {
      const error = shouldValidate ? validateField(name, value) : '';
      return {
        ...prev,
        [name]: {
          value,
          error,
          touched: prev[name].touched || shouldValidate,
          valid: !error
        }
      };
    });
  }, [validateField]);

  const setFieldTouched = useCallback((name: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
        error: validateField(name, prev[name].value)
      }
    }));
  }, [validateField]);

  const validateAll = useCallback((): boolean => {
    let isFormValid = true;
    const updatedFields = { ...fields };

    Object.keys(fields).forEach(name => {
      const error = validateField(name, fields[name].value);
      updatedFields[name] = {
        ...updatedFields[name],
        error,
        touched: true,
        valid: !error
      };
      if (error) isFormValid = false;
    });

    setFields(updatedFields);
    return isFormValid;
  }, [fields, validateField]);

  const reset = useCallback(() => {
    setFields(prev => {
      const resetFields = { ...prev };
      Object.keys(resetFields).forEach(key => {
        resetFields[key] = {
          value: initialValues[key] || '',
          error: '',
          touched: false,
          valid: false
        };
      });
      return resetFields;
    });
    setSubmitError('');
    setSubmitSuccess(false);
    setIsSubmitting(false);
  }, [initialValues]);

  const getFormData = useCallback(() => {
    const formData: Record<string, string> = {};
    Object.keys(fields).forEach(key => {
      formData[key] = fields[key].value;
    });
    return formData;
  }, [fields]);

  const isFormValid = Object.values(fields).every(field => field.valid && field.touched);

  return {
    fields,
    updateField,
    setFieldTouched,
    validateAll,
    reset,
    getFormData,
    isFormValid,
    isSubmitting,
    setIsSubmitting,
    submitError,
    setSubmitError,
    submitSuccess,
    setSubmitSuccess
  };
};