import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Checkbox, Loader, PageLoader } from "../../components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Backend authentication call
    console.log({ email, password, rememberMe });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
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
            
            <form className="login-page__form stack" onSubmit={handleSubmit}>
              <Input
                label="E-mailadres"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voorbeeld@email.nl"
                required
                disabled={isLoading}
              />
              
              <Input
                label="Wachtwoord"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
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
          </div>
        </div>
      </div>
    </div>
  );
}