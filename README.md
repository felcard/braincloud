# Braincloud

A live word cloud: people submit words and watch the cloud grow in real time over WebSockets.

Live demo: https://braincloud.netlify.app/

## Repository layout

| Folder | What it is | Deployed to |
| --- | --- | --- |
| [`client/`](client) | React front end (d3-cloud) | Netlify (base directory `client`) |
| [`server/`](server) | Node.js + Socket.IO server | Koyeb (work directory `server`) |

> This repository combines the former `brainstorm` (client) and `brainstorm-be` (server) repositories, with their full commit history. A full README is coming with the room-based redesign.
