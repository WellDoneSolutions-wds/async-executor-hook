import { EnumStatusType, Execution } from "rx-executor";

export interface IAsyncConcurrentExecutor<P, D> {
  executions: { [key: string]: Execution<P, D> };
  status: (key: string) => string | undefined;
  isLoading: (key: string) => boolean | undefined;
  isError: (key: string) => boolean | undefined;
  isSuccess: (key: string) => boolean | undefined;
  data: (key: string) => D | undefined;
  error: (key: string) => any;
  errors: (key: string) => any[] | undefined;
  execution: (key: string) => Execution<P, D>;
  execute: (params: P) => Execution<P, D>;
  setData: (key: string, data: D | ((prev: D) => D)) => void;
}

export interface IAsyncExecutor<P, D> {
  executions: { [key: string]: Execution<P, D> };
  status?: EnumStatusType;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  data?: D;
  error: any;
  errors: any[];
  execution: Execution<P, D>;
  execute: (params: P) => void;
  getExecution: () => Execution<P, D>;
  retry: () => void;
  setData: (data: D | ((prev: D) => D)) => void;
}
