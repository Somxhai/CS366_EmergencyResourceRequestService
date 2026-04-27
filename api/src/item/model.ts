import { t, type UnwrapSchema } from 'elysia'

export const ItemModel = {
	body: t.Object({
		id: t.String({ format: 'uuid', error: 'item.id must be a valid UUID' }),
		amount: t.Number({ error: 'item.amount must be a number' })
	}),
	extra_item: t.Object({
		name: t.String({ error: 'extra_item.name must be a string' }),
		amount: t.Number({ error: 'extra_item.amount must be a number' })
	}),
} as const

export type ItemModel = {
	[k in keyof typeof ItemModel]: UnwrapSchema<typeof ItemModel[k]>
}
