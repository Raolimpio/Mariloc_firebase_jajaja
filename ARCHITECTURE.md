# Arquitetura do Sistema de Gerenciamento de Máquinas

## 📋 Visão Geral do Sistema

### Objetivo
Sistema de gerenciamento e aluguel de máquinas para construção civil, com foco em flexibilidade, escalabilidade e usabilidade.

## 🏗️ Arquitetura Atual

### Componentes Principais
1. **Frontend**
   - Tecnologia: React + Vite
   - Linguagem: TypeScript
   - Estilização: Tailwind CSS
   - Gerenciamento de Estado: Context API

2. **Backend**
   - Plataforma: Firebase
   - Serviços:
     - Firestore (Banco de Dados)
     - Authentication
     - Storage

3. **Infraestrutura**
   - Hospedagem: A definir
   - CI/CD: A implementar

## 🔍 Modelo de Dados

### Interface de Máquina (`Machine`)

```typescript
interface Machine {
  id: string;
  name: string;
  
  // Categorização Avançada
  categories: string[];
  subcategories: string[];
  workPhases: string[];
  
  // Compatibilidade com versão anterior
  category: string;
  workPhase?: string;
  
  // Metadados Detalhados
  categoryDetails?: {
    [categoryName: string]: {
      primaryCategory?: boolean;
      subcategories?: string[];
      additionalInfo?: Record<string, any>;
      metadata?: Record<string, any>;
      description?: string;
    }
  };
  
  // Informações Descritivas
  shortDescription?: string;
  longDescription?: string;
  
  // Recursos Visuais
  imageUrl?: string;
  photoUrl?: string;
  
  // Metadados Administrativos
  ownerId?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Outras Interfaces Principais

#### Rental
```typescript
interface Rental {
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
}
```

#### Review
```typescript
interface Review {
  id: string;
  machineId: string;
  renterId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
```

## 🚀 Funcionalidades Principais

1. **Gerenciamento de Máquinas**
   - Cadastro com múltiplas categorias
   - Subcategorização detalhada
   - Metadados customizáveis
   - Suporte a múltiplas fases de trabalho

2. **Sistema de Aluguel**
   - Reserva de máquinas
   - Gestão de períodos
   - Diferentes modalidades de precificação
   - Opções de entrega

3. **Avaliação e Feedback**
   - Sistema de reviews
   - Classificação por estrelas
   - Comentários detalhados

## 🛠️ Tecnologias e Ferramentas

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Ícones)
- React Hook Form
- Zod (Validação)

### Backend
- Firebase Firestore
- Firebase Authentication
- Firebase Storage

### Ferramentas de Desenvolvimento
- ESLint
- Prettier
- TypeScript
- PostCSS
- Vite

## 📊 Padrões e Práticas

1. **Tipagem Forte**
   - Uso extensivo de TypeScript
   - Interfaces bem definidas
   - Validação de dados

2. **Componentização**
   - Componentes reutilizáveis
   - Separação de responsabilidades
   - Design system consistente

3. **Gerenciamento de Estado**
   - Context API
   - Custom Hooks
   - Minimal prop drilling

## 🔒 Segurança

- Autenticação via Firebase
- Regras de segurança no Firestore
- Validação no lado do cliente e servidor
- Proteção contra injeção de dados

## 🚧 Próximos Passos

1. Implementar testes unitários
2. Configurar CI/CD
3. Adicionar monitoramento de performance
4. Expandir sistema de notificações
5. Implementar relatórios gerenciais

## 📝 Notas de Migração

- Migração realizada em 2024
- Script de migração preservou dados históricos
- Nenhuma perda de informação durante a transição
- Arquitetura mantém compatibilidade retroativa

---

**Última Atualização:** $(date +"%d/%m/%Y")
**Versão da Arquitetura:** 2.0.0
