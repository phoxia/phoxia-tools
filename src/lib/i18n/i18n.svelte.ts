import en from "./en-US.locales";
import ptBR from "./pt-BR.locales";
import type { LocaleShape } from "./types";

const LANG_KEY = "phoxia-lang";
const translations: Record<string, LocaleShape> = { en, "pt-BR": ptBR };

function detectBrowserLang(): string {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of langs) {
    const base = l.split("-")[0].toLowerCase();
    if (base === "pt") return "pt-BR";
    if (base === "en") return "en";
  }
  return "en";
}

let _lang = $state("en");

export function initClientLang() {
  const stored = localStorage.getItem(LANG_KEY);
  _lang = stored && translations[stored] ? stored : detectBrowserLang();
}

export function getLang(): string {
  return _lang;
}

export function setLang(lang: string) {
  if (!translations[lang]) return;
  _lang = lang;
  if (typeof localStorage !== "undefined") localStorage.setItem(LANG_KEY, lang);
}

export function cycleLang() {
  setLang(_lang === "en" ? "pt-BR" : "en");
}

export function t(): LocaleShape {
  return translations[_lang] ?? translations["en"];
}

export function isBR(): boolean {
  return _lang === "pt-BR";
}
