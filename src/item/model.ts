
import { t, type UnwrapSchema } from 'elysia'

export const ItemModel = {
	body: t.Object({
		id: t.String({ format: 'uuid' }),
		amount: t.Number()
	}),
	extra_item: t.Object({
		name: t.String(),
		amount: t.Number()
	}),

} as const

// Optional, cast all model to TypeScript type
export type ItemModel = {
	[k in keyof typeof ItemModel]: UnwrapSchema<typeof ItemModel[k]>
}
