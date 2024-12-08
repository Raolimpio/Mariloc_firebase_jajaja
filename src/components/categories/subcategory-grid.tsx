import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

interface SubcategoryGridProps {
  parentId: string;
}

export function SubcategoryGrid({ parentId }: SubcategoryGridProps) {
  const parentCategory = CATEGORIES.WORK_TYPE;
  const subcategories = parentCategory.subcategories;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {subcategories.map((subcategory) => (
        <Link
          key={subcategory.id}
          to={`/categories/${subcategory.id}`}
          className="block group relative"
        >
          <Card hover className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
              <img
                src={subcategory.imageUrl}
                alt={subcategory.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              <div className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="mb-3 text-lg font-semibold">{subcategory.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{subcategory.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
