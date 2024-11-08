import { createApp } from "./lib";

createApp()
  .then(app => app.listen({
    port: Number(process.env["PORT"] ?? 3001),
    host: process.env["HOST"] ?? "0.0.0.0"
  }));
