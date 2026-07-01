let _announcement = $state('');

export function announce(message: string) {
	_announcement = message;
}

export function getAnnouncement(): string {
	return _announcement;
}

export function clearAnnouncement() {
	_announcement = '';
}
