import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import Select from "../../components/ui/Select";
import Loader from "../../components/ui/Loader";

export default function LoginPage() {
  return (
    <section
      className="stack"
      style={{ maxWidth: 420, margin: "0 auto", paddingTop: "var(--space-40)" }}
    >
      <h1 style={{ margin: 0 }}>Login</h1>
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        <Input label="E-mail" type="email" required />
        <Input label="Wachtwoord" type="password" required />
        <Checkbox label="Onthoud mij" />
        <Button type="submit">Inloggen</Button>

        <Select
          label="Rol"
          placeholder="Kies een rol"
          options={[
            { label: "Gebruiker", value: "user" },
            { label: "Beheerder", value: "admin" },
          ]}
        />
      </form>
    </section>
  );
}
