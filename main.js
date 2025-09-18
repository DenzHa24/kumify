(() => {
    const numImages = 102;

    // See whether overlays are even enabled
    chrome.storage.local.get(['overlayEnabled'], (result) => {
        //result is an object that contains the data retrieved from chrome.storage.local.get
        //overlayEnabled is an attribute of result
        const enabled = result.overlayEnabled !== false; // default to true if not set
        const opacity = enabled ? '1' : '0';

        // get all yt thumbnails
        function getThumbnails() {
            //console.log("Looking for thumbnails...");
            const thumbnails = document.querySelectorAll('img[src*="ytimg.com"]');
            //console.log("Found thumbnails:", thumbnails.length);

            // For each image in the thumbnails array (which is thumbnail), get its image index, its base url, and then send it to 
            // apply thumbnails for a merge
            thumbnails.forEach((thumbnail) => {
                const index = getRandomImageIndex();
                // Get the URL of the random image
                let OverlayUrl = getOverlayUrl(index);
                //console.log("Applying overlay:", OverlayUrl);
                changeThumbnail(thumbnail, OverlayUrl);
            });
        }

        // Apply new (and improved) thumbnails
        function changeThumbnail(thumbnail, OverlayUrl) {

            if (thumbnail.dataset.overlayApplied) return;

            // Create the overlay image
            const overlay = document.createElement("img");
            overlay.src = OverlayUrl;
            overlay.style.position = "absolute";
            overlay.style.top = overlay.style.left = "0";
            overlay.style.width = overlay.style.height = "100%";
            overlay.style.zIndex = "0";
            overlay.style.opacity = opacity; // Apply the opacity here
            // Overlay is appended as a child of the original image's parent element (the thing we did query select), making it go on top
            thumbnail.parentElement.appendChild(overlay);
            thumbnail.dataset.overlayApplied = "true";
        }

        // Get random image index
        function getRandomImageIndex() {
            return Math.floor(Math.random() * (numImages) + 1);
        }

        // Get URL of the overlay image
        function getOverlayUrl(index) {
            return chrome.runtime.getURL(`assets/images/${index}.PNG`);
        }

        // Observe the entire body of the document for changes
        const observer = new MutationObserver(() => {
            getThumbnails();
        });
        observer.observe(document.body, {
            // Types of mutations to observe
            childList: true,
            subtree: true,
        });

        // Initial call to set thumbnails on page load
        getThumbnails();
    });
})();
