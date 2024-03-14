'use client'

import { Plus } from 'lucide-react'

import { ActionTooltip } from '@/components/action-tooltip'

const NavigationAction = () => {
  return (
    <div>
      <ActionTooltip
        label="Add a Server"
        side="right"
        align="center"
        delay={25}
      >
        <button className="group flex items-center justify-center">
          <div className="flex items-center justify-center h-12 w-12 transition-all
          rounded-[24px]
          bg-[var(--light-page)]
          dark:bg-[var(--dark-page)]
          group-hover:rounded-[16px]
          group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationAction
