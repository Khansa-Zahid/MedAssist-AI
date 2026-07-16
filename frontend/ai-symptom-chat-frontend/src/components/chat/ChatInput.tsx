import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

// Minimal shape of the Web Speech API we actually use — this API has
// no official TypeScript lib definitions, and it's only available in
// Chromium-based browsers (accessed via the vendor-prefixed global).
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const SPEECH_LANG_MAP: Record<string, string> = {
  en: "en-US",
  ar: "ar-SA",
  ur: "ur-PK",
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return (ctor as (new () => SpeechRecognitionLike) | undefined) ?? null;
}

interface ChatInputExtraProps {
  language?: string;
}

export function ChatInput({ onSend, disabled, language = "en" }: ChatInputProps & ChatInputExtraProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const SpeechRecognitionCtor = getSpeechRecognitionCtor();

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function handleSend() {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function toggleListening() {
    if (!SpeechRecognitionCtor) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = SPEECH_LANG_MAP[language] ?? "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  return (
    <div className="border-t border-mist-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-end gap-2 rounded-3xl border border-mist-300 bg-mist-50 px-3 py-2 focus-within:border-sage-400 focus-within:bg-white">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chat.inputPlaceholder")}
          rows={1}
          disabled={disabled}
          maxLength={1000}
          className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-ink-900 placeholder:text-ink-400/70 focus:outline-none disabled:opacity-60 sm:text-base"
        />

        {SpeechRecognitionCtor && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            aria-label={t("chat.voiceInput")}
            aria-pressed={isListening}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${
              isListening
                ? "bg-clay-500 text-white animate-pulse"
                : "text-ink-400 hover:bg-mist-200 hover:text-ink-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10 2a3 3 0 00-3 3v5a3 3 0 006 0V5a3 3 0 00-3-3z" />
              <path d="M5.5 9a.5.5 0 00-1 0v1a5.5 5.5 0 005 5.478V17H8a.5.5 0 000 1h4a.5.5 0 000-1h-1.5v-1.522A5.5 5.5 0 0015.5 10V9a.5.5 0 00-1 0v1a4.5 4.5 0 01-9 0V9z" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label={t("chat.send")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-500 text-white transition-colors duration-150 hover:bg-sage-600 disabled:cursor-not-allowed disabled:bg-mist-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 rtl:-scale-x-100"
            aria-hidden="true"
          >
            <path d="M3.4 2.5a.75.75 0 01.83-.1l14 7a.75.75 0 010 1.34l-14 7a.75.75 0 01-1.06-.92L5.7 10 3.17 3.18a.75.75 0 01.23-.68z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
