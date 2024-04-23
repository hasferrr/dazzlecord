import { z } from 'zod'

import { filesValidatorAllow0Length } from './server-modal-schema'

export const editProfileSchema = z.object({
  name: z.string()
    .min(1, {
      message: 'Please provide your display name.',
    })
    .max(25, {
      message: 'Maximum is 25 characters.',
    }),
  about: z.string()
    .max(190, {
      message: 'Maximum is 190 characters.',
    }),
  files: filesValidatorAllow0Length,
})
