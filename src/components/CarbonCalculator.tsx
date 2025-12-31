import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Zap, Plane, ShoppingBag, Home, Utensils, TrendingDown, TrendingUp, Leaf } from 'lucide-react';

interface CarbonCategory {
  id: string;
  label: string;
  icon: JSX.Element;
  unit: string;
  question: string;
  factor: number; // kg CO2 per unit
}

const CarbonCalculator = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const categories: CarbonCategory[] = [
    {
      id: 'car',
      label: 'Driving',
      icon: <Car className="w-5 h-5" />,
      unit: 'miles/week',
      question: 'How many miles do you drive per week?',
      factor: 0.411 // kg CO2 per mile (average car)
    },
    {
      id: 'electricity',
      label: 'Electricity',
      icon: <Zap className="w-5 h-5" />,
      unit: 'kWh/month',
      question: 'Your monthly electricity usage (kWh)?',
      factor: 0.92 // kg CO2 per kWh (US average)
    },
    {
      id: 'flights',
      label: 'Flights',
      icon: <Plane className="w-5 h-5" />,
      unit: 'hours/year',
      question: 'Hours spent flying per year?',
      factor: 90 // kg CO2 per hour of flight
    },
    {
      id: 'diet',
      label: 'Diet',
      icon: <Utensils className="w-5 h-5" />,
      unit: 'meals/week',
      question: 'Meat-based meals per week?',
      factor: 2.5 // kg CO2 per meat meal
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: <ShoppingBag className="w-5 h-5" />,
      unit: '$/month',
      question: 'Monthly spending on new items ($)?',
      factor: 0.5 // kg CO2 per dollar (rough estimate)
    },
    {
      id: 'heating',
      label: 'Heating/Cooling',
      icon: <Home className="w-5 h-5" />,
      unit: 'therms/month',
      question: 'Monthly natural gas usage (therms)?',
      factor: 5.3 // kg CO2 per therm
    }
  ];

  const handleInputChange = (categoryId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [categoryId]: numValue }));
  };

  const calculateTotal = () => {
    let yearlyTotal = 0;

    categories.forEach(category => {
      const input = inputs[category.id] || 0;
      let yearlyAmount = 0;

      // Convert to yearly kg CO2
      if (category.unit.includes('week')) {
        yearlyAmount = input * 52 * category.factor;
      } else if (category.unit.includes('month')) {
        yearlyAmount = input * 12 * category.factor;
      } else if (category.unit.includes('year')) {
        yearlyAmount = input * category.factor;
      }

      yearlyTotal += yearlyAmount;
    });

    return yearlyTotal;
  };

  const totalCO2 = calculateTotal();
  const usAverage = 16000; // kg CO2 per year (US average)
  const globalAverage = 4000; // kg CO2 per year (global average)
  const comparisonToUS = ((totalCO2 / usAverage) * 100).toFixed(0);
  const comparisonToGlobal = ((totalCO2 / globalAverage) * 100).toFixed(0);

  const getImpactLevel = (total: number) => {
    if (total < 3000) return { label: 'Excellent', color: 'text-green-600', icon: <TrendingDown className="w-5 h-5" /> };
    if (total < 8000) return { label: 'Good', color: 'text-blue-600', icon: <Leaf className="w-5 h-5" /> };
    if (total < 15000) return { label: 'Average', color: 'text-yellow-600', icon: <TrendingUp className="w-5 h-5" /> };
    return { label: 'High', color: 'text-red-600', icon: <TrendingUp className="w-5 h-5" /> };
  };

  const impact = getImpactLevel(totalCO2);

  return (
    <Card className="w-full border-2 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 text-white rounded-lg">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl">Carbon Footprint Calculator</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Calculate your annual CO₂ emissions and discover ways to reduce your impact
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {!showResults ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={activeCategory === category.id ? 'default' : 'outline'}
                    className={`w-full h-auto flex flex-col gap-2 p-4 ${
                      activeCategory === category.id
                        ? 'bg-green-600 hover:bg-green-700'
                        : ''
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.icon}
                    <span className="text-xs">{category.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeCategory && (
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 p-6 bg-muted/50 rounded-xl"
                >
                  {categories
                    .filter(c => c.id === activeCategory)
                    .map(category => (
                      <div key={category.id} className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                          {category.icon}
                          {category.question}
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={inputs[category.id] || ''}
                            onChange={(e) => handleInputChange(category.id, e.target.value)}
                            placeholder="0"
                            className="flex-1 px-4 py-3 text-lg border border-border rounded-lg bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                          />
                          <Badge variant="secondary" className="px-4 flex items-center">
                            {category.unit}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(inputs).length === 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                size="lg"
              >
                Calculate My Footprint
              </Button>
              {Object.keys(inputs).length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setInputs({});
                    setActiveCategory('');
                  }}
                  size="lg"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Results Summary */}
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-xl">
              <div className={`text-6xl font-bold ${impact.color} mb-2`}>
                {totalCO2.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                kg CO₂ per year
              </div>
              <div className={`flex items-center justify-center gap-2 ${impact.color}`}>
                {impact.icon}
                <span className="text-lg font-semibold">{impact.label} Impact</span>
              </div>
            </div>

            {/* Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">vs. US Average</div>
                <div className="text-2xl font-bold">{comparisonToUS}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  US avg: {usAverage.toLocaleString()} kg/year
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">vs. Global Average</div>
                <div className="text-2xl font-bold">{comparisonToGlobal}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Global avg: {globalAverage.toLocaleString()} kg/year
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                Tips to Reduce Your Footprint
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Switch to renewable energy sources</li>
                <li>• Use public transport or carpool when possible</li>
                <li>• Reduce meat consumption (try Meatless Mondays)</li>
                <li>• Buy local and seasonal produce</li>
                <li>• Reduce, reuse, recycle whenever possible</li>
              </ul>
            </div>

            <Button
              onClick={() => setShowResults(false)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Recalculate
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CarbonCalculator;
