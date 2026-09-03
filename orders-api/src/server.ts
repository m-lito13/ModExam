import { config } from './config/env';
import { buildContainer } from './container';
import { createApp } from './app';

const container = buildContainer();
const app = createApp(container);

app.listen(config.port, () => {
  console.log(`Orders summary backend listening on port ${config.port} (DB_PROVIDER=${config.dbProvider})`);
});
