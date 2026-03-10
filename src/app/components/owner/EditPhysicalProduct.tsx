import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface PhysicalProduct {
  id: string;
  code: string;
  name: string;
  type: 'Product' | 'Service' | 'Program';
  category: string;
  subCategory: string;
  brandName: string;
  productUnit?: string;
  manufacturerName?: string;
  manufacturerLicense?: string;
  status: 'Active' | 'Inactive';
  launchDate: string;
  stockQuantity?: number;
  lowStockAlert?: number;
  ingredientsCount?: number;
  ingredientsList?: string;
  fdaLicense?: string;
  fssaiNumber?: string;
  ayushLicense?: string;
  shelfLife?: number;
  minOrderQuantity?: number;
  height?: number;
  depth?: number;
  width?: number;
  weight?: number;
  totalCost?: number;
  mrp: number;
  pc?: number;
  dp?: number;
  rp?: number;
  taxPercent?: number;
  stock: number;
}

interface EditPhysicalProductProps {
  product: PhysicalProduct;
  onSuccess?: () => void;
}

export function EditPhysicalProduct({ product, onSuccess }: EditPhysicalProductProps) {
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    photos: [] as File[],
    productCode: product.code,
    productUnit: product.productUnit || '',
    category: product.category,
    subCategory: product.subCategory,
    brandName: product.brandName,
    manufacturerName: product.manufacturerName || '',
    manufacturerLicense: product.manufacturerLicense || '',
    status: product.status,
    launchDate: product.launchDate || '',
    stockQuantity: String(product.stock || 0),
    lowStockAlert: String(product.lowStockAlert || 10),
    ingredientsCount: String(product.ingredientsCount || ''),
    ingredientsList: product.ingredientsList || '',
    fdaLicense: product.fdaLicense || '',
    fssaiNumber: product.fssaiNumber || '',
    ayushLicense: product.ayushLicense || '',
    shelfLife: String(product.shelfLife || ''),
    minOrderQuantity: String(product.minOrderQuantity || 1),
    height: String(product.height || ''),
    depth: String(product.depth || ''),
    width: String(product.width || ''),
    weight: String(product.weight || ''),
    totalCost: String(product.totalCost || ''),
    mrp: String(product.mrp),
    pickupCentrePrice: String(product.pc || ''),
    distributorPrice: String(product.dp || ''),
    rp: String(product.rp || ''),
    taxPercent: String(product.taxPercent || ''),
    taxAmount: '',
  });

  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Auto-calculate pricing based on MRP and cost
  const calculatePricing = (mrp: string, cost: string) => {
    const mrpNum = parseFloat(mrp) || 0;
    
    if (mrpNum > 0) {
      const pp = (mrpNum * 0.65).toFixed(2);
      const dp = (mrpNum * 0.73).toFixed(2);
      const rp = (mrpNum * 0.41).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        pickupCentrePrice: pp,
        distributorPrice: dp,
        rp: rp,
      }));
    }
  };

  // Auto-calculate tax amount
  const calculateTax = (mrp: string, taxPercent: string) => {
    const mrpNum = parseFloat(mrp) || 0;
    const taxPercentNum = parseFloat(taxPercent) || 0;
    
    if (mrpNum > 0 && taxPercentNum > 0) {
      const taxAmount = (mrpNum * (taxPercentNum / 100)).toFixed(2);
      setFormData(prev => ({ ...prev, taxAmount }));
    }
  };

  // Initialize tax calculation on mount
  useEffect(() => {
    if (formData.mrp && formData.taxPercent) {
      calculateTax(formData.mrp, formData.taxPercent);
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.photos.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.productCode || !formData.category || !formData.launchDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In production, this would send data to API
    console.log('Updating physical product:', formData);
    toast.success('Physical product updated successfully!');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-2">
      {/* Product ID (Non-editable) */}
      <div className="space-y-2">
        <Label>Product ID</Label>
        <Input value={formData.id} disabled className="bg-muted" />
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Photos Catalog */}
      <div className="space-y-2">
        <Label>Photos Catalog (4-5 images)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
          <input
            type="file"
            id="photos-edit"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <label
            htmlFor="photos-edit"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload product photos (max 5)
            </p>
          </label>
        </div>
        
        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-2">
            {photoPreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Product ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Code and Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productCode">Product Code / SKU *</Label>
          <Input
            id="productCode"
            value={formData.productCode}
            onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
            placeholder="e.g., WL-100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productUnit">Product Unit</Label>
          <Input
            id="productUnit"
            value={formData.productUnit}
            onChange={(e) => setFormData({ ...formData, productUnit: e.target.value })}
            placeholder="e.g., ml, g, kg"
          />
        </div>
      </div>

      {/* Category and Sub-category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Wellness">Wellness</SelectItem>
              <SelectItem value="Personal Care">Personal Care</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subCategory">Sub-category *</Label>
          <Select value={formData.subCategory} onValueChange={(value) => setFormData({ ...formData, subCategory: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weight Loss">Weight Loss</SelectItem>
              <SelectItem value="Diabetes">Diabetes</SelectItem>
              <SelectItem value="Heart Disease">Heart Disease</SelectItem>
              <SelectItem value="Thyroid">Thyroid</SelectItem>
              <SelectItem value="PCOD">PCOD</SelectItem>
              <SelectItem value="Skin Care">Skin Care</SelectItem>
              <SelectItem value="Hair Care">Hair Care</SelectItem>
              <SelectItem value="Sexual Care">Sexual Care</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Brand and Manufacturer */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={formData.brandName}
            onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
            placeholder="Meera Ayurveda"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturerName">Manufacturer Name</Label>
          <Input
            id="manufacturerName"
            value={formData.manufacturerName}
            onChange={(e) => setFormData({ ...formData, manufacturerName: e.target.value })}
            placeholder="Enter manufacturer name"
          />
        </div>
      </div>

      {/* Manufacturer License */}
      <div className="space-y-2">
        <Label htmlFor="manufacturerLicense">Manufacturer License Reference</Label>
        <Input
          id="manufacturerLicense"
          value={formData.manufacturerLicense}
          onChange={(e) => setFormData({ ...formData, manufacturerLicense: e.target.value })}
          placeholder="Enter license reference number"
        />
      </div>

      {/* Status and Launch Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Product Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="launchDate">Launch Date *</Label>
          <Input
            id="launchDate"
            type="date"
            value={formData.launchDate}
            onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Stock and Alert Level */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock In Quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lowStockAlert">Low Stock Alert Level</Label>
          <Input
            id="lowStockAlert"
            type="number"
            value={formData.lowStockAlert}
            onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
            placeholder="10"
          />
        </div>
      </div>

      {/* Separator */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">Product Details</h3>
      </div>

      {/* Ingredients Count and List */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ingredientsCount">Total Ingredients Count</Label>
          <Input
            id="ingredientsCount"
            type="number"
            value={formData.ingredientsCount}
            onChange={(e) => setFormData({ ...formData, ingredientsCount: e.target.value })}
            placeholder="e.g., 83"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
          <Input
            id="minOrderQuantity"
            type="number"
            value={formData.minOrderQuantity}
            onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
            placeholder="1"
          />
        </div>
      </div>

      {/* Internal Ingredient List */}
      <div className="space-y-2">
        <Label htmlFor="ingredientsList">Internal Full Ingredient List</Label>
        <Textarea
          id="ingredientsList"
          value={formData.ingredientsList}
          onChange={(e) => setFormData({ ...formData, ingredientsList: e.target.value })}
          placeholder="Enter full ingredient list..."
          rows={3}
        />
      </div>

      {/* Licenses */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fdaLicense">FDA License Reference</Label>
          <Input
            id="fdaLicense"
            value={formData.fdaLicense}
            onChange={(e) => setFormData({ ...formData, fdaLicense: e.target.value })}
            placeholder="FDA-XXXX"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fssaiNumber">FSSAI Number</Label>
          <Input
            id="fssaiNumber"
            value={formData.fssaiNumber}
            onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
            placeholder="FSSAI-XXXX"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ayushLicense">AYUSH License Number</Label>
          <Input
            id="ayushLicense"
            value={formData.ayushLicense}
            onChange={(e) => setFormData({ ...formData, ayushLicense: e.target.value })}
            placeholder="AYUSH-XXXX"
          />
        </div>
      </div>

      {/* Shelf Life */}
      <div className="space-y-2">
        <Label htmlFor="shelfLife">Shelf Life (Months)</Label>
        <Input
          id="shelfLife"
          type="number"
          value={formData.shelfLife}
          onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
          placeholder="24"
        />
      </div>

      {/* Separator */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">Dimensions & Weight</h3>
      </div>

      {/* Dimensions and Weight */}
      <div className="grid grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            placeholder="e.g., 10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="depth">Depth (cm)</Label>
          <Input
            id="depth"
            type="number"
            value={formData.depth}
            onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
            placeholder="e.g., 5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="width">Width (cm)</Label>
          <Input
            id="width"
            type="number"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
            placeholder="e.g., 10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="e.g., 0.5"
          />
        </div>
      </div>

      {/* Separator */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">Pricing Layers</h3>
      </div>

      {/* Total Cost and MRP */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalCost">Total Product Cost</Label>
          <Input
            id="totalCost"
            type="number"
            value={formData.totalCost}
            onChange={(e) => {
              setFormData({ ...formData, totalCost: e.target.value });
              calculatePricing(formData.mrp, e.target.value);
            }}
            placeholder="1500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mrp">MRP (Maximum Retail Price)</Label>
          <Input
            id="mrp"
            type="number"
            value={formData.mrp}
            onChange={(e) => {
              setFormData({ ...formData, mrp: e.target.value });
              calculatePricing(e.target.value, formData.totalCost);
              calculateTax(e.target.value, formData.taxPercent);
            }}
            placeholder="5000"
            className="font-semibold"
          />
        </div>
      </div>

      {/* Auto-calculated pricing layers */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pickupCentrePrice">Pickup Centre Price (PP)</Label>
          <Input
            id="pickupCentrePrice"
            type="number"
            value={formData.pickupCentrePrice}
            onChange={(e) => setFormData({ ...formData, pickupCentrePrice: e.target.value })}
            placeholder="Auto-calculated"
            className="bg-emerald-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="distributorPrice">Distributor Purchase Price (DP)</Label>
          <Input
            id="distributorPrice"
            type="number"
            value={formData.distributorPrice}
            onChange={(e) => setFormData({ ...formData, distributorPrice: e.target.value })}
            placeholder="Auto-calculated"
            className="bg-emerald-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rp">RP (Reward Points)</Label>
          <Input
            id="rp"
            type="number"
            value={formData.rp}
            onChange={(e) => setFormData({ ...formData, rp: e.target.value })}
            placeholder="Auto-calculated"
            className="bg-emerald-50 font-semibold"
          />
        </div>
      </div>

      {/* Tax */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxPercent">Tax % (GST)</Label>
          <Input
            id="taxPercent"
            type="number"
            value={formData.taxPercent}
            onChange={(e) => {
              setFormData({ ...formData, taxPercent: e.target.value });
              calculateTax(formData.mrp, e.target.value);
            }}
            placeholder="18"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxAmount">Tax Amount (Auto)</Label>
          <Input
            id="taxAmount"
            type="number"
            value={formData.taxAmount}
            disabled
            className="bg-muted"
            placeholder="Auto-calculated"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
      >
        Update Physical Product
      </Button>
    </form>
  );
}