import React, { FC, ReactNode, useReducer, useRef } from "react";
import { RxExecutor2 } from "rx-executor";

export const AsyncExecutorPoolContext = React.createContext<{
  getExecutor: (key: string) => RxExecutor2<any, any> | void;
  addExecutor: (key: string, executor: RxExecutor2<any, any>) => void;
}>({
  getExecutor: () => {},
  addExecutor: (key: string, executor: RxExecutor2<any, any>) => {},
});

export const useAsyncExecutorPool = (key: string) => {
  return React.useContext(AsyncExecutorPoolContext);
};

export interface IAsyncExecutorPoolProvider {
  children: ReactNode;
}

export const AsyncExecutorPoolProvider: FC<IAsyncExecutorPoolProvider> = ({
  children,
}) => {
  const executorRef = useRef<{ [key: string]: RxExecutor2<any, any> }>({});

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return (
    <AsyncExecutorPoolContext.Provider
      value={{
        getExecutor: (key) => {
          return executorRef.current[key];
        },
        addExecutor: (key, executor) => {
          executorRef.current[key] = executor;
          forceUpdate();
        },
      }}
    >
      {children}
    </AsyncExecutorPoolContext.Provider>
  );
};
