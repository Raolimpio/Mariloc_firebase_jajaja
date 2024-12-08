import React from 'react';
import { Briefcase, Layers } from 'lucide-react';

export const WORK_PHASES = {
  'Canteiro de obras': {
    machines: [
      'Geradores',
      'Compressores',
      'Ferramentas Elétricas',
      'Ferramentas Manuais',
      'Equipamentos de Segurança'
    ]
  },
  'Cobertura': {
    machines: [
      'Andaimes',
      'Escadas',
      'Guinchos',
      'Plataformas Elevatórias'
    ]
  },
  'Fundação': {
    machines: [
      'Escavadeiras',
      'Retroescavadeiras',
      'Compactadores',
      'Placas Vibratórias'
    ]
  },
  'Estrutura e alvenaria': {
    machines: [
      'Betoneiras',
      'Vibradores de Concreto',
      'Bombas de Concreto',
      'Andaimes',
      'Escoras',
      'Formas'
    ]
  },
  'Inst. elétricas e hidrossanitárias': {
    machines: [
      'Furadeiras',
      'Marteletes',
      'Ferramentas Elétricas',
      'Equipamentos de Medição'
    ]
  },
  'Esquadrias': {
    machines: [
      'Serras',
      'Furadeiras',
      'Parafusadeiras',
      'Ferramentas Manuais'
    ]
  },
  'Revestimento': {
    machines: [
      'Lixadeiras',
      'Misturadores',
      'Desempenadeiras',
      'Réguas Vibratórias'
    ]
  },
  'Acabamento': {
    machines: [
      'Lixadeiras',
      'Pinturas',
      'Compressores',
      'Ferramentas Manuais'
    ]
  },
  'Jardinagem': {
    machines: [
      'Cortadores de Grama',
      'Roçadeiras',
      'Motosserras',
      'Ferramentas de Jardim'
    ]
  },
  'Limpeza': {
    machines: [
      'Lavadoras de Alta Pressão',
      'Aspiradores',
      'Varredeiras',
      'Equipamentos de Limpeza'
    ]
  }
};

export const MACHINE_SUBCATEGORIES = {
  'Movimentação de Terra': [
    'Escavadeiras',
    'Retroescavadeiras',
    'Pás-carregadeiras',
    'Mini-carregadeiras',
  ],
  'Compactação': [
    'Compactadores',
    'Placas Vibratórias',
    'Rolos Compactadores',
  ],
  'Concretagem': [
    'Betoneiras',
    'Vibradores de Concreto',
    'Bombas de Concreto',
  ],
  'Elevação': [
    'Guindastes',
    'Guinchos',
    'Plataformas Elevatórias',
  ],
  'Estruturas': [
    'Andaimes',
    'Escoras',
    'Formas',
  ],
  'Energia e Ar': [
    'Geradores',
    'Compressores',
  ],
  'Ferramentas': [
    'Ferramentas Elétricas',
    'Ferramentas Manuais',
    'Equipamentos de Pintura',
    'Equipamentos de Solda',
    'Equipamentos de Corte',
  ],
  'Equipamentos de Apoio': [
    'Equipamentos de Medição',
    'Equipamentos de Segurança',
  ],
};

export const CATEGORIES = {
  WORK_TYPE: {
    id: 'work-type',
    name: 'Tipo de Trabalho',
    type: 'parent_category',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    description: 'Categorias de trabalho disponíveis',
    subcategories: [
      {
        id: 'construction',
        name: 'Construção Civil',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
        description: 'Serviços gerais de construção civil'
      },
      {
        id: 'construction-equipment',
        name: 'Máquinas e equipamentos para construção civil',
        imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
        description: 'Equipamentos específicos para construção'
      },
      {
        id: 'earth-moving',
        name: 'Movimentação de Terra',
        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
        description: 'Serviços de movimentação e preparação de terreno'
      },
      {
        id: 'concrete',
        name: 'Concretagem',
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
        description: 'Serviços de concretagem e fundação'
      },
      {
        id: 'elevation',
        name: 'Elevação',
        imageUrl: 'https://images.unsplash.com/photo-1495555687398-3f50d6e79e1e?auto=format&fit=crop&q=80&w=800',
        description: 'Equipamentos para elevação e transporte vertical'
      },
      {
        id: 'tools',
        name: 'Ferramentas',
        imageUrl: 'https://images.unsplash.com/photo-1581241309152-a3d5f6fa52f2?auto=format&fit=crop&q=80&w=800',
        description: 'Ferramentas diversas para construção'
      }
    ]
  }
};

export const MACHINE_CLASSIFICATIONS = {
  ...WORK_PHASES,
  ...MACHINE_SUBCATEGORIES
};

export const MACHINE_CATEGORIES = [
  {
    id: 'construction',
    name: 'Construção Civil',
    description: 'Máquinas e equipamentos para construção civil',
    subcategories: [
      ...Object.values(MACHINE_SUBCATEGORIES).flat(),
      ...Object.keys(WORK_PHASES)
    ],
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
    icon: 'construction',
    metadata: {
      primaryColor: '#2c3e50',
      secondaryColor: '#34495e',
      textColor: '#ffffff'
    }
  }
];

export const CATEGORY_TYPES = {
  WORK_TYPE: {
    name: 'Tipo de Trabalho',
    icon: React.createElement(Briefcase, { className: 'h-5 w-5' }),
    description: 'Categorias de trabalho disponíveis'
  },
  WORK_PHASE: {
    name: 'Fase da Obra',
    icon: React.createElement(Layers, { className: 'h-5 w-5' }),
    description: 'Fases de desenvolvimento da obra'
  }
};

export const DEFAULT_CATEGORY_IMAGE = {
  url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
  alt: 'Máquinas de construção civil em um canteiro de obras',
  credit: {
    photographer: 'Unsplash',
    source: 'https://unsplash.com/photos/construction-site-machines'
  }
};