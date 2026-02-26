import { CreateOrder as CreateOrderComponent } from '@/app/components/orders/CreateOrder';

export function EmployeeCreateOrder() {
  // In real app, get this from auth context
  const userRole = 'employee';
  const userName = 'Amit Patel';
  const userPhone = '+91 98765 43210';

  return (
    <CreateOrderComponent 
      userRole={userRole}
      userName={userName}
      userPhone={userPhone}
    />
  );
}
