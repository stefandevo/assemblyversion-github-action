const core = require("@actions/core");
const fs = require("fs");
const xpath = require("xpath");
const dom = require("xmldom").DOMParser;

try {
	let projectFile = core.getInput("project-file");
	let suffix = core.getInput("suffix");

	var text = fs.readFileSync(projectFile, "utf8");

	var doc = new dom().parseFromString(text);
	var currentVersion = xpath.select(
		"string(/Project/PropertyGroup/AssemblyVersion)",
		doc
	);

	const versionParts = currentVersion.split(".");
	let revision = versionParts[versionParts.length - 1];
	revision++;

	let nextVersion = yyyymmdd() + "." + revision;

	text = text.replace(
		"<AssemblyVersion>" + currentVersion + "</AssemblyVersion>",
		"<AssemblyVersion>" + nextVersion + "</AssemblyVersion>"
	);

	if (suffix) {
		currentVersion = currentVersion + "-" + suffix;
		nextVersion = nextVersion + "-" + suffix;
	}

	text = text.replace(
		"<FileVersion>" + currentVersion + "</FileVersion>",
		"<FileVersion>" + nextVersion + "</FileVersion>"
	);

	fs.writeFileSync(projectFile, text, "utf8");

	core.setOutput("version", nextVersion);
} catch (error) {
	core.setFailed(error.message);
}

function yyyymmdd() {
	function twoDigit(n) {
		return (n < 10 ? "0" : "") + n;
	}

	var now = new Date();
	return (
		"" +
		now.getFullYear() +
		"." +
		twoDigit(now.getMonth() + 1) +
		"." +
		twoDigit(now.getDate())
	);
}
