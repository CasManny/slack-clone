import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { id: Id<'channels'> };
type ResponseType = Id<"channels"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useRemoveChannel = () => {
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.channels.remove);
  const mutate = useCallback(
    async (values: RequestType, Options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");
        const response = await mutation(values);
        Options?.onSuccess?.(response);
        return response;
      } catch (error) {
          setStatus('error')
        Options?.onError?.(error as Error);
        if (Options?.throwError) {
          throw Error;
        }
      } finally {
        setStatus("settled");
        Options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, error, isPending, isSettled, data, isSuccess, isError };
};
