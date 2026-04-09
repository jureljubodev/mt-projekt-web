let activeLocks = 0;
let previousStyles: {
  htmlOverflow: string;
  overflow: string;
  paddingRight: string;
  touchAction: string;
  overscrollBehavior: string;
} | null = null;

export function lockBodyScroll(): () => void {
  activeLocks += 1;

  if (activeLocks === 1) {
    previousStyles = {
      htmlOverflow: document.documentElement.style.overflow,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
      touchAction: document.body.style.touchAction,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };

    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';
  }

  return () => {
    activeLocks = Math.max(0, activeLocks - 1);

    if (activeLocks > 0 || !previousStyles) {
      return;
    }

    document.documentElement.style.overflow = previousStyles.htmlOverflow;
    document.body.style.overflow = previousStyles.overflow;
    document.body.style.paddingRight = previousStyles.paddingRight;
    document.body.style.touchAction = previousStyles.touchAction;
    document.body.style.overscrollBehavior = previousStyles.overscrollBehavior;
    previousStyles = null;
  };
}