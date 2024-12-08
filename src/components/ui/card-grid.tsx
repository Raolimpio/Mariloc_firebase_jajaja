import React from 'react';
import { Link } from 'react-router-dom';

export interface CardItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  href?: string;
}

interface CardGridProps {
  items: CardItem[];
  columns?: number;
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  items,
  columns = 3,
  className = ''
}) => {
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[columns] || 'grid-cols-3';

  return (
    <div className={`grid ${gridColumns} gap-4 ${className}`}>
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
        >
          {item.imageUrl && (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-48 object-cover" 
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
            )}
            {item.href && (
              <Link 
                to={item.href} 
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Ver Detalhes
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
