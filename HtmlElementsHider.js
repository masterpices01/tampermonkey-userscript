// ==UserScript==
// @name         TypeRacer Element Hider
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hide specified HTML elements on TypeRacer with a button at the bottom-right to select and hide elements like inspection tools
// @author       Grok
// @match        https://play.typeracer.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Load or initialize the list of selectors to hide
    let selectorsToHide = GM_getValue('hiddenSelectors', [
        '#dUI > table > tbody > tr:nth-child(2) > td:nth-child(3)', // Default hidden element
    ]);

    // Function to apply CSS to hide all selected elements
    function applyHiddenStyles() {
        const css = selectorsToHide
            .map(selector => `${selector} { display: none !important; }`)
            .join('\n');
        GM_addStyle(css);
    }

    // Apply initial hidden styles
    applyHiddenStyles();

    // Function to generate a unique CSS selector for an element
    function getUniqueSelector(element) {
        if (!element || element === document.body) return null;
        let path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.tagName.toLowerCase();
            if (element.id) {
                selector = `#${element.id}`;
                path.unshift(selector);
                break;
            }
            if (element.className && typeof element.className === 'string') {
                const classes = element.className.trim().split(/\s+/).join('.');
                selector += `.${classes}`;
            }
            const siblings = element.parentNode ? Array.from(element.parentNode.children) : [];
            const sameTagSiblings = siblings.filter(sib => sib.tagName === element.tagName);
            if (sameTagSiblings.length > 1) {
                const index = sameTagSiblings.indexOf(element) + 1;
                selector += `:nth-child(${index})`;
            }
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(' > ');
    }

    // Create the floating button
    const button = document.createElement('button');
    button.textContent = 'Select Element to Hide';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '10000'; // High z-index to stay on top
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Enhances visibility
    document.body.appendChild(button);

    // Styles for highlighting elements during selection
    GM_addStyle(`
        .element-hider-highlight {
            outline: 2px solid red !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
        }
    `);

    let isSelecting = false;
    let highlightedElement = null;

    // Toggle selection mode
    button.addEventListener('click', () => {
        isSelecting = !isSelecting;
        button.textContent = isSelecting ? 'Cancel Selection' : 'Select Element to Hide';
        button.style.backgroundColor = isSelecting ? '#dc3545' : '#007bff';
        if (isSelecting) {
            document.addEventListener('mouseover', handleMouseOver);
            document.addEventListener('click', handleElementClick, true);
            document.addEventListener('keydown', handleKeyDown);
        } else {
            stopSelecting();
        }
    });

    // Handle mouse over to highlight elements
    function handleMouseOver(event) {
        if (!isSelecting) return;
        const target = event.target;
        if (target === button || target.contains(button)) return;
        if (highlightedElement) {
            highlightedElement.classList.remove('element-hider-highlight');
        }
        target.classList.add('element-hider-highlight');
        highlightedElement = target;
    }

    // Handle element click to hide it
    function handleElementClick(event) {
        if (!isSelecting) return;
        event.preventDefault();
        event.stopPropagation();
        const target = event.target;
        if (target === button || target.contains(button)) return;


        const selector = getUniqueSelector(target);
        if (selector && !selectorsToHide.includes(selector)) {
            selectorsToHide.push(selector);
            GM_setValue('hiddenSelectors', selectorsToHide);
            applyHiddenStyles();
        }
        stopSelecting();
    }

    // Handle Esc key to cancel selection
    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            stopSelecting();
        }
    }

    // Stop selecting mode
    function stopSelecting() {
        isSelecting = false;
        button.textContent = 'Select Element to Hide';
        button.style.backgroundColor = '#007bff';
        if (highlightedElement) {
            highlightedElement.classList.remove('element-hider-highlight');
            highlightedElement = null;
        }
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('click', handleElementClick, true);
        document.removeEventListener('keydown', handleKeyDown);
    }
})();
