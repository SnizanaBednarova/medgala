import clsx from 'clsx'
import type { FC } from 'react'

type Props = {
	name: string
	type?: 'solid' | 'brands' | 'regular'
	className?: string
}

export const Icon: FC<Props> = ({ type = 'solid', name, className }) => {
	return (
		<i
			className={clsx({
				'transition block': true,
				[`fa-${type} fa-${name}`]: true,
				[className || '']: !!className
			})}
		></i>
	)
}
