import { useRef, useEffect } from "react";

const clearRect = (current) => {
  current.getContext("2d").clearRect(0, 0, current.width, current.height);
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
