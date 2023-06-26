import { useRef, useEffect } from "react";

// slightly modified spotify provided code for dealing with PKCE auth begins...

// async function doTheSpotifyThing(){

function generateRandomString(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  function base64encode(string) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return base64encode(digest);
}

const spotifySignInPKCE = () => {
  const clientId = "6f6c7991c2244f709e780b68cf7755c1";
  const redirectUri = window.location.origin;

  let codeVerifier = generateRandomString(128);

  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    let state = generateRandomString(16);
    let scope = "user-read-playback-state";

    localStorage.setItem("code_verifier", codeVerifier);

    let args = new URLSearchParams({
      response_type: "code",
      client_id: "6f6c7991c2244f709e780b68cf7755c1",
      scope: scope,
      redirect_uri: window.location.origin,
      state: state,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    window.location = "https://accounts.spotify.com/authorize?" + args;
  });
};

const getAccessToken = (accessTokenHandler) => {
  const queryParams = getQueryParamsObject();
  let codeVerifier = localStorage.getItem("code_verifier");

  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');

  let body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: window.location.origin,
    client_id: 'jnfdvkms',
    code_verifier: codeVerifier,
  });

  const response = fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// slightly modified Spofity provided functions for dealing with the PKCE stuff ends.....

const clearRect = (context) => {
  context.clearRect(0, 0, 500, 500*16/9);
};

const refreshSpotifyAndGetQueryObject = async (handleQueryParams) => {
  window
    .fetch(getSpotifyUrl(), { redirect: "follow", cors: "no-cors" })
    .then((res) => {
      console.log(res);
      const queryParams = getQueryParamsObject(res.headers.get("location"));
      console.log(queryParams);
      handleQueryParams(queryParams);
      return queryParams;
    });
};

const getSpotifyUrl = () => {
  var client_id = "6f6c7991c2244f709e780b68cf7755c1";
  var redirect_uri = window.location.origin;
  console.log(window.location.href);

  var scope = "user-read-playback-state ";

  var url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  return url;
};

const getSpotifyUrlWithDialog = () => {
  let url = getSpotifyUrl();
  url += "&show_dialog=true";
  return url;
};

const getQueryParamsObject = () => {
  const search = window.location.search.substring(1);
  let queryParams = "";
  try {
    queryParams = JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
  } catch {
    return;
  }
  return queryParams;
};

const spotifySignIn = () => {
  window.location.href = getSpotifyUrlWithDialog();
};

const spotifySignOut = () => {
  window.location.replace(window.location.origin);
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
  spotifySignIn,
  spotifySignOut,
  getSpotifyUrl,
  getQueryParamsObject,
  getSpotifyUrlWithDialog,
  useInterval,
  spotifySignInPKCE,
  getAccessToken,
  clearRect,
};
