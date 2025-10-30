import { useState } from "react";
import { z } from "zod";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";

/** 1) Zod schema */
const loginSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  password: z.string().min(6, "Wachtwoord moet minstens 6 tekens hebben"),
  remember: z.boolean().optional(),
});

/** 2) Type uit schema afleiden */
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  /** 3) Change handler */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /** 4) Submit + validatie met Zod (let op: issues of flatten) */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      // Optie A: issues
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginForm; // "email" | "password" | "remember"
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);

      // OF Optie B (mooier): flatten
      // const { fieldErrors } = result.error.flatten();
      // setErrors({
      //   email: fieldErrors.email?.[0],
      //   password: fieldErrors.password?.[0],
      //   remember: fieldErrors.remember?.[0],
      // });

      return;
    }

    // geldig -> simulatie login
    setIsLoading(true);
    setTimeout(() => {
      alert(`Ingelogd als ${form.email}`);
      setIsLoading(false);
    }, 1200);
  }

  /** 5) UI */
  return (
    <section
      className="stack"
      style={{ maxWidth: 420, margin: "0 auto", paddingTop: "var(--space-40)" }}
    >
      <h1 style={{ margin: 0 }}>Login</h1>

      <form className="stack" onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Wachtwoord"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Checkbox
          label="Onthoud mij"
          name="remember"
          checked={form.remember}
          onChange={handleChange}
        />

        <Button type="submit" isLoading={isLoading}>
          Inloggen
        </Button>
      </form>
    </section>
  );
}
