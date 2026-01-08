'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Photo = {
	id: string
	alt: string
	src: string
}

const Photos: Photo[] = [
	{
		id: 'p1',
		alt: '1',
		src: '/img/1.jpg'
	},
	{
		id: 'p2',
		alt: '2',
		src: '/img/2.jpg'
	},
	{
		id: 'p3',
		alt: '3',
		src: '/img/3.jpg'
	},
	{
		id: 'p4',
		alt: '4',
		src: '/img/5.jpg'
	},
	{
		id: 'p6',
		alt: '6',
		src: '/img/1.jpg'
	},
	{
		id: 'p7',
		alt: '7',
		src: '/img/7.jpg'
	},
	{
		id: 'p8',
		alt: '8',
		src: '/img/8.jpg'
	},
	{
		id: 'p9',
		alt: '9',
		src: '/img/9.jpg'
	},
	{
		id: 'p10',
		alt: '10',
		src: '/img/10.jpg'
	},
	{
		id: 'p11',
		alt: '11',
		src: '/img/11.jpg'
	},
]

export default function BeforeAfterSwiper() {
	return (
		<div
			id="galerie"
			className={`mx-auto max-w-6xl px-4 relative`}
		>
			<Swiper
				modules={[Navigation, Pagination, A11y]}
				spaceBetween={24}
				slidesPerView={1}
				loop={true}
				pagination={{ clickable: true }}
				navigation={{
					nextEl: '.swiper-button-right',
					prevEl: '.swiper-button-left',
				}}
				a11y={{ prevSlideMessage: 'Předchozí', nextSlideMessage: 'Další' }}
				breakpoints={{
					768: { slidesPerView: 1 },
					1024: { slidesPerView: 2 },
				}}
				className="!pb-10"
			>
				{Photos.map((photo: Photo) => {
					return (
						<SwiperSlide key={photo.id}>
							<img className="aspect-[4/4] w-full rounded-2xl object-cover"
									 src={photo.src}
									 alt={photo.alt}/>
						</SwiperSlide>
					)
				})}
			</Swiper>
			<div className="swiper-button-left"></div>
			<div className="swiper-button-right"></div>
		</div>
	)
}
