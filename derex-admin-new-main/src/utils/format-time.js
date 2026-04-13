import { enUS } from 'date-fns/locale';
import { sub, format, getTime, formatDistanceToNow } from 'date-fns'; // Ajusta el locale según tu preferencia

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  if (date) {
    let zonedDate = new Date(date);
    zonedDate = sub(zonedDate, { hours: 6 });
    return format(zonedDate, fm, { locale: enUS });
  }

  return '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
