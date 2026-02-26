import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface DigitalCourse {
  id: string;
  courseName: string;
  description: string;
  thumbnail?: string;
}

interface EditDigitalCourseProps {
  course: DigitalCourse;
  onSuccess?: () => void;
}

export function EditDigitalCourse({ course, onSuccess }: EditDigitalCourseProps) {
  const [formData, setFormData] = useState({
    courseId: course.id,
    courseName: course.courseName,
    thumbnail: null as File | null,
    description: course.description,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState<string>(course.thumbnail || '');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.courseName) {
      toast.error('Please enter course name');
      return;
    }

    // In production, this would send data to API
    console.log('Updating digital course:', formData);
    toast.success('Digital course updated successfully!');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course ID (Non-editable) */}
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
            id="thumbnail-edit"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          <label
            htmlFor="thumbnail-edit"
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
      >
        Update Digital Course
      </Button>
    </form>
  );
}
