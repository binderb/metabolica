import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/lib/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const source = Source_Sans_3({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--source',
});

export const metadata: Metadata = {
  title: 'Metabolica',
  description: 'Practice modules for biochemistry students.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={`${source.variable} font-source bg-gradient-to-b from-skyblue to-seafoam bg-fixed bg-no-repeat text-dark`}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
