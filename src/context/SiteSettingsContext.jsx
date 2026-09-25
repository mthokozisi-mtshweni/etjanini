import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/settings/public`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setSettings(data.settings);
        }
      } catch (error) {
        console.error(
          "Unable to load site settings:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}