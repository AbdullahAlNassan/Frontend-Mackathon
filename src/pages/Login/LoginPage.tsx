import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Checkbox, Loader, PageLoader } from "../../components/ui";

type LoginError = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [errors, setErrors] = useState<LoginError>({});
  const navigate = useNavigate();

  // Client-side validatie
  const validateForm = (): boolean => {
    const newErrors: LoginError = {};

    // Email validatie
    if (!email) {
      newErrors.email = "E-mailadres is verplicht";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Voer een geldig e-mailadres in";
    }

    // Wachtwoord validatie
    if (!password) {
      newErrors.password = "Wachtwoord is verplicht";
    } else if (password.length < 6) {
      newErrors.password = "Wachtwoord moet minimaal 6 tekens bevatten";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simuleer backend response voor onjuiste gegevens
  const simulateBackendError = (email: string, password: string): boolean => {
    // Simuleer foute inlogpoging (bijv. verkeerd wachtwoord)
    return email === "fout@voorbeeld.nl" || password === "verkeerdwachtwoord";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validatie
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      // Simuleer backend error response
      if (simulateBackendError(email, password)) {
        setErrors({
          general: "Onjuiste inloggegevens. Controleer je e-mailadres en wachtwoord."
        });
        return;
      }

      // Succesvolle login
      setIsPageLoading(true);
      
      // Simulate redirect loading
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }, 2000);
  };

  // Toon fullscreen loader tijdens redirect
  if (isPageLoading) {
    return <PageLoader text="Doorsturen naar dashboard..." variant="dots" />;
  }

  return (
    <div className="login-page">
      <div className="login-page__background">
        <div className="login-page__container">
          <div className="login-page__card">
            <div className="login-page__header">
              <h1 className="login-page__title">Inloggen</h1>
              <p className="login-page__subtitle">Welkom terug bij ons platform</p>
            </div>

            {/* Algemene error message */}
            {errors.general && (
              <div className="login-page__error-banner" role="alert">
                <div className="login-page__error-icon">⚠️</div>
                <span>{errors.general}</span>
              </div>
            )}
            
            <form className="login-page__form stack" onSubmit={handleSubmit}>
              <Input
                label="E-mailadres"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear email error wanneer gebruiker typt
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="voorbeeld@email.nl"
                required
                disabled={isLoading}
                error={errors.email}
              />
              
              <Input
                label="Wachtwoord"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  // Clear password error wanneer gebruiker typt
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
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
                {isLoading ? (
                  <>
                    <Loader size="sm" variant="dots" />
                    Inloggen...
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="login-page__demo-hint">
              <p className="login-page__demo-title">Demo:</p>
              <ul className="login-page__demo-list">
                <li>Gebruik een geldig e-mail formaat</li>
                <li>Wachtwoord moet minimaal 6 tekens zijn</li>
                <li>Test fout: gebruik "fout@voorbeeld.nl" of wachtwoord "verkeerdwachtwoord"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}