import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Package, BookOpen, Calendar, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for products - in production, this would come from API
const mockPhysicalProducts = [
  { id: 'PRD-001', name: 'Weight Loss Premium Pack', code: 'WL-100', price: 5000 },
  { id: 'PRD-002', name: 'Skin Care Essentials', code: 'SC-200', price: 3500 },
  { id: 'PRD-003', name: 'Sexual Care Complete', code: 'SXC-300', price: 4200 },
  { id: 'PRD-004', name: 'Diabetes Care Kit', code: 'DC-400', price: 6500 },
  { id: 'PRD-005', name: 'Immunity Booster Pack', code: 'IB-500', price: 2800 },
];

const mockDigitalCourses = [
  { id: 'CRS-001', name: 'Healthy Living Masterclass', price: 1999 },
  { id: 'CRS-002', name: 'Weight Management Course', price: 2499 },
  { id: 'CRS-003', name: 'Stress Management Workshop', price: 1499 },
  { id: 'CRS-004', name: 'Nutrition Fundamentals', price: 1799 },
];

const mockEvents = [
  { id: 'EVT-001', name: 'Health & Wellness Summit 2026', location: 'Mumbai', date: '2026-05-15' },
  { id: 'EVT-002', name: 'Ayurveda Workshop', location: 'Delhi', date: '2026-06-20' },
  { id: 'EVT-003', name: 'Fitness Bootcamp', location: 'Bangalore', date: '2026-07-10' },
];

interface ProgramFormData {
  programId: string;
  programName: string;
  description: string;
  selectedProducts: string[];
  selectedCourses: string[];
  selectedEvents: string[];
  totalValue: number;
  distributorPrice: string; // Auto-calculated DP based on combined value
  pickupCentrePrice: string; // Auto-calculated PCP based on combined value
  rewardPoints: string; // Auto-calculated RP based on combined value
}

interface CreateProgramProps {
  onSuccess?: () => void;
}

export function CreateProgram({ onSuccess }: CreateProgramProps) {
  const [formData, setFormData] = useState<ProgramFormData>({
    programId: `PGM-${Date.now()}`,
    programName: '',
    description: '',
    selectedProducts: [],
    selectedCourses: [],
    selectedEvents: [],
    totalValue: 0,
    distributorPrice: '',
    pickupCentrePrice: '',
    rewardPoints: '',
  });

  const calculateTotalValue = (products: string[], courses: string[], events: string[]) => {
    let total = 0;
    
    products.forEach(id => {
      const product = mockPhysicalProducts.find(p => p.id === id);
      if (product) total += product.price;
    });
    
    courses.forEach(id => {
      const course = mockDigitalCourses.find(c => c.id === id);
      if (course) total += course.price;
    });
    
    // Events don't have a price in the basic model, but could be added
    
    return total;
  };

  // Auto-calculate pricing layers when total value changes
  const handleTotalValueChange = (totalValue: number) => {
    if (totalValue > 0) {
      // PCP = 65% of Total Value
      const pcp = (totalValue * 0.65).toFixed(2);
      // DP = 73% of Total Value
      const dp = (totalValue * 0.73).toFixed(2);
      // RP = 41% of Total Value
      const rp = (totalValue * 0.41).toFixed(2);
      
      return {
        totalValue,
        pickupCentrePrice: pcp,
        distributorPrice: dp,
        rewardPoints: rp,
      };
    } else {
      return {
        totalValue,
        pickupCentrePrice: '',
        distributorPrice: '',
        rewardPoints: '',
      };
    }
  };

  const handleProductToggle = (productId: string) => {
    const newProducts = formData.selectedProducts.includes(productId)
      ? formData.selectedProducts.filter(id => id !== productId)
      : [...formData.selectedProducts, productId];
    
    const totalValue = calculateTotalValue(newProducts, formData.selectedCourses, formData.selectedEvents);
    const pricingData = handleTotalValueChange(totalValue);
    
    setFormData({
      ...formData,
      selectedProducts: newProducts,
      ...pricingData,
    });
  };

  const handleCourseToggle = (courseId: string) => {
    const newCourses = formData.selectedCourses.includes(courseId)
      ? formData.selectedCourses.filter(id => id !== courseId)
      : [...formData.selectedCourses, courseId];
    
    const totalValue = calculateTotalValue(formData.selectedProducts, newCourses, formData.selectedEvents);
    const pricingData = handleTotalValueChange(totalValue);
    
    setFormData({
      ...formData,
      selectedCourses: newCourses,
      ...pricingData,
    });
  };

  const handleEventToggle = (eventId: string) => {
    const newEvents = formData.selectedEvents.includes(eventId)
      ? formData.selectedEvents.filter(id => id !== eventId)
      : [...formData.selectedEvents, eventId];
    
    const totalValue = calculateTotalValue(formData.selectedProducts, formData.selectedCourses, newEvents);
    const pricingData = handleTotalValueChange(totalValue);
    
    setFormData({
      ...formData,
      selectedEvents: newEvents,
      ...pricingData,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.programName) {
      toast.error('Please enter program name');
      return;
    }

    const totalItems = formData.selectedProducts.length + formData.selectedCourses.length + formData.selectedEvents.length;
    if (totalItems === 0) {
      toast.error('Please select at least one product, course, or event');
      return;
    }

    // In production, this would send data to API
    console.log('Creating program:', formData);
    toast.success('Program created successfully!');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const totalItemsCount = formData.selectedProducts.length + formData.selectedCourses.length + formData.selectedEvents.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-2">
      {/* Program ID (Auto-generated, non-editable) */}
      <div className="space-y-2">
        <Label>Program ID</Label>
        <Input value={formData.programId} disabled className="bg-muted" />
      </div>

      {/* Program Name */}
      <div className="space-y-2">
        <Label htmlFor="programName">Program Name *</Label>
        <Input
          id="programName"
          value={formData.programName}
          onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
          placeholder="e.g., Complete Wellness Package"
          required
        />
      </div>

      {/* Program Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Program Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what's included in this program..."
          rows={3}
        />
      </div>

      {/* Summary Card */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Items Selected</p>
              <p className="text-2xl font-bold text-emerald-700">{totalItemsCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Combined Value</p>
              <p className="text-2xl font-bold text-emerald-700">₹{formData.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Products Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5 text-emerald-600" />
            Physical Products ({formData.selectedProducts.length})
          </CardTitle>
          <CardDescription>Select physical products to include in the program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockPhysicalProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={product.id}
                  checked={formData.selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleProductToggle(product.id)}
                />
                <label
                  htmlFor={product.id}
                  className="cursor-pointer flex-1"
                >
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.code}</p>
                </label>
              </div>
              <span className="font-semibold text-emerald-700">₹{product.price.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Digital Courses Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            Digital Courses ({formData.selectedCourses.length})
          </CardTitle>
          <CardDescription>Select digital courses to include in the program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockDigitalCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={course.id}
                  checked={formData.selectedCourses.includes(course.id)}
                  onCheckedChange={() => handleCourseToggle(course.id)}
                />
                <label
                  htmlFor={course.id}
                  className="cursor-pointer flex-1"
                >
                  <p className="font-medium">{course.name}</p>
                </label>
              </div>
              <span className="font-semibold text-emerald-700">₹{course.price.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Events Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Events ({formData.selectedEvents.length})
          </CardTitle>
          <CardDescription>Select events to include in the program</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={event.id}
                  checked={formData.selectedEvents.includes(event.id)}
                  onCheckedChange={() => handleEventToggle(event.id)}
                />
                <label
                  htmlFor={event.id}
                  className="cursor-pointer flex-1"
                >
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location} • {new Date(event.date).toLocaleDateString()}
                  </p>
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Auto-calculated pricing layers */}
      {formData.totalValue > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="text-base">Auto-Calculated Pricing Layers</CardTitle>
            <CardDescription>Based on combined value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupCentrePrice">Pickup Centre Price (PCP)</Label>
                <Input
                  id="pickupCentrePrice"
                  type="number"
                  value={formData.pickupCentrePrice}
                  disabled
                  className="bg-white"
                />
                <p className="text-xs text-muted-foreground">65% of combined value</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributorPrice">Distributor Price (DP)</Label>
                <Input
                  id="distributorPrice"
                  type="number"
                  value={formData.distributorPrice}
                  disabled
                  className="bg-white"
                />
                <p className="text-xs text-muted-foreground">73% of combined value</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rewardPoints">Reward Points (RP)</Label>
                <Input
                  id="rewardPoints"
                  type="number"
                  value={formData.rewardPoints}
                  disabled
                  className="bg-white font-semibold"
                />
                <p className="text-xs text-muted-foreground">41% of combined value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Program
      </Button>
    </form>
  );
}