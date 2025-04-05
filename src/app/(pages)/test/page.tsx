"use client";

import { Button } from '@/components/ui/button'
import { useState } from 'react';
import { toast } from 'sonner'

export default function page() {
  const [loadingg, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Button
        className='cursor-pointer'
        onClick={async () => {
          setLoading(true)
          const res = await fetch('/api/test', {
            method: 'POST',
          })
          const data = await res.json()

          if (data.error) {
            toast.error(data.error)
          } else {
            toast.success(data.message)
          }
          setLoading(false)
        }}
        disabled={loadingg}
      >
        {loadingg ? 'Loading...' : 'Test'}
      </Button>
    </div >
  )
}
