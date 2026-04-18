# Birthday Drive Gallery Reframe

- Actual user pain: adding new birthday carousel photos currently requires a code change and redeploy, which is too heavy for a family photo update workflow.
- Requested framing: let the `/birthday` photo carousel read from the provided Google Drive folder.
- Rejected framing: do not build a full CMS, private Google OAuth integration, upload admin, or redesign the birthday page.
- Narrowest wedge: load public image metadata from one shared Google Drive folder and use it as the carousel source, while keeping the current local images as fallback.
- Non-goals: editing captions in-app, changing RSVP behavior, or replacing other image surfaces across the site.
- Success metric: a new image dropped into the shared Google Drive folder appears in the `/birthday` carousel without a code edit, and the page still works if Drive is unavailable.
- Why now: the user wants a faster, non-developer path for updating the birthday gallery ahead of active page use.
- Open assumptions: the shared Drive folder remains publicly readable by link, Google keeps `embeddedfolderview` available for public folder listing, and generic alt text is acceptable for folder-managed photos until curated copy is provided.
