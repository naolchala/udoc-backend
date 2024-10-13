export const defaultProfilePictureUrl = (fullName: string) =>
	`https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${encodeURI(
		fullName
	)}&backgroundColor=ffffff,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&frecklesProbability=15`;
