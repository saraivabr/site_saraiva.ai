import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormValidation } from '@/hooks/use-form-validation';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Send, Loader2 } from 'lucide-react';

interface ContactFormProps {
  onClose?: () => void;
  className?: string;
}

const initialValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: ''
};

const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: true,
    pattern: /^(\+55\s?)?(\(?[1-9]{2}\)?[\s\-]?)?[9]?[0-9]{4}[\s\-]?[0-9]{4}$/
  },
  company: {
    maxLength: 100
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
};

export const ContactForm: React.FC<ContactFormProps> = ({ onClose, className }) => {
  const {
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
  } = useFormValidation(initialValues, validationRules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      if (Math.random() > 0.2) {
        setSubmitSuccess(true);
        // Auto close after success
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      } else {
        throw new Error('Erro na conexão. Tente novamente.');
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    updateField(name, value, fields[name].touched);
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess(false);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleFieldChange('phone', formatted);
  };

  useEffect(() => {
    // Real-time validation for phone as user types
    if (fields.phone.value && fields.phone.touched) {
      const timer = setTimeout(() => {
        updateField('phone', fields.phone.value, true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fields.phone.value, fields.phone.touched, updateField]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Entre em Contato
        </CardTitle>
        <p className="text-gray-600 text-center">
          Preencha os campos abaixo e entraremos em contato rapidamente
        </p>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {submitSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
              </motion.div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Mensagem Enviada!
              </h3>
              <p className="text-gray-600">
                Obrigado pelo contato. Responderemos em breve.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <FormInput
                  name="name"
                  placeholder="Seu nome completo"
                  value={fields.name.value}
                  error={fields.name.error}
                  touched={fields.name.touched}
                  valid={fields.name.valid}
                  onChange={(value) => handleFieldChange('name', value)}
                  onBlur={() => setFieldTouched('name')}
                  helpText="Digite seu nome completo"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail *
                </label>
                <FormInput
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={fields.email.value}
                  error={fields.email.error}
                  touched={fields.email.touched}
                  valid={fields.email.valid}
                  onChange={(value) => handleFieldChange('email', value.toLowerCase())}
                  onBlur={() => setFieldTouched('email')}
                  helpText="Usaremos este e-mail para entrar em contato"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone/WhatsApp *
                </label>
                <FormInput
                  name="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={fields.phone.value}
                  error={fields.phone.error}
                  touched={fields.phone.touched}
                  valid={fields.phone.valid}
                  onChange={handlePhoneChange}
                  onBlur={() => setFieldTouched('phone')}
                  helpText="Incluindo DDD"
                />
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa (opcional)
                </label>
                <FormInput
                  name="company"
                  placeholder="Nome da sua empresa"
                  value={fields.company.value}
                  error={fields.company.error}
                  touched={fields.company.touched}
                  valid={fields.company.valid}
                  onChange={(value) => handleFieldChange('company', value)}
                  onBlur={() => setFieldTouched('company')}
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem *
                </label>
                <FormInput
                  name="message"
                  placeholder="Descreva como podemos te ajudar..."
                  value={fields.message.value}
                  error={fields.message.error}
                  touched={fields.message.touched}
                  valid={fields.message.valid}
                  onChange={(value) => handleFieldChange('message', value)}
                  onBlur={() => setFieldTouched('message')}
                  multiline
                  rows={4}
                  helpText="Descreva seus objetivos ou dúvidas"
                />
              </div>

              {/* Submit Error */}
              <AnimatePresence>
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2"
                  >
                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                    <p className="text-red-700">{submitError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-black text-white hover:opacity-90 py-3 text-lg font-bold transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={20} />
                    Enviar Mensagem
                  </>
                )}
              </Button>

              {/* Form validation status */}
              <div className="text-center text-sm text-gray-500">
                {Object.values(fields).filter(field => field.touched && field.valid).length} de {Object.keys(fields).length} campos válidos
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ContactForm;