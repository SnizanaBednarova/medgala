'use client'

import BeforeAfterSwiper from "@/lib/component/feature/BeforeAfterSwiper";

export default function Home() {
	return (
		<div>
			<div className="glass shadow-soft">
			<img src="/img/Grafika banneru.png"
					 alt="Přeměna postavy – před a po" className="w-full"/>
			</div>
			<section
				id="about"
				className="relative max-w-4xl mx-auto px-6 py-28"
			>
				<div className="space-y-12">

					{/* === INFO CARD === */}
					<div className="relative">
						{/* glow */}
						<div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-cyan-400/30 to-blue-500/20 blur-2xl"></div>

						<div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10">
							<div className="grid gap-10">

								{/* KDY */}
								<div className="flex items-start gap-10">
									<div className="text-white font-semibold tracking-widest text-sm w-32">
										KDY?
									</div>
									<div className="text-3xl font-medium text-white">
										13. 3. 2026
									</div>
								</div>

								{/* KDE */}
								<div className="flex items-start gap-10">
									<div className="text-white font-semibold tracking-widest text-sm w-32">
										KDE?
									</div>
									<div className="text-lg leading-relaxed text-white/90">
										V multifunkční aule{" "}
										<span className="font-semibold text-white">GONG</span>
										<br />
										<span className="text-white/70">
								v oblasti Dolních Vítkovic
							</span>
									</div>
								</div>

								{/* DRESSCODE */}
								<div className="flex items-start gap-10">
									<div className="text-white font-semibold tracking-widest text-sm w-32">
										DRESSCODE?
									</div>
									<div className="flex items-center gap-4 flex-wrap">
							<span className="px-5 py-1.5 rounded-full bg-blue-800/60 border border-white/20 text-white">
								Modrá
							</span>
										<span className="px-5 py-1.5 rounded-full bg-white/10 border border-white/30 text-white">
								Stříbrná
							</span>
									</div>
								</div>

							</div>
						</div>
					</div>

					{/* === STORY CARD === */}
					<div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10">
						<p className="font-serif tracking-widest text-xl text-white mb-6">
							Nejelegantnější večer roku se vrací
						</p>

						<p className="text-white/80 leading-relaxed text-lg">
							Těšit se můžete na živou hudbu, výborné občerstvení,
							losovačku o skvělé ceny a především – večer plný zážitků,
							na který budete ještě dlouho vzpomínat.
						</p>
					</div>

				</div>
			</section>
			<section className="relative max-w-5xl mx-auto px-6 py-28">

				{/* glow background */}
				<div className="absolute -inset-4 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-transparent blur-3xl rounded-[40px]"></div>

				<div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-[40px] p-14 text-center">

					<p className="text-cyan-300 tracking-widest text-sm font-semibold mb-4">
						VSTUPENKY
					</p>

					<h2 className="font-serif text-4xl md:text-5xl tracking-widest text-white mb-6">
						Koupit vstupenky
					</h2>

					<p className="text-white/80 max-w-xl mx-auto leading-relaxed mb-10">
						Zajistěte si své místo na nejelegantnějším večeru roku.
						Počet vstupenek je omezený.
					</p>

					<a
						href="/vstupenky"
						className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-cyan-400 text-blue-900 font-semibold text-lg hover:scale-105 transition"
					>
						Přejít na vstupenky
						<span aria-hidden>→</span>
					</a>

					<p className="mt-6 text-sm text-white/60">
						Bezpečný nákup • Online platba
					</p>
				</div>
			</section>
			<BeforeAfterSwiper></BeforeAfterSwiper>
		</div>
	)
}
