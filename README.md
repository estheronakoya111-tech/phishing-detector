# Phishing Detector — Frontend

A responsive Next.js frontend for a phishing detection web application.

The application allows users to submit suspicious messages for analysis and presents the results in a clear, human-readable security dashboard.

The frontend communicates with a separate **Python FastAPI backend**, which performs the actual message analysis, URL analysis, risk assessment, and threat-intelligence checks.

> **Note:** The frontend is an interface for the security analysis service. It does not independently determine whether a message or URL is safe.

## Problem

People receive suspicious messages containing **phishing links, urgent requests, account threats, payment requests, or credential requests**, but many users cannot easily tell whether a message is legitimate or dangerous.

Existing security tools can also be difficult for ordinary users to understand because they may expose technical security information without clearly explaining **what makes the message suspicious or what the user should do next**.

**Phishing Detector** addresses this problem by allowing users to paste a suspicious message and receive a simple, explainable assessment of:

* Suspicious language in the message
* Requests for passwords, OTPs, PINs, or payment information
* Suspicious URLs and URL structures
* Known threats identified through threat intelligence
* An overall **Low, Moderate, or High** risk level
* A clear recommendation about what to do next

The goal is **not to guarantee that a message is safe**, but to help ordinary users recognize common phishing indicators before they click a link or provide sensitive information.

## Features

* Submit suspicious messages for analysis.
* Support messages containing URLs.
* Character counter with a 10,000-character limit.
* Loading state while analysis is in progress.
* Clear Low, Moderate, and High risk results.
* Display detected security indicators.
* Display URL analysis results.
* Display threat-intelligence results returned by the backend.
* Display security recommendations.
* Error handling for failed analysis requests.
* Responsive interface for desktop and mobile devices.
* Backend URL configured through an environment variable.

## How It Works

```text
User
 │
 │ Pastes suspicious message
 ▼
Next.js Frontend
 │
 │ POST /analyze
 ▼
FastAPI Backend
 │
 ├── Message Analysis
 ├── URL Extraction
 ├── URL Analysis
 ├── Google Safe Browsing
 └── Risk Assessment
 │
 ▼
JSON Response
 │
 ▼
Next.js Frontend
 │
 ├── Risk Level
 ├── Findings
 ├── URL Results
 └── Recommendation
```

## Backend Connection

The frontend sends the submitted message to the backend using:

```text
POST /analyze
```

Request body:

```json
{
  "message": "Your submitted message goes here"
}
```

The backend returns a response containing:

```json
{
  "risk_level": "High",
  "findings": [],
  "urls": [],
  "recommendation": "..."
}
```

The frontend uses these fields to populate the results dashboard.

## Environment Variables

Create a `.env.local` file in the project root.

### Local Development

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

The `NEXT_PUBLIC_` prefix is required because the browser needs access to the backend URL.

### Production

When the backend is deployed, replace the local address with the deployed FastAPI URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

Do **not** put the Google Safe Browsing API key in the frontend environment variables.

The Google API key belongs only in the backend environment.

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Move into the project:

```bash
cd phishing-detector-frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Running Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The FastAPI backend must also be running locally:

```bash
uvicorn main:app --reload
```

The frontend will then communicate with:

```text
http://127.0.0.1:8000/analyze
```

## Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```text
phishing-detector-frontend/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The exact structure may change as the application develops.

## Technologies

* Next.js
* React
* TypeScript
* Tailwind CSS
* FastAPI backend
* REST API

## API Response Usage

The frontend receives the backend response and maps each field to the appropriate part of the interface.

```text
risk_level
     ↓
Risk assessment display

findings
     ↓
Security findings section

urls
     ↓
URL analysis section

recommendation
     ↓
Security recommendation
```

The frontend does not calculate the risk level itself. It displays the assessment returned by the backend.

## Error Handling

The frontend handles situations such as:

* Backend unavailable
* Failed network request
* Invalid server response
* Server errors
* Rate-limit responses
* Empty or invalid submissions

Users are shown a clear message instead of an unexplained application failure.

## Security Considerations

* Backend API keys are not stored in the frontend.
* `.env.local` should not be committed when it contains local or private configuration.
* The frontend relies on the backend for security analysis.
* A "Low" result does not guarantee that a message or URL is safe.
* Users should verify important requests through trusted channels.

## Current Limitations

The frontend currently depends on the FastAPI backend for:

* Message analysis
* URL extraction
* URL analysis
* Threat intelligence
* Risk assessment
* Recommendations

The application does not currently use AI-based analysis.

AI-assisted analysis may be considered as a future backend improvement.

## Future Improvements

Possible future improvements include:

* Richer explanations for individual findings
* Highlighting suspicious phrases inside submitted messages
* More detailed URL intelligence
* Additional threat-intelligence sources
* AI-assisted analysis
* Improved accessibility
* Additional frontend testing
* Production monitoring and performance improvements

## Disclaimer

This application is intended for educational and defensive security purposes.

Automated analysis can identify suspicious indicators, but it cannot guarantee that a message or URL is completely safe or malicious.
