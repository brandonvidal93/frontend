'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import type { Committee } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hex inválido'),
});

type FormData = z.infer<typeof schema>;

const PRESET_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
  '#F97316', '#EAB308', '#22C55E', '#14B8A6',
  '#3B82F6', '#06B6D4', '#84CC16', '#78716C',
];

interface CommitteeFormProps {
  defaultValues?: Partial<Committee>;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

export function CommitteeForm({ defaultValues, onSubmit, loading }: CommitteeFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { color: '#6366F1', ...defaultValues },
  });

  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Nombre del comité *"
        placeholder="Ej: Comité de Jóvenes"
        {...register('name')}
        error={errors.name?.message}
      />

      <Textarea
        label="Descripción"
        placeholder="¿De qué se encarga este comité?"
        {...register('description')}
      />

      {/* Color picker */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Color del comité</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: selectedColor === color ? '#1e293b' : 'transparent',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="h-9 w-9 rounded-lg border" style={{ backgroundColor: selectedColor }} />
          <Input
            placeholder="#6366F1"
            {...register('color')}
            error={errors.color?.message}
            className="max-w-[130px]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading}>
          Guardar comité
        </Button>
      </div>
    </form>
  );
}
