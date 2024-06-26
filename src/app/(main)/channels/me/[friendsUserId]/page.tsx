import { redirect } from 'next/navigation'

import { sendDirectMessage } from '@/actions/direct-message/send-direct-message'
import { createConversation, getConversationByUsersId } from '@/actions/prisma/conversation'
import { getUserById } from '@/actions/prisma/user'
import { auth } from '@/auth'
import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatWrapper from '@/components/chat/chat-wrapper'
import MeSidebar from '@/components/me/sidebar/me-sidebar'
import BigScreen from '@/components/media-query/big-screen'
import UserPhoto from '@/components/user/user-photo'

interface FriendUserIdProps {
  params: {
    friendsUserId: string;
  }
}

const FriendUserId = async ({
  params,
}: FriendUserIdProps) => {
  const session = await auth()
  if (!session) {
    return redirect('/')
  }
  const userId = session.user.id

  if (params.friendsUserId === userId) {
    return redirect('/app')
  }

  const friendsUser = await getUserById(params.friendsUserId)
  if (!friendsUser) {
    return redirect('/app')
  }

  let conversation = await getConversationByUsersId(userId, friendsUser.id)
  if (!conversation) {
    conversation = await createConversation(userId, friendsUser.id)
  }

  return (
    <div className="bg-page dark:bg-page-dark h-full w-full
    max-h-screen min-h-screen
    grid grid-cols-[1fr_auto] grid-rows-[3rem_1fr_auto]"
    >
      <div className="col-span-2 h-12">
        <ChatHeader
          title={friendsUser.name}
          iconType={(
            <UserPhoto
              username={friendsUser.username}
              image={friendsUser.image}
              size={32}
              status={false}
            />
          )}
          right={null}
          left={<MeSidebar />}
        />
      </div>
      <ChatWrapper
        type="direct-message"
        userId={userId}
        channelId={conversation.id}
      />
      <div className="row-span-2">
        <BigScreen width={992}>
          {/* <MemberSidebar serverId={params.serverId} /> // TODO: show friend's profile */}
          <div />
        </BigScreen>
      </div>
      <div className="px-5">
        <ChatInput
          type="direct-message"
          channelName={friendsUser.username}
          sendFn={async (values) => {
            'use server'

            return sendDirectMessage(
              values,
              conversation.id,
            )
          }}
        />
      </div>
    </div>
  )
}

export default FriendUserId
