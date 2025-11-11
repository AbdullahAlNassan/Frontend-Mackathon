import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Checkbox,
  Loader,
  PageLoader,
  Form,
  FormField,
} from "../../components/ui";
import type { LoginResponse, User } from "../../types/auth";

type LoginError = {
  email?: string;
  password?: string;
  general?: string;
  code?: string;
};

type LoginState =
  | "initial"
  | "2fa-email"
  | "2fa-totp"
  | "2fa-setup"
  | "success";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<LoginError>({});
  const [loginState, setLoginState] = useState<LoginState>("initial");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Refs voor code inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown voor resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus eerste input bij 2FA
  useEffect(() => {
    if (
      (loginState === "2fa-email" || loginState === "2fa-totp") &&
      inputRefs.current[0]
    ) {
      inputRefs.current[0]?.focus();
    }
  }, [loginState]);

  // Simuleer backend response
  const simulateBackendLogin = (email: string, password: string) => {
    // Random keuze voor demo purposes
    const scenarios = [
      {
        status: "success",
        redirectUrl: "/inloggen?challenge=email",
        method: "email",
      },
      {
        status: "success",
        redirectUrl: "/inloggen?challenge=totp",
        method: "mfa",
      },
      {
        status: "success",
        redirectUrl:
          "/inloggen?setup2fa=true&username=" + encodeURIComponent(email),
        method: "email",
      },
      { status: "error", message: "Onjuiste inloggegevens" },
    ];

    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  // Simuleer backend 2FA verificatie response
  const simulate2FAVerification = (code: string): LoginResponse => {
    if (code === "000000") {
      throw new Error("Onjuiste verificatiecode");
    }

    return {
      success: true,
      message: "Login completed successfully",
      userId: "user-123",
      User: email,
      Role: "user",
    };
  };

  // Handle backend response
  const handleBackendResponse = (response: any) => {
    if (response.status === "error") {
      setErrors({ general: response.message });
      return;
    }

    const url = new URL(response.redirectUrl, window.location.origin);

    if (url.searchParams.get("challenge") === "email") {
      setLoginState("2fa-email");
    } else if (url.searchParams.get("challenge") === "totp") {
      setLoginState("2fa-totp");
    } else if (url.searchParams.get("setup2fa") === "true") {
      setLoginState("2fa-setup");
    } else {
      setLoginState("success");
      navigate("/dashboard");
    }
  };

  // Initial login
  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    if (!email || !password) {
      setErrors({
        email: !email ? "E-mail is verplicht" : undefined,
        password: !password ? "Wachtwoord is verplicht" : undefined,
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
  };

  // 2FA code verification
  const handle2FASubmit = async (e: React.FormEvent) => {
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
        const response: LoginResponse = simulate2FAVerification(fullCode);

        if (response.success) {
          // Opslaan user data
          setUser({
            id: response.userId,
            username: response.User,
            role: response.Role,
          });

          setIsLoading(false);
          setLoginState("success");

          // Redirect naar dashboard met user data
          setTimeout(() => {
            navigate("/dashboard", {
              state: {
                user: {
                  id: response.userId,
                  username: response.User,
                  role: response.Role,
                },
              },
            });
          }, 1000);
        }
      } catch (error: any) {
        setIsLoading(false);
        setErrors({ code: error.message });
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  // Resend 2FA code
  const handleResendCode = async () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(30);
      setCode(["", "", "", "", "", ""]);
      setErrors({});
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  // Code input management
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrors((prev) => ({ ...prev, code: undefined }));

    // Auto-focus volgende input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit bij laatste karakter
    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handle2FASubmit(e as any);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (
      e.key === "Backspace" &&
      !code[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Render verschillende states
  const renderInitialLogin = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Inloggen</h1>
        <p className="login-page__subtitle">Welkom terug bij ons platform</p>
      </div>

      {errors.general && (
        <div className="login-page__error-banner" role="alert">
          ⚠️ {errors.general}
        </div>
      )}

      <Form
        onSubmit={handleInitialLogin}
        spacing="md"
        className="login-page__form"
      >
        <FormField label="E-mailadres" error={errors.email} required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voorbeeld@email.nl"
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Wachtwoord" error={errors.password} required>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </FormField>

        <div className="login-page__options">
          <Checkbox
            label="Onthoud mij"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          className="login-page__submit"
        >
          {isLoading ? "Inloggen..." : "Inloggen"}
        </Button>
      </Form>
    </>
  );

  const render2FAEmail = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Beveiligingsverificatie</h1>
        <p className="login-page__subtitle">
          We hebben een verificatiecode gestuurd naar <strong>{email}</strong>
        </p>
      </div>

      {errors.code && (
        <div className="login-page__error-banner" role="alert">
          ⚠️ {errors.code}
        </div>
      )}

      <Form onSubmit={handle2FASubmit} className="login-page__form">
        <FormField error={errors.code}>
          <div className="login-page__code-section">
            <label className="login-page__code-label">
              Voer de 6-cijferige code in:
            </label>
            <div className="login-page__code-inputs">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="login-page__code-input"
                  autoFocus={index === 0}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
        </FormField>

        <div className="login-page__actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || code.join("").length !== 6}
            className="login-page__submit"
          >
            {isLoading ? "Verifiëren..." : "Verifieer"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleResendCode}
            isLoading={isResending}
            disabled={isResending || countdown > 0}
            className="login-page__resend-btn"
          >
            {isResending
              ? "Verzenden..."
              : countdown > 0
              ? `Opnieuw verzenden (${countdown}s)`
              : "Code opnieuw verzenden"}
          </Button>
        </div>
      </Form>

      <div className="login-page__help">
        <p className="login-page__help-text">
          💡 <strong>Tip:</strong> Check je spam folder als je de e-mail niet
          kunt vinden.
        </p>
      </div>
    </>
  );

  const render2FATOTP = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Authenticator Verificatie</h1>
        <p className="login-page__subtitle">
          Voer de code in van je authenticator app
        </p>
      </div>

      {errors.code && (
        <div className="login-page__error-banner" role="alert">
          ⚠️ {errors.code}
        </div>
      )}

      <Form onSubmit={handle2FASubmit} className="login-page__form">
        <FormField error={errors.code}>
          <div className="login-page__code-section">
            <label className="login-page__code-label">
              Voer de 6-cijferige code in:
            </label>
            <div className="login-page__code-inputs">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="login-page__code-input"
                  autoFocus={index === 0}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
        </FormField>

        <div className="login-page__actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || code.join("").length !== 6}
            className="login-page__submit"
          >
            {isLoading ? "Verifiëren..." : "Verifieer"}
          </Button>
        </div>
      </Form>
    </>
  );

  const render2FASetup = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">2FA Instellen</h1>
        <p className="login-page__subtitle">
          Stel twee-factor authenticatie in voor <strong>{email}</strong>
        </p>
      </div>

      <div className="login-page__setup-options">
        <p>Kies je 2FA methode:</p>
        <div className="login-page__setup-buttons">
          <Button variant="primary" onClick={() => setLoginState("2fa-email")}>
            Email Verificatie
          </Button>
          <Button variant="ghost" onClick={() => setLoginState("2fa-totp")}>
            Authenticator App
          </Button>
        </div>
      </div>
    </>
  );

  if (loginState === "success") {
    return <PageLoader text="Doorsturen naar dashboard..." variant="dots" />;
  }

  return (
    <div className="login-page">
      <div className="login-page__background">
        <div className="login-page__container">
          <div className="login-page__card">
            {loginState === "initial" && renderInitialLogin()}
            {loginState === "2fa-email" && render2FAEmail()}
            {loginState === "2fa-totp" && render2FATOTP()}
            {loginState === "2fa-setup" && render2FASetup()}
          </div>
        </div>
      </div>
    </div>
  );
}
