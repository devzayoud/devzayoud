export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  category: string;
  favorite: boolean;
  epg?: EPGProgram[];
}

export interface EPGProgram {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  category: string;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  channels: Channel[];
  lastUpdated: Date;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  autoplay: boolean;
  volume: number;
  quality: 'auto' | 'high' | 'medium' | 'low';
  showEPG: boolean;
  gridSize: 'small' | 'medium' | 'large';
  layoutMode: 'grid' | 'list';
  language: string;
  player: 'default' | 'vlc' | 'mx';
  streamFormat: 'hls' | 'mpeg-ts';
  timeFormat: '12h' | '24h';
  deviceType: 'tv' | 'mobile';
  subtitles: {
    enabled: boolean;
    language: string;
    fontSize: 'small' | 'medium' | 'large';
    color: string;
    backgroundColor: string;
    position: 'top' | 'center' | 'bottom';
  };
  parentalControl: {
    enabled: boolean;
    pin: string;
    lockedCategories: string[];
  };
  hiddenCategories?: {
    live: string[];
    vod: string[];
    series: string[];
  };
  automaticUpdate: {
    enabled: boolean;
    frequency: 'startup' | 'daily' | 'every2days';
    lastUpdate: Date | null;
  };
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  rtl?: boolean;
}

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}
export interface ViewMode {
  type: 'grid' | 'list' | 'compact';
  size: 'small' | 'medium' | 'large';
}