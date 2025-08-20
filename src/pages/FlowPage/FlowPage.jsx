import { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "reactflow";
import { toast } from "react-toastify";
import style from "./flowPage.module.css";
import TextNode from "../../components/FlowPage/TextNode/TextNode";
import Sidebar from "../../components/FlowPage/Sidebar/Sidebar";
import { useDnD } from "../utils/DnDContext";

import "reactflow/dist/style.css";

/**
 * Mapping of custom node types to React components.
 * Each node type key corresponds to the `type` field in a node object.
 * When expanding and adding new types of nodes we will need to write a component for them and map them to a key in the customNodes variable
 */
const customNodes = {
  textNode: TextNode,
};

// Unique ID generator for nodes
let id = 0;
const getId = () => `dndnode_${id++}`;

/**
 * FlowPage Component
 * -----------------
 * Main component that renders the flow editor UI.
 * Provides functionality to:
 *  - Add nodes via drag-and-drop from the sidebar
 *  - Connect nodes with edges
 *  - Delete nodes
 *  - Track selected nodes
 *  - Validate flow connectivity before saving
 */
const FlowPage = () => {
  /** Currently selected node ID and its index in nodes array */
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  /** Reference to the ReactFlow container DOM element */
  const reactFlowWrapper = useRef(null);

  /** State hooks provided by ReactFlow */
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /** Store currently selected node object */
  const [selectedNode, setSelectedNode] = useState({});

  /** Tracks the number of edges connected to each node */
  const [nodeEdgesObject, setNodeEdgesObject] = useState({});

  /** Node type set by drag-and-drop context */
  const [type] = useDnD();

  /** Helper from ReactFlow to convert screen coords -> flow coords */
  const { screenToFlowPosition } = useReactFlow();

  /**
   * Handle drag-over event in the flow area.
   * Ensures dragged nodes can be dropped.
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Handle node drop event.
   * Creates a new node at the drop position with the dragged type.
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // Convert drop position to flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create new node object
      let id = getId();
      const newNode = {
        id,
        type,
        position,
        data: {
          setNodes: setNodes,
          setEdges: setEdges,
          id,
          setSelectedNodeId: setSelectedNodeId,
          deleteNode: deleteNode,
          message: "test message",
        },
      };

      // Add new node to state
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type]
  );

  /**
   * Handle drag start for sidebar items.
   * Sets the type in DnD context and adds it to the dataTransfer object.
   */
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData("text/plain", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  /**
   * Whenever selectedNodeId changes, find and set the selected node object.
   */
  useEffect(() => {
    if (selectedNodeId !== null) {
      let node = nodes?.find((node) => node?.data?.id === selectedNodeId);
      setSelectedNode(node);
    }
  }, [selectedNodeId, nodes]);

  /**
   * Handle connection between two nodes.
   * Only allows one outgoing connection from a source node.
   */
  const onConnect = useCallback(
    (params) => {
      let isAllowed = true;
      for (let i of edges) {
        if (i?.source === params?.source) {
          isAllowed = false;
          break;
        }
      }
      if (isAllowed) {
        setEdges((eds) => addEdge(params, eds));
      } else {
        toast.error("One Node can only be a source to one other node");
      }
    },
    [edges, nodes, setEdges]
  );

  /**
   * Delete a node by its ID.
   * Also removes references from nodeEdgesObject.
   */
  const deleteNode = (id) => {
    setNodes((prev) => prev?.filter((node) => node?.id !== id));

    // rebuild nodeEdgesObject without the deleted node
    let temp = nodeEdgesObject;
    let obj = {};
    for (let i of Object.keys(temp || {})) {
      if (i !== id) {
        obj = {
          ...obj,
          [i]: nodeEdgesObject?.[i],
        };
      }
    }
    setNodeEdgesObject(obj);
  };

  /**
   * Recalculate nodeEdgesObject whenever nodes or edges change.
   * Tracks how many edges are connected to each node.
   */
  useEffect(() => {
    if (nodes && edges) {
      for (let i of nodes) {
        // Reset edge counts for all nodes
        setNodeEdgesObject((prev) => ({
          ...prev,
          [i?.id]: 0,
        }));
      }
      for (let i of edges) {
        // Increment edge counts for connected nodes
        setNodeEdgesObject((prev) => ({
          ...prev,
          [i?.source]: prev?.[i?.source] + 1,
          [i?.target]: prev?.[i?.target] + 1,
        }));
      }
    }
  }, [nodes, edges]);

  /**
   * Validate flow before saving.
   * Ensures that all nodes are connected to at least one edge.
   */
  const onSubmit = () => {
    let isError = false;
    for (let i of Object.keys(nodeEdgesObject || {})) {
      if (nodeEdgesObject?.[i] === 0) {
        isError = true;
        break;
      }
    }
    if (isError) {
      toast.error("One node is disconnected");
    } else {
      toast.success("Flow saved");
    }
  };

  return (
    <>
      <div className={style.container}>
        <Sidebar
          selectedNode={selectedNode}
          selectedNodeId={selectedNodeId}
          onSubmit={onSubmit}
          setNodes={setNodes}
          setSelectedNodeId={setSelectedNodeId}
        />
        <div style={{ width: "70vw", height: "100vh" }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={customNodes}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
          />
        </div>
      </div>
    </>
  );
};

const FlowPage = () => {
  return (
    <ReactFlowProvider>
      <FlowPageContent />
    </ReactFlowProvider>
  );
};

export default FlowPage;
