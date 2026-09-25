import { FiArrowUpRight } from "react-icons/fi";

function AboutSection() {
  return (
    <section id="about" className="about-section">

      <div className="about-container">

        {/* Image / visual */}
        <div className="about-visual">

          <div className="about-image-placeholder">
            <div className="about-image-overlay"></div>

            <div className="about-image-content">
              <span>ETJANINI</span>
              <small>KwaMhlanga • Mpumalanga</small>
            </div>
          </div>

          <div className="about-image-frame"></div>

          <div className="about-number">
            <span>01</span>
          </div>

        </div>


        {/* Content */}
        <div className="about-content">

          <span className="section-eyebrow">
            WELCOME TO ETJANINI
          </span>

          <h2>
            More Than A Place
            <span> To Gather.</span>
          </h2>

          <p className="about-lead">
            Etjanini brings together great food, warm hospitality
            and beautiful spaces to create experiences worth
            remembering.
          </p>

          <p className="about-text">
            Whether you are joining us for a memorable meal,
            celebrating your wedding, hosting a conference or
            planning a special function, our goal is to make every
            occasion feel exceptional.
          </p>

          <a href="#services" className="about-link">
            Discover Etjanini
            <span>
              <FiArrowUpRight />
            </span>
          </a>

        </div>

      </div>

    </section>
  );
}

export default AboutSection;