'use client'

import { theme } from '@/lib/theme'

interface ProgressBarProps {
  steps: string[]
  currentStep: number
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px 0', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '80%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 14, left: '10%', right: '10%', height: 2, backgroundColor: theme.colors.canvasSoft, zIndex: 0 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: theme.colors.primary, transition: 'width 0.4s ease', width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
        </div>
        {steps.map((step, index) => {
          const isActive = index <= currentStep
          return (
            <div key={index} style={{ position: 'relative', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                backgroundColor: isActive ? theme.colors.primary : theme.colors.surfacePressed,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isActive ? theme.colors.onPrimary : theme.colors.mute,
                fontSize: 12, fontWeight: 700, zIndex: 1, position: 'relative',
                transition: 'background-color 0.3s ease',
              }}>
                {isActive ? '✓' : index + 1}
              </div>
              <span style={{
                position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)',
                fontSize: 11, color: isActive ? theme.colors.ink : theme.colors.mute,
                fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', textAlign: 'center',
              }}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
