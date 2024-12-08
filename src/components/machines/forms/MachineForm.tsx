import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Feedback } from '@/components/ui/feedback';
import { BasicInfoForm } from './BasicInfoForm';
import { MachineImageManager } from '../MachineImageManager';
import { createMachine, updateMachine } from '@/lib/machines';
import { useAuth } from '@/contexts/auth-context';
import Logger from '@/lib/logger';
import type { Machine } from '@/types';

interface MachineFormProps {
  machine?: Machine;
}

export function MachineForm({ machine }: MachineFormProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdMachineId, setCreatedMachineId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Machine>>({
    name: machine?.name || '',
    categories: machine?.categories || (machine?.category ? [machine.category] : []),
    category: machine?.category || (machine?.categories?.[0] || ''),
    subcategories: machine?.subcategories || (machine?.subcategory ? [machine.subcategory] : []),
    subcategory: machine?.subcategory || (machine?.subcategories?.[0] || ''),
    workPhases: machine?.workPhases || (machine?.workPhase ? [machine.workPhase] : []),
    workPhase: machine?.workPhase || (machine?.workPhases?.[0] || ''),
    shortDescription: machine?.shortDescription || '',
    longDescription: machine?.longDescription || '',
    imageUrl: machine?.imageUrl || '',
    categoryDetails: machine?.categoryDetails || {},
    specifications: machine?.specifications || {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      power: '',
      weight: ''
    },
    pricing: machine?.pricing || {
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    availability: machine?.availability || {
      status: 'available',
      location: {
        address: '',
        city: '',
        state: ''
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      setError('Usuário não autenticado');
      return;
    }

    if (!formData.name || !formData.categories || formData.categories.length === 0) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      Logger.info('Saving machine', { formData });
      
      const machineData: Machine = {
        ...formData,
        ownerId: userProfile.uid,
        createdAt: machine?.createdAt || new Date(),
        updatedAt: new Date()
      } as Machine;

      if (machine) {
        await updateMachine(machine.id, machineData);
        Logger.info('Machine updated successfully', { machineId: machine.id });
        setSuccess('Máquina atualizada com sucesso!');
      } else {
        const newMachineId = await createMachine(machineData);
        Logger.info('Machine created successfully', { machineId: newMachineId });
        setCreatedMachineId(newMachineId);
        setSuccess('Máquina criada com sucesso! Agora você pode adicionar imagens.');
      }
    } catch (err) {
      Logger.error('Error saving machine', err as Error, { formData });
      setError(err instanceof Error ? err.message : 'Falha ao salvar máquina');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (data: Partial<Machine>) => {
    setFormData(prev => ({ 
      ...prev, 
      ...data,
      // Manter compatibilidade com estruturas antigas
      category: data.categories?.[0] || prev.category,
      subcategory: data.subcategories?.[0] || prev.subcategory,
      workPhase: data.workPhases?.[0] || prev.workPhase
    }));
  };

  const handleImageUpdate = (imageUrl: string) => {
    Logger.info('Image updated', { imageUrl });
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      {error && <Feedback type="error" message={error} />}
      {success && <Feedback type="success" message={success} />}

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold">Informações Básicas</h2>
        <BasicInfoForm 
          formData={formData as any}
          onChange={handleFormChange}
        />
      </Card>

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold">Especificações Técnicas</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Marca</label>
            <input
              type="text"
              value={formData.specifications?.brand || ''}
              onChange={(e) => handleFormChange({
                specifications: {
                  ...formData.specifications,
                  brand: e.target.value
                }
              })}
              className="w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Modelo</label>
            <input
              type="text"
              value={formData.specifications?.model || ''}
              onChange={(e) => handleFormChange({
                specifications: {
                  ...formData.specifications,
                  model: e.target.value
                }
              })}
              className="w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ano</label>
            <input
              type="number"
              value={formData.specifications?.year || ''}
              onChange={(e) => handleFormChange({
                specifications: {
                  ...formData.specifications,
                  year: parseInt(e.target.value)
                }
              })}
              className="w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Potência</label>
            <input
              type="text"
              value={formData.specifications?.power || ''}
              onChange={(e) => handleFormChange({
                specifications: {
                  ...formData.specifications,
                  power: e.target.value
                }
              })}
              className="w-full rounded-lg border p-2"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold">Precificação</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Valor Hora</label>
            <input
              type="number"
              value={formData.pricing?.hourly || ''}
              onChange={(e) => handleFormChange({
                pricing: {
                  ...formData.pricing,
                  hourly: parseFloat(e.target.value)
                }
              })}
              className="w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Valor Diária</label>
            <input
              type="number"
              value={formData.pricing?.daily || ''}
              onChange={(e) => handleFormChange({
                pricing: {
                  ...formData.pricing,
                  daily: parseFloat(e.target.value)
                }
              })}
              className="w-full rounded-lg border p-2"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-6 text-lg font-semibold">Foto Principal</h2>
        {(machine?.id || createdMachineId) ? (
          <MachineImageManager
            machineId={machine?.id || createdMachineId!}
            currentImageUrl={formData.imageUrl}
            onImageUpdate={handleImageUpdate}
          />
        ) : (
          <p className="text-sm text-gray-500">
            Salve a máquina primeiro para poder gerenciar as imagens
          </p>
        )}
      </Card>

      <Button 
        className="w-full" 
        type="submit" 
        disabled={loading}
        size="lg"
      >
        {loading ? 'Salvando...' : machine ? 'Salvar Alterações' : 'Criar Anúncio'}
      </Button>

      {createdMachineId && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/dashboard')}
        >
          Voltar para Dashboard
        </Button>
      )}
    </form>
  );
}