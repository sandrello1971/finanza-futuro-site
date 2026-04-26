export const TARGET_META = {
  'dirigenti': { label: 'Dirigenti', classes: 'bg-emerald-100 text-emerald-700' },
  'post-exit': { label: 'Post-Exit', classes: 'bg-amber-100 text-amber-700' },
  'famiglie-hnwi': { label: 'Famiglie HNWI', classes: 'bg-violet-100 text-violet-700' },
  'generale': { label: 'Generale', classes: 'bg-slate-100 text-slate-700' },
} as const;

export type TargetKey = keyof typeof TARGET_META;

export const TARGET_PAGE: Record<TargetKey, string> = {
  'dirigenti': '/dirigenti',
  'post-exit': '/post-exit',
  'famiglie-hnwi': '/famiglie-hnwi',
  'generale': '/',
};
