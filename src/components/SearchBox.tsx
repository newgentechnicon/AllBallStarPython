'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const SearchIcon = ({ ...props }) => ( <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> );

export default function SearchBox() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(initialQuery)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      if (searchInput) {
        params.set('q', searchInput)
      } else {
        params.delete('q')
      }
      params.set('page', '1')
      router.push(`?${params.toString()}`)
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [router, searchInput])

  return (
    <form className="relative mt-4" onSubmit={(e) => e.preventDefault()}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        name="q"
        className="block w-full rounded-lg border-gray-300 py-2 pl-10 sm:text-sm"
        placeholder="Search here"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </form>
  )
}
