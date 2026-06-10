'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCommittees } from '@/hooks/useCommittees';
import { localInputToISO } from '@/lib/utils';
import type { Activity } from '@/types';

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().min(1, 'La fecha de inicio es requerida'),
  end_date: z.string().optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
  committee_ids: z.array(z.string()).min(1, 'Selecciona al menos un comité'),
});

type FormData = z.infer<typeof schema>;

interface ActivityFormProps {
  defaultValues?: Partial<Activity & { committee_ids: string[] }>;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

const statusOptions = [
  { value: 'planned', label: 'Planificada' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
];

export function ActivityForm({ defaultValues, onSubmit, loading }: ActivityFormProps) {
  const { committees } = useCommittees();
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'planned',
      committee_ids: [],
      ...defaultValues,
    },
  });

  const selectedCommittees = watch('committee_ids') ?? [];

  const toggleCommittee = (id: string) => {
    const current = selectedCommittees;
    setValue(
      'committee_ids',
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id]
    );
  };

  // Convertir fechas locales a ISO antes de enviar
  const handleSubmitWithDates = (data: FormData) => {
    return onSubmit({
      ...data,
      start_date: localInputToISO(data.start_date),
      end_date: data.end_date ? localInputToISO(data.end_date) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitWithDates)} className="space-y-5">
      <Input
        label="Nombre de la actividad *"
        placeholder="Ej: Culto de Navidad"
        {...register('name')}
        error={errors.name?.message}
      />

      <Textarea
        label="Descripción"
        placeholder="Detalles de la actividad..."
        {...register('description')}
      />

      <Input
        label="Ubicación"
        placeholder="Ej: Templo principal"
        {...register('location')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Fecha de inicio *"
          type="datetime-local"
          {...register('start_date')}
          error={errors.start_date?.message}
        />
        <Input
          label="Fecha de fin"
          type="datetime-local"
          {...register('end_date')}
        />
      </div>

      <Select
        label="Estado"
        options={statusOptions}
        {...register('status')}
        error={errors.status?.message}
      />

      {/* Selección de comités */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Comités responsables *</label>
        <div className="flex flex-wrap gap-2">
          {committees.map((c) => {
            const selected = selectedCommittees.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCommittee(c.id)}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all"
                style={
                  selected
                    ? { backgroundColor: c.color, color: '#fff', borderColor: c.color }
                    : { borderColor: c.color, color: c.color }
                }
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: selected ? '#fff' : c.color }}
                />
                {c.name}
              </button>
            );
          })}
        </div>
        {errors.committee_ids && (
          <p className="text-xs text-red-500">{errors.committee_ids.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          Guardar actividad
        </Button>
      </div>
    </form>
  );
}
