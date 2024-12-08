import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { MessageSquare, Share2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { MACHINE_CATEGORIES, DEFAULT_CATEGORY_IMAGE } from '@/lib/constants';
import type { Machine } from '@/types';

export default function MachineDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMachine() {
      if (!id) return;

      try {
        const docRef = doc(db, 'machines', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setMachine({ id: docSnap.id, ...docSnap.data() } as Machine);
        } else {
          navigate('/categories');
        }
      } catch (error) {
        console.error('Erro ao carregar máquina:', error);
        navigate('/categories');
      } finally {
        setLoading(false);
      }
    }

    loadMachine();
  }, [id, navigate]);

  if (loading || !machine) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const category = MACHINE_CATEGORIES.find((cat) => cat.id === machine.category);
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Tipos de Trabalho', href: '/categories' },
    { label: category?.name || 'Categoria', href: `/categories/${machine.category}` },
    { label: machine.name }
  ];

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de alugar a máquina ${machine.name}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: machine.name,
          text: machine.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="container mx-auto px-4">
          {/* Category Banner */}
          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="relative aspect-[3/1] w-full">
              <img
                src={category?.image || DEFAULT_CATEGORY_IMAGE}
                alt={category?.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_CATEGORY_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <Breadcrumb items={breadcrumbItems} className="mb-4 text-white/80" />
                <h1 className="text-4xl font-bold text-white">{machine.name}</h1>
                <p className="mt-2 text-lg text-white/90">{machine.shortDescription}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Product Image */}
              <div className="mb-8 overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={machine.imageUrl || machine.photoUrl || DEFAULT_CATEGORY_IMAGE}
                    alt={machine.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_CATEGORY_IMAGE;
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Descrição</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600">{machine.longDescription}</p>
                </div>
              </div>

              {/* Video Section */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">Vídeo do Produto</h2>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/m_vedl0aUps?si=lF-zZCUXe5kHdYrb&controls=0"
                    title={`Vídeo de ${machine.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-semibold">Faça sua Reserva</h2>
                
                <div className="grid gap-4">
                  <Button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Alugar pelo WhatsApp
                  </Button>

                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Solicitar Orçamento
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-5 w-5" />
                    Compartilhar
                  </Button>
                </div>

                <div className="mt-6 rounded-lg bg-primary-50 p-4">
                  <h3 className="mb-2 font-medium text-primary-900">Instruções</h3>
                  <p className="text-sm text-primary-700">
                    Para a utilização segura deste equipamento, utilize EPI (Equipamento de Proteção Individual)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}