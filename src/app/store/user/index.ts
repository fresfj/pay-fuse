import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';

export type UserType = {
	role?: string[];
	data?: {
		displayName?: string;
		photoURL?: string;
		email?: string;
		shortcuts?: string[];
		settings?: Partial<FuseSettingsConfigType>;
	};
	loginRedirectUrl?: string;
};
