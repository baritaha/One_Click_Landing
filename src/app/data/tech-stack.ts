import { LOGO_PATHS, type LogoKey } from './logo-paths';

export interface TechLogo {
  /** Shown next to the mark, so nothing depends on recognising a glyph. */
  name: string;
  logo: LogoKey;
  /** For marks that are already wordmarks — the name would read twice. */
  markIsWordmark?: boolean;
}

/**
 * The stack we actually build on, shown in the strip under the hero.
 * AWS, Azure and SQL Server are not in Simple Icons, so they use the neutral
 * cloud / database glyphs rather than an imitation of a trademarked mark.
 */
export const TECH_STACK: readonly TechLogo[] = [
  { name: 'Angular', logo: 'angular' },
  { name: '.NET', logo: 'dotnet', markIsWordmark: true },
  { name: 'React', logo: 'react' },
  { name: 'React Native', logo: 'react' },
  { name: 'Laravel', logo: 'laravel' },
  { name: 'Node.js', logo: 'node' },
  { name: 'Flutter', logo: 'flutter' },
  { name: 'PostgreSQL', logo: 'postgresql' },
  { name: 'SQL Server', logo: 'database' },
  { name: 'Docker', logo: 'docker' },
  { name: 'AWS', logo: 'cloud' },
  { name: 'Azure', logo: 'cloudChevron' },
];

export const logoPath = (key: LogoKey): string => LOGO_PATHS[key];
