import { Link } from "react-router-dom";
import { Button } from "../../components/ui";

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <h1 className="not-found__title">404 - Pagina niet gevonden</h1>
      <p className="not-found__text">
        De pagina die je probeert te openen bestaat niet (meer).
      </p>

      <div className="not-found__actions">
        <Link to="/dashboard">
          <Button variant="primary">Naar dashboard</Button>
        </Link>
        <Link to="/inloggen">
          <Button variant="ghost">Naar login</Button>
        </Link>
      </div>
    </section>
  );
}


