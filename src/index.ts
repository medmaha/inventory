import app, { init } from "./app";

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, async () => {
	console.log("Booting Application...");
	try {
		await init();
		console.log(`Server up and running on port ${PORT}`);
	} catch (error: any) {
		console.log("[ERROR] failed to boot up application");
	}
});

export default app;
