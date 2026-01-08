import type { FC, ReactNode } from 'react'
import Link from 'next/link'

type Props = {
	children?: ReactNode
	to?: string
}

export const NavMenuItem: FC<Props> = ({ children, to = '' }) => {
	return (
		<Link href={to} className="hover:text-white">
			{children}
			<span
				className="transition duration-300 absolute -bottom-2 left-0 w-full h-1 rounded-full bg-gradient-to-r from-primary-300 to-primary-400 scale-x-0 group-hover:scale-x-100 origin-left"></span>
		</Link>
)
}
