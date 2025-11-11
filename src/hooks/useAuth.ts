import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCodeInput } from "./useCodeInput";
import type { User, LoginResponse } from "../types/auth";

type LoginError = {
  email?: string;
  password?: string;
  general?: string;
  code?: string;
};

type LoginState = 'initial' | '2fa-email' | '2fa-totp' | '2fa-setup' | 'success';

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<LoginError>({});
  const [loginState, setLoginState] = useState<LoginState>('initial');
  const [user, setUser] = useState<User | null>(null);
  
  const navigate = useNavigate();

  // Gebruik useCodeInput hook ipv eigen state management
  const {
    code,
    setCode,
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    resetCode,
    setFocusToFirst
  } = useCodeInput(6);

  // Simuleer backend response
  const simulateBackendLogin = useCallback((email: string, password: string) => {
    const scenarios = [
      { status: "success", redirectUrl: "/inloggen?challenge=email", method: "email" },
      { status: "success", redirectUrl: "/inloggen?challenge=totp", method: "mfa" },
      { status: "success", redirectUrl: "/inloggen?setup2fa=true&username=" + encodeURIComponent(email), method: "mfa" },
      { status: "success", redirectUrl: "/dashboard", method: "direct" },
      { status: "error", message: "Onjuiste inloggegevens" }
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }, []);

  // Simuleer backend 2FA verificatie response
  const simulate2FAVerification = useCallback((code: string, email: string): LoginResponse => {
    if (code === "000000") {
      throw new Error("Onjuiste verificatiecode");
    }

    return {
      success: true,
      message: "Login completed successfully",
      userId: "user-" + Math.random().toString(36).substr(2, 9),
      User: email,
      Role: "user"
    };
  }, []);

  // Handle backend response
  const handleBackendResponse = useCallback((response: any) => {
    if (response.status === "error") {
      setErrors({ general: response.message });
      return;
    }

    if (response.redirectUrl === "/dashboard") {
      setLoginState('success');
      setTimeout(() => navigate("/dashboard"), 1000);
      return;
    }

    const url = new URL(response.redirectUrl, window.location.origin);
    
    if (url.searchParams.get('challenge') === 'email') {
      setLoginState('2fa-email');
      // Focus eerste input wanneer 2FA scherm wordt getoond
      setTimeout(() => setFocusToFirst(), 100);
    } else if (url.searchParams.get('challenge') === 'totp') {
      setLoginState('2fa-totp');
      setTimeout(() => setFocusToFirst(), 100);
    } else if (url.searchParams.get('setup2fa') === 'true') {
      setLoginState('2fa-setup');
    }
  }, [navigate, setFocusToFirst]);

  // Initial login
  const handleInitialLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({ 
        email: !email ? "E-mail is verplicht" : undefined,
        password: !password ? "Wachtwoord is verplicht" : undefined
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const response = simulateBackendLogin(email, password);
      handleBackendResponse(response);
    }, 1500);
  }, [email, password, simulateBackendLogin, handleBackendResponse]);

  // 2FA code verification
  const handle2FASubmit = useCallback(async (codeToVerify?: string) => {
    const fullCode = codeToVerify || code.join("");
    
    if (fullCode.length !== 6) {
      setErrors({ code: "Voer de 6-cijferige code in" });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const response: LoginResponse = simulate2FAVerification(fullCode, email);
        
        if (response.success) {
          setUser({
            id: response.userId,
            username: response.User,
            role: response.Role
          });
          
          setIsLoading(false);
          setLoginState('success');
          
          setTimeout(() => {
            navigate("/dashboard", { 
              state: { 
                user: {
                  id: response.userId,
                  username: response.User,
                  role: response.Role
                }
              }
            });
          }, 1000);
        }
      } catch (error: any) {
        setIsLoading(false);
        setErrors({ code: error.message });
        resetCode(); // Reset code met proper hook
      }
    }, 1500);
  }, [code, email, simulate2FAVerification, navigate, resetCode]);

  // Resend 2FA code
  const handleResendCode = useCallback(async () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(30);
      resetCode(); // Reset code met proper hook
      setErrors({});
    }, 1000);
  }, [resetCode]);

  // Auto-submit handler voor useCodeInput
  const handleAutoSubmit = useCallback((fullCode: string) => {
    handle2FASubmit(fullCode);
  }, [handle2FASubmit]);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    resetCode(); // Reset code met proper hook
    setErrors({});
    setLoginState('initial');
  }, [resetCode]);

  return {
    // State
    email,
    setEmail,
    password,
    setPassword,
    code,
    isLoading,
    isResending,
    countdown,
    errors,
    loginState,
    user,
    
    // Refs en code handlers
    setInputRef,
    handleCodeChange: (index: number, value: string) => 
      handleCodeChange(index, value, handleAutoSubmit),
    handleKeyDown,
    
    // Actions
    handleInitialLogin,
    handle2FASubmit,
    handleResendCode,
    clearErrors,
    resetForm,
    setLoginState,
    setErrors
  };
};