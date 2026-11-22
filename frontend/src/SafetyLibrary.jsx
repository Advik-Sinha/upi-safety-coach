
import { useState } from 'react'
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  LockKeyhole,
  QrCode,
  Smartphone,
  CreditCard,
  MessageCircle,
  BookOpen,
  Siren,
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react'

const guides = [
  {
    id: 1,
    title: 'UPI PIN and OTP safety',
    category: 'Account Security',
    icon: LockKeyhole,
    description: 'Understand when your UPI PIN is required and what information must remain private.',
    signs: [
      'Someone asks you to reveal your UPI PIN or OTP.',
      'A caller claims they need your PIN to verify your identity.',
      'Someone asks you to share your screen or banking credentials.'
    ],
    safety: [
      'Never disclose your UPI PIN or OTP to another person.',
      'A UPI PIN is used to authorise a payment, not to receive money.',
      'Enter your PIN only inside your trusted UPI application when you intend to authorise a payment.',
      'Contact your bank through independently verified channels if you suspect exposure.'
    ],
    source: 'RBI — Financial Awareness Messages',
    url: 'https://rbi.org.in/commonman/images/FAME202426022024.pdf'
  },
  {
    id: 2,
    title: 'QR code payment scams',
    category: 'Payment Scams',
    icon: QrCode,
    description: 'Learn why scanning a QR code can lead to a payment rather than receiving money.',
    signs: [
      'A buyer asks you to scan a QR code to receive money.',
      'You are asked to enter your UPI PIN after scanning a code.',
      'Someone sends a QR code and pressures you to act quickly.'
    ],
    safety: [
      'You generally do not need to scan a QR code to receive money.',
      'Check the recipient name and amount before approving a payment.',
      'Never enter your UPI PIN unless you intend to authorise the displayed payment.',
      'Reject unexpected payment requests.'
    ],
    source: 'RBI — Safe Use of Digital Transactions',
    url: 'https://www.rbi.org.in/CommonPerson/english/scripts/Notification.aspx?Id=3232'
  },
  {
    id: 3,
    title: 'Phishing messages and fake links',
    category: 'Online Threats',
    icon: MessageCircle,
    description: 'Recognise messages designed to steal banking information or direct you to fake websites.',
    signs: [
      'Threats that your account will be blocked immediately.',
      'Unknown links asking you to update KYC or verify your account.',
      'Requests for passwords, OTPs, card details or UPI PINs.',
      'Unexpected attachments or instructions to install an application.'
    ],
    safety: [
      'Do not open suspicious links or attachments.',
      'Open your bank application independently instead of using a message link.',
      'Never enter banking credentials on a website reached through an unsolicited message.',
      'Contact your bank using its official website, app or verified contact number.'
    ],
    source: 'RBI — Safe Use of Digital Transactions',
    url: 'https://www.rbi.org.in/CommonPerson/english/scripts/Notification.aspx?Id=3232'
  },
  {
    id: 4,
    title: 'Collect requests and payment approvals',
    category: 'Payment Scams',
    icon: CreditCard,
    description: 'Understand how payment requests work and why an approval can move money out of your account.',
    signs: [
      'A buyer says you must approve a request to receive money.',
      'Someone pressures you to enter your PIN to claim a refund or prize.',
      'The amount or recipient shown in the app does not match your intention.'
    ],
    safety: [
      'Read the payment request carefully before approving it.',
      'A collect request is a request for you to pay; it is not proof that money is being sent to you.',
      'Never approve a request you do not understand.',
      'Check your account balance and transaction history through your official app.'
    ],
    source: 'NPCI — UPI',
    url: 'https://www.npci.org.in/what-we-do/upi/product-overview'
  },
  {
    id: 5,
    title: 'Fake customer-care numbers',
    category: 'Online Threats',
    icon: Smartphone,
    description: 'Avoid impersonators posing as bank, payment-app or customer-support representatives.',
    signs: [
      'A search result or social media post gives you an unfamiliar support number.',
      'A caller asks for your PIN, OTP or password.',
      'Someone asks you to install a remote-access or screen-sharing app.'
    ],
    safety: [
      'Find support details inside your official banking app or on the bank website.',
      'Do not trust customer-care numbers posted by unknown social media accounts.',
      'Never share your PIN or OTP with a support representative.',
      'Do not install remote-access apps at the request of an unknown caller.'
    ],
    source: 'RBI — Financial Awareness Messages',
    url: 'https://rbi.org.in/commonman/images/FAME202426022024.pdf'
  },
  {
    id: 6,
    title: 'What to do after sharing credentials',
    category: 'Emergency Response',
    icon: AlertTriangle,
    description: 'Take prompt action if your UPI PIN, OTP or other banking credentials may have been exposed.',
    signs: [
      'You entered your PIN on an unfamiliar payment screen.',
      'You shared an OTP or banking password with someone.',
      'You suspect someone has access to your UPI account.'
    ],
    safety: [
      'Contact your bank immediately through an official channel.',
      'Explain what information may have been exposed and ask how to secure your account and UPI access.',
      'Report any unauthorised transactions without delay.',
      'Keep your complaint acknowledgement and review recent transactions.',
      'For suspected financial cyber fraud in India, call 1930.'
    ],
    source: 'RBI — Financial Awareness Messages',
    url: 'https://rbi.org.in/commonman/images/FAME202426022024.pdf'
  }
]

const questions = [
  {
    question: 'Someone sends you a QR code and says you must scan it to receive ₹2,000. What should you do?',
    options: [
      'Scan it and enter your UPI PIN',
      'Do not scan it; you do not need a PIN to receive money',
      'Share your OTP first'
    ],
    answer: 1,
    explanation: 'A UPI PIN authorises a payment. You do not need to enter it to receive money.'
  },
  {
    question: 'A caller claiming to be from your bank asks for your OTP. What is the safest response?',
    options: [
      'Share it if the caller knows your name',
      'Share only the first few digits',
      'Never share it; contact the bank through an official channel'
    ],
    answer: 2,
    explanation: 'Never disclose an OTP to another person, even if they claim to represent your bank.'
  },
  {
    question: 'You notice a UPI debit you did not make. What should you do first?',
    options: [
      'Wait a few days',
      'Contact your bank immediately through an official channel',
      'Delete your UPI application'
    ],
    answer: 1,
    explanation: 'Promptly notify your bank, report the unauthorised transaction and preserve the complaint reference.'
  },
  {
    question: 'A buyer sends you a collect request and says approving it will send you money. What should you remember?',
    options: [
      'A collect request asks you to approve a payment',
      'Every collect request is a refund',
      'Your PIN is needed to receive all payments'
    ],
    answer: 0,
    explanation: 'A collect request is a request for you to pay. Check the details and never approve an unexpected request.'
  }
]

const categories = [
  'All topics',
  'Account Security',
  'Payment Scams',
  'Online Threats',
  'Emergency Response'
]

function SafetyLibrary() {
  const [section, setSection] = useState('learn')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All topics')
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [quizFinished, setQuizFinished] = useState(false)

  const filteredGuides = guides.filter(guide => {
    const matchesCategory =
      category === 'All topics' || guide.category === category

    const text = `${guide.title} ${guide.description} ${guide.category}`.toLowerCase()
    const matchesSearch = text.includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const chooseAnswer = answerIndex => {
    if (answers[questionIndex] !== undefined) return

    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1)
    } else {
      setQuizFinished(true)
    }
  }

  const restartQuiz = () => {
    setQuestionIndex(0)
    setAnswers({})
    setQuizFinished(false)
  }

  const score = questions.filter(
    (question, index) => answers[index] === question.answer
  ).length

  return (
    <section className="library-page">

      {/* Match the main app's hero heading structure */}
      <div className="hero library-heading">
        <div className="welcome-tag">
          <BookOpen size={15} />
          YOUR DIGITAL SAFETY KNOWLEDGE CENTRE
        </div>

        <h1>
          Knowledge is your <span>best defence.</span>
        </h1>

        <p>
          Explore practical guides, recognise common UPI scams
          and learn what to do when something goes wrong.
        </p>
      </div>

      <div className="library-tabs">
        <button
          className={section === 'learn' ? 'selected' : ''}
          onClick={() => {
            setSection('learn')
            setSelectedGuide(null)
          }}
        >
          <BookOpen size={17} /> Learn
        </button>

        <button
          className={section === 'practice' ? 'selected' : ''}
          onClick={() => {
            setSection('practice')
            setSelectedGuide(null)
          }}
        >
          <ShieldCheck size={17} /> Practice
        </button>

        <button
          className={section === 'emergency' ? 'selected' : ''}
          onClick={() => {
            setSection('emergency')
            setSelectedGuide(null)
          }}
        >
          <Siren size={17} /> Emergency guide
        </button>
      </div>

      {section === 'learn' && (
        selectedGuide ? (
          <article className="guide-detail">
            <button
              className="library-back"
              onClick={() => setSelectedGuide(null)}
            >
              <ArrowLeft size={16} /> Back to all topics
            </button>

            <div className="guide-detail-icon">
              {(() => {
                const Icon = selectedGuide.icon
                return <Icon size={25} />
              })()}
            </div>

            <span className="guide-category">
              {selectedGuide.category}
            </span>

            <h2>{selectedGuide.title}</h2>
            <p className="guide-description">
              {selectedGuide.description}
            </p>

            <div className="guide-content-grid">
              <div className="guide-content-card">
                <h3><AlertTriangle size={18} /> Warning signs</h3>
                <ul>
                  {selectedGuide.signs.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="guide-content-card">
                <h3><ShieldCheck size={18} /> How to stay safe</h3>
                <ul>
                  {selectedGuide.safety.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="guide-source">
              <strong>Further reading</strong>
              <span>{selectedGuide.source}</span>
              <a href={selectedGuide.url} target="_blank" rel="noreferrer">
                View official guidance <ExternalLink size={14} />
              </a>
            </div>
          </article>
        ) : (
          <>
            <div className="library-tools">
              <div className="library-search">
                <Search size={18} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search safety topics..."
                />
              </div>

              <div className="library-filters">
                {categories.map(item => (
                  <button
                    key={item}
                    className={category === item ? 'selected' : ''}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="guide-grid">
              {filteredGuides.map(guide => {
                const Icon = guide.icon

                return (
                  <button
                    className="guide-card"
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <div className="guide-card-top">
                      <div className="guide-card-icon">
                        <Icon size={21} />
                      </div>
                      <span>{guide.category}</span>
                    </div>

                    <h3>{guide.title}</h3>
                    <p>{guide.description}</p>

                    <strong>
                      Read guide <span>→</span>
                    </strong>
                  </button>
                )
              })}
            </div>

            {filteredGuides.length === 0 && (
              <div className="library-empty">
                No matching guides found. Try another search.
              </div>
            )}
          </>
        )
      )}

      {section === 'practice' && (
        <div className="practice-card">
          <div className="practice-topline">
            <span>KNOWLEDGE CHECK</span>
            <span>
              {quizFinished
                ? 'Completed'
                : `Question ${questionIndex + 1} of ${questions.length}`}
            </span>
          </div>

          {quizFinished ? (
            <div className="quiz-result">
              <div className="quiz-result-icon">
                <CheckCircle2 size={30} />
              </div>

              <h2>Practice complete!</h2>
              <p>
                You answered {score} out of {questions.length} questions correctly.
              </p>

              <strong className="quiz-score">
                {Math.round((score / questions.length) * 100)}%
              </strong>

              <button className="library-primary-button" onClick={restartQuiz}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="quiz-progress">
                <span
                  style={{
                    width: `${((questionIndex + 1) / questions.length) * 100}%`
                  }}
                />
              </div>

              <h2>{questions[questionIndex].question}</h2>

              <div className="quiz-options">
                {questions[questionIndex].options.map((option, index) => {
                  const selected = answers[questionIndex] === index
                  const answered = answers[questionIndex] !== undefined
                  const correct = questions[questionIndex].answer === index

                  return (
                    <button
                      key={index}
                      className={[
                        'quiz-option',
                        selected ? 'chosen' : '',
                        answered && correct ? 'correct' : '',
                        selected && !correct ? 'incorrect' : ''
                      ].join(' ')}
                      onClick={() => chooseAnswer(index)}
                      disabled={answered}
                    >
                      <span>{option}</span>
                      {answered && correct && <CheckCircle2 size={18} />}
                      {selected && !correct && <XCircle size={18} />}
                    </button>
                  )
                })}
              </div>

              {answers[questionIndex] !== undefined && (
                <div className="quiz-explanation">
                  <strong>
                    {answers[questionIndex] === questions[questionIndex].answer
                      ? 'Correct!'
                      : 'Not quite.'}
                  </strong>
                  <p>{questions[questionIndex].explanation}</p>

                  <button
                    className="library-primary-button"
                    onClick={nextQuestion}
                  >
                    {questionIndex === questions.length - 1
                      ? 'See my score'
                      : 'Next question'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {section === 'emergency' && (
        <div className="emergency-card">
          <div className="emergency-banner">
            <AlertTriangle size={24} />
            <div>
              <h2>Suspect UPI fraud?</h2>
              <p>Act promptly. Contact your bank through an official channel.</p>
            </div>
          </div>

          <div className="emergency-steps">
            {[
              ['Contact your bank', 'Immediately report the unauthorised transaction or suspected credential exposure. Ask how to secure your account and UPI access.'],
              ['Call 1930', 'For suspected financial cyber fraud in India, call the national cybercrime helpline as soon as possible.'],
              ['Submit an online report', 'Use the official National Cyber Crime Reporting Portal at cybercrime.gov.in.'],
              ['Keep your records', 'Save transaction details, messages and complaint acknowledgement or reference numbers.'],
              ['Review your account', 'Check recent transactions and report any other unfamiliar activity to your bank.']
            ].map((step, index) => (
              <div className="emergency-step" key={index}>
                <div className="emergency-number">{index + 1}</div>
                <div>
                  <h3>{step[0]}</h3>
                  <p>{step[1]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="emergency-actions">
            <a href="tel:1930">
              <Siren size={17} /> Call 1930
            </a>
            <a
              href="https://cybercrime.gov.in/"
              target="_blank"
              rel="noreferrer"
            >
              Report online <ExternalLink size={15} />
            </a>
          </div>

          <p className="emergency-note">
            Never share your UPI PIN or OTP with anyone. Do not delay
            contacting your bank while collecting evidence.
          </p>
        </div>
      )}

      <div className="library-disclaimer">
        <LockKeyhole size={15} />
        Educational information based on the official sources linked in each guide.
        For account-specific help, contact your bank.
      </div>
    </section>
  )
}

export default SafetyLibrary
