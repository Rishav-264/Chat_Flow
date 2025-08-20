import { useCallback, useState, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
import { toast } from "react-toastify";
import style from "./flowPage.module.css";
import { BiMessageRoundedDetail } from "react-icons/bi";
import TextNode from "../../components/FlowPage/TextNode/TextNode";
import Sidebar from "../../components/FlowPage/Sidebar/Sidebar";
import { nodeTypes } from "../utils/nodeTypes";
import { useDrag, useDrop } from "react-dnd";

import "reactflow/dist/style.css";

//When expanding and adding new types of nodes we will need to write a component for them and map them to a key in the customNodes variable
const customNodes = {
  selectorNode: TextNode,
};

// We can define different kinds of nodes here and render them conditionally based on the type parameter,
// currently only the text node is rendered,
// that way we can expand the feature.

const DraggableNode = ({ type }) => {
  const getType = () => {
    switch (type) {
      case "text":
        return nodeTypes.TEXT;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  const getNode = () => {
    switch (type) {
      case "text":
        return (
          <div className={style.node} ref={drag}>
            <BiMessageRoundedDetail style={{ fontSize: "30px" }} />
            Message
          </div>
        );
      default:
        return null;
    }
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: getType(),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: () => {
      return { type };
    },
  }));

  return <>{getNode()}</>;
};

const FlowPage = () => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState({});
  const [nodeEdgesObject, setNodeEdgesObject] = useState({});

  const [{ isOver }, drop] = useDrop(() => ({
    accept: nodeTypes.TEXT,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropTargetRect = drop.current?.getBoundingClientRect();
      
      if (offset && dropTargetRect) {
        const position = {
          x: offset.x - dropTargetRect.left,
          y: offset.y - dropTargetRect.top
        };
        addNode(item?.type, position);
      } else {
        addNode(item?.type);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (selectedNodeId !== null) {
      let node = nodes?.find((node) => node?.data?.id === selectedNodeId);
      setSelectedNode(node);
    }
  }, [selectedNodeId, nodes]);

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

  const deleteNode = (id) => {
    setNodes((prev) => prev?.filter((node) => node?.id !== id));
  };

  //addNode accepts the type that is dragged from the sidebar and dropped into the flow div, based on that we assign the node type.
  //DraggableNode(accepts type) => type passed on to useDrag => passed on to useDrop => passed on to addNode, we only need to send type param in draggable node

  const addNode = (type, position = { x: 0, y: 0 }) => {
    let nodeType = "";
    switch (type) {
      case "text":
        nodeType = "selectorNode";
        break;
      default:
        nodeType = "";
    }
    let id = Date.now();
    setNodes((prev) => [
      ...prev,
      {
        id: `node-${id}`,
        position: position,
        type: nodeType,
        data: {
          setNodes: setNodes,
          setEdges: setEdges,
          id: `node-${id}`,
          setSelectedNodeId: setSelectedNodeId,
          setSelectedNodeIndex: setSelectedNodeIndex,
          deleteNode: deleteNode,
          message: "test message",
          index: prev?.length,
        },
      },
    ]);
  };

  useEffect(() => {
    if (nodes && edges) {
      for (let i of nodes) {
        setNodeEdgesObject((prev) => ({
          ...prev,
          [i?.id]: 0,
        }));
      }
      for (let i of edges) {
        setNodeEdgesObject((prev) => ({
          ...prev,
          [i?.source]: prev?.[i?.source] + 1,
          [i?.target]: prev?.[i?.target] + 1,
        }));
      }
    }
  }, [nodes, edges]);

  const onSubmit = () => {
    let isError = false;
    for (let i of Object.keys(nodeEdgesObject)) {
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
          selectedNodeIndex={selectedNodeIndex}
          DraggableNode={DraggableNode}
          setNodes={setNodes}
          setSelectedNodeId={setSelectedNodeId}
          setSelectedNodeIndex={setSelectedNodeIndex}
        />
        <div style={{ width: "70vw", height: "100vh" }} ref={drop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={customNodes}
          />
        </div>
      </div>
    </>
  );
};

export default FlowPage;
