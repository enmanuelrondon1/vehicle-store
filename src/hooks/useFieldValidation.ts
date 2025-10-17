"use client";

import { useState } from 'react';

type FormFieldValue = string | number | undefined;

export const useFieldValidation = (value: FormFieldValue, error: string | undefined) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleBlur = () => {
    setIsTouched(true);
  };

  const showValidation = isTouched || !!error;
  const isValid = showValidation && !error && (value !== undefined && value !== '');

  const getBorderClassName = () => {
    if (showValidation) {
      if (error) return 'border-destructive focus:ring-destructive/20';
      if (isValid) return 'border-primary focus:ring-primary/20';
    }
    return 'border-input focus:ring-blue-500/20 dark:focus:ring-blue-400/20';
  };

  return { handleBlur, showValidation, isValid, getBorderClassName };
};