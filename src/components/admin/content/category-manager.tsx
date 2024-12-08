import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryCard } from './category-card';
import { CategoryModal } from './category-modal';
import { getContent, createContent, updateContent, deleteContent } from '@/lib/content';
import type { SiteContent } from '@/lib/content';
import { MACHINE_CATEGORIES, MACHINE_SUBCATEGORIES, WORK_PHASES } from '@/lib/constants';

interface ExtendedCategory extends SiteContent {
  /** Lista de subcategorias */
  subcategories?: string[];
  
  /** Lista de fases de trabalho associadas */
  workPhases?: string[];
  
  /** Metadados adicionais da categoria */
  metadata?: {
    primaryCategory?: boolean;
    description?: string;
    icon?: string;
  };
}

export function CategoryManager() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ExtendedCategory | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'update'>('create');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getContent('category');
      setCategories(data as ExtendedCategory[]);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (data: Partial<ExtendedCategory>) => {
    try {
      const categoryData: ExtendedCategory = {
        type: 'category',
        order: categories.length,
        active: true,
        ...data,
        subcategories: data.subcategories || [],
        workPhases: data.workPhases || [],
        metadata: {
          primaryCategory: data.metadata?.primaryCategory || false,
          description: data.metadata?.description || '',
          icon: data.metadata?.icon || ''
        }
      };

      if (selectedCategory) {
        await updateContent(selectedCategory.id, categoryData);
      } else {
        await createContent(categoryData);
      }
      
      await loadCategories();
      setShowModal(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteContent(categoryId);
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAddSubcategory = (category: ExtendedCategory) => {
    const newSubcategory = prompt('Digite o nome da nova subcategoria:');
    if (newSubcategory) {
      const updatedSubcategories = [
        ...(category.subcategories || []),
        newSubcategory
      ];
      handleSave({ 
        ...category, 
        subcategories: updatedSubcategories 
      });
    }
  };

  const handleAddWorkPhase = (category: ExtendedCategory) => {
    const newWorkPhase = prompt('Selecione a nova fase de trabalho:', 
      Object.values(WORK_PHASES).join(', ')
    );
    if (newWorkPhase) {
      const updatedWorkPhases = [
        ...(category.workPhases || []),
        newWorkPhase
      ];
      handleSave({ 
        ...category, 
        workPhases: updatedWorkPhases 
      });
    }
  };

  const handleRemoveSubcategory = (category: ExtendedCategory, subcategory: string) => {
    const updatedSubcategories = (category.subcategories || [])
      .filter(sub => sub !== subcategory);
    handleSave({ 
      ...category, 
      subcategories: updatedSubcategories 
    });
  };

  const handleRemoveWorkPhase = (category: ExtendedCategory, workPhase: string) => {
    const updatedWorkPhases = (category.workPhases || [])
      .filter(phase => phase !== workPhase);
    handleSave({ 
      ...category, 
      workPhases: updatedWorkPhases 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categorias de Máquinas</h3>
        <Button onClick={() => {
          setSelectedCategory(null);
          setEditMode('create');
          setShowModal(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="relative">
            <CategoryCard
              category={category}
              onEdit={() => {
                setSelectedCategory(category);
                setEditMode('update');
                setShowModal(true);
              }}
              onDelete={() => handleDelete(category.id)}
            />
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Subcategorias</h4>
              <div className="flex flex-wrap gap-2">
                {category.subcategories?.map((subcategory) => (
                  <div 
                    key={subcategory} 
                    className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs"
                  >
                    {subcategory}
                    <button 
                      onClick={() => handleRemoveSubcategory(category, subcategory)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => handleAddSubcategory(category)}
                  className="flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-600 hover:bg-primary-200"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Adicionar
                </button>
              </div>

              <h4 className="text-sm font-medium mt-4">Fases de Trabalho</h4>
              <div className="flex flex-wrap gap-2">
                {category.workPhases?.map((workPhase) => (
                  <div 
                    key={workPhase} 
                    className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs"
                  >
                    {workPhase}
                    <button 
                      onClick={() => handleRemoveWorkPhase(category, workPhase)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => handleAddWorkPhase(category)}
                  className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 hover:bg-green-200"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Adicionar Fase
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          editMode={editMode}
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
          }}
          onSave={handleSave}
          availableSubcategories={Object.values(MACHINE_SUBCATEGORIES).flat()}
          availableWorkPhases={Object.values(WORK_PHASES)}
        />
      )}
    </div>
  );
}