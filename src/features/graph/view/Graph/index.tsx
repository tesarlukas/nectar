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
import { useCallback, useEffect, useRef, useState } from "react";
import { colorThemes } from "@/features/appearance/colorTheme/variants";
import { ActionId } from "@/features/events/eventEmitter";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { useTranslation } from "react-i18next";
import { renderToString } from "react-dom/server";
import type { TFunction } from "i18next";
import type { GraphData, GraphFileLink, GraphFileNode } from "./types";
import { sep } from "@tauri-apps/api/path";
import { NOTES_PATH } from "@/constants/notesPath";

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

  const colors = colorThemes[ThemeFlavour.Standard][currentColorScheme];

  const nodeColor = colors["--muted"];
  const linkColor = colors["--foreground"];
  const textColor = colors["--foreground"];

  const graphData: GraphData = {
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
                const fontSize = 12 / globalScale;
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

const NodeTooltip: React.FC<{
  node: NodeObject<NodeObject<GraphFileNode>>;
  t: TFunction;
  hiveName: string;
}> = ({ node, t, hiveName }) => {
  return (
    <div className="flex flex-col bg-black bg-opacity-70 p-2 rounded text-white">
      <span className="flex flex-row">
        {t("id")}: {node.id}
      </span>
      <span className="flex flex-row">
        {t("name")}: {node.name}
      </span>
      <span className="flex flex-row">
        {t("location")}:{" "}
        {node.location === `${hiveName}${sep()}${NOTES_PATH}`
          ? t("root")
          : node.location.replace(`${hiveName}${sep()}${NOTES_PATH}`, "")}
      </span>
      <span className="flex flex-row">
        {t("references")}: {node.references.length}
      </span>
    </div>
  );
};
