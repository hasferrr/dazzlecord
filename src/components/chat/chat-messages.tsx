'use client'

import { Fragment, useEffect } from 'react'

import type { Member } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'

import { queryMessages } from '@/actions/message/query-message'
import { generateToken } from '@/actions/socket-io/generate-token'
import { useSocket } from '@/context/socket-context'

import ChatItem from './chat-item'

const ChatMessages = ({ channelId, currentMember }: {
  channelId: string
  currentMember: Member
}) => {
  const socket = useSocket()

  useEffect(() => {
    if (!socket) return

    const join = async () => {
      const { token } = await generateToken(channelId, currentMember.userId)
      console.log(token)
      // socket emit
    }
    join()
  }, [channelId, currentMember.userId, socket])

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['message'],
    queryFn: async ({ pageParam }) => {
      const res = await queryMessages(pageParam, channelId)
      return res
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  if (status === 'pending') {
    return <div>Loading...</div>
  }

  if (status === 'error') {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
      </button>
      <div className="flex flex-col-reverse">
        {data.pages.map((page) => (
          <Fragment key={page.nextCursor}>
            {page.data.map((message, i) => (
              <ChatItem
                key={i}
                message={message}
                currentUserId={currentMember.userId}
                currentUserRole={currentMember.role}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ChatMessages
