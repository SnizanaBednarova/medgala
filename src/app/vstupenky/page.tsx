'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Hall = 'velky' | 'maly'
type Zone = 'standard' | 'vip_silver' | 'vip_gold'
type Ticket = 'economy' | 'standard' | 'vip_silver' | 'vip_gold'

type TableMeta = {
	id: string
	label: string
	zone: Zone
	capacity: number
}

type SeatMapDef = {
	key: Hall
	title: string
	svgSrc: string
	tables: TableMeta[]
}

const TICKETS: Record<Ticket, { name: string; price: number; zone?: Zone; hint: string }> = {
	economy: { name: 'ECONOMY', price: 499, hint: 'Stání / bez stolu' },
	standard: { name: 'STANDARD', price: 699, zone: 'standard', hint: 'Standardní stoly' },
	vip_silver: { name: 'VIP SILVER', price: 1199, zone: 'vip_silver', hint: 'VIP Silver zóna' },
	vip_gold: { name: 'VIP GOLD', price: 1599, zone: 'vip_gold', hint: 'VIP Gold zóna' },
}

const velkySal: SeatMapDef = {
	key: 'velky',
	title: 'Velký sál',
	svgSrc: '/img/velky-sal.svg',
	tables: [
		{ id: 'F1', label: 'F1', zone: 'standard', capacity: 8 },
		{ id: 'F2', label: 'F2', zone: 'standard', capacity: 8 },
		{ id: 'F3', label: 'F3', zone: 'standard', capacity: 8 },
		{ id: 'F4', label: 'F4', zone: 'standard', capacity: 8 },
		{ id: 'F5', label: 'F5', zone: 'standard', capacity: 8 },
		{ id: 'F6', label: 'F6', zone: 'standard', capacity: 8 },
		{ id: 'F7', label: 'F7', zone: 'standard', capacity: 8 },
		{ id: 'F8', label: 'F8', zone: 'standard', capacity: 8 },
		{ id: 'F9', label: 'F9', zone: 'standard', capacity: 8 },
		{ id: 'F10', label: 'F10', zone: 'standard', capacity: 8 },
		{ id: 'F11', label: 'F11', zone: 'standard', capacity: 8 },
		{ id: 'F12', label: 'F12', zone: 'standard', capacity: 8 },
		{ id: 'F13', label: 'F13', zone: 'standard', capacity: 8 },
		{ id: 'F14', label: 'F14', zone: 'standard', capacity: 8 },

		{ id: 'F15', label: 'F15', zone: 'vip_gold', capacity: 10 },
		{ id: 'F16', label: 'F16', zone: 'vip_gold', capacity: 10 },
		{ id: 'F17', label: 'F17', zone: 'standard', capacity: 10 },
		{ id: 'F18', label: 'F18', zone: 'standard', capacity: 10 },

		{ id: 'F19', label: 'F19', zone: 'vip_gold', capacity: 10 },
		{ id: 'F20', label: 'F20', zone: 'vip_gold', capacity: 10 },
		{ id: 'F21', label: 'F21', zone: 'standard', capacity: 10 },
		{ id: 'F22', label: 'F22', zone: 'standard', capacity: 10 },

		{ id: 'F23', label: 'F23', zone: 'vip_gold', capacity: 10 },
		{ id: 'F24', label: 'F24', zone: 'vip_gold', capacity: 10 },
		{ id: 'F25', label: 'F25', zone: 'standard', capacity: 10 },
		{ id: 'F26', label: 'F26', zone: 'standard', capacity: 10 },

		{ id: 'F27', label: 'F27', zone: 'vip_gold', capacity: 10 },
		{ id: 'F28', label: 'F28', zone: 'vip_gold', capacity: 10 },
		{ id: 'F29', label: 'F29', zone: 'standard', capacity: 10 },
		{ id: 'F30', label: 'F30', zone: 'standard', capacity: 10 },

		{ id: 'F31', label: 'F31', zone: 'vip_gold', capacity: 10 },
		{ id: 'F32', label: 'F32', zone: 'vip_gold', capacity: 10 },
		{ id: 'F33', label: 'F33', zone: 'standard', capacity: 10 },
		{ id: 'F34', label: 'F34', zone: 'standard', capacity: 10 },

		{ id: 'F35', label: 'F35', zone: 'vip_gold', capacity: 10 },
		{ id: 'F36', label: 'F36', zone: 'vip_gold', capacity: 10 },
		{ id: 'F37', label: 'F37', zone: 'vip_silver', capacity: 10 },
		{ id: 'F38', label: 'F38', zone: 'vip_silver', capacity: 10 },

		{ id: 'F39', label: 'F39', zone: 'vip_silver', capacity: 10 },
		{ id: 'F40', label: 'F40', zone: 'vip_silver', capacity: 10 },
		{ id: 'F41', label: 'F41', zone: 'vip_silver', capacity: 10 },
		{ id: 'F42', label: 'F42', zone: 'vip_silver', capacity: 10 },
	],
}

const malySal: SeatMapDef = {
  key: 'maly',
  title: 'Malý sál',
  svgSrc: '/img/maly-sal.svg',
  tables: [
    { id: 'M1', label: 'M1', zone: 'standard', capacity: 6 },
    { id: 'M2', label: 'M2', zone: 'standard', capacity: 6 },
    { id: 'M3', label: 'M3', zone: 'standard', capacity: 6 },
    { id: 'M4', label: 'M4', zone: 'standard', capacity: 6 },
    { id: 'M5', label: 'M5', zone: 'standard', capacity: 6 },
    { id: 'M6', label: 'M6', zone: 'standard', capacity: 6 },
    { id: 'M7', label: 'M7', zone: 'standard', capacity: 6 },
    { id: 'M8', label: 'M8', zone: 'standard', capacity: 6 },
    { id: 'M9', label: 'M9', zone: 'standard', capacity: 6 },
    { id: 'M10', label: 'M10', zone: 'standard', capacity: 6 },
    { id: 'M11', label: 'M11', zone: 'standard', capacity: 6 },
    { id: 'M12', label: 'M12', zone: 'standard', capacity: 6 },
    { id: 'M13', label: 'M13', zone: 'standard', capacity: 6 },
    { id: 'M14', label: 'M14', zone: 'standard', capacity: 6 },
    { id: 'M15', label: 'M15', zone: 'standard', capacity: 6 },
    { id: 'M16', label: 'M16', zone: 'standard', capacity: 6 },
    { id: 'M17', label: 'M17', zone: 'standard', capacity: 6 },
    { id: 'M18', label: 'M18', zone: 'standard', capacity: 6 },
    { id: 'M19', label: 'M19', zone: 'standard', capacity: 6 },
    { id: 'M20', label: 'M20', zone: 'standard', capacity: 6 },
    { id: 'M21', label: 'M21', zone: 'standard', capacity: 6 },
    { id: 'M22', label: 'M22', zone: 'standard', capacity: 6 },
    { id: 'M23', label: 'M23', zone: 'standard', capacity: 6 },
    { id: 'M24', label: 'M24', zone: 'standard', capacity: 6 },
    { id: 'M25', label: 'M25', zone: 'standard', capacity: 6 },
    { id: 'M26', label: 'M26', zone: 'standard', capacity: 6 },
    { id: 'M27', label: 'M27', zone: 'standard', capacity: 6 },
    { id: 'M28', label: 'M28', zone: 'standard', capacity: 6 },
		{ id: 'M29', label: 'M29', zone: 'standard', capacity: 6 },
		{ id: 'M30', label: 'M30', zone: 'standard', capacity: 6 },
		{ id: 'M31', label: 'M31', zone: 'standard', capacity: 6 },
		{ id: 'M32', label: 'M32', zone: 'standard', capacity: 6 },
		{ id: 'M33', label: 'M33', zone: 'standard', capacity: 6 },
		{ id: 'M34', label: 'M34', zone: 'standard', capacity: 6 },
		{ id: 'M35', label: 'M35', zone: 'standard', capacity: 6 },
		{ id: 'M36', label: 'M36', zone: 'standard', capacity: 6 },
  ],
}

function clamp(n: number, a: number, b: number) {
	return Math.max(a, Math.min(b, n))
}

function zoneBadge(zone: Zone) {
	switch (zone) {
		case 'vip_gold':
			return { name: 'VIP GOLD', cls: 'bg-yellow-300/20 text-yellow-100 border-yellow-300/30' }
		case 'vip_silver':
			return { name: 'VIP SILVER', cls: 'bg-cyan-400/15 text-cyan-100 border-cyan-300/30' }
		default:
			return { name: 'STANDARD', cls: 'bg-white/10 text-white/80 border-white/15' }
	}
}

function SvgPlan({
									 svgSrc,
									 tables,
									 ticket,
									 activeZone,
									 activeTable,
									 selected,
									 getState,
									 onPickTable,
								 }: {
	svgSrc: string
	tables: TableMeta[]
	ticket: Ticket
	activeZone?: Zone
	activeTable: string | null
	selected: Record<string, number>
	getState: (id: string) => { cap: number; occ: number; sel: number; free: number; isFull: boolean }
	onPickTable: (id: string) => void
}) {
	const hostRef = useRef<HTMLDivElement | null>(null)
	const [svgText, setSvgText] = useState('')

	useEffect(() => {
		let cancelled = false
		;(async () => {
			const res = await fetch(svgSrc, { cache: 'no-store' })
			const txt = await res.text()
			if (!cancelled) setSvgText(txt)
		})()
		return () => {
			cancelled = true
		}
	}, [svgSrc])

 useEffect(() => {
        const host = hostRef.current
        if (!host) return
        if (!svgText) return
        host.innerHTML = svgText

        const svg = host.querySelector('svg')
        if (!svg) return

        const cleanups: Array<() => void> = []

        for (const t of tables) {
            const el = svg.querySelector<HTMLElement>(`#${CSS.escape(t.id)}`)
            if (!el) continue

            el.setAttribute('role', 'button')
            el.classList.add('focus:outline-none')
            el.setAttribute('tabindex', '0')

            const click = (e: Event) => {
                e.preventDefault()
                if (activeZone && t.zone !== activeZone) return
                onPickTable(t.id)
            }
            const keydown = (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    click(e)
                }
            }

			el.addEventListener('click', click)
			el.addEventListener('keydown', keydown)
			cleanups.push(() => {
				el.removeEventListener('click', click)
				el.removeEventListener('keydown', keydown)
			})
		}

		return () => cleanups.forEach((fn) => fn())
 }, [svgText, tables, ticket, activeZone, onPickTable])

 useEffect(() => {
        const host = hostRef.current
        if (!host) return
        const svg = host.querySelector('svg')
        if (!svg) return

        for (const t of tables) {
            const el = svg.querySelector<HTMLElement>(`#${CSS.escape(t.id)}`)
            if (!el) continue

            const st = getState(t.id)
            const isDimmed = activeZone ? t.zone !== activeZone : false

            el.classList.toggle('seat-dimmed', isDimmed)
            el.classList.toggle('seat-full', st.isFull)

            const isClickable = (!activeZone || !isDimmed) && !st.isFull
            el.style.cursor = isClickable ? 'pointer' : 'not-allowed'
            el.style.pointerEvents = isClickable ? 'auto' : 'none'
            el.setAttribute('tabindex', isClickable ? '0' : '-1')
            el.setAttribute('aria-disabled', isClickable ? 'false' : 'true')

            el.setAttribute('title', `Obsazeno ${st.occ}/${st.cap}`)
        }
    }, [svgText, tables, ticket, activeZone, activeTable, selected, getState])

	return (
		<div className="relative">
			<style>{`
        .seat-dimmed { opacity: .18; pointer-events: none; }
        .seat-full { opacity: .45; pointer-events: none; }
        .seat-has-selection * { stroke: rgba(255,255,255,.85) !important; }
      `}</style>

			<div ref={hostRef} className="w-full h-auto" />

            <div className="absolute bottom-4 right-4 rounded-2xl bg-blue-950/70 border border-white/15 backdrop-blur px-4 py-3 text-sm">
                <div className="text-white/70">Klikni na stůl → vlevo nastavíš počet míst</div>
            </div>
        </div>
    )
}

export default function VstupenkyPage() {
	const [hall, setHall] = useState<Hall>('velky')
	const map = hall === 'velky' ? velkySal : malySal

 const [ticket, setTicket] = useState<Ticket>('standard')
 const [activeZone, setActiveZone] = useState(TICKETS[ticket].zone)

	const [occupied] = useState<Record<string, number>>({
		F15: 6,
		F16: 10,
		F23: 2,
		F39: 8,
		M24: 5,
		R3: 9,
	})

	const [selected, setSelected] = useState<Record<string, number>>({})
	const [activeTable, setActiveTable] = useState<string | null>(null)
	const [economyCount, setEconomyCount] = useState(0)
	const [economyVisible, setEconomyVisible] = useState(false)

	const tablesById = useMemo(() => new Map(map.tables.map((t) => [t.id, t])), [map.tables])

 useEffect(() => {
        const zone = TICKETS[ticket].zone
        setActiveZone(zone)

        // Only adjust activeTable when switching to a concrete zone.
        if (!zone) return

        // Preserve activeTable on seated zone switch when it already has some selection,
        // so the user can still adjust quantity or cancel that table even if it is not
        // in the currently clickable zone. If it has no selection and is outside of
        // the active zone, clear it.
        setActiveTable((prev) => {
            if (!prev) return null
            const tbl = tablesById.get(prev)
            if (!tbl) return null
            if (tbl.zone === zone) return prev
            const hasSelection = (selected[prev] ?? 0) > 0
            return hasSelection ? prev : null
        })
    }, [ticket, tablesById, selected])

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [agreeTerms, setAgreeTerms] = useState(false)
	const [agreeGdpr, setAgreeGdpr] = useState(false)

	const getState = (id: string) => {
		const t = tablesById.get(id)
		const cap = t?.capacity ?? 0
		const occ = occupied[id] ?? 0
		const sel = selected[id] ?? 0
		const free = cap > 0 ? clamp(cap - occ - sel, 0, cap) : 0
		return { cap, occ, sel, free, isFull: cap > 0 && occ + sel >= cap }
	}

	const addSeat = (id: string) => {
		const t = tablesById.get(id)
		if (!t || t.capacity <= 0) return
		const st = getState(id)
		if (st.free <= 0) return
		setSelected((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }))
	}

	const removeSeat = (id: string) => {
		setSelected((p) => {
			const cur = p[id] ?? 0
			if (cur <= 0) return p
			const next = { ...p, [id]: cur - 1 }
			if (next[id] === 0) delete next[id]
			return next
		})
	}

 const total = useMemo(() => {
        // Sum both seated selections and Economy quantity regardless of current ticket mode
        const zonePrice: Record<Zone, number> = {
            standard: TICKETS.standard.price,
            vip_silver: TICKETS.vip_silver.price,
            vip_gold: TICKETS.vip_gold.price,
        }
        let seatedSum = 0
        for (const [id, count] of Object.entries(selected)) {
            const z = tablesById.get(id)?.zone
            if (!z) continue
            seatedSum += (zonePrice[z] ?? 0) * count
        }
        const economySum = TICKETS.economy.price * economyCount
        return seatedSum + economySum
 }, [selected, economyCount, tablesById])

 // Keep a convenient list of tables to show in the sidebar: only tables with selected seats (> 0)
 const selectedTableIds = useMemo(
   () => Object.keys(selected).filter((id) => (selected[id] ?? 0) > 0),
   [selected]
 )
 const sidebarTableList = selectedTableIds

	const canCheckout = agreeTerms && agreeGdpr && email.trim().length > 3

 const pickTable = (id: string) => {
        // Always activate clicked table
        setActiveTable(id)

        // On first click, initialize with 1 ticket (only if currently 0 and capacity allows)
        // This makes the table appear in the sidebar immediately.
        setSelected((prev) => {
            const current = prev[id] ?? 0
            if (current > 0) return prev

            const t = tablesById.get(id)
            if (!t || t.capacity <= 0) return prev

            const occ = occupied[id] ?? 0
            const free = clamp(t.capacity - occ - current, 0, t.capacity)
            if (free <= 0) return prev

            return { ...prev, [id]: 1 }
        })
    }

	return (
		<main className="min-h-screen bg-gradient-to-br bg-primary-300 text-white">
			<div className="max-w-7xl mx-auto px-6 py-14">
				<header className="mb-10">
					<p className="text-cyan-300 tracking-widest text-xs font-semibold">MED GALA 2026</p>
					<h1 className="font-serif tracking-[0.22em] text-3xl md:text-5xl mt-3">VSTUPENKY</h1>
					<p className="text-white/70 mt-3 max-w-2xl">
						Klikni na stůl v plánku. U vybraného stolu zvolíš počet míst.
					</p>
				</header>
				{/* left CONTENT */}
				<div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-start">
					<aside className="order-1 lg:order-none rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl p-7 lg:sticky lg:top-6">
						<div className="flex items-center justify-between">
							<h2 className="font-semibold tracking-widest text-sm text-white/85">1. VÝBĚR LÍSTKU</h2>
						</div>

      <div className="mt-6 space-y-3">
                            {(Object.keys(TICKETS) as Ticket[]).map((k) => (
                                <button
                                    key={k}
                                    onClick={() => {
                                        setTicket(k)
                                        setActiveZone(TICKETS[k].zone)
                                        if (k === 'economy') {
                                            setEconomyVisible(true)
                                            setEconomyCount((c) => (c === 0 ? 1 : c))
                                        }
                                    }}
                                    className={[
                                        'w-full text-left rounded-2xl p-4 border transition',
                                        ticket === k ? 'border-cyan-300 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10',
                                    ].join(' ')}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="font-semibold">{TICKETS[k].name}</div>
                                            <div className="text-xs text-white/60">{TICKETS[k].hint}</div>
                                        </div>
                                        <div className="font-semibold tabular-nums">{TICKETS[k].price} Kč</div>
                                    </div>
                                </button>
                            ))}
                        </div>

							<div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
								<div className="text-xs text-white/60 tracking-widest">CENA</div>
								<div className="mt-2 font-semibold tabular-nums text-2xl">{total} Kč</div>
								<div className="text-xs text-white/50 mt-1">
									Počítáno podle vybraných míst (u stání dle počtu kusů).
								</div>
							</div>

      <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60 tracking-widest">VYBRANÉ STOLY</div>
                <button
                  className="text-xs text-white/60 hover:text-white"
                  onClick={() => {
                    // Clear all selections (both Economy and seated)
                    setEconomyCount(0)
                    setEconomyVisible(false)
                    setSelected({})
                    setActiveTable(null)
                  }}
                >
                  zrušit
                </button>
                </div>

                {/* Economy quantity appears after selecting Economy and hides at 0 */}
                {(economyVisible || economyCount > 0) && (
                <div className="mt-3 rounded-xl border p-3 transition border-white/10 bg-white/5 hover:bg-white/10">
                  <div className="flex items-center gap-2 ">
                    <button
                      className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 disabled:opacity-40"
                      onClick={() => setEconomyCount((c) => { const next = clamp(c - 1, 0, 100); if (next === 0) setEconomyVisible(false); return next; })}
                      disabled={economyCount <= 0}
                    >
                      −
                    </button>
                    <div className="min-w-12 text-center tabular-nums font-semibold">{economyCount}</div>
                    <button
                      className="px-3 py-2 rounded-xl bg-white text-blue-950 font-semibold hover:brightness-110 disabled:opacity-40"
                      onClick={() => setEconomyCount((c) => clamp(c + 1, 1, 100))}
                      disabled={economyCount >= 100}
                    >
                      +
                    </button>

                    <span className="ml-auto text-sm text-white/60">ECONOMY bez stolu</span>
                  </div>
                  <div className="text-xs text-white/50 mt-2">Zvol počet vstupenek ke stání</div>
                </div>
                )}

                {sidebarTableList.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {sidebarTableList.map((id) => {
                    const t = tablesById.get(id)
                    if (!t) return null
                    const st = getState(id)
                    return (
                      <div
                        key={id}
                        className={[
                          'rounded-xl border p-3 transition',
                          'border-white/10 bg-white/5 hover:bg-white/10',
                        ].join(' ')}
                        onClick={() => setActiveTable(id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-lg">{id}</div>
                          <span className={`text-xs px-2 py-1 rounded-full border ${zoneBadge(t.zone).cls}`}>
                            {zoneBadge(t.zone).name}
                          </span>
                        </div>
                        <div className="text-sm text-white/60 mt-1">
                          Obsazeno: {st.occ}/{st.cap} • Vybráno: {st.sel}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15"
                            onClick={() => removeSeat(id)}
                          >
                            −
                          </button>
                          <div className="min-w-12 text-center tabular-nums font-semibold">
                            {selected[id] ?? 0}
                          </div>
                          <button
                            className="px-3 py-2 rounded-xl bg-white text-blue-950 font-semibold hover:brightness-110"
                            onClick={() => addSeat(id)}
                          >
                            +
                          </button>
                          <span className="ml-auto text-sm text-white/60">Volno: {st.free}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                ) : (
                <div className="mt-4 text-white/70 text-sm">
                  Klikni na stůl v plánku a vyber počet míst.
                </div>
                )}
              </div>

						<div className="mt-8">
							<h3 className="font-semibold tracking-widest text-sm text-white/85">2. KONTAKTNÍ ÚDAJE</h3>
							<div className="mt-4 space-y-3">
								<input className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-300" placeholder="Jméno" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
								<input className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-300" placeholder="Příjmení" value={lastName} onChange={(e) => setLastName(e.target.value)} />
								<input className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-300" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
								<input className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-cyan-300" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
							</div>

							<div className="mt-5 space-y-3 text-sm text-white/70">
								<label className="flex gap-3 items-start">
									<input type="checkbox" className="mt-1" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
									<span>Souhlasím s obchodními podmínkami.</span>
								</label>
								<label className="flex gap-3 items-start">
									<input type="checkbox" className="mt-1" checked={agreeGdpr} onChange={(e) => setAgreeGdpr(e.target.checked)} />
									<span>Souhlasím s GDPR.</span>
								</label>
							</div>

							<div className="mt-6 grid gap-3">
								<button
									className="rounded-xl bg-cyan-400 text-blue-950 font-semibold py-3 hover:brightness-110 transition disabled:opacity-40 disabled:hover:brightness-100"
									disabled={!canCheckout}
									onClick={() => alert('Demo: Koupit (napojení na platební bránu doplníme).')}
								>
									Koupit
								</button>
							</div>
						</div>
					</aside>

					{/* RIGHT CONTENT */}
					<section className="order-2 lg:order-none space-y-8">
						{/* HALL SWITCH */}
						<div className="flex flex-wrap gap-3 items-center">
							<button
								onClick={() => {
									setHall('velky')
									setActiveTable(null)
								}}
								className={[
									'px-5 py-2 rounded-full border transition font-semibold',
									hall === 'velky' ? 'bg-white text-blue-950 border-white' : 'bg-white/5 border-white/15 hover:bg-white/10',
								].join(' ')}
							>
								Velký sál
							</button>

							<button
								onClick={() => {
									setHall('maly')
									setActiveTable(null)
								}}
								className={[
									'px-5 py-2 rounded-full border transition font-semibold',
									hall === 'maly' ? 'bg-white text-blue-950 border-white' : 'bg-white/5 border-white/15 hover:bg-white/10',
								].join(' ')}
							>
								Malý sál
							</button>

							<div className="ml-auto hidden md:flex items-center gap-4 text-sm text-white/70">
								<span className="inline-flex items-center gap-2">
									<span className="h-2.5 w-2.5 rounded-full bg-white/70" /> Standard
								</span>
								<span className="inline-flex items-center gap-2">
									<span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> VIP Silver
								</span>
								<span className="inline-flex items-center gap-2">
									<span className="h-2.5 w-2.5 rounded-full bg-yellow-300" /> VIP Gold
								</span>
							</div>
						</div>

						{/* PLAN */}
						<div className="rounded-3xl bg-white/5 border border-white/15 overflow-hidden">
       <div className="px-6 py-4 border-b border-white/10">
                                <h2 className="font-semibold tracking-widest text-sm">
                                    3. VÝBĚR SEDADLA — {map.title.toUpperCase()}
                                </h2>
                                <p className="text-white/60 text-sm mt-1">Klikni na stůl.</p>
                            </div>

							<div className="p-4 md:p-6">
								<SvgPlan
									svgSrc={map.svgSrc}
									tables={map.tables}
									ticket={ticket}
									activeZone={activeZone}
									activeTable={activeTable}
									selected={selected}
									getState={getState}
									onPickTable={pickTable}
								/>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}
