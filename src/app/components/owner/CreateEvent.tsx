import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface EventFormData {
  eventId: string;
  eventName: string;
  location: string;
  date: string;
  price: string;
  distributorPrice: string; // Auto-calculated DP
  pickupCentrePrice: string; // Auto-calculated PCP
  rewardPoints: string; // Auto-calculated RP
}

interface CreateEventProps {
  onSuccess?: () => void;
}

export function CreateEvent({ onSuccess }: CreateEventProps) {
  const [formData, setFormData] = useState<EventFormData>({
    eventId: `EVT-${Date.now()}`,
    eventName: '',
    location: '',
    date: '',
    price: '',
    distributorPrice: '',
    pickupCentrePrice: '',
    rewardPoints: '',
  });

  // Auto-calculate pricing layers when price changes
  const handlePriceChange = (price: string) => {
    const priceNum = parseFloat(price) || 0;
    
    if (priceNum > 0) {
      // PCP = 65% of Price
      const pcp = (priceNum * 0.65).toFixed(2);
      // DP = 73% of Price
      const dp = (priceNum * 0.73).toFixed(2);
      // RP = 41% of Price
      const rp = (priceNum * 0.41).toFixed(2);
      
      setFormData({
        ...formData,
        price,
        pickupCentrePrice: pcp,
        distributorPrice: dp,
        rewardPoints: rp,
      });
    } else {
      setFormData({
        ...formData,
        price,
        pickupCentrePrice: '',
        distributorPrice: '',
        rewardPoints: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.eventName || !formData.location || !formData.date || !formData.price) {
      toast.error('Please fill in all fields');
      return;
    }

    // In production, this would send data to API
    console.log('Creating event:', formData);
    toast.success('Event created successfully!');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event ID (Auto-generated, non-editable) */}
      <div className="space-y-2">
        <Label>Event ID</Label>
        <Input value={formData.eventId} disabled className="bg-muted" />
      </div>

      {/* Event Name */}
      <div className="space-y-2">
        <Label htmlFor="eventName">Event Name *</Label>
        <Input
          id="eventName"
          value={formData.eventName}
          onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
          placeholder="Enter event name"
          required
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Enter event location"
          required
        />
      </div>

      {/* Event Date */}
      <div className="space-y-2">
        <Label htmlFor="date">Event Date *</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handlePriceChange(e.target.value)}
          placeholder="Enter event price"
          required
        />
      </div>

      {/* Distributor Price (Auto-calculated) */}
      <div className="space-y-2">
        <Label>Distributor Price</Label>
        <Input
          value={formData.distributorPrice}
          disabled
          className="bg-muted"
        />
      </div>

      {/* Pickup Centre Price (Auto-calculated) */}
      <div className="space-y-2">
        <Label>Pickup Centre Price</Label>
        <Input
          value={formData.pickupCentrePrice}
          disabled
          className="bg-muted"
        />
      </div>

      {/* Reward Points (Auto-calculated) */}
      <div className="space-y-2">
        <Label>Reward Points</Label>
        <Input
          value={formData.rewardPoints}
          disabled
          className="bg-muted"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
      >
        Create Event
      </Button>
    </form>
  );
}