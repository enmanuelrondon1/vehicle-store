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

  const getBorderColor = (isDarkMode: boolean) => {
    if (showValidation) {
      if (error) return 'border-red-400 focus:ring-red-500/20';
      if (isValid) return 'border-green-400 focus:ring-green-500/20';
    }
    return isDarkMode ? 'border-gray-600 focus:ring-blue-500/20' : 'border-gray-200 focus:ring-blue-500/20';
  };

  return { handleBlur, showValidation, isValid, getBorderColor };
};