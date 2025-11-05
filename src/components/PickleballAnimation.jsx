import { useEffect, useRef } from 'react'
import './PickleballAnimation.css'

const COURT_WIDTH = 260
const ARC_HEIGHT = 40
const DURATION_MS = 2000
const PADDLE_MARGIN = 12
const PADDLE_WIDTH = 32
const PADDLE_CENTER_FROM_EDGE = PADDLE_MARGIN + PADDLE_WIDTH / 2
const BALL_PADDLE_GAP = 4

// Easing function: easeInOutQuad
const easeInOutQuad = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const PickleballAnimation = () => {
  const ballRef = useRef(null)
  const leftPaddleRef = useRef(null)
  const rightPaddleRef = useRef(null)
  const lastPulsedSideRef = useRef(null)

  useEffect(() => {
    const ball = ballRef.current
    const leftPaddle = leftPaddleRef.current
    const rightPaddle = rightPaddleRef.current

    if (!ball || !leftPaddle || !rightPaddle) return

    let startTime = null
    let animationFrameId

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const cycleProgress = (elapsed % (DURATION_MS * 2)) / (DURATION_MS * 2)

      // Determine direction: 0-0.5 going right, 0.5-1 going left
      let progress
      let isGoingRight
      if (cycleProgress < 0.5) {
        isGoingRight = true
        progress = cycleProgress * 2 // 0 to 1
      } else {
        isGoingRight = false
        progress = (1 - cycleProgress) * 2 // 1 to 0
      }

      // Apply easing
      const easedProgress = easeInOutQuad(progress)

      // Calculate ball position
      const paddleReachX = COURT_WIDTH / 2 - PADDLE_CENTER_FROM_EDGE - BALL_PADDLE_GAP
      const translateX = easedProgress * paddleReachX * 2 - paddleReachX

      // Parabolic arc using 3-point interpolation
      let translateY
      if (progress <= 0.5) {
        translateY = -ARC_HEIGHT * (progress * 2)
      } else {
        translateY = -ARC_HEIGHT * (2 - progress * 2)
      }

      ball.style.transform = `translate(${translateX}px, ${translateY}px)`

      // Paddle pulse animations - pulse exactly once per contact
      if (progress <= 0.02 && lastPulsedSideRef.current !== 'left') {
        lastPulsedSideRef.current = 'left'
        leftPaddle.style.transform = 'scale(1.25) rotate(-20deg)'
        setTimeout(() => {
          if (leftPaddle) leftPaddle.style.transform = 'scale(1) rotate(-20deg)'
        }, 120)
      }
      
      if (progress >= 0.98 && lastPulsedSideRef.current !== 'right') {
        lastPulsedSideRef.current = 'right'
        rightPaddle.style.transform = 'scale(1.25) rotate(20deg)'
        setTimeout(() => {
          if (rightPaddle) rightPaddle.style.transform = 'scale(1) rotate(20deg)'
        }, 120)
      }

      // Reset pulse tracking at the start of each cycle
      if (cycleProgress < 0.01 || cycleProgress > 0.99) {
        lastPulsedSideRef.current = null
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div className="pickleball-animation-container">
      <div className="pickleball-net" />
      <div className="pickleball-net-vertical" />
      
      {/* Left paddle */}
      <div className="pickleball-paddle pickleball-paddle-left" ref={leftPaddleRef}>
        <div className="pickleball-paddle-face" />
        <div className="pickleball-paddle-handle" />
      </div>

      {/* Right paddle */}
      <div className="pickleball-paddle pickleball-paddle-right" ref={rightPaddleRef}>
        <div className="pickleball-paddle-face" />
        <div className="pickleball-paddle-handle" />
      </div>

      {/* Ball */}
      <div className="pickleball-ball" ref={ballRef} />
    </div>
  )
}

export default PickleballAnimation

