import { useRef, useEffect } from "react";

const clearRect = (context) => {
  context.clearRect(0, 0, 500, 500*16/9);
};

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay, savedCallback]);
}

export {
  useInterval,
  clearRect,
};
