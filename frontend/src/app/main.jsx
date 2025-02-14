import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GeneratorPage from '@/pages/GeneratorPage';
import { Toaster } from "@/shared/ui/toaster";
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-[#F3F0FF] to-[#E8E3FF] p-4 sm:p-6 lg:p-8">
      <GeneratorPage />
      <Toaster />
    </div>
  </StrictMode>
);