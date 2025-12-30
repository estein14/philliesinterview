### MLB Qualifying Offer Calculator

This application fetches the latest MLB salary data from the provided dataset URL and
calculates the upcoming **qualifying offer**: the average of the **125 highest salaries**
from the previous season. It also displays a short summary of the dataset and the
top salaries used in the calculation.

The data is pulled **fresh on each page load**, and rows with malformed or missing
salary values are safely ignored so they do not affect the result.

### Prerequisites

-   **Node.js** 18 or newer (Node 20+ recommended)
-   **npm** (comes bundled with Node)

You can check your versions with:

```bash
node --version
npm --version
```

### 1. Install dependencies

From the project root:

```bash
npm install
```

This will install Next.js, React and the `cheerio` HTML parsing library used on the
server to read the salary table from the remote dataset.

### 2. Configure environment variables

Create a `.env.local` file in the project root with the dataset URL:

```bash
MLB_SALARIES_URL=https://questionnaire-148920.appspot.com/swe/data.html
```

This value is read by `lib/qualifyingOffer.ts` via `process.env.MLB_SALARIES_URL` on the server.

### 3. Run the development server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

Each time you refresh the page:

-   The app fetches `https://questionnaire-148920.appspot.com/swe/data.html`
-   It parses the salary table using `cheerio`
-   It filters out malformed/missing/zero salary values
-   It sorts salaries descending, takes the top 125, and computes their average
-   The qualifying offer and supporting information are rendered

### 4. Production build (optional)

To create an optimized production build:

```bash
npm run build
npm start
```

Then visit `http://localhost:3000` as above.

### Implementation notes

-   **Framework**: [Next.js](https://nextjs.org/) (App Router) with React and TypeScript.
-   **Data source**: `https://questionnaire-148920.appspot.com/swe/data.html` (fetched on the server with `fetch`).
-   **HTML parsing**: [Cheerio](https://cheerio.js.org/) is used in `app/page.tsx` to traverse the salary table.
-   **Error handling**:
    -   Network failures and non-2xx responses surface a clear error message to the user.
    -   Rows with non-numeric, zero, or missing salary values are ignored instead of causing the calculation to fail.
    -   If no valid salary rows are present, the page shows `N/A` instead of crashing.
-   **Presentation**:
    -   Main card with the calculated qualifying offer.
    -   Dataset summary (total rows, valid rows, ignored rows, and number of salaries used).
    -   Table of the **top 10 salaries** contributing to the qualifying offer.

### Cited resources

-   MDN Fetch API reference (server-side `fetch` usage): `https://developer.mozilla.org/en-US/docs/Web/API/fetch`
-   Cheerio documentation (server-side HTML parsing): `https://cheerio.js.org/`
