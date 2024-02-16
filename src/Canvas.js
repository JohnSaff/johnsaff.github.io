import React, {
  useRef,
  useEffect,
  useState,
  createRef,
  useCallback,
} from "react";
import Controls from "./Controls";
import { useInterval, clearRect } from "./utils.js";
import CardIndicators from "./CardIndicators";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const [oscillator, setOscillator] = useState(0);
  const [controlsRefArray, setControlsRefArray] = useState([]);
  const [expiresIn, setExpiresIn] = useState(-1);
  const [activeCard, setActiveCard] = useState(0);

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
    if (controlsRefArray.length === 6) {
      return;
    }
    setControlsRefArray([...controlsRefArray, createRef()]);
    setActiveCard(controlsRefArray.length);
  }, [controlsRefArray]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ position: "sticky", top: 0 }}>
        <canvas
          ref={canvasRef}
          {...props}
          height={window.innerHeight}
          width={window.innerWidth - 300}
        />
      </div>
      <div
        style={{
          minWidth: "300px",
          borderWidth: "0 0 0 4",
          borderLeftColor: "white",
          borderStyle: "solid",
        }}
      >
        {controlsRefArray.length <6 && <button onClick={addCanvasHandler}>add new Spirograph</button>}
        {controlsRefArray.map((ref, idx) => (
          <Controls
            key={idx}
            canvasRef={canvasRef}
            ref={ref}
            number={idx}
            activeCard={activeCard}
          />
        ))}
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {controlsRefArray.map((_ref, idx) => (
            <CardIndicators number={idx} setActive={setActiveCard} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
