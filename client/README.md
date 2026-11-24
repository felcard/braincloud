# Braincloud client

React front end for [Braincloud](../README.md). See the root README for what the app does, how it works and how to run it.

```sh
npm run dev      # dev server on :5173, talks to the local server on :8000
npm run build    # production build in dist/, talks to the live server
```

`VITE_SERVER_URL` sets the Socket.IO server; `.env.development` points `npm run dev` at the local one.
