import React, { useRef, useState, createRef, useCallback } from "react";
import Controls from "./Controls";
import {
  useInterval,
  clearRect,
} from "./utils.js";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const [clock, setClock] = useState(0);
  const [controlsRefArray, setControlsRefArray] = useState([]);
  const [expiresIn, setExpiresIn] = useState(-1);

  useInterval(() => {
    if(Math.floor(clock)%16 === 0){
      clearRect(canvasRef.current.getContext("2d"));
      controlsRefArray.forEach((element) => {
        element.current.draw(clock/1000);
      });
    }
    setClock(clock + 1);
    setExpiresIn(expiresIn - 1);
  }, 1);

  // when a new canvas is made we call this function. it used to do more, but now it simply ads the next number to the array and adds a new ref that will correspond to that canvas.
  const addCanvasHandler = useCallback( () => {
    setControlsRefArray([...controlsRefArray, createRef()]);
  },[controlsRefArray]);

  return (
    <>
      <canvas ref={canvasRef} {...props} height={500/9*16} width="500" />

        <button onClick={addCanvasHandler}>add new Spirograph</button>
      {controlsRefArray.map((ref, idx) => (
        <Controls key={idx} canvasRef={canvasRef} ref={ref} />
      ))}
    </>
  );
};

export default Canvas;
