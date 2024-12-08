import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MACHINE_CATEGORIES, DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import { getCategories } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ImageIcon } from 'lucide-react';
import { CategoryImageUpload } from './category-image-upload';

type Category = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  subcategories?: string[];
  metadata?: {
    icon?: string;
    type?: string;
    colors?: {
      primaryColor?: string;
      secondaryColor?: string;
      textColor?: string;
    };
    imageCredit?: {
      photographer?: string;
      source?: string;
    };
  };
};

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // First, try to fetch from Firestore
        const fetchedCategories = await getCategories();
        
        // Transform Firestore categories to our expected format
        const transformedCategories = fetchedCategories.map(category => ({
          id: category.id,
          title: category.title,
          description: category.description,
          imageUrl: category.imageUrl,
          subcategories: category.machines || [],
          metadata: category.metadata
        }));

        // If no categories found in Firestore, use local fallback
        setCategories(
          transformedCategories.length > 0 
            ? transformedCategories 
            : MACHINE_CATEGORIES.map(cat => ({
                id: cat.id,
                title: cat.name,
                imageUrl: cat.imageUrl,
                description: cat.description,
                subcategories: cat.subcategories,
                metadata: {
                  icon: cat.icon,
                  type: 'main_category',
                  colors: cat.metadata,
                }
              }))
        );
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Não foi possível carregar as categorias');
        setCategories(
          MACHINE_CATEGORIES.map(cat => ({
            id: cat.id,
            title: cat.name,
            imageUrl: cat.imageUrl,
            description: cat.description,
            subcategories: cat.subcategories,
            metadata: {
              icon: cat.icon,
              type: 'main_category',
              colors: cat.metadata,
            }
          }))
        );
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderCard = (category: Category) => {
    const primaryColor = category.metadata?.colors?.primaryColor || '#2c3e50';
    const secondaryColor = category.metadata?.colors?.secondaryColor || '#34495e';
    const textColor = category.metadata?.colors?.textColor || '#ffffff';

    return (
      <Link
        key={category.id}
        to={`/categories/${category.id}`}
        className="block group relative"
        style={{ 
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor,
          '--text-color': textColor
        } as React.CSSProperties}
        onClick={(e) => {
          // Prevent navigation if upload button is clicked
          const target = e.target as HTMLElement;
          const uploadButton = target.closest('[data-upload-button]');
          
          if (uploadButton) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <Card 
          hover 
          className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg"
          style={{
            borderColor: primaryColor,
            boxShadow: `0 4px 6px -1px ${primaryColor}40`
          }}
        >
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
            <CategoryImageUpload 
              categoryId={category.id} 
              currentImageUrl={category.imageUrl}
            />
            <img
              src={
                category.imageUrl || 
                `/images/categories/${category.id}.jpg` || 
                DEFAULT_CATEGORY_IMAGE.url
              }
              alt={category.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_CATEGORY_IMAGE.url;
              }}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" 
              style={{
                background: `linear-gradient(to top, ${primaryColor}80 0%, transparent 70%)`
              }} 
            />
            {category.metadata?.icon && (
              <div 
                className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm"
                style={{ color: textColor }}
              >
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
          </div>
          <CardContent 
            className="p-6" 
            style={{ 
              backgroundColor: `${secondaryColor}10`,
              color: primaryColor 
            }}
          >
            <h3 
              className="mb-3 text-lg font-semibold"
              style={{ color: primaryColor }}
            >
              {category.title}
            </h3>
            {category.description && (
              <p 
                className="text-sm mb-3 opacity-80"
                style={{ color: primaryColor }}
              >
                {category.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {category.subcategories?.slice(0, 3).map((item) => (
                <Badge
                  key={`${category.id}-${item}`}
                  variant="secondary"
                  className="bg-white/20 text-white hover:bg-white/30"
                  style={{
                    backgroundColor: `${secondaryColor}40`,
                    color: textColor
                  }}
                >
                  {item}
                </Badge>
              ))}
              {(category.subcategories?.length || 0) > 3 && (
                <Badge 
                  variant="secondary"
                  className="bg-white/20 text-white hover:bg-white/30"
                  style={{
                    backgroundColor: `${primaryColor}40`,
                    color: textColor
                  }}
                >
                  +{(category.subcategories?.length || 0) - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading ? (
        <div className="col-span-full flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="col-span-full text-center text-red-500">
          {error}
        </div>
      ) : (
        categories.map(renderCard)
      )}
    </div>
  );
}