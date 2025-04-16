import { app, BrowserWindow, Menu } from "electron";
import { ipcMainHandle, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./ressourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import path from "path";
import { createMenu } from "./menu.js";

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
		},
		icon: path.join(getAssetPath(), "icon.ico"),
		// Réactive les bordures classiques avec les boutons de fenêtre
		frame: true, // Remplace `false` par `true`
	});
	if (isDev()) {
		mainWindow.loadURL("http://localhost:5123");
	} else {
		mainWindow.loadFile(getUIPath());
	}

	pollResources(mainWindow);

	ipcMainHandle("getStaticData", () => {
		return getStaticData();
	});

	// Retirer la gestion personnalisée des boutons
	// La fenêtre va maintenant utiliser les boutons par défaut sans besoin de cette gestion
	// ipcMainOn("sendFrameAction", (payload) => {
	// 	switch (payload) {
	// 		case "CLOSE":
	// 			mainWindow.close();
	// 			break;
	// 		case "MAXIMIZE":
	// 			mainWindow.maximize();
	// 			break;
	// 		case "MINIMIZE":
	// 			mainWindow.minimize();
	// 			break;
	// 	}
	// });

	createTray(mainWindow);
	handleCloseEvents(mainWindow);
	createMenu(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
	let willClose = false;

	mainWindow.on("close", (e) => {
		if (willClose) {
			return;
		}
		e.preventDefault();
		mainWindow.hide();
		if (app.dock) {
			app.dock.hide();
		}
	});

	app.on("before-quit", () => {
		willClose = true;
	});

	mainWindow.on("show", () => {
		willClose = false;
	});
}
