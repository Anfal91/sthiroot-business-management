import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, TrendingUp, Award, Building2, User, Search, ChevronLeft, ChevronRight as ChevronRightIcon, Filter } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { 
  mockPartnerHierarchy, 
  STORE_OWNER_IDS, 
  mockRPHistory, 
  RP_RATE,
  type PartnerNode,
  type RPHistoryRecord 
} from '@/app/data/mockData';
import { toast } from 'sonner';

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Helper function to get color based on type
function getTypeColor(type: PartnerNode['type']): string {
  switch (type) {
    case 'store_owner':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'partner':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'employee':
      return 'bg-purple-100 text-purple-700 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

// Helper function to get leg badge color
function getLegColor(leg: string): string {
  switch (leg) {
    case 'Leg A':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Leg B':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'Leg C':
      return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'Leg D':
      return 'bg-pink-100 text-pink-700 border-pink-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

// Helper function to determine which leg a person belongs to
function determineLeg(partnerId: string, parentId: string | null, hierarchy: Record<string, PartnerNode>): string | null {
  if (!parentId) return null; // Root level (store owners)
  
  const parent = hierarchy[parentId];
  if (!parent) return null;
  
  if (parent.legA === partnerId) return 'Leg A';
  if (parent.legB === partnerId) return 'Leg B';
  if (parent.legC === partnerId) return 'Leg C';
  if (parent.legD === partnerId) return 'Leg D';
  
  return null;
}

interface HierarchyRowProps {
  partner: PartnerNode;
  hierarchy: Record<string, PartnerNode>;
  depth: number;
  onSelectPartner: (partnerId: string) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

function HierarchyRow({ partner, hierarchy, depth, onSelectPartner, expandedIds, onToggleExpand }: HierarchyRowProps) {
  const hasChildren = partner.legA || partner.legB || partner.legC || partner.legD;
  const isExpanded = expandedIds.has(partner.id);
  
  // Calculate the indent based on depth
  const indent = depth * 40; // 40px per level
  
  // Determine which leg this partner/employee belongs to
  const leg = determineLeg(partner.id, partner.parentId, hierarchy);
  
  // Get sponsor/placement agent names
  const placementAgent = partner.agent_pid ? hierarchy[partner.agent_pid] : null;
  const sponsorAgent = partner.agent_sid ? hierarchy[partner.agent_sid] : null;
  
  return (
    <>
      <div 
        className="flex items-center justify-between gap-4 p-3 hover:bg-emerald-50/50 transition-colors border-b border-border/50 group"
        style={{ paddingLeft: `${indent + 16}px` }}
      >
        {/* Left section: expand button, avatar, name, role, badges */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Expand/Collapse button */}
          <div className="w-5 flex-shrink-0">
            {hasChildren && (
              <button
                onClick={() => onToggleExpand(partner.id)}
                className="p-0.5 hover:bg-emerald-100 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="size-4 text-emerald-600" />
                ) : (
                  <ChevronRight className="size-4 text-emerald-600" />
                )}
              </button>
            )}
          </div>
          
          {/* Avatar */}
          <Avatar className="size-10 flex-shrink-0">
            <AvatarFallback className={`
              text-sm font-semibold
              ${partner.type === 'store_owner' ? 'bg-emerald-100 text-emerald-700' : ''}
              ${partner.type === 'partner' ? 'bg-teal-100 text-teal-700' : ''}
              ${partner.type === 'employee' ? 'bg-blue-100 text-blue-700' : ''}
            `}>
              {getInitials(partner.name)}
            </AvatarFallback>
          </Avatar>
          
          {/* Name and role */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onSelectPartner(partner.id)}
                className="font-semibold text-foreground hover:text-emerald-600 transition-colors text-left"
              >
                {partner.name}
              </button>
              {leg && (
                <Badge variant="outline" className={`text-xs ${getLegColor(leg)}`}>
                  {leg}
                </Badge>
              )}
              <Badge variant="outline" className={`text-xs ${getTypeColor(partner.type)}`}>
                {partner.type === 'store_owner' ? 'Store Owner' : partner.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{partner.role}</p>
            {/* Agent Information */}
            {(placementAgent || sponsorAgent) && (
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                {placementAgent && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-blue-600">P:</span>
                    <span>{placementAgent.name}</span>
                  </div>
                )}
                {sponsorAgent && (
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-purple-600">S:</span>
                    <span>{sponsorAgent.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Right section: commission */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-muted-foreground">Commission</p>
          <p className="font-bold text-emerald-700">₹{(partner.totalRP * RP_RATE).toLocaleString()}</p>
        </div>
      </div>
      
      {/* Children - render recursively if expanded */}
      {isExpanded && hasChildren && (
        <>
          {/* Leg A - Partners */}
          {partner.legA && hierarchy[partner.legA] && (
            <HierarchyRow
              partner={hierarchy[partner.legA]}
              hierarchy={hierarchy}
              depth={depth + 1}
              onSelectPartner={onSelectPartner}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          )}
          
          {/* Leg B - Partners */}
          {partner.legB && hierarchy[partner.legB] && (
            <HierarchyRow
              partner={hierarchy[partner.legB]}
              hierarchy={hierarchy}
              depth={depth + 1}
              onSelectPartner={onSelectPartner}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          )}
          
          {/* Leg C - Employees (Store Owners only) */}
          {partner.legC && hierarchy[partner.legC] && (
            <HierarchyRow
              partner={hierarchy[partner.legC]}
              hierarchy={hierarchy}
              depth={depth + 1}
              onSelectPartner={onSelectPartner}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          )}
          
          {/* Leg D - Employees (Store Owners only) */}
          {partner.legD && hierarchy[partner.legD] && (
            <HierarchyRow
              partner={hierarchy[partner.legD]}
              hierarchy={hierarchy}
              depth={depth + 1}
              onSelectPartner={onSelectPartner}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          )}
        </>
      )}
    </>
  );
}

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  hierarchy: Record<string, PartnerNode>;
}

function GenerateReportModal({ isOpen, onClose, hierarchy }: GenerateReportModalProps) {
  const partners = Object.values(hierarchy);
  const totalPayable = partners.reduce((sum, p) => sum + (p.totalRP * RP_RATE), 0);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Monthly Commission Report - January 2026</DialogTitle>
          <DialogDescription>
            Commission summary for all partners and employees (1 RP = ₹{RP_RATE})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Payable Amount</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    ₹{totalPayable.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total Members</p>
                  <p className="text-2xl font-bold text-emerald-700">{partners.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Partner List */}
          <div className="space-y-2">
            <h4 className="font-semibold">Member-wise Commission</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr className="text-xs">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-right p-3">Self RP</th>
                    <th className="text-right p-3">Matching RP</th>
                    <th className="text-right p-3">Total RP</th>
                    <th className="text-right p-3">Payable (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {partners
                    .sort((a, b) => b.totalRP - a.totalRP)
                    .map((partner) => (
                      <tr key={partner.id} className="border-t hover:bg-muted/50 text-sm">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{partner.name}</p>
                            <p className="text-xs text-muted-foreground">{partner.role}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={`text-xs ${getTypeColor(partner.type)}`}>
                            {partner.type}
                          </Badge>
                        </td>
                        <td className="text-right p-3">{partner.selfRP.toLocaleString()}</td>
                        <td className="text-right p-3">{partner.matchingRP.toLocaleString()}</td>
                        <td className="text-right p-3 font-semibold">{partner.totalRP.toLocaleString()}</td>
                        <td className="text-right p-3 font-bold text-emerald-700">
                          ₹{(partner.totalRP * RP_RATE).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => {
            toast.success('Report exported successfully');
            onClose();
          }}>
            Export as PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FinalizeMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function FinalizeMonthModal({ isOpen, onClose, onConfirm }: FinalizeMonthModalProps) {
  const [confirmText, setConfirmText] = useState('');
  
  const handleConfirm = () => {
    if (confirmText === 'FINALIZE') {
      onConfirm();
      setConfirmText('');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalize Month - January 2026</DialogTitle>
          <DialogDescription>
            This action will reset all RP values to zero. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2">⚠️ Warning: This will reset:</h4>
            <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
              <li>All selfRP values to 0</li>
              <li>All teamRPA values to 0</li>
              <li>All teamRPB values to 0</li>
              <li>All matchingRP values to 0</li>
              <li>All totalRP values to 0</li>
            </ul>
            <p className="text-sm text-amber-800 mt-3 font-medium">
              Current month's data will be saved to history before reset.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm">Type "FINALIZE" to confirm</Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="FINALIZE"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText !== 'FINALIZE'}
          >
            Finalize This Month
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PartnerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerNode | null;
  history: RPHistoryRecord[];
}

function PartnerDetailModal({ isOpen, onClose, partner, history }: PartnerDetailModalProps) {
  if (!partner) return null;
  
  const partnerHistory = history.filter(h => h.partnerId === partner.id);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{partner.name}</DialogTitle>
          <DialogDescription>ID: {partner.id} • {partner.role}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Month Details */}
          <div>
            <h4 className="font-semibold mb-3">Current Month - January 2026</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Self RP</p>
                  <p className="text-xl font-bold text-emerald-700">{partner.selfRP.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Team RP A</p>
                  <p className="text-xl font-bold text-purple-700">{partner.teamRPA.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Team RP B</p>
                  <p className="text-xl font-bold text-orange-700">{partner.teamRPB.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Matching RP</p>
                  <p className="text-xl font-bold text-amber-700">{partner.matchingRP.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Total RP</p>
                  <p className="text-xl font-bold text-blue-700">{partner.totalRP.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Payable</p>
                  <p className="text-xl font-bold text-emerald-700">₹{(partner.totalRP * RP_RATE).toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{partner.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{partner.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Placement ID</p>
                <p className="font-mono text-xs">{partner.my_pid}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sponsor ID</p>
                <p className="font-mono text-xs">{partner.my_sid}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <Badge className={getTypeColor(partner.type)}>{partner.type}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Level</p>
                <Badge variant="outline">L{partner.level}</Badge>
              </div>
            </div>
          </div>
          
          {/* Historical Data */}
          <div>
            <h4 className="font-semibold mb-3">RP History</h4>
            {partnerHistory.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr className="text-xs">
                      <th className="text-left p-3">Month</th>
                      <th className="text-right p-3">Self RP</th>
                      <th className="text-right p-3">Team A</th>
                      <th className="text-right p-3">Team B</th>
                      <th className="text-right p-3">Matching</th>
                      <th className="text-right p-3">Total RP</th>
                      <th className="text-right p-3">Paid (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerHistory.map((record, idx) => (
                      <tr key={idx} className="border-t text-sm">
                        <td className="p-3">{record.month} {record.year}</td>
                        <td className="text-right p-3">{record.selfRP.toLocaleString()}</td>
                        <td className="text-right p-3">{record.teamRPA.toLocaleString()}</td>
                        <td className="text-right p-3">{record.teamRPB.toLocaleString()}</td>
                        <td className="text-right p-3">{record.matchingRP.toLocaleString()}</td>
                        <td className="text-right p-3 font-semibold">{record.totalRP.toLocaleString()}</td>
                        <td className="text-right p-3 font-bold text-emerald-700">
                          ₹{record.payableAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No historical data available</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PartnerHierarchy() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(STORE_OWNER_IDS));
  
  // RP History filters
  const [rpSearchQuery, setRpSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [topPerformerFilter, setTopPerformerFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const selectedPartner = selectedPartnerId ? mockPartnerHierarchy[selectedPartnerId] : null;
  
  const handleFinalize = () => {
    toast.success('Month finalized successfully! All RP values have been reset and saved to history.');
    setShowFinalizeModal(false);
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
    const allIds = new Set(Object.keys(mockPartnerHierarchy));
    setExpandedIds(allIds);
  };
  
  const handleCollapseAll = () => {
    setExpandedIds(new Set(STORE_OWNER_IDS));
  };
  
  // Calculate summary statistics
  const allPartners = Object.values(mockPartnerHierarchy);
  const totalselfRP = allPartners.reduce((sum, p) => sum + p.selfRP, 0);
  const totalmatchingRP = allPartners.reduce((sum, p) => sum + p.matchingRP, 0);
  const totalPayable = allPartners.reduce((sum, p) => sum + (p.totalRP * RP_RATE), 0);
  const activePartners = allPartners.filter(p => p.status === 'Active' && p.type === 'partner').length;
  const storeOwners = allPartners.filter(p => p.type === 'store_owner').length;
  const employees = allPartners.filter(p => p.type === 'employee').length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Partner & Employee Hierarchy
        </h1>
        <p className="text-muted-foreground mt-1">
          Binary tree structure with RP (Business Volume) tracking and commission management
        </p>
      </div>
      
      {/* Monthly Actions */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="size-5 text-emerald-600" />
                January 2026 - Monthly Actions
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Current RP Rate: 1 RP = ₹{RP_RATE} (configurable)
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setShowReportModal(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <TrendingUp className="size-4 mr-2" />
                Generate Report
              </Button>
              <Button 
                onClick={() => setShowFinalizeModal(true)}
                variant="destructive"
              >
                <Award className="size-4 mr-2" />
                Finalize This Month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Store Owners</p>
              <Building2 className="size-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{storeOwners}</p>
          </CardContent>
        </Card>
        
        <Card className="border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Partners</p>
              <Users className="size-4 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-teal-700">{activePartners}</p>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Employees</p>
              <User className="size-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{employees}</p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Total Self RP</p>
              <TrendingUp className="size-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700">{totalselfRP.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Matching RP</p>
              <Award className="size-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-700">{totalmatchingRP.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">Total Payable</p>
              <TrendingUp className="size-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ₹{totalPayable.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for Hierarchy and History */}
      <Tabs defaultValue="hierarchy" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hierarchy">Hierarchy Structure</TabsTrigger>
          <TabsTrigger value="history">RP History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hierarchy" className="space-y-4">
          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, role, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExpandAll}>
                    Expand All
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCollapseAll}>
                    Collapse All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Hierarchy Tree - List View */}
          <Card>
            <CardContent className="p-0">
              <div className="border-b bg-muted/50 p-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="size-5 text-emerald-600" />
                  Hierarchy Structure
                </h3>
              </div>
              <div className="divide-y">
                {STORE_OWNER_IDS.map(ownerId => {
                  const owner = mockPartnerHierarchy[ownerId];
                  if (!owner) return null;
                  
                  return (
                    <HierarchyRow
                      key={owner.id}
                      partner={owner}
                      hierarchy={mockPartnerHierarchy}
                      depth={0}
                      onSelectPartner={setSelectedPartnerId}
                      expandedIds={expandedIds}
                      onToggleExpand={handleToggleExpand}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="font-semibold mb-4 text-lg">Monthly RP History - All Members</h3>
              
              {/* Filters */}
              <div className="flex flex-col gap-4 mb-6">
                {/* Row 1: Search and Month Filter */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or role..."
                      value={rpSearchQuery}
                      onChange={(e) => {
                        setRpSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Select value={monthFilter} onValueChange={(value) => {
                    setMonthFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filter by Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="January 2026">January 2026</SelectItem>
                      <SelectItem value="December 2025">December 2025</SelectItem>
                      <SelectItem value="November 2025">November 2025</SelectItem>
                      <SelectItem value="October 2025">October 2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={topPerformerFilter} onValueChange={(value) => {
                    setTopPerformerFilter(value);
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Performance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="top10">Top 10 Performers</SelectItem>
                      <SelectItem value="top25">Top 25 Performers</SelectItem>
                      <SelectItem value="above5000">Above 5K RP</SelectItem>
                      <SelectItem value="above10000">Above 10K RP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Responsive Table */}
              <div className="border rounded-lg overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr className="text-xs">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Month</th>
                        <th className="text-right p-3">Self RP</th>
                        <th className="text-right p-3">Team A</th>
                        <th className="text-right p-3">Team B</th>
                        <th className="text-right p-3">Matching</th>
                        <th className="text-right p-3">Total RP</th>
                        <th className="text-right p-3">Paid (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Apply filters
                        let filteredHistory = mockRPHistory.filter(record => {
                          const partner = mockPartnerHierarchy[record.partnerId];
                          if (!partner) return false;
                          
                          // Search filter
                          const matchesSearch = rpSearchQuery === '' || 
                            partner.name.toLowerCase().includes(rpSearchQuery.toLowerCase()) ||
                            partner.role.toLowerCase().includes(rpSearchQuery.toLowerCase());
                          
                          // Month filter
                          const monthYear = `${record.month} ${record.year}`;
                          const matchesMonth = monthFilter === 'all' || monthYear === monthFilter;
                          
                          return matchesSearch && matchesMonth;
                        });
                        
                        // Top performer filter (sort by totalRP first)
                        filteredHistory = filteredHistory.sort((a, b) => b.totalRP - a.totalRP);
                        
                        if (topPerformerFilter === 'top10') {
                          filteredHistory = filteredHistory.slice(0, 10);
                        } else if (topPerformerFilter === 'top25') {
                          filteredHistory = filteredHistory.slice(0, 25);
                        } else if (topPerformerFilter === 'above5000') {
                          filteredHistory = filteredHistory.filter(r => r.totalRP > 5000);
                        } else if (topPerformerFilter === 'above10000') {
                          filteredHistory = filteredHistory.filter(r => r.totalRP > 10000);
                        }
                        
                        // Pagination
                        const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
                        
                        if (paginatedHistory.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                No records found matching your filters
                              </td>
                            </tr>
                          );
                        }
                        
                        return (
                          <>
                            {paginatedHistory.map((record, idx) => {
                              const partner = mockPartnerHierarchy[record.partnerId];
                              return (
                                <tr key={idx} className="border-t hover:bg-muted/50 text-sm">
                                  <td className="p-3">
                                    <button
                                      onClick={() => setSelectedPartnerId(record.partnerId)}
                                      className="text-left hover:text-emerald-600 transition-colors"
                                    >
                                      <p className="font-medium">{partner?.name}</p>
                                      <p className="text-xs text-muted-foreground">{partner?.role}</p>
                                    </button>
                                  </td>
                                  <td className="p-3">{record.month} {record.year}</td>
                                  <td className="text-right p-3">{record.selfRP.toLocaleString()}</td>
                                  <td className="text-right p-3">{record.teamRPA.toLocaleString()}</td>
                                  <td className="text-right p-3">{record.teamRPB.toLocaleString()}</td>
                                  <td className="text-right p-3">{record.matchingRP.toLocaleString()}</td>
                                  <td className="text-right p-3 font-semibold">{record.totalRP.toLocaleString()}</td>
                                  <td className="text-right p-3 font-bold text-emerald-700">
                                    ₹{record.payableAmount.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden divide-y">
                  {(() => {
                    // Apply filters (same logic as desktop)
                    let filteredHistory = mockRPHistory.filter(record => {
                      const partner = mockPartnerHierarchy[record.partnerId];
                      if (!partner) return false;
                      
                      const matchesSearch = rpSearchQuery === '' || 
                        partner.name.toLowerCase().includes(rpSearchQuery.toLowerCase()) ||
                        partner.role.toLowerCase().includes(rpSearchQuery.toLowerCase());
                      
                      const monthYear = `${record.month} ${record.year}`;
                      const matchesMonth = monthFilter === 'all' || monthYear === monthFilter;
                      
                      return matchesSearch && matchesMonth;
                    });
                    
                    filteredHistory = filteredHistory.sort((a, b) => b.totalRP - a.totalRP);
                    
                    if (topPerformerFilter === 'top10') {
                      filteredHistory = filteredHistory.slice(0, 10);
                    } else if (topPerformerFilter === 'top25') {
                      filteredHistory = filteredHistory.slice(0, 25);
                    } else if (topPerformerFilter === 'above5000') {
                      filteredHistory = filteredHistory.filter(r => r.totalRP > 5000);
                    } else if (topPerformerFilter === 'above10000') {
                      filteredHistory = filteredHistory.filter(r => r.totalRP > 10000);
                    }
                    
                    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
                    
                    if (paginatedHistory.length === 0) {
                      return (
                        <div className="p-8 text-center text-muted-foreground">
                          No records found matching your filters
                        </div>
                      );
                    }
                    
                    return paginatedHistory.map((record, idx) => {
                      const partner = mockPartnerHierarchy[record.partnerId];
                      return (
                        <div key={idx} className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => setSelectedPartnerId(record.partnerId)}
                              className="text-left hover:text-emerald-600 transition-colors"
                            >
                              <p className="font-semibold">{partner?.name}</p>
                              <p className="text-xs text-muted-foreground">{partner?.role}</p>
                            </button>
                            <Badge variant="outline" className="text-xs">
                              {record.month} {record.year}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Self RP</p>
                              <p className="font-medium">{record.selfRP.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Team A</p>
                              <p className="font-medium">{record.teamRPA.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Team B</p>
                              <p className="font-medium">{record.teamRPB.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Matching</p>
                              <p className="font-medium">{record.matchingRP.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Total RP</p>
                              <p className="font-semibold text-emerald-700">{record.totalRP.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Paid Amount</p>
                              <p className="font-bold text-emerald-700">₹{record.payableAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              
              {/* Pagination */}
              {(() => {
                // Calculate total pages based on current filters
                let filteredHistory = mockRPHistory.filter(record => {
                  const partner = mockPartnerHierarchy[record.partnerId];
                  if (!partner) return false;
                  
                  const matchesSearch = rpSearchQuery === '' || 
                    partner.name.toLowerCase().includes(rpSearchQuery.toLowerCase()) ||
                    partner.role.toLowerCase().includes(rpSearchQuery.toLowerCase());
                  
                  const monthYear = `${record.month} ${record.year}`;
                  const matchesMonth = monthFilter === 'all' || monthYear === monthFilter;
                  
                  return matchesSearch && matchesMonth;
                });
                
                filteredHistory = filteredHistory.sort((a, b) => b.totalRP - a.totalRP);
                
                if (topPerformerFilter === 'top10') {
                  filteredHistory = filteredHistory.slice(0, 10);
                } else if (topPerformerFilter === 'top25') {
                  filteredHistory = filteredHistory.slice(0, 25);
                } else if (topPerformerFilter === 'above5000') {
                  filteredHistory = filteredHistory.filter(r => r.totalRP > 5000);
                } else if (topPerformerFilter === 'above10000') {
                  filteredHistory = filteredHistory.filter(r => r.totalRP > 10000);
                }
                
                const totalItems = filteredHistory.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                
                if (totalItems === 0) return null;
                
                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} records
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? 'default' : 'outline'}
                              size="sm"
                              className="w-9 h-9 p-0"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <GenerateReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        hierarchy={mockPartnerHierarchy}
      />
      
      <FinalizeMonthModal 
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={handleFinalize}
      />
      
      <PartnerDetailModal 
        isOpen={!!selectedPartnerId}
        onClose={() => setSelectedPartnerId(null)}
        partner={selectedPartner}
        history={mockRPHistory}
      />
    </div>
  );
}