import { useEffect, useRef } from "react";

export const useAutoFocus = (shouldFocus: boolean = true) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return ref;
};