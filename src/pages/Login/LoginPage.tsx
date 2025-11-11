import { useRef } from "react";
import { useAuth, useCountdown, useAutoFocus } from "../../hooks";
import { Button, Input, Form, FormField, Loader, PageLoader } from "../../components/ui";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    isLoading,
    isResending,
    errors,
    loginState,
    handleInitialLogin,
    handle2FASubmit,
    handleResendCode,
    handleCodeChange,
    setLoginState,
    setErrors
  } = useAuth();

  const { countdown, startCountdown } = useCountdown();
  const firstInputRef = useAutoFocus(loginState === '2fa-email' || loginState === '2fa-totp');

  const handleResendWithCountdown = async () => {
    await handleResendCode();
    startCountdown(30);
  };

  const handleCodeChangeWithSubmit = (index: number, value: string) => {
    handleCodeChange(index, value);
    
    if (index === 5 && value) {
      const newCode = [...code];
      newCode[index] = value;
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handle2FASubmit(new Event('submit') as any);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Focus zal nu via refs worden gedaan
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
        <FormField 
          label="E-mailadres" 
          error={errors.email}
          required
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voorbeeld@email.nl"
            disabled={isLoading}
          />
        </FormField>
        
        <FormField 
          label="Wachtwoord" 
          error={errors.password}
          required
        >
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
          />
        </FormField>
        
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

      <Form onSubmit={handle2FASubmit} spacing="md">
        <div className="login-page__code-section">
          <label className="login-page__code-label">
            Voer de 6-cijferige code in:
          </label>
          <div className="login-page__code-inputs">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={index === 0 ? firstInputRef : undefined}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChangeWithSubmit(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="login-page__code-input"
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
            onClick={handleResendWithCountdown}
            isLoading={isResending}
            disabled={isResending || countdown > 0}
            className="login-page__resend-btn"
          >
            {isResending ? "Verzenden..." : countdown > 0 ? `Opnieuw verzenden (${countdown}s)` : "Code opnieuw verzenden"}
          </Button>
        </div>
      </Form>

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

      {errors.code && (
        <div className="login-page__error-banner" role="alert">
          ⚠️ {errors.code}
        </div>
      )}

      <Form onSubmit={handle2FASubmit} spacing="md">
        <div className="login-page__code-section">
          <label className="login-page__code-label">
            Voer de 6-cijferige code in:
          </label>
          <div className="login-page__code-inputs">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={index === 0 ? firstInputRef : undefined}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChangeWithSubmit(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="login-page__code-input"
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
        </div>
      </Form>
    </>
  );

  // CORRECTIE: 2FA setup is alleen voor MFA (TOTP) - geen email optie
  const render2FASetup = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">MFA Instellen</h1>
        <p className="login-page__subtitle">
          Stel Multi-Factor Authenticatie in voor <strong>{email}</strong>
        </p>
      </div>

      <div className="login-page__setup-content">
        <div className="login-page__qr-section">
          <div className="login-page__qr-placeholder">
            <div className="login-page__qr-code">QR CODE</div>
            <p>Scan deze QR code met je authenticator app</p>
          </div>
        </div>

        <div className="login-page__setup-steps">
          <h3>Stappen:</h3>
          <ol className="login-page__steps-list">
            <li>Open je authenticator app (Google Authenticator, Authy, etc.)</li>
            <li>Scan de QR code hierboven</li>
            <li>Voer de 6-cijferige code in om te verifiëren</li>
          </ol>
        </div>

        <div className="login-page__setup-actions">
          <Button 
            variant="primary" 
            onClick={() => setLoginState('2fa-totp')}
          >
            Ik heb de QR code gescand
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              setLoginState('initial');
              setErrors({});
            }}
          >
            Later instellen
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
