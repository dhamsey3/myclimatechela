import { describe, expect, it } from 'vitest';
import navigationSource from './Navigation.tsx?raw';
import footerSource from './Footer.tsx?raw';
import themeToggleSource from './ThemeToggle.tsx?raw';

describe('editorial site shell', () => {
  it('provides a skip link and restrained navigation motion', () => {
    expect(navigationSource).toContain('Skip to content');
    expect(navigationSource).toContain('href="#main-content"');
    expect(navigationSource).not.toContain('rotate: 360');
    expect(navigationSource).not.toContain('initial={{ y: -100 }}');
  });

  it('keeps the mobile brand and controls within a narrow viewport', () => {
    expect(navigationSource).toContain('h-8 w-8');
    expect(navigationSource).toContain('text-base');
    expect(themeToggleSource).toContain('w-9 h-9');
  });

  it('uses semantic footer destinations without gradient decoration', () => {
    expect(footerSource).toContain('<Link');
    expect(footerSource).toContain('<a');
    expect(footerSource).not.toMatch(/<span[^>]*onClick=/);
    expect(footerSource).not.toContain('bg-gradient-to');
  });
});
