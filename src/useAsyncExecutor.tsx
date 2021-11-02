import { useEffect, useRef, useState } from "react";
import {
  Execution,
  RxExecutor,
  IRxExecuteFn,
  IRxExecutorConfig,
  EnumStatusType,
} from "rx-executor";
import { IAsyncExecutor } from "./model";

export const useAsyncExecutor = <P, D>(
  executeFn$: IRxExecuteFn<P, D>,
  config?: IRxExecutorConfig<P, D>
): IAsyncExecutor<P, D> => {
  const [, reRender] = useState(0);
  const asyncExecutorRef = useRef(
    RxExecutor.create(executeFn$, {
      ...config,
      onExecutionChange: (execution) => {
        reRender(Math.random());
      },
    })
  );
  const asyncExecutor = asyncExecutorRef.current;
  const asyncExecutionExecuteRef = useRef(asyncExecutor.execute);
  const execute = asyncExecutionExecuteRef.current;

  const execution = asyncExecutor.execution;

  const getExecutionRef = useRef<() => Execution<P, D>>(() => {
    return asyncExecutor.execution;
  });
  const getExecution = getExecutionRef.current;
  const retryRef = useRef(asyncExecutor.retry);
  const retry = retryRef.current;

  const setDataRef = useRef(execution.setData);
  const setData = setDataRef.current;

  useEffect(() => {
    const subscription =
      asyncExecutor.concurrentExecutor.execution$.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, [asyncExecutor.concurrentExecutor.execution$]);
  return {
    executions: asyncExecutor.executions,
    status: execution.state.status,
    isLoading: execution.isLoading,
    isError: execution.isError,
    isSuccess: execution.isSuccess,
    data: execution.data,
    error: execution.error,
    errors: execution.errors,
    execution,
    execute,
    getExecution,
    retry,
    setData,
  };
};
