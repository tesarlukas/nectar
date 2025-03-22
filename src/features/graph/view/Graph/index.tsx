import { useState, useCallback, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useGraphView } from "./hooks/useGraphView";

// TypeScript interfaces
interface GraphFileNode {
  id: string;
  color: string;
  group: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface GraphFileLink {
  source: string | GraphFileNode;
  target: string | GraphFileNode;
}

interface GraphData {
  nodes: GraphFileNode[];
  links: GraphFileLink[];
}

interface FileTypeColors {
  [key: string]: string;
}

export const GraphView = () => {
  const { notesNode } = useGraphView();
  console.log("notesNode", notesNode);
  // File type to color mapping using theme chart colors
  const fileTypeColors: FileTypeColors = {
    js: "#ffff00",
    ts: "var(--chart-1)",
    css: "var(--chart-2)",
    html: "var(--chart-3)",
    json: "var(--chart-4)",
    txt: "var(--chart-5)",
    md: "var(--accent)",
    other: "var(--muted)",
  };

  // Graph data state
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [
      { id: "index.js", color: fileTypeColors.js, group: "js" },
      { id: "styles.css", color: fileTypeColors.css, group: "css" },
      { id: "App.js", color: fileTypeColors.js, group: "js" },
      { id: "utils.js", color: fileTypeColors.js, group: "js" },
      { id: "data.json", color: fileTypeColors.json, group: "json" },
    ],
    links: [
      { source: "App.js", target: "styles.css" },
      { source: "App.js", target: "utils.js" },
      { source: "utils.js", target: "data.json" },
    ],
  });

  // For keeping track of selected nodes/links
  const [selectedNode, setSelectedNode] = useState<GraphFileNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphFileLink | null>(null);

  // For new node creation
  const [newNodeName, setNewNodeName] = useState<string>("");
  const [newNodeType, setNewNodeType] = useState<string>("js");

  // For new link creation
  const [linkSource, setLinkSource] = useState<string>("");
  const [linkTarget, setLinkTarget] = useState<string>("");

  // Reference to the graph component
  const graphRef = useRef<any>(null);

  // Get color based on file extension
  const getNodeColor = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase() || "other";
    return (
      fileTypeColors[extension as keyof FileTypeColors] || fileTypeColors.other
    );
  };

  // Handle node click
  const handleNodeClick = useCallback((node: GraphFileNode) => {
    setSelectedNode(node);
    setSelectedLink(null);
  }, []);

  // Handle link click
  const handleLinkClick = useCallback((link: GraphFileLink) => {
    setSelectedLink(link);
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-background p-4 border-b">
        <h1 className="text-2xl font-bold mb-4">File Relationship Graph</h1>
      </div>

      {/* Graph Visualization */}
      <div className="flex-grow bg-primary-background">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="id"
          nodeColor={(node: GraphFileNode) => node.color}
          nodeRelSize={8}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          linkColor={() => "#ff0ff0"}
          onNodeClick={handleNodeClick}
          onLinkClick={handleLinkClick}
          cooldownTicks={100}
          linkWidth={(link: GraphFileLink) => (selectedLink === link ? 3 : 1)}
          backgroundColor="var(--primary-background)"
          nodeCanvasObjectMode={() => "after"}
          nodeCanvasObject={(
            node: GraphFileNode,
            ctx: CanvasRenderingContext2D,
            globalScale: number,
          ) => {
            const label = node.id;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2,
            );

            const rootStyles = getComputedStyle(document.documentElement);
            const primaryColor = rootStyles
              .getPropertyValue("--highlight")
              .trim();

            ctx.fillStyle = node.color;
            if (node?.x && node?.y) {
              ctx.fillRect(
                node.x - bckgDimensions[0] / 2,
                node.y - bckgDimensions[1] / 2,
                // @ts-ignore-next-line
                ...bckgDimensions,
              );
            }

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#000";
            if (node?.x && node?.y) {
              ctx.fillText(label, node.x, node.y);
            }
          }}
        />
      </div>
    </div>
  );
};
