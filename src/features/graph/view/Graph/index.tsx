import ForceGraph2D, {
  type LinkObject,
  type NodeObject,
  type ForceGraphMethods,
} from "react-force-graph-2d";
import { useGraphView } from "./hooks/useGraphView";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  ColorScheme,
  ThemeFlavour,
} from "@/features/appearance/colorTheme/types";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { colorThemes } from "@/features/appearance/colorTheme/variants";
import { ActionId } from "@/features/events/eventEmitter";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { useTranslation } from "react-i18next";
import { renderToString } from "react-dom/server";
import type { GraphData, GraphFileLink, GraphFileNode } from "./types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/Typography";
import { NodeTooltip } from "./parts/NodeTooltip";

enum Selection {
  Start = "start",
  End = "end",
}

export const GraphView = () => {
  const { references, hiveName } = useGraphView();
  const { t } = useTranslation("graphView");
  const [currentColorScheme, setCurrentColorScheme] = useState(
    document.documentElement.classList.contains("dark")
      ? ColorScheme.Dark
      : ColorScheme.Light,
  );
  const graphRef =
    useRef<
      ForceGraphMethods<
        NodeObject<GraphFileNode>,
        LinkObject<GraphFileNode, GraphFileLink>
      >
    >(undefined);
  const [selectionMode, setSelectionMode] = useState<Selection | null>(null);

  const colors = colorThemes[ThemeFlavour.Standard][currentColorScheme];

  const nodeColor = colors["--muted"];
  const linkColor = colors["--foreground"];
  const textColor = colors["--foreground"];

  const graphData: GraphData = useMemo(
    () => ({
      nodes:
        references?.map(
          (reference) =>
            ({
              id: reference.noteId,
              name: reference.noteName,
              location: reference.noteLocation,
              color: nodeColor,
              references: reference.referenceIds,
              group: "notes",
            }) as GraphFileNode,
        ) ?? [],
      links:
        references?.flatMap((reference) =>
          reference.referenceIds.map((id) => ({
            source: reference.noteId,
            target: id,
          })),
        ) ?? [],
    }),
    [references],
  );

  const [startNode, setStartNode] = useState<GraphFileNode>();
  const [endNode, setEndNode] = useState<GraphFileNode>();

  const handleNodeClick = useCallback(
    (node: NodeObject<NodeObject<GraphFileNode>>) => {
      console.log("is this hapenning", node);
      if (selectionMode === Selection.Start) {
        setStartNode(node);
        setSelectionMode(null);
      } else if (selectionMode === Selection.End) {
        setEndNode(node);
        setSelectionMode(null);
      }
    },
    [selectionMode],
  );

  useEventListener(ActionId.ThemeChanged, (value: ColorScheme) => {
    setCurrentColorScheme(value);
  });

  const nodeLabel = useCallback(
    (node: NodeObject<NodeObject<GraphFileNode>>): string => {
      return renderToString(
        <NodeTooltip node={node} t={t} hiveName={hiveName} />,
      );
    },
    [],
  );

  useEffect(() => {
    graphRef.current?.d3Force("link")?.distance(50);
  }, [graphRef.current]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-background p-4">
        <h1 className="text-2xl font-bold w-fit border-b">
          {t("noteRelationshipGraph")}
        </h1>
      </div>
      <div className="flex-row flex gap-4 p-4">
        <Card
          className={`p-4 transition-all duration-200 cursor-pointer
          ${selectionMode === Selection.Start ? "bg-bg-muted border-green-500 border-2 shadow-md scale-105" : "hover:bg-muted hover:shadow-md hover:scale-102 active:bg-accent active:scale-98"}`}
          onClick={() => setSelectionMode(Selection.Start)}
        >
          <CardTitle className="px-2 border-b-2">Start Node</CardTitle>
          <CardContent className="px-2">
            {startNode && (
              <div className="flex flex-col items-start">
                <Typography>
                  {t("note")}: {startNode.name}
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className={`p-4 h-32 w-32 transition-all duration-200 cursor-pointer
          ${selectionMode === Selection.End ? "bg-muted border-blue-500 border-2 shadow-md scale-105" : "hover:bg-muted hover:shadow-md hover:scale-102 active:bg-accent active:scale-98"}`}
          onClick={() => setSelectionMode(Selection.End)}
        >
          <CardTitle className="px-2 border-b-2">Start Node</CardTitle>
          <CardContent className="px-2">
            {endNode && (
              <div className="flex flex-col items-start">
                <Typography>
                  {t("note")}: {endNode.name}
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Graph Visualization */}
      <div className="flex flex-grow bg-primary-background">
        <AutoSizer>
          {({ width, height }) => (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              width={width}
              height={height}
              nodeLabel={nodeLabel}
              nodeColor={(node: GraphFileNode) => node.color}
              nodeRelSize={12}
              maxZoom={2.5}
              onNodeClick={handleNodeClick}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0}
              linkColor={() => linkColor}
              cooldownTicks={100}
              backgroundColor={colors["--background"]}
              nodeCanvasObjectMode={() => "after"}
              nodeCanvasObject={(
                node: GraphFileNode,
                ctx: CanvasRenderingContext2D,
                globalScale: number,
              ) => {
                const label = node.name;
                const fontSize = Math.round(12 / globalScale);
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(
                  (n) => n + fontSize * 0.2,
                );

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
                ctx.fillStyle = textColor;
                if (node?.x && node?.y) {
                  ctx.fillText(label, node.x, node.y);
                }
              }}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
