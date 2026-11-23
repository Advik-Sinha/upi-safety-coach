
import {
  ShieldCheck,
  Code2,
  Palette,
  Presentation,
  BriefcaseBusiness,
  BookOpen,
  ExternalLink
} from 'lucide-react'

const members = [
  {
    name: 'Advik Sinha',
    role: 'Project Lead & Full-Stack Developer',
    description:
      'Project architecture, frontend, backend, AI integration, knowledge base and deployment.',
    icon: Code2
  },
  {
    name: 'Aditi Kumar',
    role: 'Creative & Visual Design Lead',
    description:
      'Safety poster, visual identity, graphics and presentation design.',
    icon: Palette
  },
  {
    name: 'Aarzoo Chahal',
    role: 'Pitch & Communications Lead',
    description:
      'Pitch preparation, project communication and demonstration.',
    icon: Presentation
  },
  {
    name: 'Asar Mohammed Farhan Khan',
    role: 'Business & Strategy Lead',
    description:
      'Business model, target users, market research and project strategy.',
    icon: BriefcaseBusiness
  }
]
const sources = [
  {
    name: 'Reserve Bank of India',
    url: 'https://www.rbi.org.in/'
  },
  {
    name: 'National Payments Corporation of India',
    url: 'https://www.npci.org.in/'
  },
  {
    name: 'Indian Cyber Crime Coordination Centre',
    url: 'https://i4c.mha.gov.in/'
  },
  {
    name: 'National Cyber Crime Reporting Portal',
    url: 'https://cybercrime.gov.in/'
  }
]

function AboutCredits() {
  return (
    <section className="about-page">

      <div className="welcome-tag">
        <ShieldCheck size={15} />
        ABOUT THE PROJECT
      </div>

      <div className="hero">
        <h1>
          Behind <span>UPI Safety Coach.</span>
        </h1>

        <p>
          A student-developed initiative designed to make
          digital payment safety easier to understand,
          accessible and practical.
        </p>
      </div>

      <div className="about-card">
        <h2>Our Mission</h2>
        <p>
          UPI Safety Coach aims to help people recognise
          common UPI fraud attempts, understand digital
          payment risks and make safer financial decisions
          through AI-powered guidance and verified
          educational resources.
        </p>
      </div>

      <div className="about-section">
        <div className="section-heading">
          <h3>The People Behind the Project</h3>
          <span>PROJECT TEAM</span>
        </div>

        <div className="team-grid">
          {members.map((member) => {
            const Icon = member.icon

            return (
              <div className="team-card" key={member.name}>
                <div className="team-icon">
                  <Icon size={22} />
                </div>

                <h3>{member.name}</h3>
                <strong>{member.role}</strong>
                <p>{member.description}</p>
              </div>
            )
          })}
        </div>

        <p className="team-id">
          HCL Jigsaw Edition 7 · Team ID: team_2129_0022
        </p>
      </div>

      <div className="about-section">
        <div className="section-heading">
          <h3>Technology & Tools</h3>
          <span>TECH STACK</span>
        </div>

        <div className="technology-list">
          {[
            'React & Vite',
            'Python & FastAPI',
            'OpenRouter API',
            'Google Gemini Embeddings',
            'ChromaDB'
          ].map((technology) => (
            <span className="technology-tag" key={technology}>
              {technology}
            </span>
          ))}
        </div>
      </div>

      <div className="about-section">
        <div className="section-heading">
          <h3>Sources & Acknowledgements</h3>
          <span>OFFICIAL RESOURCES</span>
        </div>

        <div className="sources-list">
          {sources.map((source) => (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="source-link"
              key={source.name}
            >
              <BookOpen size={17} />
              {source.name}
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      </div>

      <div className="about-card disclaimer-card">
        <h2>Important Disclaimer</h2>
        <p>
          UPI Safety Coach is an educational fraud-awareness
          tool. Its AI-generated responses may not always be
          accurate and should not replace advice from banks
          or official authorities. Always verify important
          information through official sources.
        </p>
      </div>

      <div className="about-footer">
        <ShieldCheck size={19} />
        <p>Built to encourage safer digital payments.</p>
        <span>UPI SAFETY COACH · HCL JIGSAW EDITION 7</span>
      </div>

    </section>
  )
}

export default AboutCredits
