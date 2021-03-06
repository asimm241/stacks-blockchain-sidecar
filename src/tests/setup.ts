import * as WebSocket from 'ws';
import { loadDotEnv } from '../helpers';
import { MemoryDataStore } from '../datastore/memory-store';
import { startEventServer } from '../event-stream/event-server';
import { StacksCoreRpcClient } from '../core-rpc/client';

export default async (): Promise<void> => {
  console.log('Jest - setup..');
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'test';
  }
  loadDotEnv();
  const server = await startEventServer(new MemoryDataStore(), new Map(), {
    handleBlockMessage: () => {},
    handleMempoolTxs: () => {},
  });
  Object.assign(global, { server: server });
  console.log('Waiting for RPC connection to core node..');
  await new StacksCoreRpcClient().waitForConnection(60000);
  console.log('Jest - setup done');
};
