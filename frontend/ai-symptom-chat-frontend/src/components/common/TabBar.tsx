import { useTranslation } from "react-i18next";

export type View = "chat" | "wellness" | "settings";

interface TabBarProps {
  active: View;
  onChange: (view: View) => void;
}

const ICONS: Record<View, JSX.Element> = {
  chat: (
    <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H8l-4 3v-3H4a2 2 0 01-2-2V4z" />
  ),
  wellness: (
    <path
      fillRule="evenodd"
      d="M10 2a5 5 0 00-5 5c0 2.5 2 4.5 4 6.5.3.3.7.5 1 .5s.7-.2 1-.5c2-2 4-4 4-6.5a5 5 0 00-5-5zm0 15c-3.3 0-8 1.3-8 3v1h16v-1c0-1.7-4.7-3-8-3z"
      clipRule="evenodd"
    />
  ),
  settings: (
    <path
      fillRule="evenodd"
      d="M11.5 2.3a1.5 1.5 0 00-3 0l-.1.6a6.5 6.5 0 00-1.6.9l-.6-.3a1.5 1.5 0 00-1.9.6l-.7 1.2a1.5 1.5 0 00.4 2l.5.4a6.6 6.6 0 000 1.8l-.5.4a1.5 1.5 0 00-.4 2l.7 1.2a1.5 1.5 0 001.9.6l.6-.3c.5.4 1 .7 1.6.9l.1.6a1.5 1.5 0 003 0l.1-.6c.6-.2 1.1-.5 1.6-.9l.6.3a1.5 1.5 0 001.9-.6l.7-1.2a1.5 1.5 0 00-.4-2l-.5-.4a6.6 6.6 0 000-1.8l.5-.4a1.5 1.5 0 00.4-2l-.7-1.2a1.5 1.5 0 00-1.9-.6l-.6.3a6.5 6.5 0 00-1.6-.9l-.1-.6zM10 13a3 3 0 110-6 3 3 0 010 6z"
      clipRule="evenodd"
    />
  ),
};

export function TabBar({ active, onChange }: TabBarProps) {
  const { t } = useTranslation();
  const tabs: View[] = ["chat", "wellness", "settings"];

  return (
    <nav
      className="flex border-t border-mist-200 bg-white/90 backdrop-blur lg:hidden"
      aria-label="Main"
    >
      {tabs.map((view) => {
        const isActive = active === view;
        return (
          <button
            key={view}
            type="button"
            onClick={() => onChange(view)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors duration-150 ${
              isActive ? "text-sage-600" : "text-ink-400 hover:text-ink-600"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {ICONS[view]}
            </svg>
            {t(`nav.${view}`)}
          </button>
        );
      })}
    </nav>
  );
}
