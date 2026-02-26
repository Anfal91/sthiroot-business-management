import { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Trash2,
  X,
  Calculator,
  Save,
  Package,
  ArrowRightLeft,
  TrendingUp,
  Store as StoreIcon,
  Phone,
  User,
  CreditCard,
  FileText,
  Boxes,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockProducts, mockPrograms, mockDigitalCourses, mockEvents, mockProgramsCombos, type Product, type Program } from '@/data/mockProductData';
import { mockStoresWithCharges, type Store } from '@/data/mockStoreData';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import React from 'react';

interface SelectedProduct {
  product: Product;
  quantity: number;
}

interface PaymentEntry {
  id: string;
  amount: number;
  method: string;
  transactionId: string;
  transactionDate: string;
  photo?: File;
  photoPreview?: string;
  notes: string;
}

interface CreateOrderProps {
  userRole: 'partner' | 'employee' | 'admin' | 'owner';
  userName: string;
  userPhone: string;
}

export function CreateOrder({ userRole, userName, userPhone }: CreateOrderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [transferRP, setTransferRP] = useState(false);
  const [selectedLeg, setSelectedLeg] = useState<'A' | 'B' | 'Self' | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  
  const [legRPData, setLegRPData] = useState({
    legA: 12500,
    legB: 8750,
    selfRP: 5200,
  });
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    alternativePhone: '',
    address: '',
    agentName: userName,
    agentPhone: userPhone,
    programId: '',
    paymentNotes: '',
    category: 'office_pickup',
    source: 'direct',
    notes: '',
    discount: 0,
  });

  const selectedStore = mockStoresWithCharges.find(store => store.id === selectedStoreId);
  const activeStores = mockStoresWithCharges.filter(store => store.status === 'Active');
  const allProducts = [...mockProgramsCombos, ...mockProducts, ...mockDigitalCourses, ...mockEvents];

  const getFilteredProducts = () => {
    let products = allProducts;

    if (userRole === 'partner' && selectedStoreId) {
      products = products.filter(product => {
        if (product.type === 'Digital Course' || product.type === 'Event') {
          return true;
        }
        if (product.storeStock && product.storeStock[selectedStoreId]) {
          return product.storeStock[selectedStoreId] > 0;
        }
        return false;
      });
    }

    if (searchQuery) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return products;
  };

  const filteredProducts = getFilteredProducts();
  const programProducts = filteredProducts.filter(p => p.type === 'Program');
  const physicalProducts = filteredProducts.filter(p => p.type === 'Physical');
  const digitalCourses = filteredProducts.filter(p => p.type === 'Digital Course');
  const eventProducts = filteredProducts.filter(p => p.type === 'Event');

  const subtotal = selectedProducts.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );
  
  const totalRP = selectedProducts.reduce((sum, item) => 
    sum + (item.product.rp * item.quantity), 0
  );
  
  const totalDP = selectedProducts.reduce((sum, item) => 
    sum + (item.product.dp * item.quantity), 0
  );
  const transferableAmount = selectedStore 
    ? totalDP + selectedStore.serviceCharge + selectedStore.deliveryCharge 
    : 0;
  
  const selectedProgram = mockPrograms.find(p => p.id === formData.programId);
  const programDiscount = selectedProgram ? (subtotal * selectedProgram.discount / 100) : 0;
  const additionalDiscount = formData.discount || 0;
  const totalDiscount = programDiscount + additionalDiscount;
  const finalAmount = subtotal - totalDiscount;

  const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const remainingAmount = finalAmount - totalPayments;

  const getAvailableStock = (product: Product) => {
    if (product.type === 'Digital Course') return 999;
    if (product.type === 'Event') return product.stock;
    
    if (userRole === 'partner' && selectedStoreId && product.storeStock) {
      return product.storeStock[selectedStoreId] || 0;
    }
    return product.stock;
  };

  const getProgramProducts = (programProductIds?: string[]) => {
    if (!programProductIds) return [];
    return allProducts.filter(p => programProductIds.includes(p.id));
  };

  const handleAddProduct = (product: Product) => {
    // Check if pickup center is selected for partners only
    if (userRole === 'partner' && !selectedStoreId) {
      toast.error('Please select a pickup center first');
      return;
    }

    const existing = selectedProducts.find(item => item.product.id === product.id);
    if (existing) {
      toast.error('Product already added. Change quantity in the table.');
      return;
    }
    setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
    toast.success(`${product.name} added to order`);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    const item = selectedProducts.find(i => i.product.id === productId);
    if (!item) return;

    const availableStock = getAvailableStock(item.product);

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} units available in stock`);
      return;
    }

    if (quantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }

    setSelectedProducts(selectedProducts.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(item => item.product.id !== productId));
    toast.success('Product removed from order');
  };

  const handleAddPayment = () => {
    const newPayment: PaymentEntry = {
      id: `payment_${Date.now()}`,
      amount: 0,
      method: 'cash',
      transactionId: '',
      transactionDate: new Date().toISOString().split('T')[0],
      notes: '',
    };
    setPayments([...payments, newPayment]);
  };

  const handleUpdatePayment = (id: string, field: keyof PaymentEntry, value: any) => {
    setPayments(payments.map(payment =>
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  const handlePaymentPhoto = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPayments(payments.map(payment =>
        payment.id === id ? { 
          ...payment, 
          photo: file,
          photoPreview: reader.result as string 
        } : payment
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
    toast.success('Payment entry removed');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Please fill in customer name and phone');
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    if (!formData.programId) {
      toast.error('Please select a program');
      return;
    }

    if (userRole === 'partner' && !selectedStoreId) {
      toast.error('Please select a pickup center');
      return;
    }

    const orderData = {
      ...formData,
      products: selectedProducts,
      payments,
      subtotal,
      programDiscount,
      additionalDiscount,
      totalDiscount,
      finalAmount,
      totalPayments,
      remainingAmount,
      createdBy: userName,
      createdByRole: userRole,
      createdAt: new Date().toISOString(),
      pickupCenter: selectedStore?.id,
      rpTransfer: transferRP ? {
        enabled: true,
        totalRP,
        selectedLeg: userRole === 'employee' ? 'Self' : selectedLeg,
        legACurrentRP: legRPData.legA,
        legBCurrentRP: legRPData.legB,
        selfRPCurrent: legRPData.selfRP,
        legAAfterTransfer: (userRole === 'employee' || selectedLeg === 'Self') ? legRPData.legA : selectedLeg === 'A' ? legRPData.legA + totalRP : legRPData.legA,
        legBAfterTransfer: (userRole === 'employee' || selectedLeg === 'Self') ? legRPData.legB : selectedLeg === 'B' ? legRPData.legB + totalRP : legRPData.legB,
        selfRPAfterTransfer: (userRole === 'employee' || selectedLeg === 'Self') ? legRPData.selfRP + totalRP : legRPData.selfRP,
      } : {
        enabled: false
      }
    };

    console.log('Order Data:', orderData);
    toast.success('Order created successfully!', {
      description: `Order for ${formData.customerName} - ₹${finalAmount.toFixed(2)}`
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Create New Order</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Add customer details and select products</p>
        </div>
        <Badge className="bg-emerald-600 text-white w-fit">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <ShoppingCart className="size-4 md:size-5 text-emerald-600" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternativePhone">Alternative Phone</Label>
                <Input
                  id="alternativePhone"
                  type="tel"
                  value={formData.alternativePhone}
                  onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
                  placeholder="+91 98765 43211"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete delivery address"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Agent Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Agent Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name</Label>
                <Input
                  id="agentName"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  placeholder="Agent name"
                  readOnly={userRole === 'partner' || userRole === 'employee'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentPhone">Agent Phone</Label>
                <Input
                  id="agentPhone"
                  type="tel"
                  value={formData.agentPhone}
                  onChange={(e) => setFormData({ ...formData, agentPhone: e.target.value })}
                  placeholder="Agent phone"
                  readOnly={userRole === 'partner' || userRole === 'employee'}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Program & Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Select Program *</Label>
                <Select value={formData.programId} onValueChange={(value) => setFormData({ ...formData, programId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose program" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPrograms.filter(p => p.isActive).map(program => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name} {program.discount > 0 && `(${program.discount}% off)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self_delivery">Self Delivery</SelectItem>
                    <SelectItem value="office_pickup">Office Pickup</SelectItem>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Center Selection - For Partners Only */}
        {userRole === 'partner' && (
          <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <StoreIcon className="size-4 md:size-5 text-teal-600" />
                <span className="text-sm md:text-base">Select Pickup Center (Store) *</span>
              </CardTitle>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Choose a pickup center to see available products
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {activeStores.map(store => (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStoreId(store.id)}
                    className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStoreId === store.id
                        ? 'border-teal-500 bg-white shadow-lg'
                        : 'border-gray-300 bg-white hover:border-teal-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm md:text-base text-gray-800">{store.name}</h4>
                          {selectedStoreId === store.id && (
                            <Badge className="bg-teal-600">Selected</Badge>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">📍 {store.location}</p>
                        <p className="text-xs md:text-sm text-gray-600">📞 {store.phone}</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(store.phone);
                        }}
                        className="gap-2 border-teal-600 text-teal-600 hover:bg-teal-50 w-full sm:w-auto"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedStore && selectedProducts.length > 0 && (
                <div className="space-y-4 mt-4">
                  <div className="bg-white p-3 md:p-4 rounded-lg border-2 border-teal-300">
                    <h3 className="font-semibold text-sm md:text-base text-gray-700 mb-3">Transferable Amount Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Products (DP Total):</span>
                        <span className="font-medium">₹{totalDP.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Service Charge:</span>
                        <span className="font-medium">₹{selectedStore.serviceCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-gray-600">Delivery Charge:</span>
                        <span className="font-medium">₹{selectedStore.deliveryCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base md:text-lg font-bold pt-2 border-t border-teal-200">
                        <span className="text-teal-700">Total Transferable:</span>
                        <span className="text-teal-700">₹{transferableAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 md:p-4 rounded-lg border-2 border-teal-300">
                    <h3 className="font-semibold text-sm md:text-base text-gray-700 mb-3">Store Payment Methods</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3">
                      Transfer the amount using one of the following payment methods:
                    </p>
                    <div className="space-y-3">
                      {selectedStore.paymentMethods.map((method) => (
                        <div key={method.id} className="p-3 bg-gray-50 rounded-lg border">
                          <div className="font-semibold text-sm mb-2">
                            {method.type === 'upi' && '📱 UPI Payment'}
                            {method.type === 'qr' && '📲 QR Code Payment'}
                            {method.type === 'bank' && '🏦 Bank Transfer'}
                          </div>
                          {method.type === 'upi' && method.details.upiId && (
                            <p className="text-sm text-gray-600">UPI ID: <strong>{method.details.upiId}</strong></p>
                          )}
                          {method.type === 'bank' && (
                            <div className="text-sm text-gray-600 space-y-1">
                              {method.details.accountName && <p key="accountName">Account Name: <strong>{method.details.accountName}</strong></p>}
                              {method.details.accountNumber && <p key="accountNumber">Account Number: <strong>{method.details.accountNumber}</strong></p>}
                              {method.details.ifscCode && <p key="ifscCode">IFSC Code: <strong>{method.details.ifscCode}</strong></p>}
                              {method.details.bankName && <p key="bankName">Bank: <strong>{method.details.bankName}</strong></p>}
                              {method.details.branch && <p key="branch">Branch: <strong>{method.details.branch}</strong></p>}
                            </div>
                          )}
                          {method.type === 'qr' && method.details.qrImage && (
                            <p className="text-sm text-gray-600">Scan QR code to pay</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Product Selection - Continuing in next message due to length */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Package className="size-4 md:size-5 text-emerald-600" />
              Product Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 text-sm"
              />
            </div>

            <Tabs defaultValue="programs" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-auto">
                <TabsTrigger value="programs" className="text-xs md:text-sm px-1 md:px-3">
                  <span className="hidden sm:inline">Programs</span>
                  <span className="sm:hidden">Prog</span>
                  <span className="ml-1">({programProducts.length})</span>
                </TabsTrigger>
                <TabsTrigger value="physical" className="text-xs md:text-sm px-1 md:px-3">
                  <span className="hidden sm:inline">Physical</span>
                  <span className="sm:hidden">Phys</span>
                  <span className="ml-1">({physicalProducts.length})</span>
                </TabsTrigger>
                <TabsTrigger value="digital" className="text-xs md:text-sm px-1 md:px-3">
                  <span className="hidden sm:inline">Digital</span>
                  <span className="sm:hidden">Digi</span>
                  <span className="ml-1">({digitalCourses.length})</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="text-xs md:text-sm px-1 md:px-3">
                  <span className="hidden sm:inline">Events</span>
                  <span className="sm:hidden">Evnt</span>
                  <span className="ml-1">({eventProducts.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="programs">
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {programProducts.length > 0 ? (
                    programProducts.map(product => (
                      <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-xs md:text-sm truncate">{product.name}</p>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs">COMBO</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground break-words">
                            SKU: {product.sku}{userRole !== 'employee' && ` | Stock: ${getAvailableStock(product)}`} | MRP: ₹{product.price}{userRole !== 'employee' && ` | DP: ₹${product.dp}`} | RP: {product.rp}
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {searchQuery ? 'No programs found matching your search' : 'No programs available'}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="physical">
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {physicalProducts.length > 0 ? (
                    physicalProducts.map(product => (
                      <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs md:text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground break-words">
                            SKU: {product.sku}{userRole !== 'employee' && ` | Stock: ${getAvailableStock(product)}`} | MRP: ₹{product.price}{userRole !== 'employee' && ` | DP: ₹${product.dp}`} | RP: {product.rp}
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {searchQuery ? 'No physical products found matching your search' : 'No physical products available'}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="digital">
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {digitalCourses.length > 0 ? (
                    digitalCourses.map(product => (
                      <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-xs md:text-sm truncate">{product.name}</p>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">DIGITAL</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground break-words">
                            SKU: {product.sku} | MRP: ₹{product.price}{userRole !== 'employee' && ` | DP: ₹${product.dp}`} | RP: {product.rp}
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      {searchQuery ? 'No digital courses found matching your search' : 'No digital courses available'}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {eventProducts.length > 0 ? (
                    eventProducts.map(product => (
                      <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-50 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-xs md:text-sm truncate">{product.name}</p>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs">EVENT</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground break-words">
                            SKU: {product.sku}{userRole !== 'employee' && ` | Seats: ${product.stock}`} | MRP: ₹{product.price}{userRole !== 'employee' && ` | DP: ₹${product.dp}`} | RP: {product.rp}
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      {searchQuery ? 'No events found matching your search' : 'No events available'}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Selected Products Table with Program Component Products */}
            {selectedProducts.length > 0 && (
              <div className="border rounded-lg overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold">Product</th>
                        <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold">Type</th>
                        <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold">SKU</th>
                        {userRole !== 'employee' && <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold">Avail</th>}
                        <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold">Qty</th>
                        <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold">Price</th>
                        <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold">Total</th>
                        <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProducts.map(item => {
                        const componentProducts = item.product.type === 'Program' ? getProgramProducts(item.product.programProducts) : [];
                        
                        const rows = [
                          <tr key={item.product.id} className="border-b">
                            <td className="p-2 md:p-3 text-xs md:text-sm">
                              <div className="flex items-center gap-1 md:gap-2">
                                <span className="truncate max-w-[120px] md:max-w-none">{item.product.name}</span>
                                {item.product.type === 'Program' && componentProducts.length > 0 && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 text-xs shrink-0">
                                    {componentProducts.length} items
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-2 md:p-3 text-xs md:text-sm">
                              <Badge variant="outline" className="text-xs">{item.product.type}</Badge>
                            </td>
                            <td className="p-2 md:p-3 text-xs md:text-sm text-muted-foreground">{item.product.sku}</td>
                            {userRole !== 'employee' && (
                              <td className="p-2 md:p-3 text-xs md:text-sm text-center">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                                  {getAvailableStock(item.product)}
                                </Badge>
                              </td>
                            )}
                            <td className="p-2 md:p-3">
                              <Input
                                type="number"
                                min="1"
                                max={getAvailableStock(item.product)}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                                className="w-16 md:w-20 text-center text-xs md:text-sm"
                              />
                            </td>
                            <td className="p-2 md:p-3 text-xs md:text-sm text-right">₹{item.product.price}</td>
                            <td className="p-2 md:p-3 text-xs md:text-sm text-right font-semibold">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="p-2 md:p-3 text-center">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveProduct(item.product.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                              >
                                <Trash2 className="size-3 md:size-4" />
                              </Button>
                            </td>
                          </tr>
                        ];

                        if (item.product.type === 'Program' && componentProducts.length > 0) {
                          rows.push(
                            <tr key={`${item.product.id}-components`} className="border-b bg-purple-50/30">
                              <td colSpan={userRole === 'employee' ? 7 : 8} className="p-3">
                                <div className="pl-8">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Boxes className="size-4 text-purple-600" />
                                    <span className="text-xs font-semibold text-purple-700">Program Includes:</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {componentProducts.map(cp => (
                                      <div key={cp.id} className="flex items-center gap-2 text-xs bg-white p-2 rounded border">
                                        <Package className="size-3 text-gray-500" />
                                        <span className="font-medium">{cp.name}</span>
                                        <span className="text-muted-foreground">({cp.sku})</span>
                                        {userRole !== 'employee' && (
                                          <Badge variant="outline" className="ml-auto text-xs">DP: ₹{cp.dp}</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return rows;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="size-16 mx-auto mb-4 text-muted-foreground/30" />
                <p>No products added yet</p>
                <p className="text-sm mt-1">Search and add products to create an order</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RP Transfer Section */}
        {selectedProducts.length > 0 && (userRole === 'partner' || userRole === 'employee') && (
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <ArrowRightLeft className="size-4 md:size-5 text-purple-600" />
                <span className="text-sm md:text-base">
                  {userRole === 'employee' ? 'RP Transfer to Self' : 'RP Transfer to Legs or Self'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 p-3 md:p-4 bg-white rounded-lg border">
                <Checkbox
                  id="transferRP"
                  checked={transferRP}
                  onCheckedChange={(checked) => {
                    setTransferRP(checked as boolean);
                    if (!checked) {
                      setSelectedLeg(null);
                    } else if (userRole === 'employee') {
                      // Automatically set to Self for employees
                      setSelectedLeg('Self');
                    }
                  }}
                />
                <Label htmlFor="transferRP" className="text-sm md:text-base font-semibold cursor-pointer">
                  {userRole === 'employee' 
                    ? 'Do you want to transfer this RP to your Self account?' 
                    : 'Do you want to transfer this RP?'
                  }
                </Label>
              </div>

              {transferRP && (
                <div className="space-y-4">
                  <div className="bg-white p-3 md:p-4 rounded-lg border-2 border-purple-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="size-4 md:size-5 text-purple-600" />
                        <span className="font-semibold text-sm md:text-base text-gray-700">Total Reward Points:</span>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base md:text-lg px-3 md:px-4 py-1 md:py-2 w-fit">
                        {totalRP} RP
                      </Badge>
                    </div>
                  </div>

                  {userRole === 'employee' ? (
                    // For employees, show only Self RP transfer info
                    <div className="bg-white p-3 md:p-5 rounded-lg border-2 border-amber-500 shadow-lg">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <h4 className="font-bold text-sm md:text-lg text-gray-800 flex items-center gap-2">
                          <User className="size-4 md:size-5" />
                          Self RP Account
                        </h4>
                        <Badge className="bg-amber-600 text-xs">Auto Transfer</Badge>
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Current RP:</span>
                          <span className="font-semibold text-amber-700">
                            {legRPData.selfRP.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">After Transfer:</span>
                          <span className="font-bold text-amber-800">
                            {(legRPData.selfRP + totalRP).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span className="text-gray-600">Change:</span>
                          <span className="font-semibold text-purple-600">+{totalRP} RP</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // For partners, show leg selection
                    <div>
                      <Label className="text-sm md:text-base font-semibold mb-3 block">Select Where to Transfer RP:</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {['A', 'B', 'Self'].map((leg) => (
                          <div
                            key={leg}
                            onClick={() => setSelectedLeg(leg as 'A' | 'B' | 'Self')}
                            className={`p-3 md:p-5 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedLeg === leg
                                ? leg === 'A' ? 'border-emerald-500 bg-emerald-50 shadow-lg' : leg === 'B' ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-amber-500 bg-amber-50 shadow-lg'
                                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2 md:mb-3">
                              <h4 className="font-bold text-sm md:text-lg text-gray-800 flex items-center gap-2">
                                {leg === 'Self' && <User className="size-4 md:size-5" />}
                                Leg {leg === 'Self' ? '' : leg} {leg === 'Self' && 'Self'}
                              </h4>
                              {selectedLeg === leg && (
                                <Badge className={`text-xs ${leg === 'A' ? 'bg-emerald-600' : leg === 'B' ? 'bg-blue-600' : 'bg-amber-600'}`}>Selected</Badge>
                              )}
                            </div>
                            <div className="space-y-1 md:space-y-2">
                              <div className="flex justify-between text-xs md:text-sm">
                                <span className="text-gray-600">Current RP:</span>
                                <span className={`font-semibold ${leg === 'A' ? 'text-emerald-700' : leg === 'B' ? 'text-blue-700' : 'text-amber-700'}`}>
                                  {leg === 'A' ? legRPData.legA.toLocaleString() : leg === 'B' ? legRPData.legB.toLocaleString() : legRPData.selfRP.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">After Transfer:</span>
                                <span className={`font-bold ${leg === 'A' ? 'text-emerald-800' : leg === 'B' ? 'text-blue-800' : 'text-amber-800'}`}>
                                  {leg === 'A' ? (legRPData.legA + totalRP).toLocaleString() : leg === 'B' ? (legRPData.legB + totalRP).toLocaleString() : (legRPData.selfRP + totalRP).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm pt-2 border-t">
                                <span className="text-gray-600">Change:</span>
                                <span className="font-semibold text-purple-600">+{totalRP} RP</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        {selectedProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Calculator className="size-4 md:size-5 text-emerald-600" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {programDiscount > 0 && (
                  <div className="flex justify-between text-xs md:text-sm text-green-600">
                    <span>Program Discount ({selectedProgram?.discount}%):</span>
                    <span>-₹{programDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="additionalDiscount" className="text-sm">Additional Discount (₹)</Label>
                  <Input
                    id="additionalDiscount"
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                {additionalDiscount > 0 && (
                  <div className="flex justify-between text-xs md:text-sm text-green-600">
                    <span>Additional Discount:</span>
                    <span>-₹{additionalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base md:text-lg font-bold pt-3 border-t-2">
                  <span>Total Amount:</span>
                  <span className="text-emerald-600">₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Details */}
        {selectedProducts.length > 0 && (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <CreditCard className="size-4 md:size-5 text-emerald-600" />
                Payment Details
              </CardTitle>
              <Button
                type="button"
                size="sm"
                onClick={handleAddPayment}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Plus className="size-4 mr-2" />
                Add Payment
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {payments.length > 0 && (
                <div className="space-y-4">
                  {payments.map((payment, index) => (
                    <Card key={payment.id} className="border-2">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">Payment #{index + 1}</h4>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemovePayment(payment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`amount-${payment.id}`}>Amount</Label>
                            <Input
                              id={`amount-${payment.id}`}
                              type="number"
                              min="0"
                              value={payment.amount || ''}
                              onChange={(e) => handleUpdatePayment(payment.id, 'amount', parseFloat(e.target.value) || 0)}
                              placeholder="Enter amount"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`method-${payment.id}`}>Payment Method</Label>
                            <Select
                              value={payment.method}
                              onValueChange={(value) => handleUpdatePayment(payment.id, 'method', value)}
                            >
                              <SelectTrigger id={`method-${payment.id}`}>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`transactionId-${payment.id}`}>Transaction ID</Label>
                            <Input
                              id={`transactionId-${payment.id}`}
                              value={payment.transactionId}
                              onChange={(e) => handleUpdatePayment(payment.id, 'transactionId', e.target.value)}
                              placeholder="Enter transaction ID"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`transactionDate-${payment.id}`}>Transaction Date</Label>
                            <Input
                              id={`transactionDate-${payment.id}`}
                              type="date"
                              value={payment.transactionDate}
                              onChange={(e) => handleUpdatePayment(payment.id, 'transactionDate', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`paymentPhoto-${payment.id}`}>Payment Photo</Label>
                          <div className="flex items-center gap-3">
                            <Input
                              id={`paymentPhoto-${payment.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePaymentPhoto(payment.id, file);
                              }}
                              className="flex-1"
                            />
                            {payment.photoPreview && (
                              <div className="relative">
                                <img
                                  src={payment.photoPreview}
                                  alt="Payment proof"
                                  className="h-16 w-16 object-cover rounded border"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUpdatePayment(payment.id, 'photoPreview', undefined)}
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full"
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`paymentNotes-${payment.id}`}>Notes</Label>
                          <Textarea
                            id={`paymentNotes-${payment.id}`}
                            value={payment.notes}
                            onChange={(e) => handleUpdatePayment(payment.id, 'notes', e.target.value)}
                            placeholder="Payment notes"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {payments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No payment entries added</p>
                  <p className="text-sm mt-1">Click "Add Payment" to add a payment entry</p>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="paymentNotes">Payment Notes</Label>
                <Textarea
                  id="paymentNotes"
                  value={formData.paymentNotes}
                  onChange={(e) => setFormData({ ...formData, paymentNotes: e.target.value })}
                  placeholder="General payment notes"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <FileText className="size-4 md:size-5 text-emerald-600" />
              Order Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                id="orderNotes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any special instructions or notes for this order..."
                rows={4}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4 sticky bottom-0 bg-white py-4 border-t md:static md:border-t-0 md:py-0 -mx-4 px-4 md:mx-0 md:px-0 z-10">
          <Button type="submit" size="lg" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm md:text-base">
            <Save className="size-4 md:size-5 mr-2" />
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}