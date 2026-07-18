import { describe, expect, it } from 'vitest';
import calculatorSource from './CarbonCalculator.tsx?raw';
import supportSource from './BuyMeACoffee.tsx?raw';

describe('homepage utility surfaces', () => {
  it('associates calculator inputs and discloses estimate limitations', () => {
    expect(calculatorSource).toContain('htmlFor={`carbon-${category.id}`}');
    expect(calculatorSource).toContain('id={`carbon-${category.id}`}');
    expect(calculatorSource).toContain('broad estimate');
    expect(calculatorSource).not.toContain('bg-gradient-to');
  });

  it('keeps support treatment restrained and responsive', () => {
    expect(supportSource).toMatch(/flex-col[^"`]*sm:flex-row/);
    expect(supportSource).not.toContain('bg-gradient-to');
    expect(supportSource).not.toContain('hover:scale');
  });
});
