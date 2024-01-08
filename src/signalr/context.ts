import { HubConnectionState } from "@microsoft/signalr";
import { createUseSignalREffect } from "./hooks";
import { providerNativeFactory } from "./provider/providerNativeFactory";
import { Context, Hub } from "./types";

function createSignalRContext<T extends Hub>() {
  const events: T["callbacksName"][] = [];
  const context: Context<T> = {
    connection: null,
    useSignalREffect: null as any, // Assigned after context
    invoke(methodName: string, ...args: any[]): Promise<any> | undefined {
      if (context?.connection?.state === HubConnectionState.Connected) {
        return context.connection?.invoke(methodName, ...args);
      }
    },
    Provider: null as any, // just for ts ignore
    on: (event: string, callback: (...args: any[]) => void) => {
      if (!events.includes(event)) {
        context.connection?.on(event, callback);
        events.push(event);
      }
    },
    off: (event: string) => {
      if (events.includes(event)) {
        context.connection?.off(event);
        events.filter(e => e !== event);
      }
    }
  };

  context.Provider = providerNativeFactory(context);

  async function invoke(data: {
    methodName: string;
    args: any[];
    callbackResponse: string;
  }) {
    await context.connection?.invoke(
      data.methodName,
      ...data.args,
    );
  }

  context.useSignalREffect = createUseSignalREffect(context);

  return context;
}

export { createSignalRContext };
