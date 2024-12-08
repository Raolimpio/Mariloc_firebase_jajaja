import { MACHINE_CATEGORIES, WORK_PHASES, MACHINE_SUBCATEGORIES } from '@/lib/constants';
import { useState } from 'react';

interface BasicInfoFormProps {
  formData: {
    name: string;
    categories: string[];
    category: string;
    subcategories: string[];
    subcategory: string;
    workPhases: string[];
    workPhase: string;
    shortDescription: string;
    longDescription: string;
    categoryDetails?: {
      [category: string]: {
        primaryCategory?: boolean;
        description?: string;
      }
    };
  };
  onChange: (data: Partial<BasicInfoFormProps['formData']>) => void;
}

export function BasicInfoForm({ formData, onChange }: BasicInfoFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    formData.categories || [formData.category]
  );
  const [selectedWorkPhases, setSelectedWorkPhases] = useState<string[]>(
    formData.workPhases || (formData.workPhase ? [formData.workPhase] : [])
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    formData.subcategories || (formData.subcategory ? [formData.subcategory] : [])
  );

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    
    // Atualizar dados da categoria
    const categoryDetails = updatedCategories.reduce((acc, cat) => {
      acc[cat] = {
        primaryCategory: cat === updatedCategories[0],
        description: formData.categoryDetails?.[cat]?.description || ''
      };
      return acc;
    }, {} as BasicInfoFormProps['formData']['categoryDetails']);

    onChange({ 
      categories: updatedCategories,
      category: updatedCategories[0], // Manter compatibilidade
      categoryDetails
    });
  };

  const handleWorkPhaseChange = (phase: string) => {
    const updatedWorkPhases = selectedWorkPhases.includes(phase)
      ? selectedWorkPhases.filter(p => p !== phase)
      : [...selectedWorkPhases, phase];

    setSelectedWorkPhases(updatedWorkPhases);
    onChange({ 
      workPhases: updatedWorkPhases,
      workPhase: updatedWorkPhases[0] // Manter compatibilidade
    });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const updatedSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter(sub => sub !== subcategory)
      : [...selectedSubcategories, subcategory];

    setSelectedSubcategories(updatedSubcategories);
    onChange({ 
      subcategories: updatedSubcategories,
      subcategory: updatedSubcategories[0] // Manter compatibilidade
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Nome da Máquina</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          placeholder="Digite o nome da máquina"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Categorias</label>
          <div className="space-y-2">
            {MACHINE_CATEGORIES.flatMap(category => 
              category.subcategories
            ).map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2"
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Subcategorias</label>
          <div className="space-y-2">
            {Object.values(MACHINE_SUBCATEGORIES).flat().map((subcategory) => (
              <div key={subcategory} className="flex items-center">
                <input
                  type="checkbox"
                  id={subcategory}
                  checked={selectedSubcategories.includes(subcategory)}
                  onChange={() => handleSubcategoryChange(subcategory)}
                  className="mr-2"
                />
                <label htmlFor={subcategory}>{subcategory}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Fases da Obra</label>
          <div className="space-y-2">
            {Object.keys(WORK_PHASES).map((phase) => (
              <div key={phase} className="flex items-center">
                <input
                  type="checkbox"
                  id={phase}
                  checked={selectedWorkPhases.includes(phase)}
                  onChange={() => handleWorkPhaseChange(phase)}
                  className="mr-2"
                />
                <label htmlFor={phase}>{phase}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descrição Curta</label>
        <input
          type="text"
          required
          value={formData.shortDescription}
          onChange={(e) => onChange({ shortDescription: e.target.value })}
          className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          placeholder="Breve descrição da máquina"
          maxLength={100}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Descrição Detalhada</label>
        <textarea
          required
          value={formData.longDescription}
          onChange={(e) => onChange({ longDescription: e.target.value })}
          className="h-32 w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
          placeholder="Descrição detalhada da máquina"
        />
      </div>
    </div>
  );
}