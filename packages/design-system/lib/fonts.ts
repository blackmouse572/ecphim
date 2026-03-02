import { cn } from '@repo/design-system/lib/utils';
import { Be_Vietnam_Pro, Space_Mono } from '@next/font/google';

// Primary font: Be Vietnam Pro - for body text and UI elements
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-primary',
  display: 'swap',
});
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

// Accent font: Geist Mono - for headlines, feature titles, technical data
export const fonts = cn(
  beVietnamPro.variable,
  spaceMono.variable,
  'touch-manipulation font-primary antialiased'
);
