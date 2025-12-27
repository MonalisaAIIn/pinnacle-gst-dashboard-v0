# app/dashboard/admin/loading.tsx

**File Path:** `app/dashboard/admin/loading.tsx`

This minimal component defines the **loading state** for the Admin Dashboard route. Next.js App Router detects a `loading.tsx` file and renders it while the corresponding page or its data is loading. Currently, it returns `null`, so no UI appears during load.

## Purpose

- Implements the **Loading UI** hook for `/dashboard/admin` route.
- Leverages Next.js App Router’s built-in loading convention.
- Can be customized to show spinners, skeletons, or messages.

## Next.js Integration

Next.js App Router automatically uses `app/dashboard/admin/loading.tsx` when:

1. Navigating to `/dashboard/admin`
2. Data fetching in `page.tsx` or nested segments is pending
3. Rendering child routes under `/dashboard/admin`

To see the main admin page, view `app/dashboard/admin/page.tsx` .

## Component Definition

```tsx
// app/dashboard/admin/loading.tsx
export default function Loading() {
  return null;
}
```

- **Exported** as `Loading` (default).
- **Returns** `null`, showing nothing.
- **Server Component** by default in Next.js App Router.

## Related Files 📁

| File | Role |
| --- | --- |
| `app/dashboard/admin/page.tsx` | Main Admin Dashboard UI and data fetching |
| `app/dashboard/layout.tsx` | Dashboard layout wrapper for nested routes |
| `app/dashboard/admin/subscriptions/loading.tsx` | Custom loader for subscriptions sub-route |


## Customization ⚙️

To provide visual feedback during loading:

1. **Import** a spinner or skeleton component.
2. **Replace** `return null` with your loading UI.
3. **Style** using Tailwind, CSS modules, or component library.

```tsx
import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="mt-2 text-sm text-gray-500">Loading Admin Dashboard...</p>
    </div>
  );
}
```

## Best Practices

- Keep loading UIs lightweight to avoid flicker.
- Use skeletons for heavy layouts to improve perceived performance.
- Match loading styles with final layout shape for smoother transitions.

```card
{
    "title": "Tip",
    "content": "Implement skeleton screens that resemble final content to enhance UX."
}
```

> Card: