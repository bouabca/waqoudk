'use client'

import { theme } from '@/lib/theme'

const t = theme

interface OrderProgressProps {
  currentStep: number
}

const steps = [
  { label: 'قيد الانتظار', icon: '📋' },
  { label: 'قيد التوصيل', icon: '🚚' },
  { label: 'تم التوصيل', icon: '✅' },
]

export default function OrderProgress({ currentStep }: OrderProgressProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 24,
    position: 'relative',
  }

  const stepsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    position: 'relative',
  }

  const lineContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 24,
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: t.colors.surfacePressed,
    zIndex: 0,
    borderRadius: 2,
  }

  const activeLineStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: t.colors.primary,
    borderRadius: 2,
    transition: 'width 0.5s ease',
    width: `${(currentStep / (steps.length - 1)) * 100}%`,
  }

  return (
    <div style={containerStyle}>
      <div style={stepsWrapperStyle}>
        <div style={lineContainerStyle}>
          <div style={activeLineStyle} />
        </div>
        {steps.map((step, index) => {
          const isActive = index <= currentStep
          const isCompleted = index < currentStep

          const circleStyle: React.CSSProperties = {
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: isActive ? t.colors.primary : t.colors.canvasSoft,
            border: isActive ? `3px solid ${t.colors.primary}` : `3px solid ${t.colors.surfacePressed}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            zIndex: 1,
            position: 'relative',
            transition: 'all 0.3s ease',
          }

          const labelStyle: React.CSSProperties = {
            position: 'absolute',
            top: 56,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 12,
            color: isActive ? t.colors.primary : t.colors.mute,
            fontWeight: isActive ? 600 : 400,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontFamily: t.fontFamily.text,
          }

          return (
            <div
              key={index}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column' }}
            >
              <div style={circleStyle}>
                {isCompleted ? '✓' : step.icon}
              </div>
              <span style={labelStyle}>{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
