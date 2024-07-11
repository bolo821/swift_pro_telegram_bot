import { Schema, model } from 'mongoose';

const lotusSettingsSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'AppUser' },
		chain: { type: String },
		multiWallet: { type: Boolean },
		defaultBuyETHAmount: { type: String },
	},
	{ timestamps: true }
);

export const LotusSettingsModel = model('LotusSettings', lotusSettingsSchema);
