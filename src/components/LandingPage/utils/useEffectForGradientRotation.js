import { useEffect } from 'react';

const useGradientRotation = (className = 'rotating-gradient-wrapper') => {
  useEffect(() => {
    const initializeGradient = () => {
      const elements = document.querySelectorAll(`.${className}`);
      elements.forEach((element, index) => {
        let angle = 0;

        const updateAnimation = () => {
          angle = (angle + 1) % 360;
          element.style.setProperty('--angle', `${angle + index * 120}deg`);
          requestAnimationFrame(updateAnimation);
        };

        if (!element.dataset.initialized) {
          element.style.setProperty('--angle', '0deg');
          requestAnimationFrame(updateAnimation);
          element.dataset.initialized = 'true'; // Mark as initialized
        }
      });
    };

    initializeGradient();

    // Reinitialize on DOM updates
    const observer = new MutationObserver(() => {
      initializeGradient();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [className]);
};

export default useGradientRotation;
