---
description: How to obtain and configure a Google Gemini API Key
---
1.  **Go to Google AI Studio**: Open your browser and navigate to [https://aistudio.google.com/](https://aistudio.google.com/).
2.  **Sign In**: Log in with your Google account.
3.  **Get API Key**:
    *   Click on the **"Get API key"** button (usually on the top left or in the sidebar).
    *   Click **"Create API key"**.
    *   You can choose "Create API key in new project".
4.  **Copy the Key**: Copy the generated string (it starts with `AIza...`).
5.  **Configure in Project**:
    *   Create a file named `.env.local` in the root of your project (`C:\Users\Shradaya_Raj\Desktop\Personal website`).
    *   Add the following line to it:
        ```env
        GEMINI_API_KEY=your_copied_api_key_here
        ```
6.  **Restart Server**: Stop the running development server (Ctrl+C in terminal) and start it again (`npm run dev`) for the changes to take effect.
