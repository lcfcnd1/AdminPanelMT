import { useDataStore } from '@/store/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderTree, Ticket, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { products, categories, coupons, orders } = useDataStore();

  const stats = [
    {
      title: 'Productos',
      value: products.length,
      description: `${products.filter(p => p.isActive).length} activos`,
      icon: Package,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Categorías',
      value: categories.length,
      description: `${categories.filter(c => c.isActive).length} activas`,
      icon: FolderTree,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Cupones',
      value: coupons.length,
      description: `${coupons.filter(c => c.isActive).length} activos`,
      icon: Ticket,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Ventas',
      value: orders.length,
      description: `${orders.filter(o => o.status === 'completed').length} completadas`,
      icon: ShoppingCart,
      color: 'bg-destructive/10 text-destructive',
    },
  ];

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.finalPrice, 0);

  const featuredProducts = products.filter(p => p.isFeatured).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bienvenido al Panel</h2>
        <p className="text-muted-foreground">Resumen general de tu tienda</p>
      </div>

      {/* Main Stats */}
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
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <DollarSign size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">De ventas completadas</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Productos Destacados
            </CardTitle>
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <TrendingUp size={20} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredProducts}</div>
            <p className="text-xs text-muted-foreground">Marcados como destacados</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.productTitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${order.finalPrice.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
