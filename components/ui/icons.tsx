'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'img'>) {
  return (
    <img
      src="./bath_hack_logo.svg"
      alt="Bath Hack Logo"
      className={cn('h-4 w-4', className)}
      {...props}
    />
  )
}

export { IconLogo }
