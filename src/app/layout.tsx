import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'

import './globals.css'
import ThemeProvider from '@/components/theme-provider'
import { DeleteChannelModalContextProvider } from '@/context/delete-channel-context'
import { EditChannelModalContextProvider } from '@/context/edit-channel-context'
import { ModalContextProvider } from '@/context/modal-context'
import { ServerSettingsContextProvider } from '@/context/settings/server-settings'
import { UserSettingsContextProvider } from '@/context/settings/user-settings-context'
import { SocketContextProvider } from '@/context/socket-context'
import { cn } from '@/lib/utils'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deezcord',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        font.className,
        'bg-page',
        'dark:bg-page-dark',
      )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalContextProvider>
            <EditChannelModalContextProvider>
              <DeleteChannelModalContextProvider>
                <SocketContextProvider>
                  <ServerSettingsContextProvider>
                    <UserSettingsContextProvider>
                      {children}
                    </UserSettingsContextProvider>
                  </ServerSettingsContextProvider>
                </SocketContextProvider>
              </DeleteChannelModalContextProvider>
            </EditChannelModalContextProvider>
          </ModalContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
