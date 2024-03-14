import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getServersByUserId } from '@/services/server'

import NavigationAction from './navigation-action'
import NavigationItem from './navigation-item'

const NavigationSidebar = async () => {
  const session = await auth()
  if (!session) {
    return redirect('/')
  }
  const servers = await getServersByUserId(session.user.id)

  return (
    <div className="flex flex-col items-center gap-2
    h-full w-[4.5rem] text-primary py-3
    bg-[var(--light-navigation)]
    dark:bg-[var(--dark-navigation)]">
      <NavigationAction />
      <Separator className="h-[2px] w-8 rounded-md mx-auto bg-[var(--light-page)] dark:bg-[var(--dark-page)]" />
      <ScrollArea className="w-full">
        {servers.map((server) =>
          <div key={server.id} className="flex justify-center mb-2">
            <NavigationItem
              id={server.id}
              name={server.name}
              image={server.image}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default NavigationSidebar