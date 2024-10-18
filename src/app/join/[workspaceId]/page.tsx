"use client"

import { Button } from '@/components/ui/button'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info'
import { useJoin } from '@/features/workspaces/api/use-join'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'
import { Hash, Loader } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import VerificationInput from 'react-verification-input'
import { toast } from 'sonner'

const Joinpage = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })
    const { mutate, isPending } = useJoin()

    const isMember = useMemo(() => data?.isMember, [data?.isMember])

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`)
        }
    }, [isMember, router, workspaceId])
    
    const handleComplete = (value: string) => {
        mutate({
            workspaceId, joinCode: value
        }, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`)
                toast.success('Workspace joined')
            },
            onError: () => {
                toast.error("Failed to join workspace")
            }
        })
      
    }
    
    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className='animate-spin text-muted-foreground size-6' />
            </div>
        )
    }
  return (
      <div className='h-full flex flex-col gap-y-5 items-center justify-center bg-white p-8 rounded-lg shadow-md'>
          <Hash className='size-16 stroke-2 text-pink-600' />
          <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
              <div className="flex flex-col gap-y-2 items-center justify-center">
                  <h1 className='text-2xl font-bold'>Join { data?.name}</h1>
                  <p className='text-md text-muted-foreground'>Enter the workspace code to join</p>
              </div>
              <VerificationInput classNames={{
                  container: cn("flex gap-x-2", isPending && 'opacity-50 cursor-not-allowed'),
                  character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                  characterInactive: "bg-muted",
                  characterSelected: "bg-white text-black",
                  characterFilled: "bg-white text-black"
              }} autoFocus length={6} onComplete={handleComplete} />
          </div>
          <div className="flex gap-x-4">
              <Button variant={'outline'} size={'lg'} asChild>
                  <Link href={'/'}>
                  Back to Home
                  </Link>
              </Button>
          </div>
    </div>
  )
}

export default Joinpage

