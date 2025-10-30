import Header from "./Header";
import Content from "./Content";
import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Content>
        {/* Toon ofwel de children (App.tsx) of de Router Outlet */}
        {children ?? <Outlet />}
      </Content>
    </div>
  );
}
