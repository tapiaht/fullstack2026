# Blog/CMS Transformation Plan

## Goal
Validate the framework's flexibility by transforming the current "Product Catalog" into a "Simple Blog". This involves enhancing the UI to support long text content and re-generating the application structure.

## Proposed Changes

### 1. Framework Enhancements
#### [MODIFY] [entity-form.tsx](file:///media/hitdev/DatosLinux/FaztApp/generic-app/src/components/core/entity-form.tsx)
-   Add support for `field.type === 'text'`.
-   Render a `<Textarea>` component instead of `<Input>` for these fields.
-   Ensure `<Textarea>` allows resizing and proper styling.

### 2. Domain Configuration
#### [MODIFY] [domain.config.ts](file:///media/hitdev/DatosLinux/FaztApp/generic-app/src/config/domain.config.ts)
-   **App Name**: "DevBlog Engine"
-   **Entity**: "Post" (Plural: "Posts")
-   **Fields**:
    -   `title` (string, required)
    -   `slug` (string, required, unique)
    -   `content` (text, required) - *Leveraging new Textarea support*
    -   `published` (boolean, default: false)
    -   `coverImage` (image)
    -   `tags` (string, optional) - *Simple string for now, maybe array later*

### 3. Generation Process
-   Run `npm run generate:schema`: To create the `Post` model.
-   Run `npx prisma db push --force-reset`: To apply changes and clear old Product data.
-   Run `npm run generate:pages`: To update dashboard routing and components.

## Verification Plan

### Manual Verification
1.  **Register/Login**: Ensure Auth still works after DB reset.
2.  **Create Post**:
    -   Navigate to `/dashboard/add-post`.
    -   Verify "Content" field uses a Textarea (multiline).
    -   Create a post with a long body.
3.  **View Post**:
    -   Verify the post appears in the Dashboard grid.
    -   Verify the post appears on the Home page.
4.  **Edit Post**:
    -   Verify the "Content" Textarea is populated correctly.
