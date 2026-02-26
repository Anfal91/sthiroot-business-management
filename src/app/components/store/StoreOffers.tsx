import { useState } from 'react';
import { Offers } from '../owner/Offers';
import { useAuth } from '../../contexts/AuthContext';

export function StoreOffers() {
  const { user } = useAuth();
  const storeId = user?.storeId || 'S001';

  return <Offers isStoreOwner={true} storeId={storeId} />;
}