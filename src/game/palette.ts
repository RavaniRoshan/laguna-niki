export interface GamePalette {
  bg: string;
  dot: string;
  grid: string;
  blocks: [string, string, string, string];
  blockEdge: string;
  stitch: string;
  blockTop: string;
  hatch: string;
  ink: string;
  spike: string;
  gem: string;
  key: string;
  doorLocked: string;
  doorOpen: string;
  player: string;
  playerEye: string;
}

export const LIGHT_PALETTE: GamePalette = {
  bg: '#F3F1EC',
  dot: '#D4D0C8',
  grid: 'rgba(176,170,160,0.30)',
  blocks: ['#D9D5CB', '#CFCABF', '#C4BFB3', '#DDD9CF'],
  blockEdge: 'rgba(26,26,26,0.30)',
  stitch: 'rgba(26,26,26,0.22)',
  blockTop: 'rgba(255,255,255,0.65)',
  hatch: 'rgba(26,26,26,0.13)',
  ink: '#26241F',
  spike: '#8A8578',
  gem: '#6B6659',
  key: '#4A463E',
  doorLocked: '#B3AEA1',
  doorOpen: '#7C776C',
  player: '#26241F',
  playerEye: '#F3F1EC',
};

export const DARK_PALETTE: GamePalette = {
  bg: '#1A1915',
  dot: '#34312A',
  grid: 'rgba(150,143,130,0.16)',
  blocks: ['#2A2822', '#24221C', '#1E1D18', '#302E28'],
  blockEdge: 'rgba(0,0,0,0.50)',
  stitch: 'rgba(255,255,255,0.10)',
  blockTop: 'rgba(255,255,255,0.09)',
  hatch: 'rgba(255,255,255,0.05)',
  ink: '#F2EFE8',
  spike: '#736E64',
  gem: '#FF7A43',
  key: '#FFB238',
  doorLocked: '#4A463E',
  doorOpen: '#2F9E5B',
  player: '#FF7A43',
  playerEye: '#1A1915',
};

export interface LevelTint {
  blocks: [string, string, string, string];
  spike: string;
  bg: string;
}

export const LEVEL_TINTS: Record<string, LevelTint> = {
  sand: {
    blocks: ['#E0DACB', '#D6CFBE', '#CBC3B0', '#E4DED0'],
    spike: '#8C846F',
    bg: '#F5F2EA',
  },
  slate: {
    blocks: ['#D5D8DD', '#CACDD4', '#BEC2CA', '#DADDE2'],
    spike: '#7C828C',
    bg: '#F1F3F6',
  },
  sage: {
    blocks: ['#D6DDD1', '#CBD3C5', '#BFC9B9', '#DCE2D7'],
    spike: '#7F8A79',
    bg: '#F1F5EF',
  },
  blush: {
    blocks: ['#E4D7D5', '#DACBC9', '#CFBFBD', '#E8DCDA'],
    spike: '#8E7B79',
    bg: '#F7F1F0',
  },
  clay: {
    blocks: ['#E3D6C8', '#D9CBBB', '#CEBFAE', '#E7DBCF'],
    spike: '#8E7A66',
    bg: '#F6F1E9',
  },
  mist: {
    blocks: ['#D8DBDE', '#CDD1D5', '#C1C6CB', '#DEE1E4'],
    spike: '#7E858B',
    bg: '#F2F4F6',
  },
  moss: {
    blocks: ['#D9DCCE', '#CED2C2', '#C2C7B5', '#DEE1D4'],
    spike: '#83886F',
    bg: '#F4F5EC',
  },
  ink: {
    blocks: ['#D7D6D2', '#CCCBC6', '#C0BFB9', '#DCDBD7'],
    spike: '#82817B',
    bg: '#F3F2EF',
  },
};

export function getEffectivePalette(theme: 'light' | 'dark', tintName?: string): GamePalette {
  const base = theme === 'dark' ? { ...DARK_PALETTE } : { ...LIGHT_PALETTE };
  if (theme === 'light' && tintName && LEVEL_TINTS[tintName]) {
    const tint = LEVEL_TINTS[tintName];
    base.blocks = [...tint.blocks];
    base.spike = tint.spike;
    base.bg = tint.bg;
  }
  return base;
}
