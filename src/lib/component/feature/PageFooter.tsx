'use client'
import Link from "next/link"
import { FC } from 'react'

export const PageFooter: FC = () => {
	const year = new Date().getFullYear()

	return (
		<footer className="border-t bg-blue-800">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="mt-10 text-center text-sm text-neutral-50">
					<p>© <span>{year}</span> IFMSA CZ Ostrava</p>
				</div>
			</div>
		</footer>
	)
}
