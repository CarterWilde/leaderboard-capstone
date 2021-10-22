const express = require('express');
const { join } = require('path');
const app = express();
const port = 80;

app.use(express.static("./build"));

app.get('*', (req, res) => {
	res.sendFile(join(__dirname, "./build/index.html"));
});

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});