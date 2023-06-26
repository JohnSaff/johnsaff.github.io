import React, { useRef, useEffect, useState, createRef, useCallback } from "react";
import Controls from "./Controls";
import {
  useInterval,
  clearRect,
} from "./utils.js";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const [oscillator, setOscillator] = useState(0);
  const [controlsRefArray, setControlsRefArray] = useState([]);
  // const [isSignedIn, setIsSignedIn] = useState(false);
  // const [accessToken, setAccessToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(-1);
  const [error, setError] = useState(null);
  // const [nowPlaying, setNowPlaying] = useState("");
  // const [nowPlayingTime, setNowPlayingTime] = useState(-1);
  // const [songData, setSongData] = useState();
  // const [code,setCode] = useState('')

  useInterval(() => {
    // if (expiresIn == 0) {
    //   refreshSpotify();
    // }
    if(Math.floor(oscillator)%16 == 0){
      clearRect(canvasRef.current.getContext("2d"));
      controlsRefArray.forEach((element) => {
        element.current.draw(oscillator/1000);
      });
    }
    setOscillator(oscillator + 1);
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
      {/* {isSignedIn ? (
        <button onClick={spotifySignOut}>sign out of spotify</button>
      ) : (
        <button onClick={spotifySignInPKCE}> sign in with spotify</button>
      )} */}
      {!!error && <p>{error}</p>}
      {/* <button onClick={getAccessToken}> refresh spotify</button> */}
    </>
  );
};

export default Canvas;
