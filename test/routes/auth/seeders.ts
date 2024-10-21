import prisma from "@/config/prisma.config";
import { encryptPassword } from "@/utils/hash";
import authData from "./data";

const userSeeder = async () => {
	const hashedPassword = await encryptPassword(authData.validUser.password);
	const user = await prisma.user.create({
		data: {
			...authData.validUser,
			password: hashedPassword,
		},
	});

	return user;
};
const authSeeders = { userSeeder };
export default authSeeders;
