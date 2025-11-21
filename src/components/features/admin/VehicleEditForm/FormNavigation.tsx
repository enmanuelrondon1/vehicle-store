// src/components/features/admin/VehicleEditForm/FormNavigation.tsx

import { ChevronDown } from "lucide-react";

// Definimos las props que este componente necesita recibir
interface FormNavigationProps {
  sectionsConfig: any[]; // Usamos 'any' por simplicidad, pero podrías crear un tipo más específico
  activeSection: string;
  getSectionCompletion: (sectionId: string) => number;
  scrollToSection: (sectionId: string) => void;
}

export function FormNavigation({ 
  sectionsConfig, 
  activeSection, 
  getSectionCompletion, 
  scrollToSection 
}: FormNavigationProps) {
  return (
    <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
      <div className="card-glass p-3 rounded-2xl space-y-2 shadow-2xl border border-border/50">
        {sectionsConfig.map((section) => {
          const isActive = activeSection === section.id;
          const completion = getSectionCompletion(section.id);
          
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group relative flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r ' + section.gradient + ' shadow-lg scale-105' 
                  : 'hover:bg-muted/50'
              }`}
              title={section.label}
            >
              <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-white/20' : 'bg-muted/30'
              }`}>
                <section.icon className={`w-4 h-4 transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-muted-foreground'
                }`} />
                
                {/* Completion Badge */}
                {completion > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                    {completion}
                  </div>
                )}
              </div>

              {/* Premium Hover Tooltip */}
              <div className={`absolute right-full mr-3 px-3 py-2 bg-popover border border-border rounded-lg shadow-xl whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                isActive ? 'scale-100' : 'scale-95'
              }`}>
                <p className="text-sm font-semibold">{section.label}</p>
                <p className="text-xs text-muted-foreground">{completion}% completado</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rotate-45 bg-popover border-r border-b border-border"></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}