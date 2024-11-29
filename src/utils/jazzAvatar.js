import jazzicon from '@metamask/jazzicon';

/**
 * Generates a Jazzicon and appends it to the provided DOM element.
 * @param {string} account - The wallet address to generate the Jazzicon for.
 * @param {HTMLElement} targetElement - The DOM element where the Jazzicon will be appended.
 * @param {number} size - The diameter of the Jazzicon (default: 40px).
 */
export const generateJazzicon = (account, targetElement, size = 40) => {
    if (!account || !targetElement) return;

    // Create a numeric seed based on the wallet address
    const seed = parseInt(account.slice(2, 10), 16);
    const icon = jazzicon(size, seed);

    // Clear previous content and append the new Jazzicon
    targetElement.innerHTML = '';
    targetElement.appendChild(icon);
};
