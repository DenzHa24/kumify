document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-overlay');
    const toggleImagesButton = document.getElementById('toggle-images');
    const toggleGifsButton = document.getElementById('toggle-gifs');

    // Initialize button text based on stored state
    chrome.storage.local.get(['overlayEnabled'], (result) => {
        const enabled = result.overlayEnabled !== false; // default to true if not set
        toggleButton.textContent = enabled ? 'Disable Overlays' : 'Enable Overlays';
        toggleButton.style.backgroundColor = enabled ? '#4CAF50' : '#fd0000ff';
    });
    // Initialize button text based on stored state for images
    chrome.storage.local.get(['imagesEnabled'], (result) => {
        const imagesEnabled = result.imagesEnabled !== false; // default to true if not set
        toggleImagesButton.textContent = imagesEnabled ? 'Disable Images' : 'Enable Images';
        toggleImagesButton.style.backgroundColor = imagesEnabled ? '#4CAF50' : '#fd0000ff';
    });
    // Initialize button text based on stored state for gifs
    chrome.storage.local.get(['gifsEnabled'], (result) => {
        const gifsEnabled = result.gifsEnabled !== false; // default to true if not set
        toggleGifsButton.textContent = gifsEnabled ? 'Disable GIFs' : 'Enable GIFs'; 
        toggleGifsButton.style.backgroundColor = gifsEnabled ? '#4CAF50' : '#fd0000ff';
    });

    // Add click event listener to the toggle button
    toggleButton.addEventListener('click', () => {
        chrome.storage.local.get(['overlayEnabled'], (result) => {
            //2 variables: past and present after click
            const enabled = result.overlayEnabled !== false; // default to true if not set
            const newEnabledState = !enabled;

            //also, chenges overlayEnabled varuable to newEnabledState
            chrome.storage.local.set({ overlayEnabled: newEnabledState }, () => {
                //change the button based on whether its enabled or not
                toggleButton.textContent = newEnabledState ? 'Disable Overlays' : 'Enable Overlays';
                toggleButton.style.backgroundColor = newEnabledState ? '#4CAF50' : '#fd0000ff';
                // Reload the YouTube page to apply changes
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.reload(tabs[0].id);
                });
            });
        });
    });
    // Add click event listener to the toggle images button
    toggleImagesButton.addEventListener('click', () => {
        chrome.storage.local.get(['imagesEnabled'], (result) => {

            const imagesEnabled = result.imagesEnabled !== false; // default to true if not set
            const newImagesEnabledState = !imagesEnabled;
            
            chrome.storage.local.set({ imagesEnabled: newImagesEnabledState }, () => {
                toggleImagesButton.textContent = newImagesEnabledState ? 'Disable Images' : 'Enable Images';
                toggleImagesButton.style.backgroundColor = newImagesEnabledState ? '#4CAF50' : '#fd0000ff';
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.reload(tabs[0].id);
                });
            });
        });
    });
    // Add click event listener to the toggle gifs button
    toggleGifsButton.addEventListener('click', () => {
        chrome.storage.local.get(['gifsEnabled'], (result) => {
            const gifsEnabled = result.gifsEnabled !== false; // default to true if not set
            const newGifsEnabledState = !gifsEnabled;
            chrome.storage.local.set({ gifsEnabled: newGifsEnabledState }, () => {
                toggleGifsButton.textContent = newGifsEnabledState ? 'Disable GIFs' : 'Enable GIFs';
                toggleGifsButton.style.backgroundColor = newGifsEnabledState ? '#4CAF50' : '#fd0000ff';
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.reload(tabs[0].id);
                });
            });
        });
    });

});