import { X, TrendingUp, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { getOfferProgress, type Offer, type OfferProgress as OfferProgressType } from '../../../data/mockOfferData';

interface OfferProgressProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
}

export function OfferProgress({ isOpen, onClose, offer }: OfferProgressProps) {
  if (!isOpen) return null;

  const progressData = getOfferProgress(offer.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">In Progress</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>;
      case 'not_started':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Not Started</span>;
    }
  };

  const getOfferOnLabel = (offerOn: string) => {
    switch (offerOn) {
      case 'matching_rp': return 'Matching RP';
      case 'total_orders': return 'Orders';
      case 'level': return 'Level';
      case 'days_since_joining': return 'Days';
      default: return offerOn;
    }
  };

  // Calculate statistics
  const stats = {
    total: progressData.length,
    completed: progressData.filter(p => p.status === 'completed').length,
    inProgress: progressData.filter(p => p.status === 'in_progress').length,
    expired: progressData.filter(p => p.status === 'expired').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Sort by progress (completed first, then by progress percentage)
  const sortedProgress = [...progressData].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return -1;
    if (a.status !== 'completed' && b.status === 'completed') return 1;
    return b.progress - a.progress;
  });

  const handleExport = () => {
    // In production, this would export to CSV or PDF
    console.log('Exporting offer progress data...');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{offer.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-600 mb-1">Target</p>
              <p className="text-sm font-semibold text-gray-900">
                {offer.targetValue} {getOfferOnLabel(offer.offerOn)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Reward</p>
              <p className="text-sm font-semibold text-gray-900">{offer.reward.description}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Validity</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(offer.validity.startDate).toLocaleDateString()} - {new Date(offer.validity.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Initial Count</p>
              <p className="text-sm font-semibold text-gray-900">
                {offer.offerOn === 'matching_rp' || offer.offerOn === 'total_orders' 
                  ? (offer.initialCount ? 'Enabled' : 'Disabled')
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <p className="text-sm text-green-700 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <p className="text-sm text-blue-700 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
              <p className="text-sm text-purple-700 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Progress List */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Participant Progress</h3>
          
          {sortedProgress.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No participants yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedProgress.map((progress) => (
                <div
                  key={progress.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(progress.status)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{progress.userName}</h4>
                        <p className="text-xs text-gray-500">ID: {progress.userId}</p>
                      </div>
                    </div>
                    {getStatusBadge(progress.status)}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {progress.currentValue} / {progress.targetValue} {getOfferOnLabel(offer.offerOn)}
                      </span>
                      <span className="font-semibold text-gray-900">{progress.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          progress.status === 'completed'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : progress.status === 'expired'
                            ? 'bg-red-500'
                            : 'bg-gradient-to-r from-blue-500 to-teal-500'
                        }`}
                        style={{ width: `${Math.min(progress.progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-6 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Started:</span> {new Date(progress.startedAt).toLocaleDateString()}
                    </div>
                    {progress.completedAt && (
                      <div>
                        <span className="font-medium">Completed:</span> {new Date(progress.completedAt).toLocaleDateString()}
                      </div>
                    )}
                    {offer.initialCount && progress.baselineValue !== undefined && (
                      <div>
                        <span className="font-medium">Baseline:</span> {progress.baselineValue} {getOfferOnLabel(offer.offerOn)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}