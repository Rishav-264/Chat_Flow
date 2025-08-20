import { BiMessageRoundedDetail } from "react-icons/bi";
import style from "./draggableNode.module.css";

import { useDnD } from "../../../pages/utils/DnDContext";
import { nodeTypes } from "../../../pages/utils/nodeTypes";

/**
 * DraggableNode Component
 * -----------------------
 * Represents a draggable node option in the sidebar.
 * When dragged, it sets the node type in the shared DnD context (`useDnD`),
 * which the FlowPage then uses to create a new node in the React Flow canvas.
 *
 * Props:
 *  - type (string): Node type to render (e.g., "text").
 *
 * How it works:
 * 1. User clicks and drags the node.
 * 2. `onDragStart` sets the node type into the DnD context.
 * 3. When dropped into ReactFlow area, FlowPage picks the type and creates a new node.
 */
const DraggableNode = ({ type }) => {
  const [_, setType] = useDnD();

  /**
   * Handler for when dragging starts.
   * Stores the nodeType in context so that FlowPage knows what to add.
   */
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  /**
   * Renders the draggable node UI depending on `type` prop.
   * Currently only supports "text" node, but can be extended for more.
   */
  const getNode = () => {
    switch (type) {
      case "text":
        return (
          <div
            className={style.node}
            onDragStart={(event) => onDragStart(event, nodeTypes.TEXT)}
            draggable
          >
            <BiMessageRoundedDetail style={{ fontSize: "30px" }} />
            Message
          </div>
        );
      default:
        return null;
    }
  };

  return <>{getNode()}</>;
};

export default DraggableNode;
