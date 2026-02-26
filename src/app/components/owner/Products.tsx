import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Package, BookOpen, Calendar, Layers, Pencil } from 'lucide-react';
import { CreatePhysicalProduct } from './CreatePhysicalProduct';
import { CreateDigitalCourse } from './CreateDigitalCourse';
import { CreateEvent } from './CreateEvent';
import { CreateProgram } from './CreateProgram';
import { EditPhysicalProduct } from './EditPhysicalProduct';
import { EditDigitalCourse } from './EditDigitalCourse';
import { EditEvent } from './EditEvent';
import { EditProgram } from './EditProgram';

// Mock data - extending with required fields for edit forms
const mockPhysicalProducts = [
  { id: 'PRD-001', code: 'WL-100', name: 'Weight Loss Premium Pack', type: 'Product' as const, category: 'Wellness', subCategory: 'Weight Loss', brandName: 'Meera Ayurveda', status: 'Active' as const, launchDate: '2025-06-15', mrp: 5000, cost: 1500, pc: 3250, dp: 3650, rp: 2050, stock: 145, lowStockAlert: 20, ingredientsCount: 83, shelfLife: 24, minOrderQuantity: 1, taxPercent: 18 },
  { id: 'PRD-002', code: 'SC-200', name: 'Skin Care Essentials', type: 'Product' as const, category: 'Personal Care', subCategory: 'Skin Care', brandName: 'Meera Ayurveda', status: 'Active' as const, launchDate: '2025-07-20', mrp: 3500, cost: 1050, pc: 2275, dp: 2555, rp: 1435, stock: 89, lowStockAlert: 15, ingredientsCount: 52, shelfLife: 18, minOrderQuantity: 1, taxPercent: 18 },
  { id: 'PRD-003', code: 'SXC-300', name: 'Sexual Care Complete', type: 'Product' as const, category: 'Personal Care', subCategory: 'Sexual Care', brandName: 'Meera Ayurveda', status: 'Active' as const, launchDate: '2025-08-10', mrp: 4200, cost: 1260, pc: 2730, dp: 3066, rp: 1722, stock: 56, lowStockAlert: 10, ingredientsCount: 67, shelfLife: 24, minOrderQuantity: 1, taxPercent: 18 },
  { id: 'PRD-004', code: 'DC-400', name: 'Diabetes Care Kit', type: 'Product' as const, category: 'Wellness', subCategory: 'Diabetes', brandName: 'Meera Ayurveda', status: 'Active' as const, launchDate: '2025-09-05', mrp: 6500, cost: 1950, pc: 4225, dp: 4745, rp: 2665, stock: 120, lowStockAlert: 25, ingredientsCount: 95, shelfLife: 24, minOrderQuantity: 1, taxPercent: 12 },
  { id: 'PRD-005', code: 'IB-500', name: 'Immunity Booster Pack', type: 'Product' as const, category: 'Wellness', subCategory: 'Immunity', brandName: 'Meera Ayurveda', status: 'Active' as const, launchDate: '2025-10-12', mrp: 2800, cost: 840, pc: 1820, dp: 2044, rp: 1148, stock: 200, lowStockAlert: 30, ingredientsCount: 45, shelfLife: 24, minOrderQuantity: 1, taxPercent: 18 },
];

const mockDigitalCourses = [
  { id: 'CRS-001', courseName: 'Healthy Living Masterclass', name: 'Healthy Living Masterclass', description: 'Comprehensive course on maintaining a healthy lifestyle', thumbnail: 'https://via.placeholder.com/1280x720' },
  { id: 'CRS-002', courseName: 'Weight Management Course', name: 'Weight Management Course', description: 'Learn effective weight management strategies', thumbnail: 'https://via.placeholder.com/1280x720' },
  { id: 'CRS-003', courseName: 'Stress Management Workshop', name: 'Stress Management Workshop', description: 'Master stress management techniques', thumbnail: 'https://via.placeholder.com/1280x720' },
  { id: 'CRS-004', courseName: 'Nutrition Fundamentals', name: 'Nutrition Fundamentals', description: 'Understand the basics of proper nutrition', thumbnail: 'https://via.placeholder.com/1280x720' },
];

const mockEvents = [
  { id: 'EVT-001', eventName: 'Health & Wellness Summit 2026', name: 'Health & Wellness Summit 2026', location: 'Mumbai', date: '2026-05-15' },
  { id: 'EVT-002', eventName: 'Ayurveda Workshop', name: 'Ayurveda Workshop', location: 'Delhi', date: '2026-06-20' },
  { id: 'EVT-003', eventName: 'Fitness Bootcamp', name: 'Fitness Bootcamp', location: 'Bangalore', date: '2026-07-10' },
];

const mockPrograms = [
  { 
    id: 'PGM-001', 
    programName: 'Complete Wellness Package',
    name: 'Complete Wellness Package', 
    description: 'All-inclusive wellness program',
    selectedProducts: ['PRD-001', 'PRD-004', 'PRD-005'],
    selectedCourses: ['CRS-001', 'CRS-004'],
    selectedEvents: ['EVT-001'],
    itemsCount: 6, 
    combinedValue: 22000, 
    programPrice: 18999, 
    value: 22000, 
    price: 18999, 
    status: 'Active' 
  },
  { 
    id: 'PGM-002', 
    programName: 'Weight Loss Mastery',
    name: 'Weight Loss Mastery', 
    description: 'Focused weight management program',
    selectedProducts: ['PRD-001'],
    selectedCourses: ['CRS-002'],
    selectedEvents: ['EVT-003'],
    itemsCount: 3, 
    combinedValue: 9499, 
    programPrice: 7999, 
    value: 9499, 
    price: 7999, 
    status: 'Active' 
  },
];

export function Products() {
  const [openDialog, setOpenDialog] = useState<'physical' | 'course' | 'event' | 'program' | null>(null);
  const [editDialog, setEditDialog] = useState<{ type: 'physical' | 'course' | 'event' | 'program', data: any } | null>(null);

  const closeDialog = () => {
    setOpenDialog(null);
    setEditDialog(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-muted-foreground mt-1">Create and manage your complete product catalog</p>
        </div>
      </div>

      <Tabs defaultValue="physical" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="physical" className="gap-2">
            <Package className="h-4 w-4" />
            Physical Products
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Digital Courses
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="programs" className="gap-2">
            <Layers className="h-4 w-4" />
            Programs
          </TabsTrigger>
        </TabsList>

        {/* Physical Products Tab */}
        <TabsContent value="physical" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openDialog === 'physical'} onOpenChange={(open) => setOpenDialog(open ? 'physical' : null)}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Plus className="h-4 w-4" />
                  Add Physical Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Create New Physical Product</DialogTitle>
                  <DialogDescription>Add a new physical product with comprehensive details</DialogDescription>
                </DialogHeader>
                <CreatePhysicalProduct onSuccess={closeDialog} />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                Physical Products
              </CardTitle>
              <CardDescription>Manage all physical products with pricing and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">MRP</TableHead>
                    <TableHead className="text-right">PP</TableHead>
                    <TableHead className="text-right">DP</TableHead>
                    <TableHead className="text-right">RP</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPhysicalProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">₹{product.mrp.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground">₹{product.pc.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground">₹{product.dp.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">₹{product.rp.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.stock > 100 ? 'bg-green-100 text-green-700' : 
                          product.stock > 50 ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.stock} units
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={editDialog?.type === 'physical' && editDialog?.data?.id === product.id} onOpenChange={(open) => !open && setEditDialog(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditDialog({ type: 'physical', data: product })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
                            <DialogHeader>
                              <DialogTitle>Edit Physical Product</DialogTitle>
                              <DialogDescription>Update product details and pricing</DialogDescription>
                            </DialogHeader>
                            <EditPhysicalProduct product={product} onSuccess={closeDialog} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openDialog === 'course'} onOpenChange={(open) => setOpenDialog(open ? 'course' : null)}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Plus className="h-4 w-4" />
                  Add Digital Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Digital Course</DialogTitle>
                  <DialogDescription>Add a new digital course to your catalog</DialogDescription>
                </DialogHeader>
                <CreateDigitalCourse onSuccess={closeDialog} />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Digital Courses
              </CardTitle>
              <CardDescription>Manage all digital courses and training programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDigitalCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-emerald-600" />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-base">{course.name}</CardTitle>
                          <CardDescription className="text-xs">{course.id}</CardDescription>
                        </div>
                        <Dialog open={editDialog?.type === 'course' && editDialog?.data?.id === course.id} onOpenChange={(open) => !open && setEditDialog(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditDialog({ type: 'course', data: course })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Digital Course</DialogTitle>
                              <DialogDescription>Update course details</DialogDescription>
                            </DialogHeader>
                            <EditDigitalCourse course={course} onSuccess={closeDialog} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openDialog === 'event'} onOpenChange={(open) => setOpenDialog(open ? 'event' : null)}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>Add a new event to your catalog</DialogDescription>
                </DialogHeader>
                <CreateEvent onSuccess={closeDialog} />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Events
              </CardTitle>
              <CardDescription>Manage all events and workshops</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.id}</TableCell>
                      <TableCell>{event.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                          {event.location}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(event.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog open={editDialog?.type === 'event' && editDialog?.data?.id === event.id} onOpenChange={(open) => !open && setEditDialog(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditDialog({ type: 'event', data: event })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Edit Event</DialogTitle>
                              <DialogDescription>Update event details</DialogDescription>
                            </DialogHeader>
                            <EditEvent event={event} onSuccess={closeDialog} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={openDialog === 'program'} onOpenChange={(open) => setOpenDialog(open ? 'program' : null)}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Plus className="h-4 w-4" />
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Create New Program</DialogTitle>
                  <DialogDescription>Create a combo package with products, courses, and events</DialogDescription>
                </DialogHeader>
                <CreateProgram onSuccess={closeDialog} />
              </DialogContent>
            </Dialog>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-600" />
                Programs (Product Combos)
              </CardTitle>
              <CardDescription>Manage bundled packages with multiple products, courses, and events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program ID</TableHead>
                    <TableHead>Program Name</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right">Combined Value</TableHead>
                    <TableHead className="text-right">Program Price</TableHead>
                    <TableHead className="text-right">Savings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPrograms.map((program) => {
                    const savings = program.value - program.price;
                    const savingsPercent = ((savings / program.value) * 100).toFixed(0);
                    
                    return (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.id}</TableCell>
                        <TableCell className="font-semibold">{program.name}</TableCell>
                        <TableCell className="text-center">
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                            {program.itemsCount} items
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground line-through">
                          ₹{program.value.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">
                          ₹{program.price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                            Save {savingsPercent}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            {program.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog open={editDialog?.type === 'program' && editDialog?.data?.id === program.id} onOpenChange={(open) => !open && setEditDialog(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditDialog({ type: 'program', data: program })}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                              <DialogHeader>
                                <DialogTitle>Edit Program</DialogTitle>
                                <DialogDescription>Update program details and items</DialogDescription>
                              </DialogHeader>
                              <EditProgram program={program} onSuccess={closeDialog} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}