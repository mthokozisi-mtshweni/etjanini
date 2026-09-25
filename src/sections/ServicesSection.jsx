import {
  FiArrowUpRight,
  FiCoffee,
  FiHeart,
  FiBriefcase,
  FiStar,
} from "react-icons/fi";

const services = [
  {
    number: "01",
    title: "Restaurant",
    description:
      "Enjoy carefully prepared meals, warm hospitality and a dining experience designed for memorable moments.",
    icon: FiCoffee,
    className: "service-restaurant",
  },
  {
    number: "02",
    title: "Weddings",
    description:
      "Celebrate your special day in a beautiful setting designed to bring your wedding vision to life.",
    icon: FiHeart,
    className: "service-weddings",
  },
  {
    number: "03",
    title: "Conferences",
    description:
      "A professional and comfortable environment for meetings, conferences, workshops and corporate gatherings.",
    icon: FiBriefcase,
    className: "service-conferences",
  },
  {
    number: "04",
    title: "Functions",
    description:
      "From birthdays and celebrations to private gatherings, create an occasion your guests will remember.",
    icon: FiStar,
    className: "service-functions",
  },
];

function ServicesSection() {
  return (
    <section id="services" className="services-section">

      <div className="services-container">

        {/* Section heading */}
        <div className="services-heading">

          <div>
            <span className="section-eyebrow services-eyebrow">
              WHAT WE OFFER
            </span>

            <h2>
              Spaces For
              <span> Every Occasion.</span>
            </h2>
          </div>

          <p>
            Whether you are joining us for a meal or planning an
            important occasion, Etjanini offers spaces and
            experiences designed around you.
          </p>

        </div>


        {/* Service cards */}
        <div className="services-grid">

          {services.map((service) => {

            const Icon = service.icon;

            return (
              <article
                key={service.number}
                className={`service-card ${service.className}`}
              >

                <div className="service-card-background"></div>

                <div className="service-card-overlay"></div>

                <div className="service-card-content">

                  <div className="service-top">

                    <span className="service-number">
                      {service.number}
                    </span>

                    <span className="service-icon">
                      <Icon />
                    </span>

                  </div>

                  <div className="service-bottom">

                    <h3>{service.title}</h3>

                    <p>{service.description}</p>

                    <a href="#booking" className="service-link">
                      Explore
                      <span>
                        <FiArrowUpRight />
                      </span>
                    </a>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default ServicesSection;