import type { Player } from '../types/player';

const roundToThree = (num: number): number => {
  return Math.round(num * 1000) / 1000;
};

interface SeasonStats {
  PTS: number;
  AST: number;
  TRB: number;
  BLK: number;
  STL: number;
  'eFG%': number;
}

export const calculatePlayerAttributes = (player: Player & { seasonStats: SeasonStats[] }) => {
  if (!player.seasonStats) return [];
  
  const maxValues = {
    pts: 30,
    ast: 10,
    trb: 15,
    defense: 5,
    efficiency: 100
  };

  // Calculate averages across all seasons
  const totalSeasons = player.seasonStats.length || 1;
  const averages = {
    PTS: player.seasonStats.reduce((sum: number, season: SeasonStats) => sum + (season.PTS || 0), 0) / totalSeasons,
    AST: player.seasonStats.reduce((sum: number, season: SeasonStats) => sum + (season.AST || 0), 0) / totalSeasons,
    TRB: player.seasonStats.reduce((sum: number, season: SeasonStats) => sum + (season.TRB || 0), 0) / totalSeasons,
    BLK: player.seasonStats.reduce((sum: number, season: SeasonStats) => sum + (season.BLK || 0), 0) / totalSeasons,
    STL: player.seasonStats.reduce((sum: number, season: SeasonStats) => sum + (season.STL || 0), 0) / totalSeasons,
    'eFG%': player.seasonStats.reduce((sum: number, season: SeasonStats) => sum + (season['eFG%'] || 0), 0) / totalSeasons
  };

  return [
    {
      subject: 'Scoring',
      value: roundToThree((averages.PTS / maxValues.pts) * 100),
      fullMark: 100
    },
    {
      subject: 'Playmaking',
      value: roundToThree((averages.AST / maxValues.ast) * 100),
      fullMark: 100
    },
    {
      subject: 'Rebounding',
      value: roundToThree((averages.TRB / maxValues.trb) * 100),
      fullMark: 100
    },
    {
      subject: 'Defense',
      value: roundToThree((((averages.BLK || 0) + (averages.STL || 0)) / maxValues.defense) * 100),
      fullMark: 100
    },
    {
      subject: 'Efficiency',
      value: roundToThree(averages['eFG%'] || 0),
      fullMark: 100
    }
  ];
}; 