import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useColorTheme } from "@/features/appearance/colorTheme/hooks/useColorTheme";
import { ColorScheme } from "@/features/appearance/colorTheme/types";

// TODO: This is a tri-mode colorscheme toggle for the future
//
//export const ModeToggle = () => {
//  const { toggleColorScheme, setColorScheme } = useColorTheme();
//
//  return (
//    <DropdownMenu>
//      <DropdownMenuTrigger asChild>
//        <Button variant="outline" size="icon">
//          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//          <span className="sr-only">Toggle theme</span>
//        </Button>
//      </DropdownMenuTrigger>
//      <DropdownMenuContent align="end">
//        <DropdownMenuItem onClick={() => setColorScheme(ColorScheme.Light)}>
//          Light
//        </DropdownMenuItem>
//        <DropdownMenuItem onClick={() => setColorScheme(ColorScheme.Dark)}>
//          Dark
//        </DropdownMenuItem>
//      </DropdownMenuContent>
//    </DropdownMenu>
//  );
//};

export const ColorSchemeToggle = () => {
  const { toggleColorScheme } = useColorTheme();

  return (
    <Button variant="outline" size="icon" onClick={toggleColorScheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
