'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COLORS = ['#14b8a6', '#6366f1', '#f59e0b', '#ec4899', '#0ea5e9', '#84cc16'];

export function RegistrationChart({
  data,
}: {
  data: { label: string; patients: number }[];
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={260}
      role="img"
      aria-label="Bar chart of patient registrations over the last six months"
    >
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip cursor={{ fill: 'currentColor', opacity: 0.06 }} />
        <Bar dataKey="patients" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConditionChart({
  data,
}: {
  data: { name: string; patients: number }[];
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={260}
      role="img"
      aria-label="Pie chart of patients by condition"
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="patients"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SpecializationChart({
  data,
}: {
  data: { name: string; doctors: number }[];
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={220}
      role="img"
      aria-label="Bar chart of doctors by specialization"
    >
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip cursor={{ fill: 'currentColor', opacity: 0.06 }} />
        <Bar dataKey="doctors" fill="#6366f1" radius={[0, 6, 6, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
