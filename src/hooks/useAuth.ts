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

  // Gebruik verbeterde useCodeInput hook
  const {
    code,
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    resetCode,
    setFocusToFirst,
    isCodeComplete
  } = useCodeInput({
    length: 6,
    onComplete: (fullCode) => {
      // Auto-submit wanneer code compleet is
      handle2FASubmit(fullCode);
    },
    autoFocus: loginState === '2fa-email' || loginState === '2fa-totp'
  });

  // Simuleer backend response - setup2fa ALLEEN voor MFA
  const simulateBackendLogin = useCallback((email: string, password: string) => {
    // Bepaal scenario op basis van email voor consistente testing
    const emailHash = email.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const scenarios = [
      // Email 2FA - directe challenge, geen setup nodig
      { status: "success", redirectUrl: "/inloggen?challenge=email", method: "email" },
      // TOTP MFA - directe challenge, geen setup nodig  
      { status: "success", redirectUrl: "/inloggen?challenge=totp", method: "mfa" },
      // MFA Setup - ALLEEN voor TOTP wanneer gebruiker nog geen MFA heeft
      // Deze wordt alleen getriggerd voor specifieke emails om te testen
      { status: "success", redirectUrl: "/inloggen?setup2fa=true&username=" + encodeURIComponent(email), method: "mfa" },
      // Directe login (geen 2FA)
      { status: "success", redirectUrl: "/dashboard", method: "direct" },
      // Error case
      { status: "error", message: "Onjuiste inloggegevens" }
    ];
    
    // Gebruik email hash voor consistente scenario selectie
    const scenarioIndex = Math.abs(emailHash) % scenarios.length;
    return scenarios[scenarioIndex];
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

  // Handle backend response - setup2fa ALLEEN voor MFA
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
      // Email 2FA - directe verificatie
      setLoginState('2fa-email');
    } else if (url.searchParams.get('challenge') === 'totp') {
      // TOTP MFA - directe verificatie
      setLoginState('2fa-totp');
    } else if (url.searchParams.get('setup2fa') === 'true') {
      // MFA Setup - ALLEEN voor TOTP (authenticator app)
      // Dit is NOOIT voor email 2FA
      setLoginState('2fa-setup');
    }
  }, [navigate]);

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

  // 2FA code verification - voor zowel email als TOTP
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
        resetCode();
      }
    }, 1500);
  }, [code, email, simulate2FAVerification, navigate, resetCode]);

  // Resend 2FA code - ALLEEN voor email 2FA
  const handleResendCode = useCallback(async () => {
    if (loginState !== '2fa-email') return;
    
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(30);
      resetCode();
      setErrors({});
    }, 1000);
  }, [loginState, resetCode]);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    resetCode();
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
    isCodeComplete,
    
    // Refs en code handlers
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    
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