// script.js

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  
  let deferredPrompt;
  
  // Listen for the `beforeinstallprompt` event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevent the default prompt
    deferredPrompt = e; // Save the event for later
    const installButton = document.querySelector('#installButton');
    if (installButton) {
      installButton.style.display = 'block'; // Show the install button
      console.log('Install button displayed');
    }
  });
  
  // When the install button is clicked
  const installButton = document.querySelector('#installButton');
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt(); // Show the install prompt
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null; // Reset the deferredPrompt
      }
    });
  }
  
  // Optional: Listen for the app being installed
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
  });
  
  function searchTyrePressure() {
    const vehicleType = document.getElementById('vehicleType').value;
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;

    fetch('tyrePressureData.json')
        .then(response => response.json())
        .then(data => {
            const vehicleData = data[vehicleType][make][model];
            if (vehicleData) {
                document.getElementById('result').innerHTML = `Recommended Pressure: ${vehicleData.pressure} PSI<br>${vehicleData.low}<br>${vehicleData.high}`;
            } else {
                document.getElementById('result').innerHTML = 'Vehicle not found!';
            }
        });
}

  
function calculatePressure() {
  const load = document.getElementById('load').value;

  if (!load || load <= 0) {
      document.getElementById('calcResult').innerHTML = "Please enter a valid load.";
      return;
  }

  // Assuming a simple formula to estimate tyre pressure adjustment
  const basePressure = 30; // Example base pressure in PSI
  const pressureIncreasePerKg = 0.02; // Hypothetical increase per kg load

  const calculatedPressure = basePressure + (load * pressureIncreasePerKg);
  
  document.getElementById('calcResult').innerHTML = `Estimated Tyre Pressure: ${calculatedPressure.toFixed(2)} PSI`;
}
