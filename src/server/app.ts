import express from "express";
import helmet from "helmet";
import path from "path";

import gameRouter from "./gameRouter/gameRouter.js";

const PORT = 3000;

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      connectSrc: ["'self'", 'ws:', 'wss:']
    },
  }
}));

app.use('/', express.static('./dist/client/static'));

app.get('/', (req, res) => {
  res.sendFile('./dist/client/index.html', { root : path.resolve() });
});

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

gameRouter(server);
