import { Card, CardContent, CardActions, Button, Collapse, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Review = { id: string; short: string; full: string };

export function ReviewCard({
														 r,
														 expanded,
														 toggle,
													 }: {
	r: Review;
	expanded: boolean;
	toggle: (id: string) => void;
}) {
	return (
		<Card
			variant="outlined"
			sx={{
				borderRadius: '1.5rem',
				bgcolor: 'rgba(23,23,23,0.60)',
				border: '1px solid rgba(255,255,255,0.10)',
				boxShadow: '0 10px 30px rgba(0,0,0,.35)',
				overflow: 'hidden',
				transition: 'border-color .2s ease',
				'&:hover': { borderColor: 'rgba(255,255,255,0.20)' },
			}}
		>
			<CardContent sx={{ p: 3 }}>
				{!expanded && (
					<Typography
						component="blockquote"
						sx={{ color: 'rgba(229,231,235,1)', lineHeight: 1.7, fontSize: '1rem' }}
					>
						{r.short}
					</Typography>
				)}

				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<Typography
						component="blockquote"
						sx={{ color: 'rgba(229,231,235,1)', lineHeight: 1.7, fontSize: '1rem' }}
					>
						{r.full}
					</Typography>
				</Collapse>
			</CardContent>

			<CardActions sx={{ px: 3, pt: 0, pb: 3 }}>
				<Button
					type="button"
					onClick={() => toggle(r.id)}
					aria-expanded={expanded}
					variant="outlined"
					endIcon={
						<ExpandMoreIcon
							sx={{
								color: 'rgb(52,211,153)',             // emerald-400-ish
								transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform .2s ease',
							}}
						/>
					}
					sx={{
						textTransform: 'none',
						fontSize: '.9rem',
						color: 'rgba(229,231,235,1)',           // text-neutral-200
						borderColor: 'rgba(255,255,255,0.10)',
						'&:hover': { borderColor: 'rgba(255,255,255,0.20)' },
						outline: 'none',
						':focus-visible': {
							boxShadow: '0 0 0 4px rgba(16,185,129,.3)', // ring-emerald-500/30
							borderColor: 'rgba(16,185,129,.4)',
						},
						borderRadius: '0.75rem', // rounded-xl
						px: 1.5,
						py: 0.75,
					}}
				>
					{expanded ? 'Skrýt' : 'Zobrazit celou zprávu'}
				</Button>
			</CardActions>
		</Card>
	);
}
