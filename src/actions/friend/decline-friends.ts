'use server'

import { FriendStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { db } from '@/lib/db'

export const declineFriends = async (formData: FormData) => {
  const userRequestId = formData.get('userRequestId')
  if (!userRequestId || typeof userRequestId !== 'string') {
    return null
  }

  const session = await auth()
  if (!session) {
    return redirect('/')
  }
  const userId = session.user.id

  try {
    const user = await db.user.findFirst({
      where: {
        id: userId,
        friendAccept: {
          some: {
            userRequestId,
            status: FriendStatus.PENDING,
          },
        },
      },
      include: {
        friendAccept: true,
      },
    })
    if (!user) {
      return null
    }

    await db.friend.delete({
      where: {
        id: user.friendAccept[0].id,
      },
    })
  } catch (error) {
    console.log(error)
  }

  revalidatePath('/channels/me')
  return null
}
