import { memo } from "react";
import { Handle, Position } from "reactflow";
import style from "./textNode.module.css";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { IoLogoWhatsapp } from "react-icons/io";

/**
 * TextNode Component
 * ------------------
 * Custom React Flow node that represents a "Send Message" block.
 *
 * Features:
 *  - Selectable: clicking the node sets it as the selected node
 *  - Deletable: delete button removes the node from the flow
 *  - Connectable: provides a left "target" handle and right "source" handle
 *  - Displays a message stored in node data
 *
 * Props (injected by React Flow):
 *  - data: Custom data object passed when creating the node
 *      - id (string): Node ID
 *      - message (string): Message text displayed in the node
 *      - setSelectedNodeId (fn): Updates selected node ID in FlowPage
 *      - setSelectedNodeIndex (fn): Updates selected node index in FlowPage
 *      - deleteNode (fn): Removes this node from the graph
 *  - isConnectable (boolean): Whether handles can be used to connect edges
 */
export default memo(({ data, isConnectable }) => {
  return (
    <div
      className={style.node}
      onClick={() => {
        data?.setSelectedNodeId(data?.id);
        data?.setSelectedNodeIndex(data?.index);
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        // onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div className={style.header}>
        <TiDelete
          className={style.delete}
          onClick={(e) => {
            e.stopPropagation();
            data?.deleteNode(data?.id);
          }}
        />
        <div className={style.nodeHeader}>
          <BiMessageRoundedDetail
            style={{ fontSize: "16px", position: "relative", top: "1px" }}
          />
          Send Message
        </div>
        <div className={style.whatsApplogo}>
          <IoLogoWhatsapp style={{ color: "green" }} />
        </div>
      </div>
      <div className={style.message}>{data?.message}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
