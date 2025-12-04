// Client-side utility to cache a mapping from a WebAuthn credentialId to a wallet address.
// This is a UX hint only; the server remains the source of truth.
// - Key: kid = base64url(SHA-256(credentialId bytes))
// - Value: { walletAddress, createdAt, updatedAt, uses }
//
// Usage:
//   await saveCredentialWalletMapping(credentialId, walletAddress)
//   const hint = await getWalletByCredentialId(credentialId)
//   const all = await listWalletHints()
//   await removeWalletHintByCredentialId(credentialId)
//   await clearAllWalletHints()

/* eslint-disable @typescript-eslint/no-explicit-any */

const DB_NAME = "referral-widget-db";
const STORE_NAME = "previousAuthenticator";
const DB_VERSION = 1;

type WalletHint = {
  authenticatorId: string; // SHA-256(credentialId) base64url
  walletAddress: string; // Non-PII value we want to recall
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  uses: number; // increment on auth
};

// ---- Base64url helpers ----
function base64urlToBytes(b64url: string): Uint8Array {
  const pad =
    b64url.length % 4 === 0 ? "" : "=".repeat(4 - (b64url.length % 4));
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToBase64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// kid = base64url(SHA-256(credentialId bytes))
export async function computeKid(credentialIdB64url: string): Promise<string> {
  const bytes = base64urlToBytes(credentialIdB64url);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return bytesToBase64url(digest);
}

// ---- IndexedDB helpers ----
function hasIndexedDB(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!hasIndexedDB()) return reject(new Error("IndexedDB not supported"));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "authenticatorId",
        });
        store.createIndex("updatedAt", "updatedAt");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("IndexedDB open blocked"));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const req = fn(store);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ---- localStorage fallback ----
const LS_KEY = "referral-widget-v1";

function lsGetAll(): WalletHint[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as WalletHint[]) : [];
  } catch {
    return [];
  }
}

function lsSetAll(list: WalletHint[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// ---- Public API ----

export async function saveCredentialWalletMapping(
  authenticatorId: string,
  walletAddress: string
): Promise<void> {
  const now = Date.now();
  //   const kid = await computeKid(credentialIdB64url);

  if (hasIndexedDB()) {
    const existing = await getHintByKid(authenticatorId);
    const record: WalletHint = existing
      ? { ...existing, walletAddress, updatedAt: now, uses: existing.uses + 1 }
      : {
          authenticatorId,
          walletAddress,
          createdAt: now,
          updatedAt: now,
          uses: 1,
        };

    await withStore("readwrite", (s) => s.put(record));
    return;
  }

  // Fallback: localStorage
  const list = lsGetAll();
  const idx = list.findIndex((h) => h.authenticatorId === authenticatorId);
  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      walletAddress,
      updatedAt: now,
      uses: list[idx].uses + 1,
    };
  } else {
    list.push({
      authenticatorId,
      walletAddress,
      createdAt: now,
      updatedAt: now,
      uses: 1,
    });
  }
  lsSetAll(list);
}

export async function getWalletByCredentialId(
  authenticatorId: string
): Promise<string | null> {
  const kid = await computeKid(authenticatorId);
  const hint = await getHintByKid(authenticatorId);
  return hint?.walletAddress ?? null;
}

export async function getHintByKid(
  authenticatorId: string
): Promise<WalletHint | null> {
  if (hasIndexedDB()) {
    try {
      const rec = await withStore<WalletHint | undefined>("readonly", (s) =>
        s.get(authenticatorId)
      );
      return rec ?? null;
    } catch {
      // fall through to ls
    }
  }
  const list = lsGetAll();
  return list.find((h) => h.authenticatorId === authenticatorId) ?? null;
}

export async function removeWalletHintByCredentialId(
  credentialIdB64url: string
): Promise<void> {
  const kid = await computeKid(credentialIdB64url);
  await removeWalletHintByKid(credentialIdB64url);
}

export async function removeWalletHintByKid(
  authenticatorId: string
): Promise<void> {
  if (hasIndexedDB()) {
    try {
      await withStore("readwrite", (s) => s.delete(authenticatorId));
      return;
    } catch {
      // fall through
    }
  }
  const list = lsGetAll().filter((h) => h.authenticatorId !== authenticatorId);
  lsSetAll(list);
}

export async function listWalletHints(): Promise<WalletHint[]> {
  if (hasIndexedDB()) {
    try {
      return await withStore<WalletHint[]>("readonly", (s) => s.getAll());
    } catch {
      // fall through
    }
  }
  return lsGetAll();
}

export async function clearAllWalletHints(): Promise<void> {
  if (hasIndexedDB()) {
    try {
      await withStore("readwrite", (s) => s.clear());
      return;
    } catch {
      // fall through
    }
  }
  lsSetAll([]);
}
