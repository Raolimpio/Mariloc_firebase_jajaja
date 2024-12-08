export interface Machine {
  id: string;
  name: string;
  
  /** Lista de categorias associadas à máquina */
  categories: string[];
  
  /** Lista de fases da obra em que a máquina pode ser utilizada */
  workPhases: string[];
  
  /** Subcategorias detalhadas */
  subcategories: string[];
  
  /** Categoria principal (mantida para compatibilidade) */
  category: string;
  
  /** Fase da obra principal (mantida para compatibilidade) */
  workPhase?: string;
  
  shortDescription?: string;
  longDescription?: string;
  imageUrl?: string;
  photoUrl?: string;
  ownerId?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  /** 
   * Detalhes avançados de categorização 
   * Permite armazenar metadados específicos para cada categoria/fase
   */
  categoryDetails?: {
    [categoryName: string]: {
      /** Informações adicionais específicas da categoria */
      additionalInfo?: Record<string, any>;
      
      /** Indica se esta é a categoria principal */
      primaryCategory?: boolean;
      
      /** Metadados customizáveis */
      metadata?: Record<string, any>;
      
      /** Subcategorias específicas */
      subcategories?: string[];
      
      /** Descrição detalhada da categoria */
      description?: string;
    }
  };

  description: string;
  specifications: {
    brand: string;
    model: string;
    year: number;
    power: string;
    weight: string;
  };
  photos: {
    main: string;
    gallery: string[];
  };
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  availability: {
    status: 'available' | 'rented' | 'maintenance';
    location: {
      address: string;
      city: string;
      state: string;
    };
  };
}

export interface Rental {
  id: string;
  machineId: string;
  renterId: string;
  ownerId: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  period: {
    start: Date;
    end: Date;
  };
  pricing: {
    type: 'hourly' | 'daily' | 'weekly' | 'monthly';
    value: number;
    total: number;
  };
  location: {
    delivery: boolean;
    address: string;
    city: string;
    state: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  machineId: string;
  renterId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}