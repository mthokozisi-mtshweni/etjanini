
import {
  FiArrowUpRight,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import { useSiteSettings } from "../context/SiteSettingsContext";


function Footer() {

  const { settings } = useSiteSettings();


  const businessName =
    settings?.businessName || "Etjanini";


  const address = [
    settings?.address,
    settings?.city,
    settings?.province,
    settings?.country,
  ]
    .filter(Boolean)
    .join(", ");


  const phone =
    settings?.phone || "";


  const email =
    settings?.email || "";


  const mapsUrl =
    settings?.mapsUrl || "";


  const instagramUrl =
    settings?.instagramUrl || "";


  const facebookUrl =
    settings?.facebookUrl || "";


  const tiktokUrl =
    settings?.tiktokUrl || "";


  const currentYear =
    new Date().getFullYear();


  return (
    <footer className="site-footer">

      <div className="site-footer-inner">

        {/* =================================================
            MAIN FOOTER
        ================================================== */}

        <div className="site-footer-main">


          {/* BRAND */}

          <div className="site-footer-brand">

            <a
              href="/"
              className="site-footer-logo"
            >
              {businessName}
            </a>


            <p className="site-footer-tagline">
              Restaurant • Events • Venue
            </p>


            <p className="site-footer-description">
              Exceptional hospitality, delicious cuisine
              and memorable moments in KwaMhlanga.
            </p>


            {/* SOCIAL LINKS */}

            {(instagramUrl ||
              facebookUrl ||
              tiktokUrl) && (

              <div className="site-footer-socials">

                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    <FiInstagram />
                  </a>
                )}


                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                  >
                    <FiFacebook />
                  </a>
                )}


                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                  >
                    <span className="site-footer-tiktok">
                      ♪
                    </span>
                  </a>
                )}

              </div>

            )}

          </div>


          {/* QUICK LINKS */}

          <div className="site-footer-column">

            <span className="site-footer-heading">
              EXPLORE
            </span>


            <nav className="site-footer-links">

              <a href="/">
                Home
              </a>

              <a href="/#about">
                About
              </a>

              <a href="/#services">
                Services
              </a>

              <a href="/menu">
                Menu
              </a>

              <a href="/gallery">
                Gallery
              </a>

              <a href="/events">
                Events
              </a>

              <a href="/#contact">
                Contact
              </a>

            </nav>

          </div>


          {/* SERVICES */}

          <div className="site-footer-column">

            <span className="site-footer-heading">
              SERVICES
            </span>


            <nav className="site-footer-links">

              <a href="/#services">
                Restaurant
              </a>

              <a href="/#services">
                Weddings
              </a>

              <a href="/#services">
                Conferences
              </a>

              <a href="/#services">
                Functions
              </a>

              <a href="/#booking">
                Private Events
              </a>

            </nav>

          </div>


          {/* CONTACT */}

          <div className="site-footer-column">

            <span className="site-footer-heading">
              CONTACT
            </span>


            <div className="site-footer-contact">

              {address && (
                <div className="site-footer-contact-item">

                  <FiMapPin />

                  <div>

                    <span>
                      {address}
                    </span>


                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Get Directions
                        <FiArrowUpRight />
                      </a>
                    )}

                  </div>

                </div>
              )}


              {phone && (
                <div className="site-footer-contact-item">

                  <FiPhone />

                  <a href={`tel:${phone}`}>
                    {phone}
                  </a>

                </div>
              )}


              {email && (
                <div className="site-footer-contact-item">

                  <FiMail />

                  <a
                    href={`mailto:${email}`}
                  >
                    {email}
                  </a>

                </div>
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            FOOTER DIVIDER
        ================================================== */}

        <div className="site-footer-divider"></div>


        {/* =================================================
            BOTTOM FOOTER
        ================================================== */}

        <div className="site-footer-bottom">

          <span>
            © {currentYear} {businessName}.
            All rights reserved.
          </span>


          <div className="site-footer-bottom-links">

            <a href="/#booking">
              Book an Event
            </a>

            <a href="/menu">
              View Menu
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}


export default Footer;
