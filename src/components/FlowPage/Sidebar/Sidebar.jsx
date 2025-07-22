import React from "react";

import { IoMdArrowBack } from "react-icons/io";

import style from "./sidebar.module.css";

const Sidebar = React.memo(
  ({
    selectedNodeId,
    selectedNode,
    onSubmit,
    selectedNodeIndex,
    DraggableNode,
    setNodes,
    setSelectedNodeId,
    setSelectedNodeIndex,
  }) => {
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
                    setSelectedNodeIndex(null);
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
                    setNodes((prev) => [
                      ...prev?.slice(0, selectedNodeIndex),
                      {
                        ...prev?.[selectedNodeIndex],
                        data: {
                          ...prev?.[selectedNodeIndex]?.data,
                          message: e.target.value,
                        },
                      },
                      ...prev?.slice(selectedNodeIndex + 1),
                    ]);
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
