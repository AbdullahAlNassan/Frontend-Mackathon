import type { FormEvent } from "react";
import { useAuth, useCountdown } from "../../hooks";
import { Button, Input, Form, FormField, PageLoader } from "../../components/ui";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    code,
    errors,
    step,
    isLoading,
    isResending,
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
  } = useAuth();

  const { countdown, startCountdown } = useCountdown();

  const handleResend = async () => {
    await resendCode();
    startCountdown(30);
  };

  const handleCodeFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitCode();
  };

  const renderCredentials = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Inloggen</h1>
        <p className="login-page__subtitle">Voer je gegevens in om verder te gaan</p>
      </div>

      {errors.general && (
        <div className="login-page__error-banner" role="alert">
          {errors.general}
        </div>
      )}

      <Form onSubmit={submitCredentials} spacing="md" className="login-page__form">
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

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          className="login-page__submit"
        >
          {isLoading ? "Bezig..." : "Inloggen"}
        </Button>
      </Form>

      <div className="login-page__demo-hint">
        <p>Tip: gebruik <code>totp@voorbeeld.nl</code> of <code>setup@voorbeeld.nl</code> om de MFA-stromen te testen.</p>
      </div>
    </>
  );

  const renderCodeInputs = () => (
    <div className="login-page__code-inputs">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={setInputRef(index)}
          className="login-page__code-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(event) => handleCodeChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(event, index)}
          onFocus={() => handleFocus(index)}
          aria-label={`Cijfer ${index + 1} van 6`}
          disabled={isLoading}
        />
      ))}
    </div>
  );

  const renderCodeStep = (variant: "email" | "totp") => {
    const titles = {
      email: {
        title: "E-mail verificatie",
        subtitle: (
          <>
            We hebben een code gestuurd naar <strong>{email}</strong>.
          </>
        ),
      },
      totp: {
        title: "Authenticator app",
        subtitle: <>Voer de code uit je authenticator app in.</>,
      },
    };

    return (
      <>
        <div className="login-page__header">
          <h1 className="login-page__title">{titles[variant].title}</h1>
          <p className="login-page__subtitle">{titles[variant].subtitle}</p>
        </div>

        {errors.code && (
          <div className="login-page__error-banner" role="alert">
            {errors.code}
          </div>
        )}

        <Form onSubmit={handleCodeFormSubmit} spacing="md">
          <div className="login-page__code-section">
            <label className="login-page__code-label">Voer de 6-cijferige code in</label>
            {renderCodeInputs()}
            <div className="login-page__code-hint">Plakken (Ctrl+V) mag ook.</div>
          </div>

          <div className="login-page__actions">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || !isCodeComplete}
              className="login-page__submit"
            >
              {isLoading ? "Controleren..." : "Verifieer"}
            </Button>

            {variant === "email" && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
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
            )}
          </div>
        </Form>
      </>
    );
  };

  const renderTotpSetup = () => (
    <>
      <div className="login-page__header">
        <h1 className="login-page__title">Authenticator instellen</h1>
        <p className="login-page__subtitle">
          Scan de code met je app en voer daarna de verificatiecode in.
        </p>
      </div>

      <div className="login-page__setup-content">
        <div className="login-page__qr-section">
          <div className="login-page__qr-placeholder">
            <div className="login-page__qr-code">
              <div className="login-page__qr-placeholder-text">QR</div>
            </div>
            <p>Scan met je authenticator app.</p>
          </div>
        </div>

        <div className="login-page__setup-steps">
          <h3>Zo stel je het in:</h3>
          <ol className="login-page__steps-list">
            <li>Open je authenticator app.</li>
            <li>Scan de QR-code of gebruik de geheime sleutel.</li>
            <li>Voer de gegenereerde code in.</li>
          </ol>

          <div className="login-page__manual-setup">
            <h4>Geheime sleutel</h4>
            <p>
              <code>JBSWY3DPEHPK3PXP</code>
            </p>
          </div>
        </div>

        <div className="login-page__setup-actions">
          <Button
            variant="primary"
            onClick={startTotpEntry}
            className="login-page__setup-continue"
          >
            Ik heb mijn app gekoppeld
          </Button>

          <Button
            variant="ghost"
            onClick={skipTotpSetup}
            className="login-page__setup-skip"
          >
            Sla voor nu over
          </Button>
        </div>
      </div>
    </>
  );

  if (step === "success") {
    return <PageLoader text="Doorsturen naar dashboard..." variant="dots" />;
  }

  return (
    <div className="login-page">
      <div className="login-page__background">
        <div className="login-page__container">
          <div className="login-page__card">
            {step === "credentials" && renderCredentials()}
            {step === "emailCode" && renderCodeStep("email")}
            {step === "totpCode" && renderCodeStep("totp")}
            {step === "totpSetup" && renderTotpSetup()}
          </div>
        </div>
      </div>
    </div>
  );
}