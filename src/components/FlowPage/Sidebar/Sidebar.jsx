import React from "react";
import DraggableNode from "../DraggableNode/DraggableNode";
import { IoMdArrowBack } from "react-icons/io";

import style from "./sidebar.module.css";

/**
 * Sidebar Component
 * -----------------
 * Sidebar for the flow editor. It has two modes:
 *
 * 1. **Default Mode (no node selected)**:
 *    - Shows draggable nodes (e.g., "Text" node) that can be dragged into the flow canvas.
 *    - Provides a "Save Changes" button to validate/save the flow.
 *
 * 2. **Edit Mode (when a node is selected)**:
 *    - Displays form fields for editing the selected node’s data (currently only "message" text).
 *    - Allows going back to the default mode with a back arrow.
 *    - Save button to confirm changes.
 *
 * Props:
 *  - selectedNodeId (string | null): ID of currently selected node, or null if none selected.
 *  - selectedNode (object): The node object corresponding to `selectedNodeId`.
 *  - onSubmit (fn): Function called when "Save Changes" is clicked.
 *  - setNodes (fn): State updater for nodes array (used to update node data).
 *  - setSelectedNodeId (fn): Sets selected node ID (used to deselect node).
 */
const Sidebar = React.memo(
  ({ selectedNodeId, selectedNode, onSubmit, setNodes, setSelectedNodeId }) => {
    return (
      <>
        {selectedNodeId === null ? (
          <div className={style.sidebar}>
            <DraggableNode type={"text"} />
            <button onClick={onSubmit}>Save Changes</button>
          </div>
        ) : (
          <div className={style.editSidebar}>
            <div className={style.editSidebarBody}>
              <div className={style.messageInputHeader}>
                <p>Message</p>
                <IoMdArrowBack
                  onClick={() => {
                    setSelectedNodeId(null);
                  }}
                  style={{ cursor: "pointer", fontSize: "24px" }}
                />
              </div>
              <div className={style.inputContainer}>
                <p>Text</p>
                <textarea
                  type="text"
                  cols="50"
                  className={style.input}
                  value={selectedNode?.data?.message}
                  onChange={(e) => {
                    setNodes((prev) =>
                      prev?.map((elem) => {
                        if (elem?.id === selectedNodeId) {
                          return {
                            ...elem,
                            data: {
                              ...elem?.data,
                              message: e.target.value,
                            },
                          };
                        } else {
                          return elem;
                        }
                      })
                    );
                  }}
                />
              </div>
            </div>
            <button onClick={onSubmit}>Save Changes</button>
          </div>
        )}
      </>
    );
  }
);

export default Sidebar;
