import { useState, useEffect, useRef } from 'react'
import { FiArrowDown, FiMail, FiUser, FiCalendar, FiMapPin, FiGlobe, FiAward, FiHome, FiUsers } from 'react-icons/fi'
import { IoCheckmarkCircleOutline, IoTrophyOutline } from 'react-icons/io5'
import logo from './assets/images/courted-long-logo.png'
import christinaImg from './assets/images/christie-co-founder.png'
import stellaImg from './assets/images/stella-co-founder.png'
import PlacesAutocomplete from './components/PlacesAutocomplete'
import PickleballAnimation from './components/PickleballAnimation'
import './App.css'

// Custom Outlined Heart Icon
const ThinHeartIcon = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

// Google Apps Script Web App URL from environment variable
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || ''

function App() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    gender: '', 
    birthday: '', 
    duprRating: '', 
    duprId: '',
    lookingToDate: '',
    whenDoYouPlay: [],
    lookingFor: [],
    dateGenderPreference: [],
    partnerType: [],
    currentClub: '', 
    city: '', 
    country: '' 
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToForm = () => {
    const formElement = document.getElementById('waitlist-form')
    if (formElement) {
      const yOffset = 0
      const y = formElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const scrollToAbout = () => {
    const aboutElement = document.getElementById('about-us')
    if (aboutElement) {
      const yOffset = 0
      const y = aboutElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
      setMessage({
        type: 'error',
        text: 'Please configure your Google Apps Script URL'
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address'
      })
      return
    }

    // Birthday validation (format: YYYY-MM-DD with 4-digit year)
    const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!birthdayRegex.test(formData.birthday)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid birthday in YYYY-MM-DD format (e.g., 1990-01-15)'
      })
      return
    }

    // Additional birthday validation: ensure year is 4 digits and valid date
    const [year, month, day] = formData.birthday.split('-')
    const yearNum = parseInt(year, 10)
    const monthNum = parseInt(month, 10)
    const dayNum = parseInt(day, 10)
    
    if (year.length !== 4 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid 4-digit year (1900 to current year)'
      })
      return
    }

    if (monthNum < 1 || monthNum > 12) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid month (01-12)'
      })
      return
    }

    if (dayNum < 1 || dayNum > 31) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid day (01-31)'
      })
      return
    }

    // Validation
    if (formData.whenDoYouPlay.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select when you play'
      })
      return
    }

    if (formData.lookingFor.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select type of partner'
      })
      return
    }

    if (formData.partnerType.length === 0) {
      setMessage({
        type: 'error',
        text: 'Please select what kind of partner you are looking for'
      })
      return
    }

    if (!formData.lookingToDate) {
      setMessage({
        type: 'error',
        text: 'Please select if you are looking to date'
      })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    const data = {
      name: formData.name,
      email: formData.email,
      gender: formData.gender,
      birthday: formData.birthday,
      duprRating: formData.duprRating,
      duprId: formData.duprId,
      lookingToDate: formData.lookingToDate,
      whenDoYouPlay: formData.whenDoYouPlay.join(', '),
      lookingFor: formData.lookingFor.join(', '),
      dateGenderPreference: formData.dateGenderPreference.join(', '),
      partnerType: formData.partnerType.join(', '),
      currentClub: formData.currentClub,
      city: formData.city,
      country: formData.country,
      timestamp: new Date().toISOString()
    }

    // Validate Google Script URL is configured
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
      setMessage({
        type: 'error',
        text: 'Form submission is not configured. Please contact support.'
      })
      setLoading(false)
      return
    }

    try {
      // Send request without waiting for response (optimistic update)
      // Since we're using no-cors mode, we can't read the response anyway
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).catch(err => {
        // Silently handle errors - data is sent, we just can't verify
        console.log('Background submission:', err)
      })

      // Show success after a brief delay for better UX
      setTimeout(() => {
        setMessage({
          type: 'success',
          text: "Thank you. You've been added to our waitlist."
        })
        setIsSubmitted(true)
        setFormData({ 
          name: '', 
          email: '', 
          gender: '', 
          birthday: '', 
          duprRating: '', 
          duprId: '',
          lookingToDate: '',
          whenDoYouPlay: [],
          lookingFor: [],
          dateGenderPreference: [],
          partnerType: [],
          currentClub: '', 
          city: '', 
          country: '' 
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      })
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      const { name, value, checked } = e.target
      setFormData(prev => {
        const currentArray = prev[name] || []
        if (checked) {
          return {
            ...prev,
            [name]: [...currentArray, value]
          }
        } else {
          return {
            ...prev,
            [name]: currentArray.filter(item => item !== value)
          }
        }
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handlePlaceSelect = (placeData) => {
    setFormData(prev => ({
      ...prev,
      currentClub: placeData.currentClub,
      city: placeData.city,
      country: placeData.country
    }))
  }

  return (
    <div className="app">
      <nav className="top-nav">
        <div className="nav-container">
          {isScrolled && (
            <button className="nav-logo" onClick={scrollToTop}>
              <img src={logo} alt="Courted" className="nav-logo-img" />
            </button>
          )}
          {!isScrolled && <div></div>}
          <div className="nav-links">
            <button className="nav-link" onClick={scrollToAbout}>About Us</button>
            <button className="nav-link" onClick={scrollToForm}>Join Waitlist</button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <img src={logo} alt="Courted" className="logo" />
          <div className="sections-header">
            <span className="section-label">Meet.</span>
            <span className="section-label">Match.</span>
            <span className="section-label">Courted.</span>
          </div>
          <p className="tagline">The #1 AI full-stack pickleball partner matching app. Spend less time searching, more time playing.</p>
          

          <div className="features-grid">
            <div className="feature-card">
              <FiUsers className="feature-icon" />
              <h3 className="feature-title">Partner</h3>
              <p className="feature-description">
                Find your ideal doubles partner based on skill, style, and goals.
              </p>
            </div>

            <div className="feature-card">
              <ThinHeartIcon className="feature-icon feature-icon-connection" />
              <h3 className="feature-title">Connection</h3>
              <p className="feature-description">
                See if chemistry goes beyond the court - naturally, effortlessly.
              </p>
            </div>

            <div className="feature-card feature-card-coming-soon">
              <span className="coming-soon-badge">Coming Soon</span>
              <IoTrophyOutline className="feature-icon feature-icon-coach" />
              <h3 className="feature-title">Coach</h3>
              <p className="feature-description">
                Match with coaches who fit your level and schedule.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-bottom">
          <p className="beta-access-text">Get early access to our beta matching</p>

          <button className="cta-button" onClick={scrollToForm}>
            <span>Join the waitlist</span>
            <FiArrowDown className="arrow-icon" />
          </button>

          <p className="consent-text">By joining, you agree we can email you about your matches and product updates. Beta matching currently is limited to Greater Toronto Area. </p>
        </div>
      </section>

      <section id="about-us" className="about-section">
        <div className="about-container">
          <h2 className="about-title">Co-Founders</h2>
          <div className="co-founders-grid">
            <div className="co-founder-card">
              <img src={christinaImg} alt="Christina Chin" className="co-founder-image" />
              <div className="co-founder-content">
                <p className="co-founder-name">Christina Chin, CPA, Co-Founder</p>
                <p className="co-founder-text">
                  I graduated from the Schulich School of Business and spent several years at EY-Parthenon as a Management Consultant before resigning in March 2025 to pursue entrepreneurship full time. Since then, I've built multiple six-figure businesses in the pickleball industry and became the largest pickleball content creator in Canada (@pickleballonice).
                </p>
                <p className="co-founder-text">
                  I played university hockey on a sports scholarship and trained toward the 2022 Beijing Winter Olympics before discovering pickleball. Now, I'm combining everything I've learned in business, sport, and storytelling to build Courted.
                </p>
                <p className="co-founder-text">
                  Let's build together!
                </p>
              </div>
            </div>

            <div className="co-founder-card">
              <img src={stellaImg} alt="Stella Li" className="co-founder-image" />
              <div className="co-founder-content">
                <p className="co-founder-name">Stella Li, MSc, Co-Founder</p>
                <p className="co-founder-text">
                  I graduated with a Masters in Computer Science from USC Viterbi School of Engineering and currently work as a Senior Software Engineer at a unicorn tech company in San Francisco. Before that, I was a D1 NCAA soccer player on a full-ride scholarship.
                </p>
                <p className="co-founder-text">
                  In college, I built a website that recommends restaurants based on dietary restrictions, and that's when I realized I love creating products that help people connect in real life. I found pickleball, fell in love with the community, and saw a massive gap - finding the right partner shouldn't be left to chance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist-form" className="form-section">
        {isSubmitted ? (
          <div className="success-modal">
            <div className="success-modal-content">
              <div className="success-icon">
                <PickleballAnimation />
              </div>
              <h2 className="success-title">Welcome to the waitlist!</h2>
              <p className="success-message">You're officially in the rally - your ideal partner is warming up.</p>
            </div>
          </div>
        ) : (
          <>
            <h4 className="form-section-title">Court chemistry starts here</h4>
            <div className="form-container">
              <form onSubmit={handleSubmit} className="form">
            <div className="form-group full-width">
              <label htmlFor="name" className="form-label">
                <FiUser className="label-icon" />
                <span>Name</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="email" className="form-label">
                <FiMail className="label-icon" />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                <FiUser className="label-icon" />
                <span>Gender</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="birthday" className="form-label">
                <FiCalendar className="label-icon" />
                <span>Birthday</span>
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                required
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="duprRating" className="form-label">
                <FiAward className="label-icon" />
                <span>DUPR/Self Rating</span>
              </label>
              <input
                type="number"
                id="duprRating"
                name="duprRating"
                value={formData.duprRating}
                onChange={handleChange}
                placeholder="Enter your DUPR rating"
                className="form-input"
                min="0"
                max="10"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duprId" className="form-label">
                <FiAward className="label-icon" />
                <span>DUPR ID</span>
              </label>
              <input
                type="text"
                id="duprId"
                name="duprId"
                value={formData.duprId}
                onChange={handleChange}
                placeholder="Enter your DUPR ID"
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="currentClub" className="form-label">
                <FiHome className="label-icon" />
                <span>Current Club / City</span>
              </label>
              <PlacesAutocomplete
                value={formData.currentClub}
                onChange={handleChange}
                onPlaceSelect={handlePlaceSelect}
                placeholder="Enter your club or city"
                className="form-input"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                <span>When do you play? <span className="label-hint">(Select all that apply)</span></span>
              </label>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="whenDoYouPlay"
                    value="Morning"
                    checked={formData.whenDoYouPlay.includes('Morning')}
                    onChange={handleChange}
                  />
                  <span>Morning</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="whenDoYouPlay"
                    value="Afternoon"
                    checked={formData.whenDoYouPlay.includes('Afternoon')}
                    onChange={handleChange}
                  />
                  <span>Afternoon</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="whenDoYouPlay"
                    value="Night"
                    checked={formData.whenDoYouPlay.includes('Night')}
                    onChange={handleChange}
                  />
                  <span>Night</span>
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                <span>Type of partner<span className="label-hint">(Select all that apply)</span></span>
              </label>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="lookingFor"
                    value="Drilling"
                    checked={formData.lookingFor.includes('Drilling')}
                    onChange={handleChange}
                  />
                  <span>Drilling</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="lookingFor"
                    value="Playing"
                    checked={formData.lookingFor.includes('Playing')}
                    onChange={handleChange}
                  />
                  <span>Playing</span>
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                <span>What kind of partner are you looking for? <span className="label-hint">(Select all that apply)</span></span>
              </label>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="partnerType"
                    value="Doubles"
                    checked={formData.partnerType.includes('Doubles')}
                    onChange={handleChange}
                  />
                  <span>Doubles</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    name="partnerType"
                    value="Mixed"
                    checked={formData.partnerType.includes('Mixed')}
                    onChange={handleChange}
                  />
                  <span>Mixed</span>
                </label>
              </div>
            </div>

            <div className="form-group full-width date-preference-row">
              <div className="form-group inline-radio-group">
                <label className="form-label">
                  <span>Looking to Date?</span>
                </label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="lookingToDate"
                      value="Yes"
                      checked={formData.lookingToDate === 'Yes'}
                      onChange={handleChange}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="lookingToDate"
                      value="No"
                      checked={formData.lookingToDate === 'No'}
                      onChange={handleChange}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.lookingToDate === 'Yes' && (
                <div className="form-group inline-radio-group">
                  <label className="form-label">
                    <span>Preference <span className="label-hint">(Select all that apply)</span></span>
                  </label>
                  <div className="checkbox-group">
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="dateGenderPreference"
                        value="Men"
                        checked={formData.dateGenderPreference.includes('Men')}
                        onChange={handleChange}
                      />
                      <span>Men</span>
                    </label>
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="dateGenderPreference"
                        value="Women"
                        checked={formData.dateGenderPreference.includes('Women')}
                        onChange={handleChange}
                      />
                      <span>Women</span>
                    </label>
                  </div>
                </div>
              )}
            </div>


            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Submit</span>
                  <IoCheckmarkCircleOutline className="submit-icon" />
                </>
              )}
            </button>
          </form>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
          </>
        )}
      </section>
    </div>
  )
}

export default App
