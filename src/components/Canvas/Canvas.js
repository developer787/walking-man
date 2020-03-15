import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const CanvasWrapper = styled.div`
  canvas {
    background: #fff;
    width: 100%;
    height: 100%;
  }
`;
const draw = {
  circle: (e, ctx) => {
    ctx.beginPath();
    ctx.arc(e.clientX, e.clientY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = getRandomColor();
    ctx.fill();
    ctx.stroke();
  },
};
const clickHandle = (e, ctx) => {
  draw.circle(e, ctx);
};
const Canvas = props => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState({});
  let scale = window.devicePixelRatio;
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    ctx.scale(scale, scale);
    setCtx(ctx);
  }, [scale]);
  return (
    <CanvasWrapper>
      <canvas ref={canvasRef} onClick={e => clickHandle(e, ctx)} />
    </CanvasWrapper>
  );
};

export default Canvas;
