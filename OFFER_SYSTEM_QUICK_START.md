# Offer System - Quick Start Guide

## 🚀 Quick Access

### Test Accounts
```
Business Owner: owner@sthiroot.com (password: any)
Partner:        partner@sthiroot.com (password: any)
Store Owner:    store@sthiroot.com (password: any)
```

### Routes
```
Owner:   /offers
Partner: /partner/my-offers  
Store:   /store/offers
```

## 📊 What's Implemented

### Owner Portal (`/offers`)
1. **Create Offers** - Full form with validation
2. **View All Offers** - Filterable list with stats
3. **Track Progress** - See participant progress
4. **Enable/Disable** - Toggle offer status

### Partner Portal (`/partner/my-offers`)
1. **Active Offers Tab** - Current available offers
2. **Past Offers Tab** - Completed/expired offers
3. **Progress Tracking** - Real-time progress bars
4. **Statistics Dashboard** - Quick overview

### Store Portal (`/store/offers`)
Same as partner portal but with store-specific styling

## 🎯 Offer Types

| Offer On | Description | Initial Count? |
|----------|-------------|----------------|
| **Total Orders** | Number of orders completed | ✅ Yes |
| **Matching RP** | Matching reward points | ✅ Yes |
| **Level** | Hierarchy level achieved | ❌ N/A |
| **Days Since Joining** | Tenure/loyalty days | ❌ N/A |

## 💰 Reward Types

- **Cash**: Monetary bonus (₹)
- **Points**: Bonus RP
- **Discount**: Percentage off next purchase

## 🔄 Initial Count Feature

### ✅ When Enabled (Fresh Start)
```
User had 100 orders → Offer starts → User gets 30 more → Progress: 30/50 (60%)
```

### ❌ When Disabled (Include All)
```
User had 100 orders → Offer starts → User gets 30 more → Progress: 130/50 (100%+ ✓)
```

**Only applies to:** Total Orders & Matching RP

## 📁 Key Files

```
/src/data/mockOfferData.ts              → Mock data
/src/app/components/owner/Offers.tsx    → Owner main page
/src/app/components/owner/CreateOffer.tsx    → Offer creation
/src/app/components/owner/OfferProgress.tsx  → Progress tracking
/src/app/components/partner/MyOffers.tsx     → Partner view
/src/app/components/store/StoreMyOffers.tsx  → Store view
```

## 📋 Sample Mock Data

### 10 Offers Created
- 4 Partner offers
- 2 Employee offers  
- 2 Store offers
- 2 Past/expired offers

### 17 Progress Records
- Amit Kumar: 4 offers (2 completed)
- Deepak Singh: 2 offers (in progress)
- Sunita Patel: 2 offers (in progress)
- Employees: 3 offers (1 completed)
- Stores: 6 offers (2 completed)

## 🎨 UI Features

### Statistics Cards
- Total offers count
- Active offers
- Type breakdown (partner/employee/store)

### Filtering
- Filter by type (partner/employee/store/all)
- Filter by status (active/disabled/expired/all)
- Search by name/description

### Progress View
- Participant list
- Completion percentage
- Visual progress bars
- Status badges
- Baseline values (for initial count)

## 🛠️ Development Tips

### Adding New Offers (Mock)
```typescript
// In /src/data/mockOfferData.ts
export const mockOffers: Offer[] = [
  // Add new offer here
  {
    id: 'OFF-011',
    name: 'Your Offer Name',
    // ... other fields
  }
];
```

### Adding Progress
```typescript
export const mockOfferProgress: OfferProgress[] = [
  // Add progress record
  {
    id: 'PROG-018',
    offerId: 'OFF-011',
    userId: '0502241234',
    // ... other fields
  }
];
```

### Helper Functions Available
```typescript
getActiveOffers(offerFor?: OfferFor)      // Get active offers
getExpiredOffers(offerFor?: OfferFor)     // Get expired offers
getOfferProgress(offerId: string)         // Get all progress for offer
getUserOfferProgress(userId: string)      // Get user's progress
getOfferById(offerId: string)             // Get specific offer
calculateProgress(current, target)         // Calculate percentage
```

## 🎯 Testing Checklist

- [x] Owner can create offers
- [x] Owner can view all offers
- [x] Owner can filter offers
- [x] Owner can view progress
- [x] Owner can enable/disable offers
- [x] Partner can view active offers
- [x] Partner can see their progress
- [x] Partner can view past offers
- [x] Store can view store offers
- [x] Store can track progress
- [x] Progress bars work correctly
- [x] Initial count logic displays correctly
- [x] Statistics calculate correctly
- [x] Responsive design works
- [x] Navigation integrated

## 🔮 Ready for Backend

When connecting to real database:

1. **Replace mock imports** with API calls
2. **Use provided schema** from DATABASE_SCHEMA_OFFERS.md
3. **Implement real-time updates** on order/RP changes
4. **Add WebSocket** for live progress updates
5. **Set up scheduled jobs** for expiry and calculations

## 📱 Responsive Design

- ✅ Mobile-friendly cards
- ✅ Collapsible sidebar
- ✅ Touch-friendly buttons
- ✅ Adaptive grids
- ✅ Bottom sheet modals on mobile

## 🎨 Color Scheme

```css
Owner:     from-emerald-600 to-teal-600
Partners:  from-emerald-600 to-teal-600
Employees: from-purple-600 to-violet-600
Stores:    from-orange-600 to-amber-600

Status:
  Active:    green
  Disabled:  gray
  Expired:   red
  Completed: green
```

## ⚡ Performance Notes

- Progress updates should be real-time via WebSocket
- Cache active offers in memory/Redis
- Use database indexes on offer_id, user_id
- Batch progress calculations for days-since-joining
- Consider pagination for large offer lists

## 🐛 Known Limitations (Mock Data)

1. Progress doesn't update automatically (no real backend)
2. Create offer doesn't persist (no database)
3. Enable/disable is cosmetic (no state persistence)
4. Export functionality is placeholder

These will work once connected to a real backend!

## 📞 Support

For questions about:
- **UI/UX**: Check component files in `/src/app/components/`
- **Data Structure**: Check `/src/data/mockOfferData.ts`
- **Database**: Check `/DATABASE_SCHEMA_OFFERS.md`
- **Integration**: Check `/OFFER_SYSTEM_IMPLEMENTATION.md`

---

**Quick tip:** Login as owner@sthiroot.com to test offer creation, then switch to partner@sthiroot.com to see the partner view! 🎉
