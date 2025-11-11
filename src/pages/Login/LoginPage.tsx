import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Checkbox, Loader, PageLoader } from "../../components/ui";

type LoginError = {
  email?: string;
  password?: string;
  general?: string;
  code?: string;
};

type LoginState = 'initial' | '2fa-email' | '2fa-totp' | '2fa-setup' | 'success';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<LoginError>({});
  const [loginState, setLoginState] = useState<LoginState>('initial');
  const navigate = useNavigate();

  // Simuleer backend response
  const simulateBackendLogin = (email: string, password: string) => {
    // Random keuze voor demo purposes
    const scenarios = [
      { status: "success", redirectUrl: "/inloggen?challenge=email", method: "email" },
      { status: "success", redirectUrl: "/inloggen?challenge=totp", method: "mfa" },
      { status: "success", redirectUrl: "/inloggen?setup2fa=true&username=" + encodeURIComponent(email), method: "email" },
      { status: "error", message: "Onjuiste inloggegevens" }
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  // Handle backend response
  const handleBackendResponse = (response: any) => {
    if (response.status === "error") {
      setErrors({ general: response.message });
      return;
    }

    const url = new URL(response.redirectUrl, window.location.origin);
    
    if (url.searchParams.get('challenge') === 'email') {
      setLoginState('2fa-email');
    } else if (url.searchParams.get('challenge') === 'totp') {
      setLoginState('2fa-totp');
    } else if (url.searchParams.get('setup2fa') === 'true') {
      setLoginState('2fa-setup');
    } else {
      setLoginState('success');
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
      setIsLoading(false);

      if (fullCode === "000000") {
        setErrors({ code: "Onjuiste verificatiecode" });
        setCode(["", "", "", "", "", ""]);
        return;
      }

      // Succesvolle 2FA
      setLoginState('success');
      setTimeout(() => navigate("/dashboard"), 1000);
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
    }, 1000);
  };

  // Code input management
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setErrors(prev => ({ ...prev, code: undefined }));

    // Auto-focus volgende input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit bij laatste karakter
    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handle2FASubmit(new Event('submit') as any);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Countdown voor resend
  useState(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  });

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
      
      <form className="login-page__form stack" onSubmit={handleInitialLogin}>
        <Input
          label="E-mailadres"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voorbeeld@email.nl"
          required
          disabled={isLoading}
          error={errors.email}
        />
        
        <Input
          label="Wachtwoord"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isLoading}
          error={errors.password}
        />
        
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
      </form>
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

      <form className="login-page__form" onSubmit={handle2FASubmit}>
        <div className="login-page__code-section">
          <label className="login-page__code-label">
            Voer de 6-cijferige code in:
          </label>
          <div className="login-page__code-inputs">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
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
            {isResending ? "Verzenden..." : countdown > 0 ? `Opnieuw verzenden (${countdown}s)` : "Code opnieuw verzenden"}
          </Button>
        </div>
      </form>

      <div className="login-page__help">
        <p className="login-page__help-text">
          💡 <strong>Tip:</strong> Check je spam folder als je de e-mail niet kunt vinden.
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

      {/* Vergelijkbaar met email 2FA maar zonder resend optie */}
      {render2FAEmail()}
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
          <Button variant="primary" onClick={() => setLoginState('2fa-email')}>
            Email Verificatie
          </Button>
          <Button variant="ghost" onClick={() => setLoginState('2fa-totp')}>
            Authenticator App
          </Button>
        </div>
      </div>
    </>
  );

  if (loginState === 'success') {
    return <PageLoader text="Doorsturen naar dashboard..." variant="dots" />;
  }

  return (
    <div className="login-page">
      <div className="login-page__background">
        <div className="login-page__container">
          <div className="login-page__card">
            {loginState === 'initial' && renderInitialLogin()}
            {loginState === '2fa-email' && render2FAEmail()}
            {loginState === '2fa-totp' && render2FATOTP()}
            {loginState === '2fa-setup' && render2FASetup()}
          </div>
        </div>
      </div>
    </div>
  );
}