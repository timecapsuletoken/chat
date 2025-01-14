
# **TimeCapsule Chat 📜💬** dApp
![Logo](https://i.imgur.com/zyat7Pl.png)

## Overview 📝

This project is a fully **decentralized** application (dApp) built with **React**, leveraging blockchain technology and decentralized data storage to enable **real-time messaging**, **wallet-based authentication**, and **secure communication**. The application integrates cutting-edge tools like **Gun.js** for decentralized storage, **ethers.js** for blockchain interaction, and **React** for a seamless and responsive user interface.
<p align="center">
  <a href="https://timecapsule.chat">
    <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/http.png" width="50px"/>
  </a>
  <a href="https://x.com/TCACoin">
    <img src="https://skillicons.dev/icons?i=twitter" />
  </a>
  <a href="https://instagram.com/tcacoin">
    <img src="https://skillicons.dev/icons?i=instagram" />
  </a>
  <a href="https://discord.gg/wBkDaDvEgv">
    <img src="https://skillicons.dev/icons?i=discord" />
  </a>
</p>

## Build with 🛠️

<p align="center">
   <img src="https://skillicons.dev/icons?i=nodejs" />
   <img src="https://skillicons.dev/icons?i=react" />
   <img src="https://skillicons.dev/icons?i=javascript" />
   <img src="https://i.imgur.com/9y3d5l3.png" width="50px" />
   <img src="https://skillicons.dev/icons?i=materialui" />
</p>

## Wallet Integration 💳

<p align="left">
   <img src="https://i.imgur.com/AtQJnLE.png" width="50px" />
   <img src="https://i.imgur.com/c75Krxq.png" width="50px" />
</p>

- **MetaMask** and **Coinbase Wallet** support for secure user authentication.
- Automatic wallet detection and connection.
- Responsive wallet login for both mobile and desktop environments.

## Real-Time Messaging 💬

- **Gun.js** powers a real-time, decentralized chat system.
- **End-to-end** encryption of messages using **custom cryptographic** utilities.
- Persistent chat storage for secure and reliable communication.

## Cryptography Utilities (`cryptographer.js`) 🔐

#### Key Features: ✨

- **Encryption to Binary**:
  - Converts plain text to a binary string using `AES` encryption.
  - Uses dynamic salt, `IV` (**Initialization Vector**), and `HMAC` (**Hash-based Message Authentication Code**) for enhanced security.
  - Implements `PBKDF2` for secure **key derivation**.

- **Decryption from Binary**:
  - Converts an encrypted `binary` string back to plain text.
  - Verifies data integrity through `HMAC` validation before decryption.
  - Deciphers the binary payload using `AES` and the `derived key`.

- **Message Encryption and Decryption**:
  - High-level methods (`encryptMessage` and `decryptMessage`) abstract the binary **encryption**/**decryption** process for use in the application.

#### How It Works: 🔍

1. **Encryption**:
   - A secret key is retrieved from environment variables.
   - **Salt** and **IV** are dynamically generated.
   - The plain text is encrypted using `AES` with the `derived key` and `IV`.
   - The encrypted payload includes `salt`, `IV`, `ciphertext`, and `HMAC` for **integrity**.

2. **Decryption**:
   - Converts the binary payload back to its original form.
   - Validates `HMAC` to ensure the data has not been tampered with.
   - Decrypts the `ciphertext` using `AES` and the derived key.

#### Use Cases: 🎯
- Ensures secure communication by encrypting and decrypting chat messages in `real-time`.
- Protects against **data manipulation** with `HMAC` validation.

## Input Sanitization 🛡️

- Removes `<script>` tags from the input to prevent script injection attacks.
- Removes angle brackets (`<, >`) to prevent `HTML` or **tag injection**.
- Restricts the input to a specific set of **allowed characters** defined by a regular expression.
- Enforces a maximum input length (`maxLength`) by **truncating** longer inputs.

## Configuring dApp Preferences ⚙️

- **Purpose**: Provides users with an interface to configure personal settings for the decentralized application (dApp).
- **Features**:
  - **Dashboard Settings**:
    - **Auto-Lock Screen**: 
      - Enables automatic screen locking after 30 minutes of inactivity.
      - Unlocking requires a unique PIN generated using the user's wallet address.
    - **Sound Alerts**:
      - Enables audio notifications for events like incoming messages.
      - Works on both desktop and mobile browsers.
    - **Desktop Notifications**:
      - Activates browser-based notifications for new messages or events.
  - **Privacy Settings**:
    - Provides a button to manage blocked Ethereum wallet addresses via a dedicated modal.
- **Event Handling**:
  - All settings changes trigger corresponding handlers (`handleToggleautoLockEnabled`, `handleToggleSoundAlerts`, etc.).
  - Clicking outside the modal closes it, ensuring a seamless user experience.

## Audio Notification and Browser Notification Hooks 🔔

### `src/hooks/useAudioNotification.js`
### Purpose 🎯
- Provides audio feedback for important events within the application.

### Key Features ✨
- **Audio Context Initialization**:
  - Creates an `AudioContext` for sound playback.
  - Loads and decodes a notification sound (`notification.mp3`) from the assets directory.
- **Playback Functionality**:
  - Plays the preloaded sound using `AudioContext`.
  - Handles errors for missing or uninitialized audio resources.

### How It Works: 🔍
- **`initializeAudio()`**: Initializes the audio context and decodes the sound for future playback.
- **`playNotificationSound()`**: Plays the loaded sound if the audio context and sound are properly initialized.

### `src/hooks/useBrowserNotification.js`
### Purpose 🎯
- Manages browser-based notifications to alert users of key events, especially when the application is in the background.

### Key Features ✨
- **Permission Handling**:
  - Requests and manages notification permissions from the user.
  - Logs permission statuses for better debugging.
- **Notification Display**:
  - Displays notifications when the application is not visible (i.e., tab is not active).
  - Handles notification click events to focus the application.
- **Use of Visibility State**:
  - Prevents notifications from appearing when the application is actively in use.

### How It Works: 🔍
- **`checkNotificationPermission()`**: Checks and requests permission for notifications.
- **`showNotification(title, options)`**: Displays notifications with a title and additional options, ensuring they only appear when the app is inactive.

## Auto-Lock Mechanism 🔒

This logic ensures robust and seamless session management for a secure and user-friendly application, located in `src/utils/LockedScreen.js`

- **Timeout-Based Locking**: Automatically locks the screen after `30 minutes` of inactivity.
- **Timestamp Tracking**: Saves the last user interaction timestamp in `localStorage`.
- **Event-Based Reset**: Resets the timeout on user activity:
  - Mouse movement
  - Key presses
  - Clicks
- **Real-Time Countdown**: Checks elapsed time since the last interaction to determine the remaining lock time.
- **Responsive Locking**: Triggers a screen lock when the timeout expires, ensuring user sessions are secure.
- **Event Listener Management**: Dynamically adds and removes event listeners for efficient resource usage.

## Block Address Functionality 🚫

Located in `src/components/HomePage/Modals/BlockedModal.js`

- `BlockedModal.js`: A user interface for managing blocked addresses in the dApp.
  - Displays a list of blocked Ethereum addresses.
  - Allows users to:
    - Unblock addresses via a dedicated button.
    - Block new addresses by entering a valid Ethereum address.
  - Users can't send or receive a message if One of the parties has blocked the other. 
  - Utilizes `ethers.js` to validate Ethereum addresses.
  - Provides visual feedback with `Snackbar` for user actions and errors.
  - Supports a virtualized list with `react-window` for efficient rendering of large lists.
  - Includes input sanitization to ensure only valid data is processed.

## Responsive Design 📱

- Built with Material UI for consistent and adaptive UI components.
- Fully functional on mobile and desktop devices.

## Tech Stack 🖥️

- **Frontend**: React, Material UI
- **Blockchain Integration**: ethers.js, Gun.js
- **Utilities**: Notistack (Snackbar notifications)
- **Design Tools**: Jazzicon for avatar generation

## Installation⚡

Follow these steps to set up the project locally:

### Prerequisites ✅

- Node.js (>=14.x)
- npm or yarn

### Steps 🪜

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file at the root of the project and configure the following variables:

   ```env
   HOST=0.0.0.0
   PORT=3000
   NODE_ENV=production
   GENERATE_SOURCEMAP=false
   REACT_APP_BASE_DOMAIN=<your-domain>
   REACT_APP_BASE_METATAG_IMAGE=<Logo-URL>
   REACT_APP_GUN_PEER=<gun-peer-url>
   REACT_APP_SECRET_KEY=<a-Random-Key-Of-Your-Choice>
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open the application in your browser at `http://localhost:3000`.

## Folder Structure 🗂️

```
src/
|-- assets/              # Static assets (images, CSS)
|-- components/          # Reusable React components
|-- hooks/               # User Settings and Articles logic  
|-- pages/               # Application pages
|-- utils/               # Helper functions
|-- App.js               # Main application entry point
|-- index.js             # ReactDOM render file
```

### Key Files 🗃️

- **`src/App.js`**: serves as the main entry point for the React application.
- **`src/utils/wallet.js`**: Handles wallet connection logic.
- **`src/utils/cryptographer.js`**: Encrypts and decrypts messages.
- **`src/components/Snackbar.js`**: Displays notifications.
- **`src/pages/ChatPage.js`**: Core messaging page for messages.
- **`src/pages/LoginPage.js`**: Wallet authentication page.

## Usage 🧑‍💻

1. Navigate to the `/login` page
2. Connect your wallet using MetaMask or Coinbase.
3. Start chatting securely with `Ethereum Addresses`

## Contribution Guidelines 🤝

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push your branch and create a pull request.

## Acknowledgments 🙌

- [Gun.js](https://gun.eco/docs/) for decentralized data storage.
- [ethers.js](https://docs.ethers.io/) for seamless blockchain integration.
- [Material UI](https://mui.com/) for consistent and responsive UI components.

## Live Preview 🌐

<p>
   <img src="https://i.imgur.com/P94IvPo.gif" width="100%">
</p>

## Contact  📞

For issues or support, feel free to contact the repository owner or open a GitHub issue.

---

Thank you for using our decentralized application!

---

## **License** 📄

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

This project is licensed under the **MIT License**. Feel free to use and distribute as you like. 📜 

---