// ==UserScript==
// @name         Manhuagui Ui Configuration
// @namespace    http://tampermonkey.net/
// @version      2024-11-25
// @description  try to take over the world!
// @author       You
// @match        https://www.manhuagui.com/comic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manhuagui.com
// @grant        none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';

        // Create the top bar container
    const topBar = document.createElement('div');
    topBar.id = 'topBar';
    document.body.prepend(topBar);

        // Function to move clearfix divs to the top bar
    function moveClearfixDivs() {
        const clearfixElements = document.querySelectorAll('.pr.tbCenter.cb');

        clearfixElements.forEach(el => {
            if (!topBar.contains(el)) {
                topBar.appendChild(el); // Move the element to the top bar
            }
        });
    }

    // Run on page load
    moveClearfixDivs();

    // Observe DOM changes to dynamically update the top bar
    const ClearFixobserver = new MutationObserver(() => {
        moveClearfixDivs();
    });

    ClearFixobserver.observe(document.body, { childList: true, subtree: true });


    // Target the div containing the buttons (adjust selector as needed)
    const clearfix = ".clearfix"
    const targetSelector = '.w980'; // Change this to match your div's class
    const target2 = ".header"

    // Function to apply vertical styling
    function applyVerticalStyle() {
        const container = document.querySelector(targetSelector);
        const header = document.querySelector(target2);
                const mangaFile = document.querySelector('#mangaFile'); // Select the node
        if (mangaFile) {
            mangaFile.style.height = `${window.innerHeight}px`; // Set height to fit the browser's height
            mangaFile.style.overflowY = 'auto'; // Enable scrolling if content overflows
            mangaFile.style.boxSizing = 'border-box'; // Include padding and borders in the height calculation
        }

        if (header) { header.style.display ='none'; }
        if (container) {
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'flex-start';
            container.style.gap = '10px';
            container.style.gap = '10px';


            // Apply button-specific styles (optional)
            container.querySelectorAll('button').forEach(button => {
                button.style.width = 'auto';
                button.style.margin = '0';
            });
        }
    }




    // Create the bottom bar container
    const bottomBar = document.createElement('div');
    bottomBar.id = 'bottomBar';
    document.body.appendChild(bottomBar);


    // Run the function on page load
    applyVerticalStyle();

    // Observe DOM changes and reapply styles if needed
    const observer = new MutationObserver(() => {
        applyVerticalStyle();
    });

    observer.observe(document.body, { childList: true, subtree: true });





})();
