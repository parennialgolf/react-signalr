import { HubConnection } from "@microsoft/signalr";
import { DependencyList } from "react";
import { ProviderProps } from './provider/types';

export interface Context<T extends Hub> {
  Provider: (Props: ProviderProps) => JSX.Element;
  connection: HubConnection | null;
  invoke: <
    E extends T["methodsName"],
    C extends Parameters<T["methods"][E]>,
    R = any,
  >(
    methodName: E,
    ...args: C
  ) => Promise<R> | undefined;
  useSignalREffect: <E extends T["callbacksName"], C extends T["callbacks"][E]>(
    events: E,
    callback: C,
    deps: DependencyList,
  ) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string) => void;
}

export interface Hub<T extends string = string, M extends string = string> {
  callbacksName: T;
  methodsName: M;
  callbacks: {
    [name in T]: <F extends (...args: any) => any>(
      ...args: Parameters<F>
    ) => void;
  };
  methods: {
    [name in M]: <F extends (...args: any) => any>(
      ...args: Parameters<F>
    ) => void;
  };
}
