export type UnitSystem = 'metric' | 'us';
export type CategoryId = 'car' | 'electricity' | 'gas' | 'flights' | 'diet' | 'shopping';

interface Measure {
  unit: string;
  question: string;
  timesPerYear: number;
  kgPerUnit: number;
}

export interface CarbonCategory {
  id: CategoryId;
  label: string;
  measures: Record<UnitSystem, Measure>;
  tip: string;
}

// kg of CO2 per unit. Sources are listed in the calculator's method note.
export const CATEGORIES: CarbonCategory[] = [
  {
    id: 'car',
    label: 'Driving',
    measures: {
      metric: { unit: 'km a week', question: 'How far do you drive in a week?', timesPerYear: 52, kgPerUnit: 0.25 },
      us: { unit: 'miles a week', question: 'How far do you drive in a week?', timesPerYear: 52, kgPerUnit: 0.4 },
    },
    tip: 'Combining trips, sharing rides or taking public transport for one regular journey a week makes a visible difference.',
  },
  {
    id: 'electricity',
    label: 'Electricity',
    measures: {
      metric: { unit: 'kWh a month', question: 'How much electricity does your home use in a month?', timesPerYear: 12, kgPerUnit: 0.48 },
      us: { unit: 'kWh a month', question: 'How much electricity does your home use in a month?', timesPerYear: 12, kgPerUnit: 0.37 },
    },
    tip: 'Efficient lighting and appliances cut how much you use, and a renewable tariff or solar cuts the emissions behind each unit.',
  },
  {
    id: 'gas',
    label: 'Home gas',
    measures: {
      metric: { unit: 'kg LPG a month', question: 'How much cooking or heating gas (LPG) do you use in a month?', timesPerYear: 12, kgPerUnit: 3.0 },
      us: { unit: 'therms a month', question: 'How much natural gas does your home use in a month?', timesPerYear: 12, kgPerUnit: 5.3 },
    },
    tip: 'Lids on pots, efficient burners and well-sealed rooms all reduce how much gas you burn.',
  },
  {
    id: 'flights',
    label: 'Flights',
    measures: {
      metric: { unit: 'hours a year', question: 'How many hours do you spend flying in a year?', timesPerYear: 1, kgPerUnit: 90 },
      us: { unit: 'hours a year', question: 'How many hours do you spend flying in a year?', timesPerYear: 1, kgPerUnit: 90 },
    },
    tip: 'One fewer return flight a year often outweighs months of other changes.',
  },
  {
    id: 'diet',
    label: 'Meals with meat',
    measures: {
      metric: { unit: 'meals a week', question: 'How many of your meals in a week include meat?', timesPerYear: 52, kgPerUnit: 2.5 },
      us: { unit: 'meals a week', question: 'How many of your meals in a week include meat?', timesPerYear: 52, kgPerUnit: 2.5 },
    },
    tip: 'Swapping a few meat meals a week for plant-based ones lowers this quickly, especially when they replace beef.',
  },
  {
    id: 'shopping',
    label: 'New things',
    measures: {
      metric: { unit: 'USD a month', question: 'How much do you spend on new things in a month, in US dollars?', timesPerYear: 12, kgPerUnit: 0.5 },
      us: { unit: 'USD a month', question: 'How much do you spend on new things in a month?', timesPerYear: 12, kgPerUnit: 0.5 },
    },
    tip: 'Buying fewer, longer-lasting or second-hand things lowers the emissions made before they reach you.',
  },
];

// Average CO2 per person per year from all sources, in tonnes (2023).
export const WORLD_AVERAGE_TONNES = 4.7;
export const US_AVERAGE_TONNES = 14;

const KM_PER_MILE = 1.609344;

export interface EstimatePart {
  category: CarbonCategory;
  kg: number;
}

export interface Estimate {
  parts: EstimatePart[];
  totalKg: number;
  largest: EstimatePart | null;
}

export const categoryKg = (category: CarbonCategory, system: UnitSystem, amount: number) => {
  const measure = category.measures[system];
  return Math.max(0, amount) * measure.timesPerYear * measure.kgPerUnit;
};

export const estimate = (amounts: Partial<Record<CategoryId, number>>, system: UnitSystem): Estimate => {
  const parts = CATEGORIES.map((category) => ({ category, kg: categoryKg(category, system, amounts[category.id] ?? 0) }));
  const totalKg = parts.reduce((sum, part) => sum + part.kg, 0);
  const largest = totalKg > 0 ? parts.reduce((a, b) => (b.kg > a.kg ? b : a)) : null;
  return { parts, totalKg, largest };
};

/**
 * Carry entered amounts across a units switch: distances convert, while home
 * gas is dropped because the two systems ask about different fuels.
 */
export const convertAmounts = (
  amounts: Partial<Record<CategoryId, string>>,
  to: UnitSystem,
): Partial<Record<CategoryId, string>> => {
  const next = { ...amounts };
  delete next.gas;
  const distance = parseFloat(amounts.car ?? '');
  if (Number.isFinite(distance)) {
    const converted = to === 'metric' ? distance * KM_PER_MILE : distance / KM_PER_MILE;
    next.car = String(Math.round(converted));
  }
  return next;
};

export const formatTonnes = (kg: number) => {
  const tonnes = kg / 1000;
  if (tonnes > 0 && tonnes < 0.1) return 'under 0.1';
  return tonnes.toFixed(1);
};
