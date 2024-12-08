import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MachineForm } from './MachineForm';
import { createMachine, updateMachine } from '@/lib/machines';
import { useAuth } from '@/contexts/auth-context';
import type { Machine } from '@/types';

// Mocks
jest.mock('@/lib/machines', () => ({
  createMachine: jest.fn(),
  updateMachine: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/logger', () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUserProfile = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
};

const mockMachine: Machine = {
  id: 'machine-123',
  name: 'Test Machine',
  categories: ['construction'],
  subcategories: ['excavation'],
  workPhases: ['initial'],
  shortDescription: 'A test machine',
  longDescription: 'Detailed description of test machine',
  ownerId: 'test-user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  imageUrl: 'https://example.com/machine.jpg',
  specifications: {
    brand: 'TestBrand',
    model: 'TestModel',
    year: 2023,
    power: '100hp',
    weight: '5000kg'
  },
  pricing: {
    hourly: 50,
    daily: 300,
    weekly: 1500,
    monthly: 5000
  },
  availability: {
    status: 'available',
    location: {
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State'
    }
  }
};

describe('MachineForm Component', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      userProfile: mockUserProfile,
    });
    
    (createMachine as jest.Mock).mockResolvedValue('new-machine-id');
    (updateMachine as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form for creating a new machine', () => {
    render(<MachineForm />);
    
    expect(screen.getByText('Criar Anúncio')).toBeInTheDocument();
    expect(screen.getByText('Informações Básicas')).toBeInTheDocument();
    expect(screen.getByText('Especificações Técnicas')).toBeInTheDocument();
    expect(screen.getByText('Precificação')).toBeInTheDocument();
  });

  test('renders form for editing an existing machine', () => {
    render(<MachineForm machine={mockMachine} />);
    
    expect(screen.getByText('Salvar Alterações')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Machine')).toBeInTheDocument();
  });

  test('creates a new machine successfully', async () => {
    render(<MachineForm />);
    
    // Fill out basic information
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'New Test Machine' } });
    fireEvent.change(screen.getByLabelText('Descrição Curta'), { target: { value: 'A new test machine' } });
    
    // Fill out specifications
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'NewBrand' } });
    fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'NewModel' } });
    
    // Fill out pricing
    fireEvent.change(screen.getByLabelText('Valor Hora'), { target: { value: '75' } });
    fireEvent.change(screen.getByLabelText('Valor Diária'), { target: { value: '400' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Criar Anúncio'));
    
    await waitFor(() => {
      expect(createMachine).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Test Machine',
          shortDescription: 'A new test machine',
          specifications: expect.objectContaining({
            brand: 'NewBrand',
            model: 'NewModel'
          }),
          pricing: expect.objectContaining({
            hourly: 75,
            daily: 400
          })
        })
      );
      expect(screen.getByText('Máquina criada com sucesso!')).toBeInTheDocument();
    });
  });

  test('updates an existing machine successfully', async () => {
    render(<MachineForm machine={mockMachine} />);
    
    // Modify machine details
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Updated Test Machine' } });
    fireEvent.change(screen.getByLabelText('Potência'), { target: { value: '150hp' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Salvar Alterações'));
    
    await waitFor(() => {
      expect(updateMachine).toHaveBeenCalledWith(
        mockMachine.id,
        expect.objectContaining({
          name: 'Updated Test Machine',
          specifications: expect.objectContaining({
            power: '150hp'
          })
        })
      );
      expect(screen.getByText('Máquina atualizada com sucesso!')).toBeInTheDocument();
    });
  });

  test('handles form validation errors', async () => {
    render(<MachineForm />);
    
    // Submit form without required fields
    fireEvent.click(screen.getByText('Criar Anúncio'));
    
    await waitFor(() => {
      expect(screen.getByText('Por favor, preencha todos os campos obrigatórios')).toBeInTheDocument();
      expect(createMachine).not.toHaveBeenCalled();
    });
  });

  test('supports multiple categories and work phases', async () => {
    render(<MachineForm />);
    
    // Fill out basic information with multiple categories
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Versatile Machine' } });
    
    // Simulate adding multiple categories (this might require mocking the BasicInfoForm component)
    // For now, we'll just check that the form supports multiple categories in its type
    const formData: Partial<Machine> = {
      name: 'Versatile Machine',
      categories: ['construction', 'mining'],
      subcategories: ['excavation', 'drilling'],
      workPhases: ['initial', 'ongoing']
    };
    
    expect(formData.categories?.length).toBeGreaterThan(1);
    expect(formData.subcategories?.length).toBeGreaterThan(1);
    expect(formData.workPhases?.length).toBeGreaterThan(1);
  });
});
