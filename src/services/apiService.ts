/**
 * API & Cloud Storage Service for YOU & ME
 * Provides resilient two-way communication:
 * 1. Same-origin backend (/api/surprises, /api/responses) in Node / Vite preview
 * 2. Supabase REST API (if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided)
 * 3. Portable client-side hash fallback with size safety check
 */

import type { Surprise, LoveLoopResponse } from "../types/romantic";
import { encodeSurprisePayload, getSurpriseById, saveSurprise } from "../data/momentStore";

export interface PublishResult {
  id: string;
  url: string;
  urlLength: number;
  mode: "backend" | "supabase" | "hash_fallback";
  warning?: string;
}

export interface DeliveryResult {
  success: boolean;
  mode: "backend" | "supabase" | "local_only";
  error?: string;
}

// Check for optional Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

/**
 * Publishes a surprise to the shared backend to generate a clean short link.
 * Falls back to portable URL hash if backend is unreachable.
 */
export async function publishSurpriseToCloud(surprise: Surprise): Promise<PublishResult> {
  const origin = window.location.origin + window.location.pathname;

  // 1. Try Supabase if configured
  if (HAS_SUPABASE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/surprises`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: surprise.id,
          payload: surprise,
          updated_at: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const shortUrl = `${origin}#surprise=${surprise.id}`;
        return {
          id: surprise.id,
          url: shortUrl,
          urlLength: shortUrl.length,
          mode: "supabase",
        };
      }
    } catch (err) {
      console.warn("Supabase publish failed, trying local API:", err);
    }
  }

  // 2. Try same-origin Production Server API (/api/surprises)
  try {
    const res = await fetch("/api/surprises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(surprise),
    });

    if (res.ok) {
      const data = await res.json();
      const surpriseId = data.id || surprise.id;
      const shortUrl = `${origin}#surprise=${surpriseId}`;
      return {
        id: surpriseId,
        url: shortUrl,
        urlLength: shortUrl.length,
        mode: "backend",
      };
    }
  } catch (err) {
    console.warn("Server /api/surprises unreachable, falling back to portable hash:", err);
  }

  // 3. Fallback: Portable base64 hash link
  const encoded = encodeSurprisePayload(surprise);
  const hashUrl = `${origin}#play=${encoded}`;
  const length = hashUrl.length;

  let warning: string | undefined;
  if (length > 60000) {
    warning = `Share link is very large (${Math.round(length / 1024)}KB) due to custom photos. It may be truncated if sent via SMS or certain messaging apps.`;
  } else if (length > 2000) {
    warning = `Note: Link is ${length} characters. Best sent directly via WhatsApp web or copy-paste.`;
  }

  return {
    id: surprise.id,
    url: hashUrl,
    urlLength: length,
    mode: "hash_fallback",
    warning,
  };
}

/**
 * Fetches a surprise by ID from the cloud / backend across separate devices.
 */
export async function fetchSurpriseFromCloud(id: string): Promise<Surprise | null> {
  // 1. Check local cache first
  const local = getSurpriseById(id);
  if (local) return local;

  // 2. Try Supabase if configured
  if (HAS_SUPABASE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/surprises?id=eq.${encodeURIComponent(id)}&select=payload`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.payload) {
          saveSurprise(data[0].payload);
          return data[0].payload as Surprise;
        }
      }
    } catch (err) {
      console.warn("Supabase fetch failed:", err);
    }
  }

  // 3. Try server API (/api/surprises/:id)
  try {
    const res = await fetch(`/api/surprises/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        saveSurprise(data);
        return data as Surprise;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch surprise from /api/surprises:", err);
  }

  return null;
}

/**
 * Sends a Love Loop reply to the sender across devices.
 */
export async function deliverLoveLoopReply(response: LoveLoopResponse): Promise<DeliveryResult> {
  // 1. Try Supabase if configured
  if (HAS_SUPABASE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/responses`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          id: response.id,
          surprise_id: response.momentId,
          recipient_name: response.partnerName,
          text: response.text,
          reaction: response.reaction,
          voice_duration: response.voiceDuration,
          created_at: response.createdAt,
        }),
      });

      if (res.ok) {
        return { success: true, mode: "supabase" };
      }
    } catch (err) {
      console.warn("Supabase reply delivery failed:", err);
    }
  }

  // 2. Try server API (/api/responses)
  try {
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    });

    if (res.ok) {
      return { success: true, mode: "backend" };
    }
  } catch (err) {
    console.warn("Failed to post response to /api/responses:", err);
  }

  // If no network backend responded
  return {
    success: false,
    mode: "local_only",
    error: "No server backend reached. Your partner won't receive this on a separate device unless you send via WhatsApp.",
  };
}

/**
 * Retrieves Love Loop replies from the shared backend.
 */
export async function fetchRemoteReplies(): Promise<{ replies: LoveLoopResponse[]; mode: string }> {
  // 1. Try Supabase if configured
  if (HAS_SUPABASE) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/responses?order=created_at.desc`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows)) {
          const mapped: LoveLoopResponse[] = rows.map((r) => ({
            id: r.id,
            momentId: r.surprise_id || "surprise",
            partnerName: r.recipient_name || "Partner",
            text: r.text || "",
            reaction: r.reaction || "💗",
            voiceDuration: r.voice_duration,
            createdAt: r.created_at || new Date().toISOString(),
            savedToLore: false,
          }));
          return { replies: mapped, mode: "supabase" };
        }
      }
    } catch (err) {
      console.warn("Supabase replies fetch failed:", err);
    }
  }

  // 2. Try server API (/api/responses)
  try {
    const res = await fetch("/api/responses");
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        return { replies: list as LoveLoopResponse[], mode: "backend" };
      }
    }
  } catch (err) {
    console.warn("Server /api/responses unreachable:", err);
  }

  return { replies: [], mode: "offline" };
}
