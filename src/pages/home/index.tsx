import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { BrandSlider } from '@/components/home/brand-slider';
import { FeaturedMachines } from '@/components/home/featured-machines';
import { NewsletterSection } from '@/components/home/newsletter-section';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        
        <BrandSlider />

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Categorias em Destaque</h2>
              <p className="mt-2 text-gray-600">
                Encontre o equipamento ideal para seu projeto
              </p>
            </div>
            <FeaturedCategories />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Máquinas em Destaque</h2>
              <p className="mt-2 text-gray-600">
                As melhores opções para sua obra
              </p>
            </div>
            <FeaturedMachines />
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}