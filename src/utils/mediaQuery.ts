type MediaQuerySubscriber = (matches: boolean) => void;

export function subscribeToMediaQuery(query: string, subscriber: MediaQuerySubscriber): () => void {
  const mediaQuery = window.matchMedia(query);

  const notify = (matches: boolean) => {
    subscriber(matches);
  };

  notify(mediaQuery.matches);

  const onChange = (event: MediaQueryListEvent) => {
    notify(event.matches);
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }

  mediaQuery.addListener(onChange);
  return () => mediaQuery.removeListener(onChange);
}