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

export function formatLocation(
  location: string,
  hiveName: string,
  t: TFunction,
) {
  const rootPath = `${hiveName}${sep()}${NOTES_PATH}`;

  return location === rootPath ? t("root") : location.replace(rootPath, "");
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
        {t("location")}: {formatLocation(node.location, hiveName, t)}
      </span>
      <span className="flex flex-row">
        {t("references")}: {node.references.length}
      </span>
    </div>
  );
};
