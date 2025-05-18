export interface Player {
  playerId: number;
  name: string;
  currentTeam?: string;
  position?: string;
  height?: number;
  weight?: number;
  headshot?: string;
  seasonStats?: Record<string, number>;
  measurements?: Record<string, number>;
  scoutRankings?: {
    'ESPN Rank'?: number;
    'Sam Vecenie Rank'?: number;
    'Kevin O\'Connor Rank'?: number;
    'Kyle Boone Rank'?: number;
    'Gary Parrish Rank'?: number;
  };
  league?: string;
  leagueType?: string;
} 