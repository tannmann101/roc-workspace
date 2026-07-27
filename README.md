# The Workshop

A project / task / maintenance workspace for managing things from first idea
to finished work: Ideas → Upcoming (project profiles) → Up Next (planning)
→ Active (reached from the Dashboard) → Done. See git history for the
design process -- this README covers what's actually running.

## Data & sync

Data lives in a shared Firestore `items` collection -- every item is its
own document, and both accounts read/write the same collection with
**live sync** (not refresh-on-open): checking off a task, editing a
profile field, or moving something between phases shows up for both of
you without a manual refresh.

Access is locked down with Google sign-in: only the two email addresses
listed in `firestore.rules` can read or write.

## AI assist, running for free

Every "✨ Generate..." button (idea expansion, project-profile drafts,
schedule suggestions, weekly focus, progress reports) calls the real
**Gemini API free tier** (`src/lib/gemini.js`) -- not a paid model, and not
a template. Every one of them follows the same rule: generate a draft into
a preview, and only touch a real item if she clicks "Use this." Nothing
here writes to an item on its own.

There's no backend in this stack, so the Gemini key is called directly
from the browser and locked down with an **HTTP-referrer restriction**
instead of being hidden behind a server (see setup step 6 below) -- the
standard approach for a client-only app like this one.

## Running locally

```
npm install
npm run dev
```

## Local development against a fake project (no real Firebase needed)

`.env.local` sets `VITE_USE_FIREBASE_EMULATOR=true` (create it yourself,
it's gitignored -- see `.env.local.example`), so `npm run dev` talks to a
local emulator instead of your real project. Requires a Java runtime
installed once.

```
npm run emulators   # starts local Auth + Firestore emulators
npm run dev          # in another terminal
npm run test:rules   # scripted checks of firestore.rules (allow-list + schema)
```

The AI-assist buttons need a real `VITE_GEMINI_API_KEY` in `.env.local` to
do anything even against the emulator -- Gemini itself isn't emulated.

## One-time cloud setup (free, ~15 minutes)

This app uses its own Firebase project, separate from any other app built
this way -- its data, quota, and security rules are fully isolated.

1. Go to <https://console.firebase.google.com>, sign in, and create a new
   project (no credit card needed -- the free "Spark" plan is enough).
2. **Enable Firestore**: in the left sidebar, Build → Firestore Database →
   Create database → start in **production mode** → pick any region.
3. **Enable Google sign-in**: Build → Authentication → Get started → Sign-in
   method tab → enable the **Google** provider.
4. **Authorize your domain**: still in Authentication → Settings → Authorized
   domains → add `<your-username>.github.io`.
5. **Register a web app**: Project settings (gear icon) → General → "Your apps"
   → Add app → Web (`</>`). Copy the `firebaseConfig` object it gives you,
   and paste those values into [src/firebase.js](src/firebase.js),
   replacing the `REPLACE_ME` placeholders.
6. **Get a free Gemini API key**: go to <https://aistudio.google.com/apikey>,
   sign in, and create a key (no credit card needed for the free tier).
   Then in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (same Google account, pick the project AI Studio created), open that
   key and under "Application restrictions" choose **Websites**, then add
   `https://<your-username>.github.io/*` (and `http://localhost:*` if you
   want it to also work in local dev without the emulator). This is what
   keeps the key from being usable if someone copies it out of the
   deployed site's JS bundle.
7. **Add the Gemini key as a GitHub Actions secret**: in the GitHub repo →
   Settings → Secrets and variables → Actions → New repository secret →
   name it `VITE_GEMINI_API_KEY`, paste the key. The deploy workflow reads
   it from there at build time so it never needs to be committed.
8. **Deploy the security rules** in [firestore.rules](firestore.rules) --
   the emails are already set to the two household accounts, so just run:
   ```
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project <your-project-id>
   ```
   (or paste the contents of `firestore.rules` directly into Firebase Console →
   Firestore Database → Rules → Publish).
9. Commit and push. Once the site redeploys, open it, sign in with Google on
   both phones, and you should see the same shared, empty workspace --
   ready for real ideas.

If either of you ever needs to change which accounts are allowed, edit the
email list in `firestore.rules` and redeploy the rules (step 8).

## Starting empty, on purpose

There's no seed data in this build -- the mock demo items from the design
pass are gone. The whole point of this phase was to make the app good
enough that she can flesh out her real projects herself, straight into the
real tool, instead of a round of interviews feeding a spec. First real use
starts from an empty Ideas page.

## Deploying to GitHub Pages (free)

1. Push this project to the `main` branch of its GitHub repo.
2. In the repo settings → Pages, set the source to "GitHub Actions".
3. Settings → Environments → `github-pages` → Deployment branches and tags
   → make sure `main` is allowed (GitHub sometimes creates this
   environment restricted to nothing until you touch it).
4. The included workflow (`.github/workflows/deploy.yml`) builds and deploys
   automatically on every push to `main`, injecting the `VITE_GEMINI_API_KEY`
   secret at build time.
5. Your app will be live at `https://<your-username>.github.io/roc-workspace/`.

(If you rename the repo, update `base` in `vite.config.js` to match.)
