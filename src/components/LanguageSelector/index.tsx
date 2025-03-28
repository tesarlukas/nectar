import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "cs", name: "Čeština" },
  { code: "sk", name: "Slovenčina" },
];

export const LanguageSelector = ({
  position = "bottom-right",
  iconOnly = false,
}) => {
  const { i18n } = useTranslation();
  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={iconOnly ? "icon" : "sm"}
          className="h-8 gap-1 px-2 text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          {!iconOnly && (
            <>
              <span className="ml-1">{currentLanguage.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={position.split("-")[1]}
        side={position.split("-")[0]}
        className="w-32"
      >
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between"
          >
            <span>{language.name}</span>
            {language.code === currentLanguage.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
