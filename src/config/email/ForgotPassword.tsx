/* eslint-disable no-use-before-define */
import React from "react";
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
	render,
} from "@react-email/components";
import env from "@/config/env.config";

function ForgotPasswordCodeEmail({ code }: { code: string }) {
	return (
		<Html>
			<Head />
			<Preview>Reset Your Password</Preview>
			<Body style={main}>
				<Container style={container}>
					<Text style={company}>UDoc</Text>
					<Heading style={codeTitle}>Reset Your Password</Heading>
					<Text style={codeDescription}>
						Enter it in your open browser window. This code will
						expire in 15 minutes.
					</Text>
					<Section style={codeContainer}>
						<Heading style={codeStyle}>{code}</Heading>
					</Section>
					<Section style={footer}>
						<Text style={paragraph}>Not expecting this email?</Text>
						<Text style={paragraph}>
							Contact{" "}
							<Link href={`mailto:${env.APP_EMAIL}`} style={link}>
								{env.APP_EMAIL}
							</Link>{" "}
							if you did not request this code.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

export default ForgotPasswordCodeEmail;

const main = {
	backgroundColor: "#ffffff",
	fontFamily: "Inter,HelveticaNeue,Helvetica,Arial,sans-serif",
	textAlign: "center" as const,
};

const container = {
	backgroundColor: "#ffffff",
	border: "1px solid #ddd",
	borderRadius: "5px",
	marginTop: "20px",
	width: "480px",
	maxWidth: "100%",
	margin: "0 auto",
	padding: "12% 6%",
};

const company = {
	fontWeight: "bold",
	fontSize: "18px",
	textAlign: "center" as const,
};

const codeTitle = {
	textAlign: "center" as const,
};

const codeDescription = {
	textAlign: "center" as const,
};

const codeContainer = {
	background: "#006fee",
	borderRadius: "4px",
	margin: "16px auto 14px",
	verticalAlign: "middle",
	width: "280px",
	maxWidth: "100%",
};

const codeStyle = {
	color: "#fff",
	display: "inline-block",
	paddingBottom: "8px",
	paddingTop: "8px",
	margin: "0 auto",
	width: "100%",
	textAlign: "center" as const,
	letterSpacing: "8px",
};

const paragraph = {
	color: "#444",
	letterSpacing: "0",
	padding: "0 40px",
	margin: "0",
	textAlign: "center" as const,
};

const link = {
	color: "#444",
	textDecoration: "underline",
};

const footer = {
	marginTop: "40px",
};

export const getForgotPasswordCodeEmail = async ({
	code,
}: {
	code: string;
}) => {
	return render(<ForgotPasswordCodeEmail code={code} />);
};
