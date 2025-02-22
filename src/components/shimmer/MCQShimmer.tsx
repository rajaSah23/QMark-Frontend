import { Skeleton } from '@mantine/core'
import React from 'react'

const MCQShimmer = () => {
  return (
    <div>
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
        <Skeleton height={8} mt={6} radius="xl" />
    </div>
  )
}

export default MCQShimmer