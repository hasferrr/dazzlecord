import ProfilePhoto from '@/components/profile-photo'
import { getFileURLFromGCS } from '@/lib/helpers'
import { cn } from '@/lib/utils'

const MemberItem = ({
  name, image, about, className,
}: {
  name: string
  image?: string | null
  about?: string | null
  className?: string
}) => (
  <button className={cn(
    'grid grid-cols-[auto_1fr] grid-rows-1 gap-x-3 items-center',
    'group rounded-md transition text-left',
    'hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
    'outline-none',
    className,
  )}
  >
    <div className="row-span-2 my-auto">
      <ProfilePhoto
        username={name}
        src={getFileURLFromGCS(image)}
        width={32}
        height={32}
      />
    </div>
    <div className="grid">
      <p className="text-sm truncate">{name}</p>
      {about
          && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {about}
          </p>
          )}
    </div>
  </button>
)

export default MemberItem
