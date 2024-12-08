import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MachineGrid } from '@/components/machines/machine-grid';
import { PhaseHeader } from '@/components/phases/phase-header';
import { PhaseFilters } from '@/components/phases/phase-filters';
import { db } from '@/lib/firebase';
import { WORK_PHASES } from '@/lib/constants';
import type { Machine } from '@/types';

export default function WorkPhasePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    subcategory: searchParams.get('subcategory') || '',
  });

  const phase = id ? Object.entries(WORK_PHASES).find(([name]) => 
    name.toLowerCase().replace(/\s+/g, '-') === id
  )?.[0] : null;

  const phaseData = phase ? WORK_PHASES[phase] : null;

  useEffect(() => {
    console.log('URL ID:', id);
    console.log('Parsed Phase:', phase);
    console.log('Phase Data:', phaseData);
    console.log('Machines:', machines);

    if (!phase) {
      navigate('/phases');
      return;
    }

    async function loadMachines() {
      try {
        const machinesRef = collection(db, 'machines');
        const q = query(machinesRef, where('workPhase', '==', phase));
        const querySnapshot = await getDocs(q);
        
        const machinesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Machine[];
        
        setMachines(machinesData);
      } catch (error) {
        console.error('Error loading machines:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMachines();
  }, [phase, navigate, id, machines]);

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Tipos de Trabalho', href: '/categories' },
    { label: 'Fases da Obra', href: '/phases' },
    { label: phase || '' }
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
          
          {phase && phaseData && (
            <PhaseHeader 
              phase={phase}
              machines={phaseData.machines}
              totalMachines={machines.length}
            />
          )}

          <PhaseFilters
            phase={phase}
            machines={phaseData?.machines || []}
            onFilter={setFilters}
            totalMachines={machines.length}
            filteredCount={filteredMachines.length}
            initialFilters={{
              search: searchParams.get('q') || '',
              subcategory: searchParams.get('subcategory') || '',
            }}
          />

          <MachineGrid
            machines={filteredMachines}
            loading={loading}
            onMachineClick={(machine) => navigate(`/machines/${machine.id}`)}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}