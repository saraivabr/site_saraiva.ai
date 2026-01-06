import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CircleAlert as AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string;
  touched: boolean;
  valid: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  showValidIcon?: boolean;
  helpText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  type = 'text',
  placeholder,
  value,
  error,
  touched,
  valid,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  className,
  multiline = false,
  rows = 4,
  showValidIcon = true,
  helpText
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = touched && error;
  const hasSuccess = touched && valid && value;

  const inputClasses = cn(
    'transition-all duration-300 ease-out',
    hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    hasSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500',
    isFocused && !hasError && !hasSuccess && 'border-blue-500 focus:border-blue-500 focus:ring-blue-500',
    className
  );

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="relative">
      <div className="relative">
        <InputComponent
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClasses}
          rows={multiline ? rows : undefined}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {/* Success/Error icons */}
        {showValidIcon && !disabled && (type !== 'password') && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {hasError && (
                <motion.div
                  key="error"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="text-red-500" size={20} />
                </motion.div>
              )}
              {hasSuccess && (
                <motion.div
                  key="success"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="text-green-500" size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Help text */}
      {helpText && !hasError && !isFocused && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 mt-1"
        >
          {helpText}
        </motion.p>
      )}

      {/* Error message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character count for textareas */}
      {multiline && value && (
        <div className="text-right mt-1">
          <span className={cn(
            "text-xs",
            value.length > 500 ? "text-red-500" : "text-gray-400"
          )}>
            {value.length} caracteres
          </span>
        </div>
      )}
    </div>
  );
};