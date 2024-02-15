import React, {
  useRef,
  useEffect,
  useState,
  createRef,
  useCallback,
} from "react";
import Controls from "./Controls";
import { useInterval, clearRect } from "./utils.js";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const [oscillator, setOscillator] = useState(0);
  const [controlsRefArray, setControlsRefArray] = useState([]);
  const [expiresIn, setExpiresIn] = useState(-1);

  useInterval(() => {
    if (Math.floor(oscillator) % 16 == 0) {
      clearRect(canvasRef.current);
      controlsRefArray.forEach((element) => {
        element.current.draw(oscillator / 1000);
      });
    }
    setOscillator(oscillator + 1);
    setExpiresIn(expiresIn - 1);
  }, 1);

  /**
   * when a new canvas is made we call this function. it used
   * to do more, but now it simply ads the next number to the
   * array and adds a new ref that will correspond to that canvas.
   **/
  const addCanvasHandler = useCallback(() => {
    setControlsRefArray([...controlsRefArray, createRef()]);
  }, [controlsRefArray]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{position:"sticky", top:0}} >
        <canvas
          ref={canvasRef}
          {...props}
          height={window.innerHeight}
          width={window.innerWidth-300}
        />
      </div>
      <div style={{ minWidth: "300px",borderLeftWidth:4,borderLeftColor:"white", borderStyle:"solid" }}>
        <button onClick={addCanvasHandler}>add new Spirograph</button>
        {controlsRefArray.map((ref, idx) => (
          <Controls key={idx} canvasRef={canvasRef} ref={ref} number={idx}/>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
