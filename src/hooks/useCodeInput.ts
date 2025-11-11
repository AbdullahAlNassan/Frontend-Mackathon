import { useState, useCallback, useRef } from "react";

export const useCodeInput = (length: number = 6) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  }, []);

  const focusInput = useCallback((index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  }, []);

  const handleCodeChange = useCallback((
    index: number, 
    value: string, 
    onAutoSubmit?: (code: string) => void
  ) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus volgende input
    if (value && index < length - 1) {
      focusInput(index + 1);
    }

    // Auto-submit bij laatste karakter
    if (index === length - 1 && value && onAutoSubmit) {
      const fullCode = newCode.join("");
      if (fullCode.length === length) {
        onAutoSubmit(fullCode);
      }
    }
  }, [code, length, focusInput]);

  const handleKeyDown = useCallback((
    index: number, 
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      focusInput(index - 1);
    }
  }, [code, focusInput]);

  const resetCode = useCallback(() => {
    setCode(Array(length).fill(""));
    focusInput(0);
  }, [length, focusInput]);

  const setFocusToFirst = useCallback(() => {
    focusInput(0);
  }, [focusInput]);

  return {
    code,
    setCode,
    inputRefs: inputRefs.current,
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    resetCode,
    setFocusToFirst,
    focusInput
  };
};