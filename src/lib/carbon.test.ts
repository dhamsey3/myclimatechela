import { describe, expect, it } from 'vitest';
import { CATEGORIES, convertAmounts, estimate, formatTonnes } from './carbon';

describe('carbon estimate', () => {
  it('turns weekly and monthly answers into kg of CO2 a year', () => {
    // 100 km a week at 0.25 kg/km, and 200 kWh a month at the world average 0.48 kg/kWh
    const { totalKg, parts } = estimate({ car: 100, electricity: 200 }, 'metric');
    expect(parts.find((p) => p.category.id === 'car')?.kg).toBeCloseTo(1300);
    expect(parts.find((p) => p.category.id === 'electricity')?.kg).toBeCloseTo(1152);
    expect(totalKg).toBeCloseTo(2452);
  });

  it('uses kilograms, not pounds, for electricity', () => {
    // The old factor (0.92) was a pounds figure; a kg factor above 0.6 would be wrong for any average grid.
    for (const category of CATEGORIES.filter((c) => c.id === 'electricity')) {
      expect(category.measures.metric.kgPerUnit).toBeLessThan(0.6);
      expect(category.measures.us.kgPerUnit).toBeLessThan(0.6);
    }
  });

  it('names the largest source and ignores negative or blank answers', () => {
    const { largest, totalKg } = estimate({ flights: 10, diet: -5 }, 'us');
    expect(largest?.category.id).toBe('flights');
    expect(totalKg).toBe(900);
    expect(estimate({}, 'metric').largest).toBeNull();
  });

  it('converts distance and drops home gas when switching units', () => {
    expect(convertAmounts({ car: '100', gas: '6', diet: '4' }, 'us')).toEqual({ car: '62', diet: '4' });
    expect(convertAmounts({ car: '62' }, 'metric')).toEqual({ car: '100' });
  });

  it('formats tonnes with one decimal place', () => {
    expect(formatTonnes(2452)).toBe('2.5');
    expect(formatTonnes(40)).toBe('under 0.1');
    expect(formatTonnes(0)).toBe('0.0');
  });
});
