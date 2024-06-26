'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useInviteClose, useInviteValue } from '@/context/modal-context'

const InvitationModal = ({ origin, inviteCode }: {
  origin: string,
  inviteCode: string,
}) => {
  const [copied, setCopied] = useState(false)

  const inviteValue = useInviteValue()
  const inviteClose = useInviteClose()

  const handleOpenDialog = () => {
    inviteClose()
  }

  const inviteUrl = `${origin}/invite/${inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Dialog open={inviteValue} onOpenChange={handleOpenDialog}>
      <DialogContent className="py-6 px-0 m-0 dark:bg-[var(--dark-page)] text-black dark:text-white w-[29rem]
      focus-visible:ring-0 focus-visible:ring-offset-0"
      >

        <DialogHeader className="px-6">
          <DialogTitle className="text-center text-xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2">
          <Label className="uppercase text-xs font-bold">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 dark:bg-[var(--dark-navigation)]
              border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              onClick={onCopy}
              size="icon"
            >
              {copied
                ? <Check className="w-4 h-4" />
                : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default InvitationModal
