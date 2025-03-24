import ForceGraph2D, { type NodeObject } from "react-force-graph-2d";
import { useGraphView } from "./hooks/useGraphView";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  ColorScheme,
  ThemeFlavour,
} from "@/features/appearance/colorTheme/types";
import { useCallback, useState } from "react";
import { colorThemes } from "@/features/appearance/colorTheme/variants";
import { ActionId } from "@/features/events/eventEmitter";
import { useEventListener } from "@/features/events/hooks/useEventListener";
import { useTranslation } from "react-i18next";
import { renderToString } from "react-dom/server";
import type { TFunction } from "i18next";

//const referenceArray =
//  references?.map(
//    (reference) =>
//      ({
//        id: reference.noteId,
//        name: reference.noteName,
//        color: "#303",
//        group: "notes",
//      }) as GraphFileNode,
//  ) ?? [];
//const linkArray =
//  references?.flatMap((reference) =>
//    reference.referenceIds.map((id) => ({
//      source: reference.noteId,
//      target: id,
//    })),
//  ) ?? [];
//
//console.log("references", referenceArray);
//console.log("links", linkArray);
//
//const referenceIds = referenceArray.map((reference) => reference.id);
//const linkSources = linkArray.map((link) => link.source);
//console.log("ids", referenceIds);
//console.log("sources", linkSources);
//const overlap = linkSources.filter((source) => referenceIds.includes(source));
//console.log("overlap", overlap);

interface GraphFileNode {
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

interface GraphFileLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphFileNode[];
  links: GraphFileLink[];
}

export const GraphView = () => {
  const { references } = useGraphView();
  const { t } = useTranslation("graphView");
  const [currentColorScheme, setCurrentColorScheme] = useState(
    document.documentElement.classList.contains("dark")
      ? ColorScheme.Dark
      : ColorScheme.Light,
  );

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
      return renderToString(<NodeTooltip node={node} t={t} />);
    },
    [],
  );

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
              graphData={graphData}
              width={width}
              height={height}
              nodeLabel={nodeLabel}
              nodeColor={(node: GraphFileNode) => node.color}
              nodeRelSize={12}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              linkCurvature={0}
              linkColor={() => linkColor}
              //onNodeClick={handleNodeClick}
              //onLinkClick={handleLinkClick}
              cooldownTicks={100}
              //linkWidth={(link: GraphFileLink) => (selectedLink === link ? 3 : 1)}
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
}> = ({ node, t }) => {
  return (
    <div className="flex flex-col bg-black bg-opacity-70 p-2 rounded text-white">
      <span className="flex flex-row">
        {t("name")}: {node.name}
      </span>
      <span className="flex flex-row">
        {t("location")}: {node.name}
      </span>
      <span className="flex flex-row">
        {t("references")}: {node.references.length}
      </span>
    </div>
  );
};
