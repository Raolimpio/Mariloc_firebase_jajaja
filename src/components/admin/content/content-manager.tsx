import { useState } from 'react';
import { Layout, Grid, Clock, Video, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BannerManager } from './banner-manager';
import { CategoryManager } from './category-manager';
import { PhaseManager } from './phase-manager';
import { ProductVideoManager } from './product-video-manager';

type ContentSection = 'banners' | 'categories' | 'phases' | 'videos';

export function ContentManager() {
  const [activeSection, setActiveSection] = useState<ContentSection>('banners');

  const sections = [
    {
      id: 'banners' as const,
      name: 'Banners',
      icon: Layout,
      description: 'Gerencie os banners da página inicial',
      color: 'bg-blue-500'
    },
    {
      id: 'categories' as const,
      name: 'Categorias',
      icon: Grid,
      description: 'Configure as categorias de máquinas',
      color: 'bg-green-500'
    },
    {
      id: 'phases' as const,
      name: 'Fases da Obra',
      icon: Clock,
      description: 'Organize as fases do processo construtivo',
      color: 'bg-purple-500'
    },
    {
      id: 'videos' as const,
      name: 'Vídeos',
      icon: Video,
      description: 'Gerencie vídeos dos produtos',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Card
            key={section.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeSection === section.id ? 'ring-2 ring-primary-600' : ''
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <div className="p-6">
              <div className={`mb-4 inline-flex rounded-lg ${section.color} p-3 text-white`}>
                <section.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">{section.name}</h3>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {activeSection === 'banners' && <BannerManager />}
        {activeSection === 'categories' && <CategoryManager />}
        {activeSection === 'phases' && <PhaseManager />}
        {activeSection === 'videos' && <ProductVideoManager />}
      </div>
    </div>
  );
}