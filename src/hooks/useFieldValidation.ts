//src/hooks/useFieldValidation.ts
"use client";

import { useEffect, useState } from 'react';

type FormFieldValue = string | number | undefined | boolean | string[] | {} | null;

export const useFieldValidation = (value: FormFieldValue, error: string | undefined) => {
  const [isPristine, setIsPristine] = useState(true);

  useEffect(() => {
    if (value !== undefined && value !== '' && value !== null && isPristine) {
      setIsPristine(false);
    }
    
    if (value === undefined || value === '' || value === null) {
        setIsPristine(true);
    }
  }, [value, isPristine]);

  const isValid = !isPristine && !error;

  const getBorderClassName = () => {
    if (isPristine && !error) {
      return 'border-input focus:ring-blue-500/20 dark:focus:ring-blue-400/20';
    }

    if (error) {
      return 'border-destructive focus:ring-destructive/20';
    }

    return 'border-primary focus:ring-primary/20';
  };

  return { isValid, getBorderClassName };
};