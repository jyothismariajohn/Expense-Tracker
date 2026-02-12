import type { Metadata } from 'next';
import './globals.css';
import { EstateProvider } from './context/EstateContext';
import Navigation from './components/Navigation';

export const metadata: Metadata = {
  title: 'Pineapple Estate Expenses',
  description: 'Premium Expense Tracking for Supervisors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EstateProvider>
          <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
            <Navigation />
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        </EstateProvider>
      </body>
    </html>
  );
}
