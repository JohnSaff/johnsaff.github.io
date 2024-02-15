import React, {
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

const Controls = forwardRef((props, ref) => {
  const [radius1, setRadius1] = useState(15);
  const [radius2, setRadius2] = useState(50);
  const [ratio, setRatio] = useState(42);
  const [oscillatorAmplitude, setOscillatorAmplitude] = useState(2);
  const [oscillatorSpeed, setOscillatorSpeed] = useState(0.5);
  const [oscillatorOffset, setOscillatorOffset] = useState(10);
  const [color, setColor] = useState("rgba(255, 0, 0, 1)");
  const [red, setRed] = useState(255);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [weight, setWeight] = useState(10);

  const resolution = 0.0001;

  const handleColorChange = (color, value) => {
    switch (color) {
      case "red":
        setRed(value);
        break;
      case "green":
        setGreen(value);
        break;
      case "blue":
        setBlue(value);
        break;
      case "alpha":
        setAlpha(value);
        break;
    }
    setColor("rgba(" + red + "," + green + "," + blue + "," + alpha + ")");
  };

  function drawSpirograph(
    context,
    cx,
    cy,
    radius1,
    radius2,
    ratio,
    resolution,
    color,
    weight,
    oscillator,
    oscillatorMultiplier,
    oscillatorOffset
  ) {
    if (resolution == 0) {
      return;
    }

    var x, y, theta;

    // Move to starting point (theta = 0)
    context.moveTo(cx + radius1 + radius2, cy);
    context.beginPath();

    // Draw segments from theta = 0 to theta = 2PI
    for (theta = 0; theta <= Math.PI * 2; theta += resolution) {
      x =
        cx +
        radius1 *
          (Math.sin(oscillator) * oscillatorMultiplier + oscillatorOffset) *
          Math.cos(theta) +
        radius2 * Math.cos(theta * ratio);
      y =
        cy +
        radius1 *
          (Math.sin(oscillator) * oscillatorMultiplier + oscillatorOffset) *
          Math.sin(theta) +
        radius2 * Math.sin(theta * ratio);
      context.lineTo(x, y);
    }

    // Apply stroke
    context.strokeStyle = color;
    context.lineWidth = weight;
    context.stroke();

    context.globalCompositeOperation = "difference";
    context.fillRect(0, 0, 500, 500);
  }

  const draw = useCallback(
    (oscillator) => {
      if (props.canvasRef.current == null) {
        return;
      }
      const canvas = props.canvasRef.current;
      const context = canvas.getContext("2d");

      drawSpirograph(
        context,
        canvas.width / 2,
        canvas.height / 2,
        radius1,
        radius2,
        ratio,
        resolution,
        color,
        weight,
        oscillator * oscillatorSpeed,
        oscillatorAmplitude,
        oscillatorOffset
      );
    },
    [
      drawSpirograph,
      radius1,
      radius2,
      ratio,
      resolution,
      props,
      color,
      weight,
      oscillatorSpeed,
      oscillatorAmplitude,
      oscillatorOffset,
    ]
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        draw,
      };
    },
    [draw]
  );

  return (
    <>
    <h1>spirograph {props.number+1}</h1>
    <form
      style={{
        marginBottom: 24,
        display: "flex",
        flexDirection: "column",
        color: "black",
      }}
    >
      <label>inner radius:{radius1}</label>
      <input
        type="range"
        min="1"
        max="100"
        value={radius1}
        onChange={(event) => {
          setRadius1(event.target.value);
        }}
      />
      <label>outer radius:{radius2}</label>
      <input
        type="range"
        min="1"
        max="100"
        value={radius2}
        onChange={(event) => {
          setRadius2(event.target.value);
        }}
      />
      <label>ratio:{ratio}</label>
      <input
        type="range"
        min="1"
        max="100"
        value={ratio}
        onChange={(event) => {
          setRatio(event.target.value);
        }}
      />
      <label>oscillator amplitude:{oscillatorAmplitude}</label>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={oscillatorAmplitude}
        onChange={(event) => {
          setOscillatorAmplitude(event.target.value);
        }}
      />
      <label>oscillator speed:{oscillatorSpeed}</label>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={oscillatorSpeed}
        onChange={(event) => {
          setOscillatorSpeed(event.target.value);
        }}
      />
      <label>offset:{oscillatorOffset}</label>
      <input
        type="range"
        min="0"
        max="100"
        value={oscillatorOffset}
        onChange={(event) => {
          setOscillatorOffset(Number(event.target.value));
        }}
      />
      <label>red:{red}</label>
      <input
        type="range"
        min="0"
        max="255"
        value={red}
        onChange={(event) => {
          handleColorChange("red", event.target.value);
        }}
      />
      <label>green:{green}</label>
      <input
        type="range"
        min="0"
        max="255"
        value={green}
        onChange={(event) => {
          handleColorChange("green", event.target.value);
        }}
      />
      <label>blue:{blue}</label>
      <input
        type="range"
        min="0"
        max="255"
        value={blue}
        onChange={(event) => {
          handleColorChange("blue", event.target.value);
        }}
      />
      <label>opacity:{alpha}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={alpha}
        onChange={(event) => {
          handleColorChange("alpha", event.target.value);
        }}
      />
      <label>line weight:{weight}</label>
      <input
        type="range"
        min="1"
        max="30"
        step="1"
        value={weight}
        onChange={(event) => {
          setWeight(event.target.value);
        }}
      />
    </form>
    </>
  );
});

export default Controls;
