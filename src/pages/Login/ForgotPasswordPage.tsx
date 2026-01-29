import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Form, FormField, Input } from "../../components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Vul je e-mailadres in");
      setSuccessMessage(null);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Simuleer een API-call totdat de backend klaar is.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage("We hebben, als dit adres bekend is, een herstel-link gestuurd.");
    } catch (error) {
      console.error("Failed to request password reset", error);
      setErrorMessage("Er ging iets mis. Probeer het later opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page__background">
      <div className="login-page__container">
        <div className="login-page__card">
          <div className="login-page__header">
            <h1 className="login-page__title">Wachtwoord vergeten</h1>
            <p className="login-page__subtitle">
              Voer je e-mailadres in om een herstel-link te ontvangen.
            </p>
          </div>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit} spacing="md">
            <FormField label="E-mailadres" required>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jij@example.com"
                disabled={isSubmitting}
              />
            </FormField>

            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
              Herstel link versturen
            </Button>
          </Form>

          <div className="login-page__help">
            <p className="login-page__help-text">
              Weet je het toch weer? Ga dan terug naar de <Link to="/inloggen">login</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
