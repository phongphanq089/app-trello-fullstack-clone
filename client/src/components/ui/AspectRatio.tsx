'use client'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

const AspectRatio = AspectRatioPrimitive.Root

export const aspectRatios = {
  image16and9: 16 / 9,
  image4and3: 4 / 3,
  image3and4: 3 / 4,
  imageSquare: 1,
  image21and9: 21 / 9,
  imageGolden: 1.618
} as const

export type AspectRatioKey = keyof typeof aspectRatios

export { AspectRatio }
