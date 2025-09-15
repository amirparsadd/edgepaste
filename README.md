```markdown
# EdgePaste

EdgePaste is a simple and lightweight pastebin application built on the [Hono](https://hono.dev/) framework. It allows users to create, retrieve, and delete text-based pastes easily via a web interface or API. The project is designed to work with an S3-compatible storage backend for persistence. EdgePaste is built for edge runtimes.

## Features

- **Web Interface**: Create and view pastes through a simple and responsive frontend.
- **REST API**: Programmatically interact with the application to create, retrieve, and delete pastes.
- **Admin Key**: Securely delete pastes using a unique admin key.
- **S3 Integration**: Store pastes in an S3-compatible storage backend.
- **CORS Support**: Cross-Origin Resource Sharing enabled for API access.
- **Logging**: Built-in logging for debugging and monitoring.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [License](#license)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/amirparsadd/edgepaste.git
   cd edgepaste
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables (see [Environment Variables](#environment-variables)).

4. Start the development server:

   ```bash
   npm run dev
   ```

---

## Usage

### Web Interface

- Navigate to the root URL of the application.
- Create a new paste by entering text and clicking "Create".
- Copy the generated link to share the paste with others.
- Use the admin key displayed to delete the paste if needed.

---

### API Endpoints

#### Create a Paste

- **Endpoint**: `POST /api/paste`
- **Request Body**:
  ```json
  {
    "contents": "Your paste content here"
  }
  ```
- **Response**:
  ```json
  {
    "key": "pasteKey",
    "adminKey": "adminKey"
  }
  ```

#### Retrieve a Paste

- **Endpoint**: `GET /api/paste/:key`
- **Response**:
  ```json
  {
    "result": "Your paste content here"
  }
  ```

#### Delete a Paste

- **Endpoint**: `DELETE /api/paste/:key`
- **Request Body**:
  ```json
  {
    "adminKey": "adminKey"
  }
  ```
- **Response**:
  - Success: `200 OK`
  - Invalid Admin Key: `401 Unauthorized`
  - Paste Not Found: `404 Not Found`

---

### Environment Variables

The application requires the following environment variables to be set up:

| Variable        | Description                          |
|-----------------|--------------------------------------|
| `S3.endpoint`   | The S3-compatible storage endpoint. |
| `S3.bucket`     | The name of your S3 bucket.         |
| `S3.accessKey`  | Your S3 access key.                 |
| `S3.secretKey`  | Your S3 secret key.                 |
| `BASE_URL`      | The base URL of your application.   |

Create a `src/env.ts` file in the project and add these variables.

Example:

```typescript
export const S3 = {
  accessKey: "123",
  secretKey: "123",
  endpoint: "example.com",
  bucket: "bucketname"
}

export const BASE_URL = "http://localhost:3000"
```

---

## Development

### Scripts

- **Build and serve in dev mode**:
  ```bash
  npm run dev
  ```

- **Build for Production**:
  ```bash
  npm run build
  ```

- **Build and deploy to r1ec**:
  ```bash
  npm run deploy
  ```

### Project Structure

- `route/api/`: Contains the API route handlers.
- `route/app/`: Contains the frontend route handlers and JSX components.
- `storage.ts`: Handles S3 storage operations (`get`, `set`, `remove`).
- `utils/`: Utility functions (e.g., key generation).
- `env.ts`: Environment configuration.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements or bug fixes.

---

## Acknowledgments

- [Hono](https://hono.dev/) - A lightweight web framework for the Edge.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.

---

## TODO

- Implement rate-limiting for API endpoints.
- Write tests.
```