import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Download,
  User,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  FileText,
  Mail,
  Calendar,
  Tag,
  Percent,
  ArrowLeft,
  Printer,
} from 'lucide-react';

export interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  productType: 'Physical Product' | 'Digital Course' | 'Event' | 'Program';
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountAmount?: number;
  totalPrice: number;
}

export interface StatusHistory {
  status: string;
  date: string;
  time: string;
  updatedBy?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderDate: string;
  orderTime: string;
  status: 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';
  
  // Customer Information
  customer: {
    name: string;
    phone: string;
    alternativePhone?: string;
    email?: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  
  // Agent/Employee Information
  agent?: {
    name: string;
    phone: string;
    role: string;
    id: string;
  };
  
  // Order Items
  items: OrderItem[];
  
  // Pricing
  subtotal: number;
  discount?: number;
  discountAmount?: number;
  deliveryCharges?: number;
  tax?: number;
  totalAmount: number;
  
  // Payment Information
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Partial' | 'Paid' | 'Refunded';
  paidAmount: number;
  pendingAmount: number;
  paymentDetails?: {
    transactionId?: string;
    transactionDate?: string;
    upiId?: string;
    bankName?: string;
    chequeNumber?: string;
  };
  
  // Additional Information
  deliveryType?: 'Home Delivery' | 'Store Pickup' | 'Office Pickup';
  orderSource?: 'Direct' | 'Online' | 'Phone' | 'WhatsApp';
  notes?: string;
  internalNotes?: string;
  
  // Status History
  statusHistory: StatusHistory[];
  
  // Store Information
  store?: {
    name: string;
    id: string;
    address?: string;
  };
}

export interface OrderViewProps {
  order: Order | null;
  onBack: () => void;
}

export function OrderView({ order, onBack }: OrderViewProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Confirmed':
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Partial':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Refunded':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Confirmed':
      case 'Processing':
        return <Clock className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      case 'Pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Order Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete information about order {order.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${getStatusColor(order.status)} flex items-center gap-1 text-base px-3 py-1`}
          >
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Order Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Order ID</Label>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Order Date</Label>
                <p className="font-medium">{new Date(order.orderDate).toLocaleDateString('en-IN')}</p>
                <p className="text-xs text-muted-foreground">{order.orderTime}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Delivery Type</Label>
                <p className="font-medium">{order.deliveryType || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Order Source</Label>
                <p className="font-medium">{order.orderSource || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <Label className="text-muted-foreground text-xs">Customer Name</Label>
                  <p className="font-semibold">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <Label className="text-muted-foreground text-xs">Phone Number</Label>
                  <p className="font-medium">{order.customer.phone}</p>
                  {order.customer.alternativePhone && (
                    <p className="text-sm text-muted-foreground">Alt: {order.customer.alternativePhone}</p>
                  )}
                </div>
              </div>
              {order.customer.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="font-medium">{order.customer.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 md:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <Label className="text-muted-foreground text-xs">Delivery Address</Label>
                  <p className="font-medium">{order.customer.address}</p>
                  {(order.customer.city || order.customer.state || order.customer.pincode) && (
                    <p className="text-sm text-muted-foreground">
                      {[order.customer.city, order.customer.state, order.customer.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Information (if available) */}
        {order.agent && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Agent/Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <p className="font-semibold">{order.agent.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p className="font-medium">{order.agent.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Role</Label>
                  <Badge variant="outline">{order.agent.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Store Information (if available) */}
        {order.store && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Store Name</Label>
                  <p className="font-semibold">{order.store.name}</p>
                  <p className="text-xs text-muted-foreground">{order.store.id}</p>
                </div>
                {order.store.address && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Store Address</Label>
                    <p className="font-medium text-sm">{order.store.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Product Details</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    {order.items.some(item => item.discount) && (
                      <TableHead className="text-right">Discount</TableHead>
                    )}
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={item.productId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.productCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.productType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.quantity}
                      </TableCell>
                      {order.items.some(i => i.discount) && (
                        <TableCell className="text-right">
                          {item.discount ? (
                            <div>
                              <p className="text-xs text-emerald-600 font-medium">
                                {item.discount}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                -₹{item.discountAmount?.toLocaleString('en-IN')}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell className="text-right font-semibold">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4" />

            {/* Pricing Summary */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {order.discount && order.discountAmount && (
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Discount ({order.discount}%)
                  </span>
                  <span className="font-semibold">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              {order.deliveryCharges && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className="font-semibold">₹{order.deliveryCharges.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              {order.tax && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-semibold">₹{order.tax.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-emerald-600">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Payment Method</Label>
                  <p className="font-semibold">{order.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Payment Status</Label>
                  <Badge
                    variant="outline"
                    className={getPaymentStatusColor(order.paymentStatus)}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Paid Amount</Label>
                  <p className="font-semibold text-emerald-600">
                    ₹{order.paidAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Pending Amount</Label>
                  <p className="font-semibold text-red-600">
                    ₹{order.pendingAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {order.paymentDetails && (
                <>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    {order.paymentDetails.transactionId && (
                      <div>
                        <Label className="text-muted-foreground text-xs">Transaction ID</Label>
                        <p className="font-medium font-mono text-sm">
                          {order.paymentDetails.transactionId}
                        </p>
                      </div>
                    )}
                    {order.paymentDetails.transactionDate && (
                      <div>
                        <Label className="text-muted-foreground text-xs">Transaction Date</Label>
                        <p className="font-medium">
                          {new Date(order.paymentDetails.transactionDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    )}
                    {order.paymentDetails.upiId && (
                      <div>
                        <Label className="text-muted-foreground text-xs">UPI ID</Label>
                        <p className="font-medium">{order.paymentDetails.upiId}</p>
                      </div>
                    )}
                    {order.paymentDetails.bankName && (
                      <div>
                        <Label className="text-muted-foreground text-xs">Bank Name</Label>
                        <p className="font-medium">{order.paymentDetails.bankName}</p>
                      </div>
                    )}
                    {order.paymentDetails.chequeNumber && (
                      <div>
                        <Label className="text-muted-foreground text-xs">Cheque Number</Label>
                        <p className="font-medium">{order.paymentDetails.chequeNumber}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Status History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.statusHistory.map((history, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-3 rounded-lg border ${
                    index === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(history.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(history.status)} text-xs`}
                      >
                        {history.status}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(history.date).toLocaleDateString('en-IN')}
                        <span>•</span>
                        {history.time}
                      </div>
                    </div>
                    {history.updatedBy && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated by: {history.updatedBy}
                      </p>
                    )}
                    {history.notes && (
                      <p className="text-sm mt-2">{history.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        {(order.notes || order.internalNotes) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.notes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Order Notes</Label>
                  <p className="font-medium mt-1">{order.notes}</p>
                </div>
              )}
              {order.internalNotes && (
                <div>
                  <Label className="text-muted-foreground text-xs">Internal Notes</Label>
                  <p className="font-medium mt-1 text-amber-700">{order.internalNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onBack}>
            Close
          </Button>
          <Button className="gap-2" variant="outline">
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
            <FileText className="h-4 w-4" />
            Print Order
          </Button>
        </div>
      </div>
    </div>
  );
}