import { TopMenu } from "@/components/TopMenu";
import { Outlet } from "react-router";

export const Layout = () => {
  return (
    <>
      <TopMenu />
      <Outlet />
    </>
  );
};
