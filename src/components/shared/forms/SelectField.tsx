// src/components/shared/forms/SelectField.tsx (Versión Profesional)
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ChevronDown, Check } from 'lucide-react';

interface SelectFieldProps {
  label?: string;
  name?: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  isLoading?: boolean;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onValueChange,
  onBlur,
  disabled,
  placeholder,
  options,
  isLoading,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(options.findIndex(o => o.value === value));
      setSearchTerm('');
      inputRef.current?.focus();
    }
  }, [isOpen, value, options]);

  const handleSelectOption = (option: { value: string; label: string }) => {
    if (disabled || isLoading) return;
    onValueChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    if (onBlur) onBlur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isLoading) return;
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'Escape': setIsOpen(false); break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Tab': setIsOpen(false); break;
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef} onBlur={onBlur}>
      {/* CAMBIOS AQUÍ: Usamos tu sistema de diseño */}
      <div
        className={`flex items-center justify-between p-2 min-h-[40px] text-sm border border-input bg-background rounded-md shadow-sm transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background ${className} ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => !disabled && !isLoading && setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
          {selectedOption?.label || placeholder}
        </span>
        <div className="flex items-center">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />}
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-2 border border-border bg-popover rounded-md shadow-lg max-h-60 overflow-y-auto animate-popover-in">
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
              className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-sm p-1"
            />
          </div>
          <ul className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`flex items-center justify-between p-2 cursor-pointer rounded-md transition-colors duration-150 ${highlightedIndex === index ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                  {value === option.value && <Check className="h-4 w-4" />}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-muted-foreground">No se encontraron opciones.</li>
            )}
          </ul>
        </div>
      )}
      <style>{`
          @keyframes popover-in {
              from { opacity: 0; transform: scale(0.95) translateY(-10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-popover-in {
              transform-origin: top;
              animation: popover-in 0.1s ease-out forwards;
          }
      `}</style>
    </div>
  );
};