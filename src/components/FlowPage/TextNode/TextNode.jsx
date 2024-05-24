import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import style from "./textNode.module.css";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { IoLogoWhatsapp } from "react-icons/io";

export default memo(({ data, isConnectable }) => {
  return (
    <div 
      className={style.node} 
      onClick={()=>{
        data?.setSelectedNodeId(data?.id);
        data?.setSelectedNodeIndex(data?.index);
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        // onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div className={style.header}>
        <TiDelete 
          className={style.delete}
          onClick={(e)=>{
            e.stopPropagation();
            data?.deleteNode(data?.id)
          }}
        />
        <div className={style.nodeHeader}>
          <BiMessageRoundedDetail style={{fontSize:"16px", position:"relative", top:"1px"}}/>
          Send Message
        </div>
        <div className={style.whatsApplogo}>
          <IoLogoWhatsapp style={{color:"green"}}/>
        </div>
      </div>
      <div className={style.message}>
        {data?.message}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});