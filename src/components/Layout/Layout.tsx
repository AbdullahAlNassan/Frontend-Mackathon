import Header from "./Header";
import Content from "./Content";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Content>{children}</Content>
    </div>
  );
}
