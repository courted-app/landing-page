import { useState, useEffect } from 'react'
import { FiArrowDown, FiMail, FiUser, FiCalendar, FiAward, FiHome, FiUsers, FiInstagram, FiBook, FiCreditCard, FiExternalLink } from 'react-icons/fi'
import { IoCheckmarkCircleOutline, IoTrophyOutline } from 'react-icons/io5'
import logo from './assets/images/courted-long-logo.png'
import christinaImg from './assets/images/christie-co-founder.png'
import stellaImg from './assets/images/stella-co-founder.png'
import eventImage from './assets/images/courtedxhisportsstouffville.png'
import dillPickleEventImage from './assets/images/courtedxdill.png'
import sixPickleEventImage from './assets/images/courtedx6ixpickle.png'
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

// Stripe Payment Link
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/4gMbJ1bs485b7Kl7aOeIw00'

function App() {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    gender: '', 
    ageRange: '', 
    partnerAgeRangeMin: 18,
    partnerAgeRangeMax: 80,
    duprRating: '', 
    duprId: '',
    lookingToDate: '',
    education: '',
    datingAgeRangeMin: 18,
    datingAgeRangeMax: 65,
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
  const [inventory, setInventory] = useState({ available: null, totalQuantity: 0, sold: 0, loading: true })
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventFormLoading, setEventFormLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [eventFormData, setEventFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    ageRange: '',
    preferredPartnerAgeRangeMin: 18,
    preferredPartnerAgeRangeMax: 80,
    duprRating: '',
    duprId: '',
    timeOfDay: [],
    daysOfPlay: [],
    fieldOfWork: '',
    typeOfPlay: [],
    priorities: [],
    currentClub: '',
    city: '',
    country: ''
  })
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0, loading: true })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch gender counts on mount and when event form opens
  useEffect(() => {
    const fetchGenderCounts = async () => {
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        setGenderCounts({ male: 0, female: 0, loading: false })
        return
      }

      try {
        const url = `${GOOGLE_SCRIPT_URL}?action=getGenderCounts`
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.success) {
          const maleCount = data.maleCount || 0
          const femaleCount = data.femaleCount || 0
        
          
          setGenderCounts({
            male: maleCount,
            female: femaleCount,
            loading: false
          })
        } else {
          console.error('Failed to fetch gender counts:', data.error)
          setGenderCounts({ male: 0, female: 0, loading: false })
        }
      } catch (error) {
        console.error('Error fetching gender counts:', error)
        setGenderCounts({ male: 0, female: 0, loading: false })
      }
    }

    fetchGenderCounts()
    // Refresh every 30 seconds
    const interval = setInterval(fetchGenderCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  // Fetch inventory on mount and periodically
  useEffect(() => {
    const fetchInventory = async () => {
      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        setInventory(prev => ({ ...prev, loading: false }))
        return
      }

      try {
        const url = `${GOOGLE_SCRIPT_URL}?action=getInventory`
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.success && data.inventory) {
          setInventory({
            available: data.inventory.available,
            totalQuantity: data.inventory.totalQuantity,
            sold: data.inventory.sold,
            loading: false
          })
        } else {
          setInventory(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Error fetching inventory:', error)
        setInventory(prev => ({ ...prev, loading: false }))
      }
    }

    fetchInventory()
    // Refresh inventory every 30 seconds
    const interval = setInterval(fetchInventory, 30000)
    return () => clearInterval(interval)
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

  const scrollToEvents = () => {
    const aboutElement = document.getElementById('events')
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

    // Age range validation
    if (!formData.ageRange) {
      setMessage({
        type: 'error',
        text: 'Please select your age range'
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

    // Validate dating fields if looking to date
    if (formData.lookingToDate === 'Yes') {
      if (!formData.education) {
        setMessage({
          type: 'error',
          text: 'Please select your education level'
        })
        return
      }
      if (!formData.datingAgeRangeMin || !formData.datingAgeRangeMax) {
        setMessage({
          type: 'error',
          text: 'Please set your dating age range'
        })
        return
      }
      if (formData.datingAgeRangeMin > formData.datingAgeRangeMax) {
        setMessage({
          type: 'error',
          text: 'Minimum age cannot be greater than maximum age'
        })
        return
      }
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    const data = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      gender: formData.gender,
      ageRange: formData.ageRange,
      matchSameAgeGroup: `${formData.partnerAgeRangeMin}-${formData.partnerAgeRangeMax}`,
      duprRating: formData.duprRating,
      duprId: formData.duprId,
      lookingToDate: formData.lookingToDate,
      education: formData.education || '',
      datingAgeRange: formData.lookingToDate === 'Yes' 
        ? `${formData.datingAgeRangeMin}-${formData.datingAgeRangeMax}` 
        : '',
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
        firstName: '', 
        lastName: '', 
        email: '', 
        gender: '', 
        ageRange: '', 
        partnerAgeRangeMin: 18,
        partnerAgeRangeMax: 80,
        matchSameAgeGroup: '',
        duprRating: '', 
        duprId: '',
        lookingToDate: '',
        education: '',
        datingAgeRangeMin: 18,
        datingAgeRangeMax: 65,
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

  const handleEventPlaceSelect = (placeData) => {
    setEventFormData(prev => ({
      ...prev,
      currentClub: placeData.currentClub,
      city: placeData.city,
      country: placeData.country
    }))
  }

  const isEventFormValid = () => {
    // Check if gender is full
    if (eventFormData.gender === 'Male' && genderCounts.male >= 16) {
      return false
    }
    if (eventFormData.gender === 'Female' && genderCounts.female >= 16) {
      return false
    }
    
    return (
      eventFormData.firstName.trim() !== '' &&
      eventFormData.lastName.trim() !== '' &&
      eventFormData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eventFormData.email) &&
      eventFormData.gender !== '' &&
      eventFormData.ageRange !== '' &&
      eventFormData.duprRating !== '' &&
      eventFormData.currentClub.trim() !== '' &&
      eventFormData.timeOfDay.length > 0 &&
      eventFormData.daysOfPlay.length > 0 &&
      eventFormData.fieldOfWork.trim() !== '' &&
      eventFormData.typeOfPlay.length > 0 &&
      eventFormData.priorities.length > 0
    )
  }

  const getGenderFullMessage = () => {
    if (eventFormData.gender === 'Male' && genderCounts.male >= 16) {
      return 'Male spots are sold out for this event.'
    }
    if (eventFormData.gender === 'Female' && genderCounts.female >= 16) {
      return 'Female spots are sold out for this event.'
    }
    return ''
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
            <button className="nav-link" onClick={scrollToEvents}>Events</button>
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
            <span className="section-label">Play.</span>
          </div>
          <p className="tagline">The first AI-powered pickleball partner matching service. Spend less time searching, more time playing.</p>
          

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
          <p className="beta-access-text">Get early access to our matching services</p>

          <button className="cta-button" onClick={scrollToForm}>
            <span>Join the waitlist</span>
            <FiArrowDown className="arrow-icon" />
          </button>
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
                  Christina graduated from the Schulich School of Business and spent several years at EY-Parthenon as a Management Consultant before resigning in March 2025 to pursue entrepreneurship full time. Since then, she's built multiple six-figure businesses in the pickleball industry and became the largest pickleball content creator in Canada (@pickleballonice).
                </p>
                <p className="co-founder-text">
                  Christina played university hockey on a sports scholarship and trained toward the 2022 Beijing Winter Olympics before discovering pickleball. Now, Christina is combining everything she's learned in business, sport, and storytelling to build Courted.
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
                  Stella graduated with a Masters in Computer Science from USC Viterbi School of Engineering and currently works as a Senior Software Engineer at a unicorn tech company in San Francisco. Before that, she was a D1 NCAA soccer player on a full-ride scholarship.
                </p>
                <p className="co-founder-text">
                  In college, Stella built a website that recommends restaurants based on dietary restrictions, and that's when she realized her love creating products that help people connect in real life. Stella found pickleball, fell in love with the community, and saw a massive gap - finding the right partner shouldn't be left to chance.
                </p>
                <p className="co-founder-text">
                  Let's find your perfect match!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="event-section">
        <div className="about-container">
          <h2 className="about-title">Events</h2>
          <div className="events-grid">
            <div className="event-block">
              <div className="event-left-column">
                <div className="event-image-container">
                  <img src={eventImage} alt="Courted Kick Off Event" className="event-image" />
                </div>
                <div className="event-quick-info">
                  <p className="event-quick-info-item"><strong>Date:</strong> Saturday, November 29</p>
                  <p className="event-quick-info-item"><strong>Time:</strong> 7:00pm to 10:00pm</p>
                  <p className="event-quick-info-item">
                    <strong>Location:</strong>{' '}
                    <a 
                      href="https://www.google.com/maps/place/Hisports+Whitchurch-Stouffville/@43.9617177,-79.2679516,17z/data=!3m1!4b1!4m6!3m5!1s0x89d529190f92972b:0xb07284eb59a2ffa4!8m2!3d43.9617177!4d-79.2653767!16s%2Fg%2F11y2qdk9wh?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="event-location-link"
                    >
                      HISPORTS Stouffville
                    </a>
                  </p>
                  <p className="event-quick-info-item"><strong>Price:</strong> $40</p>
                </div>
              </div>
              <div className="event-content">
                <h3 className="event-title">Courted Kick Off Event (HISPORTS Stouffville)</h3>
                <div className="event-description">
                  <p>
                    Join us for our first-ever Courted Kickoff Event! This event is open to players in the 3.25–3.75 skill range. Registration is individual only - simply fill out the intake form, and our matching algorithm will place you on a team based on your skill level, play style, and preferences.
                  </p>
                  <p>
                    You'll compete in a team-style tournament using rally scoring, designed to maximize playtime and help you meet new players in a fun, social atmosphere.
                  </p>
                  <p>
                    Prizes provided by Natures Path, Neal Brothers, Crank Coffee, CturnerMedical, and OS1st. Limited spots available.
                  </p>
                </div>
                {(genderCounts.male >= 16 || genderCounts.female >= 16) && (
                  <div className="event-capacity-warning">
                    {genderCounts.male >= 16 && (
                      <p className="capacity-warning-text">Male spots are sold out!</p>
                    )}
                    {genderCounts.female >= 16 && (
                      <p className="capacity-warning-text">Female spots are sold out!</p>
                    )}
                  </div>
                )}
                <button className="event-signup-button" onClick={() => setShowEventForm(true)}>
                  Sign Up
                </button>
              </div>
            </div>

            <div className="event-block">
              <div className="event-left-column">
                <div className="event-image-container">
                  <img src={dillPickleEventImage} alt="Courted x The Dill Pickleball Club" className="event-image" />
                  <div className="coming-soon-badge-event">Coming Soon</div>
                </div>
                <div className="event-quick-info">
                  <p className="event-quick-info-item"><strong>Date:</strong> TBA</p>
                  <p className="event-quick-info-item"><strong>Time:</strong> TBA</p>
                  <p className="event-quick-info-item">
                    <strong>Location:</strong> The Dill Pickleball Club
                  </p>
                  <p className="event-quick-info-item"><strong>Price:</strong> TBA</p>
                </div>
              </div>
              <div className="event-content">
                <h3 className="event-title">Courted x The Dill Pickleball Club</h3>
                <div className="event-description">
                  <p>
                    Stay tuned for our upcoming event at The Dill Pickleball Club! More details coming soon.
                  </p>
                </div>
                <button className="event-signup-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  Coming Soon
                </button>
              </div>
            </div>

            <div className="event-block">
              <div className="event-left-column">
                <div className="event-image-container">
                  <img src={sixPickleEventImage} alt="Courted x 6ixPickle" className="event-image" />
                  <div className="coming-soon-badge-event">Coming Soon</div>
                </div>
                <div className="event-quick-info">
                  <p className="event-quick-info-item"><strong>Date:</strong> TBA</p>
                  <p className="event-quick-info-item"><strong>Time:</strong> TBA</p>
                  <p className="event-quick-info-item">
                    <strong>Location:</strong> 6ixPickle
                  </p>
                  <p className="event-quick-info-item"><strong>Price:</strong> TBA</p>
                </div>
              </div>
              <div className="event-content">
                <h3 className="event-title">Courted x 6ixPickle</h3>
                <div className="event-description">
                  <p>
                    Stay tuned for our upcoming event at 6ixPickle! More details coming soon.
                  </p>
                </div>
                <button className="event-signup-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showEventForm && (
        <div className="event-form-modal" onClick={(e) => {
          if (e.target === e.currentTarget) setShowEventForm(false)
        }}>
          <div className="event-form-modal-content">
            <div className="event-form-header">
              <button className="event-form-close" onClick={() => setShowEventForm(false)}>×</button>
              <h2 className="event-form-title">Sign up Form</h2>
            </div>
            <div className="event-form-scrollable">
              <form className="event-form" onSubmit={(e) => e.preventDefault()}>
              <div className="event-form-grid">
                <div className="event-form-group">
                  <label htmlFor="eventFirstName" className="event-form-label">
                    <FiUser className="label-icon" />
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    id="eventFirstName"
                    name="firstName"
                    value={eventFormData.firstName}
                    onChange={(e) => setEventFormData({ ...eventFormData, firstName: e.target.value })}
                    required
                    placeholder="Enter your first name"
                    className="event-form-input"
                  />
                </div>

                <div className="event-form-group">
                  <label htmlFor="eventLastName" className="event-form-label">
                    <FiUser className="label-icon" />
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="eventLastName"
                    name="lastName"
                    value={eventFormData.lastName}
                    onChange={(e) => setEventFormData({ ...eventFormData, lastName: e.target.value })}
                    required
                    placeholder="Enter your last name"
                    className="event-form-input"
                  />
                </div>

                <div className="event-form-group full-width">
                  <label htmlFor="eventEmail" className="event-form-label">
                    <FiMail className="label-icon" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    id="eventEmail"
                    name="email"
                    value={eventFormData.email}
                    onChange={(e) => setEventFormData({ ...eventFormData, email: e.target.value })}
                    required
                    placeholder="Enter your email"
                    className="event-form-input"
                  />
                </div>

                <div className="event-form-group full-width">
                  <label htmlFor="eventFieldOfWork" className="event-form-label">
                    <FiBook className="label-icon" />
                    <span>Field of Work / Study</span>
                  </label>
                  <input
                    type="text"
                    id="eventFieldOfWork"
                    name="fieldOfWork"
                    value={eventFormData.fieldOfWork}
                    onChange={(e) => setEventFormData({ ...eventFormData, fieldOfWork: e.target.value })}
                    placeholder="Enter your field of work or study"
                    className="event-form-input"
                    required
                  />
                </div>

                <div className="event-form-group">
                  <label htmlFor="eventGender" className="event-form-label">
                    <FiUser className="label-icon" />
                    <span>Gender</span>
                  </label>
                  <select
                    id="eventGender"
                    name="gender"
                    value={eventFormData.gender}
                    onChange={(e) => setEventFormData({ ...eventFormData, gender: e.target.value })}
                    required
                    className="event-form-input"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="event-form-group">
                  <label htmlFor="eventAgeRange" className="event-form-label">
                    <FiCalendar className="label-icon" />
                    <span>Age Range</span>
                  </label>
                  <select
                    id="eventAgeRange"
                    name="ageRange"
                    value={eventFormData.ageRange}
                    onChange={(e) => setEventFormData({ ...eventFormData, ageRange: e.target.value })}
                    required
                    className="event-form-input"
                  >
                    <option value="">Select age range</option>
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55-64">55-64</option>
                    <option value="65+">65+</option>
                  </select>
                </div>

                <div className="event-form-group full-width">
                  <label className="event-form-label">
                    <FiCalendar className="label-icon" />
                    <span>Preferred Partner Age Range (18 to 80)</span>
                  </label>
                  <div className="age-range-slider-container">
                    <div className="age-range-display">
                      <span className="age-value">{eventFormData.preferredPartnerAgeRangeMin}</span>
                      <span className="age-separator">-</span>
                      <span className="age-value">{eventFormData.preferredPartnerAgeRangeMax}</span>
                    </div>
                    <div className="dual-range-slider">
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={eventFormData.preferredPartnerAgeRangeMin}
                        onChange={(e) => {
                          const minValue = parseInt(e.target.value)
                          if (minValue <= eventFormData.preferredPartnerAgeRangeMax) {
                            setEventFormData({ ...eventFormData, preferredPartnerAgeRangeMin: minValue })
                          }
                        }}
                        className="age-range-slider slider-min"
                      />
                      <input
                        type="range"
                        min="18"
                        max="80"
                        value={eventFormData.preferredPartnerAgeRangeMax}
                        onChange={(e) => {
                          const maxValue = parseInt(e.target.value)
                          if (maxValue >= eventFormData.preferredPartnerAgeRangeMin) {
                            setEventFormData({ ...eventFormData, preferredPartnerAgeRangeMax: maxValue })
                          }
                        }}
                        className="age-range-slider slider-max"
                      />
                    </div>
                  </div>
                </div>

                <div className="event-form-group">
                  <label htmlFor="eventDuprRating" className="event-form-label">
                    <FiAward className="label-icon" />
                    <span>DUPR/Self Rating</span>
                  </label>
                  <input
                    type="number"
                    id="eventDuprRating"
                    name="duprRating"
                    value={eventFormData.duprRating}
                    onChange={(e) => setEventFormData({ ...eventFormData, duprRating: e.target.value })}
                    placeholder="Enter your DUPR rating"
                    className="event-form-input"
                    min="0"
                    max="10"
                    step="0.01"
                    required
                  />
                </div>

                <div className="event-form-group">
                  <label htmlFor="eventDuprId" className="event-form-label">
                    <FiAward className="label-icon" />
                    <span>DUPR ID (if applicable)</span>
                  </label>
                  <input
                    type="text"
                    id="eventDuprId"
                    name="duprId"
                    value={eventFormData.duprId}
                    onChange={(e) => setEventFormData({ ...eventFormData, duprId: e.target.value })}
                    placeholder="Enter your DUPR ID"
                    className="event-form-input"
                  />
                </div>

                <div className="event-form-group full-width">
                  <label htmlFor="eventCurrentClub" className="event-form-label">
                    <FiHome className="label-icon" />
                    <span>Current Club / City</span>
                  </label>
                  <PlacesAutocomplete
                    value={eventFormData.currentClub}
                    onChange={(e) => setEventFormData({ ...eventFormData, currentClub: e.target.value })}
                    onPlaceSelect={handleEventPlaceSelect}
                    placeholder="Enter your club or city"
                    className="event-form-input"
                    required
                  />
                </div>

                <div className="event-form-group full-width">
                  <label className="form-label">
                    <span>When do you play? <span className="label-hint">(Select all that apply)</span></span>
                  </label>
                  <div className="checkbox-group">
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="timeOfDay"
                        value="Morning"
                        checked={eventFormData.timeOfDay.includes('Morning')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            timeOfDay: checked
                              ? [...eventFormData.timeOfDay, value]
                              : eventFormData.timeOfDay.filter(t => t !== value)
                          })
                        }}
                      />
                      <span>Morning</span>
                    </label>
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="timeOfDay"
                        value="Afternoon"
                        checked={eventFormData.timeOfDay.includes('Afternoon')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            timeOfDay: checked
                              ? [...eventFormData.timeOfDay, value]
                              : eventFormData.timeOfDay.filter(t => t !== value)
                          })
                        }}
                      />
                      <span>Afternoon</span>
                    </label>
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="timeOfDay"
                        value="Night"
                        checked={eventFormData.timeOfDay.includes('Night')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            timeOfDay: checked
                              ? [...eventFormData.timeOfDay, value]
                              : eventFormData.timeOfDay.filter(t => t !== value)
                          })
                        }}
                      />
                      <span>Night</span>
                    </label>
                  </div>
                </div>

                <div className="event-form-group full-width">
                  <label className="form-label">
                    <span>Playing availability <span className="label-hint">(Select all that apply)</span></span>
                  </label>
                  <div className="checkbox-group">
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="daysOfPlay"
                        value="Weekends"
                        checked={eventFormData.daysOfPlay.includes('Weekends')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            daysOfPlay: checked
                              ? [...eventFormData.daysOfPlay, value]
                              : eventFormData.daysOfPlay.filter(d => d !== value)
                          })
                        }}
                      />
                      <span>Weekends</span>
                    </label>
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="daysOfPlay"
                        value="Weekdays"
                        checked={eventFormData.daysOfPlay.includes('Weekdays')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            daysOfPlay: checked
                              ? [...eventFormData.daysOfPlay, value]
                              : eventFormData.daysOfPlay.filter(d => d !== value)
                          })
                        }}
                      />
                      <span>Weekdays</span>
                    </label>
                  </div>
                </div>

                <div className="event-form-group full-width">
                  <label className="form-label">
                    <span>Type of Rallies <span className="label-hint">(Select all that apply)</span></span>
                  </label>
                  <div className="checkbox-group">
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="typeOfPlay"
                        value="Drills"
                        checked={eventFormData.typeOfPlay.includes('Drills')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            typeOfPlay: checked
                              ? [...eventFormData.typeOfPlay, value]
                              : eventFormData.typeOfPlay.filter(t => t !== value)
                          })
                        }}
                      />
                      <span>Drills</span>
                    </label>
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="typeOfPlay"
                        value="Doubles/Mixed Games"
                        checked={eventFormData.typeOfPlay.includes('Doubles/Mixed Games')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            typeOfPlay: checked
                              ? [...eventFormData.typeOfPlay, value]
                              : eventFormData.typeOfPlay.filter(t => t !== value)
                          })
                        }}
                      />
                      <span>Doubles/Mixed Games</span>
                    </label>
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        name="typeOfPlay"
                        value="Singles Games"
                        checked={eventFormData.typeOfPlay.includes('Singles Games')}
                        onChange={(e) => {
                          const { value, checked } = e.target
                          setEventFormData({
                            ...eventFormData,
                            typeOfPlay: checked
                              ? [...eventFormData.typeOfPlay, value]
                              : eventFormData.typeOfPlay.filter(t => t !== value)
                          })
                        }}
                      />
                      <span>Singles Games</span>
                    </label>
                  </div>
                </div>

                <div className="event-form-group full-width">
                  <label className="event-form-label">
                    Prioritize the following: (Stack them in order of importance)
                  </label>
                  <div className="priorities-list">
                    {(() => {
                      const allPriorities = ['Winning', 'Having Fun', 'Professional Networking', 'Post-Pickleball Party', 'Meeting new players in the community', 'Health and Well-being']
                      // Sort: ranked items first (in their ranked order), then unranked items
                      const sortedPriorities = [
                        ...eventFormData.priorities,
                        ...allPriorities.filter(p => !eventFormData.priorities.includes(p))
                      ]
                      
                      return sortedPriorities.map((priority) => {
                        const currentRank = eventFormData.priorities.findIndex(p => p === priority) + 1
                        const isRanked = currentRank > 0
                        
                        const moveUp = () => {
                          if (currentRank > 1) {
                            const newPriorities = [...eventFormData.priorities]
                            const currentIndex = currentRank - 1
                            const temp = newPriorities[currentIndex]
                            newPriorities[currentIndex] = newPriorities[currentIndex - 1]
                            newPriorities[currentIndex - 1] = temp
                            setEventFormData({ ...eventFormData, priorities: newPriorities })
                          }
                        }
                        
                        const moveDown = () => {
                          if (currentRank > 0 && currentRank < eventFormData.priorities.length) {
                            const newPriorities = [...eventFormData.priorities]
                            const currentIndex = currentRank - 1
                            const temp = newPriorities[currentIndex]
                            newPriorities[currentIndex] = newPriorities[currentIndex + 1]
                            newPriorities[currentIndex + 1] = temp
                            setEventFormData({ ...eventFormData, priorities: newPriorities })
                          }
                        }
                        
                        const addToRanking = () => {
                          setEventFormData({
                            ...eventFormData,
                            priorities: [...eventFormData.priorities, priority]
                          })
                        }
                        
                        const removeFromRanking = () => {
                          setEventFormData({
                            ...eventFormData,
                            priorities: eventFormData.priorities.filter(p => p !== priority)
                          })
                        }
                        
                        return (
                          <div key={priority} className={`priority-item ${isRanked ? 'priority-item-ranked' : 'priority-item-unranked'}`}>
                            <div className="priority-content">
                              {isRanked ? (
                                <>
                                  <div className="priority-rank-badge">{currentRank}</div>
                                  <span className="priority-text">{priority}</span>
                                  <div className="priority-controls">
                                    <button
                                      type="button"
                                      className="priority-btn priority-btn-up"
                                      onClick={moveUp}
                                      disabled={currentRank === 1}
                                      title="Move up"
                                    >
                                      ↑
                                    </button>
                                    <button
                                      type="button"
                                      className="priority-btn priority-btn-down"
                                      onClick={moveDown}
                                      disabled={currentRank === eventFormData.priorities.length}
                                      title="Move down"
                                    >
                                      ↓
                                    </button>
                                    <button
                                      type="button"
                                      className="priority-btn priority-btn-remove"
                                      onClick={removeFromRanking}
                                      title="Remove from ranking"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="priority-text priority-text-unranked">{priority}</span>
                                  <button
                                    type="button"
                                    className="priority-btn priority-btn-add"
                                    onClick={addToRanking}
                                    title="Add to ranking"
                                  >
                                    +
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })
                    })()}
                  </div>
                  {eventFormData.priorities.length > 0 && (
                    <div className="priority-summary">
                      <p className="priority-summary-text">
                        Current ranking: {eventFormData.priorities.map((p, i) => (
                          <span key={p} className="priority-summary-item">
                            {i + 1}. {p}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                  {eventFormData.priorities.length === 0 && (
                    <div className="event-form-error-message" style={{ marginTop: '10px' }}>
                      Please select at least one priority to rank.
                    </div>
                  )}
                </div>
              </div>

              {getGenderFullMessage() && (
                <div className="event-form-error-message">
                  {getGenderFullMessage()}
                </div>
              )}
              <button
                type="button"
                className="event-pay-button"
                disabled={!isEventFormValid() || eventFormLoading}
                onClick={() => {
                  if (isEventFormValid()) {
                    setEventFormLoading(true)
                    
                    // Open Stripe payment link immediately (must be in direct response to user click for mobile)
                    // On mobile, open in same tab; on desktop, open in new tab
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768
                    if (isMobile) {
                      window.location.href = STRIPE_PAYMENT_LINK
                    } else {
                      window.open(STRIPE_PAYMENT_LINK, '_blank', 'noopener,noreferrer')
                    }
                    
                    // Prepare data
                    const data = {
                      formType: 'event',
                      firstName: eventFormData.firstName,
                      lastName: eventFormData.lastName,
                      email: eventFormData.email,
                      gender: eventFormData.gender,
                      ageRange: eventFormData.ageRange,
                      preferredPartnerAgeRangeMin: eventFormData.preferredPartnerAgeRangeMin,
                      preferredPartnerAgeRangeMax: eventFormData.preferredPartnerAgeRangeMax,
                      duprRating: eventFormData.duprRating,
                      duprId: eventFormData.duprId,
                      timeOfDay: eventFormData.timeOfDay,
                      daysOfPlay: eventFormData.daysOfPlay,
                      fieldOfWork: eventFormData.fieldOfWork,
                      typeOfPlay: eventFormData.typeOfPlay,
                      priorities: eventFormData.priorities,
                      currentClub: eventFormData.currentClub,
                      city: eventFormData.city,
                      country: eventFormData.country,
                      timestamp: new Date().toISOString()
                    }
                    
                    // Save form data to Google Sheets in the background (non-blocking)
                    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
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
                    }
                    
                    // Show loading for 1 second, then clear form and show modal
                    setTimeout(() => {
                      // Clear form data
                      setEventFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        gender: '',
                        ageRange: '',
                        preferredPartnerAgeRangeMin: 18,
                        preferredPartnerAgeRangeMax: 80,
                        duprRating: '',
                        duprId: '',
                        timeOfDay: [],
                        daysOfPlay: [],
                        fieldOfWork: '',
                        typeOfPlay: [],
                        priorities: [],
                        currentClub: '',
                        city: '',
                        country: ''
                      })
                      
                      // Close event form and show payment modal
                      setShowEventForm(false)
                      setShowPaymentModal(true)
                      setEventFormLoading(false)
                    }, 1000)
                  }
                }}
              >
                <FiCreditCard className="pay-icon" />
                <span>{eventFormLoading ? 'Processing...' : 'Pay Now'}</span>
                {!eventFormLoading && <FiExternalLink className="external-icon" />}
              </button>
            </form>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="event-form-modal" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowPaymentModal(false)
            setShowEventForm(false)
          }
        }}>
          <div className="event-form-modal-content">
            <button className="event-form-close" onClick={() => {
              setShowPaymentModal(false)
              setShowEventForm(false)
            }}>×</button>
            <h2 className="event-form-title">Payment Processing</h2>
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
              Please complete your payment in the Stripe checkout window. Once your payment is confirmed, you'll receive a confirmation email.
              </p>
              <button 
                className="event-signup-button" 
                onClick={() => {
                  setShowPaymentModal(false)
                  setShowEventForm(false)
                }}
                style={{ marginTop: '30px' }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h4 className="form-section-title">Don't see an event near you? Join the Waitlist!</h4>
            <div className="form-container">
              <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                <FiUser className="label-icon" />
                <span>First Name</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                <FiUser className="label-icon" />
                <span>Last Name</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
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
              <label htmlFor="ageRange" className="form-label">
                <FiCalendar className="label-icon" />
                <span>Age Range</span>
              </label>
              <select
                id="ageRange"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select age range</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55-64">55-64</option>
                <option value="65+">65+</option>
              </select>
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
                <FiCalendar className="label-icon" />
                <span>Preferred Partner Age Range</span>
              </label>
              <div className="age-range-slider-container">
                <div className="age-range-display">
                  <span className="age-value">{formData.partnerAgeRangeMin}</span>
                  <span className="age-separator">-</span>
                  <span className="age-value">{formData.partnerAgeRangeMax}</span>
                </div>
                <div className="dual-range-slider">
                  <input
                    type="range"
                    id="partnerAgeRangeMin"
                    name="partnerAgeRangeMin"
                    min="18"
                    max="80"
                    value={formData.partnerAgeRangeMin}
                    onChange={(e) => {
                      const minValue = parseInt(e.target.value)
                      if (minValue <= formData.partnerAgeRangeMax) {
                        setFormData(prev => ({
                          ...prev,
                          partnerAgeRangeMin: minValue
                        }))
                      }
                    }}
                    className="age-range-slider slider-min"
                  />
                  <input
                    type="range"
                    id="partnerAgeRangeMax"
                    name="partnerAgeRangeMax"
                    min="18"
                    max="80"
                    value={formData.partnerAgeRangeMax}
                    onChange={(e) => {
                      const maxValue = parseInt(e.target.value)
                      if (maxValue >= formData.partnerAgeRangeMin) {
                        setFormData(prev => ({
                          ...prev,
                          partnerAgeRangeMax: maxValue
                        }))
                      }
                    }}
                    className="age-range-slider slider-max"
                  />
                </div>
              </div>
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
                <span>Type of Rallies <span className="label-hint">(Select all that apply)</span></span>
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
                <span>Type of Partner <span className="label-hint">(Select all that apply)</span></span>
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
                    <span>Dating Preference <span className="label-hint">(Select all that apply)</span></span>
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

            {formData.lookingToDate === 'Yes' && (
              <>
                <div className="form-group full-width">
                  <label htmlFor="education" className="form-label">
                    <FiBook className="label-icon" />
                    <span>Education</span>
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select education level</option>
                    <option value="High School">High School</option>
                    <option value="Some College">College</option>
                    <option value="Bachelor's Degree">University</option>
                    <option value="Master's Degree">Graduate</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="datingAgeRange" className="form-label">
                    <FiCalendar className="label-icon" />
                    <span>Dating Age Range</span>
                  </label>
                  <div className="age-range-slider-container">
                    <div className="age-range-display">
                      <span className="age-value">{formData.datingAgeRangeMin}</span>
                      <span className="age-separator">-</span>
                      <span className="age-value">{formData.datingAgeRangeMax}</span>
                    </div>
                    <div className="dual-range-slider">
                      <input
                        type="range"
                        id="datingAgeRangeMin"
                        name="datingAgeRangeMin"
                        min="18"
                        max="80"
                        value={formData.datingAgeRangeMin}
                        onChange={(e) => {
                          const minValue = parseInt(e.target.value)
                          if (minValue <= formData.datingAgeRangeMax) {
                            setFormData(prev => ({
                              ...prev,
                              datingAgeRangeMin: minValue
                            }))
                          }
                        }}
                        className="age-range-slider slider-min"
                      />
                      <input
                        type="range"
                        id="datingAgeRangeMax"
                        name="datingAgeRangeMax"
                        min="18"
                        max="80"
                        value={formData.datingAgeRangeMax}
                        onChange={(e) => {
                          const maxValue = parseInt(e.target.value)
                          if (maxValue >= formData.datingAgeRangeMin) {
                            setFormData(prev => ({
                              ...prev,
                              datingAgeRangeMax: maxValue
                            }))
                          }
                        }}
                        className="age-range-slider slider-max"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}


            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <span>Join Now</span>
                </>
              )}
            </button>
          </form>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <p className="consent-text">By joining, you agree to receive emails from us about our product updates and your personalized player matches. Due to the popular demand, our matching services are currently limited to the Greater Toronto Area.</p>
        </div>
          </>
        )}
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="mailto:info@courtedapp.com" className="footer-link">
                <FiMail className="footer-icon" />
                <span>Contact Us</span>
              </a>
              <a href="https://www.instagram.com/courted.ai/" target="_blank" rel="noopener noreferrer" className="footer-link">
                <FiInstagram className="footer-icon" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Courted. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
