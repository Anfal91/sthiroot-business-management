import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Search, 
  UserPlus, 
  Eye, 
  Phone, 
  Mail, 
  Upload, 
  X, 
  MapPin, 
  CreditCard, 
  ShieldCheck,
  User,
  Briefcase,
  IndianRupee,
  Calendar,
  Lock,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  joinDate: string;
  salary: number;
  status: 'Active' | 'Inactive';
  photo?: string;
  city: string;
  state: string;
  address: string;
  panCard: string;
  aadharCard: string;
  age: number;
  gender: string;
  storeId?: string;
  storeName?: string;
}

interface StoreEmployeesProps {
  isBusinessOwner?: boolean;
}

export function StoreEmployees({ isBusinessOwner = false }: StoreEmployeesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

  // Mock employees data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'EMP-001',
      name: 'Suresh Menon',
      role: 'Store Manager',
      phone: '+91 98765 11111',
      email: 'suresh.menon@sthiroot.com',
      joinDate: '2024-01-15',
      salary: 35000,
      status: 'Active',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '123, MG Road, Andheri West',
      panCard: 'ABCDE1234F',
      aadharCard: '123456789012',
      age: 32,
      gender: 'Male',
      storeId: 'STR-001',
      storeName: 'Mumbai Store - Andheri',
    },
    {
      id: 'EMP-002',
      name: 'Kavita Nair',
      role: 'Sales Executive',
      phone: '+91 98765 22222',
      email: 'kavita.nair@sthiroot.com',
      joinDate: '2024-03-20',
      salary: 22000,
      status: 'Active',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '456, Linking Road, Bandra West',
      panCard: 'BCDEF2345G',
      aadharCard: '234567890123',
      age: 28,
      gender: 'Female',
      storeId: 'STR-001',
      storeName: 'Mumbai Store - Andheri',
    },
    {
      id: 'EMP-003',
      name: 'Ravi Kumar',
      role: 'Stock Keeper',
      phone: '+91 98765 33333',
      email: 'ravi.kumar@sthiroot.com',
      joinDate: '2024-05-10',
      salary: 18000,
      status: 'Active',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '789, SV Road, Malad West',
      panCard: 'CDEFG3456H',
      aadharCard: '345678901234',
      age: 35,
      gender: 'Male',
      storeId: 'STR-002',
      storeName: 'Delhi Store - Connaught Place',
    },
    {
      id: 'EMP-004',
      name: 'Deepa Shah',
      role: 'Cashier',
      phone: '+91 98765 44444',
      email: 'deepa.shah@sthiroot.com',
      joinDate: '2024-06-01',
      salary: 16000,
      status: 'Inactive',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '321, Hill Road, Bandra West',
      panCard: 'DEFGH4567I',
      aadharCard: '456789012345',
      age: 26,
      gender: 'Female',
      storeId: 'STR-001',
      storeName: 'Mumbai Store - Andheri',
    },
    {
      id: 'EMP-005',
      name: 'Anil Verma',
      role: 'Delivery Agent',
      phone: '+91 98765 55555',
      email: 'anil.verma@sthiroot.com',
      joinDate: '2024-07-15',
      salary: 15000,
      status: 'Active',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '654, LBS Marg, Kurla West',
      panCard: 'EFGHI5678J',
      aadharCard: '567890123456',
      age: 30,
      gender: 'Male',
      storeId: 'STR-003',
      storeName: 'Bangalore Store - Koramangala',
    },
    {
      id: 'EMP-006',
      name: 'Meena Patel',
      role: 'Sales Executive',
      phone: '+91 98765 66666',
      email: 'meena.patel@sthiroot.com',
      joinDate: '2024-08-20',
      salary: 22000,
      status: 'Inactive',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '987, Carter Road, Bandra West',
      panCard: 'FGHIJ6789K',
      aadharCard: '678901234567',
      age: 29,
      gender: 'Female',
      storeId: 'STR-002',
      storeName: 'Delhi Store - Connaught Place',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.id.toLowerCase().includes(query) ||
      employee.name.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query) ||
      employee.phone.includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsSheetOpen(true);
  };

  const handleToggleStatus = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' }
        : emp
    ));
    const employee = employees.find(e => e.id === employeeId);
    const newStatus = employee?.status === 'Active' ? 'Inactive' : 'Active';
    toast.success(`Employee ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Store Employees
          </h1>
          <p className="text-muted-foreground mt-1">
            {isBusinessOwner ? 'View and manage all store employees' : 'Manage employees in your store'}
          </p>
        </div>
        {!isBusinessOwner && (
          <Button 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            onClick={() => setIsAddEmployeeOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Employees</p>
          <p className="text-3xl font-bold mt-2">{employees.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-3xl font-bold mt-2 text-emerald-600">
            {employees.filter((e) => e.status === 'Active').length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-3xl font-bold mt-2 text-gray-600">
            {employees.filter((e) => e.status === 'Inactive').length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, Name, Role, Phone, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Employees Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                {isBusinessOwner && <TableHead>Store</TableHead>}
                <TableHead>Contact</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    {isBusinessOwner && (
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{employee.storeName}</p>
                          <p className="text-xs text-muted-foreground">{employee.storeId}</p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {employee.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.joinDate}</TableCell>
                    <TableCell className="font-semibold">₹{employee.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isBusinessOwner ? 9 : 8} className="text-center py-8 text-muted-foreground">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add Employee Dialog */}
      <AddEmployeeDialog 
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSuccess={(newEmployee) => {
          setEmployees(prev => [...prev, newEmployee]);
          setIsAddEmployeeOpen(false);
        }}
      />

      {/* Employee Details Sheet */}
      {selectedEmployee && (
        <EmployeeDetailsSheet
          employee={selectedEmployee}
          isOpen={isDetailsSheetOpen}
          isBusinessOwner={isBusinessOwner}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setSelectedEmployee(null);
          }}
          onToggleStatus={() => handleToggleStatus(selectedEmployee.id)}
          onEdit={() => {
            setIsEditEmployeeOpen(true);
            setIsDetailsSheetOpen(false);
          }}
        />
      )}

      {/* Edit Employee Dialog */}
      {selectedEmployee && (
        <EditEmployeeDialog 
          isOpen={isEditEmployeeOpen}
          employee={selectedEmployee}
          onClose={() => {
            setIsEditEmployeeOpen(false);
            setSelectedEmployee(null);
          }}
          onSuccess={(updatedEmployee) => {
            setEmployees(prev => prev.map(emp => 
              emp.id === updatedEmployee.id ? updatedEmployee : emp
            ));
            setIsEditEmployeeOpen(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
}

// Add Employee Dialog Component
interface AddEmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (employee: Employee) => void;
}

function AddEmployeeDialog({ isOpen, onClose, onSuccess }: AddEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    salary: '',
    city: '',
    state: '',
    address: '',
    panCard: '',
    aadharCard: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.role || !formData.phone || !formData.salary) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    if (formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard.toUpperCase())) {
      toast.error('Invalid PAN Card format');
      return;
    }

    if (formData.aadharCard && !/^\d{12}$/.test(formData.aadharCard)) {
      toast.error('Aadhar Card must be 12 digits');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const newEmployee: Employee = {
      id: `EMP-${Date.now().toString().slice(-3)}`,
      name: formData.name,
      role: formData.role,
      phone: `+91 ${formData.phone.slice(0, 5)} ${formData.phone.slice(5)}`,
      email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@sthiroot.com`,
      joinDate: new Date().toISOString().split('T')[0],
      salary: parseFloat(formData.salary),
      status: 'Active',
      city: formData.city,
      state: formData.state,
      address: formData.address,
      panCard: formData.panCard.toUpperCase(),
      aadharCard: formData.aadharCard,
      age: parseInt(formData.age),
      gender: formData.gender,
      photo: photoPreview,
    };

    toast.success('Employee added successfully!');
    onSuccess(newEmployee);

    // Reset form
    setFormData({
      name: '',
      role: '',
      phone: '',
      salary: '',
      city: '',
      state: '',
      address: '',
      panCard: '',
      aadharCard: '',
      age: '',
      gender: '',
      password: '',
      confirmPassword: '',
    });
    setPhoto(null);
    setPhotoPreview('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Fill in the employee details to add them to your store</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Photo */}
          <div className="space-y-2">
            <Label>Employee Photo</Label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <Avatar className="size-24">
                    <AvatarImage src={photoPreview} />
                    <AvatarFallback>{formData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    id="employee-photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label htmlFor="employee-photo" className="flex items-center gap-2 cursor-pointer">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Photo</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Employee Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                  <SelectItem value="Accountant">Accountant</SelectItem>
                  <SelectItem value="Courier Manager">Courier Manager</SelectItem>
                  <SelectItem value="Stock Manager">Stock Manager</SelectItem>
                  <SelectItem value="Order Manager">Order Manager</SelectItem>
                  <SelectItem value="Dietitian">Dietitian</SelectItem>
                  <SelectItem value="Customer Care Executive">Customer Care Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (Monthly) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="salary"
                  type="number"
                  placeholder="Monthly salary"
                  className="pl-10"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  className="pl-10"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} required>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="City"
                  className="pl-10"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="state"
                  placeholder="State"
                  className="pl-10"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Complete address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PAN Card */}
            <div className="space-y-2">
              <Label htmlFor="panCard">PAN Card *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="panCard"
                  placeholder="ABCDE1234F"
                  className="pl-10 uppercase"
                  value={formData.panCard}
                  onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Aadhar Card */}
            <div className="space-y-2">
              <Label htmlFor="aadharCard">Aadhar Card *</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="aadharCard"
                  type="tel"
                  placeholder="12-digit Aadhar number"
                  className="pl-10"
                  value={formData.aadharCard}
                  onChange={(e) => handleInputChange('aadharCard', e.target.value)}
                  maxLength={12}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Add Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Employee Dialog Component
interface EditEmployeeDialogProps {
  isOpen: boolean;
  employee: Employee;
  onClose: () => void;
  onSuccess: (employee: Employee) => void;
}

function EditEmployeeDialog({ isOpen, employee, onClose, onSuccess }: EditEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: employee.name,
    role: employee.role,
    phone: employee.phone.replace('+91 ', ''),
    salary: employee.salary.toString(),
    city: employee.city,
    state: employee.state,
    address: employee.address,
    panCard: employee.panCard,
    aadharCard: employee.aadharCard,
    age: employee.age.toString(),
    gender: employee.gender,
    password: '',
    confirmPassword: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(employee.photo || '');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.role || !formData.phone || !formData.salary) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    if (formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard.toUpperCase())) {
      toast.error('Invalid PAN Card format');
      return;
    }

    if (formData.aadharCard && !/^\d{12}$/.test(formData.aadharCard)) {
      toast.error('Aadhar Card must be 12 digits');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const updatedEmployee: Employee = {
      id: employee.id,
      name: formData.name,
      role: formData.role,
      phone: `+91 ${formData.phone.slice(0, 5)} ${formData.phone.slice(5)}`,
      email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@sthiroot.com`,
      joinDate: employee.joinDate,
      salary: parseFloat(formData.salary),
      status: employee.status,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      panCard: formData.panCard.toUpperCase(),
      aadharCard: formData.aadharCard,
      age: parseInt(formData.age),
      gender: formData.gender,
      photo: photoPreview,
    };

    toast.success('Employee updated successfully!');
    onSuccess(updatedEmployee);

    // Reset form
    setFormData({
      name: '',
      role: '',
      phone: '',
      salary: '',
      city: '',
      state: '',
      address: '',
      panCard: '',
      aadharCard: '',
      age: '',
      gender: '',
      password: '',
      confirmPassword: '',
    });
    setPhoto(null);
    setPhotoPreview('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>Update the employee details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Photo */}
          <div className="space-y-2">
            <Label>Employee Photo</Label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <Avatar className="size-24">
                    <AvatarImage src={photoPreview} />
                    <AvatarFallback>{formData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    id="employee-photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label htmlFor="employee-photo" className="flex items-center gap-2 cursor-pointer">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Photo</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Employee Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                  <SelectItem value="Accountant">Accountant</SelectItem>
                  <SelectItem value="Courier Manager">Courier Manager</SelectItem>
                  <SelectItem value="Stock Manager">Stock Manager</SelectItem>
                  <SelectItem value="Order Manager">Order Manager</SelectItem>
                  <SelectItem value="Dietitian">Dietitian</SelectItem>
                  <SelectItem value="Customer Care Executive">Customer Care Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (Monthly) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="salary"
                  type="number"
                  placeholder="Monthly salary"
                  className="pl-10"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  className="pl-10"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} required>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="City"
                  className="pl-10"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="state"
                  placeholder="State"
                  className="pl-10"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Complete address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PAN Card */}
            <div className="space-y-2">
              <Label htmlFor="panCard">PAN Card *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="panCard"
                  placeholder="ABCDE1234F"
                  className="pl-10 uppercase"
                  value={formData.panCard}
                  onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Aadhar Card */}
            <div className="space-y-2">
              <Label htmlFor="aadharCard">Aadhar Card *</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="aadharCard"
                  type="tel"
                  placeholder="12-digit Aadhar number"
                  className="pl-10"
                  value={formData.aadharCard}
                  onChange={(e) => handleInputChange('aadharCard', e.target.value)}
                  maxLength={12}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              Update Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Employee Details Sheet Component
interface EmployeeDetailsSheetProps {
  employee: Employee;
  isOpen: boolean;
  isBusinessOwner: boolean;
  onClose: () => void;
  onToggleStatus: () => void;
  onEdit: () => void;
}

function EmployeeDetailsSheet({ employee, isOpen, isBusinessOwner, onClose, onToggleStatus, onEdit }: EmployeeDetailsSheetProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pl-8 pr-6">
        <SheetHeader>
          <SheetTitle>Employee Details</SheetTitle>
          <SheetDescription>View and manage employee information</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Employee Photo and Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar className="size-20">
              {employee.photo && <AvatarImage src={employee.photo} />}
              <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{employee.name}</h3>
              <p className="text-muted-foreground">{employee.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={employee.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                  {employee.status}
                </Badge>
                <Badge variant="outline">{employee.id}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Phone className="size-4 text-emerald-600" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="font-medium">{employee.phone}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="size-4 text-emerald-600" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <Label className="text-xs text-muted-foreground">Age</Label>
                <p className="font-medium">{employee.age} years</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Gender</Label>
                <p className="font-medium">{employee.gender}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Join Date</Label>
                <p className="font-medium">{employee.joinDate}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Salary</Label>
                <p className="font-medium">₹{employee.salary.toLocaleString()}/month</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="size-4 text-emerald-600" />
              Address Information
            </h4>
            <div className="grid grid-cols-1 gap-4 pl-6">
              <div>
                <Label className="text-xs text-muted-foreground">Address</Label>
                <p className="font-medium">{employee.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <p className="font-medium">{employee.city}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">State</Label>
                  <p className="font-medium">{employee.state}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Store Information (for business owner view) */}
          {employee.storeId && employee.storeName && (
            <>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Briefcase className="size-4 text-emerald-600" />
                  Store Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label className="text-xs text-muted-foreground">Store Name</Label>
                    <p className="font-medium">{employee.storeName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Store ID</Label>
                    <p className="font-medium">{employee.storeId}</p>
                  </div>
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Identity Documents */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <CreditCard className="size-4 text-emerald-600" />
              Identity Documents
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <Label className="text-xs text-muted-foreground">PAN Card</Label>
                <p className="font-medium">{employee.panCard}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Aadhar Card</Label>
                <p className="font-medium">{employee.aadharCard}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onToggleStatus}
              variant={employee.status === 'Active' ? 'destructive' : 'default'}
              className={employee.status === 'Inactive' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' : ''}
            >
              {employee.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
            </Button>
            {!isBusinessOwner && (
              <Button
                onClick={onEdit}
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Employee
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}