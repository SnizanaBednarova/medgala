'use client'
import { FC, ReactNode, HTMLProps, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useClickAway } from '@uidotdev/usehooks'
import { Icon } from '@/lib/component/ui'

type Props = {
	children?: ReactNode
} & HTMLProps<HTMLDivElement>

export const NavMenu: FC<Props> = ({ children, className, ...restProps }) => {
	const [open, setOpen] = useState(false)
	const ref = useClickAway<HTMLDivElement>(() => {
		setOpen(false)
	})
	const handleClick = () => {
		setOpen(!open)
	}
	return (
		<>
			<div
				className={clsx( className)}
				{...restProps}
			>
				{children}
			</div>
			<div className={clsx('relative xl:hidden', className)} ref={ref}>
				<button onClick={handleClick} type="button" className="size-6 grid place-items-center">
					{!open && <Icon name="bars" className="text-primary-400 text-2xl" />}
					{open && <Icon name="xmark" className="text-primary-400 text-2xl" />}
				</button>
				<AnimatePresence>
					{open && (
						<motion.div
							className="bg-white absolute right-0 top-full mt-4 flex flex-col gap-4 p-6 border border-slate-300 rounded-xl shadow-xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.2, ease: 'easeInOut' }}
						>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	)
}
