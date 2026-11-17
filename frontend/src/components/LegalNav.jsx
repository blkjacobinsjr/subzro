import PublicNav from "./PublicNav";

export default function LegalNav({ lang = "en", onLangChange }) {
  return <PublicNav lang={lang} onLangChange={onLangChange} />;
}
