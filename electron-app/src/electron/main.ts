import { app, BrowserWindow, globalShortcut, Menu } from "electron";
import { ipcMainHandle, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResources } from "./ressourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import path from "path";
import { createMenu } from "./menu.js";

app.on("ready", () => {
	const mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080, 
		webPreferences: {
			preload: getPreloadPath(),
			nodeIntegration: true,
			contextIsolation: false,
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

	createTray(mainWindow);
	handleCloseEvents(mainWindow);
	createMenu(mainWindow);

	globalShortcut.register("CommandOrControl+Shift+I", () => {
		if (isDev()) {
			mainWindow.webContents.openDevTools({ mode: "detach" });
		}
	}	);
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
