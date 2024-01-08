import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IHttpConnectionOptions,
} from "@microsoft/signalr";
import { useCallback, useRef } from "react";

function useEvent<T extends undefined | ((...args: any[]) => any)>(prop: T): T {
  const ref = useRef<T>(prop);
  if (ref.current !== prop) {
    ref.current = prop;
  }

  const callback = useCallback((...args: any[]) => {
    return ref.current!(...args);
  }, []) as T;

  return prop ? callback : prop;
}

function isConnectionConnecting(connection: HubConnection) {
  return (
    connection.state === HubConnectionState.Connected ||
    connection.state === HubConnectionState.Reconnecting ||
    connection.state === HubConnectionState.Connecting
  );
}

function createConnection(
  url: string,
  transportType: IHttpConnectionOptions,
  automaticReconnect = true,
) {
  let connectionBuilder = new HubConnectionBuilder().withUrl(
    url,
    transportType,
  );

  if (automaticReconnect) {
    connectionBuilder = connectionBuilder.withAutomaticReconnect();
  }

  if (transportType.logger) {
    connectionBuilder = connectionBuilder.configureLogging(
      transportType.logger,
    );
  }

  const connection = connectionBuilder.build();

  return connection;
}

export { isConnectionConnecting, createConnection, useEvent };
