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
  const { references, hiveName, noteIdsRef } = useGraphView();
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
  const startNodeColor = colors["--chart-2"];
  const endNodeColor = colors["--chart-1"];
  const pathColor = colors["--chart-5"];

  const graphData: GraphData = useMemo(() => {
    const links =
      references
        ?.flatMap((reference) => {
          return reference.referenceIds.flatMap((id) => ({
            source: reference.noteId,
            target: id,
          }));
        })
        // TODO: This is far from optimal but when user deletes node, this way
        // we eliminate links for it. Temporary fix
        .filter(
          (link) =>
            noteIdsRef.current?.includes(link.source) &&
            noteIdsRef.current?.includes(link.target),
        ) ?? [];

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
      <Card className="gap-4 p-4 mx-4">
        <CardTitle className="border-b-2 mb-4 w-fit">
          {t("findShortestPath (BFS)")}
        </CardTitle>
        <CardContent className="flex flex-row px-0 gap-x-4 max-w-2/3">
          <Card
            className={`p-4 transition-all duration-200 cursor-pointer flex-1
          ${selectionMode === Selection.Start ? "bg-bg-muted border-chart-2 border-2 shadow-md scale-105" : "hover:bg-muted hover:shadow-md hover:scale-102 active:bg-accent active:scale-98"}`}
            onClick={() => setSelectionMode(Selection.Start)}
          >
            <CardTitle className="px-2 border-b-2">{t("startNode")}</CardTitle>
            <CardContent className="px-2">
              {startNode && (
                <div className="flex flex-col items-start gap-y-4 spacing-0 py-4">
                  <span className="border-b-2 border-chart-2">
                    {t("note")}: {startNode.name}
                  </span>
                  <span>
                    {t("id")}: {startNode.id}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            className={`p-4 transition-all duration-200 cursor-pointer flex-1
          ${selectionMode === Selection.End ? "bg-muted border-chart-1 border-2 shadow-md scale-105" : "hover:bg-muted hover:shadow-md hover:scale-102 active:bg-accent active:scale-98"}`}
            onClick={() => setSelectionMode(Selection.End)}
          >
            <CardTitle className="px-2 border-b-2">{t("endNode")}</CardTitle>
            <CardContent className="px-2">
              {endNode && (
                <div className="flex flex-col items-start gap-y-4 spacing-0 py-4">
                  <span className="border-b-2 border-chart-1">
                    {t("note")}: {endNode.name}
                  </span>
                  <span>
                    {t("id")}: {endNode.id}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleFind}>Find</Button>
        </CardContent>
      </Card>
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
                switch (true) {
                  case path.includes(node.id):
                    return pathColor;
                  case node.id === startNode?.id:
                    return startNodeColor;
                  case node.id === endNode?.id:
                    return endNodeColor;
                  default:
                    return node.color;
                }
              }}
              nodeRelSize={12}
              maxZoom={2.5}
              onNodeClick={handleNodeClick}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0}
              linkColor={(link) => {
                if (
                  typeof link.source !== "string" &&
                  typeof link.target !== "string" &&
                  checkConsecutivePair(path, [link.source.id, link.target.id])
                ) {
                  return pathColor;
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

                switch (true) {
                  case node.id !== startNode?.id && node.id !== endNode?.id:
                    if (path.includes(node.id)) {
                      ctx.fillStyle = pathColor;
                    } else {
                      ctx.fillStyle = node.color;
                    }
                    break;
                  case node.id === startNode?.id:
                    ctx.fillStyle = startNodeColor;
                    break;
                  default:
                    ctx.fillStyle = endNodeColor;
                    break;
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
