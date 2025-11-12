(() => {
    const numImages = 131;
    const numGifs = 4;
    const totalAssets = numImages + numGifs;

    // See whether overlays are even enabled
    chrome.storage.local.get(['overlayEnabled', 'imagesEnabled', 'gifsEnabled'], (result) => {
        //result is an object that contains the data retrieved from chrome.storage.local.get
        //overlayEnabled is an attribute of result
        const enabled = result.overlayEnabled !== false; // default to true if not set
        const opacity = enabled ? '1' : '0';
        console.log("Opacity " + opacity);
        const imagesEnabled = result.imagesEnabled !== false; // default to true if not set
        console.log("image " + imagesEnabled);
        const gifsEnabled = result.gifsEnabled !== false; // default to true if not set
        console.log("image " + gifsEnabled);
        

        // get all yt thumbnails
        
        function getThumbnails() {
            const thumbnails = document.querySelectorAll('img[src*="ytimg.com"]');

            thumbnails.forEach((thumbnail) => {
                // skip if overlays globally off
                if (!enabled) return;

                let overlayUrl;

                if (imagesEnabled && gifsEnabled) {
                    const pickImage = imageOrGif();
                    overlayUrl = pickImage
                        ? getOverlayUrl(getRandomImageIndex())
                        : getOverlayUrlGif(getRandomGifIndex());
                } else if (imagesEnabled && !gifsEnabled) {
                    overlayUrl = getOverlayUrl(getRandomImageIndex());
                } else if (!imagesEnabled && gifsEnabled) {
                    overlayUrl = getOverlayUrlGif(getRandomGifIndex());
                } else {
                    // both disabled do nothing
                    return;
                }

                changeThumbnail(thumbnail, overlayUrl);
            });
            
        
            
            
        }

        // Apply new (and improved) thumbnails
       function changeThumbnail(thumbnail, OverlayUrl) {
    if (thumbnail.dataset.overlayApplied) return;

    const parent = thumbnail.parentElement;
    if (!parent) return;

    // Ensure stacking context
    if (getComputedStyle(parent).position === "static") {
        parent.style.position = "relative";
    }

    // Create the overlay image
    const overlay = document.createElement("img");
    overlay.src = OverlayUrl;
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.zIndex = "9999";   // put it on top
    overlay.style.pointerEvents = "none"; // don’t block clicks
    overlay.style.opacity = opacity;
    overlay.style.objectFit = "cover"; // keep aspect ratio, animates fine

    parent.appendChild(overlay);
    thumbnail.dataset.overlayApplied = "true";

    // Debug load state
    //overlay.onload = () => console.log("overlay loaded:", OverlayUrl);
    //overlay.onerror = () => console.error("overlay failed to load:", OverlayUrl);
}

        // Get random image index
        function getRandomImageIndex() {
            //return 103;
            return Math.floor(Math.random() * (numImages) + 1);
        }
        // Get random gif index
        function getRandomGifIndex() {
            return Math.floor(Math.random() * (numGifs) + 1);
        }
        // Get URL of the overlay image
        function getOverlayUrl(index) {
            return chrome.runtime.getURL(`assets/images/${index}.PNG`);
        }
        // Get URL of the overlay gif
        function getOverlayUrlGif(index) {
            return chrome.runtime.getURL(`assets/gifs/${index}.gif`);
        }
        // Biased random picker if true it is image else gif
        function imageOrGif() {
            return Math.random() * totalAssets < numImages;
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
