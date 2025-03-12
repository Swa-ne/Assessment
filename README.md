# Next.js Project

## Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

    or

    ```bash
    yarn dev
    ```

## API Integration Details

Since this project focuses solely on UI/UX and does not include an API, all data handling is currently static or mocked within the components. In case of future API integration, it is recommended to:

-   Use **fetch** for API requests.
-   Store API responses in state management solutions(React Context).

Example API call using fetch:

```javascript
import { useEffect, useState } from 'react';

const response = await fetch('/api/form', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
});
```

## Assumptions

1. **All fields are required:** Every input field in forms must be filled before submission.
2. **Service offering page pricing:** Prices are fixed based on the service level and class size tags.
3. **No API development:** The project was specified to focus on UI/UX, so no backend API was implemented.
4. **Frontend validation:** All data validation is already handled on the frontend.
5. **All fields are required:** Every input field in forms must be filled before submission.
6. **Service offering page pricing:** Prices are fixed based on the service level and class size tags.
7. **No API development:** The project was specified to focus on UI/UX, so no backend API was implemented.implemented.
