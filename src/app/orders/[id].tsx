import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { OrderTrackingScreen } from '@/screens/orders/OrderTrackingScreen';

export default function OrderTrackingRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <OrderTrackingScreen orderId={id as string} />;
}
