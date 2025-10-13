//src/components/ui/MultiSelectFilter.tsx
'use client'
import React, { useState, useRef, useEffect } from 'react';

// Type definition for option objects
interface Option {
  value: string;
  label: string;
  count?: number;
}

// Icon for the close button on tags (lucide-react style)
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);

// Icon for the checkmark on selected items (lucide-react style)
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

interface MultiSelectFilterProps {
    options: Option[];
    selectedValues: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
}

/**
 * A reusable multi-select component styled with explicit colors to ensure visibility.
 */
export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
    options,
    selectedValues = [],
    onChange,
    placeholder = "Select options...",
    className
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOptions = options.filter(option => selectedValues.includes(option.value));

    const filteredOptions = options.filter(option =>
        !selectedValues.includes(option.value) &&
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleOption = (option: Option) => {
        const newSelected = selectedValues.includes(option.value)
            ? selectedValues.filter(v => v !== option.value)
            : [...selectedValues, option.value];
        onChange(newSelected);
        setSearchTerm('');
        inputRef.current?.focus();
    };

    const removeOption = (option: Option) => {
        onChange(selectedValues.filter(v => v !== option.value));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && searchTerm === '' && selectedValues.length > 0) {
            const lastSelectedOption = selectedOptions[selectedOptions.length - 1];
            if (lastSelectedOption) {
                removeOption(lastSelectedOption);
            }
        }

        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
                setHighlightedIndex(0);
            }
            return;
        }

        switch (e.key) {
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
                if (filteredOptions[highlightedIndex]) {
                    toggleOption(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };
    
    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(0);
        }
    }, [isOpen, searchTerm]);

    return (
        <div className={`w-full ${className}`} ref={wrapperRef}>
            <div className="relative">
                <div
                    className="flex flex-wrap items-center gap-2 p-2 min-h-[40px] text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md shadow-sm cursor-text transition-colors focus-within:ring-2 focus-within:ring-slate-400 dark:focus-within:ring-slate-100 focus-within:ring-offset-2"
                    onClick={() => {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }}
                >
                    {selectedOptions.map(option => (
                        <div key={option.value} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium px-2 py-1 rounded-md">
                            {option.label}
                            <button
                                type="button"
                                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:ring-offset-1"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    removeOption(option);
                                }}
                            >
                                <XIcon />
                            </button>
                        </div>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedValues.length === 0 ? placeholder : ""}
                        className="flex-grow bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm p-0"
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto animate-popover-in">
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
                        <ul className="p-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={option.value}
                                        className={`flex items-center justify-between p-2 cursor-pointer rounded-md transition-colors duration-150 ${highlightedIndex === index ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}
                                        onClick={() => toggleOption(option)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                    >
                                        <div className="flex-1 flex justify-between items-center mr-2">
                                            <span>{option.label}</span>
                                            {option.count !== undefined && (
                                                <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                                    {option.count}
                                                </span>
                                            )}
                                        </div>
                                        {selectedValues.includes(option.value) && (
                                            <CheckIcon />
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-center text-slate-500 dark:text-slate-400">No options found.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};