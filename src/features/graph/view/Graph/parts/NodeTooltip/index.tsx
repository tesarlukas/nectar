import type { TFunction } from "i18next";
import type { NodeObject } from "react-force-graph-2d";
import type { GraphFileNode } from "../../types";
import { sep } from "@tauri-apps/api/path";
import { NOTES_PATH } from "@/constants/notesPath";

interface NodeTooltipProps {
  node: NodeObject<NodeObject<GraphFileNode>>;
  t: TFunction;
  hiveName: string;
}

export const NodeTooltip = ({ node, t, hiveName }: NodeTooltipProps) => {
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
