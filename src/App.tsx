import Layout from "./components/Layout/Layout";
export default function App() {
  return (
    <Layout>
      <section
        className="stack"
        style={{
          maxWidth: 560,
          margin: "0 auto",
          textAlign: "center",
          paddingTop: "var(--space-40)",
        }}
      >
        <h1 style={{ margin: 0 }}>Welkom 👋</h1>
        <p>Je basis layout werkt nu met Header en Content.</p>
      </section>
    </Layout>
  );
}
