import { useEffect, useRef, useState } from "react";
import {
  IRxExecuteFn,
  IRxExecutorConfig,
  RxConcurrentExecutor,
} from "rx-executor";
import { IAsyncConcurrentExecutor } from "./model";

export const useAsyncConcurrentExecutor = <P, D>(
  executeFn$: IRxExecuteFn<P, D>,
  config?: IRxExecutorConfig<P, D>
): IAsyncConcurrentExecutor<P, D> => {
  const [, reRender] = useState(0);
  const asyncExecutorRef = useRef(
    RxConcurrentExecutor.create(executeFn$, {
      ...config,
      onExecutionChange: (execution) => {
        reRender(Math.random());
      },
      processingType: config
        ? config.processingType
          ? config.processingType
          : "MERGE"
        : "MERGE",
    })
  );
  const asyncExecutor = asyncExecutorRef.current;
  const asyncExecutionExecuteRef = useRef(asyncExecutor.execute);
  const execute = asyncExecutionExecuteRef.current;

  useEffect(() => {
    const subscription = asyncExecutor.execution$.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [asyncExecutor.execution$]);

  const isLoadingRef = useRef(asyncExecutor.isLoading);
  const isLoading = isLoadingRef.current;

  const isErrorRef = useRef(asyncExecutor.isError);
  const isError = isErrorRef.current;

  const isSuccessRef = useRef(asyncExecutor.isSuccess);
  const isSuccess = isSuccessRef.current;

  const dataRef = useRef(asyncExecutor.data);
  const data = dataRef.current;

  const errorRef = useRef(asyncExecutor.error);
  const error = errorRef.current;

  const errorsRef = useRef(asyncExecutor.errors);
  const errors = errorsRef.current;

  const statusRef = useRef(asyncExecutor.status);
  const status = statusRef.current;

  const executionRef = useRef(asyncExecutor.getExecution);
  const execution = executionRef.current;

  const setDataRef = useRef(asyncExecutor.setData);
  const setData = setDataRef.current;

  return {
    executions: asyncExecutor.executions,
    status,
    isLoading,
    isError,
    isSuccess,
    data,
    error,
    errors,
    execution,
    execute,
    setData,
  };
};
