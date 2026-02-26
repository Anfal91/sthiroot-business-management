import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface DigitalCourseFormData {
  courseId: string;
  courseName: string;
  thumbnail: File | null;
  description: string;
  price: string;
  distributorPrice: string; // Auto-calculated DP
  pickupCentrePrice: string; // Auto-calculated PCP
  rewardPoints: string; // Auto-calculated RP
}

interface CreateDigitalCourseProps {
  onSuccess?: () => void;
}

export function CreateDigitalCourse({ onSuccess }: CreateDigitalCourseProps) {
  const [formData, setFormData] = useState<DigitalCourseFormData>({
    courseId: `CRS-${Date.now()}`,
    courseName: '',
    thumbnail: null,
    description: '',
    price: '',
    distributorPrice: '',
    pickupCentrePrice: '',
    rewardPoints: '',
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image dimensions (ideally should be 1280x720)
      const img = new Image();
      img.onload = () => {
        if (img.width !== 1280 || img.height !== 720) {
          toast.warning(`Recommended thumbnail size is 1280x720. Current: ${img.width}x${img.height}`);
        }
      };
      img.src = URL.createObjectURL(file);

      setThumbnailPreview(URL.createObjectURL(file));
      setFormData({ ...formData, thumbnail: file });
    }
  };

  const removeThumbnail = () => {
    setThumbnailPreview('');
    setFormData({ ...formData, thumbnail: null });
  };

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
    if (!formData.courseName) {
      toast.error('Please enter course name');
      return;
    }

    // In production, this would send data to API
    console.log('Creating digital course:', formData);
    toast.success('Digital course created successfully!');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course ID (Auto-generated, non-editable) */}
      <div className="space-y-2">
        <Label>Course ID</Label>
        <Input value={formData.courseId} disabled className="bg-muted" />
      </div>

      {/* Course Name */}
      <div className="space-y-2">
        <Label htmlFor="courseName">Course Name *</Label>
        <Input
          id="courseName"
          value={formData.courseName}
          onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          placeholder="Enter course name"
          required
        />
      </div>

      {/* Course Thumbnail */}
      <div className="space-y-2">
        <Label>Course Thumbnail (1280 x 720)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          <label
            htmlFor="thumbnail"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Click to upload course thumbnail
              <br />
              <span className="text-xs">(Recommended: 1280 x 720 pixels)</span>
            </p>
          </label>
        </div>
        
        {thumbnailPreview && (
          <div className="relative mt-2">
            <img
              src={thumbnailPreview}
              alt="Course thumbnail preview"
              className="w-full max-w-md rounded-lg border mx-auto"
              style={{ aspectRatio: '16/9' }}
            />
            <button
              type="button"
              onClick={removeThumbnail}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Course Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Course Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter a detailed description of the course..."
          rows={6}
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          value={formData.price}
          onChange={(e) => handlePriceChange(e.target.value)}
          placeholder="Enter price"
          type="number"
          step="0.01"
        />
      </div>

      {/* Distributor Price */}
      <div className="space-y-2">
        <Label>Distributor Price (Auto-calculated)</Label>
        <Input
          value={formData.distributorPrice}
          disabled
          className="bg-muted"
        />
      </div>

      {/* Pickup Centre Price */}
      <div className="space-y-2">
        <Label>Pickup Centre Price (Auto-calculated)</Label>
        <Input
          value={formData.pickupCentrePrice}
          disabled
          className="bg-muted"
        />
      </div>

      {/* Reward Points */}
      <div className="space-y-2">
        <Label>Reward Points (Auto-calculated)</Label>
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
        Create Digital Course
      </Button>
    </form>
  );
}