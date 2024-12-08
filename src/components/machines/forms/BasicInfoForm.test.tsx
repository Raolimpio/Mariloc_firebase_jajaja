import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BasicInfoForm } from './BasicInfoForm';
import { MACHINE_CATEGORIES, WORK_PHASES, MACHINE_SUBCATEGORIES } from '@/lib/constants';

describe('BasicInfoForm Component', () => {
  const mockFormData = {
    name: 'Test Machine',
    categories: [],
    category: '',
    subcategories: [],
    subcategory: '',
    workPhases: [],
    workPhase: '',
    shortDescription: 'A test machine description',
    longDescription: 'Detailed description of the test machine',
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders all form fields', () => {
    render(<BasicInfoForm formData={mockFormData} onChange={mockOnChange} />);

    expect(screen.getByPlaceholderText('Digite o nome da máquina')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Subcategorias')).toBeInTheDocument();
    expect(screen.getByText('Fases da Obra')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Breve descrição da máquina')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição detalhada da máquina')).toBeInTheDocument();
  });

  test('allows selecting multiple categories', () => {
    render(<BasicInfoForm formData={mockFormData} onChange={mockOnChange} />);

    const categories = MACHINE_CATEGORIES.flatMap(category => category.subcategories);
    const firstCategory = categories[0];
    const secondCategory = categories[1];

    // Select first category
    const firstCategoryCheckbox = screen.getByLabelText(firstCategory) as HTMLInputElement;
    fireEvent.click(firstCategoryCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [firstCategory],
        category: firstCategory,
      })
    );

    // Select second category
    const secondCategoryCheckbox = screen.getByLabelText(secondCategory) as HTMLInputElement;
    fireEvent.click(secondCategoryCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [firstCategory, secondCategory],
        category: firstCategory,
      })
    );
  });

  test('allows selecting multiple subcategories', () => {
    render(<BasicInfoForm formData={mockFormData} onChange={mockOnChange} />);

    const subcategories = Object.values(MACHINE_SUBCATEGORIES).flat();
    const firstSubcategory = subcategories[0];
    const secondSubcategory = subcategories[1];

    // Select first subcategory
    const firstSubcategoryCheckbox = screen.getByLabelText(firstSubcategory) as HTMLInputElement;
    fireEvent.click(firstSubcategoryCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        subcategories: [firstSubcategory],
        subcategory: firstSubcategory,
      })
    );

    // Select second subcategory
    const secondSubcategoryCheckbox = screen.getByLabelText(secondSubcategory) as HTMLInputElement;
    fireEvent.click(secondSubcategoryCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        subcategories: [firstSubcategory, secondSubcategory],
        subcategory: firstSubcategory,
      })
    );
  });

  test('allows selecting multiple work phases', () => {
    render(<BasicInfoForm formData={mockFormData} onChange={mockOnChange} />);

    const workPhases = Object.keys(WORK_PHASES);
    const firstPhase = workPhases[0];
    const secondPhase = workPhases[1];

    // Select first phase
    const firstPhaseCheckbox = screen.getByLabelText(firstPhase) as HTMLInputElement;
    fireEvent.click(firstPhaseCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        workPhases: [firstPhase],
        workPhase: firstPhase,
      })
    );

    // Select second phase
    const secondPhaseCheckbox = screen.getByLabelText(secondPhase) as HTMLInputElement;
    fireEvent.click(secondPhaseCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        workPhases: [firstPhase, secondPhase],
        workPhase: firstPhase,
      })
    );
  });

  test('updates text inputs correctly', () => {
    render(<BasicInfoForm formData={mockFormData} onChange={mockOnChange} />);

    // Test name input
    const nameInput = screen.getByPlaceholderText('Digite o nome da máquina');
    fireEvent.change(nameInput, { target: { value: 'New Machine Name' } });
    expect(mockOnChange).toHaveBeenCalledWith({ name: 'New Machine Name' });

    // Test short description
    const shortDescInput = screen.getByPlaceholderText('Breve descrição da máquina');
    fireEvent.change(shortDescInput, { target: { value: 'New short description' } });
    expect(mockOnChange).toHaveBeenCalledWith({ shortDescription: 'New short description' });

    // Test long description
    const longDescInput = screen.getByPlaceholderText('Descrição detalhada da máquina');
    fireEvent.change(longDescInput, { target: { value: 'New long description' } });
    expect(mockOnChange).toHaveBeenCalledWith({ longDescription: 'New long description' });
  });

  test('handles initial form data with pre-selected items', () => {
    const preSelectedFormData = {
      ...mockFormData,
      categories: ['Construction'],
      subcategories: ['Excavation'],
      workPhases: ['Initial'],
    };

    render(<BasicInfoForm formData={preSelectedFormData} onChange={mockOnChange} />);

    const constructionCheckbox = screen.getByLabelText('Construction') as HTMLInputElement;
    const excavationCheckbox = screen.getByLabelText('Excavation') as HTMLInputElement;
    const initialPhaseCheckbox = screen.getByLabelText('Initial') as HTMLInputElement;

    expect(constructionCheckbox.checked).toBe(true);
    expect(excavationCheckbox.checked).toBe(true);
    expect(initialPhaseCheckbox.checked).toBe(true);
  });
});
