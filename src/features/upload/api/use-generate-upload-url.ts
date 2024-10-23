import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";

type ResponseType = string | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useGenerateUploadUrl = () => {
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.upload.generateUploadUrl);
  const mutate = useCallback(
    async (_values: {}, Options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");
        const response = await mutation();
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
