const check = () => {
	if (!('serviceWorker' in navigator)) {
		throw new Error('Service Worker Unsupported.')
	}
	else if (!('PushManager' in window)) {
		throw new Error('Service Worker Unsupported.')
	}
	else {
		console.log('Service Worker and Push Supported!')
	}
}

const registerServiceWorker = async () => {
	const swRegistration = await navigator.serviceWorker.register('/notificationWorker.js');
	return swRegistration;
}
const main = async () => {
	check();
	const swRegistration = await registerServiceWorker();
}
main();
