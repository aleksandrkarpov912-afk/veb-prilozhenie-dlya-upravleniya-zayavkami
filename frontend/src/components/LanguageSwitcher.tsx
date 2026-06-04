import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <button onClick={() => changeLang('ru')}>RU</button>
      <button onClick={() => changeLang('en')}>EN</button>
    </div>
  );
}