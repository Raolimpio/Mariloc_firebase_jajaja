import { 
  createMachine, 
  updateMachine, 
  getMachine, 
  getMachinesByCategory, 
  getMachinesByWorkPhase 
} from '@/lib/machines';
import { Machine } from '@/types';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Machine Service Functions', () => {
  let createdMachineId: string;
  const testMachine: Omit<Machine, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Test Machine',
    categories: ['construction', 'excavation'],
    workPhases: ['foundation', 'earthwork'],
    subcategories: ['heavy-duty'],
    category: 'construction',
    workPhase: 'foundation',
    description: 'A powerful test machine',
    specifications: {
      brand: 'TestBrand',
      model: 'X1000',
      year: 2023,
      power: '250 HP',
      weight: '15000 kg'
    },
    photos: {
      main: 'test-main.jpg',
      gallery: ['test-1.jpg', 'test-2.jpg']
    },
    pricing: {
      hourly: 100,
      daily: 800,
      weekly: 4000,
      monthly: 15000
    },
    availability: {
      status: 'available',
      location: {
        address: 'Test Site',
        city: 'TestCity',
        state: 'TestState'
      }
    },
    categoryDetails: {
      'construction': {
        primaryCategory: true,
        additionalInfo: { specialization: 'Heavy Machinery' },
        subcategories: ['excavation']
      }
    }
  };

  beforeAll(async () => {
    // Criar máquina de teste
    createdMachineId = await createMachine(testMachine);
  });

  it('should create a machine with multiple categories', async () => {
    expect(createdMachineId).toBeTruthy();
  });

  it('should retrieve machine by ID', async () => {
    const machine = await getMachine(createdMachineId);
    expect(machine.name).toBe(testMachine.name);
    expect(machine.categories).toContain('construction');
    expect(machine.categories).toContain('excavation');
  });

  it('should update machine categories', async () => {
    await updateMachine(createdMachineId, {
      categories: ['construction', 'mining'],
      workPhases: ['foundation', 'exploration']
    });

    const updatedMachine = await getMachine(createdMachineId);
    expect(updatedMachine.categories).toContain('mining');
    expect(updatedMachine.workPhases).toContain('exploration');
  });

  it('should retrieve machines by category', async () => {
    const machinesByCategory = await getMachinesByCategory('construction');
    expect(machinesByCategory.length).toBeGreaterThan(0);
    expect(machinesByCategory.some(m => m.id === createdMachineId)).toBe(true);
  });

  it('should retrieve machines by work phase', async () => {
    const machinesByWorkPhase = await getMachinesByWorkPhase('foundation');
    expect(machinesByWorkPhase.length).toBeGreaterThan(0);
    expect(machinesByWorkPhase.some(m => m.id === createdMachineId)).toBe(true);
  });

  afterAll(async () => {
    // Limpar máquina de teste (opcional)
    // await deleteMachine(createdMachineId);
  });
});
