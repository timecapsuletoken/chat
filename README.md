
# **TimeCapsule Chat 📜💬** React Decentralized Application (dApp)

## Overview

This project is a fully decentralized application (dApp) built with React, leveraging blockchain technology and decentralized data storage to enable real-time messaging, wallet-based authentication, and secure communication. The application integrates cutting-edge tools like **Gun.js** for decentralized storage, **ethers.js** for blockchain interaction, and React for a seamless and responsive user interface.

---

## Features

### Wallet Integration

- **MetaMask** and **Coinbase Wallet** support for secure user authentication.
- Automatic wallet detection and connection.
- Responsive wallet login for both mobile and desktop environments.

### Real-Time Messaging

- **Gun.js** powers a real-time, decentralized chat system.
- End-to-end encryption of messages using custom cryptographic utilities.
- Persistent chat storage for secure and reliable communication.

### Input Sanitization

- Protects against malicious inputs with comprehensive sanitization logic.
- Ensures a secure and safe user experience.

### Responsive Design

- Built with Material UI for consistent and adaptive UI components.
- Fully functional on mobile and desktop devices.

---

## Tech Stack

- **Frontend**: React, Material UI
- **Blockchain Integration**: ethers.js, Gun.js
- **Utilities**: Notistack (Snackbar notifications), cryptographic utilities
- **Design Tools**: Jazzicon for avatar generation

---

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (>=14.x)
- npm or yarn

### Steps

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

---

## Folder Structure

```
src/
|-- assets/              # Static assets (images, CSS)
|-- components/          # Reusable React components
|-- hooks/               # User Settings and Articles logic (useArtiles, useAudioNotification,useBrowserNotification)  
|-- pages/               # Application pages (e.g., HomePage, ChatPage, LoginPage)
|-- utils/               # Helper functions (e.g., cryptographer, inputSanitizer, gunHelpers)
|-- App.js               # Main application entry point
|-- index.js             # ReactDOM render file
```

### Key Files

- **`src/utils/wallet.js`**: Handles wallet connection logic.
- **`src/utils/cryptographer.js`**: Encrypts and decrypts chat messages.
- **`src/components/Snackbar.js`**: Displays notifications for user actions.
- **`src/pages/ChatPage.js`**: Core messaging page with lazy-loading logic for messages.
- **`src/pages/LoginPage.js`**: Wallet authentication page.

---

## Usage

1. Navigate to the login page.
2. Connect your wallet using MetaMask or Coinbase.
3. Start chatting securely with your contacts.

---

## Contribution Guidelines

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

---

## Acknowledgments

- [Gun.js](https://gun.eco/docs/) for decentralized data storage.
- [ethers.js](https://docs.ethers.io/) for seamless blockchain integration.
- [Material UI](https://mui.com/) for consistent and responsive UI components.

---

## Screenshots

*Add screenshots or links to your hosted demo here.*

---

## Contact

For issues or support, feel free to contact the repository owner or open a GitHub issue.

---

Thank you for using our decentralized application!

---

## **License** 📄

This project is licensed under the **MIT License**. Feel free to use and distribute as you like. 📜

---