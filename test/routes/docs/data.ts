const validDocBody = {
	title: "How to use Prisma",
};

const invalidDocBody = {
	title: "",
};

const validUpdateBody = {
	title: "How to test your code",
	description: "This is how you test your code",
};

const updateBodyWithEmptyTitle = {
	title: "",
	description: "This is how you test your code",
};

const multipleValidDocumentations = [
	{
		title: "How to use Prisma",
		description: "This is how you use Prisma",
	},
	{
		title: "How to test your code",
		description: "This is how you test your code",
	},
	{
		title: "How to deploy your code",
		description: "This is how you deploy your code",
	},
	{
		title: "How to deploy your code",
		description: "This is how you deploy your code",
	},
];

const docsData = {
	validDocBody,
	invalidDocBody,
	validUpdateBody,
	updateBodyWithEmptyTitle,
	multipleValidDocumentations,
};
export default docsData;
