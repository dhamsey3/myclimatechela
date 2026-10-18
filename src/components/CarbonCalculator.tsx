import { useState } from 'react';
import { Car, Zap, Flame, Plane, Utensils, ShoppingBag, RotateCcw } from 'lucide-react';
import {
  CATEGORIES,
  US_AVERAGE_TONNES,
  WORLD_AVERAGE_TONNES,
  convertAmounts,
  estimate,
  formatTonnes,
  type CategoryId,
  type UnitSystem,
} from '@/lib/carbon';

const ICONS: Record<CategoryId, typeof Car> = {
  car: Car,
  electricity: Zap,
  gas: Flame,
  flights: Plane,
  diet: Utensils,
  shopping: ShoppingBag,
};

const BAR_COLOURS: Record<CategoryId, string> = {
  car: 'bg-chart-1',
  electricity: 'bg-chart-4',
  gas: 'bg-chart-5',
  flights: 'bg-chart-3',
  diet: 'bg-chart-2',
  shopping: 'bg-muted-foreground',
};

const UNIT_SYSTEMS: { id: UnitSystem; label: string }[] = [
  { id: 'metric', label: 'Metric' },
  { id: 'us', label: 'US units' },
];

const CarbonCalculator = () => {
  const [system, setSystem] = useState<UnitSystem>('metric');
  const [inputs, setInputs] = useState<Partial<Record<CategoryId, string>>>({});

  const amounts = Object.fromEntries(
    Object.entries(inputs).map(([id, value]) => [id, parseFloat(value ?? '') || 0]),
  ) as Partial<Record<CategoryId, number>>;
  const { parts, totalKg, largest } = estimate(amounts, system);
  const filledParts = parts.filter((part) => part.kg > 0).sort((a, b) => b.kg - a.kg);
  const totalTonnes = totalKg / 1000;
  const comparisonScale = Math.max(totalTonnes, US_AVERAGE_TONNES);
  const comparisons = [
    { label: 'Your six sources', tonnes: totalTonnes, colour: 'bg-primary' },
    { label: 'World average, all sources', tonnes: WORLD_AVERAGE_TONNES, colour: 'bg-foreground/30' },
    { label: 'US average, all sources', tonnes: US_AVERAGE_TONNES, colour: 'bg-foreground/30' },
  ];

  const switchSystem = (next: UnitSystem) => {
    if (next === system) return;
    setInputs((current) => convertAmounts(current, next));
    setSystem(next);
  };

  return (
    <div className="overflow-hidden rounded-sm border bg-card">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <form className="p-6 sm:p-8" onSubmit={(event) => event.preventDefault()} aria-label="Carbon footprint questions">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Answer any of these. Leave the rest blank.</p>
            <div className="inline-flex rounded-sm border p-0.5 text-sm" role="group" aria-label="Units">
              {UNIT_SYSTEMS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchSystem(id)}
                  aria-pressed={system === id}
                  className={`rounded-[0.25rem] px-3 py-1.5 font-medium transition-colors ${
                    system === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            {CATEGORIES.map((category) => {
              const measure = category.measures[system];
              const Icon = ICONS[category.id];
              return (
                <div key={category.id}>
                  <label htmlFor={`carbon-${category.id}`} className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {category.label}
                  </label>
                  <p id={`carbon-${category.id}-hint`} className="mt-1 min-h-[2.5rem] text-xs leading-5 text-muted-foreground">
                    {measure.question}
                  </p>
                  <div className="mt-2 flex rounded-sm border border-input bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-ring">
                    <input
                      id={`carbon-${category.id}`}
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={inputs[category.id] ?? ''}
                      onChange={(event) => setInputs((current) => ({ ...current, [category.id]: event.target.value }))}
                      placeholder="0"
                      aria-describedby={`carbon-${category.id}-hint`}
                      className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base outline-none"
                    />
                    <span className="flex items-center whitespace-nowrap border-l px-3 text-xs text-muted-foreground">
                      {measure.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </form>

        <div className="border-t bg-muted/35 p-6 sm:p-8 lg:border-l lg:border-t-0" aria-live="polite">
          <p className="editorial-kicker">Your estimate</p>
          {largest ? (
            <>
              <p className="mt-4 font-editorial text-6xl font-semibold leading-none">{formatTonnes(totalKg)}</p>
              <p className="mt-2 text-sm text-muted-foreground">tonnes of CO₂ a year</p>

              <ul className="mt-7 space-y-3" aria-label="Where it comes from">
                {filledParts.map(({ category, kg }) => (
                  <li key={category.id}>
                    <div className="flex justify-between gap-4 text-sm">
                      <span>{category.label}</span>
                      <span className="tabular-nums text-muted-foreground">{formatTonnes(kg)} t</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-border/70">
                      <div
                        className={`h-2 rounded-full ${BAR_COLOURS[category.id]}`}
                        style={{ width: `${Math.max(2, (kg / totalKg) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-foreground/15 pt-5">
                <p className="text-sm font-semibold">
                  {largest.category.label} is your largest source, at {Math.round((largest.kg / totalKg) * 100)}%.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{largest.category.tip}</p>
              </div>

              <div className="mt-7 border-t border-foreground/15 pt-5">
                <p className="text-sm font-semibold">For context</p>
                <ul className="mt-3 space-y-2.5">
                  {comparisons.map(({ label, tonnes, colour }) => (
                    <li key={label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{label}</span>
                      <span className="tabular-nums">{tonnes.toFixed(1)} t</span>
                      <div className="col-span-2 h-1.5 rounded-full bg-border/70">
                        <div className={`h-1.5 rounded-full ${colour}`} style={{ width: `${(tonnes / comparisonScale) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  Averages include every source, from industry to public services, so a full footprint is higher than these six answers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInputs({})}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Start again
              </button>
            </>
          ) : (
            <p className="mt-4 max-w-xs leading-7 text-muted-foreground">
              Fill in any question and your estimate appears here, with where it comes from.
            </p>
          )}
        </div>
      </div>

      <details className="border-t px-6 py-4 text-sm sm:px-8">
        <summary className="cursor-pointer font-semibold">How this is calculated</summary>
        <div className="mt-3 space-y-2 leading-6 text-muted-foreground">
          <p>
            This is a broad estimate of carbon dioxide from six everyday sources, using average factors rather than your
            actual car, grid or diet.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Driving: 0.25 kg per km (0.40 kg per mile), the US EPA figure for an average petrol car.</li>
            <li>Electricity: 0.48 kg per kWh, the world average grid in 2023 (Ember). US units use the US average, 0.37 kg per kWh (EPA eGRID). Your local grid may be much cleaner or dirtier.</li>
            <li>Home gas: 3.0 kg per kg of LPG burned, or 5.3 kg per therm of natural gas (EPA).</li>
            <li>Flights: 90 kg per hour in the air, a common rough average per passenger that leaves out the extra warming from contrails.</li>
            <li>Meals with meat: 2.5 kg each, a rough average. Beef is far higher, chicken lower.</li>
            <li>New things: 0.5 kg per US dollar, a rough average across goods.</li>
            <li>Averages per person: world 4.7 t (Global Carbon Project, 2023), United States about 14 t.</li>
          </ul>
        </div>
      </details>
    </div>
  );
};

export default CarbonCalculator;
