const loadingOverlay = document.getElementById("loadingOverlay");

if (loadingOverlay) {
    const minLoadingTimeMS = 3000; // 3 seconds minimum loading time
    let minTimeElapsed = false;
    let pageLoaded = document.readyState === "complete";
    let hidden = false;

    /**
     * Hides the loading overlay with a fade-out effect and removes it after the transition completes.
    */
    const hideLoadingOverlay = () => {
        if (hidden) {
            return;
        }

        hidden = true;

        // Start fade-out transition
        loadingOverlay.classList.add("is-hidden");
        
        // Remove the entire overlay element after the transition ends
        loadingOverlay.addEventListener(
            "transitionend",
            () => {
                loadingOverlay.remove();
            },
            { once: true }
        );
    };

    /**
     * Checks if both the minimum loading time has elapsed and the page has fully loaded. If both conditions are met, it hides the loading overlay.
     */
    const readyToHide = () => {
        if (minTimeElapsed && pageLoaded) {
            hideLoadingOverlay();
        }
    };

    /** Sets the minimum loading time */
    setTimeout(() => {
        minTimeElapsed = true;
        readyToHide();
    }, minLoadingTimeMS);

    // Check if the page has been loaded, if so hide the loading overlay
    if (!pageLoaded) {
        window.addEventListener(
            "load",
            () => {
                pageLoaded = true;
                readyToHide();
            },
            { once: true }
        );
    } else {
        readyToHide();
    }
}
