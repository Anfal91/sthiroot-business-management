import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { 
  Users, 
  UserPlus, 
  TrendingUp,
  User,
  Plus,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Award,
  X,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { mockNetworkData, type PartnerNode } from '@/data/mockNetworkData';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface NetworkRowProps {
  partner: PartnerNode;
  network: Record<string, PartnerNode>;
  depth: number;
  leg: 'A' | 'B' | null;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onAddToPosition: (parentId: string, leg: 'A' | 'B') => void;
  onViewDetails: (partner: PartnerNode) => void;
}

function NetworkRow({ partner, network, depth, leg, expandedIds, onToggleExpand, onAddToPosition, onViewDetails }: NetworkRowProps) {
  const hasChildren = partner.legA || partner.legB;
  const isExpanded = expandedIds.has(partner.id);
  const indent = depth * 40;

  const hasLegA = partner.legA && network[partner.legA];
  const hasLegB = partner.legB && network[partner.legB];
  const showAddLegA = !partner.legA;
  const showAddLegB = !partner.legB;
  const bothLegsEmpty = !partner.legA && !partner.legB;

  return (
    <>
      {/* Main Partner Row */}
      <div 
        className="flex items-center gap-3 p-4 hover:bg-emerald-50/50 transition-colors border-b border-border/50"
        style={{ paddingLeft: `${indent + 16}px` }}
      >
        {/* Expand/Collapse Button */}
        <div className="w-6 flex-shrink-0">
          {hasChildren && (
            <button
              onClick={() => onToggleExpand(partner.id)}
              className="p-1 hover:bg-emerald-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="size-4 text-emerald-600" />
              ) : (
                <ChevronRight className="size-4 text-emerald-600" />
              )}
            </button>
          )}
        </div>

        {/* Partner Info - Clickable */}
        <div 
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => onViewDetails(partner)}
        >
          <Avatar className="size-10 flex-shrink-0">
            <AvatarFallback className="bg-teal-500 text-white text-xs font-bold">
              {getInitials(partner.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm hover:text-emerald-600 transition-colors">{partner.name}</span>
              {leg && (
                <Badge variant="outline" className={`text-xs ${
                  leg === 'A' 
                    ? 'bg-blue-100 text-blue-700 border-blue-300' 
                    : 'bg-green-100 text-green-700 border-green-300'
                }`}>
                  Leg {leg}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{partner.role}</p>
          </div>
        </div>

        {/* Add Partner Button - Show when both legs are empty */}
        {bothLegsEmpty && (
          <Button
            size="sm"
            onClick={() => onAddToPosition(partner.id, 'A')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 flex-shrink-0"
          >
            <Plus className="size-4 mr-2" />
            Add Partner
          </Button>
        )}
      </div>

      {/* Children - Only show when expanded */}
      {isExpanded && (
        <>
          {/* Leg A - Either partner or add button */}
          {hasLegA && (
            <NetworkRow
              partner={network[partner.legA!]}
              network={network}
              depth={depth + 1}
              leg="A"
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onAddToPosition={onAddToPosition}
              onViewDetails={onViewDetails}
            />
          )}
          {showAddLegA && (
            <div 
              className="flex items-center gap-3 p-3 border-b border-dashed border-blue-300 bg-blue-50/30"
              style={{ paddingLeft: `${(depth + 1) * 40 + 16}px` }}
            >
              <div className="w-6 flex-shrink-0"></div>
              <div className="flex items-center gap-3 flex-1">
                <div className="size-10 rounded-full border-2 border-dashed border-blue-400 bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Plus className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700">Empty Position - Leg A</p>
                  <p className="text-xs text-blue-600">Add a partner to the left leg</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onAddToPosition(partner.id, 'A')}
                className="bg-blue-600 hover:bg-blue-700 flex-shrink-0"
              >
                <Plus className="size-4 mr-2" />
                Add Partner
              </Button>
            </div>
          )}

          {/* Leg B - Either partner or add button */}
          {hasLegB && (
            <NetworkRow
              partner={network[partner.legB!]}
              network={network}
              depth={depth + 1}
              leg="B"
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onAddToPosition={onAddToPosition}
              onViewDetails={onViewDetails}
            />
          )}
          {showAddLegB && (
            <div 
              className="flex items-center gap-3 p-3 border-b border-dashed border-green-300 bg-green-50/30"
              style={{ paddingLeft: `${(depth + 1) * 40 + 16}px` }}
            >
              <div className="w-6 flex-shrink-0"></div>
              <div className="flex items-center gap-3 flex-1">
                <div className="size-10 rounded-full border-2 border-dashed border-green-400 bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Plus className="size-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700">Empty Position - Leg B</p>
                  <p className="text-xs text-green-600">Add a partner to the right leg</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onAddToPosition(partner.id, 'B')}
                className="bg-green-600 hover:bg-green-700 flex-shrink-0"
              >
                <Plus className="size-4 mr-2" />
                Add Partner
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

interface PartnerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerNode | null;
}

function PartnerDetailsModal({ isOpen, onClose, partner }: PartnerDetailsModalProps) {
  if (!partner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="bg-teal-500 text-white font-bold">
                {getInitials(partner.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>{partner.name}</span>
                <Badge className={partner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {partner.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-normal">{partner.role}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            View detailed information, statistics, and hierarchy details for this partner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contact Information */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <User className="size-4 text-emerald-600" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg">
                <Phone className="size-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium truncate">{partner.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 rounded-lg">
                <Mail className="size-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium truncate">{partner.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Partner IDs */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Award className="size-4 text-emerald-600" />
              Partner IDs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Partner ID</p>
                <p className="font-mono text-lg font-bold text-purple-700">{partner.partner_id}</p>
                <p className="text-xs text-purple-600 mt-1">Use for placement search</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Placement ID (PID)</p>
                <p className="font-mono text-sm font-medium">{partner.my_pid}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Sponsored ID (SID)</p>
                <p className="font-mono text-sm font-medium">{partner.my_sid}</p>
              </div>
            </div>
          </div>

          {/* Hierarchy Information */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="size-4 text-emerald-600" />
              Hierarchy Information
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Level</p>
                <p className="text-2xl font-bold text-emerald-600">{partner.level}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Join Date</p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{new Date(partner.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="text-sm font-medium capitalize mt-1">{partner.type}</p>
              </div>
            </div>
          </div>

          {/* RP Statistics */}
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-600" />
              Reward Points (RP) Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Self RP</p>
                <p className="text-xl font-bold text-blue-600">{partner.selfRP.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs text-muted-foreground mb-1">Total RP</p>
                <p className="text-xl font-bold text-emerald-600">{partner.totalRP.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-muted-foreground mb-1">Team RP - Leg A</p>
                <p className="text-xl font-bold text-blue-600">{partner.teamRPA.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">Team RP - Leg B</p>
                <p className="text-xl font-bold text-green-600">{partner.teamRPB.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-muted-foreground mb-1">Matching RP</p>
              <p className="text-xl font-bold text-purple-600">{partner.matchingRP.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Used for commission calculation</p>
            </div>
          </div>

          {/* Downline Status */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Downline Status</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border-2 ${partner.legA ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-dashed border-gray-300'}`}>
                <p className="text-xs text-muted-foreground mb-1">Leg A (Left)</p>
                {partner.legA ? (
                  <p className="text-sm font-medium text-blue-700">✓ Position Filled</p>
                ) : (
                  <p className="text-sm font-medium text-gray-500">○ Empty Position</p>
                )}
              </div>
              <div className={`p-3 rounded-lg border-2 ${partner.legB ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-dashed border-gray-300'}`}>
                <p className="text-xs text-muted-foreground mb-1">Leg B (Right)</p>
                {partner.legB ? (
                  <p className="text-sm font-medium text-green-700">✓ Position Filled</p>
                ) : (
                  <p className="text-sm font-medium text-gray-500">○ Empty Position</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPartner: { id: string; name: string };
  network: Record<string, PartnerNode>;
  preSelectedParent?: string;
  preSelectedLeg?: 'A' | 'B';
}

function AddPartnerModal({ isOpen, onClose, currentPartner, network, preSelectedParent, preSelectedLeg }: AddPartnerModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    placementParentId: '',
    placementParent: currentPartner.id,
    placementLeg: 'A' as 'A' | 'B',
    sponsorId: currentPartner.id,
    password: '',
    confirmPassword: '',
  });

  const [idSearchError, setIdSearchError] = useState('');
  const [aadharFrontPhoto, setAadharFrontPhoto] = useState<File | null>(null);
  const [aadharFrontPreview, setAadharFrontPreview] = useState<string>('');
  const [aadharBackPhoto, setAadharBackPhoto] = useState<File | null>(null);
  const [aadharBackPreview, setAadharBackPreview] = useState<string>('');
  const [panCardPhoto, setPanCardPhoto] = useState<File | null>(null);
  const [panCardPreview, setPanCardPreview] = useState<string>('');

  const handleAadharFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadharFrontPhoto(file);
      setAadharFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleAadharBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAadharBackPhoto(file);
      setAadharBackPreview(URL.createObjectURL(file));
    }
  };

  const handlePanCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPanCardPhoto(file);
      setPanCardPreview(URL.createObjectURL(file));
    }
  };

  const removeAadharFront = () => {
    setAadharFrontPhoto(null);
    setAadharFrontPreview('');
  };

  const removeAadharBack = () => {
    setAadharBackPhoto(null);
    setAadharBackPreview('');
  };

  const removePanCard = () => {
    setPanCardPhoto(null);
    setPanCardPreview('');
  };

  // Auto-fetch parent info when modal opens with preSelectedParent
  useEffect(() => {
    if (isOpen && preSelectedParent) {
      const foundParent = network[preSelectedParent];
      if (foundParent) {
        setFormData({
          ...formData,
          placementParentId: foundParent.id,
          placementParent: foundParent.id,
          placementLeg: preSelectedLeg || (!foundParent.legA ? 'A' : !foundParent.legB ? 'B' : 'A'),
        });
        setIdSearchError('');
        toast.success(`Auto-fetched: ${foundParent.name}`, {
          description: `Preparing to add partner to Leg ${preSelectedLeg || 'A'}`
        });
      }
    } else if (isOpen && !preSelectedParent) {
      // Reset form when opening without preselection
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        placementParentId: '',
        placementParent: currentPartner.id,
        placementLeg: 'A',
        sponsorId: currentPartner.id,
        password: '',
        confirmPassword: '',
      });
      setIdSearchError('');
      setAadharFrontPhoto(null);
      setAadharFrontPreview('');
      setAadharBackPhoto(null);
      setAadharBackPreview('');
      setPanCardPhoto(null);
      setPanCardPreview('');
    }
  }, [isOpen, preSelectedParent, preSelectedLeg]);

  const availableParents = [
    { id: currentPartner.id, name: currentPartner.name },
    ...Object.values(network)
      .filter(p => p.id !== currentPartner.id)
      .map(p => ({ id: p.id, name: p.name }))
  ];

  const selectedParent = formData.placementParent === currentPartner.id 
    ? network[currentPartner.id] || null
    : network[formData.placementParent];
  
  const legAOccupied = selectedParent ? !!selectedParent.legA : false;
  const legBOccupied = selectedParent ? !!selectedParent.legB : false;

  // Handle ID search
  const handleIdSearch = (id: string) => {
    setFormData({ ...formData, placementParentId: id });
    setIdSearchError('');

    if (!id.trim()) {
      setFormData({ ...formData, placementParentId: '', placementParent: currentPartner.id });
      return;
    }

    // Search for partner by Partner ID only
    const foundPartner = Object.values(network).find(p => 
      p.partner_id.toLowerCase() === id.toLowerCase()
    );

    if (foundPartner) {
      setFormData({ 
        ...formData, 
        placementParentId: id,
        placementParent: foundPartner.id,
        placementLeg: !foundPartner.legA ? 'A' : !foundPartner.legB ? 'B' : 'A'
      });
      toast.success(`Found: ${foundPartner.name}`);
    } else {
      setIdSearchError('Partner not found. Please check the Partner ID.');
      setFormData({ ...formData, placementParentId: id, placementParent: currentPartner.id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please enter password and confirm password');
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

    if (formData.placementLeg === 'A' && legAOccupied) {
      toast.error('Leg A is already occupied. Please select Leg B or choose a different parent.');
      return;
    }
    if (formData.placementLeg === 'B' && legBOccupied) {
      toast.error('Leg B is already occupied. Please select Leg A or choose a different parent.');
      return;
    }

    const parentName = availableParents.find(p => p.id === formData.placementParent)?.name;
    toast.success(`Partner ${formData.firstName} ${formData.lastName} added successfully!`, {
      description: `Placed under ${parentName} in Leg ${formData.placementLeg}`
    });
    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      placementParentId: '',
      placementParent: currentPartner.id,
      placementLeg: 'A',
      sponsorId: currentPartner.id,
      password: '',
      confirmPassword: '',
    });
    setIdSearchError('');
    setAadharFrontPhoto(null);
    setAadharFrontPreview('');
    setAadharBackPhoto(null);
    setAadharBackPreview('');
    setPanCardPhoto(null);
    setPanCardPreview('');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Partner</DialogTitle>
          <DialogDescription>
            Onboard a new partner to your network. Select placement parent and leg carefully.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Photos Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Document Photos</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Aadhar Front Photo */}
              <div className="space-y-2">
                <Label>Aadhar Front Photo *</Label>
                {aadharFrontPreview ? (
                  <div className="relative border rounded-lg p-2">
                    <img 
                      src={aadharFrontPreview} 
                      alt="Aadhar Front" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={removeAadharFront}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="partner-aadhar-front"
                      accept="image/*"
                      onChange={handleAadharFrontUpload}
                      className="hidden"
                    />
                    <label htmlFor="partner-aadhar-front" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">Upload Aadhar Front</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Aadhar Back Photo */}
              <div className="space-y-2">
                <Label>Aadhar Back Photo *</Label>
                {aadharBackPreview ? (
                  <div className="relative border rounded-lg p-2">
                    <img 
                      src={aadharBackPreview} 
                      alt="Aadhar Back" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={removeAadharBack}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="partner-aadhar-back"
                      accept="image/*"
                      onChange={handleAadharBackUpload}
                      className="hidden"
                    />
                    <label htmlFor="partner-aadhar-back" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">Upload Aadhar Back</span>
                    </label>
                  </div>
                )}
              </div>

              {/* PAN Card Photo */}
              <div className="space-y-2">
                <Label>PAN Card Photo *</Label>
                {panCardPreview ? (
                  <div className="relative border rounded-lg p-2">
                    <img 
                      src={panCardPreview} 
                      alt="PAN Card" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={removePanCard}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      id="partner-pan-card"
                      accept="image/*"
                      onChange={handlePanCardUpload}
                      className="hidden"
                    />
                    <label htmlFor="partner-pan-card" className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground text-center">Upload PAN Card</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Placement Information</h4>
            
            {/* ID Search Field */}
            <div className="space-y-2">
              <Label htmlFor="placementParentId">Search by Partner ID (Format: DDMMYY + 4 digits)</Label>
              <div className="flex gap-2">
                <Input
                  id="placementParentId"
                  value={formData.placementParentId}
                  onChange={(e) => handleIdSearch(e.target.value)}
                  placeholder="e.g., 0502261234"
                  className={idSearchError ? 'border-red-500' : ''}
                  maxLength={10}
                />
              </div>
              {idSearchError && (
                <p className="text-xs text-red-600">{idSearchError}</p>
              )}
              {selectedParent && formData.placementParentId && !idSearchError && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-teal-500 text-white text-xs font-bold">
                      {getInitials(selectedParent.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">{selectedParent.name}</p>
                    <p className="text-xs text-emerald-600">{selectedParent.role} • Level {selectedParent.level} • ID: {selectedParent.partner_id}</p>
                  </div>
                </div>
              )}
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Dropdown Selection */}
            <div className="space-y-2">
              <Label htmlFor="placementParent">Select from Dropdown</Label>
              <Select 
                value={formData.placementParent} 
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    placementParent: value,
                    placementParentId: value 
                  });
                  setIdSearchError('');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableParents.map(parent => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name} {parent.id === currentPartner.id ? '(You)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show Available Legs */}
            {selectedParent && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-3">Available Positions for {selectedParent.name}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border-2 ${
                    !legAOccupied 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">Leg A</span>
                      {!legAOccupied ? (
                        <Badge className="bg-green-600 text-white text-xs">Available</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                          Occupied
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Left side</p>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${
                    !legBOccupied 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-300 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">Leg B</span>
                      {!legBOccupied ? (
                        <Badge className="bg-green-600 text-white text-xs">Available</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                          Occupied
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Right side</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="placementLeg">Select Placement Leg</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => !legAOccupied && setFormData({ ...formData, placementLeg: 'A' })}
                  disabled={legAOccupied}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.placementLeg === 'A' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-border hover:border-blue-300'
                  } ${legAOccupied ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Leg A</span>
                    {legAOccupied ? (
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                        Occupied
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Available
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-left">Left side placement</p>
                </button>

                <button
                  type="button"
                  onClick={() => !legBOccupied && setFormData({ ...formData, placementLeg: 'B' })}
                  disabled={legBOccupied}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.placementLeg === 'B' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-border hover:border-green-300'
                  } ${legBOccupied ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Leg B</span>
                    {legBOccupied ? (
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                        Occupied
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Available
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-left">Right side placement</p>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> The new partner will be placed under{' '}
                <strong>{availableParents.find(p => p.id === formData.placementParent)?.name}</strong>
                {' '}in <strong>Leg {formData.placementLeg}</strong>. You will be the sponsor.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600">
              <UserPlus className="size-4 mr-2" />
              Add Partner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface MyNetworkProps {
  partnerId: string;
  partnerName: string;
}

export function MyNetwork({ partnerId, partnerName }: MyNetworkProps) {
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerNode | null>(null);
  const [preSelectedParent, setPreSelectedParent] = useState<string | undefined>(undefined);
  const [preSelectedLeg, setPreSelectedLeg] = useState<'A' | 'B' | undefined>(undefined);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([partnerId]));

  const handleAddToPosition = (parentId: string, leg: 'A' | 'B') => {
    const parentNode = mockNetworkData[parentId];
    const parentName = parentNode?.name || partnerName;
    
    setPreSelectedParent(parentId);
    setPreSelectedLeg(leg);
    setShowAddPartnerModal(true);
    
    toast.info(`Adding partner to ${parentName}'s Leg ${leg}`);
  };

  const handleViewDetails = (partner: PartnerNode) => {
    setSelectedPartner(partner);
    setShowDetailsModal(true);
  };

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleExpandAll = () => {
    const allIds = new Set(Object.keys(mockNetworkData));
    setExpandedIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set([partnerId]));
  };

  const allPartners = Object.values(mockNetworkData);
  const totalPartners = allPartners.length;
  
  const countLegPartners = (legRootId: string | null): number => {
    if (!legRootId || !mockNetworkData[legRootId]) return 0;
    let count = 1;
    const node = mockNetworkData[legRootId];
    if (node.legA) count += countLegPartners(node.legA);
    if (node.legB) count += countLegPartners(node.legB);
    return count;
  };
  
  const legAPartners = countLegPartners('deepak_20022024_111');
  const legBPartners = countLegPartners('sunita_22022024_222');
  const totalTeamRP = allPartners.reduce((sum, p) => sum + p.totalRP, 0);

  const rootPartner = mockNetworkData[partnerId];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Network</p>
              <Users className="size-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-emerald-700">{totalPartners}</p>
            <p className="text-xs text-muted-foreground mt-1">Partners in your network</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Leg A Partners</p>
              <User className="size-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-700">{legAPartners}</p>
            <p className="text-xs text-muted-foreground mt-1">Left leg network</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Leg B Partners</p>
              <User className="size-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-700">{legBPartners}</p>
            <p className="text-xs text-muted-foreground mt-1">Right leg network</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Team RP</p>
              <TrendingUp className="size-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-700">{totalTeamRP.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total network RP</p>
          </CardContent>
        </Card>
      </div>

      {/* Network Hierarchy Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="size-5 text-emerald-600" />
              Network Hierarchy
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExpandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={handleCollapseAll}>
                Collapse All
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  setPreSelectedParent(undefined);
                  setPreSelectedLeg(undefined);
                  setShowAddPartnerModal(true);
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                <UserPlus className="size-4 mr-2" />
                Add Partner
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Scrollable Container */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Root Partner */}
              {rootPartner && (
                <div className="bg-emerald-50/50 border-b-2 border-emerald-200">
                  <NetworkRow
                    partner={rootPartner}
                    network={mockNetworkData}
                    depth={0}
                    leg={null}
                    expandedIds={expandedIds}
                    onToggleExpand={handleToggleExpand}
                    onAddToPosition={handleAddToPosition}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              )}

              {totalPartners === 1 && (
                <div className="p-12 text-center text-muted-foreground">
                  <Users className="size-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-lg font-medium">No downline partners yet</p>
                  <p className="text-sm mt-2 mb-6">Start building your network by adding your first partner</p>
                  <Button 
                    onClick={() => setShowAddPartnerModal(true)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600"
                  >
                    <UserPlus className="size-4 mr-2" />
                    Add Your First Partner
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Users className="size-4" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-2 text-blue-900">How to Use Network Hierarchy</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>Expand/Collapse:</strong> Click the arrow icon to view downline partners under any partner</li>
                <li>• <strong>View Details:</strong> Click on partner name to see complete information including RP stats</li>
                <li>• <strong>Add Partners:</strong> Expand a partner to see empty positions, then click "Add Partner" to fill them</li>
                <li>• <strong>Horizontal Scroll:</strong> If the hierarchy is deep, use horizontal scroll to see all information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Details Modal */}
      <PartnerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
      />

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={showAddPartnerModal}
        onClose={() => {
          setShowAddPartnerModal(false);
          setPreSelectedParent(undefined);
          setPreSelectedLeg(undefined);
        }}
        currentPartner={{ id: partnerId, name: partnerName }}
        network={mockNetworkData}
        preSelectedParent={preSelectedParent}
        preSelectedLeg={preSelectedLeg}
      />
    </div>
  );
}