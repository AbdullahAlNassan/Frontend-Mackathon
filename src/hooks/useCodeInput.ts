import { useState, useCallback, useRef, useEffect } from "react";

type UseCodeInputProps = {
  length?: number;
  onComplete?: (code: string) => void;
  autoFocus?: boolean;
};

export const useCodeInput = ({ 
  length = 6, 
  onComplete,
  autoFocus = true 
}: UseCodeInputProps = {}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  const setInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  }, []);

  // Auto focus first input on mount and state changes
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
    }
  }, [autoFocus]);

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < length && inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
      setFocusedIndex(index);
    }
  }, [length]);

  const handlePaste = useCallback((e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedCode = pastedData.replace(/\D/g, '').slice(0, length); // Alleen cijfers
    
    if (pastedCode.length > 0) {
      const newCode = [...code];
      
      // Vul de code in vanaf de huidige index
      for (let i = 0; i < pastedCode.length && (index + i) < length; i++) {
        newCode[index + i] = pastedCode[i];
      }
      
      setCode(newCode);
      
      // Focus op het volgende lege veld of laatste veld
      const nextEmptyIndex = newCode.findIndex((digit, i) => i >= index && digit === "");
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : Math.min(nextEmptyIndex, length - 1);
      focusInput(focusIndex);
      
      // Auto-submit als de code compleet is
      if (newCode.every(digit => digit !== "") && onComplete) {
        onComplete(newCode.join(""));
      }
    }
  }, [code, length, focusInput, onComplete]);

  const handleCodeChange = useCallback((
    index: number, 
    value: string
  ) => {
    // Alleen cijfers accepteren
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length > 1) {
      // Handle paste-like behavior voor multiple digits
      const digits = numericValue.split('').slice(0, length - index);
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newCode[index + i] = digit;
        }
      });
      
      setCode(newCode);
      
      // Focus op het volgende lege veld of laatste veld
      const nextEmptyIndex = newCode.findIndex((digit, i) => i >= index && digit === "");
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : Math.min(nextEmptyIndex + digits.length - 1, length - 1);
      focusInput(focusIndex);
      
      // Auto-submit als de code compleet is
      if (newCode.every(digit => digit !== "") && onComplete) {
        onComplete(newCode.join(""));
      }
      return;
    }
    
    // Single digit input
    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);
      
      // Auto-focus volgende input bij invoer, focus vorige bij delete
      if (numericValue && index < length - 1) {
        focusInput(index + 1);
      }
      
      // Auto-submit bij laatste karakter
      if (index === length - 1 && numericValue && onComplete) {
        const fullCode = newCode.join("");
        if (fullCode.length === length) {
          onComplete(fullCode);
        }
      }
    }
  }, [code, length, focusInput, onComplete]);

  const handleKeyDown = useCallback((
    index: number, 
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        if (!code[index] && index > 0) {
          // Leeg huidig veld en focus vorige
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);
          focusInput(index - 1);
        } else if (code[index]) {
          // Wis huidig veld maar blijf gefocust
          const newCode = [...code];
          newCode[index] = "";
          setCode(newCode);
        }
        break;
        
      case "ArrowLeft":
        e.preventDefault();
        if (index > 0) {
          focusInput(index - 1);
        }
        break;
        
      case "ArrowRight":
        e.preventDefault();
        if (index < length - 1) {
          focusInput(index + 1);
        }
        break;
        
      case "ArrowUp":
      case "ArrowDown":
        e.preventDefault();
        break;
        
      default:
        // Prevent non-numeric input
        if (e.key.length === 1 && !/\d/.test(e.key)) {
          e.preventDefault();
        }
        break;
    }
  }, [code, length, focusInput]);

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    // Select alle tekst in het input veld voor gemakkelijke vervanging
    setTimeout(() => {
      inputRefs.current[index]?.select();
    }, 0);
  }, []);

  const resetCode = useCallback(() => {
    setCode(Array(length).fill(""));
    focusInput(0);
  }, [length, focusInput]);

  const setFocusToFirst = useCallback(() => {
    focusInput(0);
  }, [focusInput]);

  const isCodeComplete = code.every(digit => digit !== "");

  return {
    code,
    setCode,
    focusedIndex,
    inputRefs: inputRefs.current,
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    resetCode,
    setFocusToFirst,
    focusInput,
    isCodeComplete
  };
};