


"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getAdminSessionAction } from "@/app/actions/auth-actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminData {
  taluka: string;
  role: "admin" | "subadmin";
  name?: string;
  email?: string;
}

interface Posting {
  id: string;
  farmerId: string;
  farmingType: string;
  seedType: string;
  acres: number;
  production: number;
  zone: Zone;
  taluk: string;
  district: string;
  state: string;
  lat: number | null;
  lng: number | null;
}

interface TalukAgg {
  taluk: string;
  production: number;
  count: number;
  zone: Zone;
}

interface ChartEntry {
  type: string;
  production: number;
}

type Zone = "red" | "yellow" | "green";
type FarmingType = "organic" | "regular" | "natural" | "hydroponic";

// ─── Constants ────────────────────────────────────────────────────────────────

const FACTORS: Record<FarmingType, number> = {
  organic: 1.2,
  regular: 1.0,
  natural: 0.9,
  hydroponic: 1.5,
};

function getProduction(acres: number, farmingType: string): number {
  return Math.round(acres * (FACTORS[farmingType as FarmingType] ?? 1.0));
}

function getZone(production: number): Zone {
  if (production >= 5000) return "red";
  if (production >= 2000) return "yellow";
  return "green";
}

const ZONE_COLORS: Record<Zone, string> = {
  red: "#E24B4A",
  yellow: "#EF9F27",
  green: "#1D9E75",
};
const ZONE_BG: Record<Zone, string> = {
  red: "#FCEBEB",
  yellow: "#FAEEDA",
  green: "#EAF3DE",
};
const ZONE_TEXT: Record<Zone, string> = {
  red: "#791F1F",
  yellow: "#633806",
  green: "#27500A",
};
const ZONE_BORDER: Record<Zone, string> = {
  red: "#F09595",
  yellow: "#FAC775",
  green: "#C0DD97",
};

const TYPE_COLORS: Record<string, string> = {
  organic: "#378ADD",
  regular: "#1D9E75",
  natural: "#7F77DD",
  hydroponic: "#D85A30",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ZoneBadge({ zone }: { zone: Zone }) {
  return (
    <span
      style={{
        background: ZONE_BG[zone],
        color: ZONE_TEXT[zone],
        borderRadius: 6,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        border: `1px solid ${ZONE_COLORS[zone]}33`,
        display: "inline-block",
      }}
    >
      {zone}
    </span>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "var(--color-background-primary, #fff)",
        border: "0.5px solid #e5e7eb",
        borderRadius: 12,
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#888",
          fontWeight: 500,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#1a1a1a",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function BarChart({ data }: { data: ChartEntry[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.production));
  return (
    <div style={{ padding: "1rem 0" }}>
      {data.map((d) => (
        <div
          key={d.type}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              width: 88,
              fontSize: 13,
              color: "#555",
              textAlign: "right",
              fontWeight: 500,
            }}
          >
            {d.type}
          </span>
          <div
            style={{
              flex: 1,
              background: "#f3f4f6",
              borderRadius: 6,
              overflow: "hidden",
              height: 26,
            }}
          >
            <div
              style={{
                width: `${(d.production / max) * 100}%`,
                background: TYPE_COLORS[d.type] ?? "#888",
                height: "100%",
                borderRadius: 6,
                transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
              }}
            >
              <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>
                {d.production.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Taluk Zone Map ───────────────────────────────────────────────────────────

type ZoneFilter = Zone | "all";

function TalukZoneMap({ data }: { data: TalukAgg[] }) {
  const [activeZone, setActiveZone] = useState<ZoneFilter>("all");
  const [tooltip, setTooltip] = useState<TalukAgg | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ✅ All hooks are called unconditionally before any early return
  const filtered = useMemo<TalukAgg[]>(() => {
    return activeZone === "all"
      ? data
      : data.filter((d) => d.zone === activeZone);
  }, [data, activeZone]);

  const maxProd = useMemo<number>(
    () => Math.max(...data.map((d) => d.production), 1),
    [data]
  );

  const zoneCounts = useMemo<Record<Zone, number>>(() => {
    const c: Record<Zone, number> = { red: 0, yellow: 0, green: 0 };
    data.forEach((d) => {
      if (d.zone in c) c[d.zone]++;
    });
    return c;
  }, [data]);

  // ✅ Early return AFTER all hooks
  if (!data.length) {
    return (
      <div
        style={{
          height: 420,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 14,
        }}
      >
        No taluk data available
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Filter buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#888",
            fontWeight: 500,
            marginRight: 4,
          }}
        >
          Filter:
        </span>
        {(
          [
            {
              key: "all" as ZoneFilter,
              label: "All zones",
              color: "#64748b",
              bg: "#f1f5f9",
              border: "#cbd5e1",
              text: "#334155",
            },
            {
              key: "red" as ZoneFilter,
              label: `Red (${zoneCounts.red})`,
              color: ZONE_COLORS.red,
              bg: ZONE_BG.red,
              border: ZONE_BORDER.red,
              text: ZONE_TEXT.red,
            },
            {
              key: "yellow" as ZoneFilter,
              label: `Yellow (${zoneCounts.yellow})`,
              color: ZONE_COLORS.yellow,
              bg: ZONE_BG.yellow,
              border: ZONE_BORDER.yellow,
              text: ZONE_TEXT.yellow,
            },
            {
              key: "green" as ZoneFilter,
              label: `Green (${zoneCounts.green})`,
              color: ZONE_COLORS.green,
              bg: ZONE_BG.green,
              border: ZONE_BORDER.green,
              text: ZONE_TEXT.green,
            },
          ] as const
        ).map((z) => (
          <button
            key={z.key}
            onClick={() => setActiveZone(z.key)}
            style={{
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: `1.5px solid ${
                activeZone === z.key ? z.color : z.border
              }`,
              background: activeZone === z.key ? z.bg : "#fff",
              color: activeZone === z.key ? z.text : "#64748b",
              transition: "all 0.15s",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {z.label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8" }}>
          {filtered.length} taluk{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tile grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          minHeight: 300,
          maxHeight: 360,
          overflowY: "auto",
          padding: "4px 2px",
        }}
      >
        {filtered.map((taluk) => {
          const sizeFrac = Math.max(0.35, taluk.production / maxProd);
          const minW = 100,
            maxW = 200;
          const tileW = Math.round(minW + sizeFrac * (maxW - minW));
          const isHovered = hoveredId === taluk.taluk;

          return (
            <div
              key={taluk.taluk}
              onMouseEnter={() => {
                setHoveredId(taluk.taluk);
                setTooltip(taluk);
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setTooltip(null);
              }}
              style={{
                width: tileW,
                borderRadius: 12,
                padding: "12px 14px",
                background: ZONE_BG[taluk.zone],
                border: `1.5px solid ${
                  isHovered
                    ? ZONE_COLORS[taluk.zone]
                    : ZONE_BORDER[taluk.zone]
                }`,
                cursor: "default",
                transition:
                  "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
                transform: isHovered ? "translateY(-2px)" : "none",
                boxShadow: isHovered
                  ? `0 4px 16px ${ZONE_COLORS[taluk.zone]}30`
                  : "none",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: ZONE_COLORS[taluk.zone],
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: ZONE_TEXT[taluk.zone],
                  }}
                >
                  {taluk.zone}
                </span>
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 4,
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {taluk.taluk}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#555",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {taluk.production.toLocaleString()} units
              </div>

              <div
                style={{
                  marginTop: 8,
                  background: `${ZONE_COLORS[taluk.zone]}25`,
                  borderRadius: 4,
                  height: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(taluk.production / maxProd) * 100}%`,
                    height: "100%",
                    background: ZONE_COLORS[taluk.zone],
                    borderRadius: 4,
                    transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>

              <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
                {taluk.count} posting{taluk.count !== 1 ? "s" : ""}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 200,
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            No taluks in this zone
          </div>
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#0f172a",
            color: "#f1f5f9",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            pointerEvents: "none",
            zIndex: 999,
            minWidth: 180,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}
          >
            {tooltip.taluk}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 2,
            }}
          >
            <span style={{ color: "#94a3b8" }}>Production</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {tooltip.production.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 2,
            }}
          >
            <span style={{ color: "#94a3b8" }}>Postings</span>
            <span>{tooltip.count}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span style={{ color: "#94a3b8" }}>Zone</span>
            <span
              style={{
                color: ZONE_COLORS[tooltip.zone],
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {tooltip.zone}
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center" }}
        >
          Zone thresholds:
        </span>
        {(
          [
            { zone: "red" as Zone, label: "≥ 5,000 units" },
            { zone: "yellow" as Zone, label: "2,000 – 4,999" },
            { zone: "green" as Zone, label: "< 2,000 units" },
          ] as const
        ).map(({ zone, label }) => (
          <span
            key={zone}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: ZONE_TEXT[zone],
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: ZONE_COLORS[zone],
                display: "inline-block",
              }}
            />
            {label}
          </span>
        ))}
        <span
          style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}
        >
          Tile size ∝ production volume
        </span>
      </div>
    </div>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ adminData }: { adminData: AdminData | null }) {
  if (!adminData) return null;

  const isAdmin = adminData.role === "admin";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: isAdmin
          ? "rgba(55,138,221,0.15)"
          : "rgba(127,119,221,0.15)",
        border: `1px solid ${isAdmin ? "#378ADD55" : "#7F77DD55"}`,
        borderRadius: 20,
        padding: "5px 14px 5px 10px",
        fontSize: 12,
        fontWeight: 600,
        color: isAdmin ? "#378ADD" : "#7F77DD",
        letterSpacing: "0.02em",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: isAdmin ? "#378ADD" : "#7F77DD",
          display: "inline-block",
        }}
      />
      {isAdmin
        ? "Administrator · All Taluks"
        : `Subadmin · ${adminData.taluka || "Unknown Taluk"}`}
    </div>
  );
}

// ─── Role Info Banner ─────────────────────────────────────────────────────────

function RoleInfoBanner({ adminData }: { adminData: AdminData | null }) {
  if (!adminData) return null;

  const isAdmin = adminData.role === "admin";

  return (
    <div
      style={{
        background: isAdmin ? "#EFF6FF" : "#F5F3FF",
        border: `1px solid ${isAdmin ? "#BFDBFE" : "#DDD6FE"}`,
        borderRadius: 10,
        padding: "10px 16px",
        marginBottom: 24,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        fontSize: 13,
        color: isAdmin ? "#1e40af" : "#5b21b6",
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: isAdmin ? "#BFDBFE" : "#DDD6FE",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
          marginTop: 1,
          color: isAdmin ? "#1d4ed8" : "#6d28d9",
        }}
      >
        i
      </span>
      <div>
        <strong>{isAdmin ? "Administrator View" : "Subadmin View"}:</strong>{" "}
        {isAdmin
          ? "You can view farm postings from all taluks across all districts."
          : "You can only view farm postings from "}
        {!isAdmin && (
          <strong style={{ color: "#6d28d9" }}>{adminData.taluka}</strong>
        )}
        {!isAdmin && " taluka."}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FarmDashboard() {
  const [allData, setAllData] = useState<Posting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);

  const PAGE_SIZE = 10;

  // ── 1. Fetch admin session ────────────────────────────────────────
  const fetchAdminSession = useCallback(async (): Promise<void> => {
    try {
      const session = await getAdminSessionAction();
      if (session?.admin) {
        setAdminData({
          taluka: session.admin.taluka ?? "",
          role: session.admin.role ?? "subadmin",
          name: session.admin.name,
          email: session.admin.email,
        });
      }
    } catch (err) {
      console.error("Error fetching admin session:", err);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminSession();
  }, [fetchAdminSession]);

  // ── 2. Taluk filter ───────────────────────────────────────────────
  const filterDataByTaluk = useCallback(
    (data: Posting[]): Posting[] => {
      if (!adminData || adminData.role !== "subadmin" || !adminData.taluka) {
        return data;
      }
      const filtered = data.filter(
        (r) =>
          r.taluk &&
          r.taluk.toLowerCase() === adminData.taluka.toLowerCase()
      );
      console.log(
        `[FarmDashboard] Taluk filter "${adminData.taluka}": ${data.length} → ${filtered.length} records`
      );
      return filtered;
    },
    [adminData]
  );

  // ── 3. Fetch postings (after session is ready) ────────────────────
  useEffect(() => {
    if (adminLoading) return;

    async function load(): Promise<void> {
      try {
        setLoading(true);
        const res = await fetch("/api/postings");
        if (!res.ok) throw new Error("Failed to fetch /api/postings");
        const json = await res.json();

        const enriched: Posting[] = (json.data ?? []).map(
          (p: {
            _id: string;
            farmerId: string;
            farmingType: string;
            seedType: string;
            acres: number;
            farmer?: {
              personalInfo?: {
                taluk?: string;
                taluka?: string;
                district?: string;
                state?: string;
              };
              farmLocation?: {
                latitude?: string;
                longitude?: string;
              };
              taluka?: string;
              district?: string;
            };
          }): Posting => {
            const pi = p.farmer?.personalInfo ?? {};
            const fl = p.farmer?.farmLocation ?? {};
            const production = getProduction(p.acres, p.farmingType);

            return {
              id: p._id,
              farmerId: p.farmerId,
              farmingType: p.farmingType,
              seedType: p.seedType,
              acres: p.acres,
              production,
              zone: getZone(production),
              taluk:
                pi.taluk ??
                pi.taluka ??
                p.farmer?.taluka ??
                p.farmer?.district ??
                "Unknown",
              district: pi.district ?? "—",
              state: pi.state ?? "—",
              lat: parseFloat(fl.latitude ?? "") || null,
              lng: parseFloat(fl.longitude ?? "") || null,
            };
          }
        );

        const visibleData = filterDataByTaluk(enriched);
        setAllData(visibleData);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [adminLoading, filterDataByTaluk]);

  // ── Derived state ─────────────────────────────────────────────────
  const filtered = useMemo<Posting[]>(() => {
    const s = search.toLowerCase();
    return allData.filter((r) => {
      const matchSearch =
        !s ||
        r.farmerId.toLowerCase().includes(s) ||
        r.farmingType.toLowerCase().includes(s);
      const matchType = !filterType || r.farmingType === filterType;
      return matchSearch && matchType;
    });
  }, [allData, search, filterType]);

  const talukAgg = useMemo<TalukAgg[]>(() => {
    const map: Record<string, TalukAgg> = {};
    filtered.forEach((r) => {
      if (!map[r.taluk]) {
        map[r.taluk] = { taluk: r.taluk, production: 0, count: 0, zone: "green" };
      }
      map[r.taluk].production += r.production;
      map[r.taluk].count += 1;
      map[r.taluk].zone = getZone(map[r.taluk].production);
    });
    return Object.values(map).sort((a, b) => b.production - a.production);
  }, [filtered]);

  const chartData = useMemo<ChartEntry[]>(() => {
    const map: Record<string, ChartEntry> = {};
    filtered.forEach((r) => {
      if (!map[r.farmingType]) {
        map[r.farmingType] = { type: r.farmingType, production: 0 };
      }
      map[r.farmingType].production += r.production;
    });
    return Object.values(map).sort((a, b) => b.production - a.production);
  }, [filtered]);

  const totalProduction = useMemo<number>(
    () => filtered.reduce((s, r) => s + r.production, 0),
    [filtered]
  );
  const totalAcres = useMemo<number>(
    () => filtered.reduce((s, r) => s + r.acres, 0),
    [filtered]
  );
  const uniqueFarmers = useMemo<number>(
    () => new Set(filtered.map((r) => r.farmerId)).size,
    [filtered]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const farmingTypes = useMemo<string[]>(
    () => [...new Set(allData.map((r) => r.farmingType))].filter(Boolean),
    [allData]
  );

  // ── Styles ────────────────────────────────────────────────────────
  const s = {
    container: {
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      background: "#f8f9fb",
      minHeight: "100vh",
      padding: "0 0 40px",
    } as React.CSSProperties,
    header: {
      background: "#0f172a",
      color: "#fff",
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
    } as React.CSSProperties,
    headerTitle: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      margin: 0,
    } as React.CSSProperties,
    headerSub: {
      fontSize: 13,
      color: "#94a3b8",
      marginTop: 2,
    } as React.CSSProperties,
    body: {
      maxWidth: 1400,
      margin: "0 auto",
      padding: "28px 24px",
    } as React.CSSProperties,
    section: {
      background: "#fff",
      border: "0.5px solid #e5e7eb",
      borderRadius: 14,
      padding: "20px 24px",
      marginBottom: 24,
    } as React.CSSProperties,
    sectionTitle: {
      fontSize: 15,
      fontWeight: 600,
      color: "#1a1a1a",
      marginBottom: 16,
      letterSpacing: "-0.01em",
    } as React.CSSProperties,
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 16,
      marginBottom: 24,
    } as React.CSSProperties,
    twoCol: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24,
      marginBottom: 24,
    } as React.CSSProperties,
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: 13,
    } as React.CSSProperties,
    th: {
      textAlign: "left" as const,
      padding: "10px 12px",
      fontSize: 11,
      fontWeight: 600,
      color: "#888",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      borderBottom: "1px solid #f3f4f6",
      whiteSpace: "nowrap" as const,
    } as React.CSSProperties,
    td: {
      padding: "10px 12px",
      borderBottom: "0.5px solid #f3f4f6",
      color: "#1a1a1a",
    } as React.CSSProperties,
    input: {
      border: "0.5px solid #d1d5db",
      borderRadius: 8,
      padding: "8px 14px",
      fontSize: 13,
      outline: "none",
      background: "#fff",
      color: "#1a1a1a",
      minWidth: 200,
    } as React.CSSProperties,
    select: {
      border: "0.5px solid #d1d5db",
      borderRadius: 8,
      padding: "8px 14px",
      fontSize: 13,
      background: "#fff",
      color: "#1a1a1a",
      cursor: "pointer",
    } as React.CSSProperties,
  };

  if (adminLoading || loading) {
    return (
      <div
        style={{
          ...s.container,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
          <div>
            {adminLoading ? "Checking permissions…" : "Loading farm data…"}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          ...s.container,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#FCEBEB",
            border: "1px solid #E24B4A44",
            borderRadius: 12,
            padding: "20px 28px",
            color: "#791F1F",
            maxWidth: 400,
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={s.headerTitle}>KisanPatner — Farm Dashboard</h1>
          <p style={s.headerSub}>
            Production analytics · {allData.length} postings
            {adminData?.role === "subadmin" && adminData.taluka
              ? ` in ${adminData.taluka} taluka`
              : " loaded"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <RoleBadge adminData={adminData} />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              style={s.input}
              placeholder="Search farmer ID or type…"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <select
              style={s.select}
              value={filterType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All farming types</option>
              {farmingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={s.body}>
        <RoleInfoBanner adminData={adminData} />

        {/* ── Stats ── */}
        <div style={s.statsGrid}>
          <StatCard
            label="Total Postings"
            value={filtered.length.toLocaleString()}
            accent="#378ADD"
          />
          <StatCard label="Unique Farmers" value={uniqueFarmers} accent="#7F77DD" />
          <StatCard
            label="Total Acres"
            value={totalAcres.toLocaleString()}
            accent="#1D9E75"
          />
          <StatCard
            label="Total Production"
            value={`${(totalProduction / 1000).toFixed(1)}k`}
            accent="#D85A30"
          />
          <StatCard
            label="Red Zone"
            value={filtered.filter((r) => r.zone === "red").length}
            accent="#E24B4A"
          />
          <StatCard
            label="Yellow Zone"
            value={filtered.filter((r) => r.zone === "yellow").length}
            accent="#EF9F27"
          />
          <StatCard
            label="Green Zone"
            value={filtered.filter((r) => r.zone === "green").length}
            accent="#1D9E75"
          />
        </div>

        <div
          style={{
            ...s.twoCol,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <div style={s.section}>
            <div style={s.sectionTitle}>Production by Farming Type</div>
            <BarChart data={chartData} />
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>
              Taluk Aggregation (by production)
              {adminData?.role === "subadmin" && adminData.taluka && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#7F77DD",
                  }}
                >
                  — {adminData.taluka}
                </span>
              )}
            </div>
            <div style={{ overflowY: "auto", maxHeight: 280 }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Taluk</th>
                    <th style={s.th}>Postings</th>
                    <th style={{ ...s.th, textAlign: "right" }}>
                      Total Production
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {talukAgg.map((r) => (
                    <tr key={r.taluk}>
                      <td style={s.td}>{r.taluk}</td>
                      <td style={{ ...s.td, color: "#64748b" }}>{r.count}</td>
                      <td
                        style={{
                          ...s.td,
                          textAlign: "right",
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {r.production.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {talukAgg.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          ...s.td,
                          textAlign: "center",
                          color: "#94a3b8",
                          padding: "20px 0",
                        }}
                      >
                        No taluk data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Taluk Zone Map ── */}
        <div style={s.section}>
          <div style={s.sectionTitle}>
            Taluk Production Zone Map
            {adminData?.role === "subadmin" && adminData.taluka && (
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "#F5F3FF",
                  color: "#6d28d9",
                  border: "1px solid #DDD6FE",
                  borderRadius: 12,
                  padding: "2px 10px",
                  verticalAlign: "middle",
                }}
              >
                {adminData.taluka}
              </span>
            )}
          </div>
          <TalukZoneMap data={talukAgg} />
        </div>

        {/* ── Postings Table ── */}
        <div style={s.section}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={s.sectionTitle}>
              Postings Table
              {adminData?.role === "subadmin" && adminData.taluka && (
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "#6d28d9",
                    marginLeft: 8,
                  }}
                >
                  ({adminData.taluka} only)
                </span>
              )}
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {filtered.length} results · Page {page} of {totalPages || 1}
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {(
                    [
                      "Farmer ID",
                      "Farming Type",
                      "Seed Type",
                      "Taluk",
                      "District",
                      "State",
                      "Acres",
                      "Production",
                      "Zone",
                    ] as const
                  ).map((h) => (
                    <th
                      key={h}
                      style={
                        h === "Production" || h === "Acres"
                          ? { ...s.th, textAlign: "right" }
                          : s.th
                      }
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}
                  >
                    <td
                      style={{
                        ...s.td,
                        fontWeight: 600,
                        color: "#1e40af",
                        fontFamily: "monospace",
                      }}
                    >
                      {r.farmerId}
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: TYPE_COLORS[r.farmingType] ?? "#888",
                            display: "inline-block",
                          }}
                        />
                        {r.farmingType}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: "#64748b" }}>
                      {r.seedType || "—"}
                    </td>
                    <td style={s.td}>{r.taluk}</td>
                    <td style={{ ...s.td, color: "#64748b" }}>{r.district}</td>
                    <td style={{ ...s.td, color: "#64748b" }}>{r.state}</td>
                    <td
                      style={{
                        ...s.td,
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.acres.toLocaleString()}
                    </td>
                    <td
                      style={{
                        ...s.td,
                        textAlign: "right",
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.production.toLocaleString()}
                    </td>
                    <td style={s.td}>
                      <ZoneBadge zone={r.zone} />
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        ...s.td,
                        textAlign: "center",
                        color: "#94a3b8",
                        padding: "32px 0",
                      }}
                    >
                      {adminData?.role === "subadmin"
                        ? `No postings found in ${adminData.taluka} taluka`
                        : "No results found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "6px 16px",
                  borderRadius: 7,
                  border: "0.5px solid #d1d5db",
                  background: "#fff",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  fontSize: 13,
                  color: page === 1 ? "#ccc" : "#374151",
                }}
              >
                ← Prev
              </button>
              {Array.from(
                { length: Math.min(totalPages, 7) },
                (_, i) => i + 1
              ).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 7,
                    border: `0.5px solid ${pg === page ? "#378ADD" : "#d1d5db"}`,
                    background: pg === page ? "#378ADD" : "#fff",
                    color: pg === page ? "#fff" : "#374151",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: pg === page ? 600 : 400,
                  }}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "6px 16px",
                  borderRadius: 7,
                  border: "0.5px solid #d1d5db",
                  background: "#fff",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  fontSize: 13,
                  color: page === totalPages ? "#ccc" : "#374151",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}