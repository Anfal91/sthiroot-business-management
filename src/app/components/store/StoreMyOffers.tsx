import { useState } from 'react';
import { Tag, TrendingUp, CheckCircle, Clock, Calendar, Gift, Info, Store as StoreIcon } from 'lucide-react';
import { getActiveOffers, getExpiredOffers, getUserOfferProgress, getOfferById, type OfferProgress } from '../../../data/mockOfferData';

interface StoreMyOffersProps {
  storeId: string;
}

export function StoreMyOffers({ storeId }: StoreMyOffersProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  
  const userProgress = getUserOfferProgress(storeId);
  const activeOffers = getActiveOffers('store');
  const pastOffers = getExpiredOffers('store');

  const getOfferOnLabel = (offerOn: string) => {
    switch (offerOn) {
      case 'matching_rp': return 'Matching RP';
      case 'total_orders': return 'Orders';
      case 'level': return 'Level';
      case 'days_since_joining': return 'Days';
      default: return offerOn;
    }
  };

  const getProgressForOffer = (offerId: string): OfferProgress | undefined => {
    return userProgress.find(p => p.offerId === offerId);
  };

  const renderOfferCard = (offerId: string, isPast: boolean = false) => {
    const offer = getOfferById(offerId);
    if (!offer) return null;

    const progress = getProgressForOffer(offerId);
    const hasProgress = !!progress;
    const isCompleted = progress?.status === 'completed';
    const isExpired = progress?.status === 'expired';
    
    const progressPercentage = progress?.progress || 0;
    const currentValue = progress?.currentValue || 0;
    const targetValue = offer.targetValue;

    return (
      <div
        key={offerId}
        className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
          isCompleted
            ? 'border-green-500 bg-green-50/30'
            : isExpired
            ? 'border-red-300 bg-red-50/30'
            : 'border-orange-500 hover:shadow-md'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Gift className={`h-5 w-5 ${isCompleted ? 'text-green-600' : 'text-orange-600'}`} />
                <h3 className="text-lg font-bold text-gray-900">{offer.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{offer.description}</p>
            </div>
            {isCompleted ? (
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
            ) : isExpired ? (
              <Clock className="h-8 w-8 text-red-600 flex-shrink-0" />
            ) : (
              <TrendingUp className="h-8 w-8 text-orange-600 flex-shrink-0" />
            )}
          </div>

          {/* Reward Badge */}
          <div className="mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800'
            }`}>
              <Gift className="h-4 w-4" />
              <span className="font-semibold">{offer.reward.description}</span>
            </div>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-600 mb-1">Target</p>
              <p className="text-sm font-semibold text-gray-900">
                {offer.targetValue} {getOfferOnLabel(offer.offerOn)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Valid Until</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                <Calendar className="h-3 w-3" />
                <span>{new Date(offer.validity.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {hasProgress ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Store Progress</span>
                <span className={`text-sm font-bold ${
                  isCompleted ? 'text-green-600' : isExpired ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {progressPercentage}%
                </span>
              </div>
              
              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : isExpired
                        ? 'bg-red-500'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {currentValue} / {targetValue} {getOfferOnLabel(offer.offerOn)}
                </span>
                {isCompleted && progress?.completedAt && (
                  <span className="text-green-600 font-medium">
                    Completed on {new Date(progress.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Initial Count Info */}
              {offer.initialCount && progress?.baselineValue !== undefined && !isCompleted && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Fresh Start Offer</p>
                      <p>
                        Your baseline was {progress.baselineValue} {getOfferOnLabel(offer.offerOn)}.
                        Only new {getOfferOnLabel(offer.offerOn).toLowerCase()} since {new Date(progress.startedAt).toLocaleDateString()} count towards this offer.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">Not Started Yet</p>
                  <p>Your store hasn't started working towards this offer yet.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get offer IDs for active and past tabs
  const activeOfferIds = activeOffers.map(o => o.id);
  const pastOfferIds = [...new Set([
    ...pastOffers.map(o => o.id),
    ...userProgress.filter(p => p.status === 'expired' || p.status === 'completed').map(p => p.offerId)
  ])];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Store Offers
        </h1>
        <p className="text-gray-600 mt-1">Track your store's progress on available offers and rewards</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Offers</p>
              <p className="text-3xl font-bold mt-1">{activeOfferIds.length}</p>
            </div>
            <Tag className="h-10 w-10 text-orange-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold mt-1">
                {userProgress.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-100" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">In Progress</p>
              <p className="text-3xl font-bold mt-1">
                {userProgress.filter(p => p.status === 'in_progress').length}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-100" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Offers ({activeOfferIds.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past Offers ({pastOfferIds.length})
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeTab === 'active' ? (
          activeOfferIds.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <StoreIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Offers</h3>
              <p className="text-gray-600">Check back later for new opportunities and rewards for your store</p>
            </div>
          ) : (
            activeOfferIds.map(offerId => renderOfferCard(offerId, false))
          )
        ) : (
          pastOfferIds.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Past Offers</h3>
              <p className="text-gray-600">Your completed and expired offers will appear here</p>
            </div>
          ) : (
            pastOfferIds.map(offerId => renderOfferCard(offerId, true))
          )
        )}
      </div>
    </div>
  );
}
