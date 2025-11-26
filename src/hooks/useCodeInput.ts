import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type UseCodeInputProps = {
  length?: number;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
};

export const useCodeInput = ({
  length = 6,
  onComplete,
  autoFocus = true,
}: UseCodeInputProps = {}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const runOnComplete = useCallback(
    (next: string[]) => {
      if (onComplete && next.every(Boolean)) {
        onComplete(next.join(""));
      }
    },
    [onComplete]
  );

  const updateCode = useCallback(
    (next: string[]) => {
      setCode(next);
      runOnComplete(next);
    },
    [runOnComplete]
  );

  const handleCodeChange = useCallback(
    (index: number, rawValue: string) => {
      const value = rawValue.replace(/\D/g, "");

      if (!value) {
        if (!code[index]) return;
        const next = [...code];
        next[index] = "";
        updateCode(next);
        return;
      }

      const digits = value.split("").slice(0, length - index);
      const next = [...code];

      digits.forEach((digit, offset) => {
        next[index + offset] = digit;
      });

      updateCode(next);
      const nextIndex = Math.min(index + digits.length, length - 1);
      focusInput(nextIndex);
    },
    [code, focusInput, length, updateCode]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const next = [...code];

        if (next[index]) {
          next[index] = "";
          updateCode(next);
          return;
        }

        if (index > 0) {
          next[index - 1] = "";
          updateCode(next);
          focusInput(index - 1);
        }
        return;
      }

      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
        return;
      }

      if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
        return;
      }

      if (e.key.length === 1 && !/\d/.test(e.key)) {
        e.preventDefault();
      }
    },
    [code, focusInput, length, updateCode]
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent, index: number) => {
      event.preventDefault();
      const digits = event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length - index);

      if (!digits) return;

      const next = [...code];
      digits.split("").forEach((digit, offset) => {
        next[index + offset] = digit;
      });

      updateCode(next);
      const targetIndex = Math.min(index + digits.length, length - 1);
      focusInput(targetIndex);
    },
    [code, focusInput, length, updateCode]
  );

  const handleFocus = useCallback((index: number) => {
    const node = inputRefs.current[index];
    if (node) {
      node.setSelectionRange(0, node.value.length);
    }
  }, []);

  const resetCode = useCallback(() => {
    updateCode(Array(length).fill(""));
    focusInput(0);
  }, [focusInput, length, updateCode]);

  return {
    code,
    isCodeComplete: code.every(Boolean),
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    resetCode,
  };
};