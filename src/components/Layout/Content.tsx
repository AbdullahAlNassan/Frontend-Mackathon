import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";

type ContentProps = {
  children?: ReactNode;
};

export default function Content({ children }: ContentProps) {
  return (
    <main className="content">
      <div className="content__inner">
        {children ?? <Outlet />}
      </div>
    </main>
  );
}
