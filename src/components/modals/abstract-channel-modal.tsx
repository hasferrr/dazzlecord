'use client'

import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { type Channel, ChannelType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { createNewChannel } from '@/actions/channel/create-new-channel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup } from '@/components/ui/radio-group'
import { modifyString } from '@/helpers/helpers'
import { channelModalSchema } from '@/schemas/channel-modal-schema'

import ChannelModalRadio from './channel-modal-radio'

interface AbstractChannelModalProps {
  title: string
  onModalClose: () => void
  isModalOpen: boolean
  onSubmitAction: (name: string, type: ChannelType) => ReturnType<typeof createNewChannel>
  currentChannel?: Channel
}

const AbstractChannelModal = ({
  title,
  onModalClose,
  isModalOpen,
  onSubmitAction,
  currentChannel,
}: AbstractChannelModalProps) => {
  const [isPending, startTransition] = useTransition()
  const [radio, setRadio] = useState<string | undefined>(currentChannel?.type)
  const [channelName, setChannelName] = useState<string | undefined>(currentChannel?.name)

  const router = useRouter()

  const form = useForm<z.infer<typeof channelModalSchema>>({
    resolver: zodResolver(channelModalSchema),
    defaultValues: {
      name: currentChannel?.name,
      type: currentChannel?.type,
    },
  })

  const formReset = (name?: string, type?: string) => {
    form.reset()
    setChannelName(name ?? currentChannel?.name)
    setRadio(type ?? currentChannel?.type)
  }

  const handleOpenDialog = () => {
    onModalClose()
    formReset()
  }

  const onSubmit = async (values: z.infer<typeof channelModalSchema>) => {
    startTransition(async () => {
      const res = await onSubmitAction(values.name, values.type)
      if (res.error) {
        console.log(res)
        return
      }
      console.log(res.success, res.data)
      onModalClose()

      // If editing a channel, then reset to new values
      // Otherwise (creating a channel), then reset to blank
      if (currentChannel) {
        formReset(values.name, values.type)
      } else {
        formReset()
      }

      router.refresh()
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenDialog}>
      <DialogContent className="p-0 m-0 dark:bg-[var(--dark-page)] text-black dark:text-white w-[29rem]">

        <DialogHeader className="px-4 pt-5">
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col justify-center"
          >

            <div className="flex flex-col px-4 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs text-inherit">
                      Channel Type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex flex-col gap-2"
                        onValueChange={(event) => {
                          field.onChange(event)
                          setRadio(form.getValues('type'))
                        }}
                        defaultValue={field.value}
                      >
                        <ChannelModalRadio
                          radio={radio}
                          id={ChannelType.TEXT}
                          isPending={isPending}
                          textTop="Text"
                          textBot="Send messages, images, GIFs, emoji, opinions, and other."
                          className=""
                        />
                        <ChannelModalRadio
                          radio={radio}
                          id={ChannelType.VOICE}
                          isPending={isPending}
                          textTop="Voice"
                          textBot="Hang out together with voice, video, and screen share."
                          className=""
                        />
                        <ChannelModalRadio
                          radio={radio}
                          id={ChannelType.VIDEO}
                          isPending={isPending}
                          textTop="Video"
                          textBot="Hang out together with video channel."
                          className=""
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase font-bold text-xs text-inherit">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className="bg-zinc-300/50 dark:bg-[var(--dark-navigation)] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Channel Name"
                        {...field}
                        value={channelName}
                        onChange={(e) => {
                          const modified = modifyString(e.target.value)
                          setChannelName(modified)
                          form.setValue('name', modified)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="p-4 bg-gray-100 dark:bg-[var(--dark-server)] rounded-b-lg">
              <Button variant="primary" disabled={isPending}>
                {title}
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  )
}

export default AbstractChannelModal
