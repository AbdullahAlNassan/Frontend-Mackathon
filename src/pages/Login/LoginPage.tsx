import { useAuth, useCountdown } from "../../hooks";
import { Button, Input, Form, FormField, PageLoader } from "../../components/ui";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    code,
    isLoading,
    isResending,
    errors,
    loginState,
    setInputRef,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleFocus,
    handleInitialLogin,
    handle2FASubmit,
    handleResendCode,
    setLoginState,
    setErrors,
    isCodeComplete
  } = useAuth();

  const { countdown, startCountdown } = useCountdown();

  const handleResendWithCountdown = async () => {
    await handleResendCode();
    startCountdown(30);
  };

  const handleForm2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handle2FASubmit();
  };

  // Render functies
  const renderInitialLogin = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Inloggen</h1>
        <p className="login-page__subtitle">Welkom terug bij ons platform</p>
      </div>

      {errors.general && (
        <div className="login-page__error-banner" role="alert">
          {errors.general}
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

      {/* Demo hints */}
      <div className="login-page__demo-hint">
        <p><strong>Demo accounts:</strong></p>
        <ul>
          <li>Elke email werkt</li>
          <li>setup2fa scenario: gebruik "mfa@voorbeeld.nl"</li>
          <li>Foute code: gebruik "000000"</li>
        </ul>
      </div>
    </>
  );

  const render2FAEmail = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">E-mail Verificatie</h1>
        <p className="login-page__subtitle">
          We hebben een verificatiecode gestuurd naar <strong>{email}</strong>
        </p>
      </div>

      {errors.code && (
        <div className="login-page__error-banner" role="alert">
          {errors.code}
        </div>
      )}

      <Form onSubmit={handleForm2FASubmit} spacing="md">
        <div className="login-page__code-section">
          <label className="login-page__code-label">
            Voer de 6-cijferige code in:
          </label>
          <div className="login-page__code-inputs">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={setInputRef(index)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(e, index)}
                onFocus={() => handleFocus(index)}
                className="login-page__code-input"
                disabled={isLoading}
                aria-label={`Cijfer ${index + 1} van 6`}
              />
            ))}
          </div>
          <div className="login-page__code-hint">
            Tip: Je kunt de code ook plakken (Ctrl+V)
          </div>
        </div>

        <div className="login-page__actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || !isCodeComplete}
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
          <strong>Tip:</strong> Check je spam folder als je de e-mail niet kunt vinden.
        </p>
      </div>
    </>
  );

  const render2FATOTP = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Authenticator App</h1>
        <p className="login-page__subtitle">
          Voer de code in van je authenticator app
        </p>
      </div>

      {errors.code && (
        <div className="login-page__error-banner" role="alert">
          {errors.code}
        </div>
      )}

      <Form onSubmit={handleForm2FASubmit} spacing="md">
        <div className="login-page__code-section">
          <label className="login-page__code-label">
            Voer de 6-cijferige code in:
          </label>
          <div className="login-page__code-inputs">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={setInputRef(index)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => handlePaste(e, index)}
                onFocus={() => handleFocus(index)}
                className="login-page__code-input"
                disabled={isLoading}
                aria-label={`Cijfer ${index + 1} van 6`}
              />
            ))}
          </div>
          <div className="login-page__code-hint">
            Tip: Je kunt de code ook plakken (Ctrl+V)
          </div>
        </div>

        <div className="login-page__actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || !isCodeComplete}
            className="login-page__submit"
          >
            {isLoading ? "Verifiëren..." : "Verifieer"}
          </Button>
        </div>
      </Form>
    </>
  );

  // MFA SETUP - ALLEEN voor TOTP (authenticator app), NOOIT voor email
  const render2FASetup = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Authenticator App Instellen</h1>
        <p className="login-page__subtitle">
          Stel je authenticator app in voor <strong>{email}</strong>
        </p>
        <p className="login-page__setup-info">
          <strong>Multi-Factor Authenticatie (MFA)</strong> voegt een extra beveiligingslaag toe met je authenticator app.
        </p>
      </div>

      <div className="login-page__setup-content">
        <div className="login-page__qr-section">
          <div className="login-page__qr-placeholder">
            <div className="login-page__qr-code">
              <div className="login-page__qr-placeholder-text">
                QR Code
                <br />
                <small>(Placeholder voor demo)</small>
              </div>
            </div>
            <p>Scan deze QR code met je authenticator app</p>
          </div>
        </div>

        <div className="login-page__setup-steps">
          <h3>Stappen om in te stellen:</h3>
          <ol className="login-page__steps-list">
            <li><strong>Download een authenticator app</strong> zoals Google Authenticator, Authy, of Microsoft Authenticator</li>
            <li><strong>Scan de QR code</strong> hierboven met je app</li>
            <li><strong>Voer de 6-cijferige code</strong> in die je app genereert</li>
          </ol>
          
          <div className="login-page__manual-setup">
            <h4>Handmatig instellen:</h4>
            <p>Secret key: <code>JBSWY3DPEHPK3PXP</code></p>
          </div>
        </div>

        <div className="login-page__setup-actions">
          <Button 
            variant="primary" 
            onClick={() => setLoginState('2fa-totp')}
            className="login-page__setup-continue"
          >
            Ik heb mijn authenticator app ingesteld
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              setLoginState('initial');
              setErrors({});
            }}
            className="login-page__setup-skip"
          >
            MFA later instellen
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