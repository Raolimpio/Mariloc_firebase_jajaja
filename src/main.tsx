import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@/contexts/auth-context';
import App from './App';
import './index.css';

console.log('Starting application...');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

try {
  const root = createRoot(rootElement);
  console.log('Created React root');

  root.render(
    <StrictMode>
      <div className="min-h-screen bg-gray-50">
        <AuthProvider>
          <App />
        </AuthProvider>
      </div>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Mostrar erro visível para o usuário
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: red;">Erro ao carregar a aplicação</h1>
      <p>Por favor, recarregue a página. Se o erro persistir, contate o suporte.</p>
    </div>
  `;
}