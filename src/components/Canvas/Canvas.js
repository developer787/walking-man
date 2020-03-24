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
const walking = function*() {
  let count = 0;
  let step = 3;
  while (true) {
    if (count >= 50) {
      step = -3;
      count += step;
      yield [count, -count];
    } else if (count <= -50) {
      step = 3;
      count += step;
      yield [count, -count];
    }
    count += step;
    yield [count, -count];
  }
};
const jumping = function*() {
  let count = 0;
  let step = 10;
  while (true) {
    if (count >= 50) {
      step = -10;
      count += step;
      yield [count, -count];
    } else if (count <= 0) {
      step = 10;
      count += step;
      yield [count, -count];
    }
    count += step;
    yield [count, -count];
  }
};
const draw = {
  hero: ctx => {
    ctx.beginPath();
    ctx.arc(40, 400, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff'; //getRandomColor();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(40, 420);
    ctx.lineTo(40, 460);
    ctx.stroke();
  },
  head: (ctx, move) => {
    ctx.beginPath();
    ctx.arc(40, 400 + move/40, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff'; //getRandomColor();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(40, 420 + move/40);
    ctx.lineTo(40, 460);
    ctx.stroke();
  },
  rightArm: (ctx, right) => {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(40, 430);
    ctx.lineTo(32+right / 20, 450);
    ctx.lineTo(36+right / 20,  470);
    ctx.stroke();
  },
  leftArm: (ctx, left) => {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(40, 430);
    ctx.lineTo(46+left / 20, 450);
    ctx.lineTo(44+left / 20,  470);
    ctx.stroke();
  },
  leftLeg: (ctx, walk) => {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(40, 460);
    ctx.lineTo(walk/2 + 40, 520);
    ctx.stroke();
  },
  rightLeg: (ctx, walk) => {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(40, 460);
    ctx.lineTo(walk /2+ 40, 520);
    ctx.stroke();
  },
  walk: function(ctx, right, left) {
    this.head(ctx, right);
    this.rightArm(ctx, right);
    this.leftArm(ctx, left);
    this.rightLeg(ctx, right);
    this.leftLeg(ctx, left);
  },
  stand: function(ctx) {
    this.rightArm(ctx, 0);
    this.leftArm(ctx, 0);
    this.rightLeg(ctx, 20);
    this.leftLeg(ctx, -20);
  },
  /*jump: function(ctx, up) {
    this.head(ctx, up);
    this.rightArm(ctx, up);
    this.leftArm(ctx, up);
    this.rightLeg(ctx, up);
    this.leftLeg(ctx, up);
  },*/
  circle: (e, ctx) => {
    ctx.beginPath();
    ctx.arc(e.clientX, e.clientY, 50, 0, 2 * Math.PI);
    ctx.fillStyle = getRandomColor();
    ctx.fill();
    ctx.stroke();
  },
  background: ctx => {
    ctx.beginPath();
    ctx.rect(0, 500, window.innerWidth, 100);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.stroke();
  },
  rain: (ctx, x, y) => {
    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y + 5);
    ctx.stroke();
  },
};

const Canvas = props => {
  const canvasRef = useRef(null);
  const [touch, setTouch] = useState(false);
  const [jump, setJump] = useState(false);
  const [context, setCtx] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const mouseDownHandle = (e, ctx) => {
    setTouch(!touch);
  };
  const touchStart = (e, ctx) => {
    setTouch(true);
  };

  const touchEnd = (e, ctx) => {
    setTouch(false);
  };
  useEffect(() => {
    setScale();
  }, []);
  const setScale = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    await setCtx(ctx);
    const scale = window.devicePixelRatio;
    const w = (canvas.width = window.innerWidth * scale);
    const h = (canvas.height = window.innerHeight * scale);
    ctx.scale(scale, scale);
    setDimensions([w, h]);
  };
  const steps = walking();
  useEffect(() => {
    const t = () => touch;
    const [w, h] = dimensions;
    const animate = f => {
      if (context) {
        context.clearRect(0, 0, w, h);
        draw.background(context);
        if (f()) {
          const [right, left] = steps.next().value;
          draw.walk(context, right, left);
            if(jump){
          draw.jump(context, right, left);

            }
        } else {
        draw.hero(context);
          draw.stand(context);
        }
      }
      requestAnimationFrame(() => animate(t));
    };
    animate(t);
  }, [touch, context]);
  return (
    <CanvasWrapper>
      <canvas
        data-testid={'canvas'}
        ref={canvasRef}
        //       onClick={e => clickHandle(e, ctx)}
        // onMouseDown={e => mouseDownHandle(e, context)}
        onTouchStart={e => touchStart(e, context)}
        onTouchEnd={e => touchEnd(e, context)}
      />
    </CanvasWrapper>
  );
};

export default Canvas;
