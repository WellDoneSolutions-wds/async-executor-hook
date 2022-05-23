import { useEffect, useReducer, useRef } from "react";
import { IExecutor, IRxExecuteFn2, RxExecutor2 } from "rx-executor";

export const useAsyncExecutor2 = <P extends any, D extends any>(
  executeFn$: IRxExecuteFn2<P, D>,
  config?: IExecutor<P, D>
) => {
  const asyncExecutorRef = useRef(RxExecutor2.create(executeFn$, config));
  const asyncExecutor = asyncExecutorRef.current;

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const subscription = asyncExecutor.state$.subscribe((x) => {
      forceUpdate();
    });
    return () => {
      asyncExecutor.close();
      subscription.unsubscribe();
    };
  }, [asyncExecutor]);

  return asyncExecutor;
};
