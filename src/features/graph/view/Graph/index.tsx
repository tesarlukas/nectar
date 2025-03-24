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
import { Button } from "@/components/ui/button";
import { findShortestPath } from "./utils";

enum Selection {
  Start = "start",
  End = "end",
}

function checkConsecutivePair(array: string[], pair: string[]) {
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] === pair[0] && array[i + 1] === pair[1]) {
      return true;
    }
  }
  return false;
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
  const startNodeColor = "#0f0";
  const endNodeColor = "#0ff";

  const graphData: GraphData = useMemo(() => {
    const links =
      references?.flatMap((reference) => {
        return reference.referenceIds.flatMap((id) => ({
          source: reference.noteId,
          target: id,
        }));
      }) ?? [];

    const nodes =
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
      ) ?? [];

    const data = {
      nodes,
      links,
    };

    return data;
  }, [references]);

  const [startNode, setStartNode] = useState<GraphFileNode>();
  const [endNode, setEndNode] = useState<GraphFileNode>();
  const [path, setPath] = useState<string[]>([]);

  const handleNodeClick = useCallback(
    (node: NodeObject<NodeObject<GraphFileNode>>) => {
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

  const handleFind = () => {
    if (!startNode || !endNode) {
      return;
    }

    const path = findShortestPath(graphData, startNode?.id, endNode?.id);
    setPath(path ?? []);
  };

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
                <Typography>
                  {t("id")}: {startNode.id}
                </Typography>
              </div>
            )}
          </CardContent>
        </Card>
        <Button onClick={handleFind}>Find</Button>

        <Card
          className={`p-4 transition-all duration-200 cursor-pointer
          ${selectionMode === Selection.End ? "bg-muted border-blue-500 border-2 shadow-md scale-105" : "hover:bg-muted hover:shadow-md hover:scale-102 active:bg-accent active:scale-98"}`}
          onClick={() => setSelectionMode(Selection.End)}
        >
          <CardTitle className="px-2 border-b-2">Start Node</CardTitle>
          <CardContent className="px-2">
            {endNode && (
              <>
                <Typography>
                  {t("note")}: {endNode.name}
                </Typography>
                <Typography>
                  {t("id")}: {endNode.id}
                </Typography>
              </>
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
              nodeColor={(node: GraphFileNode) => {
                if (path.includes(node.id)) {
                  return "#f00";
                }

                return node.color;
              }}
              nodeRelSize={12}
              maxZoom={2.5}
              onNodeClick={handleNodeClick}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0}
              linkColor={(link) => {
                if (
                  checkConsecutivePair(path, [link.source.id, link.target.id])
                ) {
                  return "#f00";
                }

                return linkColor;
              }}
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

                if (node.id !== startNode?.id && node.id !== endNode?.id) {
                  ctx.fillStyle = node.color;
                } else if (node.id === startNode?.id) {
                  ctx.fillStyle = startNodeColor;
                } else {
                  ctx.fillStyle = endNodeColor;
                }

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

// NOTE: flatmap from before
// references?.flatMap((reference) =>
//  reference.referenceIds.map((id) => ({
//    source: reference.noteId,
//    target: id,
//  })),
// ) ?? [],
