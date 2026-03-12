const PATHS = {
  home:     'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  clock:    'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l4 2',
  calendar: 'M3 4h18v18H3V4zm0 6h18 M8 2v4 M16 2v4',
  users:    'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  chart:    'M18 20V10 M12 20V4 M6 20v-6',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  logout:   'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  user:     'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  check:    'M20 6L9 17l-5-5',
  x:        'M18 6L6 18 M6 6l12 12',
  report:   'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  sun:      'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z',
  chevron:  'M6 9l6 6 6-6',
  search:   'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z',
  menu:     'M3 12h18 M3 6h18 M3 18h18',
  building: 'M3 21h18 M3 7l9-4 9 4v14H3V7z M9 21V9h6v12',
};

export default function Icon({ name, size = 18, color = 'currentColor', style = {} }) {
  const d = PATHS[name] || '';
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
    >
      <path d={d} />
    </svg>
  );
}
