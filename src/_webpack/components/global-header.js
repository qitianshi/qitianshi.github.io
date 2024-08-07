// Manages the global header.

// Copyright 2024 Qi Tianshi. All rights reserved.


import throttle from "lodash.throttle";

const globalHeaderNavClasses = document
    .querySelector("#global-header nav").classList;
const hamburgerCheckboxElement = document
    .getElementById("global-header__hamburger-checkbox");
const globalHeaderBackgroundFilter = document
    .getElementById("global-header__background-filter");

/** Toggles the transparent mode of the horizontal when scrolled to the top. */
function toggleNavbarTransparency() {
    globalHeaderNavClasses
        .toggle("global-header--transparent", window.scrollY <= 0);
}

/**
 * Animates the mobile navbar state between expanded and collapsed.
 *
 * @param {Boolean} [quickReset = false] - If true, the navbar is collapsed
 *     with no animation.
 */
function toggleExpandedMobileNavbar(quickReset = false) {

    const mobileExpandedClass = "global-header--mobile-expanded";

    // Reads the value of the hamburger button checkbox.
    if (hamburgerCheckboxElement.checked) {

        // Overwrite is required to kill the current animation if the state is
        // toggled before animation finishes.
        let navbarExpansionTimeline = gsap.timeline({
            defaults: { overwrite: true, },
            onStart: function () {
                globalHeaderNavClasses.add(mobileExpandedClass);
            },
        });

        // Animates the height change of the navbar.
        navbarExpansionTimeline.to("#global-header__navigation-links", {
            height: "auto",
            duration: 0.3,
            ease: "power1.in",
        });

        // Animates the entrance of the navlinks.
        navbarExpansionTimeline.from("#global-header__navigation-links li", {
            y: "-1rem",
            opacity: 0,
            duration: 1,
            delay: 0.09,
            stagger: 0.07,
            ease: "power4.out",
        }, "<");

        // Animates the entrance of the background filter.
        navbarExpansionTimeline.to(globalHeaderBackgroundFilter, {
            display: "block",
            opacity: 1,
            duration: 0.3,
            onComplete: function () {

                // Prevents scrolling the body if the browser supports
                // backdrop filters. Otherwise, there is no reason to prevent
                // scrolling. -webkit- prefix is for Safari support.
                if (CSS.supports("backdrop-filter", "blur()")
                    || CSS.supports("-webkit-backdrop-filter", "blur()")) {
                    document.body.style.overflow = "hidden";
                }

            },
        }, "<");

    } else {

        let navbarCollapseTimeline = gsap.timeline({defaults: {
            overwrite: true,
        }});

        // Animates the collapse of the navbar.
        navbarCollapseTimeline.to("#global-header__navigation-links", {
            height: 0,
            duration: (quickReset ? 0 : 0.3),
            ease: "power1.in",
            clearProps: true,       // If toggled back to wide layout.
            onComplete: function () {
                globalHeaderNavClasses.remove(mobileExpandedClass);
            },
        });

        // Animates the exit of the background filter.
        navbarCollapseTimeline.to(globalHeaderBackgroundFilter, {
            display: "none",
            opacity: 0,
            duration: 0.3,
            onStart: function () {
                document.body.style.overflow = null;     // Restores scrolling.
            },
        });

    }

}

/**
 * Module for managing the global header, including style changes and
 * animations.
 */
const GlobalHeader = {
    init: function () {

        // Applies navbar transparency if the page has opted in.
        if (globalHeaderNavClasses.value.includes(
            "global-header--transparency-theme-"
        )) {

            // Applies the transparency on page load.
            toggleNavbarTransparency();

            // Adds event listeners for scroll and resize.
            for (const type of ["scroll", "resize"]) {

                // The callback is throttled and the event listener is passive
                // to reduce compute load.
                window.addEventListener(
                    type,
                    throttle(toggleNavbarTransparency, 250),
                    { passive: true }
                );

            }

        }

        // Handles the clicking of the hamburger button. Wraps the function
        // call in an anonymous function because otherwise the event object
        // would be passed.
        hamburgerCheckboxElement.addEventListener("change", function () {
            toggleExpandedMobileNavbar();
        });

        // Collapses the navbar if there is a click outside of the menu.
        globalHeaderBackgroundFilter.addEventListener("click", function () {
            hamburgerCheckboxElement.checked = false;
            toggleExpandedMobileNavbar();
        });

        // If the window is resized to the wide layout mode of the navbar while
        // the mobile expanded layout is active, the navbar is collapsed.
        window.addEventListener("resize", throttle(function () {
            if (
                window.getComputedStyle(
                    document
                        .querySelector("#global-header .c-hamburger-button")
                ).display === "none"
            ) {
                hamburgerCheckboxElement.checked = false;
                toggleExpandedMobileNavbar(true);
            }
        }, 250), { passive: true });

    },
};

export default GlobalHeader;
