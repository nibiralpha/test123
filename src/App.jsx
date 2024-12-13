import React, { useState, useRef, useEffect } from 'react';
import './index.css';

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * (window.innerWidth - 100)),
  y: Math.floor(Math.random() * (window.innerHeight - 100))
});

const Line = ({ parentPosition, childPosition }) => {
  
  const x1 = parentPosition.x + 50;
  const y1 = parentPosition.y + 50;
  const x2 = childPosition.x + 50;
  const y2 = childPosition.y + 50;

  return (
    <svg
      className="line"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x1}
        y2={y2}
        stroke="black"
        strokeDasharray="5,5"
      />
      <line
        x1={x1}
        y1={y2}
        x2={x2}
        y2={y2}
        stroke="black"
        strokeDasharray="5,5"
      />
    </svg>
  );
};

const App = () => {
  const [blocks, setBlocks] = useState([
    { id: Math.random(), position: getRandomPosition(), parent: null }
  ]);

  // const [updateTrigger, setUpdateTrigger] = useState(0);

  const containerRef = useRef(null);
  const positionsRef = useRef({});

  useEffect(() => {
    // Sync positionsRef with blocks
    blocks.forEach(block => {
      positionsRef.current[block.id] = block.position;
    });
  }, [blocks]);

  const handleAddBlock = (parentId) => {
    const newBlock = {
      id: Math.random(),
      position: getRandomPosition(),
      parent: parentId,
    };
  
    positionsRef.current[newBlock.id] = newBlock.position;
  
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    // setUpdateTrigger((prev) => prev + 1); 
  };
  

  const handleDrag = (id, e) => {
    const newX = e.clientX - containerRef.current.offsetLeft;
    const newY = e.clientY - containerRef.current.offsetTop;

    positionsRef.current[id] = { x: newX, y: newY };

    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id
          ? { ...block, position: positionsRef.current[id] }
          : block
      )
    );
  };

  return (
    <div ref={containerRef} className="container">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="block"
          style={{
            top: block.position.y,
            left: block.position.x,
            position: 'absolute'
          }}
          onMouseDown={(e) => {
            const moveListener = (e) => handleDrag(block.id, e);
            const upListener = () => {
              document.removeEventListener('mousemove', moveListener);
              document.removeEventListener('mouseup', upListener);
            };
            document.addEventListener('mousemove', moveListener);
            document.addEventListener('mouseup', upListener);
          }}
        >
          <span className="block-index">{index}</span>
          <button onClick={(e) => {
            e.stopPropagation();
            handleAddBlock(block.id);
          }}>+</button>
        </div>
      ))}

      {blocks.map((block) => {
        
        if (!block.parent) return null;
        const parentPosition = positionsRef.current[block.parent];
        const childPosition = positionsRef.current[block.id];
        if (!parentPosition || !childPosition) return null;
        
        return (
          <Line
            key={block.id}
            parentPosition={parentPosition}
            childPosition={childPosition}
          />
        );
      })}
    </div>
  );
};

export default App;