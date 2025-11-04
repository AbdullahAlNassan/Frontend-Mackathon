import { Outlet } from "react-router-dom";

export default function Content() {
  return (
    <main className="content">
      <div className="content__inner">
        <Outlet />
      </div>
    </main>
  );
}
