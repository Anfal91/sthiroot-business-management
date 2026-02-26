import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { 
  UserPlus, 
  Search, 
  Phone, 
  Mail,
  Calendar,
  TrendingUp,
  MapPin,
  Award,
  User
} from 'lucide-react';

interface SponsoredPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  totalRP: number;
  currentMonthRP: number;
  totalEarnings: number;
  networkSize: number;
  role: string;
  location: string;
  my_sid: string;
  placementParent: string;
  placementLeg: 'A' | 'B';
}

// Mock sponsored partners data
const mockSponsoredPartners: SponsoredPartner[] = [
  {
    id: 'deepak_20022024_111',
    name: 'Deepak Joshi',
    email: 'deepak.joshi@example.com',
    phone: '+91 98765 43217',
    joinDate: '2024-02-20',
    status: 'Active',
    totalRP: 2850,
    currentMonthRP: 500,
    totalEarnings: 14250,
    networkSize: 5,
    role: 'Sales Executive',
    location: 'Mumbai, Maharashtra',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'amit_05022024_234',
    placementLeg: 'A',
  },
  {
    id: 'sunita_22022024_222',
    name: 'Sunita Rao',
    email: 'sunita.rao@example.com',
    phone: '+91 98765 43218',
    joinDate: '2024-02-22',
    status: 'Active',
    totalRP: 2100,
    currentMonthRP: 500,
    totalEarnings: 10500,
    networkSize: 3,
    role: 'Sales Executive',
    location: 'Pune, Maharashtra',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'amit_05022024_234',
    placementLeg: 'B',
  },
  {
    id: 'rahul_05032024_333',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 98765 43219',
    joinDate: '2024-03-05',
    status: 'Active',
    totalRP: 3200,
    currentMonthRP: 650,
    totalEarnings: 16000,
    networkSize: 8,
    role: 'Regional Manager',
    location: 'Delhi, NCR',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'deepak_20022024_111',
    placementLeg: 'A',
  },
  {
    id: 'kavita_12032024_444',
    name: 'Kavita Singh',
    email: 'kavita.singh@example.com',
    phone: '+91 98765 43220',
    joinDate: '2024-03-12',
    status: 'Active',
    totalRP: 1850,
    currentMonthRP: 400,
    totalEarnings: 9250,
    networkSize: 2,
    role: 'Sales Executive',
    location: 'Bangalore, Karnataka',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'sunita_22022024_222',
    placementLeg: 'A',
  },
  {
    id: 'arjun_20032024_555',
    name: 'Arjun Nair',
    email: 'arjun.nair@example.com',
    phone: '+91 98765 43221',
    joinDate: '2024-03-20',
    status: 'Active',
    totalRP: 2650,
    currentMonthRP: 550,
    totalEarnings: 13250,
    networkSize: 6,
    role: 'Sales Executive',
    location: 'Chennai, Tamil Nadu',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'deepak_20022024_111',
    placementLeg: 'B',
  },
  {
    id: 'priya_28032024_666',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43222',
    joinDate: '2024-03-28',
    status: 'Inactive',
    totalRP: 950,
    currentMonthRP: 0,
    totalEarnings: 4750,
    networkSize: 1,
    role: 'Sales Executive',
    location: 'Hyderabad, Telangana',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'sunita_22022024_222',
    placementLeg: 'B',
  },
  {
    id: 'mohit_05042024_777',
    name: 'Mohit Patel',
    email: 'mohit.patel@example.com',
    phone: '+91 98765 43223',
    joinDate: '2024-04-05',
    status: 'Active',
    totalRP: 1750,
    currentMonthRP: 350,
    totalEarnings: 8750,
    networkSize: 4,
    role: 'Sales Executive',
    location: 'Ahmedabad, Gujarat',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'rahul_05032024_333',
    placementLeg: 'A',
  },
  {
    id: 'neha_15042024_888',
    name: 'Neha Desai',
    email: 'neha.desai@example.com',
    phone: '+91 98765 43224',
    joinDate: '2024-04-15',
    status: 'Active',
    totalRP: 2250,
    currentMonthRP: 480,
    totalEarnings: 11250,
    networkSize: 3,
    role: 'Sales Executive',
    location: 'Kolkata, West Bengal',
    my_sid: 'amit_05022024_234_s',
    placementParent: 'kavita_12032024_444',
    placementLeg: 'A',
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getStatusColor(status: SponsoredPartner['status']) {
  return status === 'Active'
    ? 'bg-green-100 text-green-700 border-green-300'
    : 'bg-gray-100 text-gray-700 border-gray-300';
}

interface SponsoredPartnersProps {
  partnerId: string;
}

export function SponsoredPartners({ partnerId }: SponsoredPartnersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('join-date');

  // Calculate summary statistics
  const totalSponsored = mockSponsoredPartners.length;
  const activeSponsored = mockSponsoredPartners.filter(p => p.status === 'Active').length;
  const totalNetworkSize = mockSponsoredPartners.reduce((sum, p) => sum + p.networkSize, 0);
  const totalTeamRP = mockSponsoredPartners.reduce((sum, p) => sum + p.totalRP, 0);

  // Filter and sort
  let filteredPartners = mockSponsoredPartners.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.phone.includes(searchQuery) ||
      partner.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort
  filteredPartners = filteredPartners.sort((a, b) => {
    switch (sortBy) {
      case 'join-date':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      case 'rp':
        return b.totalRP - a.totalRP;
      case 'earnings':
        return b.totalEarnings - a.totalEarnings;
      case 'network':
        return b.networkSize - a.networkSize;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Sponsored</p>
              <UserPlus className="size-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {totalSponsored}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Direct sponsorships</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Partners</p>
              <User className="size-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-700">
              {activeSponsored}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Network</p>
              <Award className="size-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-700">
              {totalNetworkSize}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Indirect downlines</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Team RP</p>
              <TrendingUp className="size-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-700">
              {totalTeamRP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total sponsored RP</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-emerald-600" />
            Sponsored Partners
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="join-date">Join Date (Latest)</SelectItem>
                <SelectItem value="rp">Total RP (Highest)</SelectItem>
                <SelectItem value="earnings">Earnings (Highest)</SelectItem>
                <SelectItem value="network">Network Size</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Partners Grid */}
          {filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="size-12 flex-shrink-0">
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-sm font-semibold">
                          {getInitials(partner.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{partner.name}</h4>
                        <p className="text-xs text-muted-foreground">{partner.role}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${getStatusColor(partner.status)}`}
                        >
                          {partner.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="size-3 flex-shrink-0" />
                        <span className="truncate">{partner.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="size-3 flex-shrink-0" />
                        <span>{partner.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="size-3 flex-shrink-0" />
                        <span className="truncate">{partner.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3 flex-shrink-0" />
                        <span>
                          Joined {new Date(partner.joinDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Total RP</p>
                        <p className="font-bold text-emerald-700">{partner.totalRP.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">This Month</p>
                        <p className="font-bold text-teal-700">{partner.currentMonthRP.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                        <p className="font-bold text-purple-700">₹{partner.totalEarnings.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Network</p>
                        <p className="font-bold text-blue-700">{partner.networkSize}</p>
                      </div>
                    </div>

                    {/* Placement Info */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Placement:</span>
                        <Badge variant="outline" className={`
                          ${partner.placementLeg === 'A' 
                            ? 'bg-blue-100 text-blue-700 border-blue-300' 
                            : 'bg-green-100 text-green-700 border-green-300'
                          }
                        `}>
                          Leg {partner.placementLeg}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground border rounded-lg">
              <UserPlus className="size-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No sponsored partners found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Results Summary */}
          {filteredPartners.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <p>Showing {filteredPartners.length} partner{filteredPartners.length !== 1 ? 's' : ''}</p>
              <p>
                Total RP: <span className="font-bold text-emerald-700">
                  {filteredPartners.reduce((sum, p) => sum + p.totalRP, 0).toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
