import {Cinzel} from 'next/font/google'
import { PageHeader, PageFooter } from '@/lib/component/feature'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import 'swiper/css'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './globals.css'


const cinzel = Cinzel({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-cinzel',
	display: 'swap'
})

export const metadata: Metadata = {
	title: 'MED GALA 2026',
	description: 'Reprezentační ples Lékařské fakulty OU'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="cs">
		<head>
			<title>MED GALA 2026</title>
			<meta name="description" content="Reprezentační ples Lékařské fakulty OU" />
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
				integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
				crossOrigin="anonymous"
			/>
			<link rel="manifest" href="/icon/site.webmanifest" />
		</head>
		<body className={`${cinzel.className} bg-blue-800 ext-neutral-100 antialiased`}>
		{children}
		<PageFooter/>
		</body>
		</html>
	)
}
