
export const downloadExtensionManifest = () => {
  const manifest = {
    "manifest_version": 3,
    "name": "AI Trading Signal Assistant",
    "version": "1.0",
    "description": "AI-powered trading signals overlay for Pocket Option and Quotex.",
    "side_panel": {
      "default_path": "index.html"
    },
    "permissions": [
      "sidePanel"
    ],
    "host_permissions": [
      "https://pocketoption.com/*",
      "https://qxbroker.com/*",
      "https://quotex.io/*"
    ]
  };

  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'manifest.json';
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  alert(
    "EXTENSION EXPORTED!\n\n" +
    "To install this as an overlay on Pocket Option/Quotex:\n\n" +
    "1. Run 'npm run build' in your project.\n" +
    "2. Move the downloaded 'manifest.json' into your build folder (e.g., 'dist' or 'build').\n" +
    "3. Open Chrome and go to chrome://extensions\n" +
    "4. Enable 'Developer mode' (top right).\n" +
    "5. Click 'Load unpacked' and select your build folder.\n\n" +
    "You can now open the AI Bot in the Chrome Side Panel while trading!"
  );
};
