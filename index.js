const core = require("@actions/core");
const fs = require("fs");
const xpath = require("xpath");
const dom = require("xmldom").DOMParser;

try {
	let projectFile = core.getInput("project-file");
	let suffix = core.getInput("suffix");
	let build = core.getInput("build");

	var text = fs.readFileSync(projectFile, "utf8");

	var doc = new dom().parseFromString(text);
	var currentVersion = xpath.select(
		"string(/Project/PropertyGroup/AssemblyVersion)",
		doc
	);
	var currentFileVersion = xpath.select(
		"string(/Project/PropertyGroup/FileVersion)",
		doc
	);

	let nextVersion = yyyymmdd() + ".";
	const versionParts = currentVersion.split(".");
	if (!build) {
		let revision = versionParts[versionParts.length - 1];
		revision++;
		nextVersion += revision;
	} else {
		nextVersion += build;
	}

	text = text.replace(
		"<AssemblyVersion>" + currentVersion + "</AssemblyVersion>",
		"<AssemblyVersion>" + nextVersion + "</AssemblyVersion>"
	);

	if (suffix) {
		nextVersion = nextVersion + "-" + suffix;
	}

	text = text.replace(
		"<FileVersion>" + currentFileVersion + "</FileVersion>",
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
