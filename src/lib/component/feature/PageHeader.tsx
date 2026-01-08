'use client'
import {NavMenu, NavMenuItem} from '@/lib/component/ui'
import Link from "next/link"
import { FC } from 'react'

export const PageHeader:  FC = () => {
	return (
		<header className="sticky top-0 z-40 bg-blue-800 backdrop-blur">
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<NavMenu className="hidden gap-8 text-sm font-medium text-neutral-300 md:flex">
						<NavMenuItem to="/#about">
							O akci
						</NavMenuItem>
						<NavMenuItem to="/#sponsors">
							Sponzoři
						</NavMenuItem>
					</NavMenu>
					<div className="flex items-center gap-3">
						<Link href="/#cta"
							 className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100">Vstupenky</Link>
					</div>
				</div>
			</div>
		</header>
	)
}
