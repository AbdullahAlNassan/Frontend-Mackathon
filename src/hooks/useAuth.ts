import { useState, useCallback, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCodeInput } from "./useCodeInput";
import type { User } from "../types/auth";

type AuthStep = "credentials" | "emailCode" | "totpCode" | "totpSetup" | "success";

type AuthErrors = {
  email?: string;
  password?: string;
  general?: string;
  code?: string;
};

type Scenario =
  | { kind: "direct" }
  | { kind: "email" }
  | { kind: "totp" }
  | { kind: "setup" }
  | { kind: "error"; message: string };

const createUser = (email: string): User => ({
  id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  username: email,
  role: "user",
  email,
});

const resolveScenario = (email: string): Scenario => {
  const normalized = email.trim().toLowerCase();

  if (!normalized) {
    return { kind: "error", message: "E-mailadres ontbreekt" };
  }

  if (normalized.includes("error")) {
    return { kind: "error", message: "Onjuiste inloggegevens" };
  }

  if (normalized.includes("direct")) {
    return { kind: "direct" };
  }

  if (normalized.includes("setup")) {
    return { kind: "setup" };
  }

  if (normalized.includes("totp")) {
    return { kind: "totp" };
  }

  return { kind: "email" };
};

export const useAuth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<AuthStep>("credentials");
  const [errors, setErrors] = useState<AuthErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const {
    code,
    isCodeComplete,
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    resetCode,
  } = useCodeInput({
    length: 6,
    autoFocus: step === "emailCode" || step === "totpCode",
  });

  const completeLogin = useCallback(
    (accountEmail: string) => {
      const nextUser = createUser(accountEmail);
      setUser(nextUser);
      setStep("success");

      setTimeout(() => {
        navigate("/dashboard", { state: { user: nextUser } });
      }, 600);
    },
    [navigate]
  );

  const submitCredentials = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const nextErrors: AuthErrors = {};
      if (!email.trim()) {
        nextErrors.email = "E-mail is verplicht";
      }
      if (!password.trim()) {
        nextErrors.password = "Wachtwoord is verplicht";
      }

      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        const scenario = resolveScenario(email);

        switch (scenario.kind) {
          case "error":
            setErrors({ general: scenario.message });
            break;
          case "direct":
            completeLogin(email);
            break;
          case "email":
            setStep("emailCode");
            resetCode();
            break;
          case "totp":
            setStep("totpCode");
            resetCode();
            break;
          case "setup":
            setStep("totpSetup");
            break;
        }
      }, 800);
    },
    [email, password, completeLogin, resetCode]
  );

  const submitCode = useCallback(
    (value?: string) => {
      if (step !== "emailCode" && step !== "totpCode") {
        return;
      }

      const fullCode = value ?? code.join("");

      if (fullCode.length !== 6) {
        setErrors((prev) => ({ ...prev, code: "Voer alle zes cijfers in" }));
        return;
      }

      setIsLoading(true);
      setErrors((prev) => ({ ...prev, code: undefined }));

      setTimeout(() => {
        setIsLoading(false);

        if (fullCode === "000000") {
          setErrors((prev) => ({ ...prev, code: "Deze code is ongeldig" }));
          resetCode();
          return;
        }

        completeLogin(email);
      }, 800);
    },
    [code, completeLogin, email, resetCode, step]
  );

  useEffect(() => {
    if (isCodeComplete && (step === "emailCode" || step === "totpCode")) {
      submitCode();
    }
  }, [isCodeComplete, step, submitCode]);

  const resendCode = useCallback(() => {
    if (step !== "emailCode") {
      return Promise.resolve();
    }

    setIsResending(true);
    setErrors((prev) => ({ ...prev, code: undefined }));

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsResending(false);
        resetCode();
        resolve();
      }, 600);
    });
  }, [resetCode, step]);

  const startTotpEntry = useCallback(() => {
    setStep("totpCode");
    setErrors({});
    resetCode();
  }, [resetCode]);

  const skipTotpSetup = useCallback(() => {
    setStep("credentials");
    setErrors({});
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    code,
    errors,
    step,
    isLoading,
    isResending,
    user,
    isCodeComplete,
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    submitCredentials,
    submitCode,
    resendCode,
    startTotpEntry,
    skipTotpSetup,
  };
};