import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { useDataStore } from '@/store/dataStore';
import { toast } from 'sonner';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Calendar, Mail, Package, DollarSign, Hash, User, Phone, FileText, Ticket } from 'lucide-react';

interface OrderDrawerProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'processing', label: 'Procesando' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export function OrderDrawer({ order, open, onOpenChange }: OrderDrawerProps) {
  const { updateOrder, products, coupons } = useDataStore();
  const [formData, setFormData] = useState({
    productId: '',
    productTitle: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    extraInfo: '',
    couponCode: '' as string | null,
    originalPrice: 0,
    finalPrice: 0,
    status: 'pending' as OrderStatus,
    date: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        productId: order.productId,
        productTitle: order.productTitle,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        extraInfo: order.extraInfo,
        couponCode: order.couponCode,
        originalPrice: order.originalPrice,
        finalPrice: order.finalPrice,
        status: order.status,
        date: order.date,
      });
    }
  }, [order]);

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const discountedPrice = product.price * (1 - product.discountPercentage / 100);
      setFormData({
        ...formData,
        productId,
        productTitle: product.title,
        originalPrice: product.price,
        finalPrice: Number(discountedPrice.toFixed(2)),
      });
    }
  };

  const handleSave = () => {
    if (!order) return;

    updateOrder(order.id, {
      productId: formData.productId,
      productTitle: formData.productTitle,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      extraInfo: formData.extraInfo,
      couponCode: formData.couponCode || null,
      originalPrice: formData.originalPrice,
      finalPrice: formData.finalPrice,
      status: formData.status,
      date: formData.date,
    });

    toast.success('Venta actualizada correctamente');
    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              Venta {order.id}
            </DrawerTitle>
            <DrawerDescription>
              Ver y modificar los detalles de esta venta
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Order ID - Read only */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                ID de Orden
              </Label>
              <Input value={order.id} disabled className="bg-muted" />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre del Cliente
              </Label>
              <Input
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>

            {/* Customer Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email del Cliente
              </Label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                placeholder="cliente@email.com"
              />
            </div>

            {/* Customer Phone */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono
              </Label>
              <Input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="+52 55 1234 5678"
              />
            </div>

            {/* Extra Info */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Información Extra
              </Label>
              <Textarea
                value={formData.extraInfo}
                onChange={(e) => setFormData({ ...formData, extraInfo: e.target.value })}
                placeholder="Notas adicionales sobre el pedido..."
                rows={3}
              />
            </div>

            {/* Coupon */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Cupón Aplicado
              </Label>
              <Select 
                value={formData.couponCode || 'none'} 
                onValueChange={(value) => setFormData({ ...formData, couponCode: value === 'none' ? null : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin cupón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin cupón</SelectItem>
                  {coupons.map((coupon) => (
                    <SelectItem key={coupon.id} value={coupon.code}>
                      {coupon.code} (-{coupon.discountPercentage}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Producto
              </Label>
              <Select value={formData.productId} onValueChange={handleProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Precio Original
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Precio Final
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.finalPrice}
                  onChange={(e) => setFormData({ ...formData, finalPrice: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={option.value} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Status Preview */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Estado actual:</span>
              <StatusBadge status={formData.status} />
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleSave} className="w-full">
              Guardar Cambios
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
