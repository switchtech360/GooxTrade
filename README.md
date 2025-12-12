
# AI Trading Signal Assistant

An advanced AI-powered trading bot UI that leverages Gemini to analyze market data, suggest strategies, and generate real-time trading signals.

## Chrome Extension Installation Guide

This application is designed to be exported as a **Chrome Side Panel Extension**, allowing you to use it as an overlay alongside your broker (Pocket Option, Quotex, etc.) without switching tabs.

### Prerequisites

- Node.js and npm installed on your computer.

### Step-by-Step Installation

1.  **Build the Project**
    Open your terminal in the project root directory and run:
    ```bash
    npm install
    npm run build
    ```
    This command compiles the code and creates a `dist` folder. This folder contains everything needed for the extension (HTML, JS, CSS, and `manifest.json`).

2.  **Open Chrome Extensions Page**
    - Open Google Chrome.
    - Navigate to `chrome://extensions` in the address bar.
    - Enable **Developer mode** by toggling the switch in the top-right corner.

3.  **Load the Extension**
    - Click the **Load unpacked** button (usually in the top-left).
    - Browse to your project directory and select the **`dist`** folder.

4.  **Activate Side Panel**
    - Go to your broker's website (e.g., Pocket Option or Quotex).
    - Click the "Side Panel" icon in the Chrome toolbar (next to your profile icon).
    - Select **AI Trading Signal Assistant** from the dropdown menu.
    - The bot will now appear in the sidebar next to your trading chart.

## Development

To run the app locally in a browser for testing:
```bash
npm run dev
```
