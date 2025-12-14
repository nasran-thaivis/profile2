/**
 * Calculate duration between two dates in years and months
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string, or null for "Present")
 * @returns Formatted duration string like "2 Years 4 Months" or "Present"
 */
export function calculateDuration(
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined
): string {
  if (!startDate) return '';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate === null || endDate === undefined ? new Date() : typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '';
  }

  if (end < start) {
    return '';
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  // Adjust for day difference
  if (end.getDate() < start.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
  }

  if (parts.length === 0) {
    return endDate === null ? 'Present' : 'Less than 1 month';
  }

  return parts.join(' ');
}

/**
 * Format date range as "MMM YYYY - MMM YYYY" or "MMM YYYY - Present"
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string, or null for "Present")
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined
): string {
  if (!startDate) return '';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate === null || endDate === undefined ? null : typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime())) {
    return '';
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const startStr = `${monthNames[start.getMonth()]} ${start.getFullYear()}`;

  if (end === null) {
    return `${startStr} - Present`;
  }

  if (isNaN(end.getTime())) {
    return startStr;
  }

  const endStr = `${monthNames[end.getMonth()]} ${end.getFullYear()}`;
  return `${startStr} - ${endStr}`;
}

/**
 * Format duration in short format: "X yrs Y mos" or "X mos"
 * @param startDate - Start date (Date object or ISO string)
 * @param endDate - End date (Date object or ISO string, or null for "Present")
 * @returns Short format duration string
 */
export function formatDurationShort(
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined
): string {
  if (!startDate) return '';
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate === null || endDate === undefined ? new Date() : typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '';
  }

  if (end < start) {
    return '';
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  // Adjust for day difference
  if (end.getDate() < start.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  }

  if (parts.length === 0) {
    return endDate === null ? 'Present' : '< 1 mo';
  }

  return parts.join(' ');
}

