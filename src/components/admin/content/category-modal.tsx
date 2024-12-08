import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { UploadProgress } from '@/components/ui/upload-progress';
import { uploadImage } from '@/lib/upload-manager';
import type { SiteContent } from '@/lib/content';
import { WORK_PHASES } from '@/lib/constants';

interface ExtendedCategory extends SiteContent {
  subcategories?: string[];
  workPhases?: string[];
  metadata?: {
    primaryCategory?: boolean;
    description?: string;
    icon?: string;
  };
}

interface CategoryModalProps {
  category?: ExtendedCategory | null;
  onClose: () => void;
  onSave: (data: Partial<ExtendedCategory>) => void;
  editMode?: 'create' | 'update';
  availableSubcategories?: string[];
  availableWorkPhases?: string[];
}

export function CategoryModal({ 
  category, 
  onClose, 
  onSave, 
  editMode = 'create',
  availableSubcategories = [],
  availableWorkPhases = []
}: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState<ExtendedCategory>({
    title: category?.title || '',
    description: category?.description || '',
    imageUrl: category?.imageUrl || '',
    active: category?.active ?? true,
    subcategories: category?.subcategories || [],
    workPhases: category?.workPhases || [],
    metadata: {
      primaryCategory: category?.metadata?.primaryCategory || false,
      description: category?.metadata?.description || '',
      icon: category?.metadata?.icon || ''
    }
  });

  const handleImageUpload = async (file: File) => {
    setUploadProgress(0);

    try {
      // Generate a unique path for the category image
      const path = `categories/${formData.title?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      
      await uploadImage(file, path, {
        onProgress: (progress) => setUploadProgress(progress),
        onComplete: (url) => {
          setFormData(prev => ({ 
            ...prev, 
            imageUrl: url,
            metadata: {
              ...prev.metadata,
              icon: url  // Store image URL in metadata as well
            }
          }));
          setUploadProgress(null);
        },
        onError: (error) => {
          console.error('Error uploading image:', error);
          setUploadProgress(null);
        }
      });
    } catch (error) {
      console.error('Image upload failed', error);
      setUploadProgress(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: '',
      metadata: {
        ...prev.metadata,
        icon: undefined
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = (subcategory: string) => {
    if (subcategory && !formData.subcategories?.includes(subcategory)) {
      setFormData(prev => ({
        ...prev,
        subcategories: [...(prev.subcategories || []), subcategory]
      }));
    }
  };

  const handleRemoveSubcategory = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: (prev.subcategories || []).filter(sub => sub !== subcategory)
    }));
  };

  const handleAddWorkPhase = (phase: string) => {
    if (phase && !formData.workPhases?.includes(phase)) {
      setFormData(prev => ({
        ...prev,
        workPhases: [...(prev.workPhases || []), phase]
      }));
    }
  };

  const handleRemoveWorkPhase = (phase: string) => {
    setFormData(prev => ({
      ...prev,
      workPhases: (prev.workPhases || []).filter(p => p !== phase)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">
          {editMode === 'update' ? 'Editar Categoria' : 'Nova Categoria'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Imagem da Categoria</label>
            <div className="relative">
              <ImageUpload
                currentImageUrl={formData.imageUrl}
                onFileSelect={handleImageUpload}
                onRemove={handleRemoveImage}
                folder="categories"
                id={formData.title?.toLowerCase().replace(/\s+/g, '-') || 'new-category'}
                loading={uploadProgress !== null}
                aspectRatio="video"
              />

              {uploadProgress !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <UploadProgress progress={uploadProgress} />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: e.target.value,
                metadata: {
                  ...prev.metadata,
                  description: e.target.value
                }
              }))}
              className="h-24 w-full rounded-lg border p-2 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Subcategorias</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.subcategories?.map((subcategory) => (
                <div 
                  key={subcategory} 
                  className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs"
                >
                  {subcategory}
                  <button 
                    type="button"
                    onClick={() => handleRemoveSubcategory(subcategory)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                onChange={(e) => handleAddSubcategory(e.target.value)}
                className="flex-1 rounded-lg border p-2"
                defaultValue=""
              >
                <option value="" disabled>Selecione uma subcategoria</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  const newSub = prompt('Digite o nome da nova subcategoria:');
                  if (newSub) handleAddSubcategory(newSub);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Fases de Trabalho</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.workPhases?.map((phase) => (
                <div 
                  key={phase} 
                  className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs"
                >
                  {phase}
                  <button 
                    type="button"
                    onClick={() => handleRemoveWorkPhase(phase)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                onChange={(e) => handleAddWorkPhase(e.target.value)}
                className="flex-1 rounded-lg border p-2"
                defaultValue=""
              >
                <option value="" disabled>Selecione uma fase de trabalho</option>
                {availableWorkPhases.map((phase) => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  const newPhase = prompt('Digite o nome da nova fase de trabalho:');
                  if (newPhase) handleAddWorkPhase(newPhase);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Configurações Avançadas</label>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="primaryCategory"
                checked={formData.metadata?.primaryCategory || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metadata: {
                    ...prev.metadata,
                    primaryCategory: e.target.checked
                  }
                }))}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="primaryCategory" className="text-sm">
                Definir como categoria principal
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || uploadProgress !== null}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}