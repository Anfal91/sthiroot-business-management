import { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Trash2,
  X,
  Save,
  Package,
  Store as StoreIcon,
  FileText,
  Wallet,
  Banknote,
  CreditCard,
  Boxes,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockProducts, mockDigitalCourses, mockEvents, mockProgramsCombos, type Product } from '@/data/mockProductData';
import { mockStoresWithCharges, type Store } from '@/data/mockStoreData';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
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

export function StoreCreateOrder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('MAIN_OFFICE');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash' | 'online_transfer'>('cash');
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  
  // Mock store information - In real app, this would come from auth context
  const currentStore = {
    id: 'S001',
    name: 'Sthiroot Health Store - Delhi',
    phone: '+91 98765 11001',
    alternativePhone: '+91 98765 11002',
    address: 'Shop No. 45, Green Park Market, New Delhi - 110016',
  };

  const [orderNotes, setOrderNotes] = useState('');

  const selectedPickupCenter = mockStoresWithCharges.find(store => store.id === selectedStoreId);
  const activeStores = mockStoresWithCharges.filter(store => store.status === 'Active');
  const allProducts = [...mockProgramsCombos, ...mockProducts, ...mockDigitalCourses, ...mockEvents];

  const getFilteredProducts = () => {
    let products = allProducts;

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
    sum + (item.product.pp * item.quantity), 0
  );
  
  const totalAmount = subtotal;

  const getAvailableStock = (product: Product) => {
    if (product.type === 'Digital Course') return 999;
    if (product.type === 'Event') return product.stock;
    
    if (selectedStoreId && product.storeStock) {
      return product.storeStock[selectedStoreId] || 0;
    }
    return product.stock;
  };

  const getProgramProducts = (programProductIds?: string[]) => {
    if (!programProductIds) return [];
    return allProducts.filter(p => programProductIds.includes(p.id));
  };

  const handleAddProduct = (product: Product) => {
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
      method: 'upi',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    if (!selectedStoreId) {
      toast.error('Please select a pickup center');
      return;
    }

    const orderData = {
      storeInfo: currentStore,
      products: selectedProducts,
      paymentMethod,
      payments,
      subtotal,
      totalAmount,
      pickupCenter: selectedPickupCenter?.id,
      orderNotes,
      createdAt: new Date().toISOString(),
    };

    console.log('Stock Purchase Order Data:', orderData);
    toast.success('Stock purchase order created successfully!', {
      description: `Order from ${selectedPickupCenter?.name} - ₹${totalAmount.toFixed(2)}`
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Create Stock Purchase Order</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Purchase products/stock from pickup centers at PP (Pickup Price)</p>
        </div>
        <Badge className="bg-blue-600 text-white w-fit">
          Store Admin
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Store Information */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Building2 className="size-4 md:size-5 text-blue-600" />
              Store Information (Purchaser)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm font-semibold text-gray-700">Store Name</Label>
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm md:text-base font-medium text-gray-900">{currentStore.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm font-semibold text-gray-700">Store Phone</Label>
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm md:text-base font-medium text-gray-900">{currentStore.phone}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm font-semibold text-gray-700">Alternative Phone</Label>
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm md:text-base font-medium text-gray-900">{currentStore.alternativePhone}</p>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs md:text-sm font-semibold text-gray-700">Store Address</Label>
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm md:text-base font-medium text-gray-900">{currentStore.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Center Selection */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <StoreIcon className="size-4 md:size-5 text-emerald-600" />
              <span className="text-sm md:text-base">Select Pickup Center (Supplier) *</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Purchase stock from Main Office or other stores</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              {activeStores.map(store => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedStoreId === store.id
                      ? 'border-emerald-500 bg-white shadow-lg'
                      : 'border-gray-300 bg-white hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm md:text-base text-gray-800">{store.name}</h4>
                        {store.id === 'MAIN_OFFICE' && (
                          <Badge className="bg-emerald-600">Recommended</Badge>
                        )}
                        {selectedStoreId === store.id && (
                          <Badge className="bg-blue-600">Selected</Badge>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">📍 {store.location}</p>
                      <p className="text-xs text-gray-500 mt-1">📞 {store.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Package className="size-4 md:size-5 text-blue-600" />
              Product Selection
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Select products to purchase at PP (Pickup Price)</p>
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
                            SKU: {product.sku} | Stock: {getAvailableStock(product)} | MRP: ₹{product.price} | <span className="font-semibold text-emerald-600">PP: ₹{product.pp}</span>
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {searchQuery ? 'No programs found' : 'No programs available'}
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
                            SKU: {product.sku} | Stock: {getAvailableStock(product)} | MRP: ₹{product.price} | <span className="font-semibold text-emerald-600">PP: ₹{product.pp}</span>
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {searchQuery ? 'No physical products found' : 'No physical products available'}
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
                            SKU: {product.sku} | MRP: ₹{product.price} | <span className="font-semibold text-emerald-600">PP: ₹{product.pp}</span>
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {searchQuery ? 'No digital courses found' : 'No digital courses available'}
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
                            SKU: {product.sku} | Seats: {product.stock} | MRP: ₹{product.price} | <span className="font-semibold text-emerald-600">PP: ₹{product.pp}</span>
                          </p>
                        </div>
                        <Button type="button" size="sm" onClick={() => handleAddProduct(product)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shrink-0" disabled={selectedProducts.some(item => item.product.id === product.id)}>
                          <Plus className="size-4 mr-1" />
                          {selectedProducts.some(item => item.product.id === product.id) ? 'Added' : 'Add'}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      {searchQuery ? 'No events found' : 'No events available'}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Selected Products Table */}
            {selectedProducts.length > 0 && (
              <div className="border rounded-lg overflow-hidden mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold">Product</th>
                        <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold">Type</th>
                        <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold">SKU</th>
                        <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold">Stock</th>
                        <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold">Qty</th>
                        <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold">MRP</th>
                        <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold">PP</th>
                        <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold">Total (PP)</th>
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
                            <td className="p-2 md:p-3 text-xs md:text-sm text-center">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                                {getAvailableStock(item.product)}
                              </Badge>
                            </td>
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
                            <td className="p-2 md:p-3 text-xs md:text-sm text-right text-gray-500">₹{item.product.price}</td>
                            <td className="p-2 md:p-3 text-xs md:text-sm text-right font-semibold text-emerald-600">₹{item.product.pp}</td>
                            <td className="p-2 md:p-3 text-xs md:text-sm text-right font-bold text-blue-600">
                              ₹{(item.product.pp * item.quantity).toFixed(2)}
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
                              <td colSpan={9} className="p-3">
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
                                        <Badge variant="outline" className="ml-auto text-xs">PP: ₹{cp.pp}</Badge>
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
                
                {/* Discount Highlight */}
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-t">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="font-medium text-gray-700">💰 Potential Profit (MRP - PP):</span>
                    <span className="font-bold text-emerald-600">
                      ₹{(selectedProducts.reduce((sum, item) => 
                        sum + ((item.product.price - item.product.pp) * item.quantity), 0
                      )).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedProducts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="size-16 mx-auto mb-4 text-muted-foreground/30" />
                <p>No products added yet</p>
                <p className="text-sm mt-1">Search and add products to create a stock purchase order</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        {selectedProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <CreditCard className="size-4 md:size-5 text-blue-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className={`size-6 ${paymentMethod === 'wallet' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">Wallet</h4>
                      <p className="text-xs text-muted-foreground">Pay from wallet balance</p>
                    </div>
                    {paymentMethod === 'wallet' && (
                      <Badge className="bg-blue-600">Selected</Badge>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className={`size-6 ${paymentMethod === 'cash' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">Cash</h4>
                      <p className="text-xs text-muted-foreground">Cash payment</p>
                    </div>
                    {paymentMethod === 'cash' && (
                      <Badge className="bg-blue-600">Selected</Badge>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('online_transfer')}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'online_transfer'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`size-6 ${paymentMethod === 'online_transfer' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">Online Transfer</h4>
                      <p className="text-xs text-muted-foreground">UPI / Bank Transfer</p>
                    </div>
                    {paymentMethod === 'online_transfer' && (
                      <Badge className="bg-blue-600">Selected</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Online Transfer Payment Details */}
              {paymentMethod === 'online_transfer' && (
                <Card className="border-2 border-blue-200">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
                    <h3 className="font-semibold text-sm md:text-base">Payment Details</h3>
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
                                      <SelectItem value="upi">UPI</SelectItem>
                                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                      <SelectItem value="card">Card</SelectItem>
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
                        <p className="text-sm">No payment entries added</p>
                        <p className="text-xs mt-1">Click "Add Payment" to add a payment entry</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        {selectedProducts.length > 0 && (
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Subtotal (at PP):</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-emerald-600">
                  <span>Potential Profit (MRP - PP):</span>
                  <span className="font-semibold">
                    ₹{(selectedProducts.reduce((sum, item) => 
                      sum + ((item.product.price - item.product.pp) * item.quantity), 0
                    )).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base md:text-lg font-bold pt-3 border-t-2">
                  <span>Total Amount to Pay:</span>
                  <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <FileText className="size-4 md:size-5 text-blue-600" />
              Order Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Textarea
                id="orderNotes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Add any special instructions or notes for this stock purchase order..."
                rows={4}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4 sticky bottom-0 bg-white py-4 border-t md:static md:border-t-0 md:py-0 -mx-4 px-4 md:mx-0 md:px-0 z-10">
          <Button type="submit" size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-sm md:text-base">
            <Save className="size-4 md:size-5 mr-2" />
            Create Stock Purchase Order
          </Button>
        </div>
      </form>
    </div>
  );
}