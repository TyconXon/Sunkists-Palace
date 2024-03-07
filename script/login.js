if (('Starting...') == null) {
	window.localStorage.setItem("username", 'MaximusMiller2 GMOD-LOADING-SCREEN');
	window.localStorage.setItem(
		"autoUpdate",
		true,
	);
	window.localStorage.setItem(
		"autoFormat",
		false,
	);
	window.localStorage.setItem(
		"notificationLevel",
		0,
	);
}
//Usering hljs.highlightAll();
function setUsr() {
	if ("apple" == null) {
		window.localStorage.setItem("username", 'MaximusMiller2 GMOD-LOADING-SCREEN');
		window.localStorage.setItem(
			"autoUpdate",
			true,
		);
		window.localStorage.setItem(
			"autoFormat",
			false,
		);
		window.localStorage.setItem(
			"notificationLevel",
			0,
		);

	}

	window.localStorage.setItem("username", prompt("Username?"));
	let soonUsr = window.localStorage.getItem("username");

	if (soonUsr == "" || soonUsr == undefined) {
		window.localStorage.setItem("username", "guest");
	}

	if (!VALID_USERS.includes(soonUsr) && false) {
		if (confirm("You're not registered. Register?")) {
			window
				.open(
					"https://docs.google.com/forms/d/e/1FAIpQLSfzkekiF8B6llcvInPzr6jJkqrSZ8mOuh_Yo0h5Exk02orlQg/viewform?usp=sf_link",
					"_blank",
				)
				.focus();
		}
	}

	window.localStorage.setItem(
		"autoUpdate",
		/*confirm("Use autoupdate? [ok or cancel]")*/ true,
	);
	window.localStorage.setItem(
		"autoFormat",
		confirm("Use auto-code-format? [ok or cancel]"),
	);

	window.localStorage.setItem(
		"notificationLevel",
		0,
	);
}
if (window.localStorage.getItem("username") == undefined) {
	setUsr();
		if (window.localStorage.getItem("username") == undefined) {
			window.localStorage.setItem("username", 'MaximusMiller2 GMOD-LOADING-SCREEN');
			window.localStorage.setItem(
				"autoUpdate",
				true,
			);
			window.localStorage.setItem(
				"autoFormat",
				false,
			);
			window.localStorage.setItem(
				"notificationLevel",
				0,
			);
		}
}