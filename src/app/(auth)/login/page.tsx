'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Church } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Bienvenido de nuevo');
    } catch {
      toast.error('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <Church className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">GestiónIPUC</h1>
          <p className="text-indigo-200 mt-1">Sistema de gestión de actividades</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="correo@iglesia.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" loading={loading} className="w-full mt-6" size="lg">
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
