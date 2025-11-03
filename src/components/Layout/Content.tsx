import { ReactNode } from "react";

export default function Content({ children }: { children: ReactNode }) {
  return (
    <main
      className="container"
      style={{
        padding: "var(--space-24)",
      }}
    >
      {children}
    </main>
  );
}
