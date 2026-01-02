import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Eye, EyeOff, Save, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSettings() {
  const { toast } = useToast();
  const { paymentSettings, setPaymentSettings } = useDataStore();
  
  const [formData, setFormData] = useState({
    mercadoPagoPublicKey: paymentSettings.mercadoPagoPublicKey,
    mercadoPagoAccessToken: paymentSettings.mercadoPagoAccessToken,
  });
  
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPaymentSettings(formData);
    
    toast({
      title: 'Configuración guardada',
      description: 'Los datos de MercadoPago se guardaron correctamente.',
    });
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configuración de Pagos</h2>
        <p className="text-muted-foreground">Configura las credenciales de MercadoPago</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CreditCard size={24} />
            </div>
            <div>
              <CardTitle>MercadoPago</CardTitle>
              <CardDescription>Credenciales de integración</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-3">
              <AlertTriangle className="text-warning mt-0.5" size={20} />
              <div className="text-sm">
                <p className="font-medium text-foreground">Importante</p>
                <p className="text-muted-foreground">
                  Estos valores se guardarán localmente. En producción, deberán almacenarse de forma segura en la base de datos.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publicKey">Public Key</Label>
                <div className="relative">
                  <Input
                    id="publicKey"
                    type={showPublicKey ? 'text' : 'password'}
                    value={formData.mercadoPagoPublicKey}
                    onChange={(e) => setFormData({ ...formData, mercadoPagoPublicKey: e.target.value })}
                    placeholder="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPublicKey(!showPublicKey)}
                  >
                    {showPublicKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Se utiliza en el frontend para inicializar el SDK de MercadoPago.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <div className="relative">
                  <Input
                    id="accessToken"
                    type={showAccessToken ? 'text' : 'password'}
                    value={formData.mercadoPagoAccessToken}
                    onChange={(e) => setFormData({ ...formData, mercadoPagoAccessToken: e.target.value })}
                    placeholder="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowAccessToken(!showAccessToken)}
                  >
                    {showAccessToken ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Se utiliza en el backend para procesar pagos. Nunca expongas este valor en el frontend.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
