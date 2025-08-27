# Manual Database Setup with MongoDB Compass

This guide provides instructions on how to set up your local MongoDB database and import the seed data manually using MongoDB Compass. This is an alternative to running the `npm run seed` script.

## Step 1: Install MongoDB and MongoDB Compass

If you haven't already, download and install MongoDB Community Server and MongoDB Compass from the official website.

*   [MongoDB Community Server Download](https://www.mongodb.com/try/download/community)
*   [MongoDB Compass Download](https://www.mongodb.com/try/download/compass)

Follow the installation instructions for your operating system.

## Step 2: Connect to Your Local Database

1.  Open MongoDB Compass.
2.  On the welcome screen, you will see a connection form. The default connection string `mongodb://localhost:27017` should already be filled in.
3.  Click the **"Connect"** button. You should now be connected to your local MongoDB instance.

## Step 3: Create the `lchat` Database

1.  In the left-hand navigation panel, you will see a list of databases. Click the **"Create database"** button (it may appear as a `+` icon next to the "Databases" header).
2.  A dialog box will appear.
    *   In the "Database Name" field, enter `lchat`.
    *   In the "Collection Name" field, enter `users`. This will create the first collection.
3.  Click the **"Create Database"** button.
4.  You will now see `lchat` in your list of databases. Click on it to select it.

## Step 4: Import Seed Data

Now we will import the JSON data from the `backend/data/` directory into their respective collections.

### Create and Import `users`

1.  The `users` collection should already exist from the previous step. If not, click **"Create Collection"** within the `lchat` database view and name it `users`.
2.  Select the `users` collection from the left panel.
3.  Click the **"Add Data"** button and select **"Import JSON or CSV file"** from the dropdown.
4.  A file dialog will open. Navigate to the `lchat/backend/data/` directory and select the `users.json` file.
5.  Click the **"Import"** button. You should see the user documents appear in the collection view.

### Create and Import `slang`

1.  Within the `lchat` database view, click the `+` button next to the collections list or the "Create Collection" button.
2.  Enter `slangs` as the collection name and click **"Create Collection"**. (Note: Mongoose pluralizes model names, so `Slang` becomes `slangs`).
3.  Select the new `slangs` collection.
4.  Click **"Add Data"** -> **"Import JSON or CSV file"**.
5.  Select the `slang.json` file from `lchat/backend/data/`.
6.  Click **"Import"**.

### Create and Import `shortforms`

1.  Follow the same process to create a new collection named `shortforms`.
2.  Select the `shortforms` collection.
3.  Click **"Add Data"** -> **"Import JSON or CSV file"**.
4.  Select the `shortforms.json` file from `lchat/backend/data/`.
5.  Click **"Import"**.

---

Your database is now manually seeded and ready for the application to use. You can proceed with running the backend and frontend servers.
