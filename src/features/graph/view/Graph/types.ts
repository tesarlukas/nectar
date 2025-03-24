export interface GraphFileNode {
  id: string;
  name: string;
  location: string;
  color: string;
  references: string[];
  group: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

export interface GraphFileLink {
  source: GraphFileNode | string;
  target: GraphFileNode | string;
}

export interface GraphData {
  nodes: GraphFileNode[];
  links: GraphFileLink[];
}
