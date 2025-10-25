import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js 14 Calculator',
  description: 'A responsive and colorful calculator built with Next.js 14, Tailwind CSS, and Server Actions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-calc-bg text-calc-text-primary min-h-screen flex items-center justify-center p-4`}>
        {children}
      </body>
    </html>
  );
}