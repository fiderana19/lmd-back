# 💻 LMD (backend)

LMD (backend) is a ExpressJS application designed to manage and store data about marks and universitary result following the LMD cycle.
It's developped for MySQL as database management system.

-----

## ✨ Features

The app incorporates features for better performance, such as:

  * Data verification.
  * Authorization.

-----

## 🚧 Status

The application is still in progress for a better source code, new features, and updates.

-----

## Getting Started

### Prerequisites

* Node.js
* npm or yarn
* MySQL server

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```
2.  Install the required modules. Be sure to execute the following command for modules installation:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn
    ```

### Running the MySQL Server

Don't forget to run the MySQL server.

### Running the App

Run the application with the following command:
```bash
npm run dev
```

-----

## The features

There's a few screenshoot to show the app's features.

* **🔒 Data verification**
The data passed with the request will be verified in the database, incorrect data will be handled. 

<p align="center">
<img src="https://github.com/fiderana19/lmd-back/blob/feat/readme/src/assets/readme/verification.png?raw=true" alt="Data Verification" width="800"/>
</p>

* **🔒 Authorization**
In case the user is not logged in, no access will be allowed.

<p align="center">
<img src="https://github.com/fiderana19/lmd-back/blob/feat/readme/src/assets/readme/unauthorized.png?raw=true" alt="Unauthorized" width="800"/>
</p>

As the application have a logged in user, only a logged in user will have the authorization for data security.

<p align="center">
<img src="https://github.com/fiderana19/lmd-back/blob/feat/readme/src/assets/readme/authorized.png?raw=true" alt="Authorized" width="800"/>
</p>

-----

## ⭐️ Star

Don't hesitate to give a star, it will gives me a motivation for my projects and my progress.