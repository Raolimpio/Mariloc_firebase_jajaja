import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { 
  Briefcase, 
  Layers, 
  ChevronRight, 
  Grid, 
  List, 
  Search 
} from 'lucide-react';
import { CATEGORY_TYPES, CATEGORIES, WORK_PHASES, DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { CardGrid, CardItem } from '@/components/ui/card-grid';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function CategoriesPage() {
  const [selectedType, setSelectedType] = useState<string | null>('Fase da Obra');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  console.log('CATEGORY_TYPES:', CATEGORY_TYPES);
  console.log('CATEGORIES:', CATEGORIES);
  console.log('WORK_PHASES:', WORK_PHASES);

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Tipos de Trabalho', href: '/categories' }
  ];

  const filteredCategories = selectedType === 'Tipo de Trabalho' 
    ? CATEGORIES.WORK_TYPE.subcategories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedType === 'Fase da Obra'
    ? Object.keys(WORK_PHASES).map(phase => ({
        id: phase.toLowerCase().replace(/\s+/g, '-'),
        name: phase,
        description: `Fase de ${phase}`,
        imageUrl: DEFAULT_CATEGORY_IMAGE.url,
        machines: WORK_PHASES[phase].machines,
        type: 'work-phase'
      })).filter(phase => 
        phase.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  console.log('Selected Type:', selectedType);
  console.log('Filtered Categories:', filteredCategories);

  const searchedCategories = filteredCategories;

  const categoryItems: CardItem[] = searchedCategories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    imageUrl: category.imageUrl,
    href: `/${category.type === 'work-phase' ? 'phases' : 'categories'}/${category.id}`
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Selecione uma Categoria</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon" 
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-5 w-5" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon" 
              onClick={() => setViewMode('list')}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-6 flex space-x-4">
          {Object.keys(CATEGORY_TYPES).map((typeKey) => {
            const type = CATEGORY_TYPES[typeKey];
            return (
              <Button
                key={typeKey}
                variant={selectedType === type.name ? 'default' : 'outline'}
                onClick={() => setSelectedType(type.name)}
                className="flex items-center space-x-2"
              >
                {type.icon}
                <span>{type.name}</span>
              </Button>
            );
          })}
        </div>

        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={`Buscar ${selectedType === 'Fase da Obra' ? 'fases' : 'categorias'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {selectedType && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {selectedType === 'Fase da Obra' 
                ? 'Fases da Construção' 
                : 'Tipos de Trabalho'}
            </h2>
            <CardGrid 
              items={categoryItems} 
              columns={3}
            />
          </div>
        )}

        {!selectedType && (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-600">Selecione um tipo de categoria para visualizar</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}