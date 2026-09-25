import { useEffect } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const SITE_URL = "https://etjanini.co.za";

const DAYS = [
  ["mondayHours", "Monday"],
  ["tuesdayHours", "Tuesday"],
  ["wednesdayHours", "Wednesday"],
  ["thursdayHours", "Thursday"],
  ["fridayHours", "Friday"],
  ["saturdayHours", "Saturday"],
  ["sundayHours", "Sunday"],
];

function parseHours(value) {
  if (!value) return null;

  const text = String(value).trim();

  if (!text) return null;

  /*
   * Expected examples:
   * 09:00 - 21:00
   * 09:00–21:00
   * 09:00 to 21:00
   */

  const match = text.match(
    /(\d{1,2}:\d{2})\s*(?:-|–|—|to)\s*(\d{1,2}:\d{2})/i
  );

  if (!match) {
    return null;
  }

  return {
    opens: match[1],
    closes: match[2],
  };
}

function buildOpeningHours(settings) {
  return DAYS
    .map(([field, day]) => {
      const hours = parseHours(settings[field]);

      if (!hours) {
        return null;
      }

      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day,
        opens: hours.opens,
        closes: hours.closes,
      };
    })
    .filter(Boolean);
}

function RestaurantSchema() {
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/settings/public`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load public settings"
          );
        }

        const result = await response.json();

        const settings =
          result.settings ||
          result.data ||
          result;

        const openingHours =
          buildOpeningHours(settings);

        const schema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",

  "@id": `${SITE_URL}/#restaurant`,

  name:
    settings.businessName ||
    "Etjanini",

          url: SITE_URL,

          logo: `${SITE_URL}/logo_1.jpeg`,

          description:
            settings.tagline ||
            "Restaurant, wedding, conference and functions venue in KwaMhlanga, Mpumalanga.",

          address: {
            "@type": "PostalAddress",

            ...(settings.address && {
              streetAddress:
                settings.address,
            }),

            addressLocality:
              settings.city ||
              "KwaMhlanga",

            addressRegion:
              settings.province ||
              "Mpumalanga",

            addressCountry:
              settings.country ||
              "ZA",
          },

          ...(settings.phone && {
            telephone: settings.phone,
          }),

          ...(settings.email && {
            email: settings.email,
          }),

          menu:
            `${SITE_URL}/menu`,

          hasMenu: {
            "@type": "Menu",
            url:
              `${SITE_URL}/menu`,
          },

          ...(openingHours.length > 0 && {
            openingHoursSpecification:
              openingHours,
          }),
        };

        const cleanSchema =
          JSON.parse(
            JSON.stringify(schema)
          );

        let script =
          document.getElementById(
            "etjanini-restaurant-schema"
          );

        if (!script) {
          script =
            document.createElement(
              "script"
            );

          script.id =
            "etjanini-restaurant-schema";

          script.type =
            "application/ld+json";

          document.head.appendChild(
            script
          );
        }

        script.textContent =
          JSON.stringify(
            cleanSchema
          );
      } catch (error) {
        console.error(
          "Restaurant schema error:",
          error
        );
      }
    };

    loadSchema();

    return () => {
      document
        .getElementById(
          "etjanini-restaurant-schema"
        )
        ?.remove();
    };
  }, []);

  return null;
}

export default RestaurantSchema;