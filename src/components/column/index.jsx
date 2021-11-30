import React from "react";
import { Col, Card } from "antd";
import { Droppable } from "react-beautiful-dnd";
import TaskDragDrop from "../task";

export default function ColumnDropAndDrag(props) {
  
  return (
    <Col span={6}>
      <Card
        size="small"
        title={props.column.statusName}
        style={{ width: "100%"}}
      >
          <Droppable droppableId={props.column.statusId} isCombineEnabled>
              {(provided,snapshot) => {
                  return(
                    <div ref={provided.innerRef} {...provided.droppableProps}  style={{background:snapshot.isDraggingOver ? "#f8f8f8" : "transparent",flexGrow:"1",height:300,overflowY:"scroll",padding:"0 3px"}}>
                        {props.column.lstTaskDeTail.map((item,index) => {
                            return <TaskDragDrop key={item.taskId} task={item} index={index}></TaskDragDrop>
                        })}
                        {provided.placeholder}
                    </div>
                  )
              }}
              
          </Droppable>
      </Card>
    </Col>
  );
}
