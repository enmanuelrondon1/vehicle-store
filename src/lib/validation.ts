import { ZodError } from 'zod';
import { FormErrors, ValidationError } from '@/types/types';

export class ValidationUtils {
  static formatZodErrors(error: ZodError): FormErrors {
    const formErrors: FormErrors = {};
    
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      formErrors[path] = err.message;
    });
    
    return formErrors;
  }
  
  static formatValidationErrors(errors: ValidationError[]): FormErrors {
    const formErrors: FormErrors = {};
    
    errors.forEach((err) => {
      formErrors[err.field] = err.message;
    });
    
    return formErrors;
  }
  
  static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
  }
  
  static normalizePhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }
  
  static isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}