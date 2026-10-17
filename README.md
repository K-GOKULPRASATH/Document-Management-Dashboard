# Document Management Dashboard

A document upload and notification application developed as a task assigned during an SWS AI interview round. This repository demonstrates a backend workflow for receiving PDF files, storing document metadata, and broadcasting progress events.

## Scope

- Accept a single PDF or multiple PDFs through API routes.
- Validate file type and apply upload-count and size limits.
- Save uploaded files to local storage in the current implementation.
- Persist document metadata and notification records in PostgreSQL.
- Emit Socket.IO events for upload progress, completion, and errors.
- Expose a notification endpoint for clients.

## Technology

- Node.js and Express
- Multer for multipart uploads and file filtering
- PostgreSQL using the `pg` client
- Socket.IO for real-time events
- React and Vite frontend scaffold

Prisma packages are listed in the existing documentation as installed but not used by the current raw-`pg` implementation.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Basic health response |
| POST | `/api/upload/single` | Upload one PDF in the `file` field |
| POST | `/api/upload/multiple` | Upload PDFs in the `files` field |
| GET | `/api/notifications` | Retrieve notifications |

Check route code for the current request and response schema before using these endpoints.

## Upload flow

1. The client submits multipart form data.
2. Upload middleware validates the file and applies configured limits.
3. The controller calls the upload service.
4. The service writes metadata to PostgreSQL.
5. Socket.IO emits progress/completion events.
6. The API returns a response to the client.

## Current limitations

- The frontend is documented as a Vite/React scaffold and may need additional dashboard work.
- Files are stored locally; this is not durable object storage for a multi-instance production deployment.
- Authentication, authorization, malware scanning, and durable storage should be reviewed before handling sensitive documents.
- Environment variables must be supplied locally and must not be committed.

## Run and configure

Review the backend and frontend package scripts and configure the required database environment variables from a local, untracked `.env` file. Do not publish real database credentials.

## Context

This project was built for an SWS AI interview assignment. The portfolio should present it as an interview task/prototype, not as a production system unless additional verification supports that claim.

## Repository

https://github.com/K-GOKULPRASATH/Document-Management-Dashboard
