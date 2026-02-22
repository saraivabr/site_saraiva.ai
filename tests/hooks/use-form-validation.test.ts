import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation, type FormValidation } from '@/hooks/use-form-validation';

const defaultValues = { name: '', email: '', phone: '' };

const defaultRules: FormValidation = {
  name: { required: true, minLength: 2, maxLength: 50 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { pattern: /^\(\d{2}\)\s?\d{4,5}-\d{4}$/ },
};

describe('useFormValidation', () => {
  describe('required validation', () => {
    it('should show error for empty required field', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.setFieldTouched('name');
      });

      expect(result.current.fields.name.error).toContain('obrigatório');
    });

    it('should not show error when required field has value', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'João');
      });

      expect(result.current.fields.name.error).toBe('');
      expect(result.current.fields.name.valid).toBe(true);
    });

    it('should not require non-required fields', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.setFieldTouched('phone');
      });

      expect(result.current.fields.phone.error).toBe('');
    });
  });

  describe('pattern validation', () => {
    it('should show error for invalid email', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('email', 'invalid-email');
      });

      expect(result.current.fields.email.error).toContain('email válido');
    });

    it('should accept valid email', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('email', 'user@example.com');
      });

      expect(result.current.fields.email.error).toBe('');
      expect(result.current.fields.email.valid).toBe(true);
    });

    it('should show error for invalid phone pattern', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('phone', '123');
      });

      expect(result.current.fields.phone.error).toContain('telefone válido');
    });

    it('should skip pattern check for empty non-required field', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('phone', '');
      });

      expect(result.current.fields.phone.error).toBe('');
    });
  });

  describe('minLength validation', () => {
    it('should show error when value is shorter than minLength', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'A');
      });

      expect(result.current.fields.name.error).toContain('pelo menos 2');
    });

    it('should pass when value meets minLength', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'AB');
      });

      expect(result.current.fields.name.error).toBe('');
    });
  });

  describe('maxLength validation', () => {
    it('should show error when value exceeds maxLength', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'A'.repeat(51));
      });

      expect(result.current.fields.name.error).toContain('no máximo 50');
    });

    it('should pass when value is within maxLength', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'A'.repeat(50));
      });

      expect(result.current.fields.name.error).toBe('');
    });
  });

  describe('validateAll / submit flow', () => {
    it('should return false when form has errors', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      let isValid: boolean;
      act(() => {
        isValid = result.current.validateAll();
      });

      expect(isValid!).toBe(false);
      expect(result.current.fields.name.touched).toBe(true);
      expect(result.current.fields.email.touched).toBe(true);
    });

    it('should return true when all fields are valid', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'João');
        result.current.updateField('email', 'joao@email.com');
      });

      let isValid: boolean;
      act(() => {
        isValid = result.current.validateAll();
      });

      expect(isValid!).toBe(true);
    });

    it('should track isFormValid reactively', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      expect(result.current.isFormValid).toBe(false);

      // isFormValid requires all fields to be touched and valid
      act(() => {
        result.current.updateField('name', 'João');
        result.current.updateField('email', 'joao@email.com');
      });

      // phone is not touched yet, so isFormValid is still false
      expect(result.current.isFormValid).toBe(false);

      act(() => {
        result.current.setFieldTouched('phone');
      });

      // phone has no required rule and empty value passes, but valid depends on no error + touched
      // The hook sets valid based on !error, so phone should be valid after touch
    });

    it('should be true when all fields are touched and valid', () => {
      const rules: FormValidation = {
        name: { required: true },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      };

      const { result } = renderHook(() =>
        useFormValidation({ name: '', email: '' }, rules),
      );

      act(() => {
        result.current.updateField('name', 'João');
        result.current.updateField('email', 'joao@email.com');
      });

      expect(result.current.isFormValid).toBe(true);
    });

    it('should provide form data via getFormData', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'João');
        result.current.updateField('email', 'joao@email.com');
      });

      const data = result.current.getFormData();
      expect(data).toEqual({ name: 'João', email: 'joao@email.com', phone: '' });
    });
  });

  describe('reset', () => {
    it('should reset all fields to initial values', () => {
      const { result } = renderHook(() =>
        useFormValidation(defaultValues, defaultRules),
      );

      act(() => {
        result.current.updateField('name', 'João');
        result.current.updateField('email', 'joao@email.com');
        result.current.setSubmitError('Erro');
        result.current.setSubmitSuccess(true);
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.fields.name.value).toBe('');
      expect(result.current.fields.name.touched).toBe(false);
      expect(result.current.fields.name.error).toBe('');
      expect(result.current.fields.email.value).toBe('');
      expect(result.current.submitError).toBe('');
      expect(result.current.submitSuccess).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('custom validation', () => {
    it('should run custom validator and return its error', () => {
      const rules: FormValidation = {
        name: {
          custom: (value) =>
            value === 'admin' ? 'Nome reservado' : null,
        },
      };

      const { result } = renderHook(() =>
        useFormValidation({ name: '' }, rules),
      );

      act(() => {
        result.current.updateField('name', 'admin');
      });

      expect(result.current.fields.name.error).toBe('Nome reservado');
    });
  });
});
