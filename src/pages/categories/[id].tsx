import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CategoryHeader } from '@/components/categories/category-header';
import { CategoryFilters } from '@/components/categories/category-filters';
import { MachineGrid } from '@/components/machines/machine-grid';
import { db } from '@/lib/firebase';
import { CATEGORIES } from '@/lib/constants';
import type { Machine } from '@/types';

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    subcategory: searchParams.get('subcategory') || '',
  });

  const workTypeCategory = CATEGORIES.WORK_TYPE;
  const category = workTypeCategory.subcategories.find((cat) => cat.id === id);

  useEffect(() => {
    async function loadMachines() {
      try {
        const machinesRef = collection(db, 'machines');
        let q = query(machinesRef);

        if (id) {
          q = query(machinesRef, where('category', '==', id));
        }

        const querySnapshot = await getDocs(q);
        const machinesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Machine[];
        
        setMachines(machinesData);
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMachines();
  }, [id]);

  if (!category && id) {
    navigate('/categories');
    return null;
  }

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Tipos de Trabalho', href: '/categories' },
    { label: category?.name || 'Categoria' }
  ];

  const filteredMachines = machines.filter(machine => {
    if (filters.subcategory && machine.subcategory !== filters.subcategory) {
      return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        machine.name.toLowerCase().includes(searchTerm) ||
        machine.shortDescription?.toLowerCase().includes(searchTerm) ||
        machine.category.toLowerCase().includes(searchTerm) ||
        machine.subcategory.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <Breadcrumb items={breadcrumbItems} className="mb-6" />
          
          {category && (
            <CategoryHeader 
              category={{
                id: category.id,
                name: category.name,
                description: category.description,
                image: category.imageUrl,
                subcategories: []
              }}
              totalMachines={machines.length} 
            />
          )}

          <CategoryFilters
            onFilter={setFilters}
            totalMachines={machines.length}
            filteredCount={filteredMachines.length}
            initialFilters={filters}
          />

          <div className="mt-8">
            <MachineGrid machines={filteredMachines} loading={loading} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}