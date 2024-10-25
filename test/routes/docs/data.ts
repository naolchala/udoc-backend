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

const docsData = {
	validDocBody,
	invalidDocBody,
	validUpdateBody,
	updateBodyWithEmptyTitle,
};
export default docsData;
