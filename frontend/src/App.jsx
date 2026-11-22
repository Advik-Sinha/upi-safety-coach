
import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SafetyLibrary from './SafetyLibrary'

import {
  ShieldCheck,
  MessageCircle,
  ScanSearch,
  BookOpen,
  Settings,
  Plus,
  ArrowUp,
  LockKeyhole,
  AlertTriangle,
  Sparkles,
  History,
  Menu,
  X,
  FileSearch,
  ShieldAlert
} from 'lucide-react'

import './App.css'

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '')

const suggestions = [
  {
    icon: ScanSearch,
    title: 'Check a suspicious message',
    description: 'Understand whether a message could be fraudulent.'
  },
  {
    icon: AlertTriangle,
    title: 'Understand UPI scams',
    description: 'Learn how common payment scams work.'
  },
  {
    icon: LockKeyhole,
    title: 'Secure my UPI account',
    description: 'Get practical digital payment safety tips.'
  }
]

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const [conversations, setConversations] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('upi_conversations') || '[]'
      )
    } catch {
      return []
    }
  })

  const [activeChatId, setActiveChatId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Page navigation
  const [activePage, setActivePage] = useState('chat')

  // Fraud analyzer states
  const [analyzerText, setAnalyzerText] = useState('')
  const [analysisResult, setAnalysisResult] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const messagesEndRef = useRef(null)

  // Automatically scroll to latest chat message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages, isLoading])

  // Automatically save conversations
  useEffect(() => {
    localStorage.setItem(
      'upi_conversations',
      JSON.stringify(conversations)
    )
  }, [conversations])

  // Send message to AI chatbot
  const sendMessage = async (text = message) => {
    const value = text.trim()

    if (!value || isLoading) return

    const chatId = activeChatId || crypto.randomUUID()

    const userMessage = {
      role: 'user',
      content: value
    }

    const updatedMessages = [...messages, userMessage]

    setActiveChatId(chatId)
    setMessages(updatedMessages)
    setMessage('')
    setIsLoading(true)

    const existingChat = conversations.find(
      chat => chat.id === chatId
    )

    const title = existingChat?.title || value.slice(0, 40)

    const saveChat = (chatMessages) => {
      setConversations(prev => {
        const updatedChat = {
          id: chatId,
          title,
          messages: chatMessages,
          updatedAt: Date.now()
        }

        return [
          updatedChat,
          ...prev.filter(chat => chat.id !== chatId)
        ]
      })
    }

    saveChat(updatedMessages)

    try {
      const response = await fetch(
      `${API_BASE_URL}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: value,
            history: messages
          })
        }
      )

      if (!response.ok) {
        throw new Error('Backend request failed')
      }

      const data = await response.json()

    const finalMessages = [
  ...updatedMessages,
  {
    role: 'assistant',
    content: data.reply,
    answerMode: data.answer_mode || 'general_guidance',
    sources: Array.isArray(data.sources) ? data.sources : []
  }
]

      setMessages(finalMessages)
      saveChat(finalMessages)

    } catch (error) {
      console.error(error)

      const finalMessages = [
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Unable to connect to the AI service. Please try again.'
        }
      ]

      setMessages(finalMessages)
      saveChat(finalMessages)

    } finally {
      setIsLoading(false)
    }
  }

  // Analyze suspicious messages
  const analyzeMessage = async () => {
    const value = analyzerText.trim()

    if (!value || isAnalyzing) return

    setIsAnalyzing(true)
    setAnalysisResult('')

    try {
      const response = await fetch(
      `${API_BASE_URL}/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: value
          })
        }
      )

      if (!response.ok) {
        throw new Error('Analysis request failed')
      }

      const data = await response.json()

      setAnalysisResult(data.analysis)

    } catch (error) {
      console.error(error)

      setAnalysisResult(
        'Unable to analyze the message. Please check that your backend is running and try again.'
      )

    } finally {
      setIsAnalyzing(false)
    }
  }

  // Start a new conversation
  const newChat = () => {
    if (isLoading) return

    setMessages([])
    setActiveChatId(null)
    setMessage('')
    setSidebarOpen(false)
    setActivePage('chat')
  }

  // Open an existing conversation
  const openConversation = (chat) => {
    if (isLoading) return

    setMessages(chat.messages)
    setActiveChatId(chat.id)
    setMessage('')
    setSidebarOpen(false)
    setActivePage('chat')
  }

  // Delete a conversation
  const deleteConversation = (id) => {
    setConversations(prev =>
      prev.filter(chat => chat.id !== id)
    )

    if (activeChatId === id) {
      setMessages([])
      setActiveChatId(null)
    }
  }

  return (
    <div className="app-shell">

      {/* Sidebar */}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

        <div className="brand">

          <div className="brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h2>UPI Safety</h2>
            <span>COACH</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

        </div>

        <button
          className="new-chat"
          onClick={newChat}
        >
          <Plus size={18} />
          New conversation
        </button>

        <div className="nav-label">WORKSPACE</div>

        <button
          className={`nav-item ${activePage === 'chat' ? 'active' : ''}`}
          onClick={() => setActivePage('chat')}
        >
          <MessageCircle size={18} />
          AI Assistant
        </button>

        <button
          className={`nav-item ${activePage === 'analyzer' ? 'active' : ''}`}
          onClick={() => setActivePage('analyzer')}
        >
          <ScanSearch size={18} />
          Fraud checker
        </button>
<button
  className={`nav-item ${activePage === 'library' ? 'active' : ''}`}
  onClick={() => {
    setActivePage('library')
    setSidebarOpen(false)
  }}
>
  <BookOpen size={18} />
  Safety library
</button>

        <div className="nav-label history-label">
          RECENT ACTIVITY
        </div>

        <div className="conversation-list">

          {conversations.length === 0 ? (

            <div className="empty-history">
              <History size={19} />
              <span>Your conversations will appear here.</span>
            </div>

          ) : (

            conversations.map(chat => (

              <div
                key={chat.id}
                className={`conversation-item ${
                  activeChatId === chat.id ? 'active' : ''
                }`}
              >

                <button
                  className="conversation-open"
                  onClick={() => openConversation(chat)}
                >
                  <MessageCircle size={16} />
                  <span>{chat.title}</span>
                </button>

                <button
                  className="conversation-delete"
                  onClick={() => deleteConversation(chat.id)}
                  title="Delete conversation"
                >
                  <X size={15} />
                </button>

              </div>

            ))

          )}

        </div>

        <div className="sidebar-bottom">

          <div className="security-note">
            <LockKeyhole size={18} />

            <div>
              <strong>Your safety matters</strong>
              <p>Never share your PIN or OTP.</p>
            </div>
          </div>

          <button className="nav-item settings">
            <Settings size={18} />
            Settings
          </button>

          <div className="profile">
            <div className="avatar">U</div>

            <div>
              <strong>Guest User</strong>
              <span>Personal workspace</span>
            </div>
          </div>

        </div>

      </aside>

      {/* Mobile overlay */}

      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main application */}

      <main className="main-area">

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span>

            <strong>
             {activePage === 'chat'
  ? 'AI Assistant'
  : activePage === 'analyzer'
    ? 'Fraud Checker'
    : 'Safety Library'}
            </strong>
          </div>

          <div className="topbar-right">
            <span className="online-dot" />
            <span>Assistant ready</span>
            <div className="top-avatar">U</div>
          </div>

        </header>

        <div className="content">

          {/* PAGE SWITCHING */}

         {activePage === 'library' ? (
  <SafetyLibrary />
) : activePage === 'analyzer' ? (

            /* FRAUD ANALYZER PAGE */

            <section className="analyzer-page">

              <div className="welcome-tag">
                <ShieldAlert size={15} />
                INTELLIGENT FRAUD DETECTION
              </div>

              <div className="hero">

                <h1>
                  Think before you <span>pay.</span>
                </h1>

                <p>
                  Paste a suspicious SMS, WhatsApp message or payment
                  request. Our AI will examine it for potential
                  warning signs.
                </p>

              </div>

              <div className="analyzer-card">

                <div className="analyzer-card-heading">

                  <div className="suggestion-icon">
                    <FileSearch size={22} />
                  </div>

                  <div>
                    <h3>Message Analysis</h3>
                    <p>Paste the message you'd like us to examine.</p>
                  </div>

                </div>

                <textarea
                  className="analyzer-input"
                  value={analyzerText}
                  onChange={e => {
                    setAnalyzerText(e.target.value)
                    setAnalysisResult('')
                  }}
                  placeholder="Example: Your bank account will be blocked today. Click this link immediately to update your KYC..."
                  rows={7}
                />

                <div className="analyzer-actions">

                  <span>
                    <LockKeyhole size={14} />
                    Never paste actual OTPs, PINs or banking details.
                  </span>

                  <button
                    className="analyze-button"
                    onClick={analyzeMessage}
                    disabled={
                      !analyzerText.trim() || isAnalyzing
                    }
                  >
                    {isAnalyzing
                      ? 'Analyzing...'
                      : 'Analyze message'}

                    <ScanSearch size={17} />
                  </button>

                </div>

              </div>

              {isAnalyzing && (

                <div className="analysis-result">

                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  Examining the message for warning signs...

                </div>

              )}

              {analysisResult && (

                <div className="analysis-result">

                  <div className="result-heading">
                    <ShieldCheck size={21} />
                    <h3>Analysis Report</h3>
                  </div>

                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {analysisResult}
                    </ReactMarkdown>
                  </div>

                </div>

              )}

              <p className="disclaimer">
                AI analysis is not a guarantee that a message is
                genuine or fraudulent. Never share your UPI PIN or OTP.
              </p>

            </section>

          ) : (

            /* AI ASSISTANT PAGE */

            <>

              <div className="welcome-tag">
                <Sparkles size={14} />
                YOUR DIGITAL PAYMENT SAFETY PARTNER
              </div>

              <section className="hero">

                <h1>
                  Stay ahead of <span>UPI fraud.</span>
                </h1>

                <p>
                  Understand suspicious situations, learn about
                  digital payment scams and make safer financial
                  decisions.
                </p>

              </section>

              <div className="trust-strip">

                <div>
                  <ShieldCheck size={17} />
                  Safety-first guidance
                </div>

                <div>
                  <LockKeyhole size={16} />
                  Never ask for your PIN or OTP
                </div>

              </div>

              {/* Welcome screen or chat */}

              {messages.length === 0 ? (

                <>

                  <section className="suggestions">

                    <div className="section-heading">
                      <h3>How can I help you today?</h3>
                      <span>QUICK ACTIONS</span>
                    </div>

                    <div className="suggestion-grid">

                      {suggestions.map((item, index) => {

                        const Icon = item.icon

                        return (

                          <button
                            className="suggestion-card"
                            key={index}
                            onClick={() => sendMessage(item.title)}
                            disabled={isLoading}
                          >

                            <div className="suggestion-icon">
                              <Icon size={21} />
                            </div>

                            <strong>{item.title}</strong>

                            <p>{item.description}</p>

                          </button>

                        )

                      })}

                    </div>

                  </section>

                  <div className="example-prompt">

                    <span>TRY ASKING</span>

                    <button
                      onClick={() =>
                        sendMessage(
                          'Someone asked me to enter my UPI PIN to receive money. Is this safe?'
                        )
                      }
                    >
                      "Someone asked me to enter my UPI PIN to receive money. Is this safe?"

                      <ArrowUp size={15} />
                    </button>

                  </div>

                </>

              ) : (

                /* Chat interface */

                <section className="chat-area">

                  {messages.map((item, index) => (

                    <div
                      className={`message-row ${item.role}`}
                      key={index}
                    >

                      <div className="message-avatar">
                        {item.role === 'assistant'
                          ? <ShieldCheck size={19} />
                          : 'U'}
                      </div>

                      <div className="message-content">

                        <strong>
                          {item.role === 'assistant'
                            ? 'Safety Coach'
                            : 'You'}
                        </strong>

                        <div className="markdown-content">

                         {item.role === 'assistant' ? (

  <>
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {item.content}
    </ReactMarkdown>

    {item.answerMode === 'knowledge_base_assisted' ? (

      <div className="source-panel">

        <div className="source-status">
          <ShieldCheck size={16} />
          Official knowledge-base material retrieved
        </div>

        {item.sources?.length > 0 && (

          <details className="source-details">

            <summary>
              Sources & References ({item.sources.length})
            </summary>

            <div className="source-list">

              {item.sources.map((source, sourceIndex) => (

                <div className="source-item" key={sourceIndex}>

                  <strong>{source.organisation}</strong>

                  <p>{source.title}</p>

                  <span>
                    Page: {source.page}
                  </span>

                  {source.url && (

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View official source ↗
                    </a>

                  )}

                </div>

              ))}

            </div>

          </details>

        )}

        <p className="source-disclaimer">
          Retrieved sources support this response but do not
          independently verify every AI-generated statement.
        </p>

      </div>

    ) : (

      <div className="source-panel general-guidance">
        <Sparkles size={15} />
        General AI guidance — not verified against the knowledge base.
      </div>

    )}

  </>

) : (

  <p>{item.content}</p>

)}

                        </div>

                      </div>

                    </div>

                  ))}

                  {/* AI typing indicator */}

                  {isLoading && (

                    <div className="message-row assistant">

                      <div className="message-avatar">
                        <ShieldCheck size={19} />
                      </div>

                      <div className="message-content">

                        <strong>Safety Coach</strong>

                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>

                      </div>

                    </div>

                  )}

                  <div ref={messagesEndRef} />

                </section>

              )}

              {/* Message composer */}

              <section className="composer-section">

                <form
                  className="composer"
                  onSubmit={e => {
                    e.preventDefault()
                    sendMessage()
                  }}
                >

                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => {
                      if (
                        e.key === 'Enter' &&
                        !e.shiftKey
                      ) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Describe a suspicious UPI message or ask a question..."
                    rows={2}
                    disabled={isLoading}
                  />

                  <div className="composer-footer">

                    <span>
                      <LockKeyhole size={13} />
                      Do not enter actual PINs, OTPs or banking details.
                    </span>

                    <button
                      type="submit"
                      disabled={!message.trim() || isLoading}
                    >
                      <ArrowUp size={19} />
                    </button>

                  </div>

                </form>

                <p className="disclaimer">
                  UPI Safety Coach provides educational guidance,
                  not official banking advice. For suspected fraud,
                  contact your bank and India's cybercrime helpline 1930.
                </p>

              </section>

            </>

          )}

        </div>

      </main>

    </div>
  )
}

export default App
