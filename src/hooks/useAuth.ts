import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<LoginError>({});
  const [loginState, setLoginState] = useState<LoginState>('initial');
  const [user, setUser] = useState<User | null>(null);
  
  const navigate = useNavigate();

  // Simuleer backend response - CORRECTIE: setup2fa alleen voor MFA
  const simulateBackendLogin = useCallback((email: string, password: string) => {
    const scenarios = [
      // Email 2FA - directe challenge, geen setup nodig
      { status: "success", redirectUrl: "/inloggen?challenge=email", method: "email" },
      // TOTP MFA - directe challenge, geen setup nodig  
      { status: "success", redirectUrl: "/inloggen?challenge=totp", method: "mfa" },
      // MFA Setup - alleen voor TOTP wanneer gebruiker nog geen MFA heeft
      { status: "success", redirectUrl: "/inloggen?setup2fa=true&username=" + encodeURIComponent(email), method: "mfa" },
      // Directe login (geen 2FA)
      { status: "success", redirectUrl: "/dashboard", method: "direct" },
      // Error case
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

  // Handle backend response - CORRECTIE: setup2fa alleen voor MFA
  const handleBackendResponse = useCallback((response: any) => {
    if (response.status === "error") {
      setErrors({ general: response.message });
      return;
    }

    // Directe redirect naar dashboard
    if (response.redirectUrl === "/dashboard") {
      setLoginState('success');
      setTimeout(() => navigate("/dashboard"), 1000);
      return;
    }

    const url = new URL(response.redirectUrl, window.location.origin);
    
    if (url.searchParams.get('challenge') === 'email') {
      setLoginState('2fa-email');
    } else if (url.searchParams.get('challenge') === 'totp') {
      setLoginState('2fa-totp');
    } else if (url.searchParams.get('setup2fa') === 'true') {
      // SETUP2FA ALLEEN VOOR MFA (TOTP) - geen email setup!
      setLoginState('2fa-setup');
    }
  }, [navigate]);

  // Initial login
  const handleInitialLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    if (!email || !password) {
      setErrors({ 
        email: !email ? "E-mail is verplicht" : undefined,
        password: !password ? "Wachtwoord is verplicht" : undefined
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const response = simulateBackendLogin(email, password);
      handleBackendResponse(response);
    }, 1500);
  }, [email, password, simulateBackendLogin, handleBackendResponse]);

  // 2FA code verification
  const handle2FASubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      setErrors({ code: "Voer de 6-cijferige code in" });
      return;
    }

    setIsLoading(true);

    // Simuleer 2FA verificatie
    setTimeout(() => {
      try {
        const response: LoginResponse = simulate2FAVerification(fullCode, email);
        
        if (response.success) {
          // Opslaan user data
          setUser({
            id: response.userId,
            username: response.User,
            role: response.Role
          });
          
          setIsLoading(false);
          setLoginState('success');
          
          // Redirect naar dashboard met user data
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
        setCode(["", "", "", "", "", ""]);
      }
    }, 1500);
  }, [code, email, simulate2FAVerification, navigate]);

  // Resend 2FA code
  const handleResendCode = useCallback(async () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(30);
      setCode(["", "", "", "", "", ""]);
      setErrors({});
    }, 1000);
  }, []);

  // Code input management
  const handleCodeChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrors(prev => ({ ...prev, code: undefined }));
  }, [code]);

  // Clear errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setCode(["", "", "", "", "", ""]);
    setErrors({});
    setLoginState('initial');
  }, []);

  return {
    // State
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    isLoading,
    isResending,
    countdown,
    errors,
    loginState,
    user,
    
    // Actions
    handleInitialLogin,
    handle2FASubmit,
    handleResendCode,
    handleCodeChange,
    clearErrors,
    resetForm,
    setLoginState,
    setErrors
  };
};