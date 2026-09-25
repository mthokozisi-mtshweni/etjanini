import { useEffect } from "react";

const SITE_URL = "https://etjanini.co.za";

function SEO({
  title = "Etjanini | Restaurant, Weddings & Events Venue",
  description = "Etjanini is a restaurant, wedding, conference and functions venue in KwaMhlanga, Mpumalanga.",
  path = "/",
  image = "",
}) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content, property = false) => {
      if (!content) return;

      const attribute = property
        ? "property"
        : "name";

      let meta = document.head.querySelector(
        `meta[${attribute}="${name}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    setMeta("description", description);

    setMeta(
      "og:title",
      title,
      true
    );

    setMeta(
      "og:description",
      description,
      true
    );

    setMeta(
      "og:type",
      "website",
      true
    );

    setMeta(
      "og:url",
      `${SITE_URL}${path}`,
      true
    );

    if (image) {
      setMeta(
        "og:image",
        image,
        true
      );
    }

    setMeta(
      "twitter:card",
      "summary_large_image"
    );

    setMeta(
      "twitter:title",
      title
    );

    setMeta(
      "twitter:description",
      description
    );

    if (image) {
      setMeta(
        "twitter:image",
        image
      );
    }

    let canonical =
      document.head.querySelector(
        'link[rel="canonical"]'
      );

    if (!canonical) {
      canonical =
        document.createElement("link");

      canonical.rel = "canonical";

      document.head.appendChild(
        canonical
      );
    }

    canonical.href =
      `${SITE_URL}${path}`;
  }, [
    title,
    description,
    path,
    image,
  ]);

  return null;
}

export default SEO;