
export interface Graphs {
  mode: string;

  ranks: string[];
  nations: string[];
  classes: string[];

  battlesPerRank: number[];
  kdPerRank: number[];
  wrPerRank: number[];

  battlesPerNation: number[];
  kdPerNation: number[];
  wrPerNation: number[];

  battlesPerClass: number[];
  kdPerClass: number[];
  wrPerClass: number[];
}
