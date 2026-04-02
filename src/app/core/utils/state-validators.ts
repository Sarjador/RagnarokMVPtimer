import { AppState, MvpTrackerEntry, MvpStatus } from '../models/mvp-tracker.model';
import { BossEntry, CustomBossListJson } from '../models/boss.model';

// ── Helpers basicos ───────────────────────────────────────────────────────────

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && isFinite(v);
}

function isNonNegativeInt(v: unknown): v is number {
  return isFiniteNumber(v) && v >= 0 && Number.isInteger(v);
}

function isPositiveInt(v: unknown): v is number {
  return isFiniteNumber(v) && v > 0 && Number.isInteger(v);
}

/** Permite solo URLs http/https o cadena vacia */
function isSafeImageUrl(v: unknown): v is string {
  if (!isString(v)) return false;
  if (v === '') return true;
  return /^https?:\/\//i.test(v);
}

const VALID_STATUSES = new Set<MvpStatus>(['tracking', 'warning', 'ready']);

// ── Validadores de BossEntry ──────────────────────────────────────────────────

function isValidBossEntry(v: unknown): v is BossEntry {
  if (!v || typeof v !== 'object') return false;
  const b = v as Record<string, unknown>;
  return (
    isNonNegativeInt(b['ID']) &&
    isString(b['bossName']) && b['bossName'].length > 0 && b['bossName'].length <= 100 &&
    isNonNegativeInt(b['HP']) &&
    isString(b['race']) && b['race'].length <= 60 &&
    isString(b['property']) && b['property'].length <= 60 &&
    isString(b['location']) && b['location'].length <= 100 &&
    isPositiveInt(b['minRespawnTimeScheduleInSeconds']) &&
    isPositiveInt(b['maxRespawnTimeScheduleInSeconds']) &&
    (b['maxRespawnTimeScheduleInSeconds'] as number) >= (b['minRespawnTimeScheduleInSeconds'] as number) &&
    isSafeImageUrl(b['imageUrl']) &&
    Array.isArray(b['alias']) &&
    (b['alias'] as unknown[]).every((a) => isString(a) && a.length <= 60)
  );
}

// ── Validadores de MvpTrackerEntry ────────────────────────────────────────────

/** UUID v4 simple */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidTrackerEntry(v: unknown): v is MvpTrackerEntry {
  if (!v || typeof v !== 'object') return false;
  const e = v as Record<string, unknown>;
  return (
    isString(e['id']) && UUID_RE.test(e['id']) &&
    isValidBossEntry(e['boss']) &&
    isFiniteNumber(e['deathTime']) && e['deathTime'] > 0 &&
    isFiniteNumber(e['minRespawnTime']) && e['minRespawnTime'] > 0 &&
    isFiniteNumber(e['maxRespawnTime']) && e['maxRespawnTime'] > 0 &&
    (e['maxRespawnTime'] as number) >= (e['minRespawnTime'] as number) &&
    typeof e['fiveMinWarningSent'] === 'boolean' &&
    VALID_STATUSES.has(e['status'] as MvpStatus)
  );
}

// ── Validadores de AppState ───────────────────────────────────────────────────

const VALID_LOCALES = new Set(['en', 'es']);

/**
 * Valida y normaliza el estado cargado de disco.
 * Devuelve null si la estructura es completamente invalida.
 * Las entradas individuales invalidas se descartan con un warning en consola.
 */
export function parseAppState(raw: unknown): AppState | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  // activeEntries: descartamos entradas individuales invalidas en lugar de rechazar todo
  const rawEntries = Array.isArray(obj['activeEntries']) ? obj['activeEntries'] : [];
  const activeEntries: MvpTrackerEntry[] = [];
  for (const entry of rawEntries) {
    if (isValidTrackerEntry(entry)) {
      activeEntries.push(entry);
    } else {
      console.warn('[StateValidator] Discarding invalid tracker entry:', entry);
    }
  }

  // Timezone: debe ser string no vacio (la validacion de zona valida la hace dayjs en runtime)
  const serverTimezone =
    isString(obj['serverTimezone']) && obj['serverTimezone'].length > 0 && obj['serverTimezone'].length <= 60
      ? obj['serverTimezone']
      : undefined;

  const displayTimezone =
    isString(obj['displayTimezone']) && obj['displayTimezone'].length > 0 && obj['displayTimezone'].length <= 60
      ? obj['displayTimezone']
      : undefined;

  // customAudioPath: solo el nombre de archivo (sin separadores de path)
  // A partir del fix #7 se guarda solo el nombre; aceptamos paths absolutos legacy
  // para compatibilidad pero los registramos
  const rawAudioPath = obj['customAudioPath'];
  let customAudioPath: string | undefined;
  if (isString(rawAudioPath) && rawAudioPath.length > 0 && rawAudioPath.length <= 260) {
    customAudioPath = rawAudioPath;
  }

  const locale =
    isString(obj['locale']) && VALID_LOCALES.has(obj['locale'])
      ? (obj['locale'] as 'en' | 'es')
      : undefined;

  return { activeEntries, serverTimezone, displayTimezone, customAudioPath, locale };
}

// ── Validadores de CustomBossListJson ─────────────────────────────────────────

/**
 * Valida y normaliza la lista de bosses custom cargada de disco.
 * Devuelve null si la estructura raiz es invalida.
 */
export function parseCustomBossList(raw: unknown): CustomBossListJson | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  if (!isNonNegativeInt(obj['nextCustomId'])) return null;

  const rawBosses = Array.isArray(obj['bosses']) ? obj['bosses'] : [];
  const bosses: Omit<BossEntry, 'isCustom'>[] = [];

  for (const b of rawBosses) {
    // isValidBossEntry valida la forma completa; isCustom es runtime-only y no esta en disco
    if (isValidBossEntry({ ...b, isCustom: false })) {
      const { isCustom: _ignored, ...persisted } = { ...b, isCustom: false } as BossEntry;
      bosses.push(persisted);
    } else {
      console.warn('[StateValidator] Discarding invalid custom boss:', b);
    }
  }

  return { nextCustomId: obj['nextCustomId'] as number, bosses };
}
