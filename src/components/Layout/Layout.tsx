import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
}
