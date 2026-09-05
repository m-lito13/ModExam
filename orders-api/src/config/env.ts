import dotenv from 'dotenv';

dotenv.config();

export type DbProvider = 'memory' | 'elasticsearch';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  dbProvider: DbProvider;
  elasticsearch: {
    node: string;
    ordersIndex: string;
  };
}

export const config: AppConfig = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  dbProvider: (process.env.DB_PROVIDER as DbProvider) ?? 'memory',
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE ?? 'http://localhost:9200',
    ordersIndex: process.env.ELASTICSEARCH_ORDERS_INDEX ?? 'orders',
  },
};
