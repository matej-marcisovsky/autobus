import path from 'path';

import express from 'express';
import helmet from 'helmet';

import gameRouter from './gameRouter/gameRouter.js';

const PORT = 3000;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        connectSrc: ["'self'", 'ws:', 'wss:'],
      },
    },
  }),
);

app.use('/', express.static('./dist/client/static'));

app.get('/', (req, res) => {
  res.sendFile('./dist/client/index.html', { root: path.resolve() });
});

const server = app.listen(PORT, () => {
  console.log(`Server app listening on port ${PORT}`);
});

gameRouter(server);
