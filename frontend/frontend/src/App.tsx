import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "./hooks/useProfile";
import { useChat } from "./hooks/useChat";
import { EMERGENCY_NUMBERS } from "./lib/emergency";
import { ProfileSetup } from "./components/profile/ProfileSetup";
import { Header } from "./components/layout/Header";
import { DisclaimerBanner } from "./components/layout/DisclaimerBanner";
import { ChatWindow } from "./components/chat/ChatWindow";
import { ChatInput } from "./components/chat/ChatInput";
import { TabBar, type View } from "./components/common/TabBar";
import { Sidebar } from "./components/common/Sidebar";
import { ContextPanel } from "./components/common/ContextPanel";
import { WellnessView } from "./components/wellness/WellnessView";
import { SettingsView } from "./components/settings/SettingsView";

function App() {
  const { t, i18n } = useTranslation();
  const { profile, completeProfile, updateLanguage, updateName, updateEmergencyRegion } =
    useProfile();
  const [view, setView] = useState<View>("chat");

  const language = profile?.language ?? (i18n.language as "en" | "ar" | "ur") ?? "en";
  const { messages, isLoading, error, sendMessage, retry, startNewConversation } =
    useChat(language);

  if (!profile) {
    return (
      <ProfileSetup
        language={language}
        onLanguageChange={updateLanguage}
        onComplete={completeProfile}
      />
    );
  }

  const greeting = profile.name
    ? t("chat.greeting", { name: profile.name })
    : t("chat.greetingGuest");

  const latestAssistantMessage =
    [...messages].reverse().find((m) => m.role === "assistant") ?? null;

  const emergencyNumber = EMERGENCY_NUMBERS[profile.emergencyRegion ?? "uk"];

  function handleNewConversation() {
    if (messages.length === 0 || window.confirm(t("chat.newConversationConfirm"))) {
      startNewConversation();
    }
  }

  return (
    <div className="flex h-screen bg-mist-100">
      <Sidebar
        active={view}
        onChange={setView}
        name={profile.name}
        language={language}
        onLanguageChange={updateLanguage}
        onNewConversation={handleNewConversation}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <Header
          name={profile.name}
          language={language}
          onLanguageChange={updateLanguage}
          onNewConversation={handleNewConversation}
        />

        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col">
          {view === "chat" && (
            <>
              <DisclaimerBanner />
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                error={error}
                onRetry={retry}
                onSuggestionSelect={sendMessage}
                greeting={greeting}
                emergencyNumber={emergencyNumber}
              />
              <ChatInput onSend={sendMessage} disabled={isLoading} language={language} />
            </>
          )}

          {view === "wellness" && <WellnessView />}

          {view === "settings" && (
            <SettingsView
              profile={profile}
              onNameChange={updateName}
              onLanguageChange={updateLanguage}
              onEmergencyRegionChange={updateEmergencyRegion}
              onClearHistory={startNewConversation}
            />
          )}
        </div>

        <TabBar active={view} onChange={setView} />
      </div>

      <ContextPanel
        view={view}
        messages={messages}
        latestAssistantMessage={latestAssistantMessage}
        emergencyNumber={emergencyNumber}
        onOpenWellness={() => setView("wellness")}
      />
    </div>
  );
}

export default App;
