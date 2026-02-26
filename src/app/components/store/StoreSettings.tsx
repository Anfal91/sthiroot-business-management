import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Save, Plus, Trash2, Upload, CreditCard, Smartphone, Building2, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'upi' | 'qr' | 'bank';
  details: {
    upiId?: string;
    qrImage?: string;
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branch?: string;
  };
}

export function StoreSettings() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'upi' | 'qr' | 'bank'>('upi');

  // Mock store data
  const [storeData, setStoreData] = useState({
    name: 'Sthiroot Health Store - Delhi',
    storeId: 'S001',
    address: '123, Green Park, New Delhi - 110016',
    phone: '+91 98765 43210',
    email: 'delhi@sthiroot.com',
    gst: '07AABCU9603R1ZM',
    manager: 'Suresh Menon',
    serviceCharge: 50,
    deliveryCharge: 100,
  });

  // Pickup Center Settings
  const [pickupCenterSettings, setPickupCenterSettings] = useState({
    listForPartnerOrders: false,
    listForStoreOrders: false,
  });

  const handleSavePickupSettings = () => {
    if (!pickupCenterSettings.listForPartnerOrders && !pickupCenterSettings.listForStoreOrders) {
      toast.info('Pickup center registration disabled');
    } else {
      const enabledFor = [];
      if (pickupCenterSettings.listForPartnerOrders) enabledFor.push('Partner Orders');
      if (pickupCenterSettings.listForStoreOrders) enabledFor.push('Store Orders');
      toast.success(`Pickup center enabled for: ${enabledFor.join(' and ')}`);
    }
  };

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'PM-001',
      type: 'upi',
      details: {
        upiId: 'sthiroot.delhi@paytm',
      },
    },
    {
      id: 'PM-002',
      type: 'bank',
      details: {
        accountName: 'Sthiroot Health Store',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branch: 'Green Park, New Delhi',
      },
    },
  ]);

  const handleSaveStoreInfo = () => {
    toast.success('Store information updated successfully');
  };

  const handleAddPaymentMethod = () => {
    if (paymentMethods.length >= 3) {
      toast.error('Maximum 3 payment methods allowed');
      return;
    }

    const newPaymentMethod: PaymentMethod = {
      id: `PM-${Date.now()}`,
      type: selectedPaymentType,
      details: {},
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setIsPaymentDialogOpen(false);
    toast.success('Payment method added successfully');
  };

  const handleDeletePaymentMethod = (id: string) => {
    if (paymentMethods.length <= 1) {
      toast.error('At least one payment method is required');
      return;
    }
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    toast.success('Payment method deleted successfully');
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'upi':
        return <Smartphone className="h-5 w-5" />;
      case 'qr':
        return <CreditCard className="h-5 w-5" />;
      case 'bank':
        return <Building2 className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentLabel = (type: string) => {
    switch (type) {
      case 'upi':
        return 'UPI Payment';
      case 'qr':
        return 'QR Code Payment';
      case 'bank':
        return 'Bank Transfer';
      default:
        return 'Payment';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Store Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your store information and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Store Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeData.name}
                    onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeId">Store ID</Label>
                  <Input id="storeId" value={storeData.storeId} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Store Address</Label>
                <Textarea
                  id="address"
                  value={storeData.address}
                  onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={storeData.phone}
                    onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeData.email}
                    onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={storeData.gst}
                    onChange={(e) => setStoreData({ ...storeData, gst: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Store Manager</Label>
                  <Input
                    id="manager"
                    value={storeData.manager}
                    onChange={(e) => setStoreData({ ...storeData, manager: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Service Charge (₹)</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    min="0"
                    step="1"
                    value={storeData.serviceCharge}
                    onChange={(e) => setStoreData({ ...storeData, serviceCharge: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter service charge per order"
                  />
                  <p className="text-xs text-muted-foreground">Fixed service charge applied per order</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryCharge">Delivery Charge (₹)</Label>
                  <Input
                    id="deliveryCharge"
                    type="number"
                    min="0"
                    step="1"
                    value={storeData.deliveryCharge}
                    onChange={(e) => setStoreData({ ...storeData, deliveryCharge: parseFloat(e.target.value) || 0 })}
                    placeholder="Enter delivery charge per order"
                  />
                  <p className="text-xs text-muted-foreground">Fixed delivery charge applied per order</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveStoreInfo}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          {/* Pickup Center Settings */}
          <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Pickup Center Registration</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Do you want to register your store as a pickup center?
                </p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {/* Option 1: Partner Orders */}
              <div className="flex items-start justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="partnerOrders" className="text-base font-semibold cursor-pointer">
                      List your store on partner order processing
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, partners can select your store as a pickup center when creating orders. Your store will appear in the store/pickup center dropdown during partner order creation.
                  </p>
                </div>
                <Switch
                  id="partnerOrders"
                  checked={pickupCenterSettings.listForPartnerOrders}
                  onCheckedChange={(checked) =>
                    setPickupCenterSettings({
                      ...pickupCenterSettings,
                      listForPartnerOrders: checked,
                    })
                  }
                  className="ml-4"
                />
              </div>

              {/* Option 2: Store Orders */}
              <div className="flex items-start justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="storeOrders" className="text-base font-semibold cursor-pointer">
                      List your store on other store order processing
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, other stores can select your store for stock transfer orders. Your store will appear in the store selection dropdown when other stores create orders (typically for inventory transfers).
                  </p>
                </div>
                <Switch
                  id="storeOrders"
                  checked={pickupCenterSettings.listForStoreOrders}
                  onCheckedChange={(checked) =>
                    setPickupCenterSettings({
                      ...pickupCenterSettings,
                      listForStoreOrders: checked,
                    })
                  }
                  className="ml-4"
                />
              </div>

              {/* Status Info */}
              {(pickupCenterSettings.listForPartnerOrders || pickupCenterSettings.listForStoreOrders) && (
                <div className="p-4 bg-blue-100 border-2 border-blue-300 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">✓ Pickup Center Active For:</p>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4">
                    {pickupCenterSettings.listForPartnerOrders && (
                      <li>• Partner order processing</li>
                    )}
                    {pickupCenterSettings.listForStoreOrders && (
                      <li>• Other store order processing (stock transfers)</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSavePickupSettings}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Pickup Settings
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Payment Methods</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Add 1-3 payment methods for your store
                </p>
              </div>
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    disabled={paymentMethods.length >= 3}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Choose a payment method type to add
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Payment Type</Label>
                      <Select
                        value={selectedPaymentType}
                        onValueChange={(value: any) => setSelectedPaymentType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI Payment</SelectItem>
                          <SelectItem value="qr">QR Code Payment</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPaymentMethod}>Add Method</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="p-4 border-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        {getPaymentIcon(method.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{getPaymentLabel(method.type)}</h3>
                        <div className="mt-3 space-y-3">
                          {method.type === 'upi' && (
                            <div className="space-y-2">
                              <Label htmlFor={`upi-${method.id}`}>UPI ID</Label>
                              <Input
                                id={`upi-${method.id}`}
                                placeholder="yourname@upi"
                                defaultValue={method.details.upiId}
                              />
                            </div>
                          )}

                          {method.type === 'qr' && (
                            <div className="space-y-2">
                              <Label htmlFor={`qr-${method.id}`}>QR Code Image</Label>
                              <div className="flex gap-2">
                                <Input
                                  id={`qr-${method.id}`}
                                  type="file"
                                  accept="image/*"
                                  className="flex-1"
                                />
                                <Button variant="outline" size="icon">
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {method.type === 'bank' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`account-name-${method.id}`}>Account Name</Label>
                                <Input
                                  id={`account-name-${method.id}`}
                                  defaultValue={method.details.accountName}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`account-number-${method.id}`}>Account Number</Label>
                                <Input
                                  id={`account-number-${method.id}`}
                                  defaultValue={method.details.accountNumber}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`ifsc-${method.id}`}>IFSC Code</Label>
                                <Input
                                  id={`ifsc-${method.id}`}
                                  defaultValue={method.details.ifscCode}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`bank-name-${method.id}`}>Bank Name</Label>
                                <Input
                                  id={`bank-name-${method.id}`}
                                  defaultValue={method.details.bankName}
                                />
                              </div>
                              <div className="space-y-2 col-span-2">
                                <Label htmlFor={`branch-${method.id}`}>Branch</Label>
                                <Input
                                  id={`branch-${method.id}`}
                                  defaultValue={method.details.branch}
                                />
                              </div>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          >
                            <Save className="h-3 w-3 mr-2" />
                            Save Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      disabled={paymentMethods.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              ))}

              {paymentMethods.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No payment methods added yet</p>
                  <p className="text-sm">Add at least one payment method to receive payments</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Credentials */}
        <TabsContent value="credentials" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Login Credentials</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Save className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}