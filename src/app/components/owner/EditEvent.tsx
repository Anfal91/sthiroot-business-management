import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface Event {
  id: string;
  eventName: string;
  location: string;
  date: string;
}

interface EditEventProps {
  event: Event;
  onSuccess?: () => void;
}

export function EditEvent({ event, onSuccess }: EditEventProps) {
  const [formData, setFormData] = useState({
    eventId: event.id,
    eventName: event.eventName,
    location: event.location,
    date: event.date,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.eventName || !formData.location || !formData.date) {
      toast.error('Please fill in all fields');
      return;
    }

    // In production, this would send data to API
    console.log('Updating event:', formData);
    toast.success('Event updated successfully!');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event ID (Non-editable) */}
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
      >
        Update Event
      </Button>
    </form>
  );
}
