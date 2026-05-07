# Document Management Dashboard

This project is a document upload and notification system with a Node.js backend, PostgreSQL database, real-time Socket.IO updates, and a React frontend scaffold.

The current codebase is split into two parts:

- `backend/` handles file uploads, database writes, notifications, and real-time events.
- `frontend/` is a Vite + React starter app and is ready to be extended into a full dashboard UI.

## How It Works

1. A client sends a PDF file to the backend.
2. `multer` saves the file into the local `uploads/` folder.
3. The backend stores file metadata in PostgreSQL.
4. Socket.IO broadcasts real-time events such as upload progress, upload completion, and errors.
5. Notifications can be read from the `notifications` table through the API.

## Project Structure

### Backend

- `src/server.js` starts the HTTP server, connects PostgreSQL, creates tables, and initializes Socket.IO.
- `src/app.js` configures the Express app and registers routes and middleware.
- `src/config/db.js` creates the PostgreSQL connection pool.
- `src/routes/uploadRoutes.js` exposes upload endpoints.
- `src/routes/notificationRoutes.js` exposes notification endpoints.
- `src/controllers/uploadController.js` validates upload requests and calls the upload service.
- `src/controllers/notificationController.js` returns notifications from the database.
- `src/services/uploadService.js` inserts uploaded file details into PostgreSQL and emits Socket.IO events.
- `src/services/notificationService.js` reads notification records from PostgreSQL.
- `src/sockets/socket.js` creates and stores the Socket.IO instance.
- `src/middleware/uploadMiddleware.js` configures Multer storage, file filtering, and upload limits.
- `src/middleware/errorMiddleware.js` formats server errors as JSON responses.
- `src/models/documentModel.js` creates the `documents` table if it does not exist.
- `src/models/notificationModel.js` creates the `notifications` table if it does not exist.

### Frontend

- `src/main.jsx` mounts the React app.
- `src/App.jsx` is the current UI entry component.
- `src/App.css` and `src/index.css` contain the current Vite starter styles.

## Libraries Used

### Backend dependencies

- `express` - HTTP server and routing.
- `cors` - allows cross-origin requests from the frontend.
- `dotenv` - loads environment variables from `.env`.
- `multer` - handles multipart file uploads.
- `pg` - PostgreSQL client used for database queries.
- `socket.io` - real-time communication between server and clients.
- `nodemon` - restarts the backend automatically during development.

### Installed but not currently used in the backend code

- `prisma`
- `@prisma/client`

The current backend uses raw `pg` queries instead of Prisma query methods.

### Frontend dependencies

- `react` - UI library.
- `react-dom` - renders React into the browser DOM.
- `vite` - frontend dev server and build tool.
- `eslint` and related plugins - code quality and linting.

## Backend Workflow

### Server startup

`src/server.js` does the following:

1. Loads environment variables with `dotenv`.
2. Creates the HTTP server from the Express app.
3. Initializes Socket.IO on that server.
4. Connects to PostgreSQL.
5. Ensures the `documents` and `notifications` tables exist.
6. Starts listening on `PORT`.

### Upload flow

The backend accepts only PDF files. The upload middleware saves files into the local `uploads/` folder, limits each file to 10 MB, and allows up to 10 files per request.

#### Single file upload: step by step

Use this endpoint when you want to upload one PDF only.

1. The client sends a `POST` request to `/api/upload/single`.
2. The request must use `multipart/form-data`.
3. The file must be sent in a form field named `file`.
4. `singleUpload` in `uploadMiddleware.js` receives the request and checks that the file is a PDF.
5. `multer` stores the file in the `uploads/` folder with a unique generated filename.
6. `uploadSingleFile` in `uploadController.js` checks that `req.file` exists.
7. The controller calls `singleFileUploadService(file)`.
8. The service inserts the file details into the `documents` table.
9. The service emits the `singleUploadCompleted` Socket.IO event.
10. The controller returns a JSON success response to the client.

If `await` is removed from the database call, the server may respond before the insert finishes. If `emit` is removed, the frontend will not receive the real-time completion event. If `throw` is removed inside the service error handler, the controller may not know that the upload failed.

#### Multiple file upload: step by step

Use this endpoint when you want to upload several PDF files at once.

1. The client sends a `POST` request to `/api/upload/multiple`.
2. The request must use `multipart/form-data`.
3. The files must be sent in a form field named `files`.
4. `multipleUpload` in `uploadMiddleware.js` receives the request and validates every file.
5. `multer` stores each file in the `uploads/` folder with a unique generated filename.
6. `uploadMultipleFiles` in `uploadController.js` checks that `req.files` exists and is not empty.
7. The controller calls `multipleFileUploadService(req.files)`.
8. The service loops through each file one by one.
9. Each file is inserted into the `documents` table.
10. After each insert, the service emits `uploadProgress` so the frontend can show progress like `1/3`, `2/3`, `3/3`.
11. After all files finish, the service emits `uploadCompleted`.
12. The controller returns a JSON success response with all uploaded rows.

If `await` is removed in the loop, the files may be processed out of order and the progress count can become unreliable. If `emit` is removed, the frontend will not know which file finished or how many are done. If `throw` is removed when an insert fails, the loop may hide the failure and the API can return an incorrect success state.

### Quick route summary

- `POST /api/upload/single` uploads one PDF from the `file` field.
- `POST /api/upload/multiple` uploads up to 10 PDFs from the `files` field.

### Notification flow

- Route: `GET /api/notifications`
- Controller: `getNotifications`
- Service: `getNotificationsService`

This returns all notifications ordered by newest first.

## Real-Time Events

Socket.IO is used to push upload status updates to connected clients.

### Events emitted by the backend

- `singleUploadCompleted` - sent after a single upload succeeds.
- `uploadProgress` - sent during multi-file uploads after each file is saved.
- `uploadCompleted` - sent after all files finish uploading.
- `uploadError` - sent when an upload fails.

### Why this matters

Without Socket.IO `emit`, the frontend would only know about upload results after it polls the server or refreshes the page. With Socket.IO, the UI can update instantly.

## Environment Variables

The backend expects these values in `.env`:

- `PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`

## API Endpoints

### Health check

- `GET /`

Returns:

```json
{
  "success": true,
  "message": "Server Running"
}
```

### Upload a single PDF

- `POST /api/upload/single`
- Form field name: `file`

### Upload multiple PDFs

- `POST /api/upload/multiple`
- Form field name: `files`

### Get notifications

- `GET /api/notifications`

## Key Concepts Explained

### `async` and `await`

`async` marks a function as asynchronous. `await` pauses inside that function until a promise finishes.

Why it is used here:

- Database queries take time.
- File handling and network operations are asynchronous.
- `await` keeps the code readable and linear.

If you remove `await`:

- The code will not wait for the database query to finish.
- You may send a response before the file is actually saved.
- Errors become harder to handle because later code may run too early.

Example from this project:

```js
const result = await pool.query(query, values);
```

### `emit`

`emit` sends an event to Socket.IO clients.

Why it is used here:

- The backend needs to notify the frontend in real time.
- Upload progress and completion are better as push events than as repeated API calls.

If you do not use `emit`:

- The frontend will not receive live updates.
- Users will not see instant progress or completion messages.
- You would need polling or page refreshes instead.

Example from this project:

```js
io.emit("uploadCompleted", {
  success: true,
  totalUploaded: totalFiles,
});
```

### `throw`

`throw` raises an error so it can be caught by a `catch` block or passed to an error handler.

Why it is used here:

- If the database insert fails, the upload service should stop immediately.
- The controller can then return a proper error response.

If you do not use `throw`:

- The code may continue running with invalid state.
- The controller may return success even though the upload failed.
- Bugs become hidden because the failure is not propagated.

Example from this project:

```js
catch (error) {
  io.emit("uploadError", {
    success: false,
    message: error.message,
  });

  throw error;
}
```

### `try` / `catch`

These are used to capture runtime errors from async operations.

Why they are used here:

- They keep the server from crashing on predictable failures.
- They allow the API to return a JSON error message.

If they are removed:

- Unhandled errors may crash the request flow.
- Clients may get no useful error response.

## Notes About the Current Frontend

The frontend currently contains the default Vite React starter UI. It already has the setup needed to start building dashboard features, but it does not yet include custom document-upload screens, notification panels, or Socket.IO client code.

## Run Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Good Next Steps

1. Build a React upload form that calls `/api/upload/single` and `/api/upload/multiple`.
2. Add a Socket.IO client in the frontend to display upload progress in real time.
3. Replace the starter frontend page with document dashboard components.
