let activeLocks = 0;
let lockedScrollY = 0;

let previousBodyStyles: {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
} | null = null;

export function lockBodyScroll(): () => void {
  activeLocks += 1;

  if (activeLocks === 1) {
    lockedScrollY = window.scrollY;
    previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  return () => {
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks > 0 || !previousBodyStyles) {
      return;
    }

    document.body.style.overflow = previousBodyStyles.overflow;
    document.body.style.position = previousBodyStyles.position;
    document.body.style.top = previousBodyStyles.top;
    document.body.style.left = previousBodyStyles.left;
    document.body.style.right = previousBodyStyles.right;
    document.body.style.width = previousBodyStyles.width;

    const scrollTarget = lockedScrollY;
    previousBodyStyles = null;
    window.scrollTo({ top: scrollTarget, left: 0, behavior: 'auto' });
  };
}