// Manages the color theme toggle in the sitewide footer.

// Copyright 2023 Qi Tianshi. All rights reserved.


const themePreferenceStorageKey = "user-theme-preference";

/**
 * Checks localStorage if a color theme has previously been specified,
 * otherwise uses the default.
 *
 * @returns {String} The preferred color theme, either "light", "dark", or
 *                   "auto".
 */
function getPreferredTheme() {

    if (preference = localStorage.getItem(themePreferenceStorageKey)) {

        // If a preference has already been set.
        return preference;

    } else {

        // Fallback
        return "auto";

    }

}

/**
 * Saves the preferred color theme to localStorage.
 *
 * @param {String} theme The theme to be saved.
 */
function savePreferredTheme(theme) {
    localStorage.setItem(themePreferenceStorageKey, theme);
}

/**
 * Updates the color theme toggle in the sitewide footer to reflect the
 * currently applied color theme. Only necessary when the page is being loaded,
 * or when some script other than the toggle causes the color theme to be
 * changed.
 *
 * @param {String} theme The theme to be applied.
 */
function updateToggleWithSavedPreference(theme) {

    // Selects the option whose value corresponds to the selected theme.
    document
        .querySelector(`#sitewide-footer__color-theme-toggle [value=${theme}]`)
        .checked = true;

}

/**
 * Applies the preferred color theme to the webpage.
 *
 * @param {*} theme The theme to be applied.
 */
function applyPreferredTheme(theme) {

    const bodyElementClasses = document.body.classList;

    // Removes all existing theme classes first.
    bodyElementClasses.remove("t-light", "t-dark", "t-preference");

    switch (theme) {

        case "light":
            bodyElementClasses.add("t-light");
            break;

        case "dark":
            bodyElementClasses.add("t-dark");
            break;

        // By default, elements will already follow the browser default theme,
        // thus it's unnecessary to add the .t-preference class.
        default:
            break;

    }

}

/**
 * Handles the event of the user choosing a color theme. Applies the theme and
 * saves the preference.
 */
function onUserChangeThemeToggle() {

    // Get the selected value from the input.
    const chosenTheme = document
        .querySelector("input[name='color-theme-toggle']:checked")
        .value;

    applyPreferredTheme(chosenTheme);
    savePreferredTheme(chosenTheme);

}

window.onload = () => {

    // Checks if a preference has previously been set, and updates the toggle
    // in the sitewide footer.
    const preferredTheme = getPreferredTheme();
    applyPreferredTheme(preferredTheme);
    updateToggleWithSavedPreference(preferredTheme);

    // Adds the event listener for the user choosing a color theme.
    document
        .getElementById("sitewide-footer__color-theme-toggle")
        .addEventListener("change", onUserChangeThemeToggle);

}