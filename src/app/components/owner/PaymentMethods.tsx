import { useState } from 'react';
import { CreditCard, Plus, Trash2, Power, PowerOff, Building2, QrCode, Smartphone, Edit, X } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { mockPaymentMethods, type PaymentMethod } from '../../../data/mockPaymentMethods';

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'upi' as 'upi' | 'qr' | 'bank',
    name: '',
    upiId: '',
    qrImage: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branch: ''
  });

  const stats = {
    total: paymentMethods.length,
    active: paymentMethods.filter(pm => pm.isActive).length,
    upi: paymentMethods.filter(pm => pm.type === 'upi').length,
    bank: paymentMethods.filter(pm => pm.type === 'bank').length,
    qr: paymentMethods.filter(pm => pm.type === 'qr').length
  };

  const handleOpenAddModal = () => {
    setEditingMethod(null);
    setFormData({
      type: 'upi',
      name: '',
      upiId: '',
      qrImage: '',
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      name: method.name,
      upiId: method.details.upiId || '',
      qrImage: method.details.qrImage || '',
      accountName: method.details.accountName || '',
      accountNumber: method.details.accountNumber || '',
      ifscCode: method.details.ifscCode || '',
      bankName: method.details.bankName || '',
      branch: method.details.branch || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMethod) {
      // Update existing payment method
      const updatedMethods = paymentMethods.map(pm => 
        pm.id === editingMethod.id
          ? {
              ...pm,
              type: formData.type,
              name: formData.name,
              details: {
                upiId: formData.type === 'upi' ? formData.upiId : undefined,
                qrImage: formData.type === 'qr' ? formData.qrImage : undefined,
                accountName: formData.type === 'bank' ? formData.accountName : undefined,
                accountNumber: formData.type === 'bank' ? formData.accountNumber : undefined,
                ifscCode: formData.type === 'bank' ? formData.ifscCode : undefined,
                bankName: formData.type === 'bank' ? formData.bankName : undefined,
                branch: formData.type === 'bank' ? formData.branch : undefined
              }
            }
          : pm
      );
      setPaymentMethods(updatedMethods);
      toast.success('Payment method updated successfully');
    } else {
      // Add new payment method
      const newMethod: PaymentMethod = {
        id: `pm-${Date.now()}`,
        type: formData.type,
        name: formData.name,
        isActive: true,
        createdAt: new Date().toISOString(),
        details: {
          upiId: formData.type === 'upi' ? formData.upiId : undefined,
          qrImage: formData.type === 'qr' ? formData.qrImage : undefined,
          accountName: formData.type === 'bank' ? formData.accountName : undefined,
          accountNumber: formData.type === 'bank' ? formData.accountNumber : undefined,
          ifscCode: formData.type === 'bank' ? formData.ifscCode : undefined,
          bankName: formData.type === 'bank' ? formData.bankName : undefined,
          branch: formData.type === 'bank' ? formData.branch : undefined
        }
      };
      setPaymentMethods([...paymentMethods, newMethod]);
      toast.success('Payment method added successfully');
    }

    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    const updatedMethods = paymentMethods.map(pm =>
      pm.id === id ? { ...pm, isActive: !pm.isActive } : pm
    );
    setPaymentMethods(updatedMethods);
    toast.success('Payment method status updated');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      toast.success('Payment method deleted successfully');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'upi': return <Smartphone className="h-5 w-5" />;
      case 'qr': return <QrCode className="h-5 w-5" />;
      case 'bank': return <Building2 className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      upi: 'bg-purple-100 text-purple-800',
      qr: 'bg-blue-100 text-blue-800',
      bank: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Payment Methods
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage business payment methods for wallet top-ups
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Methods</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Power className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">UPI</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">{stats.upi}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">QR Codes</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{stats.qr}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Bank Accounts</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{stats.bank}</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`bg-white rounded-lg shadow-sm border-2 transition-all p-4 sm:p-6 ${
              method.isActive ? 'border-emerald-200' : 'border-gray-200 opacity-75'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center ${
                  method.type === 'upi' ? 'bg-purple-100 text-purple-600' :
                  method.type === 'qr' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {getTypeIcon(method.type)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">{method.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeBadge(method.type)}
                    {method.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              {method.type === 'upi' && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">UPI ID</p>
                  <p className="text-sm font-semibold text-gray-900">{method.details.upiId}</p>
                </div>
              )}

              {method.type === 'qr' && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">QR Code</p>
                  <img 
                    src={method.details.qrImage} 
                    alt="QR Code" 
                    className="w-32 h-32 sm:w-40 sm:h-40 border border-gray-200 rounded-lg"
                  />
                </div>
              )}

              {method.type === 'bank' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Account Name</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{method.details.accountName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Account Number</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{method.details.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">IFSC Code</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{method.details.ifscCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Bank Name</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{method.details.bankName}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Branch</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{method.details.branch}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEditModal(method)}
                className="flex-1 sm:flex-none"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(method.id)}
                className={`flex-1 sm:flex-none ${method.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
              >
                {method.isActive ? (
                  <>
                    <PowerOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(method.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Payment Methods</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Add your first payment method to enable wallet top-ups
            </p>
            <Button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'upi' | 'qr' | 'bank' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="upi">UPI</option>
                    <option value="qr">QR Code</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., Sthiroot Official UPI"
                    required
                  />
                </div>

                {/* UPI Specific Fields */}
                {formData.type === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID *
                    </label>
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="e.g., sthiroot@paytm"
                      required
                    />
                  </div>
                )}

                {/* QR Code Specific Fields */}
                {formData.type === 'qr' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code Image URL *
                    </label>
                    <input
                      type="url"
                      value={formData.qrImage}
                      onChange={(e) => setFormData({ ...formData, qrImage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://..."
                      required
                    />
                    {formData.qrImage && (
                      <div className="mt-3">
                        <img 
                          src={formData.qrImage} 
                          alt="QR Preview" 
                          className="w-32 h-32 border border-gray-200 rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Bank Account Specific Fields */}
                {formData.type === 'bank' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Name *
                      </label>
                      <input
                        type="text"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Account holder name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Account number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="IFSC code"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Bank name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch
                      </label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Branch name"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    {editingMethod ? 'Update' : 'Add'} Payment Method
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
