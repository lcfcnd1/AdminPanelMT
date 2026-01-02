import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Order } from '@/types';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { OrderDrawer } from '@/components/orders/OrderDrawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Clock, CheckCircle } from 'lucide-react';

export default function Orders() {
  const { orders } = useDataStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processingOrders = orders.filter(o => o.status === 'processing');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.finalPrice, 0);

  const stats = [
    {
      title: 'Total Ventas',
      value: orders.length,
      icon: ShoppingCart,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Ingresos',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Pendientes',
      value: pendingOrders.length,
      icon: Clock,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Completadas',
      value: completedOrders.length,
      icon: CheckCircle,
      color: 'bg-success/10 text-success',
    },
  ];

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (order: Order) => (
        <span className="font-mono text-sm text-foreground">{order.id}</span>
      ),
    },
    {
      key: 'date',
      label: 'Fecha',
      render: (order: Order) => (
        <span className="text-muted-foreground">{order.date}</span>
      ),
    },
    {
      key: 'productTitle',
      label: 'Producto',
      render: (order: Order) => (
        <span className="font-medium text-foreground">{order.productTitle}</span>
      ),
    },
    {
      key: 'customerEmail',
      label: 'Cliente',
      render: (order: Order) => (
        <span className="text-muted-foreground">{order.customerEmail}</span>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      render: (order: Order) => (
        <div>
          {order.originalPrice !== order.finalPrice && (
            <span className="text-xs text-muted-foreground line-through mr-2">
              ${order.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="font-semibold text-foreground">${order.finalPrice.toFixed(2)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (order: Order) => (
        <StatusBadge status={order.status} />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Ventas / Pedidos</h2>
        <p className="text-muted-foreground">Historial de ventas y pedidos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Buscar pedidos..."
        searchKeys={['id', 'productTitle', 'customerEmail']}
        emptyMessage="No hay ventas registradas."
        onRowClick={handleRowClick}
      />

      <OrderDrawer
        order={selectedOrder}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
