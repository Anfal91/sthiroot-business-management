import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import type { OfferFor, OfferOn, RewardType } from '../../../data/mockOfferData';

interface CreateOfferProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isStoreOwner?: boolean;
}

export function CreateOffer({ isOpen, onClose, onSuccess, isStoreOwner = false }: CreateOfferProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    offerFor: (isStoreOwner ? 'employee' : 'partner') as OfferFor,
    offerOn: 'total_orders' as OfferOn,
    targetValue: '',
    rewardType: 'cash' as RewardType,
    rewardValue: '',
    rewardDescription: '',
    startDate: '',
    endDate: '',
    initialCount: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.targetValue || parseFloat(formData.targetValue) <= 0) {
      toast.error('Please enter a valid target value');
      return;
    }

    if (!formData.rewardValue || parseFloat(formData.rewardValue) <= 0) {
      toast.error('Please enter a valid reward value');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select validity dates');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    // In production, this would make an API call
    console.log('Creating offer:', formData);
    
    toast.success('Offer created successfully!');
    onSuccess();
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      offerFor: 'partner',
      offerOn: 'total_orders',
      targetValue: '',
      rewardType: 'cash',
      rewardValue: '',
      rewardDescription: '',
      startDate: '',
      endDate: '',
      initialCount: false,
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-generate reward description
  const getRewardDescription = () => {
    if (!formData.rewardValue) return '';
    
    switch (formData.rewardType) {
      case 'cash':
        return `₹${formData.rewardValue} cash bonus`;
      case 'points':
        return `${formData.rewardValue} bonus RP`;
      case 'discount':
        return `${formData.rewardValue}% discount on next purchase`;
      case 'travel':
        return `Travel/Tour Package worth ₹${formData.rewardValue}`;
      default:
        return '';
    }
  };

  // Show/hide initial count checkbox based on offerOn
  const showInitialCount = formData.offerOn === 'matching_rp' || formData.offerOn === 'total_orders';

  if (!isOpen) return null;

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Create New Offer
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Platinum Partner Milestone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe the offer and what participants need to achieve"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Offer Configuration */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Offer Configuration</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer For *
                      </label>
                      {isStoreOwner ? (
                        <input
                          type="text"
                          value="Employee"
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                      ) : (
                        <select
                          value={formData.offerFor}
                          onChange={(e) => handleChange('offerFor', e.target.value as OfferFor)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="partner">Partner</option>
                          <option value="employee">Employee</option>
                          <option value="store">Store</option>
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer On *
                      </label>
                      <select
                        value={formData.offerOn}
                        onChange={(e) => handleChange('offerOn', e.target.value as OfferOn)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="total_orders">Total Orders</option>
                        <option value="matching_rp">Matching RP</option>
                        <option value="level">Level</option>
                        <option value="days_since_joining">Days Since Joining</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Value *
                    </label>
                    <input
                      type="number"
                      value={formData.targetValue}
                      onChange={(e) => handleChange('targetValue', e.target.value)}
                      placeholder={
                        formData.offerOn === 'total_orders' ? 'e.g., 100 orders' :
                        formData.offerOn === 'matching_rp' ? 'e.g., 10000 RP' :
                        formData.offerOn === 'level' ? 'e.g., 5' :
                        'e.g., 90 days'
                      }
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  {showInitialCount && (
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="initialCount"
                        checked={formData.initialCount}
                        onChange={(e) => handleChange('initialCount', e.target.checked)}
                        className="mt-1 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      />
                      <div>
                        <label htmlFor="initialCount" className="text-sm font-medium text-gray-900 cursor-pointer">
                          Initial Count (Start Fresh)
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          When enabled, past {formData.offerOn === 'matching_rp' ? 'matching RP' : 'orders'} will not be counted. 
                          Only new {formData.offerOn === 'matching_rp' ? 'RP' : 'orders'} from the start date will count towards this offer.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reward Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Reward Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reward Type *
                      </label>
                      <select
                        value={formData.rewardType}
                        onChange={(e) => handleChange('rewardType', e.target.value as RewardType)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="cash">Cash Bonus</option>
                        <option value="points">Reward Points</option>
                        <option value="discount">Discount %</option>
                        <option value="travel">Travel/Tour Package</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reward Value *
                      </label>
                      <input
                        type="number"
                        value={formData.rewardValue}
                        onChange={(e) => handleChange('rewardValue', e.target.value)}
                        placeholder={
                          formData.rewardType === 'cash' ? 'Amount in ₹' :
                          formData.rewardType === 'points' ? 'Points' :
                          'Discount %'
                        }
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward Description
                    </label>
                    <textarea
                      value={formData.rewardDescription || getRewardDescription()}
                      onChange={(e) => handleChange('rewardDescription', e.target.value)}
                      placeholder="Auto-generated based on reward type and value"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Validity Period */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Validity Period</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Offer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}