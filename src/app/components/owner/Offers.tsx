import { useState } from 'react';
import { Plus, Tag, Users, TrendingUp, Calendar, Eye, Power, PowerOff, Filter, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { CreateOffer } from './CreateOffer';
import { OfferProgress } from './OfferProgress';
import { toast } from 'sonner';
import { mockOffers, getOfferProgress, type Offer, type OfferFor, type OfferStatus } from '../../../data/mockOfferData';

interface OffersProps {
  isStoreOwner?: boolean;
  storeId?: string;
}

export function Offers({ isStoreOwner = false, storeId }: OffersProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<OfferFor | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<OfferStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter offers - store owners only see employee offers they created
  const filteredOffers = mockOffers.filter(offer => {
    if (isStoreOwner) {
      // Show only employee offers created by the store owner
      if (offer.offerFor !== 'employee') return false;
    }
    
    const matchesType = filterType === 'all' || offer.offerFor === filterType;
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    const matchesSearch = !searchQuery || 
      offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  // Statistics
  const stats = {
    total: isStoreOwner 
      ? mockOffers.filter(o => o.offerFor === 'employee').length 
      : mockOffers.length,
    active: isStoreOwner 
      ? mockOffers.filter(o => o.status === 'active' && o.offerFor === 'employee').length
      : mockOffers.filter(o => o.status === 'active').length,
    partner: mockOffers.filter(o => o.offerFor === 'partner').length,
    employee: mockOffers.filter(o => o.offerFor === 'employee').length,
    store: mockOffers.filter(o => o.offerFor === 'store').length,
  };

  const handleToggleStatus = (offer: Offer) => {
    const newStatus = offer.status === 'active' ? 'disabled' : 'active';
    // In production, this would make an API call
    toast.success(`Offer ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully`);
  };

  const handleViewProgress = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsProgressModalOpen(true);
  };

  const getOfferOnLabel = (offerOn: string) => {
    switch (offerOn) {
      case 'matching_rp': return 'Matching RP';
      case 'total_orders': return 'Total Orders';
      case 'level': return 'Level';
      case 'days_since_joining': return 'Days Since Joining';
      default: return offerOn;
    }
  };

  const getRewardBadgeColor = (type: string) => {
    switch (type) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'points': return 'bg-blue-100 text-blue-800';
      case 'discount': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: OfferStatus) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
      case 'disabled':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Disabled</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>;
    }
  };

  const getOfferForBadge = (offerFor: OfferFor) => {
    const colors = {
      partner: 'bg-blue-100 text-blue-800',
      employee: 'bg-purple-100 text-purple-800',
      store: 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[offerFor]}`}>
        {offerFor.charAt(0).toUpperCase() + offerFor.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Offer Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {isStoreOwner ? 'Create and manage offers for your employees' : 'Create and manage offers for partners, employees, and stores'}
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Offers</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Partner Offers</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.partner}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Employee Offers</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.employee}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Store Offers</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.store}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as OfferFor | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="partner">Partner</option>
              <option value="employee">Employee</option>
              <option value="store">Store</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OfferStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Offers Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Get started by creating your first offer'}
            </p>
            {!searchQuery && filterType === 'all' && filterStatus === 'all' && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
            )}
          </div>
        ) : (
          filteredOffers.map((offer) => {
            const progressData = getOfferProgress(offer.id);
            const totalParticipants = progressData.length;
            const completedParticipants = progressData.filter(p => p.status === 'completed').length;
            
            return (
              <div key={offer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{offer.name}</h3>
                      {getStatusBadge(offer.status)}
                      {getOfferForBadge(offer.offerFor)}
                    </div>
                    <p className="text-gray-600 text-sm">{offer.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Target</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {offer.targetValue} {getOfferOnLabel(offer.offerOn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reward</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getRewardBadgeColor(offer.reward.type)}`}>
                      {offer.reward.description}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Validity</p>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(offer.validity.startDate).toLocaleDateString()} - {new Date(offer.validity.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Participants</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {totalParticipants} ({completedParticipants} completed)
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Initial Count</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {offer.offerOn === 'matching_rp' || offer.offerOn === 'total_orders' 
                        ? (offer.initialCount ? 'Yes' : 'No')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProgress(offer)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>

                  {offer.status !== 'expired' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(offer)}
                      className={offer.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {offer.status === 'active' ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-2" />
                          Disable
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <CreateOffer
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          // Refresh offers list
        }}
        isStoreOwner={isStoreOwner}
      />

      {selectedOffer && (
        <OfferProgress
          isOpen={isProgressModalOpen}
          onClose={() => {
            setIsProgressModalOpen(false);
            setSelectedOffer(null);
          }}
          offer={selectedOffer}
        />
      )}
    </div>
  );
}