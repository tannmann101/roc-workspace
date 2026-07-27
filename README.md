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

## AI assist, backed by real Claude

Every "✨ Generate..." button (idea expansion, project-profile drafts,
schedule suggestions, weekly focus, progress reports) calls the real
**Claude API** -- not a template, not a free-tier client-side call. Every
one of them follows the same rule: generate a draft into a preview, and
only touch a real item if she clicks "Use this." Nothing here writes to
an item on its own.

Unlike Google's Gemini keys, Anthropic API keys can't be locked down to a
specific website, so calling Claude directly from the browser would mean
shipping an unrestricted, billable key in the JS bundle -- anyone could
copy it out and run up charges. Instead, the key lives **server-side only**
in a Firebase Cloud Function (`functions/index.js`) that the app calls
through Firebase's callable-function protocol
(`src/lib/claude.js`). That function:

- checks the caller is signed in as one of the two allow-listed household
  emails (same list as `firestore.rules`) before doing anything,
- reads the Anthropic key from Google Cloud Secret Manager (never in code,
  never in an env file, never sent to the browser),
- calls Claude (`claude-haiku-4-5`, capped at 512 output tokens to keep
  responses short and cheap) and returns just the text.

This does mean real, small, metered cost on your Anthropic account --
there's no free tier for the real API -- but a personal app's occasional
idea-expansion/report-drafting usage should run well under a dollar a
month.

## Running locally

```
npm install
npm run dev
```

## Local development against a fake project (no real Firebase needed)

`.env.local` sets `VITE_USE_FIREBASE_EMULATOR=true` (create it yourself,
it's gitignored -- see `.env.local.example`), so `npm run dev` talks to
local emulators instead of your real project. Requires a Java runtime
installed once.

```
npm install --prefix functions   # functions has its own package.json
npm run emulators                 # starts local Auth + Firestore + Functions emulators
npm run dev                       # in another terminal
npm run test:rules                # scripted checks of firestore.rules (allow-list + schema)
```

Claude itself isn't emulated -- the Functions emulator runs your real
`functions/index.js` and will genuinely call the real Anthropic API if you
give it a real key. For local testing, create `functions/.secret.local`
(gitignored) with:

```
ANTHROPIC_API_KEY=your-real-key-or-a-throwaway-value
```

Without that file, calls will pass the auth gate but fail when reaching
Claude, which is a perfectly fine way to test everything except the actual
generation.

## One-time cloud setup (~30 minutes, some real cost)

This app uses its own Firebase project, separate from any other app built
this way -- its data, quota, and security rules are fully isolated.

1. Go to <https://console.firebase.google.com>, sign in, and create a new
   project (no credit card needed to start -- the free "Spark" plan covers
   Firestore and Auth).
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
6. **Deploy the security rules** in [firestore.rules](firestore.rules) --
   the emails are already set to the two household accounts, so just run:
   ```
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project <your-project-id>
   ```
   (or paste the contents of `firestore.rules` directly into Firebase Console →
   Firestore Database → Rules → Publish).

### Cloud Functions setup (for the real AI)

7. **Upgrade to the Blaze (pay-as-you-go) plan**: Firebase Console → bottom
   of the left sidebar → "Upgrade". Cloud Functions require this plan even
   though this app's usage should stay within Blaze's free monthly quota
   for everything except the Claude API calls themselves (which are billed
   separately, by Anthropic -- see below).
8. **Get a Claude API key**: go to <https://console.anthropic.com>, sign
   in, add a payment method (required -- there's no free API tier), and
   create an API key under Settings → API Keys.
9. **Store the key in Secret Manager**: [Google Cloud Console](https://console.cloud.google.com/security/secret-manager)
   (same account, same project) → Create Secret → name it exactly
   `ANTHROPIC_API_KEY` → paste the key as the secret value → Create.
10. **Create a service account for automated deploys** (so functions can
    deploy from GitHub Actions without you needing any local install):
    [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
    → Create Service Account → any name (e.g. `github-deploy`) → grant it
    the **Editor** role on the project (broad, but reliable -- Cloud
    Functions deploys touch several services, and narrower role sets are
    easy to get subtly wrong) → Done. Then open that service account →
    Keys tab → Add Key → Create new key → JSON → this downloads a file.
11. **Add that JSON as a GitHub secret**: GitHub repo → Settings → Secrets
    and variables → Actions → New repository secret → name it
    `FIREBASE_SERVICE_ACCOUNT` → paste the **entire contents** of the
    downloaded JSON file as the value.
12. Commit and push. `.github/workflows/deploy-functions.yml` deploys the
    function automatically on any push that touches `functions/**`, using
    that service account. Watch the Actions tab for the run; once it's
    green, the AI-assist buttons should work end to end on the live site.

If either of you ever needs to change which accounts are allowed, edit the
email list in **both** `firestore.rules` and `functions/index.js`'s
`ALLOWED_EMAILS`, redeploy the rules (step 6) and push (which redeploys
the function).

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
   automatically on every push to `main`.
5. Your app will be live at `https://<your-username>.github.io/roc-workspace/`.

(If you rename the repo, update `base` in `vite.config.js` to match.)

Cloud Functions deploy separately -- see
`.github/workflows/deploy-functions.yml` and the setup steps above.
