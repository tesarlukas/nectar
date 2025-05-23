import { TopMenu } from "@/components/TopMenu";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { ActionId } from "@/features/events/eventEmitter";
import { useShortcuts } from "@/features/shortcuts/hooks/useShortcuts";
import { Outlet, useLocation, useNavigate } from "react-router";

export const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toggleColorScheme } = useColorTheme();

  const handleNavigation = () => {
    pathname === "/settings" ? navigate("/") : navigate("/settings");
  };

  const handleGraphNavigation = () => {
    pathname === "/graph" ? navigate("/") : navigate("/graph");
  };

  useShortcuts(ActionId.ToggleSettings, () => handleNavigation(), {
    enableOnContentEditable: true,
    enableOnFormTags: ["INPUT"],
  });

  useShortcuts(ActionId.ToggleTheme, () => toggleColorScheme(), {
    enableOnContentEditable: true,
    enableOnFormTags: ["INPUT"],
  });

  useShortcuts(ActionId.ToggleGraphView, () => handleGraphNavigation(), {
    enableOnContentEditable: true,
    enableOnFormTags: ["INPUT"],
  });
  return (
    <>
      <TopMenu />
      <Outlet />
    </>
  );
};
