# Dueflow

A private, browser-first invoice follow-up workspace for freelancers and small teams.

Dueflow helps you see what is outstanding, identify overdue invoices, prepare reminder messages, and keep a lightweight follow-up log without requiring an account, backend, database, email provider, or API key.

## Features

- Add and edit invoices
- Track unpaid, overdue, due-today, upcoming, and paid invoices
- Dashboard totals for outstanding, overdue, due-soon, and paid-this-month invoices
- Search by client, invoice reference, or email
- Filter by invoice status
- Generate editable follow-up messages in three tones
- Copy reminder messages to the clipboard
- Log follow-ups locally
- Import invoices from CSV
- Export invoices to CSV

## Architecture

Dueflow is intentionally a single-file static web app.

| Layer | Implementation |
| --- | --- |
| UI | HTML |
| Styling | CSS |
| Application logic | Vanilla JavaScript |
| Persistence | Browser localStorage |
| Backend | None |
| Database | None |
| Authentication | None |
| External APIs | None |
| API keys | None |
| Analytics | None |
| Build step | None |
| Runtime dependencies | None |

Invoice records are stored locally in the browser under `dueflow.invoices.v1`. Clearing browser storage can remove records, so use CSV export for backups.

Dueflow does **not** send emails or collect payments. It prepares and tracks follow-ups; users review and send messages themselves.

## Run locally

No package installation is required.

Open `index.html` directly in a modern browser, or serve the directory with Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## CSV format

CSV imports use this header format:

```csv
client,invoice,amount,currency,dueDate,status,email
```

Required fields are `client`, `amount`, and `dueDate`.

Use `YYYY-MM-DD` for `dueDate`. Imported rows with `status` equal to `paid` are marked paid; other values are treated as unpaid.

## Repository structure

```text
followupfree/
├── index.html    # Complete Dueflow MVP
├── README.md     # Project documentation
└── LICENSE.md    # MIT License
```

There is deliberately no framework, package manager, or build system in this MVP.

## Project status

This repository contains the Dueflow MVP: a minimal, zero-API-key implementation intended to validate the core invoice follow-up workflow with practically no infrastructure overhead.

## License

Released under the MIT License. See [LICENSE.md](LICENSE.md).