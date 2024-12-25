import React from 'react';

export const useGradientRotadingEffect = () => {
  React.useEffect(() => {
    const elements = document.querySelectorAll('.rotating-color');

    elements.forEach((element, index) => {
      let angle = 0;

      const updateAnimation = () => {
        angle = (angle + 1) % 360;
        element.style.setProperty('--angle', `${angle + index * 120}deg`);
        requestAnimationFrame(updateAnimation);
      };

      element.style.setProperty('--angle', '0deg');
      requestAnimationFrame(updateAnimation);
    });
  }, []);
};
