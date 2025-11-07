import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Input, Loader, PageLoader } from "../../components/ui";

export default function TwoFactorEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const username = searchParams.get("username") || "";

  // Countdown voor opnieuw verzenden
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus eerste input
  useEffect(() => {
    const firstInput = document.getElementById("code-0");
    firstInput?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus volgende input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit bij laatste karakter
    if (index === 5 && value) {
      const fullCode = newCode.join("");
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const fullCode = verificationCode || code.join("");
    
    if (fullCode.length !== 6) {
      setError("Voer de 6-cijferige code in");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simuleer 2FA verificatie
    setTimeout(() => {
      setIsLoading(false);

      // Simuleer foute code
      if (fullCode === "000000") {
        setError("Onjuiste verificatiecode. Probeer opnieuw.");
        // Reset code bij fout
        setCode(["", "", "", "", "", ""]);
        const firstInput = document.getElementById("code-0");
        firstInput?.focus();
        return;
      }

      // Succesvolle verificatie
      navigate("/dashboard");
    }, 2000);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    // Simuleer opnieuw verzenden
    setTimeout(() => {
      setIsResending(false);
      setCountdown(30); // 30 seconden wachten
      setCode(["", "", "", "", "", ""]);
      
      // Focus eerste input
      const firstInput = document.getElementById("code-0");
      firstInput?.focus();
    }, 1000);
  };

  if (isLoading) {
    return <PageLoader text="Verifiëren..." variant="dots" />;
  }

  return (
    <div className="two-factor-page">
      <div className="two-factor-page__background">
        <div className="two-factor-page__container">
          <div className="two-factor-page__card">
            <div className="two-factor-page__header">
              <h1 className="two-factor-page__title">Beveiligingsverificatie</h1>
              <p className="two-factor-page__subtitle">
                We hebben een verificatiecode gestuurd naar <strong>{username || "jouw e-mail"}</strong>
              </p>
            </div>

            {error && (
              <div className="two-factor-page__error" role="alert">
                ⚠️ {error}
              </div>
            )}

            <div className="two-factor-page__form">
              <div className="two-factor-page__code-inputs">
                <label className="two-factor-page__code-label">
                  Voer de 6-cijferige code in:
                </label>
                <div className="two-factor-page__inputs-container">
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
                      className="two-factor-page__code-input"
                      autoFocus={index === 0}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <div className="two-factor-page__actions">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleVerify()}
                  isLoading={isLoading}
                  disabled={isLoading || code.join("").length !== 6}
                  className="two-factor-page__verify-btn"
                >
                  {isLoading ? "Verifiëren..." : "Verifieer"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendCode}
                  isLoading={isResending}
                  disabled={isResending || countdown > 0}
                  className="two-factor-page__resend-btn"
                >
                  {isResending ? "Verzenden..." : countdown > 0 ? `Opnieuw verzenden (${countdown}s)` : "Code opnieuw verzenden"}
                </Button>
              </div>
            </div>

            <div className="two-factor-page__help">
              <p className="two-factor-page__help-text">
                💡 <strong>Tip:</strong> Check je spam folder als je de e-mail niet kunt vinden.
                De code verloopt over 10 minuten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}