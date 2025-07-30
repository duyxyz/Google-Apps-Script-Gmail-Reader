## Deployment

To deploy this application, follow these steps within the Google Apps Script environment:

1.  **Create a New Apps Script Project:**
    * Go to [Google Apps Script](https://script.google.com/).
    * Click "New project".
2.  **Paste `code.gs` Content:**
    * If you have a separate `code.gs` file (containing the functions for interacting with the Gmail API and PIN validation), paste its content into the default code editor (usually `Code.gs`).
3.  **Create `index.htm` File:**
    * In your Apps Script project, go to **File** > **New** > **HTML file**.
    * Name the file `index.htm`.
    * Paste the entire content of your `index.htm` file into this new file.
4.  **Set Up Gmail Access Permissions:**
    * In your `code.gs` file, you'll find functions like `getAllEmailsWithHtml`, `getAllSpamEmailsWithHtml`, and `markAsRead`. These functions require access to your Gmail.
    * Run one of these functions for the first time (e.g., select `getAllEmailsWithHtml` from the functions menu and click the "Run" button). You will be prompted to review and grant the necessary permissions.
5.  **Deploy as a Web App:**
    * In your Apps Script project, go to **Deploy** > **New deployment**.
    * Select the type as **Web app**.
    * Configure the following options:
        * **Execute as:** Choose "Me" (your email address). This means the application will run with your Google account's permissions when accessed.
        * **Who has access:**
            * If you want only yourself to use it, select "Only myself".
            * If you want to share it with specific Google accounts within your organization, select "Anyone in [Your Organization Name]".
            * If you want anyone with the link to access it (suitable for testing or personal use), select "Anyone".
    * Click **Deploy**.
    * Apps Script will provide you with a **Web app URL**. This is the address you will visit to use your application.

After deployment, you can access the application using the provided URL. Whenever you make changes to the code in Apps Script, you will need to create a **new deployment** or go to **Manage deployments** and **edit** the existing one to update the version.
