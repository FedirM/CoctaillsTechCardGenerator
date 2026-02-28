Project: Coctail card composer

tech stack: React, TS, Tailwind, Shadcn, BASE64 (for images), Vite, JSON (for storing data), Node.js, Express.

features:
- create a new cocktail card
- edit a cocktail card
- delete a cocktail card
- view a cocktail card

design:
----------------------------------
[LOGO]        [BTN-Export to PDF]
----------------------------------
[dnd-btn] [IMG-with-upload-icon] [FORM]
----------------------------------

[FORM]:
----------------------------------
[NAME-input field]               [Edit-icon] [Delete-icon]
[GLASS-select field] [DECORATION-input field]
[DESCRIPTION-input field (textarea with simple editor)]
----------------------------------

[GLASS-select field] variants:
- Hightball
- Rocks
- Coupe
- Nick and Nora


## API
GET /cocktails - get all cocktails
POST /cocktails - create a new cocktail
PUT /cocktails/:id - update a cocktail
DELETE /cocktails/:id - delete a cocktail

## Database
Simple JSON file in the root directory of the project.
Array of objects with the following structure:
{
    id: number;
    name: string;
    image: string (base64 string);
    glass: string;
    decoration: string;
    description: string;
}

## Main workflow
1. User opens the app.
2. User sees the list of cocktails. In desc order by id.
3. User clicks on the "Create new cocktail" button. It should be positioned fixed top right corner of the screen. Add new coctail card form at the top of the screen.
4. User fills in the form and each change trigger save to the database.
6. User can edit the cocktail by clicking on the "Edit" icon.
7. User can delete the cocktail by clicking on the "Delete" icon.
8. User can export the list of cocktails to a PDF file by clicking on the "Export to PDF" button. ONLY CARDS WITH COCTAILS SHOULD BE EXPORTED. 
9. Each card should take 1/2 of the A4 page.