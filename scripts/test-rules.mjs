import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';

const testEnv = await initializeTestEnvironment({
  projectId: 'demo-roc-workspace',
  firestore: {
    rules: readFileSync('firestore.rules', 'utf8'),
    host: '127.0.0.1',
    port: 8080,
  },
});

await testEnv.clearFirestore();

const tannerCtx = testEnv.authenticatedContext('uid-tanner', { email: 'tannerwesgardner@gmail.com' });
const rochelleCtx = testEnv.authenticatedContext('uid-rochelle', { email: 'rochelleygardner@gmail.com' });
const strangerCtx = testEnv.authenticatedContext('uid-stranger', { email: 'stranger@example.com' });
const anonCtx = testEnv.unauthenticatedContext();

const tannerDb = tannerCtx.firestore();
const rochelleDb = rochelleCtx.firestore();
const strangerDb = strangerCtx.firestore();
const anonDb = anonCtx.firestore();

let failures = 0;
const check = (label, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'} - ${label}`);
  if (!ok) failures++;
};

// Mirrors isValidItem() in firestore.rules -- the shape useItems.js writes.
const validItem = (overrides = {}) => ({
  title: 'Refinish the porch rocking chair',
  kind: 'project',
  status: 'idea',
  category: 'furniture',
  updatedAt: Date.now(),
  ...overrides,
});

try {
  await assertSucceeds(setDoc(doc(tannerDb, 'items/item1'), validItem()));
  check('allowed account can write an item', true);
} catch (e) {
  check('allowed account can write an item', false);
  console.error(e.message);
}

try {
  const snap = await assertSucceeds(getDoc(doc(tannerDb, 'items/item1')));
  check('allowed account can read', snap.data()?.title === 'Refinish the porch rocking chair');
} catch (e) {
  check('allowed account can read', false);
  console.error(e.message);
}

try {
  await assertSucceeds(setDoc(doc(rochelleDb, 'items/item2'), validItem({ title: 'Bookshelf for the office', kind: 'task' })));
  const snap = await assertSucceeds(getDoc(doc(rochelleDb, 'items/item2')));
  check('second allowed account (Rochelle) can read/write', snap.data()?.kind === 'task');
} catch (e) {
  check('second allowed account (Rochelle) can read/write', false);
  console.error(e.message);
}

try {
  const snap = await assertSucceeds(getDocs(collection(tannerDb, 'items')));
  check('allowed account can list the whole shared collection', snap.size === 2);
} catch (e) {
  check('allowed account can list the whole shared collection', false);
  console.error(e.message);
}

try {
  await assertFails(getDoc(doc(strangerDb, 'items/item1')));
  check('non-allow-listed account is rejected (read)', true);
} catch (e) {
  check('non-allow-listed account is rejected (read)', false);
}
try {
  await assertFails(setDoc(doc(strangerDb, 'items/item3'), validItem()));
  check('non-allow-listed account is rejected (write)', true);
} catch (e) {
  check('non-allow-listed account is rejected (write)', false);
}

try {
  await assertFails(getDoc(doc(anonDb, 'items/item1')));
  check('unauthenticated access is rejected', true);
} catch (e) {
  check('unauthenticated access is rejected', false);
}

try {
  const { kind: _kind, ...missingKind } = validItem();
  await assertFails(setDoc(doc(tannerDb, 'items/item4'), missingKind));
  check('write missing a required field is rejected', true);
} catch (e) {
  check('write missing a required field is rejected', false);
}

try {
  await assertFails(setDoc(doc(tannerDb, 'items/item5'), validItem({ kind: 'not-a-real-kind' })));
  check('write with an invalid kind is rejected', true);
} catch (e) {
  check('write with an invalid kind is rejected', false);
}
try {
  await assertFails(setDoc(doc(tannerDb, 'items/item6'), validItem({ status: 'not-a-real-status' })));
  check('write with an invalid status is rejected', true);
} catch (e) {
  check('write with an invalid status is rejected', false);
}

try {
  await assertFails(setDoc(doc(tannerDb, 'items/item7'), validItem({ title: 12345 })));
  check('write with a wrong-typed title is rejected', true);
} catch (e) {
  check('write with a wrong-typed title is rejected', false);
}
try {
  await assertFails(setDoc(doc(tannerDb, 'items/item8'), validItem({ updatedAt: 'not-a-number' })));
  check('write with a wrong-typed updatedAt is rejected', true);
} catch (e) {
  check('write with a wrong-typed updatedAt is rejected', false);
}
try {
  await assertFails(setDoc(doc(tannerDb, 'items/item9'), validItem({ resources: 'not-a-list' })));
  check('write with a wrong-typed resources field is rejected', true);
} catch (e) {
  check('write with a wrong-typed resources field is rejected', false);
}

try {
  await assertSucceeds(
    setDoc(
      doc(tannerDb, 'items/item10'),
      validItem({
        status: 'active',
        scope: 'Glue and clamp the frame.',
        resources: [{ label: 'Wood glue', acquired: true }],
        tasks: [{ label: 'Glue and clamp', done: false }],
        log: [{ date: '2026-07-24', note: 'Started.' }],
      }),
    ),
  );
  check('write with the richer active-phase fields is allowed', true);
} catch (e) {
  check('write with the richer active-phase fields is allowed', false);
  console.error(e.message);
}

try {
  await assertSucceeds(
    setDoc(
      doc(tannerDb, 'items/item11'),
      validItem({
        status: 'on-deck',
        history: [
          { from: null, to: 'idea', at: '2026-07-20T10:00:00.000Z' },
          { from: 'idea', to: 'on-deck', at: '2026-07-25T09:30:00.000Z' },
        ],
      }),
    ),
  );
  check('write with a phase-movement history list is allowed', true);
} catch (e) {
  check('write with a phase-movement history list is allowed', false);
  console.error(e.message);
}
try {
  await assertFails(setDoc(doc(tannerDb, 'items/item12'), validItem({ history: 'not-a-list' })));
  check('write with a wrong-typed history field is rejected', true);
} catch (e) {
  check('write with a wrong-typed history field is rejected', false);
}

await testEnv.cleanup();

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
} else {
  console.log('\nAll checks passed.');
}
