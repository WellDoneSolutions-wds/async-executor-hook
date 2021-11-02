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

  const isLoadingRef = useRef((key: string) => asyncExecutor.isLoading(key));
  const isLoading = isLoadingRef.current;

  const isErrorRef = useRef((key: string) => asyncExecutor.isError(key));
  const isError = isErrorRef.current;

  const isSuccessRef = useRef((key: string) => asyncExecutor.isSuccess(key));
  const isSuccess = isSuccessRef.current;

  const dataRef = useRef((key: string) => asyncExecutor.data(key));
  const data = dataRef.current;

  const errorRef = useRef((key: string) => asyncExecutor.error(key));
  const error = errorRef.current;

  const errorsRef = useRef((key: string) => asyncExecutor.errors(key));
  const errors = errorsRef.current;

  const statusRef = useRef((key: string) => asyncExecutor.status(key));
  const status = statusRef.current;

  const executionRef = useRef((key: string) => asyncExecutor.getExecution(key));
  const execution = executionRef.current;

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
  };
};
