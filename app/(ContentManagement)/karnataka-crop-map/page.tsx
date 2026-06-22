// "use client";
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { getAdminSessionAction } from "@/app/actions/auth-actions";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface AdminData {
//   taluka: string;
//   role: "admin" | "subadmin";
//   name?: string;
//   email?: string;
// }

// interface Posting {
//   id: string;
//   farmerId: string;
//   farmingType: string;
//   seedType: string;
//   acres: number;
//   production: number;
//   zone: Zone;
//   taluk: string;
//   district: string;
//   state: string;
//   lat: number | null;
//   lng: number | null;
// }

// interface TalukAgg {
//   taluk: string;
//   production: number;
//   count: number;
//   zone: Zone;
// }

// interface ChartEntry {
//   type: string;
//   production: number;
// }

// type Zone = "red" | "yellow" | "green";
// type FarmingType = "organic" | "regular" | "natural" | "hydroponic";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const FACTORS: Record<FarmingType, number> = {
//   organic: 1.2,
//   regular: 1.0,
//   natural: 0.9,
//   hydroponic: 1.5,
// };

// function getProduction(acres: number, farmingType: string): number {
//   return Math.round(acres * (FACTORS[farmingType as FarmingType] ?? 1.0));
// }

// function getZone(production: number): Zone {
//   if (production >= 5000) return "red";
//   if (production >= 2000) return "yellow";
//   return "green";
// }

// const ZONE_COLORS: Record<Zone, string> = {
//   red: "#E24B4A",
//   yellow: "#EF9F27",
//   green: "#1D9E75",
// };
// const ZONE_BG: Record<Zone, string> = {
//   red: "#FCEBEB",
//   yellow: "#FAEEDA",
//   green: "#EAF3DE",
// };
// const ZONE_TEXT: Record<Zone, string> = {
//   red: "#791F1F",
//   yellow: "#633806",
//   green: "#27500A",
// };
// const ZONE_BORDER: Record<Zone, string> = {
//   red: "#F09595",
//   yellow: "#FAC775",
//   green: "#C0DD97",
// };

// const TYPE_COLORS: Record<string, string> = {
//   organic: "#378ADD",
//   regular: "#1D9E75",
//   natural: "#7F77DD",
//   hydroponic: "#D85A30",
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ZoneBadge({ zone }: { zone: Zone }) {
//   return (
//     <span
//       style={{
//         background: ZONE_BG[zone],
//         color: ZONE_TEXT[zone],
//         borderRadius: 6,
//         padding: "2px 10px",
//         fontSize: 12,
//         fontWeight: 600,
//         textTransform: "uppercase",
//         letterSpacing: "0.04em",
//         border: `1px solid ${ZONE_COLORS[zone]}33`,
//         display: "inline-block",
//       }}
//     >
//       {zone}
//     </span>
//   );
// }

// function StatCard({
//   label,
//   value,
//   accent,
// }: {
//   label: string;
//   value: string | number;
//   accent: string;
// }) {
//   return (
//     <div
//       style={{
//         background: "var(--color-background-primary, #fff)",
//         border: "0.5px solid #e5e7eb",
//         borderRadius: 12,
//         padding: "1rem 1.25rem",
//         display: "flex",
//         flexDirection: "column",
//         gap: 4,
//         borderLeft: `3px solid ${accent}`,
//       }}
//     >
//       <span
//         style={{
//           fontSize: 12,
//           color: "#888",
//           fontWeight: 500,
//           letterSpacing: "0.05em",
//           textTransform: "uppercase",
//         }}
//       >
//         {label}
//       </span>
//       <span
//         style={{
//           fontSize: 26,
//           fontWeight: 700,
//           color: "#1a1a1a",
//           letterSpacing: "-0.02em",
//         }}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }

// function BarChart({ data }: { data: ChartEntry[] }) {
//   if (!data.length) return null;
//   const max = Math.max(...data.map((d) => d.production));
//   return (
//     <div style={{ padding: "1rem 0" }}>
//       {data.map((d) => (
//         <div
//           key={d.type}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             marginBottom: 10,
//           }}
//         >
//           <span
//             style={{
//               width: 88,
//               fontSize: 13,
//               color: "#555",
//               textAlign: "right",
//               fontWeight: 500,
//             }}
//           >
//             {d.type}
//           </span>
//           <div
//             style={{
//               flex: 1,
//               background: "#f3f4f6",
//               borderRadius: 6,
//               overflow: "hidden",
//               height: 26,
//             }}
//           >
//             <div
//               style={{
//                 width: `${(d.production / max) * 100}%`,
//                 background: TYPE_COLORS[d.type] ?? "#888",
//                 height: "100%",
//                 borderRadius: 6,
//                 transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
//                 display: "flex",
//                 alignItems: "center",
//                 paddingLeft: 8,
//               }}
//             >
//               <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>
//                 {d.production.toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Taluk Zone Map ───────────────────────────────────────────────────────────

// type ZoneFilter = Zone | "all";

// function TalukZoneMap({ data }: { data: TalukAgg[] }) {
//   const [activeZone, setActiveZone] = useState<ZoneFilter>("all");
//   const [tooltip, setTooltip] = useState<TalukAgg | null>(null);
//   const [hoveredId, setHoveredId] = useState<string | null>(null);

//   // ✅ All hooks are called unconditionally before any early return
//   const filtered = useMemo<TalukAgg[]>(() => {
//     return activeZone === "all"
//       ? data
//       : data.filter((d) => d.zone === activeZone);
//   }, [data, activeZone]);

//   const maxProd = useMemo<number>(
//     () => Math.max(...data.map((d) => d.production), 1),
//     [data]
//   );

//   const zoneCounts = useMemo<Record<Zone, number>>(() => {
//     const c: Record<Zone, number> = { red: 0, yellow: 0, green: 0 };
//     data.forEach((d) => {
//       if (d.zone in c) c[d.zone]++;
//     });
//     return c;
//   }, [data]);

//   // ✅ Early return AFTER all hooks
//   if (!data.length) {
//     return (
//       <div
//         style={{
//           height: 420,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           color: "#94a3b8",
//           fontSize: 14,
//         }}
//       >
//         No taluk data available
//       </div>
//     );
//   }

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Filter buttons */}
//       <div
//         style={{
//           display: "flex",
//           gap: 8,
//           marginBottom: 16,
//           flexWrap: "wrap",
//           alignItems: "center",
//         }}
//       >
//         <span
//           style={{
//             fontSize: 12,
//             color: "#888",
//             fontWeight: 500,
//             marginRight: 4,
//           }}
//         >
//           Filter:
//         </span>
//         {(
//           [
//             {
//               key: "all" as ZoneFilter,
//               label: "All zones",
//               color: "#64748b",
//               bg: "#f1f5f9",
//               border: "#cbd5e1",
//               text: "#334155",
//             },
//             {
//               key: "red" as ZoneFilter,
//               label: `Red (${zoneCounts.red})`,
//               color: ZONE_COLORS.red,
//               bg: ZONE_BG.red,
//               border: ZONE_BORDER.red,
//               text: ZONE_TEXT.red,
//             },
//             {
//               key: "yellow" as ZoneFilter,
//               label: `Yellow (${zoneCounts.yellow})`,
//               color: ZONE_COLORS.yellow,
//               bg: ZONE_BG.yellow,
//               border: ZONE_BORDER.yellow,
//               text: ZONE_TEXT.yellow,
//             },
//             {
//               key: "green" as ZoneFilter,
//               label: `Green (${zoneCounts.green})`,
//               color: ZONE_COLORS.green,
//               bg: ZONE_BG.green,
//               border: ZONE_BORDER.green,
//               text: ZONE_TEXT.green,
//             },
//           ] as const
//         ).map((z) => (
//           <button
//             key={z.key}
//             onClick={() => setActiveZone(z.key)}
//             style={{
//               padding: "4px 14px",
//               borderRadius: 20,
//               fontSize: 12,
//               fontWeight: 600,
//               cursor: "pointer",
//               border: `1.5px solid ${
//                 activeZone === z.key ? z.color : z.border
//               }`,
//               background: activeZone === z.key ? z.bg : "#fff",
//               color: activeZone === z.key ? z.text : "#64748b",
//               transition: "all 0.15s",
//               letterSpacing: "0.02em",
//               textTransform: "uppercase",
//             }}
//           >
//             {z.label}
//           </button>
//         ))}
//         <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8" }}>
//           {filtered.length} taluk{filtered.length !== 1 ? "s" : ""}
//         </span>
//       </div>

//       {/* Tile grid */}
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: 10,
//           minHeight: 300,
//           maxHeight: 360,
//           overflowY: "auto",
//           padding: "4px 2px",
//         }}
//       >
//         {filtered.map((taluk) => {
//           const sizeFrac = Math.max(0.35, taluk.production / maxProd);
//           const minW = 100,
//             maxW = 200;
//           const tileW = Math.round(minW + sizeFrac * (maxW - minW));
//           const isHovered = hoveredId === taluk.taluk;

//           return (
//             <div
//               key={taluk.taluk}
//               onMouseEnter={() => {
//                 setHoveredId(taluk.taluk);
//                 setTooltip(taluk);
//               }}
//               onMouseLeave={() => {
//                 setHoveredId(null);
//                 setTooltip(null);
//               }}
//               style={{
//                 width: tileW,
//                 borderRadius: 12,
//                 padding: "12px 14px",
//                 background: ZONE_BG[taluk.zone],
//                 border: `1.5px solid ${
//                   isHovered
//                     ? ZONE_COLORS[taluk.zone]
//                     : ZONE_BORDER[taluk.zone]
//                 }`,
//                 cursor: "default",
//                 transition:
//                   "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
//                 transform: isHovered ? "translateY(-2px)" : "none",
//                 boxShadow: isHovered
//                   ? `0 4px 16px ${ZONE_COLORS[taluk.zone]}30`
//                   : "none",
//                 flexShrink: 0,
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   marginBottom: 6,
//                 }}
//               >
//                 <span
//                   style={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: "50%",
//                     background: ZONE_COLORS[taluk.zone],
//                     display: "inline-block",
//                     flexShrink: 0,
//                   }}
//                 />
//                 <span
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 700,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.06em",
//                     color: ZONE_TEXT[taluk.zone],
//                   }}
//                 >
//                   {taluk.zone}
//                 </span>
//               </div>

//               <div
//                 style={{
//                   fontSize: 13,
//                   fontWeight: 700,
//                   color: "#1a1a1a",
//                   marginBottom: 4,
//                   lineHeight: 1.3,
//                   whiteSpace: "nowrap",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                 }}
//               >
//                 {taluk.taluk}
//               </div>

//               <div
//                 style={{
//                   fontSize: 12,
//                   color: "#555",
//                   fontVariantNumeric: "tabular-nums",
//                 }}
//               >
//                 {taluk.production.toLocaleString()} units
//               </div>

//               <div
//                 style={{
//                   marginTop: 8,
//                   background: `${ZONE_COLORS[taluk.zone]}25`,
//                   borderRadius: 4,
//                   height: 4,
//                   overflow: "hidden",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: `${(taluk.production / maxProd) * 100}%`,
//                     height: "100%",
//                     background: ZONE_COLORS[taluk.zone],
//                     borderRadius: 4,
//                     transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
//                   }}
//                 />
//               </div>

//               <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
//                 {taluk.count} posting{taluk.count !== 1 ? "s" : ""}
//               </div>
//             </div>
//           );
//         })}

//         {filtered.length === 0 && (
//           <div
//             style={{
//               width: "100%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               height: 200,
//               color: "#94a3b8",
//               fontSize: 14,
//             }}
//           >
//             No taluks in this zone
//           </div>
//         )}
//       </div>

//       {/* Tooltip */}
//       {tooltip && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 24,
//             right: 24,
//             background: "#0f172a",
//             color: "#f1f5f9",
//             borderRadius: 10,
//             padding: "10px 14px",
//             fontSize: 13,
//             pointerEvents: "none",
//             zIndex: 999,
//             minWidth: 180,
//             boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
//           }}
//         >
//           <div
//             style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}
//           >
//             {tooltip.taluk}
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               gap: 16,
//               marginBottom: 2,
//             }}
//           >
//             <span style={{ color: "#94a3b8" }}>Production</span>
//             <span style={{ fontVariantNumeric: "tabular-nums" }}>
//               {tooltip.production.toLocaleString()}
//             </span>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               gap: 16,
//               marginBottom: 2,
//             }}
//           >
//             <span style={{ color: "#94a3b8" }}>Postings</span>
//             <span>{tooltip.count}</span>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               gap: 16,
//             }}
//           >
//             <span style={{ color: "#94a3b8" }}>Zone</span>
//             <span
//               style={{
//                 color: ZONE_COLORS[tooltip.zone],
//                 fontWeight: 600,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.04em",
//               }}
//             >
//               {tooltip.zone}
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Legend */}
//       <div
//         style={{
//           display: "flex",
//           gap: 20,
//           marginTop: 14,
//           flexWrap: "wrap",
//         }}
//       >
//         <span
//           style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center" }}
//         >
//           Zone thresholds:
//         </span>
//         {(
//           [
//             { zone: "red" as Zone, label: "≥ 5,000 units" },
//             { zone: "yellow" as Zone, label: "2,000 – 4,999" },
//             { zone: "green" as Zone, label: "< 2,000 units" },
//           ] as const
//         ).map(({ zone, label }) => (
//           <span
//             key={zone}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 6,
//               fontSize: 11,
//               color: ZONE_TEXT[zone],
//             }}
//           >
//             <span
//               style={{
//                 width: 10,
//                 height: 10,
//                 borderRadius: 3,
//                 background: ZONE_COLORS[zone],
//                 display: "inline-block",
//               }}
//             />
//             {label}
//           </span>
//         ))}
//         <span
//           style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}
//         >
//           Tile size ∝ production volume
//         </span>
//       </div>
//     </div>
//   );
// }

// // ─── Role Badge ───────────────────────────────────────────────────────────────

// function RoleBadge({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;

//   const isAdmin = adminData.role === "admin";

//   return (
//     <div
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: 7,
//         background: isAdmin
//           ? "rgba(55,138,221,0.15)"
//           : "rgba(127,119,221,0.15)",
//         border: `1px solid ${isAdmin ? "#378ADD55" : "#7F77DD55"}`,
//         borderRadius: 20,
//         padding: "5px 14px 5px 10px",
//         fontSize: 12,
//         fontWeight: 600,
//         color: isAdmin ? "#378ADD" : "#7F77DD",
//         letterSpacing: "0.02em",
//       }}
//     >
//       <span
//         style={{
//           width: 7,
//           height: 7,
//           borderRadius: "50%",
//           background: isAdmin ? "#378ADD" : "#7F77DD",
//           display: "inline-block",
//         }}
//       />
//       {isAdmin
//         ? "Administrator · All Taluks"
//         : `Subadmin · ${adminData.taluka || "Unknown Taluk"}`}
//     </div>
//   );
// }

// // ─── Role Info Banner ─────────────────────────────────────────────────────────

// function RoleInfoBanner({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;

//   const isAdmin = adminData.role === "admin";

//   return (
//     <div
//       style={{
//         background: isAdmin ? "#EFF6FF" : "#F5F3FF",
//         border: `1px solid ${isAdmin ? "#BFDBFE" : "#DDD6FE"}`,
//         borderRadius: 10,
//         padding: "10px 16px",
//         marginBottom: 24,
//         display: "flex",
//         alignItems: "flex-start",
//         gap: 10,
//         fontSize: 13,
//         color: isAdmin ? "#1e40af" : "#5b21b6",
//       }}
//     >
//       <span
//         style={{
//           width: 18,
//           height: 18,
//           borderRadius: "50%",
//           background: isAdmin ? "#BFDBFE" : "#DDD6FE",
//           display: "inline-flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 11,
//           fontWeight: 700,
//           flexShrink: 0,
//           marginTop: 1,
//           color: isAdmin ? "#1d4ed8" : "#6d28d9",
//         }}
//       >
//         i
//       </span>
//       <div>
//         <strong>{isAdmin ? "Administrator View" : "Subadmin View"}:</strong>{" "}
//         {isAdmin
//           ? "You can view farm postings from all taluks across all districts."
//           : "You can only view farm postings from "}
//         {!isAdmin && (
//           <strong style={{ color: "#6d28d9" }}>{adminData.taluka}</strong>
//         )}
//         {!isAdmin && " taluka."}
//       </div>
//     </div>
//   );
// }

// // ─── Main Dashboard ───────────────────────────────────────────────────────────

// export default function FarmDashboard() {
//   const [allData, setAllData] = useState<Posting[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState<string>("");
//   const [filterType, setFilterType] = useState<string>("");
//   const [page, setPage] = useState<number>(1);

//   const [adminData, setAdminData] = useState<AdminData | null>(null);
//   const [adminLoading, setAdminLoading] = useState<boolean>(true);

//   const PAGE_SIZE = 10;

//   // ── 1. Fetch admin session ────────────────────────────────────────
//   const fetchAdminSession = useCallback(async (): Promise<void> => {
//     try {
//       const session = await getAdminSessionAction();
//       if (session?.admin) {
//         setAdminData({
//           taluka: session.admin.taluka ?? "",
//           role: session.admin.role ?? "subadmin",
//           name: session.admin.name,
//           email: session.admin.email,
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching admin session:", err);
//     } finally {
//       setAdminLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAdminSession();
//   }, [fetchAdminSession]);

//   // ── 2. Taluk filter ───────────────────────────────────────────────
//   const filterDataByTaluk = useCallback(
//     (data: Posting[]): Posting[] => {
//       if (!adminData || adminData.role !== "subadmin" || !adminData.taluka) {
//         return data;
//       }
//       const filtered = data.filter(
//         (r) =>
//           r.taluk &&
//           r.taluk.toLowerCase() === adminData.taluka.toLowerCase()
//       );
//       console.log(
//         `[FarmDashboard] Taluk filter "${adminData.taluka}": ${data.length} → ${filtered.length} records`
//       );
//       return filtered;
//     },
//     [adminData]
//   );

//   // ── 3. Fetch postings (after session is ready) ────────────────────
//   useEffect(() => {
//     if (adminLoading) return;

//     async function load(): Promise<void> {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/postings");
//         if (!res.ok) throw new Error("Failed to fetch /api/postings");
//         const json = await res.json();

//         const enriched: Posting[] = (json.data ?? []).map(
//           (p: {
//             _id: string;
//             farmerId: string;
//             farmingType: string;
//             seedType: string;
//             acres: number;
//             farmer?: {
//               personalInfo?: {
//                 taluk?: string;
//                 taluka?: string;
//                 district?: string;
//                 state?: string;
//               };
//               farmLocation?: {
//                 latitude?: string;
//                 longitude?: string;
//               };
//               taluka?: string;
//               district?: string;
//             };
//           }): Posting => {
//             const pi = p.farmer?.personalInfo ?? {};
//             const fl = p.farmer?.farmLocation ?? {};
//             const production = getProduction(p.acres, p.farmingType);

//             return {
//               id: p._id,
//               farmerId: p.farmerId,
//               farmingType: p.farmingType,
//               seedType: p.seedType,
//               acres: p.acres,
//               production,
//               zone: getZone(production),
//               taluk:
//                 pi.taluk ??
//                 pi.taluka ??
//                 p.farmer?.taluka ??
//                 p.farmer?.district ??
//                 "Unknown",
//               district: pi.district ?? "—",
//               state: pi.state ?? "—",
//               lat: parseFloat(fl.latitude ?? "") || null,
//               lng: parseFloat(fl.longitude ?? "") || null,
//             };
//           }
//         );

//         const visibleData = filterDataByTaluk(enriched);
//         setAllData(visibleData);
//       } catch (e) {
//         setError(e instanceof Error ? e.message : String(e));
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, [adminLoading, filterDataByTaluk]);

//   // ── Derived state ─────────────────────────────────────────────────
//   const filtered = useMemo<Posting[]>(() => {
//     const s = search.toLowerCase();
//     return allData.filter((r) => {
//       const matchSearch =
//         !s ||
//         r.farmerId.toLowerCase().includes(s) ||
//         r.farmingType.toLowerCase().includes(s);
//       const matchType = !filterType || r.farmingType === filterType;
//       return matchSearch && matchType;
//     });
//   }, [allData, search, filterType]);

//   const talukAgg = useMemo<TalukAgg[]>(() => {
//     const map: Record<string, TalukAgg> = {};
//     filtered.forEach((r) => {
//       if (!map[r.taluk]) {
//         map[r.taluk] = { taluk: r.taluk, production: 0, count: 0, zone: "green" };
//       }
//       map[r.taluk].production += r.production;
//       map[r.taluk].count += 1;
//       map[r.taluk].zone = getZone(map[r.taluk].production);
//     });
//     return Object.values(map).sort((a, b) => b.production - a.production);
//   }, [filtered]);

//   const chartData = useMemo<ChartEntry[]>(() => {
//     const map: Record<string, ChartEntry> = {};
//     filtered.forEach((r) => {
//       if (!map[r.farmingType]) {
//         map[r.farmingType] = { type: r.farmingType, production: 0 };
//       }
//       map[r.farmingType].production += r.production;
//     });
//     return Object.values(map).sort((a, b) => b.production - a.production);
//   }, [filtered]);

//   const totalProduction = useMemo<number>(
//     () => filtered.reduce((s, r) => s + r.production, 0),
//     [filtered]
//   );
//   const totalAcres = useMemo<number>(
//     () => filtered.reduce((s, r) => s + r.acres, 0),
//     [filtered]
//   );
//   const uniqueFarmers = useMemo<number>(
//     () => new Set(filtered.map((r) => r.farmerId)).size,
//     [filtered]
//   );

//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const farmingTypes = useMemo<string[]>(
//     () => [...new Set(allData.map((r) => r.farmingType))].filter(Boolean),
//     [allData]
//   );

//   // ── Styles ────────────────────────────────────────────────────────
//   const s = {
//     container: {
//       fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
//       background: "#f8f9fb",
//       minHeight: "100vh",
//       padding: "0 0 40px",
//     } as React.CSSProperties,
//     header: {
//       background: "#0f172a",
//       color: "#fff",
//       padding: "20px 32px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       flexWrap: "wrap",
//       gap: 12,
//     } as React.CSSProperties,
//     headerTitle: {
//       fontSize: 22,
//       fontWeight: 700,
//       letterSpacing: "-0.02em",
//       margin: 0,
//     } as React.CSSProperties,
//     headerSub: {
//       fontSize: 13,
//       color: "#94a3b8",
//       marginTop: 2,
//     } as React.CSSProperties,
//     body: {
//       maxWidth: 1400,
//       margin: "0 auto",
//       padding: "28px 24px",
//     } as React.CSSProperties,
//     section: {
//       background: "#fff",
//       border: "0.5px solid #e5e7eb",
//       borderRadius: 14,
//       padding: "20px 24px",
//       marginBottom: 24,
//     } as React.CSSProperties,
//     sectionTitle: {
//       fontSize: 15,
//       fontWeight: 600,
//       color: "#1a1a1a",
//       marginBottom: 16,
//       letterSpacing: "-0.01em",
//     } as React.CSSProperties,
//     statsGrid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//       gap: 16,
//       marginBottom: 24,
//     } as React.CSSProperties,
//     twoCol: {
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr",
//       gap: 24,
//       marginBottom: 24,
//     } as React.CSSProperties,
//     table: {
//       width: "100%",
//       borderCollapse: "collapse" as const,
//       fontSize: 13,
//     } as React.CSSProperties,
//     th: {
//       textAlign: "left" as const,
//       padding: "10px 12px",
//       fontSize: 11,
//       fontWeight: 600,
//       color: "#888",
//       textTransform: "uppercase" as const,
//       letterSpacing: "0.05em",
//       borderBottom: "1px solid #f3f4f6",
//       whiteSpace: "nowrap" as const,
//     } as React.CSSProperties,
//     td: {
//       padding: "10px 12px",
//       borderBottom: "0.5px solid #f3f4f6",
//       color: "#1a1a1a",
//     } as React.CSSProperties,
//     input: {
//       border: "0.5px solid #d1d5db",
//       borderRadius: 8,
//       padding: "8px 14px",
//       fontSize: 13,
//       outline: "none",
//       background: "#fff",
//       color: "#1a1a1a",
//       minWidth: 200,
//     } as React.CSSProperties,
//     select: {
//       border: "0.5px solid #d1d5db",
//       borderRadius: 8,
//       padding: "8px 14px",
//       fontSize: 13,
//       background: "#fff",
//       color: "#1a1a1a",
//       cursor: "pointer",
//     } as React.CSSProperties,
//   };

//   if (adminLoading || loading) {
//     return (
//       <div
//         style={{
//           ...s.container,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div style={{ textAlign: "center", color: "#64748b" }}>
//           <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
//           <div>
//             {adminLoading ? "Checking permissions…" : "Loading farm data…"}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         style={{
//           ...s.container,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <div
//           style={{
//             background: "#FCEBEB",
//             border: "1px solid #E24B4A44",
//             borderRadius: 12,
//             padding: "20px 28px",
//             color: "#791F1F",
//             maxWidth: 400,
//           }}
//         >
//           <strong>Error:</strong> {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={s.container}>
//       <link
//         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
//         rel="stylesheet"
//       />

//       {/* ── Header ── */}
//       <div style={s.header}>
//         <div>
//           <h1 style={s.headerTitle}>KisanPatner — Farm Dashboard</h1>
//           <p style={s.headerSub}>
//             Production analytics · {allData.length} postings
//             {adminData?.role === "subadmin" && adminData.taluka
//               ? ` in ${adminData.taluka} taluka`
//               : " loaded"}
//           </p>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "flex-end",
//             gap: 10,
//           }}
//         >
//           <RoleBadge adminData={adminData} />

//           <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//             <input
//               style={s.input}
//               placeholder="Search farmer ID or type…"
//               value={search}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//             />
//             <select
//               style={s.select}
//               value={filterType}
//               onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
//                 setFilterType(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="">All farming types</option>
//               {farmingTypes.map((t) => (
//                 <option key={t} value={t}>
//                   {t}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div style={s.body}>
//         <RoleInfoBanner adminData={adminData} />

//         {/* ── Stats ── */}
//         <div style={s.statsGrid}>
//           <StatCard
//             label="Total Postings"
//             value={filtered.length.toLocaleString()}
//             accent="#378ADD"
//           />
//           <StatCard label="Unique Farmers" value={uniqueFarmers} accent="#7F77DD" />
//           <StatCard
//             label="Total Acres"
//             value={totalAcres.toLocaleString()}
//             accent="#1D9E75"
//           />
//           <StatCard
//             label="Total Production"
//             value={`${(totalProduction / 1000).toFixed(1)}k`}
//             accent="#D85A30"
//           />
//           <StatCard
//             label="Red Zone"
//             value={filtered.filter((r) => r.zone === "red").length}
//             accent="#E24B4A"
//           />
//           <StatCard
//             label="Yellow Zone"
//             value={filtered.filter((r) => r.zone === "yellow").length}
//             accent="#EF9F27"
//           />
//           <StatCard
//             label="Green Zone"
//             value={filtered.filter((r) => r.zone === "green").length}
//             accent="#1D9E75"
//           />
//         </div>

//         <div
//           style={{
//             ...s.twoCol,
//             gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//           }}
//         >
//           <div style={s.section}>
//             <div style={s.sectionTitle}>Production by Farming Type</div>
//             <BarChart data={chartData} />
//           </div>

//           <div style={s.section}>
//             <div style={s.sectionTitle}>
//               Taluk Aggregation (by production)
//               {adminData?.role === "subadmin" && adminData.taluka && (
//                 <span
//                   style={{
//                     marginLeft: 8,
//                     fontSize: 12,
//                     fontWeight: 500,
//                     color: "#7F77DD",
//                   }}
//                 >
//                   — {adminData.taluka}
//                 </span>
//               )}
//             </div>
//             <div style={{ overflowY: "auto", maxHeight: 280 }}>
//               <table style={s.table}>
//                 <thead>
//                   <tr>
//                     <th style={s.th}>Taluk</th>
//                     <th style={s.th}>Postings</th>
//                     <th style={{ ...s.th, textAlign: "right" }}>
//                       Total Production
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {talukAgg.map((r) => (
//                     <tr key={r.taluk}>
//                       <td style={s.td}>{r.taluk}</td>
//                       <td style={{ ...s.td, color: "#64748b" }}>{r.count}</td>
//                       <td
//                         style={{
//                           ...s.td,
//                           textAlign: "right",
//                           fontWeight: 600,
//                           fontVariantNumeric: "tabular-nums",
//                         }}
//                       >
//                         {r.production.toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                   {talukAgg.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan={3}
//                         style={{
//                           ...s.td,
//                           textAlign: "center",
//                           color: "#94a3b8",
//                           padding: "20px 0",
//                         }}
//                       >
//                         No taluk data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* ── Taluk Zone Map ── */}
//         <div style={s.section}>
//           <div style={s.sectionTitle}>
//             Taluk Production Zone Map
//             {adminData?.role === "subadmin" && adminData.taluka && (
//               <span
//                 style={{
//                   marginLeft: 10,
//                   fontSize: 11,
//                   fontWeight: 600,
//                   background: "#F5F3FF",
//                   color: "#6d28d9",
//                   border: "1px solid #DDD6FE",
//                   borderRadius: 12,
//                   padding: "2px 10px",
//                   verticalAlign: "middle",
//                 }}
//               >
//                 {adminData.taluka}
//               </span>
//             )}
//           </div>
//           <TalukZoneMap data={talukAgg} />
//         </div>

//         {/* ── Postings Table ── */}
//         <div style={s.section}>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 16,
//               flexWrap: "wrap",
//               gap: 8,
//             }}
//           >
//             <div style={s.sectionTitle}>
//               Postings Table
//               {adminData?.role === "subadmin" && adminData.taluka && (
//                 <span
//                   style={{
//                     fontSize: 13,
//                     fontWeight: 400,
//                     color: "#6d28d9",
//                     marginLeft: 8,
//                   }}
//                 >
//                   ({adminData.taluka} only)
//                 </span>
//               )}
//             </div>
//             <span style={{ fontSize: 13, color: "#94a3b8" }}>
//               {filtered.length} results · Page {page} of {totalPages || 1}
//             </span>
//           </div>

//           <div style={{ overflowX: "auto" }}>
//             <table style={s.table}>
//               <thead>
//                 <tr>
//                   {(
//                     [
//                       "Farmer ID",
//                       "Farming Type",
//                       "Seed Type",
//                       "Taluk",
//                       "District",
//                       "State",
//                       "Acres",
//                       "Production",
//                       "Zone",
//                     ] as const
//                   ).map((h) => (
//                     <th
//                       key={h}
//                       style={
//                         h === "Production" || h === "Acres"
//                           ? { ...s.th, textAlign: "right" }
//                           : s.th
//                       }
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((r, i) => (
//                   <tr
//                     key={r.id}
//                     style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}
//                   >
//                     <td
//                       style={{
//                         ...s.td,
//                         fontWeight: 600,
//                         color: "#1e40af",
//                         fontFamily: "monospace",
//                       }}
//                     >
//                       {r.farmerId}
//                     </td>
//                     <td style={s.td}>
//                       <span
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: 6,
//                         }}
//                       >
//                         <span
//                           style={{
//                             width: 8,
//                             height: 8,
//                             borderRadius: "50%",
//                             background: TYPE_COLORS[r.farmingType] ?? "#888",
//                             display: "inline-block",
//                           }}
//                         />
//                         {r.farmingType}
//                       </span>
//                     </td>
//                     <td style={{ ...s.td, color: "#64748b" }}>
//                       {r.seedType || "—"}
//                     </td>
//                     <td style={s.td}>{r.taluk}</td>
//                     <td style={{ ...s.td, color: "#64748b" }}>{r.district}</td>
//                     <td style={{ ...s.td, color: "#64748b" }}>{r.state}</td>
//                     <td
//                       style={{
//                         ...s.td,
//                         textAlign: "right",
//                         fontVariantNumeric: "tabular-nums",
//                       }}
//                     >
//                       {r.acres.toLocaleString()}
//                     </td>
//                     <td
//                       style={{
//                         ...s.td,
//                         textAlign: "right",
//                         fontWeight: 600,
//                         fontVariantNumeric: "tabular-nums",
//                       }}
//                     >
//                       {r.production.toLocaleString()}
//                     </td>
//                     <td style={s.td}>
//                       <ZoneBadge zone={r.zone} />
//                     </td>
//                   </tr>
//                 ))}
//                 {paginated.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={9}
//                       style={{
//                         ...s.td,
//                         textAlign: "center",
//                         color: "#94a3b8",
//                         padding: "32px 0",
//                       }}
//                     >
//                       {adminData?.role === "subadmin"
//                         ? `No postings found in ${adminData.taluka} taluka`
//                         : "No results found"}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {totalPages > 1 && (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 gap: 8,
//                 marginTop: 20,
//                 flexWrap: "wrap",
//               }}
//             >
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 style={{
//                   padding: "6px 16px",
//                   borderRadius: 7,
//                   border: "0.5px solid #d1d5db",
//                   background: "#fff",
//                   cursor: page === 1 ? "not-allowed" : "pointer",
//                   fontSize: 13,
//                   color: page === 1 ? "#ccc" : "#374151",
//                 }}
//               >
//                 ← Prev
//               </button>
//               {Array.from(
//                 { length: Math.min(totalPages, 7) },
//                 (_, i) => i + 1
//               ).map((pg) => (
//                 <button
//                   key={pg}
//                   onClick={() => setPage(pg)}
//                   style={{
//                     padding: "6px 12px",
//                     borderRadius: 7,
//                     border: `0.5px solid ${pg === page ? "#378ADD" : "#d1d5db"}`,
//                     background: pg === page ? "#378ADD" : "#fff",
//                     color: pg === page ? "#fff" : "#374151",
//                     cursor: "pointer",
//                     fontSize: 13,
//                     fontWeight: pg === page ? 600 : 400,
//                   }}
//                 >
//                   {pg}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 style={{
//                   padding: "6px 16px",
//                   borderRadius: 7,
//                   border: "0.5px solid #d1d5db",
//                   background: "#fff",
//                   cursor: page === totalPages ? "not-allowed" : "pointer",
//                   fontSize: 13,
//                   color: page === totalPages ? "#ccc" : "#374151",
//                 }}
//               >
//                 Next →
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
































/////////updatewd by  sagar



// "use client";
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { getAdminSessionAction } from "@/app/actions/auth-actions";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface AdminData {
//   taluka: string;
//   role: "admin" | "subadmin";
//   name?: string;
//   email?: string;
// }
// interface Posting {
//   id: string; farmerId: string; farmingType: string; seedType: string;
//   acres: number; production: number; zone: Zone;
//   taluk: string; district: string; state: string; village: string;
//   commodity: string; lat: number | null; lng: number | null; month: string;
// }
// interface ZoneRanges {
//   green:  { min: number; max: number; color: Zone };
//   yellow: { min: number; max: number; color: Zone };
//   red:    { min: number; max: number; color: Zone };
// }
// interface CommodityRange {
//   commodity: string;
//   ranges: ZoneRanges;
//   enabled: boolean;
// }
// interface ZoneConfig {
//   level: "state" | "district" | "taluk";
//   state: string;
//   district: string;
//   taluk: string;
//   commodityRanges: CommodityRange[];
// }
// interface LocationAgg { name: string; production: number; count: number; zone: Zone; }
// interface ChartEntry { type: string; production: number; }
// interface CommodityRow {
//   commodity: string; totalArea: number;
//   status: "Good/High" | "Moderate" | "Low/Poor";
//   monthlyTrend: Record<string, TrendValue>;
//   lastThreeMonthTrend: TrendValue;
// }
// type Zone        = "red" | "yellow" | "green";
// type FarmingType = "organic" | "regular" | "natural" | "hydroponic";
// type TrendValue  = "up" | "slightly_up" | "stable" | "down" | "sharp_decline";
// type TalukAgg    = LocationAgg;

// // ─── Constants ────────────────────────────────────────────────────────────────
// const DEFAULT_ZONE_RANGES: ZoneRanges = {
//   green:  { min: 1000, max: Infinity, color: "green"  },
//   yellow: { min: 500,  max: 999,      color: "yellow" },
//   red:    { min: 0,    max: 499,      color: "red"    },
// };
// const FACTORS: Record<FarmingType, number> = { organic: 1.2, regular: 1.0, natural: 0.9, hydroponic: 1.5 };
// const SURVEY_MONTHS = [
//   "Jun 2023","Jul 2023","Aug 2023","Sep 2023","Oct 2023","Nov 2023",
//   "Dec 2023","Jan 2024","Feb 2024","Mar 2024","Apr 2024","May 2024",
// ];

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function monthFromDate(dateStr: string): string {
//   if (!dateStr) return "";
//   try {
//     const d = new Date(dateStr);
//     if (isNaN(d.getTime())) return "";
//     return d.toLocaleString("en-US", { month: "short", year: "numeric" });
//   } catch { return ""; }
// }
// function getProduction(acres: number, farmingType: string): number {
//   return Math.round(acres * (FACTORS[farmingType as FarmingType] ?? 1.0));
// }
// function getZoneFromRanges(production: number, ranges: ZoneRanges, enabled: boolean): Zone {
//   if (!enabled) {
//     if (production >= 1000) return "green";
//     if (production >= 500)  return "yellow";
//     return "red";
//   }
//   const { green, yellow, red } = ranges;
//   if (green.max === Infinity ? production >= green.min : production >= green.min && production <= green.max) return "green";
//   if (production >= yellow.min && production <= yellow.max) return "yellow";
//   if (production >= red.min    && production <= red.max)    return "red";
//   if (production >= green.min)  return "green";
//   if (production >= yellow.min) return "yellow";
//   return "red";
// }
// function getZoneForPosting(
//   production: number, commodity: string,
//   taluk: string, district: string, state: string,
//   configsMap: Record<string, ZoneConfig>
// ): Zone {
//   const talukKey = `taluk::${state}::${district}::${taluk}`.toLowerCase();
//   const distKey  = `district::${state}::${district}::`.toLowerCase();
//   const stateKey = `state::${state}::::`.toLowerCase();
//   for (const key of [talukKey, distKey, stateKey]) {
//     const cfg = configsMap[key];
//     if (cfg) {
//       const cr = cfg.commodityRanges.find(r => r.commodity.toLowerCase() === commodity.toLowerCase());
//       if (cr) return getZoneFromRanges(production, cr.ranges, cr.enabled);
//     }
//   }
//   return getZoneFromRanges(production, DEFAULT_ZONE_RANGES, true);
// }
// function buildConfigKey(cfg: ZoneConfig): string {
//   return `${cfg.level}::${cfg.state}::${cfg.district}::${cfg.taluk}`.toLowerCase();
// }
// function zoneToStatus(zone: Zone): "Good/High" | "Moderate" | "Low/Poor" {
//   if (zone === "green")  return "Good/High";
//   if (zone === "yellow") return "Moderate";
//   return "Low/Poor";
// }
// function getCommodityIcon(commodity: string): string {
//   const n = commodity.toLowerCase().trim();
//   if (n.includes("paddy")||n.includes("rice")||n.includes("wheat"))        return "🌾";
//   if (n.includes("maize")||n.includes("corn"))                             return "🌽";
//   if (n.includes("sugarcane"))                                             return "🎋";
//   if (n.includes("cotton"))                                                return "🌸";
//   if (n.includes("groundnut")||n.includes("peanut"))                       return "🥜";
//   if (n.includes("sunflower"))                                             return "🌻";
//   if (n.includes("gram")||n.includes("dal")||n.includes("pulse")||n.includes("tur")) return "🫘";
//   if (n.includes("tomato"))                                                return "🍅";
//   if (n.includes("onion"))                                                 return "🧅";
//   if (n.includes("banana")||n.includes("plantain"))                        return "🍌";
//   if (n.includes("mango"))                                                 return "🥭";
//   if (n.includes("coconut"))                                               return "🥥";
//   if (n.includes("pepper")||n.includes("chilli"))                          return "🌶️";
//   if (n.includes("ragi")||n.includes("millet")||n.includes("jowar")||n.includes("bajra")) return "🌿";
//   if (n.includes("heirloom"))                                              return "🌾";
//   if (n.includes("hybrid"))                                                return "🌱";
//   if (n.includes("naati"))                                                 return "🌿";
//   if (n.includes("gmo"))                                                   return "🧬";
//   return "🌱";
// }
// function deriveTrend(vals: number[]): TrendValue {
//   if (vals.length < 2) return "stable";
//   const recent = vals.slice(-3);
//   const older  = vals.slice(0, Math.max(1, vals.length - 3));
//   const ra = recent.reduce((a,b)=>a+b,0) / recent.length;
//   const oa = older.reduce((a,b)=>a+b,0)  / older.length;
//   if (oa === 0) return "stable";
//   const pct = ((ra - oa) / oa) * 100;
//   if (pct > 10)  return "up";
//   if (pct > 3)   return "slightly_up";
//   if (pct < -15) return "sharp_decline";
//   if (pct < -3)  return "down";
//   return "stable";
// }

// // ─── Color Maps ───────────────────────────────────────────────────────────────
// const ZONE_COLORS:  Record<Zone,string> = { green:"#1D9E75", yellow:"#EF9F27", red:"#E24B4A" };
// const ZONE_BG:      Record<Zone,string> = { green:"#EAF3DE", yellow:"#FAEEDA", red:"#FCEBEB" };
// const ZONE_TEXT:    Record<Zone,string> = { green:"#27500A", yellow:"#633806", red:"#791F1F" };
// const ZONE_BORDER:  Record<Zone,string> = { green:"#C0DD97", yellow:"#FAC775", red:"#F09595" };
// const ZONE_LABEL:   Record<Zone,string> = { green:"Good / High", yellow:"Moderate", red:"Low / Poor" };
// const STATUS_COLORS = {
//   "Good/High": { bg:"#EAF3DE", text:"#27500A", border:"#C0DD97", dot:"#1D9E75" },
//   "Moderate":  { bg:"#FFF7ED", text:"#92400e", border:"#FDE68A", dot:"#F59E0B" },
//   "Low/Poor":  { bg:"#FCEBEB", text:"#791F1F", border:"#F09595", dot:"#E24B4A" },
// };
// const TYPE_COLORS: Record<string,string> = {
//   organic:"#378ADD", regular:"#1D9E75", natural:"#7F77DD", hydroponic:"#D85A30"
// };
// function getDynamicTypeColor(type: string, index: number): string {
//   if (TYPE_COLORS[type.toLowerCase()]) return TYPE_COLORS[type.toLowerCase()];
//   const p = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#6B8E23","#CD853F"];
//   return p[index % p.length];
// }
// function getCommodityColor(commodity: string): string {
//   const colors = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#F4C542","#6B8E23"];
//   let hash = 0;
//   for (let i = 0; i < commodity.length; i++) { hash = ((hash<<5)-hash) + commodity.charCodeAt(i); hash|=0; }
//   return colors[Math.abs(hash) % colors.length];
// }

// // ─── Shared UI ────────────────────────────────────────────────────────────────
// function TrendCell({ trend, color }: { trend: TrendValue; color: string }) {
//   const map: Record<TrendValue,string> = { up:"↗", slightly_up:"↗", stable:"→", down:"↓", sharp_decline:"↘" };
//   return (
//     <span style={{ fontSize:16, color, fontWeight:700, display:"inline-block", textAlign:"center", width:"100%" }}>
//       {map[trend] ?? map.stable}
//     </span>
//   );
// }
// function Sparkline({ values, color }: { values: number[]; color: string }) {
//   if (values.length < 2) return null;
//   const max = Math.max(...values, 1);
//   const min = Math.min(...values);
//   const range = max - min || 1;
//   const W = 60, H = 20;
//   const pts = values.map((v,i) => `${(i/(values.length-1))*W},${H-((v-min)/range)*H}`).join(" ");
//   return (
//     <svg width={W} height={H} style={{ display:"block", margin:"0 auto" }}>
//       <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
//     </svg>
//   );
// }
// function ZoneBadge({ zone }: { zone: Zone }) {
//   return (
//     <span style={{ background:ZONE_BG[zone], color:ZONE_TEXT[zone], borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600, border:`1px solid ${ZONE_COLORS[zone]}33`, display:"inline-block", whiteSpace:"nowrap" }}>
//       {ZONE_LABEL[zone]}
//     </span>
//   );
// }
// function StatCard({ label, value, accent }: { label:string; value:string|number; accent:string }) {
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"1rem 1.25rem", display:"flex", flexDirection:"column", gap:4, borderLeft:`3px solid ${accent}` }}>
//       <span style={{ fontSize:12, color:"#888", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</span>
//       <span style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.02em" }}>{value}</span>
//     </div>
//   );
// }
// function BarChart({ data }: { data: ChartEntry[] }) {
//   if (!data.length) return null;
//   const max = Math.max(...data.map(d=>d.production));
//   return (
//     <div style={{ padding:"1rem 0" }}>
//       {data.map((d,i) => (
//         <div key={d.type} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
//           <span style={{ width:100, fontSize:13, color:"#555", textAlign:"right", fontWeight:500, textTransform:"capitalize" }}>{d.type}</span>
//           <div style={{ flex:1, background:"#f3f4f6", borderRadius:6, overflow:"hidden", height:26 }}>
//             <div style={{ width:`${(d.production/max)*100}%`, background:getDynamicTypeColor(d.type,i), height:"100%", borderRadius:6, display:"flex", alignItems:"center", paddingLeft:8 }}>
//               <span style={{ fontSize:11, color:"#fff", fontWeight:600 }}>{d.production.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Zone Range Fields ────────────────────────────────────────────────────────
// function ZoneRangeFields({
//   enabled, setEnabled,
//   greenMin, setGreenMin, greenMax, setGreenMax,
//   yellowMin, setYellowMin, yellowMax, setYellowMax,
//   redMin, setRedMin, redMax, setRedMax,
// }: {
//   enabled:boolean; setEnabled:(v:boolean)=>void;
//   greenMin:number; setGreenMin:(v:number)=>void; greenMax:number; setGreenMax:(v:number)=>void;
//   yellowMin:number; setYellowMin:(v:number)=>void; yellowMax:number; setYellowMax:(v:number)=>void;
//   redMin:number; setRedMin:(v:number)=>void; redMax:number; setRedMax:(v:number)=>void;
// }) {
//   return (
//     <>
//       <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
//         <label style={{ fontSize:12, fontWeight:600, color:"#333" }}>Custom ranges:</label>
//         <button onClick={()=>setEnabled(!enabled)} style={{ padding:"4px 14px", borderRadius:20, border:"none", background:enabled?"#1D9E75":"#94a3b8", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>
//           {enabled ? "ON" : "OFF"}
//         </button>
//       </div>
//       {[
//         { label:"🟢 Green Zone — Good / High Production", bg:ZONE_BG.green,   border:ZONE_BORDER.green,   tc:ZONE_TEXT.green,   min:greenMin,  max:greenMax,  setMin:setGreenMin,  setMax:setGreenMax,  note:"High production = Good performance"  },
//         { label:"🟡 Yellow Zone — Moderate Production",   bg:ZONE_BG.yellow,  border:ZONE_BORDER.yellow,  tc:ZONE_TEXT.yellow,  min:yellowMin, max:yellowMax, setMin:setYellowMin, setMax:setYellowMax, note:"Mid-range = Moderate performance"    },
//         { label:"🔴 Red Zone — Low / Poor Production",    bg:ZONE_BG.red,     border:ZONE_BORDER.red,     tc:ZONE_TEXT.red,     min:redMin,    max:redMax,    setMin:setRedMin,    setMax:setRedMax,    note:"Low production = Poor performance"   },
//       ].map(z => (
//         <div key={z.label} style={{ background:z.bg, borderRadius:12, padding:16, marginBottom:12, border:`1px solid ${z.border}` }}>
//           <div style={{ fontWeight:700, color:z.tc, marginBottom:4 }}>{z.label}</div>
//           <div style={{ fontSize:11, color:z.tc, marginBottom:10, opacity:0.8 }}>{z.note}</div>
//           <div style={{ display:"flex", gap:12 }}>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Min Production Units</label>
//               <input type="number" value={z.min ?? ""} onChange={e=>z.setMin(Number(e.target.value))} disabled={!enabled}
//                 style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
//             </div>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Max Production Units</label>
//               <input type="number" value={z.max ?? ""} onChange={e=>z.setMax(Number(e.target.value))} disabled={!enabled}
//                 style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }

// // ─── Universal Zone Range Manager ─────────────────────────────────────────────
// function ZoneRangeManager({
//   modalLevel, configs, availableStates, availableDistricts, availableTaluks,
//   allCommodities, onSave, onClose,
// }: {
//   modalLevel: "state" | "district" | "taluk";
//   configs: ZoneConfig[];
//   availableStates: string[];
//   availableDistricts: string[];
//   availableTaluks: string[];
//   allCommodities: string[];
//   onSave: (configs: ZoneConfig[]) => void;
//   onClose: () => void;
// }) {
//   const [localConfigs, setLocalConfigs] = useState<ZoneConfig[]>(()=>
//     JSON.parse(JSON.stringify(configs, (_,v)=>v===Infinity?"__INF__":v))
//       .map((c: ZoneConfig)=>({
//         ...c,
//         commodityRanges: (c.commodityRanges??[]).map((cr: CommodityRange)=>({
//           ...cr,
//           ranges: {
//             green:  { ...cr.ranges.green,  max: (cr.ranges.green.max  as unknown)==="__INF__" ? Infinity : cr.ranges.green.max  },
//             yellow: { ...cr.ranges.yellow, max: (cr.ranges.yellow.max as unknown)==="__INF__" ? Infinity : cr.ranges.yellow.max },
//             red:    { ...cr.ranges.red,    max: (cr.ranges.red.max    as unknown)==="__INF__" ? Infinity : cr.ranges.red.max    },
//           },
//         })),
//       }))
//   );

//   const [selState,     setSelState]     = useState(availableStates[0]    ?? "");
//   const [selDistrict,  setSelDistrict]  = useState(availableDistricts[0] ?? "");
//   const [selTaluk,     setSelTaluk]     = useState(availableTaluks[0]    ?? "");
//   const [customInput,  setCustomInput]  = useState("");
//   const [useCustom,    setUseCustom]    = useState(false);
//   const [selCommodity, setSelCommodity] = useState(allCommodities[0]     ?? "");
//   const [greenMin,  setGreenMin]  = useState(DEFAULT_ZONE_RANGES.green.min);
//   const [greenMax,  setGreenMax]  = useState(999999);
//   const [yellowMin, setYellowMin] = useState(DEFAULT_ZONE_RANGES.yellow.min);
//   const [yellowMax, setYellowMax] = useState(DEFAULT_ZONE_RANGES.yellow.max);
//   const [redMin,    setRedMin]    = useState(DEFAULT_ZONE_RANGES.red.min);
//   const [redMax,    setRedMax]    = useState(DEFAULT_ZONE_RANGES.red.max);
//   const [enabled,   setEnabled]   = useState(true);

//   const activeLocation = useCustom ? customInput.trim()
//     : modalLevel === "state"    ? selState
//     : modalLevel === "district" ? selDistrict
//     : selTaluk;

//   const activeKey = useMemo(() => {
//     const st = modalLevel === "state"    ? activeLocation : selState;
//     const di = modalLevel === "district" ? activeLocation : modalLevel === "taluk" ? selDistrict : "";
//     const tk = modalLevel === "taluk"    ? activeLocation : "";
//     return `${modalLevel}::${st}::${di}::${tk}`.toLowerCase();
//   }, [modalLevel, activeLocation, selState, selDistrict]);

//   const currentCfg = useMemo(() =>
//     localConfigs.find(c => buildConfigKey(c) === activeKey) ?? null,
//     [localConfigs, activeKey]
//   );

//   useEffect(() => {
//     if (!activeLocation || !selCommodity) return;
//     const cr = currentCfg?.commodityRanges.find(r => r.commodity.toLowerCase() === selCommodity.toLowerCase());
//     if (cr) {
//       setGreenMin(cr.ranges.green.min); setGreenMax(cr.ranges.green.max === Infinity ? 999999 : cr.ranges.green.max);
//       setYellowMin(cr.ranges.yellow.min); setYellowMax(cr.ranges.yellow.max);
//       setRedMin(cr.ranges.red.min); setRedMax(cr.ranges.red.max);
//       setEnabled(cr.enabled);
//     } else {
//       setGreenMin(DEFAULT_ZONE_RANGES.green.min); setGreenMax(999999);
//       setYellowMin(DEFAULT_ZONE_RANGES.yellow.min); setYellowMax(DEFAULT_ZONE_RANGES.yellow.max);
//       setRedMin(DEFAULT_ZONE_RANGES.red.min); setRedMax(DEFAULT_ZONE_RANGES.red.max);
//       setEnabled(true);
//     }
//   }, [activeLocation, selCommodity, activeKey]);

//   const handleSaveCombination = (): ZoneConfig[] => {
//     if (!activeLocation) { alert("Please select or enter a location."); return localConfigs; }
//     if (!selCommodity)   { alert("Please select a commodity."); return localConfigs; }
//     const st = modalLevel === "state"    ? activeLocation : selState;
//     const di = modalLevel === "district" ? activeLocation : modalLevel === "taluk" ? selDistrict : "";
//     const tk = modalLevel === "taluk"    ? activeLocation : "";
//     const newCR: CommodityRange = {
//       commodity: selCommodity,
//       ranges: {
//         green:  { min:greenMin,  max:greenMax===999999?Infinity:greenMax, color:"green"  },
//         yellow: { min:yellowMin, max:yellowMax, color:"yellow" },
//         red:    { min:redMin,    max:redMax,    color:"red"    },
//       },
//       enabled,
//     };
//     const existing = localConfigs.find(c => buildConfigKey(c) === activeKey);
//     let next: ZoneConfig[];
//     if (existing) {
//       next = localConfigs.map(c => {
//         if (buildConfigKey(c) !== activeKey) return c;
//         const f = c.commodityRanges.filter(r => r.commodity.toLowerCase() !== selCommodity.toLowerCase());
//         return { ...c, commodityRanges: [...f, newCR] };
//       });
//     } else {
//       next = [...localConfigs, { level:modalLevel, state:st, district:di, taluk:tk, commodityRanges:[newCR] }];
//     }
//     setLocalConfigs(next);
//     return next;
//   };

//   const handleRemove = () => {
//     if (!activeLocation || !selCommodity) return;
//     const next = localConfigs
//       .map(c => {
//         if (buildConfigKey(c) !== activeKey) return c;
//         return { ...c, commodityRanges: c.commodityRanges.filter(r => r.commodity.toLowerCase() !== selCommodity.toLowerCase()) };
//       })
//       .filter(c => c.commodityRanges.length > 0);
//     setLocalConfigs(next);
//   };

//   const currentCombinationSaved = !!currentCfg?.commodityRanges.find(r => r.commodity.toLowerCase() === selCommodity.toLowerCase());
//   const savedRows = useMemo(() => {
//     const rows: { cfg: ZoneConfig; cr: CommodityRange }[] = [];
//     localConfigs.filter(c => c.level === modalLevel).forEach(c => {
//       (c.commodityRanges ?? []).forEach(cr => rows.push({ cfg:c, cr }));
//     });
//     return rows.sort((a,b) => {
//       const la = (a.cfg.state+a.cfg.district+a.cfg.taluk).toLowerCase();
//       const lb = (b.cfg.state+b.cfg.district+b.cfg.taluk).toLowerCase();
//       return la.localeCompare(lb) || a.cr.commodity.localeCompare(b.cr.commodity);
//     });
//   }, [localConfigs, modalLevel]);

//   const levelLabel = modalLevel === "state" ? "State" : modalLevel === "district" ? "District" : "Taluk";
//   const levelIcon  = modalLevel === "state" ? "🗺"   : modalLevel === "district" ? "🏙"       : "🏛";
//   const levelColor = modalLevel === "state" ? "#D85A30" : modalLevel === "district" ? "#378ADD" : "#7F77DD";
//   const levelBg    = modalLevel === "state" ? "#FFF3EE" : modalLevel === "district" ? "#EFF6FF" : "#F5F3FF";
//   const levelBd    = modalLevel === "state" ? "#FDBA74" : modalLevel === "district" ? "#BFDBFE" : "#DDD6FE";
//   const locationOptions = modalLevel === "state" ? availableStates : modalLevel === "district" ? availableDistricts : availableTaluks;
//   const savedLocations = useMemo(() => {
//     const s = new Set(localConfigs.filter(c=>c.level===modalLevel).map(c =>
//       modalLevel==="state" ? c.state : modalLevel==="district" ? c.district : c.taluk
//     ));
//     return Array.from(s).sort();
//   }, [localConfigs, modalLevel]);
//   const allLocations = useMemo(() => {
//     const s = new Set([...locationOptions, ...savedLocations]);
//     return Array.from(s).sort();
//   }, [locationOptions, savedLocations]);

//   return (
//     <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
//       <div style={{ background:"#fff", borderRadius:16, padding:24, width:720, maxWidth:"95vw", maxHeight:"94vh", overflowY:"auto", boxShadow:"0 20px 40px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
//         <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
//           <h3 style={{ margin:0, fontSize:18, fontWeight:700 }}>{levelIcon} {levelLabel}-Level Zone Range Manager</h3>
//           <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#64748b", lineHeight:1 }}>×</button>
//         </div>
//         <p style={{ fontSize:13, color:"#64748b", marginBottom:8 }}>
//           Set production zone thresholds per <strong>{levelLabel} × Commodity</strong> combination.
//         </p>
//         <div style={{ background:levelBg, border:`1px solid ${levelBd}`, borderRadius:10, padding:"10px 14px", marginBottom:18, fontSize:12, color:levelColor }}>
//           <strong>Priority order:</strong> Taluk+Commodity &gt; District+Commodity &gt; State+Commodity &gt; Default
//         </div>
//         <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
//           {(["green","yellow","red"] as Zone[]).map(z => (
//             <span key={z} style={{ background:ZONE_BG[z], color:ZONE_TEXT[z], border:`1px solid ${ZONE_BORDER[z]}`, borderRadius:20, padding:"3px 14px", fontSize:12, fontWeight:600 }}>
//               {z==="green" ? "🟢 Good / High" : z==="yellow" ? "🟡 Moderate" : "🔴 Low / Poor"}
//             </span>
//           ))}
//         </div>

//         {/* Step 1 */}
//         <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//           <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>Step 1 — Select {levelLabel}</div>
//           {modalLevel !== "state" && (
//             <div style={{ marginBottom:10 }}>
//               <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>State</label>
//               <select value={selState} onChange={e=>setSelState(e.target.value)} style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                 <option value="">-- Select state --</option>
//                 {availableStates.map(s=><option key={s}>{s}</option>)}
//               </select>
//             </div>
//           )}
//           {modalLevel === "taluk" && (
//             <div style={{ marginBottom:10 }}>
//               <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>District</label>
//               <select value={selDistrict} onChange={e=>setSelDistrict(e.target.value)} style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                 <option value="">-- Select district --</option>
//                 {availableDistricts.map(d=><option key={d}>{d}</option>)}
//               </select>
//             </div>
//           )}
//           <div style={{ display:"flex", gap:8, marginBottom:10 }}>
//             {(["existing","custom"] as const).map(opt => (
//               <button key={opt} onClick={()=>setUseCustom(opt==="custom")}
//                 style={{ padding:"5px 14px", borderRadius:20, border:`1.5px solid ${useCustom===(opt==="custom")?levelColor:"#d1d5db"}`, background:useCustom===(opt==="custom")?levelBg:"#fff", color:useCustom===(opt==="custom")?levelColor:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer" }}>
//                 {opt==="existing" ? "Select existing" : "Enter name"}
//               </button>
//             ))}
//           </div>
//           {!useCustom ? (
//             <select value={modalLevel==="state"?selState:modalLevel==="district"?selDistrict:selTaluk}
//               onChange={e=>{ if(modalLevel==="state") setSelState(e.target.value); else if(modalLevel==="district") setSelDistrict(e.target.value); else setSelTaluk(e.target.value); }}
//               style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//               <option value="">-- Select {levelLabel.toLowerCase()} --</option>
//               {allLocations.map(l => (
//                 <option key={l} value={l}>{l}{localConfigs.some(c=>buildConfigKey(c)===`${modalLevel}::${modalLevel==="state"?l:selState}::${modalLevel==="district"?l:modalLevel==="taluk"?selDistrict:""}::${modalLevel==="taluk"?l:""}`.toLowerCase())?" ✓":""}</option>
//               ))}
//             </select>
//           ) : (
//             <input type="text" value={customInput} onChange={e=>setCustomInput(e.target.value)}
//               placeholder={`e.g. ${modalLevel==="state"?"Karnataka":"Mandya"}…`}
//               style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, boxSizing:"border-box" }}/>
//           )}
//           {activeLocation && (
//             <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCfg?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCfg?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCfg?ZONE_TEXT.green:"#64748b" }}>
//               {currentCfg ? `✓ "${activeLocation}" has ${currentCfg.commodityRanges.length} commodity config(s) saved` : `No configs saved for "${activeLocation}" yet`}
//             </div>
//           )}
//         </div>

//         {/* Step 2 */}
//         <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//           <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>Step 2 — Select Commodity</div>
//           {allCommodities.length === 0 ? (
//             <div style={{ color:"#94a3b8", fontSize:13 }}>No commodities found in data.</div>
//           ) : (
//             <>
//               <select value={selCommodity} onChange={e=>setSelCommodity(e.target.value)} style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                 <option value="">-- Select commodity --</option>
//                 {allCommodities.map(c => (
//                   <option key={c} value={c}>{getCommodityIcon(c)} {c}{currentCfg?.commodityRanges.find(r=>r.commodity.toLowerCase()===c.toLowerCase())?" ✓":""}</option>
//                 ))}
//               </select>
//               {selCommodity && activeLocation && (
//                 <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCombinationSaved?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCombinationSaved?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCombinationSaved?ZONE_TEXT.green:"#64748b" }}>
//                   {currentCombinationSaved ? `✓ Config exists for "${activeLocation}" + "${selCommodity}" — editing below` : `No config for "${activeLocation}" + "${selCommodity}" — set ranges below`}
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Step 3 */}
//         {activeLocation && selCommodity && (
//           <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:14 }}>
//               Step 3 — Zone Ranges for{" "}
//               <span style={{ color:levelColor }}>{activeLocation}</span> ×{" "}
//               <span style={{ color:"#378ADD" }}>{getCommodityIcon(selCommodity)} {selCommodity}</span>
//             </div>
//             <ZoneRangeFields
//               enabled={enabled} setEnabled={setEnabled}
//               greenMin={greenMin} setGreenMin={setGreenMin} greenMax={greenMax} setGreenMax={setGreenMax}
//               yellowMin={yellowMin} setYellowMin={setYellowMin} yellowMax={yellowMax} setYellowMax={setYellowMax}
//               redMin={redMin} setRedMin={setRedMin} redMax={redMax} setRedMax={setRedMax}
//             />
//             <div style={{ display:"flex", gap:12 }}>
//               <button onClick={()=>handleSaveCombination()}
//                 style={{ flex:1, padding:"10px 16px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
//                 Save "{activeLocation}" × "{selCommodity}"
//               </button>
//               <button onClick={handleRemove} disabled={!currentCombinationSaved}
//                 style={{ padding:"10px 16px", borderRadius:8, border:"1px solid #E24B4A", background:"#fff", color:currentCombinationSaved?"#E24B4A":"#ccc", cursor:currentCombinationSaved?"pointer":"not-allowed", fontWeight:600 }}>
//                 Remove
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Saved rows */}
//         {savedRows.length > 0 && (
//           <div style={{ marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:600, marginBottom:8, color:"#333" }}>Saved Configurations ({savedRows.length})</div>
//             <div style={{ overflowX:"auto" }}>
//               <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
//                 <thead>
//                   <tr style={{ background:"#f1f5f9" }}>
//                     <th style={{ padding:8, textAlign:"left" }}>{levelLabel}</th>
//                     <th style={{ padding:8, textAlign:"left" }}>Commodity</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.green }}>Green</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.yellow }}>Yellow</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.red }}>Red</th>
//                     <th style={{ padding:8, textAlign:"center" }}>Status</th>
//                     <th style={{ padding:8, textAlign:"center" }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {savedRows.map(({ cfg, cr }) => {
//                     const locName = modalLevel==="state" ? cfg.state : modalLevel==="district" ? cfg.district : cfg.taluk;
//                     const isActive = buildConfigKey(cfg)===activeKey && cr.commodity.toLowerCase()===selCommodity.toLowerCase();
//                     return (
//                       <tr key={`${buildConfigKey(cfg)}-${cr.commodity}`} style={{ borderBottom:"1px solid #e5e7eb", background:isActive?"#F0FDF4":"#fff" }}>
//                         <td style={{ padding:8, fontWeight:600 }}>{levelIcon} {locName}</td>
//                         <td style={{ padding:8 }}>{getCommodityIcon(cr.commodity)} {cr.commodity}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.green }}>{cr.ranges.green.min}–{cr.ranges.green.max===Infinity?"∞":cr.ranges.green.max}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.yellow }}>{cr.ranges.yellow.min}–{cr.ranges.yellow.max}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.red }}>{cr.ranges.red.min}–{cr.ranges.red.max}</td>
//                         <td style={{ padding:8, textAlign:"center" }}>
//                           <span style={{ background:cr.enabled?"#EAF3DE":"#f1f5f9", color:cr.enabled?"#27500A":"#64748b", padding:"2px 8px", borderRadius:12, fontSize:10 }}>
//                             {cr.enabled ? "Active" : "Off"}
//                           </span>
//                         </td>
//                         <td style={{ padding:8, textAlign:"center" }}>
//                           <button onClick={()=>{ setSelCommodity(cr.commodity); if(!useCustom){ if(modalLevel==="state") setSelState(cfg.state); else if(modalLevel==="district") setSelDistrict(cfg.district); else setSelTaluk(cfg.taluk); }}}
//                             style={{ fontSize:11, padding:"2px 8px", borderRadius:6, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer", color:levelColor }}>
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//         {savedRows.length === 0 && (
//           <div style={{ padding:"16px", textAlign:"center", color:"#94a3b8", fontSize:13, background:"#f8f9fb", borderRadius:10, marginBottom:16 }}>
//             No configurations saved yet. Select a {levelLabel.toLowerCase()} and commodity above to get started.
//           </div>
//         )}

//         <div style={{ display:"flex", gap:12, justifyContent:"flex-end", borderTop:"1px solid #e5e7eb", paddingTop:16 }}>
//           <button onClick={onClose} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer" }}>Cancel</button>
//           <button onClick={()=>{ const latest=handleSaveCombination(); onSave(latest); }}
//             style={{ padding:"8px 20px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
//             Save All & Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Other sub-components ─────────────────────────────────────────────────────
// function RoleBadge({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;
//   const isAdmin = adminData.role === "admin";
//   return (
//     <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:isAdmin?"rgba(55,138,221,0.15)":"rgba(127,119,221,0.15)", border:`1px solid ${isAdmin?"#378ADD55":"#7F77DD55"}`, borderRadius:20, padding:"5px 14px 5px 10px", fontSize:12, fontWeight:600, color:isAdmin?"#378ADD":"#7F77DD" }}>
//       <span style={{ width:7, height:7, borderRadius:"50%", background:isAdmin?"#378ADD":"#7F77DD", display:"inline-block" }}/>
//       {isAdmin ? "Administrator · All Locations" : `Subadmin · ${adminData.taluka || "Unknown"}`}
//     </div>
//   );
// }
// function RoleInfoBanner({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;
//   const isAdmin = adminData.role === "admin";
//   return (
//     <div style={{ background:isAdmin?"#EFF6FF":"#F5F3FF", border:`1px solid ${isAdmin?"#BFDBFE":"#DDD6FE"}`, borderRadius:10, padding:"10px 16px", marginBottom:24, display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:isAdmin?"#1e40af":"#5b21b6" }}>
//       <span style={{ width:18, height:18, borderRadius:"50%", background:isAdmin?"#BFDBFE":"#DDD6FE", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, marginTop:1, color:isAdmin?"#1d4ed8":"#6d28d9" }}>i</span>
//       <div><strong>{isAdmin?"Administrator View":"Subadmin View"}:</strong>{" "}
//         {isAdmin ? "You can manage zone ranges across all locations and view all postings." : <>You can only view postings from <strong style={{ color:"#6d28d9" }}>{adminData.taluka}</strong> taluka.</>}
//       </div>
//     </div>
//   );
// }

// type ZoneFilter = Zone | "all";

// // ─────────────────────────────────────────────────────────────────────────────
// // HIERARCHICAL ZONE MAP
// // ─────────────────────────────────────────────────────────────────────────────
// // KEY FIX: The map has its OWN internal mapState / mapDistrict state.
// // It never reads selectedState/selectedDistrict from the page-level filters.
// // It syncs FROM the page filters only when they change (via useEffect).
// // Clicking a state tile → sets mapState internally → map re-renders showing districts.
// // Clicking a district tile → sets mapDistrict internally → map shows taluks.
// // "Back" buttons inside the map reset internal state only.
// // ─────────────────────────────────────────────────────────────────────────────
// function HierarchicalZoneMap({
//   allPostings,
//   pageSelectedState,
//   pageSelectedDistrict,
// }: {
//   allPostings: Posting[];
//   pageSelectedState: string;
//   pageSelectedDistrict: string;
// }) {
//   // ── OWN internal drill-down state (independent of page filters) ──
//   const [mapState,    setMapState]    = useState<string>("");
//   const [mapDistrict, setMapDistrict] = useState<string>("");

//   // Sync when page-level filters change so map stays in sync with dropdowns
//   useEffect(() => {
//     setMapState(pageSelectedState);
//     setMapDistrict(pageSelectedDistrict);
//   }, [pageSelectedState, pageSelectedDistrict]);

//   const [activeZone, setActiveZone] = useState<ZoneFilter>("all");
//   const [tooltip,    setTooltip]    = useState<LocationAgg | null>(null);

//   // Reset zone filter when drill level changes
//   useEffect(() => { setActiveZone("all"); }, [mapState, mapDistrict]);

//   // Current view level purely from MAP's own state
//   const viewLevel: "state" | "district" | "taluk" =
//     mapDistrict ? "taluk"    :
//     mapState    ? "district" :
//                   "state";

//   // Aggregate: always from full allPostings, filtered by map's own selections
//   const aggregated = useMemo<LocationAgg[]>(() => {
//     let source = allPostings;
//     if (mapState)    source = source.filter(p => p.state    === mapState);
//     if (mapDistrict) source = source.filter(p => p.district === mapDistrict);

//     const groupField: keyof Posting =
//       viewLevel === "state"    ? "state"    :
//       viewLevel === "district" ? "district" :
//                                  "taluk";

//     const map: Record<string,{ production:number; count:number; zones:Zone[] }> = {};
//     source.forEach(p => {
//       const key = (p[groupField] as string) || "";
//       if (!key || key === "Unknown" || key === "—") return;
//       if (!map[key]) map[key] = { production:0, count:0, zones:[] };
//       map[key].production += p.production;
//       map[key].count      += 1;
//       map[key].zones.push(p.zone);
//     });

//     return Object.entries(map).map(([name, data]) => {
//       const zc: Record<Zone,number> = { green:0, yellow:0, red:0 };
//       data.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a,b) => b[1]-a[1])[0][0]) as Zone;
//       return { name, production:data.production, count:data.count, zone };
//     }).sort((a,b) => b.production - a.production);
//   }, [allPostings, mapState, mapDistrict, viewLevel]);

//   const displayData = useMemo(() =>
//     activeZone === "all" ? aggregated : aggregated.filter(d => d.zone === activeZone),
//     [aggregated, activeZone]
//   );

//   const maxProd = useMemo(() => Math.max(...aggregated.map(d=>d.production), 1), [aggregated]);

//   const zoneCounts = useMemo(() => {
//     const c: Record<Zone,number> = { red:0, yellow:0, green:0 };
//     aggregated.forEach(d => { if (d.zone in c) c[d.zone]++; });
//     return c;
//   }, [aggregated]);

//   const levelLabels = { state:"State", district:"District", taluk:"Taluk" };
//   const levelIcons  = { state:"🗺",   district:"🏙",        taluk:"🏛"    };

//   const handleTileClick = (item: LocationAgg) => {
//     if (viewLevel === "state") {
//       setMapState(item.name);
//       setMapDistrict("");
//     } else if (viewLevel === "district") {
//       setMapDistrict(item.name);
//     }
//     // taluk is leaf — no further drill
//   };

//   const handleBack = () => {
//     if (mapDistrict) { setMapDistrict(""); }
//     else if (mapState) { setMapState(""); }
//   };

//   if (!aggregated.length) {
//     return (
//       <div style={{ height:200, display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:14 }}>
//         No data available
//       </div>
//     );
//   }

//   return (
//     <div style={{ position:"relative" }}>

//       {/* ── Level header + breadcrumb ── */}
//       <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, flexWrap:"wrap" }}>
//         {/* Back button */}
//         {(mapState || mapDistrict) && (
//           <button onClick={handleBack}
//             style={{ padding:"4px 12px", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer", fontSize:12, fontWeight:600, color:"#374151", display:"flex", alignItems:"center", gap:4 }}>
//             ← Back
//           </button>
//         )}

//         {/* Breadcrumb pills */}
//         <div style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
//           <button
//             onClick={()=>{ setMapState(""); setMapDistrict(""); }}
//             style={{ padding:"4px 12px", borderRadius:20, border:`1.5px solid ${!mapState?"#0f172a":"#d1d5db"}`, background:!mapState?"#0f172a":"#fff", color:!mapState?"#fff":"#64748b", cursor:"pointer", fontSize:11, fontWeight:700 }}>
//             🗺 All States
//           </button>
//           {mapState && (
//             <>
//               <span style={{ color:"#94a3b8", fontSize:12 }}>›</span>
//               <button
//                 onClick={()=>setMapDistrict("")}
//                 style={{ padding:"4px 12px", borderRadius:20, border:`1.5px solid ${mapState&&!mapDistrict?"#378ADD":"#d1d5db"}`, background:mapState&&!mapDistrict?"#EFF6FF":"#fff", color:mapState&&!mapDistrict?"#378ADD":"#64748b", cursor:"pointer", fontSize:11, fontWeight:700 }}>
//                 🏙 {mapState}
//               </button>
//             </>
//           )}
//           {mapDistrict && (
//             <>
//               <span style={{ color:"#94a3b8", fontSize:12 }}>›</span>
//               <span style={{ padding:"4px 12px", borderRadius:20, border:"1.5px solid #7F77DD", background:"#F5F3FF", color:"#7F77DD", fontSize:11, fontWeight:700 }}>
//                 🏛 {mapDistrict}
//               </span>
//             </>
//           )}
//         </div>

//         {/* Level label */}
//         <span style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginLeft:4 }}>
//           — {levelLabels[viewLevel]}-Level View
//         </span>
//         {viewLevel !== "taluk" && (
//           <span style={{ fontSize:11, color:"#94a3b8" }}>· click a tile to drill down</span>
//         )}
//       </div>

//       {/* ── Zone filter chips ── */}
//       <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
//         <span style={{ fontSize:12, color:"#888", fontWeight:500 }}>Filter:</span>
//         {([
//           { key:"all"    as ZoneFilter, label:"All zones",                        color:"#64748b", bg:"#f1f5f9", border:"#cbd5e1", text:"#334155" },
//           { key:"green"  as ZoneFilter, label:`Good/High (${zoneCounts.green})`,  color:ZONE_COLORS.green,  bg:ZONE_BG.green,  border:ZONE_BORDER.green,  text:ZONE_TEXT.green  },
//           { key:"yellow" as ZoneFilter, label:`Moderate (${zoneCounts.yellow})`,  color:ZONE_COLORS.yellow, bg:ZONE_BG.yellow, border:ZONE_BORDER.yellow, text:ZONE_TEXT.yellow },
//           { key:"red"    as ZoneFilter, label:`Low/Poor (${zoneCounts.red})`,     color:ZONE_COLORS.red,    bg:ZONE_BG.red,    border:ZONE_BORDER.red,    text:ZONE_TEXT.red    },
//         ] as const).map(z => (
//           <button key={z.key} onClick={()=>setActiveZone(z.key)}
//             style={{ padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer", border:`1.5px solid ${activeZone===z.key?z.color:z.border}`, background:activeZone===z.key?z.bg:"#fff", color:activeZone===z.key?z.text:"#64748b" }}>
//             {z.label}
//           </button>
//         ))}
//         <span style={{ marginLeft:"auto", fontSize:12, color:"#94a3b8" }}>
//           {displayData.length} location{displayData.length !== 1 ? "s" : ""}
//         </span>
//       </div>

//       {/* ── Tiles ── */}
//       <div style={{ display:"flex", flexWrap:"wrap", gap:10, minHeight:160, maxHeight:340, overflowY:"auto", padding:"4px 2px" }}>
//         {displayData.map(item => {
//           const sizeFrac = Math.max(0.35, item.production / maxProd);
//           const tileW    = Math.round(100 + sizeFrac * 100);
//           const isLeaf   = viewLevel === "taluk";
//           return (
//             <div key={item.name}
//               onMouseEnter={()=>setTooltip(item)}
//               onMouseLeave={()=>setTooltip(null)}
//               onClick={()=>!isLeaf && handleTileClick(item)}
//               style={{
//                 width:tileW, borderRadius:12, padding:"12px 14px",
//                 background:ZONE_BG[item.zone], border:`1.5px solid ${ZONE_BORDER[item.zone]}`,
//                 cursor:isLeaf?"default":"pointer", transition:"transform 0.12s, box-shadow 0.12s",
//                 flexShrink:0,
//               }}
//               onMouseOver={e=>{ if(!isLeaf)(e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 4px 12px rgba(0,0,0,0.1)"; }}
//               onMouseOut={e=>{ (e.currentTarget as HTMLDivElement).style.transform="translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow="none"; }}
//             >
//               <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
//                 <span style={{ width:8, height:8, borderRadius:"50%", background:ZONE_COLORS[item.zone], display:"inline-block", flexShrink:0 }}/>
//                 <span style={{ fontSize:11, fontWeight:700, color:ZONE_TEXT[item.zone] }}>{ZONE_LABEL[item.zone]}</span>
//               </div>
//               <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
//                 {levelIcons[viewLevel]} {item.name}
//               </div>
//               <div style={{ fontSize:12, color:"#555" }}>{item.production.toLocaleString()} units</div>
//               <div style={{ marginTop:8, background:`${ZONE_COLORS[item.zone]}25`, borderRadius:4, height:4, overflow:"hidden" }}>
//                 <div style={{ width:`${(item.production/maxProd)*100}%`, height:"100%", background:ZONE_COLORS[item.zone], borderRadius:4 }}/>
//               </div>
//               <div style={{ marginTop:6, fontSize:11, color:"#94a3b8" }}>{item.count} posting{item.count!==1?"s":""}</div>
//               {!isLeaf && <div style={{ marginTop:4, fontSize:10, color:ZONE_TEXT[item.zone], opacity:0.7 }}>Click to drill down →</div>}
//             </div>
//           );
//         })}
//         {displayData.length === 0 && (
//           <div style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", height:160, color:"#94a3b8", fontSize:14 }}>
//             No locations in this zone
//           </div>
//         )}
//       </div>

//       {/* ── Tooltip ── */}
//       {tooltip && (
//         <div style={{ position:"fixed", bottom:24, right:24, background:"#0f172a", color:"#f1f5f9", borderRadius:10, padding:"10px 14px", fontSize:13, pointerEvents:"none", zIndex:999, minWidth:180, boxShadow:"0 8px 24px rgba(0,0,0,0.25)" }}>
//           <div style={{ fontWeight:700, marginBottom:4 }}>{tooltip.name}</div>
//           <div style={{ display:"flex", justifyContent:"space-between", gap:16, marginBottom:2 }}><span style={{ color:"#94a3b8" }}>Production</span><span>{tooltip.production.toLocaleString()}</span></div>
//           <div style={{ display:"flex", justifyContent:"space-between", gap:16, marginBottom:2 }}><span style={{ color:"#94a3b8" }}>Postings</span><span>{tooltip.count}</span></div>
//           <div style={{ display:"flex", justifyContent:"space-between", gap:16 }}><span style={{ color:"#94a3b8" }}>Zone</span><span style={{ color:ZONE_COLORS[tooltip.zone], fontWeight:600 }}>{ZONE_LABEL[tooltip.zone]}</span></div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Monthly Trend Table ──────────────────────────────────────────────────────
// function MonthlyTrendTable({ rows, months, locationLabel }: { rows: CommodityRow[]; months: string[]; locationLabel: string }) {
//   if (!rows.length) return <div style={{ padding:24, textAlign:"center", color:"#94a3b8" }}>No commodity data</div>;
//   const shortMonth = (m:string) => { const p=m.split(" "); return `${p[0]} ${(p[1]||"").slice(2)}`; };
//   return (
//     <div style={{ overflowX:"auto" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
//         Monthly Performance Trend {locationLabel && `(${locationLabel})`}
//       </div>
//       <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
//         <thead>
//           <tr style={{ background:"#f8f9fb" }}>
//             <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:120 }}>Commodity</th>
//             <th style={{ padding:"10px 8px", textAlign:"right", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Area (Acres)</th>
//             {months.map(m=>(
//               <th key={m} style={{ padding:"10px 6px", textAlign:"center", fontWeight:600, color:"#64748b", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:52 }}>{shortMonth(m)}</th>
//             ))}
//             <th style={{ padding:"10px 8px", textAlign:"center", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Trend<br/><span style={{ fontSize:10, fontWeight:400, color:"#94a3b8" }}>(Last 3 Mo)</span></th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row,ri) => {
//             const sc = STATUS_COLORS[row.status];
//             const sparkValues = months.map(m => {
//               const t = row.monthlyTrend[m] || "stable";
//               const sm: Record<TrendValue,number> = { up:5, slightly_up:4, stable:3, down:2, sharp_decline:1 };
//               return sm[t] ?? 3;
//             });
//             return (
//               <tr key={row.commodity} style={{ background:ri%2===0?"#fff":"#fafafa", borderBottom:"1px solid #f3f4f6" }}>
//                 <td style={{ padding:"10px 12px", fontWeight:600, whiteSpace:"nowrap" }}>
//                   <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
//                     <span style={{ fontSize:16 }}>{getCommodityIcon(row.commodity)}</span>{row.commodity}
//                   </span>
//                 </td>
//                 <td style={{ padding:"10px 8px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500 }}>{row.totalArea.toLocaleString()}</td>
//                 {months.map(m=>(
//                   <td key={m} style={{ padding:"10px 6px", textAlign:"center" }}>
//                     <TrendCell trend={row.monthlyTrend[m]||"stable"} color={sc.dot}/>
//                   </td>
//                 ))}
//                 <td style={{ padding:"10px 8px", textAlign:"center" }}><Sparkline values={sparkValues} color={sc.dot}/></td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:14, padding:"10px 0", borderTop:"1px solid #f3f4f6", fontSize:12, color:"#64748b" }}>
//         <span style={{ fontWeight:600, color:"#333" }}>Trend Indication:</span>
//         {[
//           {icon:"↗",label:"Improving",color:"#1D9E75"},
//           {icon:"↗",label:"Slightly Improving",color:"#4A90A4"},
//           {icon:"→",label:"Stable",color:"#888"},
//           {icon:"↓",label:"Declining",color:"#EF9F27"},
//           {icon:"↘",label:"Sharp Decline",color:"#E24B4A"},
//         ].map(t=>(
//           <span key={t.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
//             <span style={{ color:t.color, fontWeight:700, fontSize:14 }}>{t.icon}</span>
//             <span>{t.label}</span>
//           </span>
//         ))}
//       </div>
//       <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>
//         Note: Area (Acres) is the cultivated area under the respective commodity during the survey month.
//       </div>
//     </div>
//   );
// }

// function CommodityStatusPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
//   const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px", height:"100%" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>Commodity Wise Status</div>
//       {locationLabel && <div style={{ fontSize:12, color:"#64748b", marginBottom:16 }}>({locationLabel})</div>}
//       <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
//         <thead>
//           <tr style={{ background:"#f8f9fb" }}>
//             <th style={{ padding:"8px 6px", textAlign:"left",   fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Commodity</th>
//             <th style={{ padding:"8px 6px", textAlign:"right",  fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Area</th>
//             <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Status</th>
//             <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Ind.</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map(row => {
//             const sc = STATUS_COLORS[row.status];
//             return (
//               <tr key={row.commodity} style={{ borderBottom:"1px solid #f3f4f6" }}>
//                 <td style={{ padding:"9px 6px", fontWeight:500 }}>
//                   <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
//                     <span>{getCommodityIcon(row.commodity)}</span>
//                     <span style={{ fontSize:13 }}>{row.commodity}</span>
//                   </span>
//                 </td>
//                 <td style={{ padding:"9px 6px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500, fontSize:13 }}>{row.totalArea.toLocaleString()}</td>
//                 <td style={{ padding:"9px 6px", textAlign:"center" }}>
//                   <span style={{ background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{row.status}</span>
//                 </td>
//                 <td style={{ padding:"9px 6px", textAlign:"center" }}>
//                   <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
//                     <div style={{ width:32, height:4, borderRadius:2, background:sc.dot }}/>
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//         <tfoot>
//           <tr style={{ background:"#f8f9fb", borderTop:"2px solid #e5e7eb" }}>
//             <td colSpan={2} style={{ padding:"10px 6px", fontWeight:700, fontSize:13 }}>
//               Total Area (Acres) <span style={{ marginLeft:8, color:"#1a1a1a" }}>{totalArea.toLocaleString()}</span>
//             </td>
//             <td colSpan={2}/>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }

// function SummaryPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
//   const groups = {
//     "Good/High": rows.filter(r=>r.status==="Good/High"),
//     "Moderate":  rows.filter(r=>r.status==="Moderate"),
//     "Low/Poor":  rows.filter(r=>r.status==="Low/Poor"),
//   } as const;
//   const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>
//         Summary {locationLabel && `(${locationLabel})`}
//       </div>
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:20, marginTop:16 }}>
//         {(["Good/High","Moderate","Low/Poor"] as const).map(status => {
//           const sc   = STATUS_COLORS[status];
//           const grp  = groups[status];
//           const area = grp.reduce((s,r)=>s+r.totalArea, 0);
//           return (
//             <div key={status} style={{ borderLeft:`3px solid ${sc.dot}`, paddingLeft:14 }}>
//               <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
//                 <span style={{ fontWeight:700, color:sc.text, fontSize:13 }}>{status}</span>
//               </div>
//               <div style={{ fontSize:28, fontWeight:800, color:sc.dot }}>{grp.length}</div>
//               <div style={{ fontSize:12, color:"#64748b" }}>Commodities</div>
//               <div style={{ fontSize:18, fontWeight:700, marginTop:8, color:"#1a1a1a" }}>
//                 {area.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
//               </div>
//             </div>
//           );
//         })}
//         <div style={{ borderLeft:"1px solid #e5e7eb", paddingLeft:14 }}>
//           <div style={{ fontSize:12, color:"#64748b", marginBottom:6 }}>Total Commodities</div>
//           <div style={{ fontSize:28, fontWeight:800, color:"#1a1a1a" }}>{rows.length}</div>
//           <div style={{ fontSize:12, color:"#64748b", marginTop:12 }}>Total Area Surveyed</div>
//           <div style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>
//             {totalArea.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
//           </div>
//         </div>
//       </div>
//       <div style={{ marginTop:16, fontSize:11, color:"#94a3b8", borderTop:"1px solid #e5e7eb", paddingTop:10, display:"flex", gap:20, flexWrap:"wrap" }}>
//         <span>📅 Survey Period: Jun 2023 – May 2024</span>
//         <span>🗄 Source: Agriculture Department</span>
//         <span>🔄 Last Updated: 20 May 2024</span>
//       </div>
//     </div>
//   );
// }

// function LocationFilterBar({
//   selectedState, selectedDistrict, selectedTaluk, selectedVillage,
//   onSelectState, onSelectDistrict, onSelectTaluk, onSelectVillage,
//   states, districts, taluks, villages,
//   surveyMonths, selectedMonth, onSelectMonth,
// }: {
//   selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
//   onSelectState:(s:string)=>void; onSelectDistrict:(s:string)=>void; onSelectTaluk:(s:string)=>void; onSelectVillage:(s:string)=>void;
//   states:string[]; districts:string[]; taluks:string[]; villages:string[];
//   surveyMonths:string[]; selectedMonth:string; onSelectMonth:(m:string)=>void;
// }) {
//   const selStyle = (active:boolean): React.CSSProperties => ({
//     padding:"8px 14px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13,
//     background:active?"#F0FDF4":"#fff", fontWeight:active?600:400,
//     color:active?"#166534":"#374151", cursor:"pointer", minWidth:140,
//   });
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"14px 20px", marginBottom:20, display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-end" }}>
//       {[
//         { label:"📍 State",    value:selectedState,    onChange:onSelectState,    options:states,    placeholder:"All States",    disabled:false          },
//         { label:"🏙 District", value:selectedDistrict, onChange:onSelectDistrict, options:districts, placeholder:"All Districts", disabled:!selectedState   },
//         { label:"🏛 Taluk",    value:selectedTaluk,    onChange:onSelectTaluk,    options:taluks,    placeholder:"All Taluks",    disabled:!selectedDistrict},
//         { label:"🏘 Village",  value:selectedVillage,  onChange:onSelectVillage,  options:villages,  placeholder:"All Villages",  disabled:!selectedTaluk  },
//       ].map(f => (
//         <div key={f.label} style={{ display:"flex", flexDirection:"column", gap:4 }}>
//           <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{f.label}</label>
//           <select value={f.value} onChange={e=>f.onChange(e.target.value)} disabled={f.disabled}
//             style={{ ...selStyle(!!f.value), opacity:f.disabled?0.5:1 }}>
//             <option value="">{f.placeholder}</option>
//             {f.options.map(o => <option key={o} value={o}>{o}</option>)}
//           </select>
//         </div>
//       ))}
//       {surveyMonths.length > 0 && (
//         <div style={{ display:"flex", flexDirection:"column", gap:4, marginLeft:"auto" }}>
//           <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>📅 Survey Month</label>
//           <select value={selectedMonth} onChange={e=>onSelectMonth(e.target.value)} style={selStyle(!!selectedMonth)}>
//             <option value="">All Months</option>
//             {surveyMonths.map(m => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// function LocationBreadcrumb({
//   selectedState, selectedDistrict, selectedTaluk, selectedVillage, onReset,
// }: {
//   selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
//   onReset:(level:"state"|"district"|"taluk"|"village"|"all")=>void;
// }) {
//   const parts = [
//     selectedState    && { label:selectedState,    level:"state"   as const },
//     selectedDistrict && { label:selectedDistrict, level:"district"as const },
//     selectedTaluk    && { label:selectedTaluk,    level:"taluk"   as const },
//     selectedVillage  && { label:selectedVillage,  level:"village" as const },
//   ].filter(Boolean) as { label:string; level:"state"|"district"|"taluk"|"village" }[];
//   if (!parts.length) return null;
//   return (
//     <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"8px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", fontSize:13 }}>
//       <span style={{ color:"#64748b", fontWeight:500 }}>Viewing:</span>
//       <button onClick={()=>onReset("all")} style={{ background:"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:500, fontSize:13, padding:"0 4px" }}>All</button>
//       {parts.map((p,i) => (
//         <span key={p.level} style={{ display:"flex", alignItems:"center", gap:6 }}>
//           <span style={{ color:"#94a3b8" }}>›</span>
//           <button onClick={()=>onReset(p.level)}
//             style={{ background:i===parts.length-1?"#BFDBFE":"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:i===parts.length-1?700:500, fontSize:13, padding:"2px 8px", borderRadius:12 }}>
//             {p.label}
//           </button>
//         </span>
//       ))}
//     </div>
//   );
// }

// // ─── Main Dashboard ───────────────────────────────────────────────────────────
// export default function FarmDashboard() {
//   const [loading,         setLoading]         = useState(true);
//   const [error,           setError]           = useState<string|null>(null);
//   const [search,          setSearch]          = useState("");
//   const [filterType,      setFilterType]      = useState("");
//   const [filterCommodity, setFilterCommodity] = useState("");
//   const [page,            setPage]            = useState(1);
//   const [adminData,       setAdminData]       = useState<AdminData|null>(null);
//   const [adminLoading,    setAdminLoading]    = useState(true);
//   const [configsLoading,  setConfigsLoading]  = useState(true);
//   const [allConfigs,      setAllConfigs]      = useState<ZoneConfig[]>([]);
//   const [openModal,       setOpenModal]       = useState<null|"state"|"district"|"taluk">(null);
//   const [rawPostings,     setRawPostings]     = useState<Omit<Posting,"zone">[]>([]);
//   const [selectedState,   setSelectedState]   = useState("");
//   const [selectedDistrict,setSelectedDistrict]= useState("");
//   const [selectedTaluk,   setSelectedTaluk]   = useState("");
//   const [selectedVillage, setSelectedVillage] = useState("");
//   const [selectedMonth,   setSelectedMonth]   = useState("");
//   const PAGE_SIZE = 10;

//   // ── Config lookup map ─────────────────────────────────────────────────────
//   const configsMap = useMemo<Record<string,ZoneConfig>>(() => {
//     const map: Record<string,ZoneConfig> = {};
//     allConfigs.forEach(c => { map[buildConfigKey(c)] = c; });
//     return map;
//   }, [allConfigs]);

//   const allCommodities = useMemo(() => {
//     const s = new Set(rawPostings.map(r=>r.commodity).filter(v=>v&&v!=="Unknown"));
//     return Array.from(s).sort();
//   }, [rawPostings]);

//   // ── Load configs ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       setConfigsLoading(true);
//       try {
//         const res  = await fetch("/api/taluk-zone-configs");
//         if (!res.ok) throw new Error("Failed");
//         const data = await res.json();
//         const sanitized = (data.configs || []).map((c: ZoneConfig) => ({
//           level:          c.level    ?? "taluk",
//           state:          c.state    ?? "",
//           district:       c.district ?? "",
//           taluk:          c.taluk    ?? "",
//           commodityRanges: Array.isArray(c.commodityRanges) ? c.commodityRanges : [],
//         }));
//         setAllConfigs(sanitized);
//       } catch { setAllConfigs([]); }
//       finally { setConfigsLoading(false); }
//     })();
//   }, []);

//   // ── Save configs ──────────────────────────────────────────────────────────
//   const handleSaveConfigs = useCallback(async (configs: ZoneConfig[]) => {
//     try {
//       const res  = await fetch("/api/taluk-zone-configs", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ configs }) });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to save");
//       setAllConfigs(configs);
//       setOpenModal(null);
//       alert("Configurations saved successfully");
//     } catch(e) { console.error(e); alert("Failed to save configurations"); }
//   }, []);

//   // ── Auth ──────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     (async () => {
//       try {
//         const session = await getAdminSessionAction();
//         if (session?.admin) {
//           setAdminData({ taluka:session.admin.taluka??"", role:session.admin.role??"subadmin", name:session.admin.name, email:session.admin.email });
//         }
//       } catch(e) { console.error(e); }
//       finally { setAdminLoading(false); }
//     })();
//   }, []);

//   // ── Fetch postings ────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (adminLoading) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const firstRes  = await fetch("/api/postings?page=1&limit=10");
//         if (!firstRes.ok) throw new Error("Failed to fetch /api/postings");
//         const firstJson = await firstRes.json();
//         const total     = firstJson.total ?? firstJson.stats?.totalCrops ?? 0;
//         const pageSize  = firstJson.limit ?? 10;
//         const pageCount = Math.ceil(total / pageSize);
//         const allPages: unknown[][] = [firstJson.data ?? []];
//         if (pageCount > 1) {
//           const pageNums = Array.from({ length:pageCount-1 }, (_,i)=>i+2);
//           const results  = await Promise.all(pageNums.map(pg =>
//             fetch(`/api/postings?page=${pg}&limit=${pageSize}`)
//               .then(r=>r.ok?r.json():{data:[]})
//               .then(j=>(j.data??[]) as unknown[])
//           ));
//           allPages.push(...results);
//         }
//         const source: unknown[] = allPages.flat();
//         const enriched: Omit<Posting,"zone">[] = source.map((p: unknown) => {
//           const posting = p as {
//             _id:string; farmerId:string; farmingType:string; seedType:string; acres:number;
//             commodity?:string; sowingDate?:string; createdAt?:string;
//             tracking?:{cropName?:string};
//             farmer?:{
//               personalInfo?:{taluk?:string;taluka?:string;district?:string;state?:string;address?:string;villageGramaPanchayat?:string};
//               farmLocation?:{latitude?:string;longitude?:string};
//               taluka?:string; district?:string; state?:string;
//             };
//           };
//           const pi         = posting.farmer?.personalInfo ?? {};
//           const fl         = posting.farmer?.farmLocation  ?? {};
//           const commodity  = (posting.commodity||posting.tracking?.cropName||posting.seedType||"Unknown").trim();
//           const production = getProduction(posting.acres??0, posting.farmingType??"regular");
//           const taluk      = (pi.taluk??pi.taluka??posting.farmer?.taluka??"Unknown").trim();
//           const district   = (pi.district??posting.farmer?.district??"—").trim();
//           const state      = (pi.state??posting.farmer?.state??"Unknown").trim();
//           const village    = (pi.villageGramaPanchayat||pi.address||"—").trim() || "—";
//           const month      = monthFromDate(posting.sowingDate||posting.createdAt||"");
//           return {
//             id:posting._id, farmerId:posting.farmerId,
//             farmingType:(posting.farmingType??"regular").toLowerCase(),
//             seedType:posting.seedType, acres:posting.acres??0,
//             production, taluk, district, state, village, commodity,
//             lat:parseFloat(fl.latitude??"")||null, lng:parseFloat(fl.longitude??"")||null, month,
//           };
//         });
//         setRawPostings(enriched);
//       } catch(e) { setError(e instanceof Error ? e.message : String(e)); }
//       finally { setLoading(false); }
//     })();
//   }, [adminLoading]);

//   useEffect(() => {
//     if (adminData?.role==="subadmin" && adminData.taluka && !selectedTaluk)
//       setSelectedTaluk(adminData.taluka);
//   }, [adminData]);

//   // ── Recompute zones ───────────────────────────────────────────────────────
//   const allPostings = useMemo<Posting[]>(() =>
//     rawPostings.map(p => ({
//       ...p,
//       zone: getZoneForPosting(p.production, p.commodity, p.taluk, p.district, p.state, configsMap),
//     })),
//     [rawPostings, configsMap]
//   );

//   // ── Derived filter lists ──────────────────────────────────────────────────
//   const states = useMemo(() => {
//     const s = new Set(allPostings.map(r=>r.state).filter(v=>v&&v!=="Unknown"));
//     return Array.from(s).sort();
//   }, [allPostings]);

//   const districts = useMemo(() => {
//     const base = selectedState ? allPostings.filter(r=>r.state===selectedState) : allPostings;
//     const s = new Set(base.map(r=>r.district).filter(v=>v&&v!=="—"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState]);

//   const taluks = useMemo(() => {
//     let b = allPostings;
//     if (selectedState)    b = b.filter(r=>r.state===selectedState);
//     if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
//     const s = new Set(b.map(r=>r.taluk).filter(v=>v&&v!=="Unknown"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState, selectedDistrict]);

//   const villages = useMemo(() => {
//     let b = allPostings;
//     if (selectedState)    b = b.filter(r=>r.state===selectedState);
//     if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
//     if (selectedTaluk)    b = b.filter(r=>r.taluk===selectedTaluk);
//     const s = new Set(b.map(r=>r.village).filter(v=>v&&v!=="—"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState, selectedDistrict, selectedTaluk]);

//   const surveyMonths = useMemo(() => {
//     const s = new Set(allPostings.map(r=>r.month).filter(Boolean));
//     if (s.size === 0) return SURVEY_MONTHS;
//     return Array.from(s).sort((a,b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime());
//   }, [allPostings]);

//   // ── Location-filtered postings (for table / stats / charts) ──────────────
//   const locationFiltered = useMemo(() => {
//     let data = allPostings;
//     if (adminData?.role==="subadmin" && adminData.taluka)
//       data = data.filter(r => r.taluk.toLowerCase() === adminData.taluka.toLowerCase());
//     if (selectedState)    data = data.filter(r=>r.state===selectedState);
//     if (selectedDistrict) data = data.filter(r=>r.district===selectedDistrict);
//     if (selectedTaluk)    data = data.filter(r=>r.taluk===selectedTaluk);
//     if (selectedVillage)  data = data.filter(r=>r.village===selectedVillage);
//     if (selectedMonth)    data = data.filter(r=>r.month===selectedMonth);
//     return data;
//   }, [allPostings, adminData, selectedState, selectedDistrict, selectedTaluk, selectedVillage, selectedMonth]);

//   const filtered = useMemo(() => {
//     const s = search.toLowerCase();
//     return locationFiltered.filter(r => {
//       const matchSearch = !s ||
//         r.farmerId.toLowerCase().includes(s) ||
//         r.farmingType.toLowerCase().includes(s) ||
//         r.commodity.toLowerCase().includes(s) ||
//         r.taluk.toLowerCase().includes(s) ||
//         r.district.toLowerCase().includes(s) ||
//         r.village.toLowerCase().includes(s);
//       return matchSearch && (!filterType||r.farmingType===filterType) && (!filterCommodity||r.commodity===filterCommodity);
//     });
//   }, [locationFiltered, search, filterType, filterCommodity]);

//   // ── Commodity rows ────────────────────────────────────────────────────────
//   const commodityRows = useMemo<CommodityRow[]>(() => {
//     const map: Record<string,{totalArea:number;monthProds:Record<string,number[]>;totalProduction:number;zones:Zone[]}> = {};
//     filtered.forEach(r => {
//       if (!map[r.commodity]) map[r.commodity] = { totalArea:0, monthProds:{}, totalProduction:0, zones:[] };
//       map[r.commodity].totalArea      += r.acres;
//       map[r.commodity].totalProduction += r.production;
//       map[r.commodity].zones.push(r.zone);
//       const mKey = r.month || "Unknown";
//       if (!map[r.commodity].monthProds[mKey]) map[r.commodity].monthProds[mKey] = [];
//       map[r.commodity].monthProds[mKey].push(r.production);
//     });
//     const activeMonths = surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS;
//     return Object.entries(map).map(([commodity, data]) => {
//       const zoneCounts = { green:0, yellow:0, red:0 };
//       data.zones.forEach(z => zoneCounts[z]++);
//       const dominantZone = (Object.entries(zoneCounts).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
//       const monthlyTrend: Record<string,TrendValue> = {};
//       activeMonths.forEach(m => {
//         const vals = data.monthProds[m];
//         if (!vals?.length) { monthlyTrend[m]="stable"; return; }
//         const avg         = vals.reduce((a,b)=>a+b,0) / vals.length;
//         const overallVals = Object.values(data.monthProds).flat();
//         const overallAvg  = overallVals.reduce((a,b)=>a+b,0) / overallVals.length;
//         const pct         = overallAvg > 0 ? ((avg-overallAvg)/overallAvg)*100 : 0;
//         if (pct>10)       monthlyTrend[m]="up";
//         else if (pct>3)   monthlyTrend[m]="slightly_up";
//         else if (pct<-15) monthlyTrend[m]="sharp_decline";
//         else if (pct<-3)  monthlyTrend[m]="down";
//         else              monthlyTrend[m]="stable";
//       });
//       const allProdByMonth = activeMonths.map(m => { const vals=data.monthProds[m]||[]; return vals.reduce((a,b)=>a+b,0); });
//       return { commodity, totalArea:data.totalArea, status:zoneToStatus(dominantZone), monthlyTrend, lastThreeMonthTrend:deriveTrend(allProdByMonth) };
//     }).sort((a,b) => b.totalArea - a.totalArea);
//   }, [filtered, surveyMonths]);

//   // ── Aggregation table data — level depends on current dropdown depth ──────
//   const aggTableData = useMemo<TalukAgg[]>(() => {
//     const groupField: keyof Posting =
//       selectedDistrict ? "taluk"    :
//       selectedState    ? "district" :
//                          "state";
//     const map: Record<string,{production:number;count:number;zones:Zone[]}> = {};
//     filtered.forEach(r => {
//       const key = (r[groupField] as string) || "";
//       if (!key || key==="Unknown" || key==="—") return;
//       if (!map[key]) map[key] = { production:0, count:0, zones:[] };
//       map[key].production += r.production;
//       map[key].count      += 1;
//       map[key].zones.push(r.zone);
//     });
//     return Object.entries(map).map(([name, data]) => {
//       const zc: Record<Zone,number> = { green:0, yellow:0, red:0 };
//       data.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
//       return { name, production:data.production, count:data.count, zone };
//     }).sort((a,b) => b.production - a.production);
//   }, [filtered, selectedState, selectedDistrict]);

//   const configCount = (level:"state"|"district"|"taluk") =>
//     allConfigs.filter(c=>c.level===level).reduce((sum,c)=>sum+(c.commodityRanges?.length??0), 0);

//   const totalProduction = useMemo(() => filtered.reduce((s,r)=>s+r.production, 0), [filtered]);
//   const totalAcres      = useMemo(() => filtered.reduce((s,r)=>s+r.acres, 0),      [filtered]);
//   const uniqueFarmers   = useMemo(() => new Set(filtered.map(r=>r.farmerId)).size,  [filtered]);
//   const farmingTypes    = useMemo(() => [...new Set(allPostings.map(r=>r.farmingType))].filter(Boolean).sort(), [allPostings]);

//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

//   const aggLevelLabel =
//     selectedDistrict ? "Taluk"    :
//     selectedState    ? "District" :
//                        "State";

//   const locationLabel =
//     selectedVillage  ? `${selectedVillage} Village`    :
//     selectedTaluk    ? `${selectedTaluk} Taluk`        :
//     selectedDistrict ? `${selectedDistrict} District`  :
//     selectedState    ? selectedState                   : "";

//   const handleSelectState    = (s:string) => { setSelectedState(s); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
//   const handleSelectDistrict = (d:string) => { setSelectedDistrict(d); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
//   const handleSelectTaluk    = (t:string) => { setSelectedTaluk(t); setSelectedVillage(""); setPage(1); };
//   const handleBreadcrumbReset = (level:"state"|"district"|"taluk"|"village"|"all") => {
//     if      (level==="all")      { setSelectedState(""); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="state")    { setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="district") { setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="taluk")    { setSelectedVillage(""); }
//     setPage(1);
//   };

//   const activeMonths = selectedMonth
//     ? [selectedMonth]
//     : (surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS);

//   const s = {
//     container:    { fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f8f9fb", minHeight:"100vh", padding:"0 0 40px" } as React.CSSProperties,
//     header:       { background:"#0f172a", color:"#fff", padding:"20px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" as const, gap:12 } as React.CSSProperties,
//     body:         { maxWidth:1500, margin:"0 auto", padding:"28px 24px" } as React.CSSProperties,
//     section:      { background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px 24px", marginBottom:24 } as React.CSSProperties,
//     sectionTitle: { fontSize:15, fontWeight:700, color:"#1a1a1a", marginBottom:16, letterSpacing:"-0.01em" } as React.CSSProperties,
//     statsGrid:    { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:14, marginBottom:24 } as React.CSSProperties,
//     table:        { width:"100%", borderCollapse:"collapse" as const, fontSize:13 } as React.CSSProperties,
//     th:           { textAlign:"left" as const, padding:"10px 12px", fontSize:11, fontWeight:600, color:"#888", textTransform:"uppercase" as const, letterSpacing:"0.05em", borderBottom:"1px solid #f3f4f6", whiteSpace:"nowrap" as const } as React.CSSProperties,
//     td:           { padding:"10px 12px", borderBottom:"0.5px solid #f3f4f6", color:"#1a1a1a" } as React.CSSProperties,
//     input:        { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, outline:"none", background:"#fff", color:"#1a1a1a", minWidth:200 } as React.CSSProperties,
//     select:       { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, background:"#fff", color:"#1a1a1a", cursor:"pointer" } as React.CSSProperties,
//   };

//   if (adminLoading || loading || configsLoading) {
//     return (
//       <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
//         <div style={{ textAlign:"center", color:"#64748b" }}>
//           <div style={{ fontSize:32, marginBottom:12 }}>⟳</div>
//           <div>{adminLoading?"Checking permissions…":configsLoading?"Loading configurations…":"Loading farm data…"}</div>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
//         <div style={{ background:"#FCEBEB", border:"1px solid #E24B4A44", borderRadius:12, padding:"20px 28px", color:"#791F1F", maxWidth:400 }}>
//           <strong>Error:</strong> {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={s.container}>
//       <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

//       {/* ── Header ── */}
//       <div style={s.header}>
//         <div>
//           <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em", margin:0 }}>Today Crops — Your Daily Harvest</h1>
//           <p style={{ fontSize:13, color:"#94a3b8", marginTop:2, marginBottom:0 }}>Agriculture Produce Survey · Commodity &amp; Location wise Status with Monthly Trend and Area (Acres)</p>
//           {locationLabel && <p style={{ fontSize:12, color:"#60a5fa", marginTop:4, marginBottom:0 }}>📍 {locationLabel} · {filtered.length} postings</p>}
//         </div>
//         <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:16 }}>
//             <RoleBadge adminData={adminData}/>
//             <div style={{ display:"flex", gap:12, fontSize:12, fontWeight:600 }}>
//               {(["green","yellow","red"] as Zone[]).map(z => (
//                 <span key={z} style={{ display:"flex", alignItems:"center", gap:5 }}>
//                   <span style={{ width:12, height:4, borderRadius:2, background:ZONE_COLORS[z], display:"inline-block" }}/>
//                   <span style={{ color:ZONE_COLORS[z] }}>{ZONE_LABEL[z]}</span>
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//             <input style={s.input} placeholder="Search farmer, crop, village…" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
//             <select style={s.select} value={filterType} onChange={e=>{ setFilterType(e.target.value); setPage(1); }}>
//               <option value="">All farming types</option>
//               {farmingTypes.map(t => <option key={t} value={t}>{t}</option>)}
//             </select>
//             <select style={s.select} value={filterCommodity} onChange={e=>{ setFilterCommodity(e.target.value); setPage(1); }}>
//               <option value="">All commodities</option>
//               {allCommodities.map(c => <option key={c} value={c}>{getCommodityIcon(c)} {c}</option>)}
//             </select>
//             {adminData?.role==="admin" && (
//               <div style={{ display:"flex", gap:8 }}>
//                 {([
//                   { level:"state"    as const, icon:"🗺", label:"State Zones",    color:"#D85A30", bg:"#FFF3EE", bd:"#FDBA74" },
//                   { level:"district" as const, icon:"🏙", label:"District Zones", color:"#378ADD", bg:"#EFF6FF", bd:"#BFDBFE" },
//                   { level:"taluk"    as const, icon:"🏛", label:"Taluk Zones",    color:"#7F77DD", bg:"#F5F3FF", bd:"#DDD6FE" },
//                 ]).map(btn => {
//                   const count = configCount(btn.level);
//                   return (
//                     <button key={btn.level} onClick={()=>setOpenModal(btn.level)}
//                       style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${btn.bd}`, background:btn.bg, color:btn.color, cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
//                       {btn.icon} {btn.label}
//                       {count>0 && <span style={{ background:btn.color, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{count}</span>}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//           {(configCount("state")+configCount("district")+configCount("taluk")) > 0 && (
//             <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//               {(["state","district","taluk"] as const).map(level => {
//                 const count = configCount(level);
//                 if (!count) return null;
//                 const colors = { state:{c:"#D85A30",bg:"#FFF3EE",bd:"#FDBA74"}, district:{c:"#378ADD",bg:"#EFF6FF",bd:"#BFDBFE"}, taluk:{c:"#7F77DD",bg:"#F5F3FF",bd:"#DDD6FE"} };
//                 const clr = colors[level];
//                 return (
//                   <div key={level} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:clr.c, background:clr.bg, border:`1px solid ${clr.bd}`, borderRadius:20, padding:"3px 10px" }}>
//                     <span style={{ width:6, height:6, borderRadius:"50%", background:clr.c, display:"inline-block" }}/>
//                     {count} {level} override{count!==1?"s":""} active
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={s.body}>
//         <RoleInfoBanner adminData={adminData}/>

//         {allConfigs.length > 0 && (
//           <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
//             <span style={{ fontSize:13, fontWeight:600, color:"#5b21b6" }}>⚙ Zone overrides active:</span>
//             {(["state","district","taluk"] as const).map(level => {
//               const cfgs = allConfigs.filter(c=>c.level===level);
//               if (!cfgs.length) return null;
//               const colors = { state:"#D85A30", district:"#378ADD", taluk:"#7F77DD" };
//               return cfgs.map(cfg => {
//                 const locName = level==="state" ? cfg.state : level==="district" ? cfg.district : cfg.taluk;
//                 return (
//                   <span key={buildConfigKey(cfg)} style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fff", border:"1px solid #DDD6FE", borderRadius:20, padding:"2px 10px", fontSize:12, color:colors[level] }}>
//                     <span style={{ width:6, height:6, borderRadius:"50%", background:colors[level], display:"inline-block" }}/>
//                     {level}: {locName}
//                     <span style={{ color:"#94a3b8", fontSize:11 }}>({cfg.commodityRanges.length} crop{cfg.commodityRanges.length!==1?"s":""})</span>
//                   </span>
//                 );
//               });
//             })}
//           </div>
//         )}

//         <LocationFilterBar
//           selectedState={selectedState} selectedDistrict={selectedDistrict}
//           selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
//           onSelectState={handleSelectState} onSelectDistrict={handleSelectDistrict}
//           onSelectTaluk={handleSelectTaluk} onSelectVillage={v=>{ setSelectedVillage(v); setPage(1); }}
//           states={states} districts={districts} taluks={taluks} villages={villages}
//           surveyMonths={surveyMonths} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth}
//         />

//         <LocationBreadcrumb
//           selectedState={selectedState} selectedDistrict={selectedDistrict}
//           selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
//           onReset={handleBreadcrumbReset}
//         />

//         {/* Stats */}
//         <div style={s.statsGrid}>
//           <StatCard label="Total Postings"   value={filtered.length.toLocaleString()}                        accent="#378ADD"/>
//           <StatCard label="Unique Farmers"   value={uniqueFarmers}                                            accent="#7F77DD"/>
//           <StatCard label="Total Acres"      value={totalAcres.toLocaleString()}                              accent="#1D9E75"/>
//           <StatCard label="Total Production" value={`${(totalProduction/1000).toFixed(1)}k`}                  accent="#D85A30"/>
//           <StatCard label="Good / High"      value={filtered.filter(r=>r.zone==="green").length}              accent="#1D9E75"/>
//           <StatCard label="Moderate"         value={filtered.filter(r=>r.zone==="yellow").length}             accent="#EF9F27"/>
//           <StatCard label="Low / Poor"       value={filtered.filter(r=>r.zone==="red").length}                accent="#E24B4A"/>
//           <StatCard label="Commodities"      value={new Set(filtered.map(r=>r.commodity)).size}               accent="#4A90A4"/>
//         </div>

//         {/* Trend + Commodity status */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, marginBottom:24, alignItems:"start" }}>
//           <div style={s.section}><MonthlyTrendTable rows={commodityRows} months={activeMonths} locationLabel={locationLabel}/></div>
//           <CommodityStatusPanel rows={commodityRows} locationLabel={locationLabel}/>
//         </div>

//         <SummaryPanel rows={commodityRows} locationLabel={locationLabel}/>

//         {/* Charts + Aggregation table */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))", gap:24, margin:"24px 0" }}>
//           <div style={s.section}>
//             <div style={s.sectionTitle}>Production by Farming Type</div>
//             <BarChart data={[...filtered.reduce((m,r)=>{
//               if(!m.has(r.farmingType)) m.set(r.farmingType,{type:r.farmingType,production:0});
//               m.get(r.farmingType)!.production+=r.production;
//               return m;
//             },new Map<string,ChartEntry>()).values()].sort((a,b)=>b.production-a.production)}/>
//           </div>
//           <div style={s.section}>
//             <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
//               <div style={s.sectionTitle}>{aggLevelLabel}-Level Aggregation</div>
//             </div>
//             <div style={{ overflowY:"auto", maxHeight:280 }}>
//               <table style={s.table}>
//                 <thead>
//                   <tr>
//                     <th style={s.th}>{aggLevelLabel}</th>
//                     <th style={s.th}>Postings</th>
//                     <th style={{ ...s.th, textAlign:"right" }}>Total Production</th>
//                     <th style={{ ...s.th, textAlign:"center" }}>Zone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {aggTableData.map(item => (
//                     <tr key={item.name}>
//                       <td style={s.td}>{item.name}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{item.count}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{item.production.toLocaleString()}</td>
//                       <td style={{ ...s.td, textAlign:"center" }}><ZoneBadge zone={item.zone}/></td>
//                     </tr>
//                   ))}
//                   {aggTableData.length===0 && (
//                     <tr><td colSpan={4} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"24px 0" }}>No data</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* ── HIERARCHICAL ZONE MAP ── */}
//         <div style={s.section}>
//           <div style={s.sectionTitle}>
//             Production Zone Map
//             {locationLabel && (
//               <span style={{ marginLeft:10, fontSize:11, fontWeight:600, background:"#F5F3FF", color:"#6d28d9", border:"1px solid #DDD6FE", borderRadius:12, padding:"2px 10px" }}>
//                 {locationLabel}
//               </span>
//             )}
//           </div>
//           {/* KEY: pass allPostings (full data) + page filter state so map can sync on dropdown change */}
//           <HierarchicalZoneMap
//             allPostings={allPostings}
//             pageSelectedState={selectedState}
//             pageSelectedDistrict={selectedDistrict}
//           />
//         </div>

//         {/* Postings table */}
//         <div style={s.section}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
//             <div style={s.sectionTitle}>
//               Postings Table
//               {locationLabel && <span style={{ fontSize:13, fontWeight:400, color:"#6d28d9", marginLeft:8 }}>({locationLabel})</span>}
//             </div>
//             <span style={{ fontSize:13, color:"#94a3b8" }}>{filtered.length} results · Page {page} of {totalPages||1}</span>
//           </div>
//           <div style={{ overflowX:"auto" }}>
//             <table style={s.table}>
//               <thead>
//                 <tr>
//                   {(["Farmer ID","Commodity","Farming Type","Seed Type","Village","Taluk","District","State","Month","Acres","Production","Zone"] as const).map(h => (
//                     <th key={h} style={["Production","Acres"].includes(h)?{...s.th,textAlign:"right"}:s.th}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((r,i) => {
//                   const stateKey = `state::${r.state}::::`.toLowerCase();
//                   const distKey  = `district::${r.state}::${r.district}::`.toLowerCase();
//                   const talukKey = `taluk::${r.state}::${r.district}::${r.taluk}`.toLowerCase();
//                   const overrideLevel = configsMap[talukKey]?"taluk":configsMap[distKey]?"district":configsMap[stateKey]?"state":null;
//                   return (
//                     <tr key={r.id} style={{ background:i%2===0?"#fafafa":"#fff" }}>
//                       <td style={{ ...s.td, fontWeight:600, color:"#1e40af", fontFamily:"monospace" }}>{r.farmerId}</td>
//                       <td style={s.td}>
//                         <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
//                           <span style={{ width:8, height:8, borderRadius:"50%", background:getCommodityColor(r.commodity), display:"inline-block" }}/>
//                           <span>{getCommodityIcon(r.commodity)}</span>
//                           {r.commodity}
//                           {overrideLevel && (
//                             <span title={`${overrideLevel}-level zone override`}
//                               style={{ fontSize:9, background:overrideLevel==="taluk"?"#F5F3FF":overrideLevel==="district"?"#EFF6FF":"#FFF3EE", color:overrideLevel==="taluk"?"#7F77DD":overrideLevel==="district"?"#378ADD":"#D85A30", border:`1px solid ${overrideLevel==="taluk"?"#DDD6FE":overrideLevel==="district"?"#BFDBFE":"#FDBA74"}`, borderRadius:8, padding:"0 5px", fontWeight:700 }}>
//                               {overrideLevel.toUpperCase()[0]}
//                             </span>
//                           )}
//                         </span>
//                       </td>
//                       <td style={{ ...s.td, textTransform:"capitalize" }}>{r.farmingType}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.seedType||"—"}</td>
//                       <td style={s.td}>{r.village}</td>
//                       <td style={s.td}>{r.taluk}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.district}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.state}</td>
//                       <td style={{ ...s.td, color:"#64748b", whiteSpace:"nowrap" }}>{r.month||"—"}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{r.acres.toLocaleString()}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{r.production.toLocaleString()}</td>
//                       <td style={s.td}><ZoneBadge zone={r.zone}/></td>
//                     </tr>
//                   );
//                 })}
//                 {paginated.length === 0 && (
//                   <tr><td colSpan={12} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"32px 0" }}>No postings found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalPages > 1 && (
//             <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20, flexWrap:"wrap" }}>
//               <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
//                 style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===1?"not-allowed":"pointer", fontSize:13, color:page===1?"#ccc":"#374151" }}>
//                 ← Prev
//               </button>
//               {Array.from({length:Math.min(totalPages,7)},(_,i)=>i+1).map(pg => (
//                 <button key={pg} onClick={()=>setPage(pg)}
//                   style={{ padding:"6px 12px", borderRadius:7, border:`0.5px solid ${pg===page?"#378ADD":"#d1d5db"}`, background:pg===page?"#378ADD":"#fff", color:pg===page?"#fff":"#374151", cursor:"pointer", fontSize:13, fontWeight:pg===page?600:400 }}>
//                   {pg}
//                 </button>
//               ))}
//               <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
//                 style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===totalPages?"not-allowed":"pointer", fontSize:13, color:page===totalPages?"#ccc":"#374151" }}>
//                 Next →
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Zone Manager Modal */}
//       {openModal && (
//         <ZoneRangeManager
//           modalLevel={openModal}
//           configs={allConfigs}
//           availableStates={states}
//           availableDistricts={districts}
//           availableTaluks={taluks}
//           allCommodities={allCommodities}
//           onSave={handleSaveConfigs}
//           onClose={()=>setOpenModal(null)}
//         />
//       )}
//     </div>
//   );
// }













// //test
// "use client";
// import { useState, useEffect, useMemo, useCallback } from "react";
// // NOTE: Run `npm install react-simple-maps` in your project before using this file
// import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
// import { getAdminSessionAction } from "@/app/actions/auth-actions";

// // ─── GeoJSON URLs ─────────────────────────────────────────────────────────────
// const INDIA_STATES_GEO    = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";
// const INDIA_DISTRICTS_GEO = "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface AdminData {
//   taluka: string;
//   role: "admin" | "subadmin";
//   name?: string;
//   email?: string;
// }
// interface Posting {
//   id: string; farmerId: string; farmingType: string; seedType: string;
//   acres: number; production: number; zone: Zone;
//   taluk: string; district: string; state: string; village: string;
//   commodity: string; lat: number | null; lng: number | null; month: string;
// }
// interface ZoneRanges {
//   green:  { min: number; max: number; color: Zone };
//   yellow: { min: number; max: number; color: Zone };
//   red:    { min: number; max: number; color: Zone };
// }
// interface CommodityRange {
//   commodity: string;
//   ranges: ZoneRanges;
//   enabled: boolean;
// }
// interface ZoneConfig {
//   level: "state" | "district" | "taluk";
//   state: string;
//   district: string;
//   taluk: string;
//   commodityRanges: CommodityRange[];
// }
// interface LocationAgg { name: string; production: number; count: number; zone: Zone; }
// interface ChartEntry { type: string; production: number; }
// interface CommodityRow {
//   commodity: string; totalArea: number;
//   status: "Good/High" | "Moderate" | "Low/Poor";
//   monthlyTrend: Record<string, TrendValue>;
//   lastThreeMonthTrend: TrendValue;
// }
// type Zone        = "red" | "yellow" | "green";
// type FarmingType = "organic" | "regular" | "natural" | "hydroponic";
// type TrendValue  = "up" | "slightly_up" | "stable" | "down" | "sharp_decline";
// type TalukAgg    = LocationAgg;

// // ─── Constants ────────────────────────────────────────────────────────────────
// const DEFAULT_ZONE_RANGES: ZoneRanges = {
//   green:  { min: 1000, max: Infinity, color: "green"  },
//   yellow: { min: 500,  max: 999,      color: "yellow" },
//   red:    { min: 0,    max: 499,      color: "red"    },
// };
// const FACTORS: Record<FarmingType, number> = { organic: 1.2, regular: 1.0, natural: 0.9, hydroponic: 1.5 };
// const SURVEY_MONTHS = [
//   "Jun 2023","Jul 2023","Aug 2023","Sep 2023","Oct 2023","Nov 2023",
//   "Dec 2023","Jan 2024","Feb 2024","Mar 2024","Apr 2024","May 2024",
// ];

// // ─── FIX 1: Comprehensive state name map covering ALL Indian states ────────────
// // Maps any spelling/variant (lowercase) → exact GeoJSON NAME_1 value
// const STATE_NAME_MAP: Record<string, string> = {
//   // Karnataka
//   "karnataka":               "Karnataka",
//   // Andhra Pradesh / Telangana (GeoJSON may still show "Andhra Pradesh" for both)
//   "andhra pradesh":          "Andhra Pradesh",
//   "telangana":               "Andhra Pradesh",
//   // Tamil Nadu
//   "tamil nadu":              "Tamil Nadu",
//   "tamilnadu":               "Tamil Nadu",
//   // Kerala
//   "kerala":                  "Kerala",
//   // Maharashtra
//   "maharashtra":             "Maharashtra",
//   // Gujarat
//   "gujarat":                 "Gujarat",
//   // Rajasthan
//   "rajasthan":               "Rajasthan",
//   // Madhya Pradesh
//   "madhya pradesh":          "Madhya Pradesh",
//   "mp":                      "Madhya Pradesh",
//   // Uttar Pradesh
//   "uttar pradesh":           "Uttar Pradesh",
//   "up":                      "Uttar Pradesh",
//   // Bihar
//   "bihar":                   "Bihar",
//   // West Bengal
//   "west bengal":             "West Bengal",
//   "westbengal":              "West Bengal",
//   // Odisha — GeoJSON uses "Orissa"
//   "odisha":                  "Orissa",
//   "orissa":                  "Orissa",
//   // Chhattisgarh
//   "chhattisgarh":            "Chhattisgarh",
//   "chattisgarh":             "Chhattisgarh",
//   // Jharkhand
//   "jharkhand":               "Jharkhand",
//   // Assam
//   "assam":                   "Assam",
//   // Punjab
//   "punjab":                  "Punjab",
//   // Haryana
//   "haryana":                 "Haryana",
//   // Himachal Pradesh
//   "himachal pradesh":        "Himachal Pradesh",
//   "himachalpradesh":         "Himachal Pradesh",
//   "hp":                      "Himachal Pradesh",
//   // Uttarakhand — GeoJSON uses "Uttaranchal"
//   "uttarakhand":             "Uttaranchal",
//   "uttaranchal":             "Uttaranchal",
//   "uk":                      "Uttaranchal",
//   // Goa
//   "goa":                     "Goa",
//   // Delhi / NCT of Delhi
//   "delhi":                   "Delhi",
//   "nct of delhi":            "Delhi",
//   "nct delhi":               "Delhi",
//   // Sikkim
//   "sikkim":                  "Sikkim",
//   // Arunachal Pradesh
//   "arunachal pradesh":       "Arunachal Pradesh",
//   "arunachalpradesh":        "Arunachal Pradesh",
//   // Nagaland
//   "nagaland":                "Nagaland",
//   // Manipur
//   "manipur":                 "Manipur",
//   // Mizoram
//   "mizoram":                 "Mizoram",
//   // Tripura
//   "tripura":                 "Tripura",
//   // Meghalaya
//   "meghalaya":               "Meghalaya",
//   // Jammu & Kashmir
//   "jammu and kashmir":       "Jammu and Kashmir",
//   "jammu & kashmir":         "Jammu and Kashmir",
//   "j&k":                     "Jammu and Kashmir",
//   "jk":                      "Jammu and Kashmir",
//   // Ladakh (may not be in older GeoJSON — falls to trim)
//   "ladakh":                  "Ladakh",
//   // Andaman & Nicobar
//   "andaman and nicobar islands": "Andaman and Nicobar",
//   "andaman & nicobar":       "Andaman and Nicobar",
//   "andaman":                 "Andaman and Nicobar",
//   // Chandigarh
//   "chandigarh":              "Chandigarh",
//   // Dadra and Nagar Haveli
//   "dadra and nagar haveli":  "Dadra and Nagar Haveli",
//   "dadra & nagar haveli":    "Dadra and Nagar Haveli",
//   // Daman and Diu
//   "daman and diu":           "Daman and Diu",
//   "daman & diu":             "Daman and Diu",
//   // Lakshadweep
//   "lakshadweep":             "Lakshadweep",
//   // Puducherry / Pondicherry
//   "puducherry":              "Puducherry",
//   "pondicherry":             "Puducherry",
// };

// function normalizeStateName(name: string): string {
//   const key = name.toLowerCase().trim();
//   return STATE_NAME_MAP[key] ?? name.trim();
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function norm(s: string): string {
//   return (s ?? "").trim().toLowerCase();
// }
// function monthFromDate(dateStr: string): string {
//   if (!dateStr) return "";
//   try {
//     const d = new Date(dateStr);
//     if (isNaN(d.getTime())) return "";
//     return d.toLocaleString("en-US", { month: "short", year: "numeric" });
//   } catch { return ""; }
// }
// function getProduction(acres: number, farmingType: string): number {
//   return Math.round(acres * (FACTORS[farmingType as FarmingType] ?? 1.0));
// }
// function getZoneFromRanges(production: number, ranges: ZoneRanges, enabled: boolean): Zone {
//   if (!enabled) {
//     if (production >= DEFAULT_ZONE_RANGES.green.min)  return "green";
//     if (production >= DEFAULT_ZONE_RANGES.yellow.min) return "yellow";
//     return "red";
//   }
//   const { green, yellow, red } = ranges;
//   const greenMax  = (green.max  as unknown) === "__INF__" || green.max  === Infinity ? Infinity : green.max;
//   const yellowMax = (yellow.max as unknown) === "__INF__" || yellow.max === Infinity ? Infinity : yellow.max;
//   const redMax    = (red.max    as unknown) === "__INF__" || red.max    === Infinity ? Infinity : red.max;
//   if (production >= green.min  && (greenMax  === Infinity || production <= greenMax))  return "green";
//   if (production >= yellow.min && (yellowMax === Infinity || production <= yellowMax)) return "yellow";
//   if (production >= red.min    && (redMax    === Infinity || production <= redMax))    return "red";
//   if (production >= green.min)  return "green";
//   if (production >= yellow.min) return "yellow";
//   return "red";
// }
// function buildConfigKey(cfg: { level: string; state: string; district: string; taluk: string }): string {
//   return `${norm(cfg.level)}::${norm(cfg.state)}::${norm(cfg.district)}::${norm(cfg.taluk)}`;
// }
// function getZoneForPosting(
//   production: number, commodity: string, taluk: string,
//   district: string, state: string, configsMap: Record<string, ZoneConfig>
// ): Zone {
//   const talukKey = buildConfigKey({ level: "taluk",    state, district, taluk });
//   const distKey  = buildConfigKey({ level: "district", state, district, taluk: "" });
//   const stateKey = buildConfigKey({ level: "state",    state, district: "", taluk: "" });
//   for (const key of [talukKey, distKey, stateKey]) {
//     const cfg = configsMap[key];
//     if (cfg) {
//       const cr = cfg.commodityRanges.find(r => norm(r.commodity) === norm(commodity));
//       if (cr) return getZoneFromRanges(production, cr.ranges, cr.enabled);
//     }
//   }
//   return getZoneFromRanges(production, DEFAULT_ZONE_RANGES, true);
// }
// function zoneToStatus(zone: Zone): "Good/High" | "Moderate" | "Low/Poor" {
//   if (zone === "green")  return "Good/High";
//   if (zone === "yellow") return "Moderate";
//   return "Low/Poor";
// }
// function getCommodityIcon(commodity: string): string {
//   const n = commodity.toLowerCase().trim();
//   if (n.includes("paddy")||n.includes("rice")||n.includes("wheat"))        return "🌾";
//   if (n.includes("maize")||n.includes("corn"))                             return "🌽";
//   if (n.includes("sugarcane"))                                             return "🎋";
//   if (n.includes("cotton"))                                                return "🌸";
//   if (n.includes("groundnut")||n.includes("peanut"))                       return "🥜";
//   if (n.includes("sunflower"))                                             return "🌻";
//   if (n.includes("gram")||n.includes("dal")||n.includes("pulse")||n.includes("tur")) return "🫘";
//   if (n.includes("tomato"))                                                return "🍅";
//   if (n.includes("onion"))                                                 return "🧅";
//   if (n.includes("banana")||n.includes("plantain"))                        return "🍌";
//   if (n.includes("mango"))                                                 return "🥭";
//   if (n.includes("coconut"))                                               return "🥥";
//   if (n.includes("pepper")||n.includes("chilli"))                          return "🌶️";
//   if (n.includes("ragi")||n.includes("millet")||n.includes("jowar")||n.includes("bajra")) return "🌿";
//   if (n.includes("heirloom"))                                              return "🌾";
//   if (n.includes("hybrid"))                                                return "🌱";
//   if (n.includes("naati"))                                                 return "🌿";
//   if (n.includes("gmo"))                                                   return "🧬";
//   return "🌱";
// }
// function deriveTrend(vals: number[]): TrendValue {
//   if (vals.length < 2) return "stable";
//   const recent = vals.slice(-3);
//   const older  = vals.slice(0, Math.max(1, vals.length - 3));
//   const ra = recent.reduce((a,b)=>a+b,0) / recent.length;
//   const oa = older.reduce((a,b)=>a+b,0)  / older.length;
//   if (oa === 0) return "stable";
//   const pct = ((ra - oa) / oa) * 100;
//   if (pct > 10)  return "up";
//   if (pct > 3)   return "slightly_up";
//   if (pct < -15) return "sharp_decline";
//   if (pct < -3)  return "down";
//   return "stable";
// }

// // ─── FIX 2: Fuzzy name matcher for aggMap lookups ─────────────────────────────
// // Tries exact norm match first, then partial containment match
// function lookupAggMap<T>(
//   aggMap: Record<string, T>,
//   rawGeoName: string
// ): T | undefined {
//   const key = norm(rawGeoName);
//   // 1. exact match
//   if (aggMap[key] !== undefined) return aggMap[key];
//   // 2. partial: geo name contains DB name or vice versa
//   for (const [k, v] of Object.entries(aggMap)) {
//     if (key.includes(k) || k.includes(key)) return v;
//   }
//   return undefined;
// }

// // ─── FIX 3: State filter matcher — robust fuzzy match ─────────────────────────
// // Used inside Geographies filter to match GeoJSON NAME_1 against our selected state
// function stateMatches(geoStateName: string, filterStateName: string): boolean {
//   if (!filterStateName) return false;
//   const gn = norm(geoStateName);
//   const fn = norm(filterStateName);
//   if (gn === fn) return true;
//   // normalize both sides through the map
//   const normalizedGeo    = norm(normalizeStateName(geoStateName));
//   const normalizedFilter = norm(normalizeStateName(filterStateName));
//   if (normalizedGeo === normalizedFilter) return true;
//   // partial containment fallback
//   if (gn.includes(fn) || fn.includes(gn)) return true;
//   if (normalizedGeo.includes(normalizedFilter) || normalizedFilter.includes(normalizedGeo)) return true;
//   return false;
// }

// // ─── Color Maps ───────────────────────────────────────────────────────────────
// const ZONE_COLORS:  Record<Zone,string> = { green:"#1D9E75", yellow:"#EF9F27", red:"#E24B4A" };
// const ZONE_BG:      Record<Zone,string> = { green:"#EAF3DE", yellow:"#FAEEDA", red:"#FCEBEB" };
// const ZONE_TEXT:    Record<Zone,string> = { green:"#27500A", yellow:"#633806", red:"#791F1F" };
// const ZONE_BORDER:  Record<Zone,string> = { green:"#C0DD97", yellow:"#FAC775", red:"#F09595" };
// const ZONE_LABEL:   Record<Zone,string> = { green:"Good / High", yellow:"Moderate", red:"Low / Poor" };
// const STATUS_COLORS = {
//   "Good/High": { bg:"#EAF3DE", text:"#27500A", border:"#C0DD97", dot:"#1D9E75" },
//   "Moderate":  { bg:"#FFF7ED", text:"#92400e", border:"#FDE68A", dot:"#F59E0B" },
//   "Low/Poor":  { bg:"#FCEBEB", text:"#791F1F", border:"#F09595", dot:"#E24B4A" },
// };
// const TYPE_COLORS: Record<string,string> = {
//   organic:"#378ADD", regular:"#1D9E75", natural:"#7F77DD", hydroponic:"#D85A30"
// };
// function getDynamicTypeColor(type: string, index: number): string {
//   if (TYPE_COLORS[type.toLowerCase()]) return TYPE_COLORS[type.toLowerCase()];
//   const p = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#6B8E23","#CD853F"];
//   return p[index % p.length];
// }
// function getCommodityColor(commodity: string): string {
//   const colors = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#F4C542","#6B8E23"];
//   let hash = 0;
//   for (let i = 0; i < commodity.length; i++) { hash = ((hash<<5)-hash) + commodity.charCodeAt(i); hash|=0; }
//   return colors[Math.abs(hash) % colors.length];
// }

// // ─── Shared UI ────────────────────────────────────────────────────────────────
// function TrendCell({ trend, color }: { trend: TrendValue; color: string }) {
//   const map: Record<TrendValue,string> = { up:"↗", slightly_up:"↗", stable:"→", down:"↓", sharp_decline:"↘" };
//   return (
//     <span style={{ fontSize:16, color, fontWeight:700, display:"inline-block", textAlign:"center", width:"100%" }}>
//       {map[trend] ?? map.stable}
//     </span>
//   );
// }
// function Sparkline({ values, color }: { values: number[]; color: string }) {
//   if (values.length < 2) return null;
//   const max = Math.max(...values, 1);
//   const min = Math.min(...values);
//   const range = max - min || 1;
//   const W = 60, H = 20;
//   const pts = values.map((v,i) => `${(i/(values.length-1))*W},${H-((v-min)/range)*H}`).join(" ");
//   return (
//     <svg width={W} height={H} style={{ display:"block", margin:"0 auto" }}>
//       <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
//     </svg>
//   );
// }
// function ZoneBadge({ zone }: { zone: Zone }) {
//   return (
//     <span style={{ background:ZONE_BG[zone], color:ZONE_TEXT[zone], borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600, border:`1px solid ${ZONE_COLORS[zone]}33`, display:"inline-block", whiteSpace:"nowrap" }}>
//       {ZONE_LABEL[zone]}
//     </span>
//   );
// }
// function StatCard({ label, value, accent }: { label:string; value:string|number; accent:string }) {
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"1rem 1.25rem", display:"flex", flexDirection:"column", gap:4, borderLeft:`3px solid ${accent}` }}>
//       <span style={{ fontSize:12, color:"#888", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</span>
//       <span style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.02em" }}>{value}</span>
//     </div>
//   );
// }
// function BarChart({ data }: { data: ChartEntry[] }) {
//   if (!data.length) return null;
//   const max = Math.max(...data.map(d=>d.production));
//   return (
//     <div style={{ padding:"1rem 0" }}>
//       {data.map((d,i) => (
//         <div key={d.type} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
//           <span style={{ width:100, fontSize:13, color:"#555", textAlign:"right", fontWeight:500, textTransform:"capitalize" }}>{d.type}</span>
//           <div style={{ flex:1, background:"#f3f4f6", borderRadius:6, overflow:"hidden", height:26 }}>
//             <div style={{ width:`${(d.production/max)*100}%`, background:getDynamicTypeColor(d.type,i), height:"100%", borderRadius:6, display:"flex", alignItems:"center", paddingLeft:8 }}>
//               <span style={{ fontSize:11, color:"#fff", fontWeight:600 }}>{d.production.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Zone Range Fields ────────────────────────────────────────────────────────
// function ZoneRangeFields({
//   enabled, setEnabled,
//   greenMin, setGreenMin, greenMax, setGreenMax,
//   yellowMin, setYellowMin, yellowMax, setYellowMax,
//   redMin, setRedMin, redMax, setRedMax,
// }: {
//   enabled:boolean; setEnabled:(v:boolean)=>void;
//   greenMin:number; setGreenMin:(v:number)=>void; greenMax:number; setGreenMax:(v:number)=>void;
//   yellowMin:number; setYellowMin:(v:number)=>void; yellowMax:number; setYellowMax:(v:number)=>void;
//   redMin:number; setRedMin:(v:number)=>void; redMax:number; setRedMax:(v:number)=>void;
// }) {
//   return (
//     <>
//       <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
//         <label style={{ fontSize:12, fontWeight:600, color:"#333" }}>Custom ranges:</label>
//         <button onClick={()=>setEnabled(!enabled)} style={{ padding:"4px 14px", borderRadius:20, border:"none", background:enabled?"#1D9E75":"#94a3b8", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>
//           {enabled ? "ON" : "OFF"}
//         </button>
//       </div>
//       {[
//         { label:"🟢 Green Zone — Good / High Production", bg:ZONE_BG.green,   border:ZONE_BORDER.green,   tc:ZONE_TEXT.green,   min:greenMin,  max:greenMax,  setMin:setGreenMin,  setMax:setGreenMax,  note:"High production = Good performance"  },
//         { label:"🟡 Yellow Zone — Moderate Production",   bg:ZONE_BG.yellow,  border:ZONE_BORDER.yellow,  tc:ZONE_TEXT.yellow,  min:yellowMin, max:yellowMax, setMin:setYellowMin, setMax:setYellowMax, note:"Mid-range = Moderate performance"    },
//         { label:"🔴 Red Zone — Low / Poor Production",    bg:ZONE_BG.red,     border:ZONE_BORDER.red,     tc:ZONE_TEXT.red,     min:redMin,    max:redMax,    setMin:setRedMin,    setMax:setRedMax,    note:"Low production = Poor performance"   },
//       ].map(z => (
//         <div key={z.label} style={{ background:z.bg, borderRadius:12, padding:16, marginBottom:12, border:`1px solid ${z.border}` }}>
//           <div style={{ fontWeight:700, color:z.tc, marginBottom:4 }}>{z.label}</div>
//           <div style={{ fontSize:11, color:z.tc, marginBottom:10, opacity:0.8 }}>{z.note}</div>
//           <div style={{ display:"flex", gap:12 }}>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Min Production Units</label>
//               <input type="number" value={z.min ?? ""} onChange={e=>z.setMin(Number(e.target.value))} disabled={!enabled}
//                 style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
//             </div>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Max Production Units</label>
//               <input type="number" value={z.max ?? ""} onChange={e=>z.setMax(Number(e.target.value))} disabled={!enabled}
//                 style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }

// // ─── Universal Zone Range Manager ─────────────────────────────────────────────
// function ZoneRangeManager({
//   modalLevel, configs, availableStates, availableDistricts, availableTaluks,
//   allCommodities, onSave, onClose,
// }: {
//   modalLevel: "state" | "district" | "taluk";
//   configs: ZoneConfig[];
//   availableStates: string[];
//   availableDistricts: string[];
//   availableTaluks: string[];
//   allCommodities: string[];
//   onSave: (configs: ZoneConfig[]) => void;
//   onClose: () => void;
// }) {
//   const [localConfigs, setLocalConfigs] = useState<ZoneConfig[]>(() =>
//     JSON.parse(JSON.stringify(configs, (_, v) => v === Infinity ? "__INF__" : v))
//       .map((c: ZoneConfig) => ({
//         ...c,
//         commodityRanges: (c.commodityRanges ?? []).map((cr: CommodityRange) => ({
//           ...cr,
//           ranges: {
//             green:  { ...cr.ranges.green,  max: (cr.ranges.green.max  as unknown) === "__INF__" ? Infinity : cr.ranges.green.max  },
//             yellow: { ...cr.ranges.yellow, max: (cr.ranges.yellow.max as unknown) === "__INF__" ? Infinity : cr.ranges.yellow.max },
//             red:    { ...cr.ranges.red,    max: (cr.ranges.red.max    as unknown) === "__INF__" ? Infinity : cr.ranges.red.max    },
//           },
//         })),
//       }))
//   );

//   const [selParentState,    setSelParentState]    = useState(availableStates[0]    ?? "");
//   const [selParentDistrict, setSelParentDistrict] = useState(availableDistricts[0] ?? "");
//   const [selLocation,       setSelLocation]       = useState("");
//   const [customInput,       setCustomInput]       = useState("");
//   const [useCustom,         setUseCustom]         = useState(false);
//   const [selCommodity,      setSelCommodity]      = useState(allCommodities[0]     ?? "");
//   const [greenMin,  setGreenMin]  = useState(DEFAULT_ZONE_RANGES.green.min);
//   const [greenMax,  setGreenMax]  = useState(999999);
//   const [yellowMin, setYellowMin] = useState(DEFAULT_ZONE_RANGES.yellow.min);
//   const [yellowMax, setYellowMax] = useState(DEFAULT_ZONE_RANGES.yellow.max);
//   const [redMin,    setRedMin]    = useState(DEFAULT_ZONE_RANGES.red.min);
//   const [redMax,    setRedMax]    = useState(DEFAULT_ZONE_RANGES.red.max);
//   const [enabled,   setEnabled]   = useState(true);
//   const [savedMsg,  setSavedMsg]  = useState("");

//   const activeLocation = useCustom ? customInput.trim() : selLocation;

//   const activeKey = useMemo(() => {
//     if (!activeLocation) return "";
//     if (modalLevel === "state") {
//       return buildConfigKey({ level: "state", state: activeLocation, district: "", taluk: "" });
//     }
//     if (modalLevel === "district") {
//       return buildConfigKey({ level: "district", state: selParentState, district: activeLocation, taluk: "" });
//     }
//     return buildConfigKey({ level: "taluk", state: selParentState, district: selParentDistrict, taluk: activeLocation });
//   }, [modalLevel, activeLocation, selParentState, selParentDistrict]);

//   const currentCfg = useMemo(() =>
//     activeKey ? localConfigs.find(c => buildConfigKey(c) === activeKey) ?? null : null,
//     [localConfigs, activeKey]
//   );

//   useEffect(() => {
//     if (!activeLocation || !selCommodity) return;
//     const cr = currentCfg?.commodityRanges.find(r => norm(r.commodity) === norm(selCommodity));
//     if (cr) {
//       setGreenMin(cr.ranges.green.min);
//       setGreenMax(cr.ranges.green.max === Infinity ? 999999 : cr.ranges.green.max);
//       setYellowMin(cr.ranges.yellow.min);
//       setYellowMax(cr.ranges.yellow.max === Infinity ? 999999 : cr.ranges.yellow.max);
//       setRedMin(cr.ranges.red.min);
//       setRedMax(cr.ranges.red.max === Infinity ? 999999 : cr.ranges.red.max);
//       setEnabled(cr.enabled);
//     } else {
//       setGreenMin(DEFAULT_ZONE_RANGES.green.min); setGreenMax(999999);
//       setYellowMin(DEFAULT_ZONE_RANGES.yellow.min); setYellowMax(DEFAULT_ZONE_RANGES.yellow.max);
//       setRedMin(DEFAULT_ZONE_RANGES.red.min); setRedMax(DEFAULT_ZONE_RANGES.red.max);
//       setEnabled(true);
//     }
//   }, [activeLocation, selCommodity, activeKey, currentCfg]);

//   useEffect(() => { setSelLocation(""); }, [selParentState, selParentDistrict]);

//   const saveCombination = (currentList: ZoneConfig[]): ZoneConfig[] => {
//     if (!activeLocation) { alert("Please select or enter a location."); return currentList; }
//     if (!selCommodity)   { alert("Please select a commodity."); return currentList; }
//     const st = modalLevel === "state"    ? activeLocation : selParentState;
//     const di = modalLevel === "district" ? activeLocation : modalLevel === "taluk" ? selParentDistrict : "";
//     const tk = modalLevel === "taluk"    ? activeLocation : "";
//     const newCR: CommodityRange = {
//       commodity: selCommodity,
//       ranges: {
//         green:  { min: greenMin,  max: greenMax  === 999999 ? Infinity : greenMax,  color: "green"  },
//         yellow: { min: yellowMin, max: yellowMax === 999999 ? Infinity : yellowMax, color: "yellow" },
//         red:    { min: redMin,    max: redMax    === 999999 ? Infinity : redMax,    color: "red"    },
//       },
//       enabled,
//     };
//     const key      = buildConfigKey({ level: modalLevel, state: st, district: di, taluk: tk });
//     const existing = currentList.find(c => buildConfigKey(c) === key);
//     let next: ZoneConfig[];
//     if (existing) {
//       next = currentList.map(c => {
//         if (buildConfigKey(c) !== key) return c;
//         const filtered = c.commodityRanges.filter(r => norm(r.commodity) !== norm(selCommodity));
//         return { ...c, commodityRanges: [...filtered, newCR] };
//       });
//     } else {
//       next = [...currentList, { level: modalLevel, state: st, district: di, taluk: tk, commodityRanges: [newCR] }];
//     }
//     return next;
//   };

//   const handleSaveAndStay = () => {
//     const next = saveCombination(localConfigs);
//     setLocalConfigs(next);
//     setSavedMsg(`✓ Saved "${activeLocation}" × "${selCommodity}"`);
//     setTimeout(() => setSavedMsg(""), 2500);
//   };

//   const handleRemove = () => {
//     if (!activeLocation || !selCommodity || !activeKey) return;
//     const next = localConfigs
//       .map(c => {
//         if (buildConfigKey(c) !== key) return c;
//         return { ...c, commodityRanges: c.commodityRanges.filter(r => norm(r.commodity) !== norm(selCommodity)) };
//       })
//       .filter(c => c.commodityRanges.length > 0);
//     setLocalConfigs(next);
//   };

//   const currentCombinationSaved = !!currentCfg?.commodityRanges.find(
//     r => norm(r.commodity) === norm(selCommodity)
//   );

//   const savedRows = useMemo(() => {
//     const rows: { cfg: ZoneConfig; cr: CommodityRange }[] = [];
//     localConfigs.filter(c => c.level === modalLevel).forEach(c => {
//       (c.commodityRanges ?? []).forEach(cr => rows.push({ cfg: c, cr }));
//     });
//     return rows.sort((a, b) => {
//       const la = (a.cfg.state + a.cfg.district + a.cfg.taluk).toLowerCase();
//       const lb = (b.cfg.state + b.cfg.district + b.cfg.taluk).toLowerCase();
//       return la.localeCompare(lb) || a.cr.commodity.localeCompare(b.cr.commodity);
//     });
//   }, [localConfigs, modalLevel]);

//   const locationOptions = useMemo(() => {
//     if (modalLevel === "state") return availableStates;
//     if (modalLevel === "district") return availableDistricts;
//     return availableTaluks;
//   }, [modalLevel, availableStates, availableDistricts, availableTaluks]);

//   const savedLocations = useMemo(() => {
//     const s = new Set(localConfigs.filter(c => c.level === modalLevel).map(c =>
//       modalLevel === "state" ? c.state : modalLevel === "district" ? c.district : c.taluk
//     ));
//     return Array.from(s).sort();
//   }, [localConfigs, modalLevel]);

//   const allLocations = useMemo(() => {
//     const s = new Set([...locationOptions, ...savedLocations]);
//     return Array.from(s).filter(Boolean).sort();
//   }, [locationOptions, savedLocations]);

//   const levelLabel = modalLevel === "state" ? "State" : modalLevel === "district" ? "District" : "Taluk";
//   const levelIcon  = modalLevel === "state" ? "🗺"   : modalLevel === "district" ? "🏙"       : "🏛";
//   const levelColor = modalLevel === "state" ? "#D85A30" : modalLevel === "district" ? "#378ADD" : "#7F77DD";
//   const levelBg    = modalLevel === "state" ? "#FFF3EE" : modalLevel === "district" ? "#EFF6FF" : "#F5F3FF";
//   const levelBd    = modalLevel === "state" ? "#FDBA74" : modalLevel === "district" ? "#BFDBFE" : "#DDD6FE";

//   // FIX: reference activeKey inside handleRemove
//   const key = activeKey;

//   return (
//     <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
//       <div style={{ background:"#fff", borderRadius:16, padding:24, width:720, maxWidth:"95vw", maxHeight:"94vh", overflowY:"auto", boxShadow:"0 20px 40px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
//         <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
//           <h3 style={{ margin:0, fontSize:18, fontWeight:700 }}>{levelIcon} {levelLabel}-Level Zone Range Manager</h3>
//           <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#64748b", lineHeight:1 }}>×</button>
//         </div>
//         <p style={{ fontSize:13, color:"#64748b", marginBottom:8 }}>
//           Set production zone thresholds per <strong>{levelLabel} × Commodity</strong> combination.
//         </p>
//         <div style={{ background:levelBg, border:`1px solid ${levelBd}`, borderRadius:10, padding:"10px 14px", marginBottom:18, fontSize:12, color:levelColor }}>
//           <strong>Priority order:</strong> Taluk+Commodity &gt; District+Commodity &gt; State+Commodity &gt; Default
//         </div>
//         <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
//           {(["green","yellow","red"] as Zone[]).map(z => (
//             <span key={z} style={{ background:ZONE_BG[z], color:ZONE_TEXT[z], border:`1px solid ${ZONE_BORDER[z]}`, borderRadius:20, padding:"3px 14px", fontSize:12, fontWeight:600 }}>
//               {z==="green" ? "🟢 Good / High" : z==="yellow" ? "🟡 Moderate" : "🔴 Low / Poor"}
//             </span>
//           ))}
//         </div>

//         {(modalLevel === "district" || modalLevel === "taluk") && (
//           <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>Step 1 — Select Parent Context</div>
//             <div style={{ marginBottom: modalLevel === "taluk" ? 10 : 0 }}>
//               <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>State (context)</label>
//               <select value={selParentState} onChange={e => setSelParentState(e.target.value)}
//                 style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                 <option value="">-- Select state --</option>
//                 {availableStates.map(s => <option key={s}>{s}</option>)}
//               </select>
//             </div>
//             {modalLevel === "taluk" && (
//               <div style={{ marginTop:10 }}>
//                 <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>District (context)</label>
//                 <select value={selParentDistrict} onChange={e => setSelParentDistrict(e.target.value)}
//                   style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                   <option value="">-- Select district --</option>
//                   {availableDistricts.map(d => <option key={d}>{d}</option>)}
//                 </select>
//               </div>
//             )}
//           </div>
//         )}

//         <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//           <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
//             {modalLevel === "state" ? "Step 1" : "Step 2"} — Select {levelLabel} to Configure
//           </div>
//           <div style={{ display:"flex", gap:8, marginBottom:10 }}>
//             {(["existing","custom"] as const).map(opt => (
//               <button key={opt} onClick={() => setUseCustom(opt === "custom")}
//                 style={{ padding:"5px 14px", borderRadius:20, border:`1.5px solid ${useCustom===(opt==="custom")?levelColor:"#d1d5db"}`, background:useCustom===(opt==="custom")?levelBg:"#fff", color:useCustom===(opt==="custom")?levelColor:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer" }}>
//                 {opt === "existing" ? "Select existing" : "Enter name"}
//               </button>
//             ))}
//           </div>
//           {!useCustom ? (
//             <select value={selLocation} onChange={e => setSelLocation(e.target.value)}
//               style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//               <option value="">-- Select {levelLabel.toLowerCase()} --</option>
//               {allLocations.map(l => {
//                 const lKey = modalLevel === "state"
//                   ? buildConfigKey({ level: "state",    state: l,            district: "",              taluk: "" })
//                   : modalLevel === "district"
//                   ? buildConfigKey({ level: "district", state: selParentState, district: l,             taluk: "" })
//                   : buildConfigKey({ level: "taluk",    state: selParentState, district: selParentDistrict, taluk: l });
//                 const hasCfg = localConfigs.some(c => buildConfigKey(c) === lKey);
//                 return <option key={l} value={l}>{l}{hasCfg ? " ✓" : ""}</option>;
//               })}
//             </select>
//           ) : (
//             <input type="text" value={customInput} onChange={e => setCustomInput(e.target.value)}
//               placeholder={`e.g. ${modalLevel==="state"?"Karnataka":"Mandya"}…`}
//               style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, boxSizing:"border-box" }}/>
//           )}
//           {activeLocation && (
//             <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCfg?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCfg?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCfg?ZONE_TEXT.green:"#64748b" }}>
//               {currentCfg
//                 ? `✓ "${activeLocation}" has ${currentCfg.commodityRanges.length} commodity config(s) saved`
//                 : `No configs saved for "${activeLocation}" yet`}
//             </div>
//           )}
//         </div>

//         <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//           <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
//             {modalLevel === "state" ? "Step 2" : "Step 3"} — Select Commodity
//           </div>
//           {allCommodities.length === 0 ? (
//             <div style={{ color:"#94a3b8", fontSize:13 }}>No commodities found in data.</div>
//           ) : (
//             <>
//               <select value={selCommodity} onChange={e => setSelCommodity(e.target.value)}
//                 style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                 <option value="">-- Select commodity --</option>
//                 {allCommodities.map(c => (
//                   <option key={c} value={c}>
//                     {getCommodityIcon(c)} {c}
//                     {currentCfg?.commodityRanges.find(r => norm(r.commodity) === norm(c)) ? " ✓" : ""}
//                   </option>
//                 ))}
//               </select>
//               {selCommodity && activeLocation && (
//                 <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCombinationSaved?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCombinationSaved?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCombinationSaved?ZONE_TEXT.green:"#64748b" }}>
//                   {currentCombinationSaved
//                     ? `✓ Config exists for "${activeLocation}" + "${selCommodity}" — editing below`
//                     : `No config for "${activeLocation}" + "${selCommodity}" — set ranges below`}
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {activeLocation && selCommodity && (
//           <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:14 }}>
//               {modalLevel === "state" ? "Step 3" : "Step 4"} — Zone Ranges for{" "}
//               <span style={{ color:levelColor }}>{activeLocation}</span> ×{" "}
//               <span style={{ color:"#378ADD" }}>{getCommodityIcon(selCommodity)} {selCommodity}</span>
//             </div>
//             <ZoneRangeFields
//               enabled={enabled} setEnabled={setEnabled}
//               greenMin={greenMin} setGreenMin={setGreenMin} greenMax={greenMax} setGreenMax={setGreenMax}
//               yellowMin={yellowMin} setYellowMin={setYellowMin} yellowMax={yellowMax} setYellowMax={setYellowMax}
//               redMin={redMin} setRedMin={setRedMin} redMax={redMax} setRedMax={setRedMax}
//             />
//             {savedMsg && (
//               <div style={{ marginBottom:12, padding:"8px 14px", background:ZONE_BG.green, border:`1px solid ${ZONE_BORDER.green}`, borderRadius:8, color:ZONE_TEXT.green, fontSize:13, fontWeight:600 }}>
//                 {savedMsg}
//               </div>
//             )}
//             <div style={{ display:"flex", gap:12 }}>
//               <button onClick={handleSaveAndStay}
//                 style={{ flex:1, padding:"10px 16px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
//                 Save "{activeLocation}" × "{selCommodity}"
//               </button>
//               <button onClick={handleRemove} disabled={!currentCombinationSaved}
//                 style={{ padding:"10px 16px", borderRadius:8, border:"1px solid #E24B4A", background:"#fff", color:currentCombinationSaved?"#E24B4A":"#ccc", cursor:currentCombinationSaved?"pointer":"not-allowed", fontWeight:600 }}>
//                 Remove
//               </button>
//             </div>
//           </div>
//         )}

//         {savedRows.length > 0 && (
//           <div style={{ marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:600, marginBottom:8, color:"#333" }}>Saved Configurations ({savedRows.length})</div>
//             <div style={{ overflowX:"auto" }}>
//               <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
//                 <thead>
//                   <tr style={{ background:"#f1f5f9" }}>
//                     <th style={{ padding:8, textAlign:"left" }}>{levelLabel}</th>
//                     {modalLevel !== "state"    && <th style={{ padding:8, textAlign:"left" }}>State</th>}
//                     {modalLevel === "taluk"    && <th style={{ padding:8, textAlign:"left" }}>District</th>}
//                     <th style={{ padding:8, textAlign:"left" }}>Commodity</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.green }}>Green</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.yellow }}>Yellow</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.red }}>Red</th>
//                     <th style={{ padding:8, textAlign:"center" }}>Status</th>
//                     <th style={{ padding:8, textAlign:"center" }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {savedRows.map(({ cfg, cr }) => {
//                     const locName = modalLevel==="state" ? cfg.state : modalLevel==="district" ? cfg.district : cfg.taluk;
//                     const isActive = buildConfigKey(cfg) === activeKey && norm(cr.commodity) === norm(selCommodity);
//                     return (
//                       <tr key={`${buildConfigKey(cfg)}-${cr.commodity}`} style={{ borderBottom:"1px solid #e5e7eb", background:isActive?"#F0FDF4":"#fff" }}>
//                         <td style={{ padding:8, fontWeight:600 }}>{levelIcon} {locName}</td>
//                         {modalLevel !== "state"   && <td style={{ padding:8, color:"#64748b" }}>{cfg.state}</td>}
//                         {modalLevel === "taluk"   && <td style={{ padding:8, color:"#64748b" }}>{cfg.district}</td>}
//                         <td style={{ padding:8 }}>{getCommodityIcon(cr.commodity)} {cr.commodity}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.green }}>{cr.ranges.green.min}–{cr.ranges.green.max===Infinity?"∞":cr.ranges.green.max}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.yellow }}>{cr.ranges.yellow.min}–{cr.ranges.yellow.max===Infinity?"∞":cr.ranges.yellow.max}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.red }}>{cr.ranges.red.min}–{cr.ranges.red.max===Infinity?"∞":cr.ranges.red.max}</td>
//                         <td style={{ padding:8, textAlign:"center" }}>
//                           <span style={{ background:cr.enabled?"#EAF3DE":"#f1f5f9", color:cr.enabled?"#27500A":"#64748b", padding:"2px 8px", borderRadius:12, fontSize:10 }}>
//                             {cr.enabled ? "Active" : "Off"}
//                           </span>
//                         </td>
//                         <td style={{ padding:8, textAlign:"center" }}>
//                           <button
//                             onClick={() => {
//                               setSelCommodity(cr.commodity);
//                               if (!useCustom) {
//                                 if (modalLevel === "state")    setSelLocation(cfg.state);
//                                 if (modalLevel === "district") { setSelParentState(cfg.state); setSelLocation(cfg.district); }
//                                 if (modalLevel === "taluk")    { setSelParentState(cfg.state); setSelParentDistrict(cfg.district); setSelLocation(cfg.taluk); }
//                               }
//                             }}
//                             style={{ fontSize:11, padding:"2px 8px", borderRadius:6, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer", color:levelColor }}>
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//         {savedRows.length === 0 && (
//           <div style={{ padding:"16px", textAlign:"center", color:"#94a3b8", fontSize:13, background:"#f8f9fb", borderRadius:10, marginBottom:16 }}>
//             No configurations saved yet. Select a {levelLabel.toLowerCase()} and commodity above to get started.
//           </div>
//         )}

//         <div style={{ display:"flex", gap:12, justifyContent:"flex-end", borderTop:"1px solid #e5e7eb", paddingTop:16 }}>
//           <button onClick={onClose} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer" }}>Cancel</button>
//           <button
//             onClick={() => {
//               const latest = (activeLocation && selCommodity) ? saveCombination(localConfigs) : localConfigs;
//               onSave(latest);
//             }}
//             style={{ padding:"8px 20px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
//             Save All & Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Other sub-components ─────────────────────────────────────────────────────
// function RoleBadge({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;
//   const isAdmin = adminData.role === "admin";
//   return (
//     <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:isAdmin?"rgba(55,138,221,0.15)":"rgba(127,119,221,0.15)", border:`1px solid ${isAdmin?"#378ADD55":"#7F77DD55"}`, borderRadius:20, padding:"5px 14px 5px 10px", fontSize:12, fontWeight:600, color:isAdmin?"#378ADD":"#7F77DD" }}>
//       <span style={{ width:7, height:7, borderRadius:"50%", background:isAdmin?"#378ADD":"#7F77DD", display:"inline-block" }}/>
//       {isAdmin ? "Administrator · All Locations" : `Subadmin · ${adminData.taluka || "Unknown"}`}
//     </div>
//   );
// }
// function RoleInfoBanner({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;
//   const isAdmin = adminData.role === "admin";
//   return (
//     <div style={{ background:isAdmin?"#EFF6FF":"#F5F3FF", border:`1px solid ${isAdmin?"#BFDBFE":"#DDD6FE"}`, borderRadius:10, padding:"10px 16px", marginBottom:24, display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:isAdmin?"#1e40af":"#5b21b6" }}>
//       <span style={{ width:18, height:18, borderRadius:"50%", background:isAdmin?"#BFDBFE":"#DDD6FE", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, marginTop:1, color:isAdmin?"#1d4ed8":"#6d28d9" }}>i</span>
//       <div><strong>{isAdmin?"Administrator View":"Subadmin View"}:</strong>{" "}
//         {isAdmin ? "You can manage zone ranges across all locations and view all postings." : <>You can only view postings from <strong style={{ color:"#6d28d9" }}>{adminData.taluka}</strong> taluka.</>}
//       </div>
//     </div>
//   );
// }

// type ZoneFilter = Zone | "all";

// // ─────────────────────────────────────────────────────────────────────────────
// // TOOLTIP COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// interface MapTooltip {
//   name: string;
//   count: number;
//   production: number;
//   zone: Zone;
//   x: number;
//   y: number;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // FIX 4: TALUK TILE PANEL — shown instead of map when a district is selected
// // since no taluk-level GeoJSON is available
// // ─────────────────────────────────────────────────────────────────────────────
// function TalukTilePanel({
//   title,
//   subtitle,
//   icon,
//   accentColor,
//   aggMap,
//   activeZone,
//   onZoneFilterChange,
//   totalPostings,
//   highlightName,
// }: {
//   title: string;
//   subtitle: string;
//   icon: string;
//   accentColor: string;
//   aggMap: Record<string, { count: number; production: number; zone: Zone }>;
//   activeZone: ZoneFilter;
//   onZoneFilterChange: (z: ZoneFilter) => void;
//   totalPostings: number;
//   highlightName?: string;
// }) {
//   const zoneCounts = useMemo(() => {
//     const c = { green: 0, yellow: 0, red: 0 };
//     Object.values(aggMap).forEach(v => { c[v.zone]++; });
//     return c;
//   }, [aggMap]);

//   const entries = useMemo(() => {
//     return Object.entries(aggMap)
//       .filter(([, v]) => activeZone === "all" || v.zone === activeZone)
//       .sort((a, b) => b[1].production - a[1].production);
//   }, [aggMap, activeZone]);

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//       {/* Panel Header */}
//       <div className="px-4 pt-4 pb-2 border-b border-slate-100">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-lg">{icon}</span>
//           <span className="font-bold text-slate-800 text-sm">{title}</span>
//           {highlightName && (
//             <span
//               className="text-xs font-semibold px-2 py-0.5 rounded-full"
//               style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }}
//             >
//               {highlightName}
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-slate-400">{subtitle}</p>
//         {/* Zone filter pills */}
//         <div className="flex gap-1.5 mt-2 flex-wrap">
//           {([
//             { key: "all" as ZoneFilter,    label: "All",           bg: "#f1f5f9", color: "#475569" },
//             { key: "green" as ZoneFilter,  label: `✓ ${zoneCounts.green}`,  bg: ZONE_BG.green,  color: ZONE_TEXT.green  },
//             { key: "yellow" as ZoneFilter, label: `⚠ ${zoneCounts.yellow}`, bg: ZONE_BG.yellow, color: ZONE_TEXT.yellow },
//             { key: "red" as ZoneFilter,    label: `✗ ${zoneCounts.red}`,    bg: ZONE_BG.red,    color: ZONE_TEXT.red    },
//           ]).map(z => (
//             <button
//               key={z.key}
//               onClick={() => onZoneFilterChange(z.key)}
//               style={{
//                 background: activeZone === z.key ? z.bg : "#fff",
//                 color: activeZone === z.key ? z.color : "#94a3b8",
//                 border: `1.5px solid ${activeZone === z.key ? z.color : "#e2e8f0"}`,
//                 fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
//                 cursor: "pointer", transition: "all 0.15s",
//               }}
//             >
//               {z.label}
//             </button>
//           ))}
//           <span className="ml-auto text-xs text-slate-400 self-center">
//             {totalPostings} farmer{totalPostings !== 1 ? "s" : ""}
//           </span>
//         </div>
//       </div>

//       {/* Taluk tiles grid */}
//       <div className="flex-1 p-3 overflow-y-auto" style={{ minHeight: 240, maxHeight: 340, background: "#f8fafc" }}>
//         {entries.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center text-slate-400">
//               <div className="text-2xl mb-1">🏛</div>
//               <div className="text-xs font-medium">
//                 {Object.keys(aggMap).length === 0 ? "No taluk data" : "No taluks match filter"}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
//             {entries.map(([name, data]) => (
//               <div
//                 key={name}
//                 style={{
//                   background: ZONE_BG[data.zone],
//                   border: `1.5px solid ${ZONE_COLORS[data.zone]}44`,
//                   borderRadius: 10,
//                   padding: "8px 10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                 }}
//               >
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 5, marginBottom: 2,
//                 }}>
//                   <span style={{ width: 7, height: 7, borderRadius: "50%", background: ZONE_COLORS[data.zone], display: "inline-block", flexShrink: 0 }}/>
//                   <span style={{ fontSize: 11, fontWeight: 700, color: ZONE_TEXT[data.zone], wordBreak: "break-word", lineHeight: 1.3 }}>{name}</span>
//                 </div>
//                 <div style={{ fontSize: 10, color: "#64748b" }}>
//                   {data.count} farmer{data.count !== 1 ? "s" : ""}
//                 </div>
//                 <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a" }}>
//                   {data.production.toLocaleString()} units
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Legend footer */}
//       <div className="px-4 py-2 border-t border-slate-100 flex gap-3 flex-wrap">
//         {(["green", "yellow", "red"] as Zone[]).map(z => (
//           <div key={z} className="flex items-center gap-1.5">
//             <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[z] }} />
//             <span className="text-xs text-slate-500">{ZONE_LABEL[z]}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SINGLE REACT-SIMPLE-MAPS PANEL
// // ─────────────────────────────────────────────────────────────────────────────
// interface MapPanelProps {
//   title: string;
//   subtitle: string;
//   icon: string;
//   accentColor: string;
//   geoUrl: string;
//   geoNameKey: string;
//   geoFilterKey?: string;
//   geoFilterValue?: string;
//   aggMap: Record<string, { count: number; production: number; zone: Zone }>;
//   center: [number, number];
//   zoom: number;
//   onRegionClick?: (name: string) => void;
//   activeZone: ZoneFilter;
//   onZoneFilterChange: (z: ZoneFilter) => void;
//   highlightName?: string;
//   totalPostings: number;
// }

// function MapPanel({
//   title, subtitle, icon, accentColor,
//   geoUrl, geoNameKey, geoFilterKey, geoFilterValue,
//   aggMap, center, zoom,
//   onRegionClick, activeZone, onZoneFilterChange,
//   highlightName, totalPostings,
// }: MapPanelProps) {
//   const [tooltip, setTooltip] = useState<MapTooltip | null>(null);

//   const zoneCounts = useMemo(() => {
//     const c = { green: 0, yellow: 0, red: 0 };
//     Object.values(aggMap).forEach(v => { c[v.zone]++; });
//     return c;
//   }, [aggMap]);

//   // FIX 2 applied here: use lookupAggMap for fuzzy name matching
//   const getGeoData = (rawName: string) => lookupAggMap(aggMap, rawName);

//   const getGeoFill = (rawName: string): string => {
//     const data = getGeoData(rawName);
//     if (!data) return "#e2e8f0";
//     if (activeZone !== "all" && data.zone !== activeZone) return "#f1f5f9";
//     return ZONE_COLORS[data.zone];
//   };

//   const getGeoOpacity = (rawName: string): number => {
//     const data = getGeoData(rawName);
//     if (!data) return 0.4;
//     if (activeZone !== "all" && data.zone !== activeZone) return 0.3;
//     return 1;
//   };

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//       {/* Panel Header */}
//       <div className="px-4 pt-4 pb-2 border-b border-slate-100">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-lg">{icon}</span>
//           <span className="font-bold text-slate-800 text-sm">{title}</span>
//           {highlightName && (
//             <span
//               className="text-xs font-semibold px-2 py-0.5 rounded-full"
//               style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }}
//             >
//               {highlightName}
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-slate-400">{subtitle}</p>
//         {/* Zone filter pills */}
//         <div className="flex gap-1.5 mt-2 flex-wrap">
//           {([
//             { key: "all" as ZoneFilter,    label: "All",           bg: "#f1f5f9", color: "#475569" },
//             { key: "green" as ZoneFilter,  label: `✓ ${zoneCounts.green}`,  bg: ZONE_BG.green,  color: ZONE_TEXT.green  },
//             { key: "yellow" as ZoneFilter, label: `⚠ ${zoneCounts.yellow}`, bg: ZONE_BG.yellow, color: ZONE_TEXT.yellow },
//             { key: "red" as ZoneFilter,    label: `✗ ${zoneCounts.red}`,    bg: ZONE_BG.red,    color: ZONE_TEXT.red    },
//           ]).map(z => (
//             <button
//               key={z.key}
//               onClick={() => onZoneFilterChange(z.key)}
//               style={{
//                 background: activeZone === z.key ? z.bg : "#fff",
//                 color: activeZone === z.key ? z.color : "#94a3b8",
//                 border: `1.5px solid ${activeZone === z.key ? z.color : "#e2e8f0"}`,
//                 fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
//                 cursor: "pointer", transition: "all 0.15s",
//               }}
//             >
//               {z.label}
//             </button>
//           ))}
//           <span className="ml-auto text-xs text-slate-400 self-center">
//             {totalPostings} farmer{totalPostings !== 1 ? "s" : ""}
//           </span>
//         </div>
//       </div>

//       {/* Map */}
//       <div className="relative flex-1" style={{ minHeight: 240, background: "#f8fafc" }}>
//         <ComposableMap
//           projection="geoMercator"
//           style={{ width: "100%", height: "100%", minHeight: 240 }}
//           projectionConfig={{ center, scale: zoom }}
//         >
//           <ZoomableGroup center={center} zoom={1} minZoom={0.5} maxZoom={6}>
//             <Geographies geography={geoUrl}>
//               {({ geographies }) =>
//                 geographies
//                   .filter(geo => {
//                     // FIX 3: use robust stateMatches() instead of simple norm() comparison
//                     if (!geoFilterKey || !geoFilterValue) return true;
//                     if (geoFilterValue === "__NONE__") return false;
//                     const geoVal = geo.properties[geoFilterKey] as string;
//                     return stateMatches(geoVal, geoFilterValue);
//                   })
//                   .map(geo => {
//                     const rawName = geo.properties[geoNameKey] as string;
//                     const geoData = getGeoData(rawName);
//                     const fill    = getGeoFill(rawName);
//                     const opacity = getGeoOpacity(rawName);

//                     return (
//                       <Geography
//   key={geo.rsmKey}
//   geography={geo}
//   fill={fill}
//   stroke="#64748b"
//   strokeWidth={0.75}
//   style={{
//     default:  { outline: "none", fillOpacity: opacity, strokeOpacity: 1 },
//     hover:    { outline: "none", fillOpacity: 1, strokeOpacity: 1, cursor: onRegionClick && geoData ? "pointer" : "default", filter: "brightness(1.1)" },
//     pressed:  { outline: "none" },
//   }}
//   onClick={() => onRegionClick && geoData && onRegionClick(rawName)}
//   onMouseEnter={e => {
//                           if (geoData) {
//                             setTooltip({
//                               name:       rawName,
//                               count:      geoData.count,
//                               production: geoData.production,
//                               zone:       geoData.zone,
//                               x:          (e as unknown as MouseEvent).clientX,
//                               y:          (e as unknown as MouseEvent).clientY,
//                             });
//                           }
//                         }}
//                         onMouseLeave={() => setTooltip(null)}
//                       />
//                     );
//                   })
//               }
//             </Geographies>
//           </ZoomableGroup>
//         </ComposableMap>

//         {/* No-data overlay */}
//         {Object.keys(aggMap).length === 0 && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center text-slate-400">
//               <div className="text-2xl mb-1">🗺</div>
//               <div className="text-xs font-medium">No data for current filter</div>
//             </div>
//           </div>
//         )}

//         {/* Tooltip */}
//         {tooltip && (
//           <div
//             className="fixed z-50 pointer-events-none"
//             style={{ left: tooltip.x + 12, top: tooltip.y - 60, minWidth: 160 }}
//           >
//             <div className="rounded-xl px-3 py-2 text-xs shadow-xl" style={{ background: "#0f172a", color: "#f1f5f9" }}>
//               <div className="font-bold mb-1">{tooltip.name}</div>
//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-400">Farmers</span>
//                 <span className="font-semibold">{tooltip.count.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-400">Production</span>
//                 <span className="font-semibold">{tooltip.production.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between gap-4 mt-1">
//                 <span className="text-slate-400">Zone</span>
//                 <span className="font-bold" style={{ color: ZONE_COLORS[tooltip.zone] }}>
//                   {ZONE_LABEL[tooltip.zone]}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Legend footer */}
//       <div className="px-4 py-2 border-t border-slate-100 flex gap-3 flex-wrap">
//         {(["green", "yellow", "red"] as Zone[]).map(z => (
//           <div key={z} className="flex items-center gap-1.5">
//             <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[z] }} />
//             <span className="text-xs text-slate-500">{ZONE_LABEL[z]}</span>
//           </div>
//         ))}
//         <div className="flex items-center gap-1.5">
//           <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
//           <span className="text-xs text-slate-400">No data</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // THREE-MAP HIERARCHICAL ZONE MAPS
// // ─────────────────────────────────────────────────────────────────────────────
// function HierarchicalZoneMap({
//   allPostings,
//   pageSelectedState,
//   pageSelectedDistrict,
// }: {
//   allPostings: Posting[];
//   pageSelectedState: string;
//   pageSelectedDistrict: string;
// }) {
//   const [stateZoneFilter,    setStateZoneFilter]    = useState<ZoneFilter>("all");
//   const [districtZoneFilter, setDistrictZoneFilter] = useState<ZoneFilter>("all");
//   const [talukZoneFilter,    setTalukZoneFilter]    = useState<ZoneFilter>("all");

//   useEffect(() => { setDistrictZoneFilter("all"); }, [pageSelectedState]);
//   useEffect(() => { setTalukZoneFilter("all"); },    [pageSelectedDistrict]);

//   // ── STATE-level aggregation ───────────────────────────────────────────────
//   const stateAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
//     const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
//     allPostings.forEach(p => {
//       // FIX: normalize to GeoJSON name AND store by that key
//       const geoName = normalizeStateName(p.state);
//       const key = norm(geoName);
//       if (!key || key === "unknown") return;
//       if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
//       map[key].count++;
//       map[key].production += p.production;
//       map[key].zones.push(p.zone);
//     });
//     const result: Record<string, { count: number; production: number; zone: Zone }> = {};
//     Object.entries(map).forEach(([k, v]) => {
//       const zc = { green: 0, yellow: 0, red: 0 };
//       v.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
//       result[k] = { count: v.count, production: v.production, zone };
//     });
//     return result;
//   }, [allPostings]);

//   // ── DISTRICT-level aggregation ────────────────────────────────────────────
//   const districtAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
//     if (!pageSelectedState) return {};
//     const filtered = allPostings.filter(p =>
//       norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState))
//     );
//     const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
//     filtered.forEach(p => {
//       const key = norm(p.district);
//       if (!key || key === "—" || key === "unknown") return;
//       if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
//       map[key].count++;
//       map[key].production += p.production;
//       map[key].zones.push(p.zone);
//     });
//     const result: Record<string, { count: number; production: number; zone: Zone }> = {};
//     Object.entries(map).forEach(([k, v]) => {
//       const zc = { green: 0, yellow: 0, red: 0 };
//       v.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
//       result[k] = { count: v.count, production: v.production, zone };
//     });
//     return result;
//   }, [allPostings, pageSelectedState]);

//   // ── TALUK-level aggregation ───────────────────────────────────────────────
//   // FIX: always aggregate by TALUK NAME (for the tile view)
//   // When no district selected, also build a district-keyed map for the map view
//   const talukAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
//     if (!pageSelectedState) return {};
//     let filtered = allPostings.filter(p =>
//       norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState))
//     );
//     if (pageSelectedDistrict) {
//       filtered = filtered.filter(p => norm(p.district) === norm(pageSelectedDistrict));
//     }
//     // Key by TALUK always (tile view)
//     const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
//     filtered.forEach(p => {
//       const key = norm(p.taluk);
//       if (!key || key === "—" || key === "unknown") return;
//       if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
//       map[key].count++;
//       map[key].production += p.production;
//       map[key].zones.push(p.zone);
//     });
//     const result: Record<string, { count: number; production: number; zone: Zone }> = {};
//     Object.entries(map).forEach(([k, v]) => {
//       const zc = { green: 0, yellow: 0, red: 0 };
//       v.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
//       result[k] = { count: v.count, production: v.production, zone };
//     });
//     return result;
//   }, [allPostings, pageSelectedState, pageSelectedDistrict]);

//   const totalStateFarmers    = useMemo(() => Object.values(stateAggMap).reduce((s, v) => s + v.count, 0),    [stateAggMap]);
//   const totalDistrictFarmers = useMemo(() => Object.values(districtAggMap).reduce((s, v) => s + v.count, 0), [districtAggMap]);
//   const totalTalukFarmers    = useMemo(() => Object.values(talukAggMap).reduce((s, v) => s + v.count, 0),    [talukAggMap]);

//   const INDIA_CENTER: [number, number] = [82.5, 22];
//   const INDIA_ZOOM   = 800;

//   const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
//     "karnataka":         { center: [75.7, 14.5],  zoom: 2800 },
//     "andhra pradesh":    { center: [79.5, 15.5],  zoom: 2200 },
//     "telangana":         { center: [79.0, 17.5],  zoom: 3000 },
//     "tamil nadu":        { center: [78.5, 11.0],  zoom: 2500 },
//     "tamilnadu":         { center: [78.5, 11.0],  zoom: 2500 },
//     "kerala":            { center: [76.3, 10.5],  zoom: 3000 },
//     "maharashtra":       { center: [76.5, 19.0],  zoom: 1800 },
//     "gujarat":           { center: [71.5, 22.5],  zoom: 2000 },
//     "rajasthan":         { center: [74.0, 27.0],  zoom: 1500 },
//     "madhya pradesh":    { center: [78.5, 23.5],  zoom: 1800 },
//     "uttar pradesh":     { center: [80.5, 27.0],  zoom: 1800 },
//     "bihar":             { center: [85.5, 25.5],  zoom: 3000 },
//     "west bengal":       { center: [87.5, 23.0],  zoom: 2500 },
//     "orissa":            { center: [84.0, 20.5],  zoom: 2500 },
//     "odisha":            { center: [84.0, 20.5],  zoom: 2500 },
//     "chhattisgarh":      { center: [81.5, 21.5],  zoom: 2400 },
//     "jharkhand":         { center: [85.5, 23.5],  zoom: 2800 },
//     "assam":             { center: [92.0, 26.5],  zoom: 2800 },
//     "punjab":            { center: [75.5, 31.0],  zoom: 3500 },
//     "haryana":           { center: [76.5, 29.5],  zoom: 3000 },
//     "himachal pradesh":  { center: [77.0, 32.0],  zoom: 3000 },
//     "uttaranchal":       { center: [79.5, 30.5],  zoom: 3200 },
//     "uttarakhand":       { center: [79.5, 30.5],  zoom: 3200 },
//     "goa":               { center: [74.1, 15.3],  zoom: 6000 },
//     "delhi":             { center: [77.1, 28.7],  zoom: 8000 },
//     "sikkim":            { center: [88.5, 27.5],  zoom: 5000 },
//     "arunachal pradesh": { center: [94.7, 28.2],  zoom: 2000 },
//     "nagaland":          { center: [94.5, 26.2],  zoom: 4000 },
//     "manipur":           { center: [93.9, 24.7],  zoom: 4000 },
//     "mizoram":           { center: [92.9, 23.2],  zoom: 4000 },
//     "tripura":           { center: [91.9, 23.8],  zoom: 5000 },
//     "meghalaya":         { center: [91.4, 25.5],  zoom: 4000 },
//     "jammu and kashmir": { center: [75.3, 33.7],  zoom: 2000 },
//   };

//   // Look up center by normalized state name (try both original and GeoJSON-normalized)
//   const getStateCenterConfig = (stateName: string) => {
//     const attempts = [
//       norm(stateName),
//       norm(normalizeStateName(stateName)),
//     ];
//     for (const k of attempts) {
//       if (STATE_CENTERS[k]) return STATE_CENTERS[k];
//     }
//     return { center: INDIA_CENTER, zoom: INDIA_ZOOM };
//   };

//   const stateCenterConfig = pageSelectedState
//     ? getStateCenterConfig(pageSelectedState)
//     : { center: INDIA_CENTER, zoom: INDIA_ZOOM };

//   // For the district map filter, use normalizeStateName to get GeoJSON-compatible name
//   const geoFilterStateValue = pageSelectedState
//     ? normalizeStateName(pageSelectedState)
//     : "__NONE__";

//   return (
//     <div>
//       <div className="flex items-center gap-3 mb-4">
//         <div className="flex items-center gap-2">
//           <span className="text-base font-bold text-slate-700">Production Zone Maps</span>
//           <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">3 views • filter-aware</span>
//         </div>
//         {!pageSelectedState && (
//           <span className="text-xs text-slate-400">← Select a State in the filter bar above to drill down into Districts &amp; Taluks</span>
//         )}
//       </div>

//       <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

//         {/* MAP 1 — State level */}
//         <MapPanel
//           title="State-Level Overview"
//           subtitle="Farmer count & zone per state across India"
//           icon="🗺"
//           accentColor="#D85A30"
//           geoUrl={INDIA_STATES_GEO}
//           geoNameKey="NAME_1"
//           aggMap={stateAggMap}
//           center={INDIA_CENTER}
//           zoom={INDIA_ZOOM}
//           activeZone={stateZoneFilter}
//           onZoneFilterChange={setStateZoneFilter}
//           totalPostings={totalStateFarmers}
//           highlightName={pageSelectedState || undefined}
//         />

//         {/* MAP 2 — District level */}
//         <MapPanel
//           title={pageSelectedState ? `District View — ${pageSelectedState}` : "District View"}
//           subtitle={
//             pageSelectedState
//               ? `Districts inside ${pageSelectedState} • farmer distribution`
//               : "Select a state to see districts"
//           }
//           icon="🏙"
//           accentColor="#378ADD"
//           geoUrl={INDIA_DISTRICTS_GEO}
//           geoNameKey="NAME_2"
//           geoFilterKey="NAME_1"
//           geoFilterValue={geoFilterStateValue}
//           aggMap={pageSelectedState ? districtAggMap : {}}
//           center={stateCenterConfig.center}
//           zoom={stateCenterConfig.zoom}
//           activeZone={districtZoneFilter}
//           onZoneFilterChange={setDistrictZoneFilter}
//           totalPostings={totalDistrictFarmers}
//           highlightName={pageSelectedDistrict || undefined}
//         />

//         {/* PANEL 3 — Taluk level
//             FIX: When district IS selected → show TalukTilePanel (taluk names, no geo)
//                  When only state selected → show map colored by dominant taluk zone per district */}
//         {pageSelectedDistrict ? (
//           <TalukTilePanel
//             title={`Taluk View — ${pageSelectedDistrict}`}
//             subtitle={`Taluks inside ${pageSelectedDistrict} (coloured by zone)`}
//             icon="🏛"
//             accentColor="#7F77DD"
//             aggMap={talukAggMap}
//             activeZone={talukZoneFilter}
//             onZoneFilterChange={setTalukZoneFilter}
//             totalPostings={totalTalukFarmers}
//             highlightName={pageSelectedDistrict}
//           />
//         ) : (
//           <MapPanel
//             title={
//               pageSelectedState
//                 ? `Taluk View — ${pageSelectedState}`
//                 : "Taluk View"
//             }
//             subtitle={
//               pageSelectedState
//                 ? `District-wise taluk rollup for ${pageSelectedState} — select a district for taluk detail`
//                 : "Select a state & district to see taluk breakdown"
//             }
//             icon="🏛"
//             accentColor="#7F77DD"
//             geoUrl={INDIA_DISTRICTS_GEO}
//             geoNameKey="NAME_2"
//             geoFilterKey="NAME_1"
//             geoFilterValue={geoFilterStateValue}
//             // When no district selected: colour districts by dominant taluk zone — reuse districtAggMap
//             aggMap={pageSelectedState ? districtAggMap : {}}
//             center={stateCenterConfig.center}
//             zoom={stateCenterConfig.zoom}
//             activeZone={talukZoneFilter}
//             onZoneFilterChange={setTalukZoneFilter}
//             totalPostings={totalTalukFarmers}
//             highlightName={undefined}
//           />
//         )}
//       </div>

//       {/* Legend row */}
//       <div className="mt-4 flex flex-wrap gap-4 items-center px-1">
//         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Zone Legend:</span>
//         {(["green", "yellow", "red"] as Zone[]).map(z => (
//           <div key={z} className="flex items-center gap-1.5">
//             <div className="w-3 h-3 rounded-sm" style={{ background: ZONE_COLORS[z] }} />
//             <span className="text-xs text-slate-600">{ZONE_LABEL[z]}</span>
//           </div>
//         ))}
//         <div className="flex items-center gap-1.5">
//           <div className="w-3 h-3 rounded-sm bg-slate-300" />
//           <span className="text-xs text-slate-400">No data / out of filter</span>
//         </div>
//         <span className="ml-auto text-xs text-slate-400">Powered by react-simple-maps • GeoJSON © Natural Earth</span>
//       </div>
//     </div>
//   );
// }

// // ─── Monthly Trend Table ──────────────────────────────────────────────────────
// function MonthlyTrendTable({ rows, months, locationLabel }: { rows: CommodityRow[]; months: string[]; locationLabel: string }) {
//   if (!rows.length) return <div style={{ padding:24, textAlign:"center", color:"#94a3b8" }}>No commodity data</div>;
//   const shortMonth = (m:string) => { const p=m.split(" "); return `${p[0]} ${(p[1]||"").slice(2)}`; };
//   return (
//     <div style={{ overflowX:"auto" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
//         Monthly Performance Trend {locationLabel && `(${locationLabel})`}
//       </div>
//       <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
//         <thead>
//           <tr style={{ background:"#f8f9fb" }}>
//             <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:120 }}>Commodity</th>
//             <th style={{ padding:"10px 8px", textAlign:"right", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Area (Acres)</th>
//             {months.map(m=>(
//               <th key={m} style={{ padding:"10px 6px", textAlign:"center", fontWeight:600, color:"#64748b", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:52 }}>{shortMonth(m)}</th>
//             ))}
//             <th style={{ padding:"10px 8px", textAlign:"center", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Trend<br/><span style={{ fontSize:10, fontWeight:400, color:"#94a3b8" }}>(Last 3 Mo)</span></th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row,ri) => {
//             const sc = STATUS_COLORS[row.status];
//             const sparkValues = months.map(m => {
//               const t = row.monthlyTrend[m] || "stable";
//               const sm: Record<TrendValue,number> = { up:5, slightly_up:4, stable:3, down:2, sharp_decline:1 };
//               return sm[t] ?? 3;
//             });
//             return (
//               <tr key={row.commodity} style={{ background:ri%2===0?"#fff":"#fafafa", borderBottom:"1px solid #f3f4f6" }}>
//                 <td style={{ padding:"10px 12px", fontWeight:600, whiteSpace:"nowrap" }}>
//                   <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
//                     <span style={{ fontSize:16 }}>{getCommodityIcon(row.commodity)}</span>{row.commodity}
//                   </span>
//                 </td>
//                 <td style={{ padding:"10px 8px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500 }}>{row.totalArea.toLocaleString()}</td>
//                 {months.map(m=>(
//                   <td key={m} style={{ padding:"10px 6px", textAlign:"center" }}>
//                     <TrendCell trend={row.monthlyTrend[m]||"stable"} color={sc.dot}/>
//                   </td>
//                 ))}
//                 <td style={{ padding:"10px 8px", textAlign:"center" }}><Sparkline values={sparkValues} color={sc.dot}/></td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:14, padding:"10px 0", borderTop:"1px solid #f3f4f6", fontSize:12, color:"#64748b" }}>
//         <span style={{ fontWeight:600, color:"#333" }}>Trend Indication:</span>
//         {[
//           {icon:"↗",label:"Improving",color:"#1D9E75"},
//           {icon:"↗",label:"Slightly Improving",color:"#4A90A4"},
//           {icon:"→",label:"Stable",color:"#888"},
//           {icon:"↓",label:"Declining",color:"#EF9F27"},
//           {icon:"↘",label:"Sharp Decline",color:"#E24B4A"},
//         ].map(t=>(
//           <span key={t.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
//             <span style={{ color:t.color, fontWeight:700, fontSize:14 }}>{t.icon}</span>
//             <span>{t.label}</span>
//           </span>
//         ))}
//       </div>
//       <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>
//         Note: Area (Acres) is the cultivated area under the respective commodity during the survey month.
//       </div>
//     </div>
//   );
// }

// function CommodityStatusPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
//   const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px", height:"100%" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>Commodity Wise Status</div>
//       {locationLabel && <div style={{ fontSize:12, color:"#64748b", marginBottom:16 }}>({locationLabel})</div>}
//       <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
//         <thead>
//           <tr style={{ background:"#f8f9fb" }}>
//             <th style={{ padding:"8px 6px", textAlign:"left",   fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Commodity</th>
//             <th style={{ padding:"8px 6px", textAlign:"right",  fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Area</th>
//             <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Status</th>
//             <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Ind.</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map(row => {
//             const sc = STATUS_COLORS[row.status];
//             return (
//               <tr key={row.commodity} style={{ borderBottom:"1px solid #f3f4f6" }}>
//                 <td style={{ padding:"9px 6px", fontWeight:500 }}>
//                   <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
//                     <span>{getCommodityIcon(row.commodity)}</span>
//                     <span style={{ fontSize:13 }}>{row.commodity}</span>
//                   </span>
//                 </td>
//                 <td style={{ padding:"9px 6px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500, fontSize:13 }}>{row.totalArea.toLocaleString()}</td>
//                 <td style={{ padding:"9px 6px", textAlign:"center" }}>
//                   <span style={{ background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{row.status}</span>
//                 </td>
//                 <td style={{ padding:"9px 6px", textAlign:"center" }}>
//                   <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
//                     <div style={{ width:32, height:4, borderRadius:2, background:sc.dot }}/>
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//         <tfoot>
//           <tr style={{ background:"#f8f9fb", borderTop:"2px solid #e5e7eb" }}>
//             <td colSpan={2} style={{ padding:"10px 6px", fontWeight:700, fontSize:13 }}>
//               Total Area (Acres) <span style={{ marginLeft:8, color:"#1a1a1a" }}>{totalArea.toLocaleString()}</span>
//             </td>
//             <td colSpan={2}/>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }

// function SummaryPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
//   const groups = {
//     "Good/High": rows.filter(r=>r.status==="Good/High"),
//     "Moderate":  rows.filter(r=>r.status==="Moderate"),
//     "Low/Poor":  rows.filter(r=>r.status==="Low/Poor"),
//   } as const;
//   const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>
//         Summary {locationLabel && `(${locationLabel})`}
//       </div>
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:20, marginTop:16 }}>
//         {(["Good/High","Moderate","Low/Poor"] as const).map(status => {
//           const sc   = STATUS_COLORS[status];
//           const grp  = groups[status];
//           const area = grp.reduce((s,r)=>s+r.totalArea, 0);
//           return (
//             <div key={status} style={{ borderLeft:`3px solid ${sc.dot}`, paddingLeft:14 }}>
//               <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
//                 <span style={{ fontWeight:700, color:sc.text, fontSize:13 }}>{status}</span>
//               </div>
//               <div style={{ fontSize:28, fontWeight:800, color:sc.dot }}>{grp.length}</div>
//               <div style={{ fontSize:12, color:"#64748b" }}>Commodities</div>
//               <div style={{ fontSize:18, fontWeight:700, marginTop:8, color:"#1a1a1a" }}>
//                 {area.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
//               </div>
//             </div>
//           );
//         })}
//         <div style={{ borderLeft:"1px solid #e5e7eb", paddingLeft:14 }}>
//           <div style={{ fontSize:12, color:"#64748b", marginBottom:6 }}>Total Commodities</div>
//           <div style={{ fontSize:28, fontWeight:800, color:"#1a1a1a" }}>{rows.length}</div>
//           <div style={{ fontSize:12, color:"#64748b", marginTop:12 }}>Total Area Surveyed</div>
//           <div style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>
//             {totalArea.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
//           </div>
//         </div>
//       </div>
//       <div style={{ marginTop:16, fontSize:11, color:"#94a3b8", borderTop:"1px solid #e5e7eb", paddingTop:10, display:"flex", gap:20, flexWrap:"wrap" }}>
//         <span>📅 Survey Period: Jun 2023 – May 2024</span>
//         <span>🗄 Source: Agriculture Department</span>
//         <span>🔄 Last Updated: 20 May 2024</span>
//       </div>
//     </div>
//   );
// }

// function LocationFilterBar({
//   selectedState, selectedDistrict, selectedTaluk, selectedVillage,
//   onSelectState, onSelectDistrict, onSelectTaluk, onSelectVillage,
//   states, districts, taluks, villages,
//   surveyMonths, selectedMonth, onSelectMonth,
// }: {
//   selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
//   onSelectState:(s:string)=>void; onSelectDistrict:(s:string)=>void; onSelectTaluk:(s:string)=>void; onSelectVillage:(s:string)=>void;
//   states:string[]; districts:string[]; taluks:string[]; villages:string[];
//   surveyMonths:string[]; selectedMonth:string; onSelectMonth:(m:string)=>void;
// }) {
//   const selStyle = (active:boolean): React.CSSProperties => ({
//     padding:"8px 14px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13,
//     background:active?"#F0FDF4":"#fff", fontWeight:active?600:400,
//     color:active?"#166534":"#374151", cursor:"pointer", minWidth:140,
//   });
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"14px 20px", marginBottom:20, display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-end" }}>
//       {[
//         { label:"📍 State",    value:selectedState,    onChange:onSelectState,    options:states,    placeholder:"All States",    disabled:false           },
//         { label:"🏙 District", value:selectedDistrict, onChange:onSelectDistrict, options:districts, placeholder:"All Districts", disabled:!selectedState   },
//         { label:"🏛 Taluk",    value:selectedTaluk,    onChange:onSelectTaluk,    options:taluks,    placeholder:"All Taluks",    disabled:!selectedDistrict},
//         { label:"🏘 Village",  value:selectedVillage,  onChange:onSelectVillage,  options:villages,  placeholder:"All Villages",  disabled:!selectedTaluk  },
//       ].map(f => (
//         <div key={f.label} style={{ display:"flex", flexDirection:"column", gap:4 }}>
//           <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{f.label}</label>
//           <select value={f.value} onChange={e=>f.onChange(e.target.value)} disabled={f.disabled}
//             style={{ ...selStyle(!!f.value), opacity:f.disabled?0.5:1 }}>
//             <option value="">{f.placeholder}</option>
//             {f.options.map(o => <option key={o} value={o}>{o}</option>)}
//           </select>
//         </div>
//       ))}
//       {surveyMonths.length > 0 && (
//         <div style={{ display:"flex", flexDirection:"column", gap:4, marginLeft:"auto" }}>
//           <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>📅 Survey Month</label>
//           <select value={selectedMonth} onChange={e=>onSelectMonth(e.target.value)} style={selStyle(!!selectedMonth)}>
//             <option value="">All Months</option>
//             {surveyMonths.map(m => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// function LocationBreadcrumb({
//   selectedState, selectedDistrict, selectedTaluk, selectedVillage, onReset,
// }: {
//   selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
//   onReset:(level:"state"|"district"|"taluk"|"village"|"all")=>void;
// }) {
//   const parts = [
//     selectedState    && { label:selectedState,    level:"state"   as const },
//     selectedDistrict && { label:selectedDistrict, level:"district"as const },
//     selectedTaluk    && { label:selectedTaluk,    level:"taluk"   as const },
//     selectedVillage  && { label:selectedVillage,  level:"village" as const },
//   ].filter(Boolean) as { label:string; level:"state"|"district"|"taluk"|"village" }[];
//   if (!parts.length) return null;
//   return (
//     <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"8px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", fontSize:13 }}>
//       <span style={{ color:"#64748b", fontWeight:500 }}>Viewing:</span>
//       <button onClick={()=>onReset("all")} style={{ background:"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:500, fontSize:13, padding:"0 4px" }}>All</button>
//       {parts.map((p,i) => (
//         <span key={p.level} style={{ display:"flex", alignItems:"center", gap:6 }}>
//           <span style={{ color:"#94a3b8" }}>›</span>
//           <button onClick={()=>onReset(p.level)}
//             style={{ background:i===parts.length-1?"#BFDBFE":"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:i===parts.length-1?700:500, fontSize:13, padding:"2px 8px", borderRadius:12 }}>
//             {p.label}
//           </button>
//         </span>
//       ))}
//     </div>
//   );
// }

// // ─── Main Dashboard ───────────────────────────────────────────────────────────
// export default function FarmDashboard() {
//   const [loading,          setLoading]          = useState(true);
//   const [error,            setError]            = useState<string|null>(null);
//   const [search,           setSearch]           = useState("");
//   const [filterType,       setFilterType]       = useState("");
//   const [filterCommodity,  setFilterCommodity]  = useState("");
//   const [page,             setPage]             = useState(1);
//   const [adminData,        setAdminData]        = useState<AdminData|null>(null);
//   const [adminLoading,     setAdminLoading]     = useState(true);
//   const [configsLoading,   setConfigsLoading]   = useState(true);
//   const [allConfigs,       setAllConfigs]       = useState<ZoneConfig[]>([]);
//   const [openModal,        setOpenModal]        = useState<null|"state"|"district"|"taluk">(null);
//   const [rawPostings,      setRawPostings]      = useState<Omit<Posting,"zone">[]>([]);
//   const [selectedState,    setSelectedState]    = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedTaluk,    setSelectedTaluk]    = useState("");
//   const [selectedVillage,  setSelectedVillage]  = useState("");
//   const [selectedMonth,    setSelectedMonth]    = useState("");
//   const PAGE_SIZE = 10;

//   const configsMap = useMemo<Record<string, ZoneConfig>>(() => {
//     const map: Record<string, ZoneConfig> = {};
//     allConfigs.forEach(c => {
//       const restored: ZoneConfig = {
//         ...c,
//         commodityRanges: (c.commodityRanges ?? []).map(cr => ({
//           ...cr,
//           ranges: {
//             green:  { ...cr.ranges.green,  max: cr.ranges.green.max  === null || cr.ranges.green.max  > 1e15 ? Infinity : cr.ranges.green.max  },
//             yellow: { ...cr.ranges.yellow, max: cr.ranges.yellow.max === null || cr.ranges.yellow.max > 1e15 ? Infinity : cr.ranges.yellow.max },
//             red:    { ...cr.ranges.red,    max: cr.ranges.red.max    === null || cr.ranges.red.max    > 1e15 ? Infinity : cr.ranges.red.max    },
//           },
//         })),
//       };
//       map[buildConfigKey(c)] = restored;
//     });
//     return map;
//   }, [allConfigs]);

//   const allCommodities = useMemo(() => {
//     const s = new Set(rawPostings.map(r => r.commodity).filter(v => v && v !== "Unknown"));
//     return Array.from(s).sort();
//   }, [rawPostings]);

//   useEffect(() => {
//     (async () => {
//       setConfigsLoading(true);
//       try {
//         const res  = await fetch("/api/taluk-zone-configs");
//         if (!res.ok) throw new Error("Failed");
//         const data = await res.json();
//         const sanitized = (data.configs || []).map((c: ZoneConfig) => ({
//           level:           c.level    ?? "taluk",
//           state:           c.state    ?? "",
//           district:        c.district ?? "",
//           taluk:           c.taluk    ?? "",
//           commodityRanges: Array.isArray(c.commodityRanges) ? c.commodityRanges : [],
//         }));
//         setAllConfigs(sanitized);
//       } catch { setAllConfigs([]); }
//       finally { setConfigsLoading(false); }
//     })();
//   }, []);

//   const handleSaveConfigs = useCallback(async (configs: ZoneConfig[]) => {
//     try {
//       const serialisable = JSON.parse(JSON.stringify(configs, (_, v) =>
//         v === Infinity ? 999999999 : v
//       ));
//       const res  = await fetch("/api/taluk-zone-configs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ configs: serialisable }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to save");
//       setAllConfigs(configs);
//       setOpenModal(null);
//       alert("Configurations saved successfully");
//     } catch(e) { console.error(e); alert("Failed to save configurations"); }
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const session = await getAdminSessionAction();
//         if (session?.admin) {
//           setAdminData({ taluka:session.admin.taluka??"", role:session.admin.role??"subadmin", name:session.admin.name, email:session.admin.email });
//         }
//       } catch(e) { console.error(e); }
//       finally { setAdminLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     if (adminLoading) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const firstRes  = await fetch("/api/postings?page=1&limit=10");
//         if (!firstRes.ok) throw new Error("Failed to fetch /api/postings");
//         const firstJson = await firstRes.json();
//         const total     = firstJson.total ?? firstJson.stats?.totalCrops ?? 0;
//         const pageSize  = firstJson.limit ?? 10;
//         const pageCount = Math.ceil(total / pageSize);
//         const allPages: unknown[][] = [firstJson.data ?? []];
//         if (pageCount > 1) {
//           const pageNums = Array.from({ length:pageCount-1 }, (_,i)=>i+2);
//           const results  = await Promise.all(pageNums.map(pg =>
//             fetch(`/api/postings?page=${pg}&limit=${pageSize}`)
//               .then(r=>r.ok?r.json():{data:[]})
//               .then(j=>(j.data??[]) as unknown[])
//           ));
//           allPages.push(...results);
//         }
//         const source: unknown[] = allPages.flat();
//         const enriched: Omit<Posting,"zone">[] = source.map((p: unknown) => {
//           const posting = p as {
//             _id:string; farmerId:string; farmingType:string; seedType:string; acres:number;
//             commodity?:string; sowingDate?:string; createdAt?:string;
//             tracking?:{cropName?:string};
//             farmer?:{
//               personalInfo?:{taluk?:string;taluka?:string;district?:string;state?:string;address?:string;villageGramaPanchayat?:string};
//               farmLocation?:{latitude?:string;longitude?:string};
//               taluka?:string; district?:string; state?:string;
//             };
//           };
//           const pi         = posting.farmer?.personalInfo ?? {};
//           const fl         = posting.farmer?.farmLocation  ?? {};
//           const commodity  = (posting.commodity||posting.tracking?.cropName||posting.seedType||"Unknown").trim();
//           const production = getProduction(posting.acres??0, posting.farmingType??"regular");
//           const taluk      = (pi.taluk??pi.taluka??posting.farmer?.taluka??"Unknown").trim();
//           const district   = (pi.district??posting.farmer?.district??"—").trim();
//           const state      = (pi.state??posting.farmer?.state??"Unknown").trim();
//           const village    = (pi.villageGramaPanchayat||pi.address||"—").trim() || "—";
//           const month      = monthFromDate(posting.sowingDate||posting.createdAt||"");
//           return {
//             id:posting._id, farmerId:posting.farmerId,
//             farmingType:(posting.farmingType??"regular").toLowerCase(),
//             seedType:posting.seedType, acres:posting.acres??0,
//             production, taluk, district, state, village, commodity,
//             lat:parseFloat(fl.latitude??"")||null, lng:parseFloat(fl.longitude??"")||null, month,
//           };
//         });
//         setRawPostings(enriched);
//       } catch(e) { setError(e instanceof Error ? e.message : String(e)); }
//       finally { setLoading(false); }
//     })();
//   }, [adminLoading]);

//   useEffect(() => {
//     if (adminData?.role==="subadmin" && adminData.taluka && !selectedTaluk)
//       setSelectedTaluk(adminData.taluka);
//   }, [adminData]);

//   const allPostings = useMemo<Posting[]>(() =>
//     rawPostings.map(p => ({
//       ...p,
//       zone: getZoneForPosting(p.production, p.commodity, p.taluk, p.district, p.state, configsMap),
//     })),
//     [rawPostings, configsMap]
//   );

//   const states = useMemo(() => {
//     const s = new Set(allPostings.map(r=>r.state).filter(v=>v&&v!=="Unknown"));
//     return Array.from(s).sort();
//   }, [allPostings]);

//   const districts = useMemo(() => {
//     const base = selectedState ? allPostings.filter(r=>r.state===selectedState) : allPostings;
//     const s = new Set(base.map(r=>r.district).filter(v=>v&&v!=="—"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState]);

//   const taluks = useMemo(() => {
//     let b = allPostings;
//     if (selectedState)    b = b.filter(r=>r.state===selectedState);
//     if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
//     const s = new Set(b.map(r=>r.taluk).filter(v=>v&&v!=="Unknown"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState, selectedDistrict]);

//   const villages = useMemo(() => {
//     let b = allPostings;
//     if (selectedState)    b = b.filter(r=>r.state===selectedState);
//     if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
//     if (selectedTaluk)    b = b.filter(r=>r.taluk===selectedTaluk);
//     const s = new Set(b.map(r=>r.village).filter(v=>v&&v!=="—"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState, selectedDistrict, selectedTaluk]);

//   const surveyMonths = useMemo(() => {
//     const s = new Set(allPostings.map(r=>r.month).filter(Boolean));
//     if (s.size === 0) return SURVEY_MONTHS;
//     return Array.from(s).sort((a,b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime());
//   }, [allPostings]);

//   const locationFiltered = useMemo(() => {
//     let data = allPostings;
//     if (adminData?.role==="subadmin" && adminData.taluka)
//       data = data.filter(r => norm(r.taluk) === norm(adminData.taluka));
//     if (selectedState)    data = data.filter(r=>r.state===selectedState);
//     if (selectedDistrict) data = data.filter(r=>r.district===selectedDistrict);
//     if (selectedTaluk)    data = data.filter(r=>r.taluk===selectedTaluk);
//     if (selectedVillage)  data = data.filter(r=>r.village===selectedVillage);
//     if (selectedMonth)    data = data.filter(r=>r.month===selectedMonth);
//     return data;
//   }, [allPostings, adminData, selectedState, selectedDistrict, selectedTaluk, selectedVillage, selectedMonth]);

//   const filtered = useMemo(() => {
//     const s = search.toLowerCase();
//     return locationFiltered.filter(r => {
//       const matchSearch = !s ||
//         r.farmerId.toLowerCase().includes(s) ||
//         r.farmingType.toLowerCase().includes(s) ||
//         r.commodity.toLowerCase().includes(s) ||
//         r.taluk.toLowerCase().includes(s) ||
//         r.district.toLowerCase().includes(s) ||
//         r.village.toLowerCase().includes(s);
//       return matchSearch && (!filterType||r.farmingType===filterType) && (!filterCommodity||r.commodity===filterCommodity);
//     });
//   }, [locationFiltered, search, filterType, filterCommodity]);

//   const commodityRows = useMemo<CommodityRow[]>(() => {
//     const map: Record<string,{totalArea:number;monthProds:Record<string,number[]>;totalProduction:number;zones:Zone[]}> = {};
//     filtered.forEach(r => {
//       if (!map[r.commodity]) map[r.commodity] = { totalArea:0, monthProds:{}, totalProduction:0, zones:[] };
//       map[r.commodity].totalArea       += r.acres;
//       map[r.commodity].totalProduction += r.production;
//       map[r.commodity].zones.push(r.zone);
//       const mKey = r.month || "Unknown";
//       if (!map[r.commodity].monthProds[mKey]) map[r.commodity].monthProds[mKey] = [];
//       map[r.commodity].monthProds[mKey].push(r.production);
//     });
//     const activeMonths = surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS;
//     return Object.entries(map).map(([commodity, data]) => {
//       const zoneCounts = { green:0, yellow:0, red:0 };
//       data.zones.forEach(z => zoneCounts[z]++);
//       const dominantZone = (Object.entries(zoneCounts).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
//       const monthlyTrend: Record<string,TrendValue> = {};
//       activeMonths.forEach(m => {
//         const vals = data.monthProds[m];
//         if (!vals?.length) { monthlyTrend[m]="stable"; return; }
//         const avg        = vals.reduce((a,b)=>a+b,0) / vals.length;
//         const overallVals = Object.values(data.monthProds).flat();
//         const overallAvg  = overallVals.reduce((a,b)=>a+b,0) / overallVals.length;
//         const pct         = overallAvg > 0 ? ((avg-overallAvg)/overallAvg)*100 : 0;
//         if (pct>10)       monthlyTrend[m]="up";
//         else if (pct>3)   monthlyTrend[m]="slightly_up";
//         else if (pct<-15) monthlyTrend[m]="sharp_decline";
//         else if (pct<-3)  monthlyTrend[m]="down";
//         else              monthlyTrend[m]="stable";
//       });
//       const allProdByMonth = activeMonths.map(m => { const vals=data.monthProds[m]||[]; return vals.reduce((a,b)=>a+b,0); });
//       return { commodity, totalArea:data.totalArea, status:zoneToStatus(dominantZone), monthlyTrend, lastThreeMonthTrend:deriveTrend(allProdByMonth) };
//     }).sort((a,b) => b.totalArea - a.totalArea);
//   }, [filtered, surveyMonths]);

//   const aggTableData = useMemo<TalukAgg[]>(() => {
//     const groupField: keyof Posting =
//       selectedDistrict ? "taluk"    :
//       selectedState    ? "district" :
//                          "state";
//     const map: Record<string,{production:number;count:number;zones:Zone[]}> = {};
//     filtered.forEach(r => {
//       const key = (r[groupField] as string) || "";
//       if (!key || key==="Unknown" || key==="—") return;
//       if (!map[key]) map[key] = { production:0, count:0, zones:[] };
//       map[key].production += r.production;
//       map[key].count      += 1;
//       map[key].zones.push(r.zone);
//     });
//     return Object.entries(map).map(([name, data]) => {
//       const zc: Record<Zone,number> = { green:0, yellow:0, red:0 };
//       data.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
//       return { name, production:data.production, count:data.count, zone };
//     }).sort((a,b) => b.production - a.production);
//   }, [filtered, selectedState, selectedDistrict]);

//   const configCount = (level:"state"|"district"|"taluk") =>
//     allConfigs.filter(c=>c.level===level).reduce((sum,c)=>sum+(c.commodityRanges?.length??0), 0);

//   const totalProduction = useMemo(() => filtered.reduce((s,r)=>s+r.production, 0), [filtered]);
//   const totalAcres      = useMemo(() => filtered.reduce((s,r)=>s+r.acres, 0),      [filtered]);
//   const uniqueFarmers   = useMemo(() => new Set(filtered.map(r=>r.farmerId)).size,  [filtered]);
//   const farmingTypes    = useMemo(() => [...new Set(allPostings.map(r=>r.farmingType))].filter(Boolean).sort(), [allPostings]);

//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

//   const aggLevelLabel =
//     selectedDistrict ? "Taluk"    :
//     selectedState    ? "District" :
//                        "State";

//   const locationLabel =
//     selectedVillage  ? `${selectedVillage} Village`    :
//     selectedTaluk    ? `${selectedTaluk} Taluk`        :
//     selectedDistrict ? `${selectedDistrict} District`  :
//     selectedState    ? selectedState                   : "";

//   const handleSelectState    = (s:string) => { setSelectedState(s); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
//   const handleSelectDistrict = (d:string) => { setSelectedDistrict(d); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
//   const handleSelectTaluk    = (t:string) => { setSelectedTaluk(t); setSelectedVillage(""); setPage(1); };
//   const handleBreadcrumbReset = (level:"state"|"district"|"taluk"|"village"|"all") => {
//     if      (level==="all")      { setSelectedState(""); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="state")    { setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="district") { setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="taluk")    { setSelectedVillage(""); }
//     setPage(1);
//   };

//   const activeMonths = selectedMonth
//     ? [selectedMonth]
//     : (surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS);

//   const s = {
//     container:    { fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f8f9fb", minHeight:"100vh", padding:"0 0 40px" } as React.CSSProperties,
//     header:       { background:"#0f172a", color:"#fff", padding:"20px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" as const, gap:12 } as React.CSSProperties,
//     body:         { maxWidth:1500, margin:"0 auto", padding:"28px 24px" } as React.CSSProperties,
//     section:      { background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px 24px", marginBottom:24 } as React.CSSProperties,
//     sectionTitle: { fontSize:15, fontWeight:700, color:"#1a1a1a", marginBottom:16, letterSpacing:"-0.01em" } as React.CSSProperties,
//     statsGrid:    { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:14, marginBottom:24 } as React.CSSProperties,
//     table:        { width:"100%", borderCollapse:"collapse" as const, fontSize:13 } as React.CSSProperties,
//     th:           { textAlign:"left" as const, padding:"10px 12px", fontSize:11, fontWeight:600, color:"#888", textTransform:"uppercase" as const, letterSpacing:"0.05em", borderBottom:"1px solid #f3f4f6", whiteSpace:"nowrap" as const } as React.CSSProperties,
//     td:           { padding:"10px 12px", borderBottom:"0.5px solid #f3f4f6", color:"#1a1a1a" } as React.CSSProperties,
//     input:        { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, outline:"none", background:"#fff", color:"#1a1a1a", minWidth:200 } as React.CSSProperties,
//     select:       { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, background:"#fff", color:"#1a1a1a", cursor:"pointer" } as React.CSSProperties,
//   };

//   if (adminLoading || loading || configsLoading) {
//     return (
//       <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
//         <div style={{ textAlign:"center", color:"#64748b" }}>
//           <div style={{ fontSize:32, marginBottom:12 }}>⟳</div>
//           <div>{adminLoading?"Checking permissions…":configsLoading?"Loading configurations…":"Loading farm data…"}</div>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
//         <div style={{ background:"#FCEBEB", border:"1px solid #E24B4A44", borderRadius:12, padding:"20px 28px", color:"#791F1F", maxWidth:400 }}>
//           <strong>Error:</strong> {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={s.container}>
//       <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

//       {/* ── Header ── */}
//       <div style={s.header}>
//         <div>
//           <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em", margin:0 }}>Today Crops — Your Daily Harvest</h1>
//           <p style={{ fontSize:13, color:"#94a3b8", marginTop:2, marginBottom:0 }}>Agriculture Produce Survey · Commodity &amp; Location wise Status with Monthly Trend and Area (Acres)</p>
//           {locationLabel && <p style={{ fontSize:12, color:"#60a5fa", marginTop:4, marginBottom:0 }}>📍 {locationLabel} · {filtered.length} postings</p>}
//         </div>
//         <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:16 }}>
//             <RoleBadge adminData={adminData}/>
//             <div style={{ display:"flex", gap:12, fontSize:12, fontWeight:600 }}>
//               {(["green","yellow","red"] as Zone[]).map(z => (
//                 <span key={z} style={{ display:"flex", alignItems:"center", gap:5 }}>
//                   <span style={{ width:12, height:4, borderRadius:2, background:ZONE_COLORS[z], display:"inline-block" }}/>
//                   <span style={{ color:ZONE_COLORS[z] }}>{ZONE_LABEL[z]}</span>
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//             <input style={s.input} placeholder="Search farmer, crop, village…" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
//             <select style={s.select} value={filterType} onChange={e=>{ setFilterType(e.target.value); setPage(1); }}>
//               <option value="">All farming types</option>
//               {farmingTypes.map(t => <option key={t} value={t}>{t}</option>)}
//             </select>
//             <select style={s.select} value={filterCommodity} onChange={e=>{ setFilterCommodity(e.target.value); setPage(1); }}>
//               <option value="">All commodities</option>
//               {allCommodities.map(c => <option key={c} value={c}>{getCommodityIcon(c)} {c}</option>)}
//             </select>
//             {adminData?.role==="admin" && (
//               <div style={{ display:"flex", gap:8 }}>
//                 {([
//                   { level:"state"    as const, icon:"🗺", label:"State Zones",    color:"#D85A30", bg:"#FFF3EE", bd:"#FDBA74" },
//                   { level:"district" as const, icon:"🏙", label:"District Zones", color:"#378ADD", bg:"#EFF6FF", bd:"#BFDBFE" },
//                   { level:"taluk"    as const, icon:"🏛", label:"Taluk Zones",    color:"#7F77DD", bg:"#F5F3FF", bd:"#DDD6FE" },
//                 ]).map(btn => {
//                   const count = configCount(btn.level);
//                   return (
//                     <button key={btn.level} onClick={() => setOpenModal(btn.level)}
//                       style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${btn.bd}`, background:btn.bg, color:btn.color, cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
//                       {btn.icon} {btn.label}
//                       {count>0 && <span style={{ background:btn.color, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{count}</span>}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//           {(configCount("state")+configCount("district")+configCount("taluk")) > 0 && (
//             <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//               {(["state","district","taluk"] as const).map(level => {
//                 const count = configCount(level);
//                 if (!count) return null;
//                 const colors = { state:{c:"#D85A30",bg:"#FFF3EE",bd:"#FDBA74"}, district:{c:"#378ADD",bg:"#EFF6FF",bd:"#BFDBFE"}, taluk:{c:"#7F77DD",bg:"#F5F3FF",bd:"#DDD6FE"} };
//                 const clr = colors[level];
//                 return (
//                   <div key={level} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:clr.c, background:clr.bg, border:`1px solid ${clr.bd}`, borderRadius:20, padding:"3px 10px" }}>
//                     <span style={{ width:6, height:6, borderRadius:"50%", background:clr.c, display:"inline-block" }}/>
//                     {count} {level} override{count!==1?"s":""} active
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={s.body}>
//         <RoleInfoBanner adminData={adminData}/>

//         {allConfigs.length > 0 && (
//           <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
//             <span style={{ fontSize:13, fontWeight:600, color:"#5b21b6" }}>⚙ Zone overrides active:</span>
//             {(["state","district","taluk"] as const).map(level => {
//               const cfgs = allConfigs.filter(c=>c.level===level);
//               if (!cfgs.length) return null;
//               const colors = { state:"#D85A30", district:"#378ADD", taluk:"#7F77DD" };
//               return cfgs.map(cfg => {
//                 const locName = level==="state" ? cfg.state : level==="district" ? cfg.district : cfg.taluk;
//                 return (
//                   <span key={buildConfigKey(cfg)} style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fff", border:"1px solid #DDD6FE", borderRadius:20, padding:"2px 10px", fontSize:12, color:colors[level] }}>
//                     <span style={{ width:6, height:6, borderRadius:"50%", background:colors[level], display:"inline-block" }}/>
//                     {level}: {locName}
//                     <span style={{ color:"#94a3b8", fontSize:11 }}>({cfg.commodityRanges.length} crop{cfg.commodityRanges.length!==1?"s":""})</span>
//                   </span>
//                 );
//               });
//             })}
//           </div>
//         )}

//         <LocationFilterBar
//           selectedState={selectedState} selectedDistrict={selectedDistrict}
//           selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
//           onSelectState={handleSelectState} onSelectDistrict={handleSelectDistrict}
//           onSelectTaluk={handleSelectTaluk} onSelectVillage={v=>{ setSelectedVillage(v); setPage(1); }}
//           states={states} districts={districts} taluks={taluks} villages={villages}
//           surveyMonths={surveyMonths} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth}
//         />

//         <LocationBreadcrumb
//           selectedState={selectedState} selectedDistrict={selectedDistrict}
//           selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
//           onReset={handleBreadcrumbReset}
//         />

//         {/* Stats */}
//         <div style={s.statsGrid}>
//           <StatCard label="Total Postings"   value={filtered.length.toLocaleString()}               accent="#378ADD"/>
//           <StatCard label="Unique Farmers"   value={uniqueFarmers}                                   accent="#7F77DD"/>
//           <StatCard label="Total Acres"      value={totalAcres.toLocaleString()}                     accent="#1D9E75"/>
//           <StatCard label="Total Production" value={`${(totalProduction/1000).toFixed(1)}k`}         accent="#D85A30"/>
//           <StatCard label="Good / High"      value={filtered.filter(r=>r.zone==="green").length}     accent="#1D9E75"/>
//           <StatCard label="Moderate"         value={filtered.filter(r=>r.zone==="yellow").length}    accent="#EF9F27"/>
//           <StatCard label="Low / Poor"       value={filtered.filter(r=>r.zone==="red").length}       accent="#E24B4A"/>
//           <StatCard label="Commodities"      value={new Set(filtered.map(r=>r.commodity)).size}      accent="#4A90A4"/>
//         </div>

//         {/* Trend + Commodity status */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, marginBottom:24, alignItems:"start" }}>
//           <div style={s.section}><MonthlyTrendTable rows={commodityRows} months={activeMonths} locationLabel={locationLabel}/></div>
//           <CommodityStatusPanel rows={commodityRows} locationLabel={locationLabel}/>
//         </div>

//         <SummaryPanel rows={commodityRows} locationLabel={locationLabel}/>

//         {/* Charts + Aggregation table */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))", gap:24, margin:"24px 0" }}>
//           <div style={s.section}>
//             <div style={s.sectionTitle}>Production by Farming Type</div>
//             <BarChart data={[...filtered.reduce((m,r)=>{
//               if(!m.has(r.farmingType)) m.set(r.farmingType,{type:r.farmingType,production:0});
//               m.get(r.farmingType)!.production+=r.production;
//               return m;
//             },new Map<string,ChartEntry>()).values()].sort((a,b)=>b.production-a.production)}/>
//           </div>
//           <div style={s.section}>
//             <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
//               <div style={s.sectionTitle}>{aggLevelLabel}-Level Aggregation</div>
//             </div>
//             <div style={{ overflowY:"auto", maxHeight:280 }}>
//               <table style={s.table}>
//                 <thead>
//                   <tr>
//                     <th style={s.th}>{aggLevelLabel}</th>
//                     <th style={s.th}>Postings</th>
//                     <th style={{ ...s.th, textAlign:"right" }}>Total Production</th>
//                     <th style={{ ...s.th, textAlign:"center" }}>Zone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {aggTableData.map(item => (
//                     <tr key={item.name}>
//                       <td style={s.td}>{item.name}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{item.count}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{item.production.toLocaleString()}</td>
//                       <td style={{ ...s.td, textAlign:"center" }}><ZoneBadge zone={item.zone}/></td>
//                     </tr>
//                   ))}
//                   {aggTableData.length===0 && (
//                     <tr><td colSpan={4} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"24px 0" }}>No data</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* ── THREE-PANEL ZONE MAP ── */}
//         <div style={s.section}>
//           <HierarchicalZoneMap
//             allPostings={allPostings}
//             pageSelectedState={selectedState}
//             pageSelectedDistrict={selectedDistrict}
//           />
//         </div>

//         {/* Postings table */}
//         <div style={s.section}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
//             <div style={s.sectionTitle}>
//               Postings Table
//               {locationLabel && <span style={{ fontSize:13, fontWeight:400, color:"#6d28d9", marginLeft:8 }}>({locationLabel})</span>}
//             </div>
//             <span style={{ fontSize:13, color:"#94a3b8" }}>{filtered.length} results · Page {page} of {totalPages||1}</span>
//           </div>
//           <div style={{ overflowX:"auto" }}>
//             <table style={s.table}>
//               <thead>
//                 <tr>
//                   {(["Farmer ID","Commodity","Farming Type","Seed Type","Village","Taluk","District","State","Month","Acres","Production","Zone"] as const).map(h => (
//                     <th key={h} style={["Production","Acres"].includes(h)?{...s.th,textAlign:"right"}:s.th}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((r,i) => {
//                   const stateKey2 = buildConfigKey({ level:"state",    state:r.state, district:"",        taluk:"" });
//                   const distKey   = buildConfigKey({ level:"district", state:r.state, district:r.district, taluk:"" });
//                   const talukKey  = buildConfigKey({ level:"taluk",    state:r.state, district:r.district, taluk:r.taluk });
//                   const overrideLevel = configsMap[talukKey]?"taluk":configsMap[distKey]?"district":configsMap[stateKey2]?"state":null;
//                   return (
//                     <tr key={r.id} style={{ background:i%2===0?"#fafafa":"#fff" }}>
//                       <td style={{ ...s.td, fontWeight:600, color:"#1e40af", fontFamily:"monospace" }}>{r.farmerId}</td>
//                       <td style={s.td}>
//                         <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
//                           <span style={{ width:8, height:8, borderRadius:"50%", background:getCommodityColor(r.commodity), display:"inline-block" }}/>
//                           <span>{getCommodityIcon(r.commodity)}</span>
//                           {r.commodity}
//                           {overrideLevel && (
//                             <span title={`${overrideLevel}-level zone override`}
//                               style={{ fontSize:9, background:overrideLevel==="taluk"?"#F5F3FF":overrideLevel==="district"?"#EFF6FF":"#FFF3EE", color:overrideLevel==="taluk"?"#7F77DD":overrideLevel==="district"?"#378ADD":"#D85A30", border:`1px solid ${overrideLevel==="taluk"?"#DDD6FE":overrideLevel==="district"?"#BFDBFE":"#FDBA74"}`, borderRadius:8, padding:"0 5px", fontWeight:700 }}>
//                               {overrideLevel.toUpperCase()[0]}
//                             </span>
//                           )}
//                         </span>
//                       </td>
//                       <td style={{ ...s.td, textTransform:"capitalize" }}>{r.farmingType}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.seedType||"—"}</td>
//                       <td style={s.td}>{r.village}</td>
//                       <td style={s.td}>{r.taluk}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.district}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.state}</td>
//                       <td style={{ ...s.td, color:"#64748b", whiteSpace:"nowrap" }}>{r.month||"—"}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{r.acres.toLocaleString()}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{r.production.toLocaleString()}</td>
//                       <td style={s.td}><ZoneBadge zone={r.zone}/></td>
//                     </tr>
//                   );
//                 })}
//                 {paginated.length === 0 && (
//                   <tr><td colSpan={12} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"32px 0" }}>No postings found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalPages > 1 && (
//             <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20, flexWrap:"wrap" }}>
//               <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
//                 style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===1?"not-allowed":"pointer", fontSize:13, color:page===1?"#ccc":"#374151" }}>
//                 ← Prev
//               </button>
//               {Array.from({length:Math.min(totalPages,7)},(_,i)=>i+1).map(pg => (
//                 <button key={pg} onClick={()=>setPage(pg)}
//                   style={{ padding:"6px 12px", borderRadius:7, border:`0.5px solid ${pg===page?"#378ADD":"#d1d5db"}`, background:pg===page?"#378ADD":"#fff", color:pg===page?"#fff":"#374151", cursor:"pointer", fontSize:13, fontWeight:pg===page?600:400 }}>
//                   {pg}
//                 </button>
//               ))}
//               <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
//                 style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===totalPages?"not-allowed":"pointer", fontSize:13, color:page===totalPages?"#ccc":"#374151" }}>
//                 Next →
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Zone Manager Modal */}
//       {openModal && (
//         <ZoneRangeManager
//           modalLevel={openModal}
//           configs={allConfigs}
//           availableStates={states}
//           availableDistricts={districts}
//           availableTaluks={taluks}
//           allCommodities={allCommodities}
//           onSave={handleSaveConfigs}
//           onClose={() => setOpenModal(null)}
//         />
//       )}
//     </div>
//   );
// }









// //test
// "use client";
// import { useState, useEffect, useMemo, useCallback } from "react";
// // NOTE: Run `npm install react-simple-maps` in your project before using this file
// import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
// import { getAdminSessionAction } from "@/app/actions/auth-actions";

// // ─── GeoJSON URLs ─────────────────────────────────────────────────────────────
// const INDIA_STATES_GEO    = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";
// const INDIA_DISTRICTS_GEO = "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface AdminData {
//   taluka: string;
//   role: "admin" | "subadmin";
//   name?: string;
//   email?: string;
// }
// interface Posting {
//   id: string; farmerId: string; farmingType: string; seedType: string;
//   acres: number; production: number; zone: Zone;
//   taluk: string; district: string; state: string; village: string;
//   commodity: string; lat: number | null; lng: number | null; month: string;
// }
// interface ZoneRanges {
//   green:  { min: number; max: number; color: Zone };
//   yellow: { min: number; max: number; color: Zone };
//   red:    { min: number; max: number; color: Zone };
// }
// interface CommodityRange {
//   commodity: string;
//   ranges: ZoneRanges;
//   enabled: boolean;
// }
// interface ZoneConfig {
//   level: "state" | "district" | "taluk";
//   state: string;
//   district: string;
//   taluk: string;
//   commodityRanges: CommodityRange[];
// }
// interface LocationAgg { name: string; production: number; count: number; zone: Zone; }
// interface ChartEntry { type: string; production: number; }
// interface CommodityRow {
//   commodity: string; totalArea: number;
//   status: "Good/High" | "Moderate" | "Low/Poor";
//   monthlyTrend: Record<string, TrendValue>;
//   lastThreeMonthTrend: TrendValue;
// }
// type Zone        = "red" | "yellow" | "green";
// type FarmingType = "organic" | "regular" | "natural" | "hydroponic";
// type TrendValue  = "up" | "slightly_up" | "stable" | "down" | "sharp_decline";
// type TalukAgg    = LocationAgg;

// // ─── Constants ────────────────────────────────────────────────────────────────
// const DEFAULT_ZONE_RANGES: ZoneRanges = {
//   green:  { min: 1000, max: Infinity, color: "green"  },
//   yellow: { min: 500,  max: 999,      color: "yellow" },
//   red:    { min: 0,    max: 499,      color: "red"    },
// };
// const FACTORS: Record<FarmingType, number> = { organic: 1.2, regular: 1.0, natural: 0.9, hydroponic: 1.5 };
// const SURVEY_MONTHS = [
//   "Jun 2023","Jul 2023","Aug 2023","Sep 2023","Oct 2023","Nov 2023",
//   "Dec 2023","Jan 2024","Feb 2024","Mar 2024","Apr 2024","May 2024",
// ];

// // ─── FIX 1: Comprehensive state name map covering ALL Indian states ────────────
// // Maps any spelling/variant (lowercase) → exact GeoJSON NAME_1 value
// const STATE_NAME_MAP: Record<string, string> = {
//   // Karnataka
//   "karnataka":               "Karnataka",
//   // Andhra Pradesh / Telangana (GeoJSON may still show "Andhra Pradesh" for both)
//   "andhra pradesh":          "Andhra Pradesh",
//   "telangana":               "Andhra Pradesh",
//   // Tamil Nadu
//   "tamil nadu":              "Tamil Nadu",
//   "tamilnadu":               "Tamil Nadu",
//   // Kerala
//   "kerala":                  "Kerala",
//   // Maharashtra
//   "maharashtra":             "Maharashtra",
//   // Gujarat
//   "gujarat":                 "Gujarat",
//   // Rajasthan
//   "rajasthan":               "Rajasthan",
//   // Madhya Pradesh
//   "madhya pradesh":          "Madhya Pradesh",
//   "mp":                      "Madhya Pradesh",
//   // Uttar Pradesh
//   "uttar pradesh":           "Uttar Pradesh",
//   "up":                      "Uttar Pradesh",
//   // Bihar
//   "bihar":                   "Bihar",
//   // West Bengal
//   "west bengal":             "West Bengal",
//   "westbengal":              "West Bengal",
//   // Odisha — GeoJSON uses "Orissa"
//   "odisha":                  "Orissa",
//   "orissa":                  "Orissa",
//   // Chhattisgarh
//   "chhattisgarh":            "Chhattisgarh",
//   "chattisgarh":             "Chhattisgarh",
//   // Jharkhand
//   "jharkhand":               "Jharkhand",
//   // Assam
//   "assam":                   "Assam",
//   // Punjab
//   "punjab":                  "Punjab",
//   // Haryana
//   "haryana":                 "Haryana",
//   // Himachal Pradesh
//   "himachal pradesh":        "Himachal Pradesh",
//   "himachalpradesh":         "Himachal Pradesh",
//   "hp":                      "Himachal Pradesh",
//   // Uttarakhand — GeoJSON uses "Uttaranchal"
//   "uttarakhand":             "Uttaranchal",
//   "uttaranchal":             "Uttaranchal",
//   "uk":                      "Uttaranchal",
//   // Goa
//   "goa":                     "Goa",
//   // Delhi / NCT of Delhi
//   "delhi":                   "Delhi",
//   "nct of delhi":            "Delhi",
//   "nct delhi":               "Delhi",
//   // Sikkim
//   "sikkim":                  "Sikkim",
//   // Arunachal Pradesh
//   "arunachal pradesh":       "Arunachal Pradesh",
//   "arunachalpradesh":        "Arunachal Pradesh",
//   // Nagaland
//   "nagaland":                "Nagaland",
//   // Manipur
//   "manipur":                 "Manipur",
//   // Mizoram
//   "mizoram":                 "Mizoram",
//   // Tripura
//   "tripura":                 "Tripura",
//   // Meghalaya
//   "meghalaya":               "Meghalaya",
//   // Jammu & Kashmir
//   "jammu and kashmir":       "Jammu and Kashmir",
//   "jammu & kashmir":         "Jammu and Kashmir",
//   "j&k":                     "Jammu and Kashmir",
//   "jk":                      "Jammu and Kashmir",
//   // Ladakh (may not be in older GeoJSON — falls to trim)
//   "ladakh":                  "Ladakh",
//   // Andaman & Nicobar
//   "andaman and nicobar islands": "Andaman and Nicobar",
//   "andaman & nicobar":       "Andaman and Nicobar",
//   "andaman":                 "Andaman and Nicobar",
//   // Chandigarh
//   "chandigarh":              "Chandigarh",
//   // Dadra and Nagar Haveli
//   "dadra and nagar haveli":  "Dadra and Nagar Haveli",
//   "dadra & nagar haveli":    "Dadra and Nagar Haveli",
//   // Daman and Diu
//   "daman and diu":           "Daman and Diu",
//   "daman & diu":             "Daman and Diu",
//   // Lakshadweep
//   "lakshadweep":             "Lakshadweep",
//   // Puducherry / Pondicherry
//   "puducherry":              "Puducherry",
//   "pondicherry":             "Puducherry",
// };

// function normalizeStateName(name: string): string {
//   const key = name.toLowerCase().trim();
//   return STATE_NAME_MAP[key] ?? name.trim();
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function norm(s: string): string {
//   return (s ?? "").trim().toLowerCase();
// }
// function monthFromDate(dateStr: string): string {
//   if (!dateStr) return "";
//   try {
//     const d = new Date(dateStr);
//     if (isNaN(d.getTime())) return "";
//     return d.toLocaleString("en-US", { month: "short", year: "numeric" });
//   } catch { return ""; }
// }
// function getProduction(acres: number, farmingType: string): number {
//   return Math.round(acres * (FACTORS[farmingType as FarmingType] ?? 1.0));
// }
// function getZoneFromRanges(production: number, ranges: ZoneRanges, enabled: boolean): Zone {
//   if (!enabled) {
//     if (production >= DEFAULT_ZONE_RANGES.green.min)  return "green";
//     if (production >= DEFAULT_ZONE_RANGES.yellow.min) return "yellow";
//     return "red";
//   }
//   const { green, yellow, red } = ranges;
//   const greenMax  = (green.max  as unknown) === "__INF__" || green.max  === Infinity ? Infinity : green.max;
//   const yellowMax = (yellow.max as unknown) === "__INF__" || yellow.max === Infinity ? Infinity : yellow.max;
//   const redMax    = (red.max    as unknown) === "__INF__" || red.max    === Infinity ? Infinity : red.max;
//   if (production >= green.min  && (greenMax  === Infinity || production <= greenMax))  return "green";
//   if (production >= yellow.min && (yellowMax === Infinity || production <= yellowMax)) return "yellow";
//   if (production >= red.min    && (redMax    === Infinity || production <= redMax))    return "red";
//   if (production >= green.min)  return "green";
//   if (production >= yellow.min) return "yellow";
//   return "red";
// }
// function buildConfigKey(cfg: { level: string; state: string; district: string; taluk: string }): string {
//   return `${norm(cfg.level)}::${norm(cfg.state)}::${norm(cfg.district)}::${norm(cfg.taluk)}`;
// }
// function getZoneForPosting(
//   production: number, commodity: string, taluk: string,
//   district: string, state: string, configsMap: Record<string, ZoneConfig>
// ): Zone {
//   const talukKey = buildConfigKey({ level: "taluk",    state, district, taluk });
//   const distKey  = buildConfigKey({ level: "district", state, district, taluk: "" });
//   const stateKey = buildConfigKey({ level: "state",    state, district: "", taluk: "" });
//   for (const key of [talukKey, distKey, stateKey]) {
//     const cfg = configsMap[key];
//     if (cfg) {
//       const cr = cfg.commodityRanges.find(r => norm(r.commodity) === norm(commodity));
//       if (cr) return getZoneFromRanges(production, cr.ranges, cr.enabled);
//     }
//   }
//   return getZoneFromRanges(production, DEFAULT_ZONE_RANGES, true);
// }
// function zoneToStatus(zone: Zone): "Good/High" | "Moderate" | "Low/Poor" {
//   if (zone === "green")  return "Good/High";
//   if (zone === "yellow") return "Moderate";
//   return "Low/Poor";
// }
// function getCommodityIcon(commodity: string): string {
//   const n = commodity.toLowerCase().trim();
//   if (n.includes("paddy")||n.includes("rice")||n.includes("wheat"))        return "🌾";
//   if (n.includes("maize")||n.includes("corn"))                             return "🌽";
//   if (n.includes("sugarcane"))                                             return "🎋";
//   if (n.includes("cotton"))                                                return "🌸";
//   if (n.includes("groundnut")||n.includes("peanut"))                       return "🥜";
//   if (n.includes("sunflower"))                                             return "🌻";
//   if (n.includes("gram")||n.includes("dal")||n.includes("pulse")||n.includes("tur")) return "🫘";
//   if (n.includes("tomato"))                                                return "🍅";
//   if (n.includes("onion"))                                                 return "🧅";
//   if (n.includes("banana")||n.includes("plantain"))                        return "🍌";
//   if (n.includes("mango"))                                                 return "🥭";
//   if (n.includes("coconut"))                                               return "🥥";
//   if (n.includes("pepper")||n.includes("chilli"))                          return "🌶️";
//   if (n.includes("ragi")||n.includes("millet")||n.includes("jowar")||n.includes("bajra")) return "🌿";
//   if (n.includes("heirloom"))                                              return "🌾";
//   if (n.includes("hybrid"))                                                return "🌱";
//   if (n.includes("naati"))                                                 return "🌿";
//   if (n.includes("gmo"))                                                   return "🧬";
//   return "🌱";
// }
// function deriveTrend(vals: number[]): TrendValue {
//   if (vals.length < 2) return "stable";
//   const recent = vals.slice(-3);
//   const older  = vals.slice(0, Math.max(1, vals.length - 3));
//   const ra = recent.reduce((a,b)=>a+b,0) / recent.length;
//   const oa = older.reduce((a,b)=>a+b,0)  / older.length;
//   if (oa === 0) return "stable";
//   const pct = ((ra - oa) / oa) * 100;
//   if (pct > 10)  return "up";
//   if (pct > 3)   return "slightly_up";
//   if (pct < -15) return "sharp_decline";
//   if (pct < -3)  return "down";
//   return "stable";
// }

// // ─── FIX 2: Fuzzy name matcher for aggMap lookups ─────────────────────────────
// // Tries exact norm match first, then partial containment match
// function lookupAggMap<T>(
//   aggMap: Record<string, T>,
//   rawGeoName: string
// ): T | undefined {
//   const key = norm(rawGeoName);
//   // 1. exact match
//   if (aggMap[key] !== undefined) return aggMap[key];
//   // 2. partial: geo name contains DB name or vice versa
//   for (const [k, v] of Object.entries(aggMap)) {
//     if (key.includes(k) || k.includes(key)) return v;
//   }
//   return undefined;
// }

// // ─── FIX 3: State filter matcher — robust fuzzy match ─────────────────────────
// // Used inside Geographies filter to match GeoJSON NAME_1 against our selected state
// function stateMatches(geoStateName: string, filterStateName: string): boolean {
//   if (!filterStateName) return false;
//   const gn = norm(geoStateName);
//   const fn = norm(filterStateName);
//   if (gn === fn) return true;
//   // normalize both sides through the map
//   const normalizedGeo    = norm(normalizeStateName(geoStateName));
//   const normalizedFilter = norm(normalizeStateName(filterStateName));
//   if (normalizedGeo === normalizedFilter) return true;
//   // partial containment fallback
//   if (gn.includes(fn) || fn.includes(gn)) return true;
//   if (normalizedGeo.includes(normalizedFilter) || normalizedFilter.includes(normalizedGeo)) return true;
//   return false;
// }

// // ─── Color Maps ───────────────────────────────────────────────────────────────
// const ZONE_COLORS:  Record<Zone,string> = { green:"#1D9E75", yellow:"#EF9F27", red:"#E24B4A" };
// const ZONE_BG:      Record<Zone,string> = { green:"#EAF3DE", yellow:"#FAEEDA", red:"#FCEBEB" };
// const ZONE_TEXT:    Record<Zone,string> = { green:"#27500A", yellow:"#633806", red:"#791F1F" };
// const ZONE_BORDER:  Record<Zone,string> = { green:"#C0DD97", yellow:"#FAC775", red:"#F09595" };
// const ZONE_LABEL:   Record<Zone,string> = { green:"Good / High", yellow:"Moderate", red:"Low / Poor" };
// const STATUS_COLORS = {
//   "Good/High": { bg:"#EAF3DE", text:"#27500A", border:"#C0DD97", dot:"#1D9E75" },
//   "Moderate":  { bg:"#FFF7ED", text:"#92400e", border:"#FDE68A", dot:"#F59E0B" },
//   "Low/Poor":  { bg:"#FCEBEB", text:"#791F1F", border:"#F09595", dot:"#E24B4A" },
// };
// const TYPE_COLORS: Record<string,string> = {
//   organic:"#378ADD", regular:"#1D9E75", natural:"#7F77DD", hydroponic:"#D85A30"
// };
// function getDynamicTypeColor(type: string, index: number): string {
//   if (TYPE_COLORS[type.toLowerCase()]) return TYPE_COLORS[type.toLowerCase()];
//   const p = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#6B8E23","#CD853F"];
//   return p[index % p.length];
// }
// function getCommodityColor(commodity: string): string {
//   const colors = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#F4C542","#6B8E23"];
//   let hash = 0;
//   for (let i = 0; i < commodity.length; i++) { hash = ((hash<<5)-hash) + commodity.charCodeAt(i); hash|=0; }
//   return colors[Math.abs(hash) % colors.length];
// }

// // ─── Shared UI ────────────────────────────────────────────────────────────────
// function TrendCell({ trend, color }: { trend: TrendValue; color: string }) {
//   const map: Record<TrendValue,string> = { up:"↗", slightly_up:"↗", stable:"→", down:"↓", sharp_decline:"↘" };
//   return (
//     <span style={{ fontSize:16, color, fontWeight:700, display:"inline-block", textAlign:"center", width:"100%" }}>
//       {map[trend] ?? map.stable}
//     </span>
//   );
// }
// function Sparkline({ values, color }: { values: number[]; color: string }) {
//   if (values.length < 2) return null;
//   const max = Math.max(...values, 1);
//   const min = Math.min(...values);
//   const range = max - min || 1;
//   const W = 60, H = 20;
//   const pts = values.map((v,i) => `${(i/(values.length-1))*W},${H-((v-min)/range)*H}`).join(" ");
//   return (
//     <svg width={W} height={H} style={{ display:"block", margin:"0 auto" }}>
//       <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
//     </svg>
//   );
// }
// function ZoneBadge({ zone }: { zone: Zone }) {
//   return (
//     <span style={{ background:ZONE_BG[zone], color:ZONE_TEXT[zone], borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600, border:`1px solid ${ZONE_COLORS[zone]}33`, display:"inline-block", whiteSpace:"nowrap" }}>
//       {ZONE_LABEL[zone]}
//     </span>
//   );
// }
// function StatCard({ label, value, accent }: { label:string; value:string|number; accent:string }) {
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"1rem 1.25rem", display:"flex", flexDirection:"column", gap:4, borderLeft:`3px solid ${accent}` }}>
//       <span style={{ fontSize:12, color:"#888", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</span>
//       <span style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.02em" }}>{value}</span>
//     </div>
//   );
// }
// function BarChart({ data }: { data: ChartEntry[] }) {
//   if (!data.length) return null;
//   const max = Math.max(...data.map(d=>d.production));
//   return (
//     <div style={{ padding:"1rem 0" }}>
//       {data.map((d,i) => (
//         <div key={d.type} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
//           <span style={{ width:100, fontSize:13, color:"#555", textAlign:"right", fontWeight:500, textTransform:"capitalize" }}>{d.type}</span>
//           <div style={{ flex:1, background:"#f3f4f6", borderRadius:6, overflow:"hidden", height:26 }}>
//             <div style={{ width:`${(d.production/max)*100}%`, background:getDynamicTypeColor(d.type,i), height:"100%", borderRadius:6, display:"flex", alignItems:"center", paddingLeft:8 }}>
//               <span style={{ fontSize:11, color:"#fff", fontWeight:600 }}>{d.production.toLocaleString()}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Zone Range Fields ────────────────────────────────────────────────────────
// function ZoneRangeFields({
//   enabled, setEnabled,
//   greenMin, setGreenMin, greenMax, setGreenMax,
//   yellowMin, setYellowMin, yellowMax, setYellowMax,
//   redMin, setRedMin, redMax, setRedMax,
// }: {
//   enabled:boolean; setEnabled:(v:boolean)=>void;
//   greenMin:number; setGreenMin:(v:number)=>void; greenMax:number; setGreenMax:(v:number)=>void;
//   yellowMin:number; setYellowMin:(v:number)=>void; yellowMax:number; setYellowMax:(v:number)=>void;
//   redMin:number; setRedMin:(v:number)=>void; redMax:number; setRedMax:(v:number)=>void;
// }) {
//   return (
//     <>
//       <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
//         <label style={{ fontSize:12, fontWeight:600, color:"#333" }}>Custom ranges:</label>
//         <button onClick={()=>setEnabled(!enabled)} style={{ padding:"4px 14px", borderRadius:20, border:"none", background:enabled?"#1D9E75":"#94a3b8", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>
//           {enabled ? "ON" : "OFF"}
//         </button>
//       </div>
//       {[
//         { label:"🟢 Green Zone — Good / High Production", bg:ZONE_BG.green,   border:ZONE_BORDER.green,   tc:ZONE_TEXT.green,   min:greenMin,  max:greenMax,  setMin:setGreenMin,  setMax:setGreenMax,  note:"High production = Good performance"  },
//         { label:"🟡 Yellow Zone — Moderate Production",   bg:ZONE_BG.yellow,  border:ZONE_BORDER.yellow,  tc:ZONE_TEXT.yellow,  min:yellowMin, max:yellowMax, setMin:setYellowMin, setMax:setYellowMax, note:"Mid-range = Moderate performance"    },
//         { label:"🔴 Red Zone — Low / Poor Production",    bg:ZONE_BG.red,     border:ZONE_BORDER.red,     tc:ZONE_TEXT.red,     min:redMin,    max:redMax,    setMin:setRedMin,    setMax:setRedMax,    note:"Low production = Poor performance"   },
//       ].map(z => (
//         <div key={z.label} style={{ background:z.bg, borderRadius:12, padding:16, marginBottom:12, border:`1px solid ${z.border}` }}>
//           <div style={{ fontWeight:700, color:z.tc, marginBottom:4 }}>{z.label}</div>
//           <div style={{ fontSize:11, color:z.tc, marginBottom:10, opacity:0.8 }}>{z.note}</div>
//           <div style={{ display:"flex", gap:12 }}>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Min Production Units</label>
//               <input type="number" value={z.min ?? ""} onChange={e=>z.setMin(Number(e.target.value))} disabled={!enabled}
//                 style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
//             </div>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Max Production Units</label>
//               <input type="number" value={z.max ?? ""} onChange={e=>z.setMax(Number(e.target.value))} disabled={!enabled}
//                 style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }

// // ─── Universal Zone Range Manager ─────────────────────────────────────────────
// // ─── Universal Zone Range Manager ─────────────────────────────────────────────
// function ZoneRangeManager({
//   modalLevel, configs, availableStates, allPostings,
//   allCommodities, onSave, onClose,
// }: {
//   modalLevel: "state" | "district" | "taluk";
//   configs: ZoneConfig[];
//   availableStates: string[];
//   allPostings: Posting[];
//   allCommodities: string[];
//   onSave: (configs: ZoneConfig[]) => void;
//   onClose: () => void;
// }) {
//   const [localConfigs, setLocalConfigs] = useState<ZoneConfig[]>(() =>
//     JSON.parse(JSON.stringify(configs, (_, v) => v === Infinity ? "__INF__" : v))
//       .map((c: ZoneConfig) => ({
//         ...c,
//         commodityRanges: (c.commodityRanges ?? []).map((cr: CommodityRange) => ({
//           ...cr,
//           ranges: {
//             green:  { ...cr.ranges.green,  max: (cr.ranges.green.max  as unknown) === "__INF__" ? Infinity : cr.ranges.green.max  },
//             yellow: { ...cr.ranges.yellow, max: (cr.ranges.yellow.max as unknown) === "__INF__" ? Infinity : cr.ranges.yellow.max },
//             red:    { ...cr.ranges.red,    max: (cr.ranges.red.max    as unknown) === "__INF__" ? Infinity : cr.ranges.red.max    },
//           },
//         })),
//       }))
//   );

//   const [selParentState,    setSelParentState]    = useState(availableStates[0] ?? "");
//   const [selParentDistrict, setSelParentDistrict] = useState("");
//   const [selLocation,       setSelLocation]       = useState("");
//   const [customInput,       setCustomInput]       = useState("");
//   const [useCustom,         setUseCustom]         = useState(false);
//   const [selCommodity,      setSelCommodity]      = useState(allCommodities[0]     ?? "");
//   const [greenMin,  setGreenMin]  = useState(DEFAULT_ZONE_RANGES.green.min);
//   const [greenMax,  setGreenMax]  = useState(999999);
//   const [yellowMin, setYellowMin] = useState(DEFAULT_ZONE_RANGES.yellow.min);
//   const [yellowMax, setYellowMax] = useState(DEFAULT_ZONE_RANGES.yellow.max);
//   const [redMin,    setRedMin]    = useState(DEFAULT_ZONE_RANGES.red.min);
//   const [redMax,    setRedMax]    = useState(DEFAULT_ZONE_RANGES.red.max);
//   const [enabled,   setEnabled]   = useState(true);
//   const [savedMsg,  setSavedMsg]  = useState("");

//   // ── Districts/Taluks scoped STRICTLY to the state/district picked in this modal.
//   // Computed live from real postings data — never from stale/unfiltered props,
//   // so a district from another state can never leak into the list.
//   const districtsInState = useMemo(() => {
//     if (!selParentState) return [];
//     const s = new Set(
//       allPostings
//         .filter(p => norm(p.state) === norm(selParentState))
//         .map(p => p.district)
//         .filter(v => v && v !== "—")
//     );
//     return Array.from(s).sort();
//   }, [allPostings, selParentState]);

//   const taluksInDistrict = useMemo(() => {
//     if (!selParentState || !selParentDistrict) return [];
//     const s = new Set(
//       allPostings
//         .filter(p => norm(p.state) === norm(selParentState) && norm(p.district) === norm(selParentDistrict))
//         .map(p => p.taluk)
//         .filter(v => v && v !== "Unknown")
//     );
//     return Array.from(s).sort();
//   }, [allPostings, selParentState, selParentDistrict]);

//   const activeLocation = useCustom ? customInput.trim() : selLocation;

//   const activeKey = useMemo(() => {
//     if (!activeLocation) return "";
//     if (modalLevel === "state") {
//       return buildConfigKey({ level: "state", state: activeLocation, district: "", taluk: "" });
//     }
//     if (modalLevel === "district") {
//       return buildConfigKey({ level: "district", state: selParentState, district: activeLocation, taluk: "" });
//     }
//     return buildConfigKey({ level: "taluk", state: selParentState, district: selParentDistrict, taluk: activeLocation });
//   }, [modalLevel, activeLocation, selParentState, selParentDistrict]);

//   const currentCfg = useMemo(() =>
//     activeKey ? localConfigs.find(c => buildConfigKey(c) === activeKey) ?? null : null,
//     [localConfigs, activeKey]
//   );

//   useEffect(() => {
//     if (!activeLocation || !selCommodity) return;
//     const cr = currentCfg?.commodityRanges.find(r => norm(r.commodity) === norm(selCommodity));
//     if (cr) {
//       setGreenMin(cr.ranges.green.min);
//       setGreenMax(cr.ranges.green.max === Infinity ? 999999 : cr.ranges.green.max);
//       setYellowMin(cr.ranges.yellow.min);
//       setYellowMax(cr.ranges.yellow.max === Infinity ? 999999 : cr.ranges.yellow.max);
//       setRedMin(cr.ranges.red.min);
//       setRedMax(cr.ranges.red.max === Infinity ? 999999 : cr.ranges.red.max);
//       setEnabled(cr.enabled);
//     } else {
//       setGreenMin(DEFAULT_ZONE_RANGES.green.min); setGreenMax(999999);
//       setYellowMin(DEFAULT_ZONE_RANGES.yellow.min); setYellowMax(DEFAULT_ZONE_RANGES.yellow.max);
//       setRedMin(DEFAULT_ZONE_RANGES.red.min); setRedMax(DEFAULT_ZONE_RANGES.red.max);
//       setEnabled(true);
//     }
//   }, [activeLocation, selCommodity, activeKey, currentCfg]);

//   // Reset stale child selections whenever the parent context changes.
//   useEffect(() => { setSelParentDistrict(""); }, [selParentState]);
//   useEffect(() => { setSelLocation(""); }, [selParentState, selParentDistrict]);

//   const saveCombination = (currentList: ZoneConfig[]): ZoneConfig[] => {
//     if (!activeLocation) { alert("Please select or enter a location."); return currentList; }
//     if (!selCommodity)   { alert("Please select a commodity."); return currentList; }
//     const st = modalLevel === "state"    ? activeLocation : selParentState;
//     const di = modalLevel === "district" ? activeLocation : modalLevel === "taluk" ? selParentDistrict : "";
//     const tk = modalLevel === "taluk"    ? activeLocation : "";
//     const newCR: CommodityRange = {
//       commodity: selCommodity,
//       ranges: {
//         green:  { min: greenMin,  max: greenMax  === 999999 ? Infinity : greenMax,  color: "green"  },
//         yellow: { min: yellowMin, max: yellowMax === 999999 ? Infinity : yellowMax, color: "yellow" },
//         red:    { min: redMin,    max: redMax    === 999999 ? Infinity : redMax,    color: "red"    },
//       },
//       enabled,
//     };
//     const key      = buildConfigKey({ level: modalLevel, state: st, district: di, taluk: tk });
//     const existing = currentList.find(c => buildConfigKey(c) === key);
//     let next: ZoneConfig[];
//     if (existing) {
//       next = currentList.map(c => {
//         if (buildConfigKey(c) !== key) return c;
//         const filtered = c.commodityRanges.filter(r => norm(r.commodity) !== norm(selCommodity));
//         return { ...c, commodityRanges: [...filtered, newCR] };
//       });
//     } else {
//       next = [...currentList, { level: modalLevel, state: st, district: di, taluk: tk, commodityRanges: [newCR] }];
//     }
//     return next;
//   };

//   const handleSaveAndStay = () => {
//     const next = saveCombination(localConfigs);
//     setLocalConfigs(next);
//     setSavedMsg(`✓ Saved "${activeLocation}" × "${selCommodity}"`);
//     setTimeout(() => setSavedMsg(""), 2500);
//   };

//   const handleRemove = () => {
//     if (!activeLocation || !selCommodity || !activeKey) return;
//     const next = localConfigs
//       .map(c => {
//         if (buildConfigKey(c) !== activeKey) return c;
//         return { ...c, commodityRanges: c.commodityRanges.filter(r => norm(r.commodity) !== norm(selCommodity)) };
//       })
//       .filter(c => c.commodityRanges.length > 0); // drop the parent record once it has 0 ranges left
//     setLocalConfigs(next);
//   };

//   const currentCombinationSaved = !!currentCfg?.commodityRanges.find(
//     r => norm(r.commodity) === norm(selCommodity)
//   );

//   const savedRows = useMemo(() => {
//     const rows: { cfg: ZoneConfig; cr: CommodityRange }[] = [];
//     localConfigs.filter(c => c.level === modalLevel).forEach(c => {
//       (c.commodityRanges ?? []).forEach(cr => rows.push({ cfg: c, cr }));
//     });
//     return rows.sort((a, b) => {
//       const la = (a.cfg.state + a.cfg.district + a.cfg.taluk).toLowerCase();
//       const lb = (b.cfg.state + b.cfg.district + b.cfg.taluk).toLowerCase();
//       return la.localeCompare(lb) || a.cr.commodity.localeCompare(b.cr.commodity);
//     });
//   }, [localConfigs, modalLevel]);

//   // Options shown in the picker — strictly real data for the selected state/district.
//   // No union with "saved" locations, so a ghost/empty/mismatched record left over
//   // from old data can never appear here.
//   const locationOptions = useMemo(() => {
//     if (modalLevel === "state") return availableStates;
//     if (modalLevel === "district") return districtsInState;
//     return taluksInDistrict;
//   }, [modalLevel, availableStates, districtsInState, taluksInDistrict]);

//   const allLocations = locationOptions;

//   const levelLabel = modalLevel === "state" ? "State" : modalLevel === "district" ? "District" : "Taluk";
//   const levelIcon  = modalLevel === "state" ? "🗺"   : modalLevel === "district" ? "🏙"       : "🏛";
//   const levelColor = modalLevel === "state" ? "#D85A30" : modalLevel === "district" ? "#378ADD" : "#7F77DD";
//   const levelBg    = modalLevel === "state" ? "#FFF3EE" : modalLevel === "district" ? "#EFF6FF" : "#F5F3FF";
//   const levelBd    = modalLevel === "state" ? "#FDBA74" : modalLevel === "district" ? "#BFDBFE" : "#DDD6FE";

//   return (
//     <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
//       <div style={{ background:"#fff", borderRadius:16, padding:24, width:720, maxWidth:"95vw", maxHeight:"94vh", overflowY:"auto", boxShadow:"0 20px 40px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
//         <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
//           <h3 style={{ margin:0, fontSize:18, fontWeight:700 }}>{levelIcon} {levelLabel}-Level Zone Range Manager</h3>
//           <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#64748b", lineHeight:1 }}>×</button>
//         </div>
//         <p style={{ fontSize:13, color:"#64748b", marginBottom:8 }}>
//           Set production zone thresholds per <strong>{levelLabel} × Commodity</strong> combination.
//         </p>
//         <div style={{ background:levelBg, border:`1px solid ${levelBd}`, borderRadius:10, padding:"10px 14px", marginBottom:18, fontSize:12, color:levelColor }}>
//           <strong>Priority order:</strong> Taluk+Commodity &gt; District+Commodity &gt; State+Commodity &gt; Default
//         </div>
//         <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
//           {(["green","yellow","red"] as Zone[]).map(z => (
//             <span key={z} style={{ background:ZONE_BG[z], color:ZONE_TEXT[z], border:`1px solid ${ZONE_BORDER[z]}`, borderRadius:20, padding:"3px 14px", fontSize:12, fontWeight:600 }}>
//               {z==="green" ? "🟢 Good / High" : z==="yellow" ? "🟡 Moderate" : "🔴 Low / Poor"}
//             </span>
//           ))}
//         </div>

//         {(modalLevel === "district" || modalLevel === "taluk") && (
//           <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>Step 1 — Select Parent Context</div>
//             <div style={{ marginBottom: modalLevel === "taluk" ? 10 : 0 }}>
//               <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>State (context)</label>
//               <select value={selParentState} onChange={e => setSelParentState(e.target.value)}
//                 style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                 <option value="">-- Select state --</option>
//                 {availableStates.map(s => <option key={s}>{s}</option>)}
//               </select>
//             </div>
//             {modalLevel === "taluk" && (
//               <div style={{ marginTop:10 }}>
//                 <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>District (context)</label>
//                 <select value={selParentDistrict} onChange={e => setSelParentDistrict(e.target.value)}
//                   style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                   <option value="">-- Select district --</option>
//                   {districtsInState.map(d => <option key={d}>{d}</option>)}
//                 </select>
//               </div>
//             )}
//           </div>
//         )}

//         <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//           <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
//             {modalLevel === "state" ? "Step 1" : "Step 2"} — Select {levelLabel} to Configure
//           </div>
//           <div style={{ display:"flex", gap:8, marginBottom:10 }}>
//             {(["existing","custom"] as const).map(opt => (
//               <button key={opt} onClick={() => setUseCustom(opt === "custom")}
//                 style={{ padding:"5px 14px", borderRadius:20, border:`1.5px solid ${useCustom===(opt==="custom")?levelColor:"#d1d5db"}`, background:useCustom===(opt==="custom")?levelBg:"#fff", color:useCustom===(opt==="custom")?levelColor:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer" }}>
//                 {opt === "existing" ? "Select existing" : "Enter name"}
//               </button>
//             ))}
//           </div>
//           {!useCustom ? (
//             <select value={selLocation} onChange={e => setSelLocation(e.target.value)}
//               style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//               <option value="">-- Select {levelLabel.toLowerCase()} --</option>
//               {allLocations.map(l => {
//                 const lKey = modalLevel === "state"
//                   ? buildConfigKey({ level: "state",    state: l,            district: "",              taluk: "" })
//                   : modalLevel === "district"
//                   ? buildConfigKey({ level: "district", state: selParentState, district: l,             taluk: "" })
//                   : buildConfigKey({ level: "taluk",    state: selParentState, district: selParentDistrict, taluk: l });
//                 const hasCfg = localConfigs.some(c => buildConfigKey(c) === lKey && c.commodityRanges.length > 0);
//                 return <option key={l} value={l}>{l}{hasCfg ? " ✓" : ""}</option>;
//               })}
//             </select>
//           ) : (
//             <input type="text" value={customInput} onChange={e => setCustomInput(e.target.value)}
//               placeholder={`e.g. ${modalLevel==="state"?"Karnataka":"Mandya"}…`}
//               style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, boxSizing:"border-box" }}/>
//           )}
//           {activeLocation && (
//             <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCfg?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCfg?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCfg?ZONE_TEXT.green:"#64748b" }}>
//               {currentCfg
//                 ? `✓ "${activeLocation}" has ${currentCfg.commodityRanges.length} commodity config(s) saved`
//                 : `No configs saved for "${activeLocation}" yet`}
//             </div>
//           )}
//         </div>

//         <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//           <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
//             {modalLevel === "state" ? "Step 2" : "Step 3"} — Select Commodity
//           </div>
//           {allCommodities.length === 0 ? (
//             <div style={{ color:"#94a3b8", fontSize:13 }}>No commodities found in data.</div>
//           ) : (
//             <>
//               <select value={selCommodity} onChange={e => setSelCommodity(e.target.value)}
//                 style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
//                 <option value="">-- Select commodity --</option>
//                 {allCommodities.map(c => (
//                   <option key={c} value={c}>
//                     {getCommodityIcon(c)} {c}
//                     {currentCfg?.commodityRanges.find(r => norm(r.commodity) === norm(c)) ? " ✓" : ""}
//                   </option>
//                 ))}
//               </select>
//               {selCommodity && activeLocation && (
//                 <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCombinationSaved?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCombinationSaved?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCombinationSaved?ZONE_TEXT.green:"#64748b" }}>
//                   {currentCombinationSaved
//                     ? `✓ Config exists for "${activeLocation}" + "${selCommodity}" — editing below`
//                     : `No config for "${activeLocation}" + "${selCommodity}" — set ranges below`}
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {activeLocation && selCommodity && (
//           <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:14 }}>
//               {modalLevel === "state" ? "Step 3" : "Step 4"} — Zone Ranges for{" "}
//               <span style={{ color:levelColor }}>{activeLocation}</span> ×{" "}
//               <span style={{ color:"#378ADD" }}>{getCommodityIcon(selCommodity)} {selCommodity}</span>
//             </div>
//             <ZoneRangeFields
//               enabled={enabled} setEnabled={setEnabled}
//               greenMin={greenMin} setGreenMin={setGreenMin} greenMax={greenMax} setGreenMax={setGreenMax}
//               yellowMin={yellowMin} setYellowMin={setYellowMin} yellowMax={yellowMax} setYellowMax={setYellowMax}
//               redMin={redMin} setRedMin={setRedMin} redMax={redMax} setRedMax={setRedMax}
//             />
//             {savedMsg && (
//               <div style={{ marginBottom:12, padding:"8px 14px", background:ZONE_BG.green, border:`1px solid ${ZONE_BORDER.green}`, borderRadius:8, color:ZONE_TEXT.green, fontSize:13, fontWeight:600 }}>
//                 {savedMsg}
//               </div>
//             )}
//             <div style={{ display:"flex", gap:12 }}>
//               <button onClick={handleSaveAndStay}
//                 style={{ flex:1, padding:"10px 16px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
//                 Save "{activeLocation}" × "{selCommodity}"
//               </button>
//               <button onClick={handleRemove} disabled={!currentCombinationSaved}
//                 style={{ padding:"10px 16px", borderRadius:8, border:"1px solid #E24B4A", background:"#fff", color:currentCombinationSaved?"#E24B4A":"#ccc", cursor:currentCombinationSaved?"pointer":"not-allowed", fontWeight:600 }}>
//                 Remove
//               </button>
//             </div>
//           </div>
//         )}

//         {savedRows.length > 0 && (
//           <div style={{ marginBottom:16 }}>
//             <div style={{ fontSize:13, fontWeight:600, marginBottom:8, color:"#333" }}>Saved Configurations ({savedRows.length})</div>
//             <div style={{ overflowX:"auto" }}>
//               <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
//                 <thead>
//                   <tr style={{ background:"#f1f5f9" }}>
//                     <th style={{ padding:8, textAlign:"left" }}>{levelLabel}</th>
//                     {modalLevel !== "state"    && <th style={{ padding:8, textAlign:"left" }}>State</th>}
//                     {modalLevel === "taluk"    && <th style={{ padding:8, textAlign:"left" }}>District</th>}
//                     <th style={{ padding:8, textAlign:"left" }}>Commodity</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.green }}>Green</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.yellow }}>Yellow</th>
//                     <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.red }}>Red</th>
//                     <th style={{ padding:8, textAlign:"center" }}>Status</th>
//                     <th style={{ padding:8, textAlign:"center" }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {savedRows.map(({ cfg, cr }) => {
//                     const locName = modalLevel==="state" ? cfg.state : modalLevel==="district" ? cfg.district : cfg.taluk;
//                     const isActive = buildConfigKey(cfg) === activeKey && norm(cr.commodity) === norm(selCommodity);
//                     return (
//                       <tr key={`${buildConfigKey(cfg)}-${cr.commodity}`} style={{ borderBottom:"1px solid #e5e7eb", background:isActive?"#F0FDF4":"#fff" }}>
//                         <td style={{ padding:8, fontWeight:600 }}>{levelIcon} {locName}</td>
//                         {modalLevel !== "state"   && <td style={{ padding:8, color:"#64748b" }}>{cfg.state}</td>}
//                         {modalLevel === "taluk"   && <td style={{ padding:8, color:"#64748b" }}>{cfg.district}</td>}
//                         <td style={{ padding:8 }}>{getCommodityIcon(cr.commodity)} {cr.commodity}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.green }}>{cr.ranges.green.min}–{cr.ranges.green.max===Infinity?"∞":cr.ranges.green.max}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.yellow }}>{cr.ranges.yellow.min}–{cr.ranges.yellow.max===Infinity?"∞":cr.ranges.yellow.max}</td>
//                         <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.red }}>{cr.ranges.red.min}–{cr.ranges.red.max===Infinity?"∞":cr.ranges.red.max}</td>
//                         <td style={{ padding:8, textAlign:"center" }}>
//                           <span style={{ background:cr.enabled?"#EAF3DE":"#f1f5f9", color:cr.enabled?"#27500A":"#64748b", padding:"2px 8px", borderRadius:12, fontSize:10 }}>
//                             {cr.enabled ? "Active" : "Off"}
//                           </span>
//                         </td>
//                         <td style={{ padding:8, textAlign:"center" }}>
//                           <button
//                             onClick={() => {
//                               setSelCommodity(cr.commodity);
//                               if (!useCustom) {
//                                 if (modalLevel === "state")    setSelLocation(cfg.state);
//                                 if (modalLevel === "district") { setSelParentState(cfg.state); setSelLocation(cfg.district); }
//                                 if (modalLevel === "taluk")    { setSelParentState(cfg.state); setSelParentDistrict(cfg.district); setSelLocation(cfg.taluk); }
//                               }
//                             }}
//                             style={{ fontSize:11, padding:"2px 8px", borderRadius:6, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer", color:levelColor }}>
//                             Edit
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//         {savedRows.length === 0 && (
//           <div style={{ padding:"16px", textAlign:"center", color:"#94a3b8", fontSize:13, background:"#f8f9fb", borderRadius:10, marginBottom:16 }}>
//             No configurations saved yet. Select a {levelLabel.toLowerCase()} and commodity above to get started.
//           </div>
//         )}

//         <div style={{ display:"flex", gap:12, justifyContent:"flex-end", borderTop:"1px solid #e5e7eb", paddingTop:16 }}>
//           <button onClick={onClose} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer" }}>Cancel</button>
//           <button
//             onClick={() => {
//               const latest = (activeLocation && selCommodity) ? saveCombination(localConfigs) : localConfigs;
//               onSave(latest);
//             }}
//             style={{ padding:"8px 20px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
//             Save All & Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Other sub-components ─────────────────────────────────────────────────────
// function RoleBadge({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;
//   const isAdmin = adminData.role === "admin";
//   return (
//     <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:isAdmin?"rgba(55,138,221,0.15)":"rgba(127,119,221,0.15)", border:`1px solid ${isAdmin?"#378ADD55":"#7F77DD55"}`, borderRadius:20, padding:"5px 14px 5px 10px", fontSize:12, fontWeight:600, color:isAdmin?"#378ADD":"#7F77DD" }}>
//       <span style={{ width:7, height:7, borderRadius:"50%", background:isAdmin?"#378ADD":"#7F77DD", display:"inline-block" }}/>
//       {isAdmin ? "Administrator · All Locations" : `Subadmin · ${adminData.taluka || "Unknown"}`}
//     </div>
//   );
// }
// function RoleInfoBanner({ adminData }: { adminData: AdminData | null }) {
//   if (!adminData) return null;
//   const isAdmin = adminData.role === "admin";
//   return (
//     <div style={{ background:isAdmin?"#EFF6FF":"#F5F3FF", border:`1px solid ${isAdmin?"#BFDBFE":"#DDD6FE"}`, borderRadius:10, padding:"10px 16px", marginBottom:24, display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:isAdmin?"#1e40af":"#5b21b6" }}>
//       <span style={{ width:18, height:18, borderRadius:"50%", background:isAdmin?"#BFDBFE":"#DDD6FE", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, marginTop:1, color:isAdmin?"#1d4ed8":"#6d28d9" }}>i</span>
//       <div><strong>{isAdmin?"Administrator View":"Subadmin View"}:</strong>{" "}
//         {isAdmin ? "You can manage zone ranges across all locations and view all postings." : <>You can only view postings from <strong style={{ color:"#6d28d9" }}>{adminData.taluka}</strong> taluka.</>}
//       </div>
//     </div>
//   );
// }

// type ZoneFilter = Zone | "all";

// // ─────────────────────────────────────────────────────────────────────────────
// // TOOLTIP COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// interface MapTooltip {
//   name: string;
//   count: number;
//   production: number;
//   zone: Zone;
//   x: number;
//   y: number;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // FIX 4: TALUK TILE PANEL — shown instead of map when a district is selected
// // since no taluk-level GeoJSON is available
// // ─────────────────────────────────────────────────────────────────────────────
// function TalukTilePanel({
//   title,
//   subtitle,
//   icon,
//   accentColor,
//   aggMap,
//   level,
//   activeZone,
//   onZoneFilterChange,
//   totalPostings,
//   highlightName,
// }: {
//   title: string;
//   subtitle: string;
//   icon: string;
//   accentColor: string;
//   aggMap: Record<string, { count: number; production: number; zone: Zone }>;
//   activeZone: ZoneFilter;
//   onZoneFilterChange: (z: ZoneFilter) => void;
//   totalPostings: number;
//   highlightName?: string;
//   levelLabel?: string;
// }) {
//   const zoneCounts = useMemo(() => {
//     const c = { green: 0, yellow: 0, red: 0 };
//     Object.values(aggMap).forEach(v => { c[v.zone]++; });
//     return c;
//   }, [aggMap]);

//   const entries = useMemo(() => {
//     return Object.entries(aggMap)
//       .filter(([, v]) => activeZone === "all" || v.zone === activeZone)
//       .sort((a, b) => b[1].production - a[1].production);
//   }, [aggMap, activeZone]);

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//       {/* Panel Header */}
//       <div className="px-4 pt-4 pb-2 border-b border-slate-100">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-lg">{icon}</span>
//           <span className="font-bold text-slate-800 text-sm">{title}</span>
//           {highlightName && (
//             <span
//               className="text-xs font-semibold px-2 py-0.5 rounded-full"
//               style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }}
//             >
//               {highlightName}
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-slate-400">{subtitle}</p>
//         {/* Zone filter pills */}
//         <div className="flex gap-1.5 mt-2 flex-wrap">
//           {([
//             { key: "all" as ZoneFilter,    label: "All",           bg: "#f1f5f9", color: "#475569" },
//             { key: "green" as ZoneFilter,  label: `✓ ${zoneCounts.green}`,  bg: ZONE_BG.green,  color: ZONE_TEXT.green  },
//             { key: "yellow" as ZoneFilter, label: `⚠ ${zoneCounts.yellow}`, bg: ZONE_BG.yellow, color: ZONE_TEXT.yellow },
//             { key: "red" as ZoneFilter,    label: `✗ ${zoneCounts.red}`,    bg: ZONE_BG.red,    color: ZONE_TEXT.red    },
//           ]).map(z => (
//             <button
//               key={z.key}
//               onClick={() => onZoneFilterChange(z.key)}
//               style={{
//                 background: activeZone === z.key ? z.bg : "#fff",
//                 color: activeZone === z.key ? z.color : "#94a3b8",
//                 border: `1.5px solid ${activeZone === z.key ? z.color : "#e2e8f0"}`,
//                 fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
//                 cursor: "pointer", transition: "all 0.15s",
//               }}
//             >
//               {z.label}
//             </button>
//           ))}
//           <span className="ml-auto text-xs text-slate-400 self-center">
//             {totalPostings} farmer{totalPostings !== 1 ? "s" : ""}
//           </span>
//         </div>
//       </div>

//       {/* Taluk tiles grid */}
//       <div className="flex-1 p-3 overflow-y-auto" style={{ minHeight: 240, maxHeight: 340, background: "#f8fafc" }}>
//         {entries.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center text-slate-400">
//               <div className="text-2xl mb-1">{icon}</div>
//               <div className="text-xs font-medium">
//                {Object.keys(aggMap).length === 0
//   ? `No ${level?.label || "item"} data`
//   : `No ${level?.label || "item"}s match filter`}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
//             {entries.map(([name, data]) => (
//               <div
//                 key={name}
//                 style={{
//                   background: ZONE_BG[data.zone],
//                   border: `1.5px solid ${ZONE_COLORS[data.zone]}44`,
//                   borderRadius: 10,
//                   padding: "8px 10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 2,
//                 }}
//               >
//                 <div style={{
//                   display: "flex", alignItems: "center", gap: 5, marginBottom: 2,
//                 }}>
//                   <span style={{ width: 7, height: 7, borderRadius: "50%", background: ZONE_COLORS[data.zone], display: "inline-block", flexShrink: 0 }}/>
//                   <span style={{ fontSize: 11, fontWeight: 700, color: ZONE_TEXT[data.zone], wordBreak: "break-word", lineHeight: 1.3 }}>{name}</span>
//                 </div>
//                 <div style={{ fontSize: 10, color: "#64748b" }}>
//                   {data.count} farmer{data.count !== 1 ? "s" : ""}
//                 </div>
//                 <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a" }}>
//                   {data.production.toLocaleString()} units
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Legend footer */}
//       <div className="px-4 py-2 border-t border-slate-100 flex gap-3 flex-wrap">
//         {(["green", "yellow", "red"] as Zone[]).map(z => (
//           <div key={z} className="flex items-center gap-1.5">
//             <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[z] }} />
//             <span className="text-xs text-slate-500">{ZONE_LABEL[z]}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SINGLE REACT-SIMPLE-MAPS PANEL
// // ─────────────────────────────────────────────────────────────────────────────
// interface MapPanelProps {
//   title: string;
//   subtitle: string;
//   icon: string;
//   accentColor: string;
//   geoUrl: string;
//   geoNameKey: string;
//   geoFilterKey?: string;
//   geoFilterValue?: string;
//   aggMap: Record<string, { count: number; production: number; zone: Zone }>;
//   center: [number, number];
//   zoom: number;
//   onRegionClick?: (name: string) => void;
//   activeZone: ZoneFilter;
//   onZoneFilterChange: (z: ZoneFilter) => void;
//   highlightName?: string;
//   totalPostings: number;
// }

// function MapPanel({
//   title, subtitle, icon, accentColor,
//   geoUrl, geoNameKey, geoFilterKey, geoFilterValue,
//   aggMap, center, zoom,
//   onRegionClick, activeZone, onZoneFilterChange,
//   highlightName, totalPostings,
// }: MapPanelProps) {
//   const [tooltip, setTooltip] = useState<MapTooltip | null>(null);

//   const zoneCounts = useMemo(() => {
//     const c = { green: 0, yellow: 0, red: 0 };
//     Object.values(aggMap).forEach(v => { c[v.zone]++; });
//     return c;
//   }, [aggMap]);

//   // FIX 2 applied here: use lookupAggMap for fuzzy name matching
//   const getGeoData = (rawName: string) => lookupAggMap(aggMap, rawName);

//   const getGeoFill = (rawName: string): string => {
//     const data = getGeoData(rawName);
//     if (!data) return "#e2e8f0";
//     if (activeZone !== "all" && data.zone !== activeZone) return "#f1f5f9";
//     return ZONE_COLORS[data.zone];
//   };

//   const getGeoOpacity = (rawName: string): number => {
//     const data = getGeoData(rawName);
//     if (!data) return 0.4;
//     if (activeZone !== "all" && data.zone !== activeZone) return 0.3;
//     return 1;
//   };

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
//       {/* Panel Header */}
//       <div className="px-4 pt-4 pb-2 border-b border-slate-100">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-lg">{icon}</span>
//           <span className="font-bold text-slate-800 text-sm">{title}</span>
//           {highlightName && (
//             <span
//               className="text-xs font-semibold px-2 py-0.5 rounded-full"
//               style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }}
//             >
//               {highlightName}
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-slate-400">{subtitle}</p>
//         {/* Zone filter pills */}
//         <div className="flex gap-1.5 mt-2 flex-wrap">
//           {([
//             { key: "all" as ZoneFilter,    label: "All",           bg: "#f1f5f9", color: "#475569" },
//             { key: "green" as ZoneFilter,  label: `✓ ${zoneCounts.green}`,  bg: ZONE_BG.green,  color: ZONE_TEXT.green  },
//             { key: "yellow" as ZoneFilter, label: `⚠ ${zoneCounts.yellow}`, bg: ZONE_BG.yellow, color: ZONE_TEXT.yellow },
//             { key: "red" as ZoneFilter,    label: `✗ ${zoneCounts.red}`,    bg: ZONE_BG.red,    color: ZONE_TEXT.red    },
//           ]).map(z => (
//             <button
//               key={z.key}
//               onClick={() => onZoneFilterChange(z.key)}
//               style={{
//                 background: activeZone === z.key ? z.bg : "#fff",
//                 color: activeZone === z.key ? z.color : "#94a3b8",
//                 border: `1.5px solid ${activeZone === z.key ? z.color : "#e2e8f0"}`,
//                 fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
//                 cursor: "pointer", transition: "all 0.15s",
//               }}
//             >
//               {z.label}
//             </button>
//           ))}
//           <span className="ml-auto text-xs text-slate-400 self-center">
//             {totalPostings} farmer{totalPostings !== 1 ? "s" : ""}
//           </span>
//         </div>
//       </div>

//       {/* Map */}
//       <div className="relative flex-1" style={{ minHeight: 240, background: "#f8fafc" }}>
//         <ComposableMap
//           projection="geoMercator"
//           style={{ width: "100%", height: "100%", minHeight: 240 }}
//           projectionConfig={{ center, scale: zoom }}
//         >
//           <ZoomableGroup center={center} zoom={1} minZoom={0.5} maxZoom={6}>
//             <Geographies geography={geoUrl}>
//               {({ geographies }) =>
//                 geographies
//                   .filter(geo => {
//                     // FIX 3: use robust stateMatches() instead of simple norm() comparison
//                     if (!geoFilterKey || !geoFilterValue) return true;
//                     if (geoFilterValue === "__NONE__") return false;
//                     const geoVal = geo.properties[geoFilterKey] as string;
//                     return stateMatches(geoVal, geoFilterValue);
//                   })
//                   .map(geo => {
//                     const rawName = geo.properties[geoNameKey] as string;
//                     const geoData = getGeoData(rawName);
//                     const fill    = getGeoFill(rawName);
//                     const opacity = getGeoOpacity(rawName);

//                     return (
//                       <Geography
//   key={geo.rsmKey}
//   geography={geo}
//   fill={fill}
//   stroke="#64748b"
//   strokeWidth={0.75}
//   style={{
//     default:  { outline: "none", fillOpacity: opacity, strokeOpacity: 1 },
//     hover:    { outline: "none", fillOpacity: 1, strokeOpacity: 1, cursor: onRegionClick && geoData ? "pointer" : "default", filter: "brightness(1.1)" },
//     pressed:  { outline: "none" },
//   }}
//   onClick={() => onRegionClick && geoData && onRegionClick(rawName)}
//   onMouseEnter={e => {
//                           if (geoData) {
//                             setTooltip({
//                               name:       rawName,
//                               count:      geoData.count,
//                               production: geoData.production,
//                               zone:       geoData.zone,
//                               x:          (e as unknown as MouseEvent).clientX,
//                               y:          (e as unknown as MouseEvent).clientY,
//                             });
//                           }
//                         }}
//                         onMouseLeave={() => setTooltip(null)}
//                       />
//                     );
//                   })
//               }
//             </Geographies>
//           </ZoomableGroup>
//         </ComposableMap>

//         {/* No-data overlay */}
//         {Object.keys(aggMap).length === 0 && (
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center text-slate-400">
//               <div className="text-2xl mb-1">🗺</div>
//               <div className="text-xs font-medium">No data for current filter</div>
//             </div>
//           </div>
//         )}

//         {/* Tooltip */}
//         {tooltip && (
//           <div
//             className="fixed z-50 pointer-events-none"
//             style={{ left: tooltip.x + 12, top: tooltip.y - 60, minWidth: 160 }}
//           >
//             <div className="rounded-xl px-3 py-2 text-xs shadow-xl" style={{ background: "#0f172a", color: "#f1f5f9" }}>
//               <div className="font-bold mb-1">{tooltip.name}</div>
//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-400">Farmers</span>
//                 <span className="font-semibold">{tooltip.count.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between gap-4">
//                 <span className="text-slate-400">Production</span>
//                 <span className="font-semibold">{tooltip.production.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between gap-4 mt-1">
//                 <span className="text-slate-400">Zone</span>
//                 <span className="font-bold" style={{ color: ZONE_COLORS[tooltip.zone] }}>
//                   {ZONE_LABEL[tooltip.zone]}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Legend footer */}
//       <div className="px-4 py-2 border-t border-slate-100 flex gap-3 flex-wrap">
//         {(["green", "yellow", "red"] as Zone[]).map(z => (
//           <div key={z} className="flex items-center gap-1.5">
//             <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[z] }} />
//             <span className="text-xs text-slate-500">{ZONE_LABEL[z]}</span>
//           </div>
//         ))}
//         <div className="flex items-center gap-1.5">
//           <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
//           <span className="text-xs text-slate-400">No data</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // THREE-MAP HIERARCHICAL ZONE MAPS
// // ─────────────────────────────────────────────────────────────────────────────
// function HierarchicalZoneMap({
//   allPostings,
//   pageSelectedState,
//   pageSelectedDistrict,
//   pageSelectedTaluk,
// }: {
//   allPostings: Posting[];
//   pageSelectedState: string;
//   pageSelectedDistrict: string;
//   pageSelectedTaluk: string;
// }) {
//   const [stateZoneFilter,    setStateZoneFilter]    = useState<ZoneFilter>("all");
//   const [districtZoneFilter, setDistrictZoneFilter] = useState<ZoneFilter>("all");
//   const [talukZoneFilter,    setTalukZoneFilter]    = useState<ZoneFilter>("all");
//   const [villageZoneFilter,  setVillageZoneFilter]  = useState<ZoneFilter>("all");

//   useEffect(() => { setDistrictZoneFilter("all"); }, [pageSelectedState]);
//   useEffect(() => { setTalukZoneFilter("all"); },    [pageSelectedDistrict]);
//   useEffect(() => { setVillageZoneFilter("all"); },  [pageSelectedTaluk]);

//   // ── STATE-level aggregation ───────────────────────────────────────────────
//   const stateAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
//     const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
//     allPostings.forEach(p => {
//       const geoName = normalizeStateName(p.state);
//       const key = norm(geoName);
//       if (!key || key === "unknown") return;
//       if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
//       map[key].count++;
//       map[key].production += p.production;
//       map[key].zones.push(p.zone);
//     });
//     const result: Record<string, { count: number; production: number; zone: Zone }> = {};
//     Object.entries(map).forEach(([k, v]) => {
//       const zc = { green: 0, yellow: 0, red: 0 };
//       v.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
//       result[k] = { count: v.count, production: v.production, zone };
//     });
//     return result;
//   }, [allPostings]);

//   // ── DISTRICT-level aggregation ────────────────────────────────────────────
//   const districtAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
//     if (!pageSelectedState) return {};
//     const filtered = allPostings.filter(p =>
//       norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState))
//     );
//     const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
//     filtered.forEach(p => {
//       const key = norm(p.district);
//       if (!key || key === "—" || key === "unknown") return;
//       if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
//       map[key].count++;
//       map[key].production += p.production;
//       map[key].zones.push(p.zone);
//     });
//     const result: Record<string, { count: number; production: number; zone: Zone }> = {};
//     Object.entries(map).forEach(([k, v]) => {
//       const zc = { green: 0, yellow: 0, red: 0 };
//       v.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
//       result[k] = { count: v.count, production: v.production, zone };
//     });
//     return result;
//   }, [allPostings, pageSelectedState]);

//   // ── TALUK-level aggregation (keyed by taluk name, for tile view) ──────────
//   const talukAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
//     if (!pageSelectedState) return {};
//     let filtered = allPostings.filter(p =>
//       norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState))
//     );
//     if (pageSelectedDistrict) {
//       filtered = filtered.filter(p => norm(p.district) === norm(pageSelectedDistrict));
//     }
//     const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
//     filtered.forEach(p => {
//       const key = norm(p.taluk);
//       if (!key || key === "—" || key === "unknown") return;
//       if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
//       map[key].count++;
//       map[key].production += p.production;
//       map[key].zones.push(p.zone);
//     });
//     const result: Record<string, { count: number; production: number; zone: Zone }> = {};
//     Object.entries(map).forEach(([k, v]) => {
//       const zc = { green: 0, yellow: 0, red: 0 };
//       v.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
//       result[k] = { count: v.count, production: v.production, zone };
//     });
//     return result;
//   }, [allPostings, pageSelectedState, pageSelectedDistrict]);

//   // ── VILLAGE-level aggregation (only meaningful once state+district+taluk picked) ──
//   const villageAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
//     if (!pageSelectedState || !pageSelectedDistrict || !pageSelectedTaluk) return {};
//     const filtered = allPostings.filter(p =>
//       norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState)) &&
//       norm(p.district) === norm(pageSelectedDistrict) &&
//       norm(p.taluk)    === norm(pageSelectedTaluk)
//     );
//     const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
//     filtered.forEach(p => {
//       const key = norm(p.village);
//       if (!key || key === "—" || key === "unknown") return;
//       if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
//       map[key].count++;
//       map[key].production += p.production;
//       map[key].zones.push(p.zone);
//     });
//     const result: Record<string, { count: number; production: number; zone: Zone }> = {};
//     Object.entries(map).forEach(([k, v]) => {
//       const zc = { green: 0, yellow: 0, red: 0 };
//       v.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
//       result[k] = { count: v.count, production: v.production, zone };
//     });
//     return result;
//   }, [allPostings, pageSelectedState, pageSelectedDistrict, pageSelectedTaluk]);

//   const totalStateFarmers    = useMemo(() => Object.values(stateAggMap).reduce((s, v) => s + v.count, 0),    [stateAggMap]);
//   const totalDistrictFarmers = useMemo(() => Object.values(districtAggMap).reduce((s, v) => s + v.count, 0), [districtAggMap]);
//   const totalTalukFarmers    = useMemo(() => Object.values(talukAggMap).reduce((s, v) => s + v.count, 0),    [talukAggMap]);
//   const totalVillageFarmers  = useMemo(() => Object.values(villageAggMap).reduce((s, v) => s + v.count, 0),  [villageAggMap]);

//   const INDIA_CENTER: [number, number] = [82.5, 22];
//   const INDIA_ZOOM   = 800;

//   const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
//     "karnataka":         { center: [75.7, 14.5],  zoom: 2800 },
//     "andhra pradesh":    { center: [79.5, 15.5],  zoom: 2200 },
//     "telangana":         { center: [79.0, 17.5],  zoom: 3000 },
//     "tamil nadu":        { center: [78.5, 11.0],  zoom: 2500 },
//     "tamilnadu":         { center: [78.5, 11.0],  zoom: 2500 },
//     "kerala":            { center: [76.3, 10.5],  zoom: 3000 },
//     "maharashtra":       { center: [76.5, 19.0],  zoom: 1800 },
//     "gujarat":           { center: [71.5, 22.5],  zoom: 2000 },
//     "rajasthan":         { center: [74.0, 27.0],  zoom: 1500 },
//     "madhya pradesh":    { center: [78.5, 23.5],  zoom: 1800 },
//     "uttar pradesh":     { center: [80.5, 27.0],  zoom: 1800 },
//     "bihar":             { center: [85.5, 25.5],  zoom: 3000 },
//     "west bengal":       { center: [87.5, 23.0],  zoom: 2500 },
//     "orissa":            { center: [84.0, 20.5],  zoom: 2500 },
//     "odisha":            { center: [84.0, 20.5],  zoom: 2500 },
//     "chhattisgarh":      { center: [81.5, 21.5],  zoom: 2400 },
//     "jharkhand":         { center: [85.5, 23.5],  zoom: 2800 },
//     "assam":             { center: [92.0, 26.5],  zoom: 2800 },
//     "punjab":            { center: [75.5, 31.0],  zoom: 3500 },
//     "haryana":           { center: [76.5, 29.5],  zoom: 3000 },
//     "himachal pradesh":  { center: [77.0, 32.0],  zoom: 3000 },
//     "uttaranchal":       { center: [79.5, 30.5],  zoom: 3200 },
//     "uttarakhand":       { center: [79.5, 30.5],  zoom: 3200 },
//     "goa":               { center: [74.1, 15.3],  zoom: 6000 },
//     "delhi":             { center: [77.1, 28.7],  zoom: 8000 },
//     "sikkim":            { center: [88.5, 27.5],  zoom: 5000 },
//     "arunachal pradesh": { center: [94.7, 28.2],  zoom: 2000 },
//     "nagaland":          { center: [94.5, 26.2],  zoom: 4000 },
//     "manipur":           { center: [93.9, 24.7],  zoom: 4000 },
//     "mizoram":           { center: [92.9, 23.2],  zoom: 4000 },
//     "tripura":           { center: [91.9, 23.8],  zoom: 5000 },
//     "meghalaya":         { center: [91.4, 25.5],  zoom: 4000 },
//     "jammu and kashmir": { center: [75.3, 33.7],  zoom: 2000 },
//   };

//   const getStateCenterConfig = (stateName: string) => {
//     const attempts = [norm(stateName), norm(normalizeStateName(stateName))];
//     for (const k of attempts) {
//       if (STATE_CENTERS[k]) return STATE_CENTERS[k];
//     }
//     return { center: INDIA_CENTER, zoom: INDIA_ZOOM };
//   };

//   const stateCenterConfig = pageSelectedState
//     ? getStateCenterConfig(pageSelectedState)
//     : { center: INDIA_CENTER, zoom: INDIA_ZOOM };

//   const geoFilterStateValue = pageSelectedState
//     ? normalizeStateName(pageSelectedState)
//     : "__NONE__";

//   return (
//     <div>
//       <div className="flex items-center gap-3 mb-4">
//         <div className="flex items-center gap-2">
//           <span className="text-base font-bold text-slate-700">Production Zone Maps</span>
//           <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">4 views • filter-aware</span>
//         </div>
//         {!pageSelectedState && (
//           <span className="text-xs text-slate-400">← Select a State in the filter bar above to drill down into Districts, Taluks &amp; Villages</span>
//         )}
//       </div>

//       <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

//         {/* PANEL 1 — State level */}
//         <MapPanel
//           title="State-Level Overview"
//           subtitle="Farmer count & zone per state across India"
//           icon="🗺"
//           accentColor="#D85A30"
//           geoUrl={INDIA_STATES_GEO}
//           geoNameKey="NAME_1"
//           aggMap={stateAggMap}
//           center={INDIA_CENTER}
//           zoom={INDIA_ZOOM}
//           activeZone={stateZoneFilter}
//           onZoneFilterChange={setStateZoneFilter}
//           totalPostings={totalStateFarmers}
//           highlightName={pageSelectedState || undefined}
//         />

//         {/* PANEL 2 — District level */}
//         <MapPanel
//           title={pageSelectedState ? `District View — ${pageSelectedState}` : "District View"}
//           subtitle={
//             pageSelectedState
//               ? `Districts inside ${pageSelectedState} • farmer distribution`
//               : "Select a state to see districts"
//           }
//           icon="🏙"
//           accentColor="#378ADD"
//           geoUrl={INDIA_DISTRICTS_GEO}
//           geoNameKey="NAME_2"
//           geoFilterKey="NAME_1"
//           geoFilterValue={geoFilterStateValue}
//           aggMap={pageSelectedState ? districtAggMap : {}}
//           center={stateCenterConfig.center}
//           zoom={stateCenterConfig.zoom}
//           activeZone={districtZoneFilter}
//           onZoneFilterChange={setDistrictZoneFilter}
//           totalPostings={totalDistrictFarmers}
//           highlightName={pageSelectedDistrict || undefined}
//         />

//         {/* PANEL 3 — Taluk level */}
//         {pageSelectedDistrict ? (
//           <TalukTilePanel
//             title={`Taluk View — ${pageSelectedDistrict}`}
//             subtitle={`Taluks inside ${pageSelectedDistrict} (coloured by zone)`}
//             icon="🏛"
//             accentColor="#7F77DD"
//             levelLabel="taluk"
//             aggMap={talukAggMap}
//             activeZone={talukZoneFilter}
//             onZoneFilterChange={setTalukZoneFilter}
//             totalPostings={totalTalukFarmers}
//             highlightName={pageSelectedDistrict}
//           />
//         ) : (
//           <MapPanel
//             title={pageSelectedState ? `Taluk View — ${pageSelectedState}` : "Taluk View"}
//             subtitle={
//               pageSelectedState
//                 ? `District-wise taluk rollup for ${pageSelectedState} — select a district for taluk detail`
//                 : "Select a state & district to see taluk breakdown"
//             }
//             icon="🏛"
//             accentColor="#7F77DD"
//             geoUrl={INDIA_DISTRICTS_GEO}
//             geoNameKey="NAME_2"
//             geoFilterKey="NAME_1"
//             geoFilterValue={geoFilterStateValue}
//             aggMap={pageSelectedState ? districtAggMap : {}}
//             center={stateCenterConfig.center}
//             zoom={stateCenterConfig.zoom}
//             activeZone={talukZoneFilter}
//             onZoneFilterChange={setTalukZoneFilter}
//             totalPostings={totalTalukFarmers}
//             highlightName={undefined}
//           />
//         )}

//         {/* PANEL 4 — Village level (tile grid, only once a taluk is selected) */}
//         {pageSelectedTaluk ? (
//           <TalukTilePanel
//             title={`Village View — ${pageSelectedTaluk}`}
//             subtitle={`Villages inside ${pageSelectedTaluk} (coloured by zone)`}
//             icon="🏘"
//             accentColor="#D85A30"
//             levelLabel="village"
//             aggMap={villageAggMap}
//             activeZone={villageZoneFilter}
//             onZoneFilterChange={setVillageZoneFilter}
//             totalPostings={totalVillageFarmers}
//             highlightName={pageSelectedTaluk}
//           />
//         ) : (
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center" style={{ minHeight: 240 }}>
//             <div className="text-center text-slate-400 px-6">
//               <div className="text-2xl mb-1">🏘</div>
//               <div className="text-xs font-medium">Select a Taluk in the filter bar above to see villages</div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Legend row */}
//       <div className="mt-4 flex flex-wrap gap-4 items-center px-1">
//         <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Zone Legend:</span>
//         {(["green", "yellow", "red"] as Zone[]).map(z => (
//           <div key={z} className="flex items-center gap-1.5">
//             <div className="w-3 h-3 rounded-sm" style={{ background: ZONE_COLORS[z] }} />
//             <span className="text-xs text-slate-600">{ZONE_LABEL[z]}</span>
//           </div>
//         ))}
//         <div className="flex items-center gap-1.5">
//           <div className="w-3 h-3 rounded-sm bg-slate-300" />
//           <span className="text-xs text-slate-400">No data / out of filter</span>
//         </div>
//         <span className="ml-auto text-xs text-slate-400">Powered by react-simple-maps • GeoJSON © Natural Earth</span>
//       </div>
//     </div>
//   );
// }

// // ─── Monthly Trend Table ──────────────────────────────────────────────────────
// function MonthlyTrendTable({ rows, months, locationLabel }: { rows: CommodityRow[]; months: string[]; locationLabel: string }) {
//   if (!rows.length) return <div style={{ padding:24, textAlign:"center", color:"#94a3b8" }}>No commodity data</div>;
//   const shortMonth = (m:string) => { const p=m.split(" "); return `${p[0]} ${(p[1]||"").slice(2)}`; };
//   return (
//     <div style={{ overflowX:"auto" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
//         Monthly Performance Trend {locationLabel && `(${locationLabel})`}
//       </div>
//       <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
//         <thead>
//           <tr style={{ background:"#f8f9fb" }}>
//             <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:120 }}>Commodity</th>
//             <th style={{ padding:"10px 8px", textAlign:"right", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Area (Acres)</th>
//             {months.map(m=>(
//               <th key={m} style={{ padding:"10px 6px", textAlign:"center", fontWeight:600, color:"#64748b", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:52 }}>{shortMonth(m)}</th>
//             ))}
//             <th style={{ padding:"10px 8px", textAlign:"center", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Trend<br/><span style={{ fontSize:10, fontWeight:400, color:"#94a3b8" }}>(Last 3 Mo)</span></th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row,ri) => {
//             const sc = STATUS_COLORS[row.status];
//             const sparkValues = months.map(m => {
//               const t = row.monthlyTrend[m] || "stable";
//               const sm: Record<TrendValue,number> = { up:5, slightly_up:4, stable:3, down:2, sharp_decline:1 };
//               return sm[t] ?? 3;
//             });
//             return (
//               <tr key={row.commodity} style={{ background:ri%2===0?"#fff":"#fafafa", borderBottom:"1px solid #f3f4f6" }}>
//                 <td style={{ padding:"10px 12px", fontWeight:600, whiteSpace:"nowrap" }}>
//                   <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
//                     <span style={{ fontSize:16 }}>{getCommodityIcon(row.commodity)}</span>{row.commodity}
//                   </span>
//                 </td>
//                 <td style={{ padding:"10px 8px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500 }}>{row.totalArea.toLocaleString()}</td>
//                 {months.map(m=>(
//                   <td key={m} style={{ padding:"10px 6px", textAlign:"center" }}>
//                     <TrendCell trend={row.monthlyTrend[m]||"stable"} color={sc.dot}/>
//                   </td>
//                 ))}
//                 <td style={{ padding:"10px 8px", textAlign:"center" }}><Sparkline values={sparkValues} color={sc.dot}/></td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:14, padding:"10px 0", borderTop:"1px solid #f3f4f6", fontSize:12, color:"#64748b" }}>
//         <span style={{ fontWeight:600, color:"#333" }}>Trend Indication:</span>
//         {[
//           {icon:"↗",label:"Improving",color:"#1D9E75"},
//           {icon:"↗",label:"Slightly Improving",color:"#4A90A4"},
//           {icon:"→",label:"Stable",color:"#888"},
//           {icon:"↓",label:"Declining",color:"#EF9F27"},
//           {icon:"↘",label:"Sharp Decline",color:"#E24B4A"},
//         ].map(t=>(
//           <span key={t.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
//             <span style={{ color:t.color, fontWeight:700, fontSize:14 }}>{t.icon}</span>
//             <span>{t.label}</span>
//           </span>
//         ))}
//       </div>
//       <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>
//         Note: Area (Acres) is the cultivated area under the respective commodity during the survey month.
//       </div>
//     </div>
//   );
// }

// function CommodityStatusPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
//   const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px", height:"100%" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>Commodity Wise Status</div>
//       {locationLabel && <div style={{ fontSize:12, color:"#64748b", marginBottom:16 }}>({locationLabel})</div>}
//       <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
//         <thead>
//           <tr style={{ background:"#f8f9fb" }}>
//             <th style={{ padding:"8px 6px", textAlign:"left",   fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Commodity</th>
//             <th style={{ padding:"8px 6px", textAlign:"right",  fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Area</th>
//             <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Status</th>
//             <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Ind.</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map(row => {
//             const sc = STATUS_COLORS[row.status];
//             return (
//               <tr key={row.commodity} style={{ borderBottom:"1px solid #f3f4f6" }}>
//                 <td style={{ padding:"9px 6px", fontWeight:500 }}>
//                   <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
//                     <span>{getCommodityIcon(row.commodity)}</span>
//                     <span style={{ fontSize:13 }}>{row.commodity}</span>
//                   </span>
//                 </td>
//                 <td style={{ padding:"9px 6px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500, fontSize:13 }}>{row.totalArea.toLocaleString()}</td>
//                 <td style={{ padding:"9px 6px", textAlign:"center" }}>
//                   <span style={{ background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{row.status}</span>
//                 </td>
//                 <td style={{ padding:"9px 6px", textAlign:"center" }}>
//                   <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
//                     <div style={{ width:32, height:4, borderRadius:2, background:sc.dot }}/>
//                   </div>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//         <tfoot>
//           <tr style={{ background:"#f8f9fb", borderTop:"2px solid #e5e7eb" }}>
//             <td colSpan={2} style={{ padding:"10px 6px", fontWeight:700, fontSize:13 }}>
//               Total Area (Acres) <span style={{ marginLeft:8, color:"#1a1a1a" }}>{totalArea.toLocaleString()}</span>
//             </td>
//             <td colSpan={2}/>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   );
// }

// function SummaryPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
//   const groups = {
//     "Good/High": rows.filter(r=>r.status==="Good/High"),
//     "Moderate":  rows.filter(r=>r.status==="Moderate"),
//     "Low/Poor":  rows.filter(r=>r.status==="Low/Poor"),
//   } as const;
//   const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px" }}>
//       <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>
//         Summary {locationLabel && `(${locationLabel})`}
//       </div>
//       <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:20, marginTop:16 }}>
//         {(["Good/High","Moderate","Low/Poor"] as const).map(status => {
//           const sc   = STATUS_COLORS[status];
//           const grp  = groups[status];
//           const area = grp.reduce((s,r)=>s+r.totalArea, 0);
//           return (
//             <div key={status} style={{ borderLeft:`3px solid ${sc.dot}`, paddingLeft:14 }}>
//               <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
//                 <span style={{ fontWeight:700, color:sc.text, fontSize:13 }}>{status}</span>
//               </div>
//               <div style={{ fontSize:28, fontWeight:800, color:sc.dot }}>{grp.length}</div>
//               <div style={{ fontSize:12, color:"#64748b" }}>Commodities</div>
//               <div style={{ fontSize:18, fontWeight:700, marginTop:8, color:"#1a1a1a" }}>
//                 {area.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
//               </div>
//             </div>
//           );
//         })}
//         <div style={{ borderLeft:"1px solid #e5e7eb", paddingLeft:14 }}>
//           <div style={{ fontSize:12, color:"#64748b", marginBottom:6 }}>Total Commodities</div>
//           <div style={{ fontSize:28, fontWeight:800, color:"#1a1a1a" }}>{rows.length}</div>
//           <div style={{ fontSize:12, color:"#64748b", marginTop:12 }}>Total Area Surveyed</div>
//           <div style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>
//             {totalArea.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
//           </div>
//         </div>
//       </div>
//       <div style={{ marginTop:16, fontSize:11, color:"#94a3b8", borderTop:"1px solid #e5e7eb", paddingTop:10, display:"flex", gap:20, flexWrap:"wrap" }}>
//         <span>📅 Survey Period: Jun 2023 – May 2024</span>
//         <span>🗄 Source: Agriculture Department</span>
//         <span>🔄 Last Updated: 20 May 2024</span>
//       </div>
//     </div>
//   );
// }

// function LocationFilterBar({
//   selectedState, selectedDistrict, selectedTaluk, selectedVillage,
//   onSelectState, onSelectDistrict, onSelectTaluk, onSelectVillage,
//   states, districts, taluks, villages,
//   surveyMonths, selectedMonth, onSelectMonth,
// }: {
//   selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
//   onSelectState:(s:string)=>void; onSelectDistrict:(s:string)=>void; onSelectTaluk:(s:string)=>void; onSelectVillage:(s:string)=>void;
//   states:string[]; districts:string[]; taluks:string[]; villages:string[];
//   surveyMonths:string[]; selectedMonth:string; onSelectMonth:(m:string)=>void;
// }) {
//   const selStyle = (active:boolean): React.CSSProperties => ({
//     padding:"8px 14px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13,
//     background:active?"#F0FDF4":"#fff", fontWeight:active?600:400,
//     color:active?"#166534":"#374151", cursor:"pointer", minWidth:140,
//   });
//   return (
//     <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"14px 20px", marginBottom:20, display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-end" }}>
//       {[
//         { label:"📍 State",    value:selectedState,    onChange:onSelectState,    options:states,    placeholder:"All States",    disabled:false           },
//         { label:"🏙 District", value:selectedDistrict, onChange:onSelectDistrict, options:districts, placeholder:"All Districts", disabled:!selectedState   },
//         { label:"🏛 Taluk",    value:selectedTaluk,    onChange:onSelectTaluk,    options:taluks,    placeholder:"All Taluks",    disabled:!selectedDistrict},
//         { label:"🏘 Village",  value:selectedVillage,  onChange:onSelectVillage,  options:villages,  placeholder:"All Villages",  disabled:!selectedTaluk  },
//       ].map(f => (
//         <div key={f.label} style={{ display:"flex", flexDirection:"column", gap:4 }}>
//           <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{f.label}</label>
//           <select value={f.value} onChange={e=>f.onChange(e.target.value)} disabled={f.disabled}
//             style={{ ...selStyle(!!f.value), opacity:f.disabled?0.5:1 }}>
//             <option value="">{f.placeholder}</option>
//             {f.options.map(o => <option key={o} value={o}>{o}</option>)}
//           </select>
//         </div>
//       ))}
//       {surveyMonths.length > 0 && (
//         <div style={{ display:"flex", flexDirection:"column", gap:4, marginLeft:"auto" }}>
//           <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>📅 Survey Month</label>
//           <select value={selectedMonth} onChange={e=>onSelectMonth(e.target.value)} style={selStyle(!!selectedMonth)}>
//             <option value="">All Months</option>
//             {surveyMonths.map(m => <option key={m} value={m}>{m}</option>)}
//           </select>
//         </div>
//       )}
//     </div>
//   );
// }

// function LocationBreadcrumb({
//   selectedState, selectedDistrict, selectedTaluk, selectedVillage, onReset,
// }: {
//   selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
//   onReset:(level:"state"|"district"|"taluk"|"village"|"all")=>void;
// }) {
//   const parts = [
//     selectedState    && { label:selectedState,    level:"state"   as const },
//     selectedDistrict && { label:selectedDistrict, level:"district"as const },
//     selectedTaluk    && { label:selectedTaluk,    level:"taluk"   as const },
//     selectedVillage  && { label:selectedVillage,  level:"village" as const },
//   ].filter(Boolean) as { label:string; level:"state"|"district"|"taluk"|"village" }[];
//   if (!parts.length) return null;
//   return (
//     <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"8px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", fontSize:13 }}>
//       <span style={{ color:"#64748b", fontWeight:500 }}>Viewing:</span>
//       <button onClick={()=>onReset("all")} style={{ background:"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:500, fontSize:13, padding:"0 4px" }}>All</button>
//       {parts.map((p,i) => (
//         <span key={p.level} style={{ display:"flex", alignItems:"center", gap:6 }}>
//           <span style={{ color:"#94a3b8" }}>›</span>
//           <button onClick={()=>onReset(p.level)}
//             style={{ background:i===parts.length-1?"#BFDBFE":"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:i===parts.length-1?700:500, fontSize:13, padding:"2px 8px", borderRadius:12 }}>
//             {p.label}
//           </button>
//         </span>
//       ))}
//     </div>
//   );
// }

// // ─── Main Dashboard ───────────────────────────────────────────────────────────
// export default function FarmDashboard() {
//   const [loading,          setLoading]          = useState(true);
//   const [error,            setError]            = useState<string|null>(null);
//   const [search,           setSearch]           = useState("");
//   const [filterType,       setFilterType]       = useState("");
//   const [filterCommodity,  setFilterCommodity]  = useState("");
//   const [page,             setPage]             = useState(1);
//   const [adminData,        setAdminData]        = useState<AdminData|null>(null);
//   const [adminLoading,     setAdminLoading]     = useState(true);
//   const [configsLoading,   setConfigsLoading]   = useState(true);
//   const [allConfigs,       setAllConfigs]       = useState<ZoneConfig[]>([]);
//   const [openModal,        setOpenModal]        = useState<null|"state"|"district"|"taluk">(null);
//   const [rawPostings,      setRawPostings]      = useState<Omit<Posting,"zone">[]>([]);
//   const [selectedState,    setSelectedState]    = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedTaluk,    setSelectedTaluk]    = useState("");
//   const [selectedVillage,  setSelectedVillage]  = useState("");
//   const [selectedMonth,    setSelectedMonth]    = useState("");
//   const PAGE_SIZE = 10;

//   const configsMap = useMemo<Record<string, ZoneConfig>>(() => {
//     const map: Record<string, ZoneConfig> = {};
//     allConfigs.forEach(c => {
//       const restored: ZoneConfig = {
//         ...c,
//         commodityRanges: (c.commodityRanges ?? []).map(cr => ({
//           ...cr,
//           ranges: {
//             green:  { ...cr.ranges.green,  max: cr.ranges.green.max  === null || cr.ranges.green.max  > 1e15 ? Infinity : cr.ranges.green.max  },
//             yellow: { ...cr.ranges.yellow, max: cr.ranges.yellow.max === null || cr.ranges.yellow.max > 1e15 ? Infinity : cr.ranges.yellow.max },
//             red:    { ...cr.ranges.red,    max: cr.ranges.red.max    === null || cr.ranges.red.max    > 1e15 ? Infinity : cr.ranges.red.max    },
//           },
//         })),
//       };
//       map[buildConfigKey(c)] = restored;
//     });
//     return map;
//   }, [allConfigs]);

//   const allCommodities = useMemo(() => {
//     const s = new Set(rawPostings.map(r => r.commodity).filter(v => v && v !== "Unknown"));
//     return Array.from(s).sort();
//   }, [rawPostings]);

//   useEffect(() => {
//     (async () => {
//       setConfigsLoading(true);
//       try {
//         const res  = await fetch("/api/taluk-zone-configs");
//         if (!res.ok) throw new Error("Failed");
//         const data = await res.json();
//         const sanitized = (data.configs || []).map((c: ZoneConfig) => ({
//           level:           c.level    ?? "taluk",
//           state:           c.state    ?? "",
//           district:        c.district ?? "",
//           taluk:           c.taluk    ?? "",
//           commodityRanges: Array.isArray(c.commodityRanges) ? c.commodityRanges : [],
//         }));
//         setAllConfigs(sanitized);
//       } catch { setAllConfigs([]); }
//       finally { setConfigsLoading(false); }
//     })();
//   }, []);

//   const handleSaveConfigs = useCallback(async (configs: ZoneConfig[]) => {
//     try {
//       const serialisable = JSON.parse(JSON.stringify(configs, (_, v) =>
//         v === Infinity ? 999999999 : v
//       ));
//       const res  = await fetch("/api/taluk-zone-configs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ configs: serialisable }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to save");
//       setAllConfigs(configs);
//       setOpenModal(null);
//       alert("Configurations saved successfully");
//     } catch(e) { console.error(e); alert("Failed to save configurations"); }
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const session = await getAdminSessionAction();
//         if (session?.admin) {
//           setAdminData({ taluka:session.admin.taluka??"", role:session.admin.role??"subadmin", name:session.admin.name, email:session.admin.email });
//         }
//       } catch(e) { console.error(e); }
//       finally { setAdminLoading(false); }
//     })();
//   }, []);

//   useEffect(() => {
//     if (adminLoading) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const firstRes  = await fetch("/api/postings?page=1&limit=10");
//         if (!firstRes.ok) throw new Error("Failed to fetch /api/postings");
//         const firstJson = await firstRes.json();
//         const total     = firstJson.total ?? firstJson.stats?.totalCrops ?? 0;
//         const pageSize  = firstJson.limit ?? 10;
//         const pageCount = Math.ceil(total / pageSize);
//         const allPages: unknown[][] = [firstJson.data ?? []];
//         if (pageCount > 1) {
//           const pageNums = Array.from({ length:pageCount-1 }, (_,i)=>i+2);
//           const results  = await Promise.all(pageNums.map(pg =>
//             fetch(`/api/postings?page=${pg}&limit=${pageSize}`)
//               .then(r=>r.ok?r.json():{data:[]})
//               .then(j=>(j.data??[]) as unknown[])
//           ));
//           allPages.push(...results);
//         }
//         const source: unknown[] = allPages.flat();
//         const enriched: Omit<Posting,"zone">[] = source.map((p: unknown) => {
//           const posting = p as {
//             _id:string; farmerId:string; farmingType:string; seedType:string; acres:number;
//             commodity?:string; sowingDate?:string; createdAt?:string;
//             tracking?:{cropName?:string};
//             farmer?:{
//               personalInfo?:{taluk?:string;taluka?:string;district?:string;state?:string;address?:string;villageGramaPanchayat?:string};
//               farmLocation?:{latitude?:string;longitude?:string};
//               taluka?:string; district?:string; state?:string;
//             };
//           };
//           const pi         = posting.farmer?.personalInfo ?? {};
//           const fl         = posting.farmer?.farmLocation  ?? {};
//           const commodity  = (posting.commodity||posting.tracking?.cropName||posting.seedType||"Unknown").trim();
//           const production = getProduction(posting.acres??0, posting.farmingType??"regular");
//           const taluk      = (pi.taluk??pi.taluka??posting.farmer?.taluka??"Unknown").trim();
//           const district   = (pi.district??posting.farmer?.district??"—").trim();
//           const state      = (pi.state??posting.farmer?.state??"Unknown").trim();
//           const village    = (pi.villageGramaPanchayat||pi.address||"—").trim() || "—";
//           const month      = monthFromDate(posting.sowingDate||posting.createdAt||"");
//           return {
//             id:posting._id, farmerId:posting.farmerId,
//             farmingType:(posting.farmingType??"regular").toLowerCase(),
//             seedType:posting.seedType, acres:posting.acres??0,
//             production, taluk, district, state, village, commodity,
//             lat:parseFloat(fl.latitude??"")||null, lng:parseFloat(fl.longitude??"")||null, month,
//           };
//         });
//         setRawPostings(enriched);
//       } catch(e) { setError(e instanceof Error ? e.message : String(e)); }
//       finally { setLoading(false); }
//     })();
//   }, [adminLoading]);

//   useEffect(() => {
//     if (adminData?.role==="subadmin" && adminData.taluka && !selectedTaluk)
//       setSelectedTaluk(adminData.taluka);
//   }, [adminData]);

//   const allPostings = useMemo<Posting[]>(() =>
//     rawPostings.map(p => ({
//       ...p,
//       zone: getZoneForPosting(p.production, p.commodity, p.taluk, p.district, p.state, configsMap),
//     })),
//     [rawPostings, configsMap]
//   );

//   const states = useMemo(() => {
//     const s = new Set(allPostings.map(r=>r.state).filter(v=>v&&v!=="Unknown"));
//     return Array.from(s).sort();
//   }, [allPostings]);

//   const districts = useMemo(() => {
//     const base = selectedState ? allPostings.filter(r=>r.state===selectedState) : allPostings;
//     const s = new Set(base.map(r=>r.district).filter(v=>v&&v!=="—"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState]);

//   const taluks = useMemo(() => {
//     let b = allPostings;
//     if (selectedState)    b = b.filter(r=>r.state===selectedState);
//     if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
//     const s = new Set(b.map(r=>r.taluk).filter(v=>v&&v!=="Unknown"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState, selectedDistrict]);

//   const villages = useMemo(() => {
//     let b = allPostings;
//     if (selectedState)    b = b.filter(r=>r.state===selectedState);
//     if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
//     if (selectedTaluk)    b = b.filter(r=>r.taluk===selectedTaluk);
//     const s = new Set(b.map(r=>r.village).filter(v=>v&&v!=="—"));
//     return Array.from(s).sort();
//   }, [allPostings, selectedState, selectedDistrict, selectedTaluk]);

//   const surveyMonths = useMemo(() => {
//     const s = new Set(allPostings.map(r=>r.month).filter(Boolean));
//     if (s.size === 0) return SURVEY_MONTHS;
//     return Array.from(s).sort((a,b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime());
//   }, [allPostings]);

//   const locationFiltered = useMemo(() => {
//     let data = allPostings;
//     if (adminData?.role==="subadmin" && adminData.taluka)
//       data = data.filter(r => norm(r.taluk) === norm(adminData.taluka));
//     if (selectedState)    data = data.filter(r=>r.state===selectedState);
//     if (selectedDistrict) data = data.filter(r=>r.district===selectedDistrict);
//     if (selectedTaluk)    data = data.filter(r=>r.taluk===selectedTaluk);
//     if (selectedVillage)  data = data.filter(r=>r.village===selectedVillage);
//     if (selectedMonth)    data = data.filter(r=>r.month===selectedMonth);
//     return data;
//   }, [allPostings, adminData, selectedState, selectedDistrict, selectedTaluk, selectedVillage, selectedMonth]);

//   const filtered = useMemo(() => {
//     const s = search.toLowerCase();
//     return locationFiltered.filter(r => {
//       const matchSearch = !s ||
//         r.farmerId.toLowerCase().includes(s) ||
//         r.farmingType.toLowerCase().includes(s) ||
//         r.commodity.toLowerCase().includes(s) ||
//         r.taluk.toLowerCase().includes(s) ||
//         r.district.toLowerCase().includes(s) ||
//         r.village.toLowerCase().includes(s);
//       return matchSearch && (!filterType||r.farmingType===filterType) && (!filterCommodity||r.commodity===filterCommodity);
//     });
//   }, [locationFiltered, search, filterType, filterCommodity]);

//   const commodityRows = useMemo<CommodityRow[]>(() => {
//     const map: Record<string,{totalArea:number;monthProds:Record<string,number[]>;totalProduction:number;zones:Zone[]}> = {};
//     filtered.forEach(r => {
//       if (!map[r.commodity]) map[r.commodity] = { totalArea:0, monthProds:{}, totalProduction:0, zones:[] };
//       map[r.commodity].totalArea       += r.acres;
//       map[r.commodity].totalProduction += r.production;
//       map[r.commodity].zones.push(r.zone);
//       const mKey = r.month || "Unknown";
//       if (!map[r.commodity].monthProds[mKey]) map[r.commodity].monthProds[mKey] = [];
//       map[r.commodity].monthProds[mKey].push(r.production);
//     });
//     const activeMonths = surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS;
//     return Object.entries(map).map(([commodity, data]) => {
//       const zoneCounts = { green:0, yellow:0, red:0 };
//       data.zones.forEach(z => zoneCounts[z]++);
//       const dominantZone = (Object.entries(zoneCounts).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
//       const monthlyTrend: Record<string,TrendValue> = {};
//       activeMonths.forEach(m => {
//         const vals = data.monthProds[m];
//         if (!vals?.length) { monthlyTrend[m]="stable"; return; }
//         const avg        = vals.reduce((a,b)=>a+b,0) / vals.length;
//         const overallVals = Object.values(data.monthProds).flat();
//         const overallAvg  = overallVals.reduce((a,b)=>a+b,0) / overallVals.length;
//         const pct         = overallAvg > 0 ? ((avg-overallAvg)/overallAvg)*100 : 0;
//         if (pct>10)       monthlyTrend[m]="up";
//         else if (pct>3)   monthlyTrend[m]="slightly_up";
//         else if (pct<-15) monthlyTrend[m]="sharp_decline";
//         else if (pct<-3)  monthlyTrend[m]="down";
//         else              monthlyTrend[m]="stable";
//       });
//       const allProdByMonth = activeMonths.map(m => { const vals=data.monthProds[m]||[]; return vals.reduce((a,b)=>a+b,0); });
//       return { commodity, totalArea:data.totalArea, status:zoneToStatus(dominantZone), monthlyTrend, lastThreeMonthTrend:deriveTrend(allProdByMonth) };
//     }).sort((a,b) => b.totalArea - a.totalArea);
//   }, [filtered, surveyMonths]);

//   const aggTableData = useMemo<TalukAgg[]>(() => {
//     const groupField: keyof Posting =
//       selectedDistrict ? "taluk"    :
//       selectedState    ? "district" :
//                          "state";
//     const map: Record<string,{production:number;count:number;zones:Zone[]}> = {};
//     filtered.forEach(r => {
//       const key = (r[groupField] as string) || "";
//       if (!key || key==="Unknown" || key==="—") return;
//       if (!map[key]) map[key] = { production:0, count:0, zones:[] };
//       map[key].production += r.production;
//       map[key].count      += 1;
//       map[key].zones.push(r.zone);
//     });
//     return Object.entries(map).map(([name, data]) => {
//       const zc: Record<Zone,number> = { green:0, yellow:0, red:0 };
//       data.zones.forEach(z => zc[z]++);
//       const zone = (Object.entries(zc).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
//       return { name, production:data.production, count:data.count, zone };
//     }).sort((a,b) => b.production - a.production);
//   }, [filtered, selectedState, selectedDistrict]);

//   const configCount = (level:"state"|"district"|"taluk") =>
//     allConfigs.filter(c=>c.level===level).reduce((sum,c)=>sum+(c.commodityRanges?.length??0), 0);

//   const totalProduction = useMemo(() => filtered.reduce((s,r)=>s+r.production, 0), [filtered]);
//   const totalAcres      = useMemo(() => filtered.reduce((s,r)=>s+r.acres, 0),      [filtered]);
//   const uniqueFarmers   = useMemo(() => new Set(filtered.map(r=>r.farmerId)).size,  [filtered]);
//   const farmingTypes    = useMemo(() => [...new Set(allPostings.map(r=>r.farmingType))].filter(Boolean).sort(), [allPostings]);

//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

//   const aggLevelLabel =
//     selectedDistrict ? "Taluk"    :
//     selectedState    ? "District" :
//                        "State";

//   const locationLabel =
//     selectedVillage  ? `${selectedVillage} Village`    :
//     selectedTaluk    ? `${selectedTaluk} Taluk`        :
//     selectedDistrict ? `${selectedDistrict} District`  :
//     selectedState    ? selectedState                   : "";

//   const handleSelectState    = (s:string) => { setSelectedState(s); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
//   const handleSelectDistrict = (d:string) => { setSelectedDistrict(d); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
//   const handleSelectTaluk    = (t:string) => { setSelectedTaluk(t); setSelectedVillage(""); setPage(1); };
//   const handleBreadcrumbReset = (level:"state"|"district"|"taluk"|"village"|"all") => {
//     if      (level==="all")      { setSelectedState(""); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="state")    { setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="district") { setSelectedTaluk(""); setSelectedVillage(""); }
//     else if (level==="taluk")    { setSelectedVillage(""); }
//     setPage(1);
//   };

//   const activeMonths = selectedMonth
//     ? [selectedMonth]
//     : (surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS);

//   const s = {
//     container:    { fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f8f9fb", minHeight:"100vh", padding:"0 0 40px" } as React.CSSProperties,
//     header:       { background:"#0f172a", color:"#fff", padding:"20px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" as const, gap:12 } as React.CSSProperties,
//     body:         { maxWidth:1500, margin:"0 auto", padding:"28px 24px" } as React.CSSProperties,
//     section:      { background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px 24px", marginBottom:24 } as React.CSSProperties,
//     sectionTitle: { fontSize:15, fontWeight:700, color:"#1a1a1a", marginBottom:16, letterSpacing:"-0.01em" } as React.CSSProperties,
//     statsGrid:    { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:14, marginBottom:24 } as React.CSSProperties,
//     table:        { width:"100%", borderCollapse:"collapse" as const, fontSize:13 } as React.CSSProperties,
//     th:           { textAlign:"left" as const, padding:"10px 12px", fontSize:11, fontWeight:600, color:"#888", textTransform:"uppercase" as const, letterSpacing:"0.05em", borderBottom:"1px solid #f3f4f6", whiteSpace:"nowrap" as const } as React.CSSProperties,
//     td:           { padding:"10px 12px", borderBottom:"0.5px solid #f3f4f6", color:"#1a1a1a" } as React.CSSProperties,
//     input:        { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, outline:"none", background:"#fff", color:"#1a1a1a", minWidth:200 } as React.CSSProperties,
//     select:       { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, background:"#fff", color:"#1a1a1a", cursor:"pointer" } as React.CSSProperties,
//   };

//   if (adminLoading || loading || configsLoading) {
//     return (
//       <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
//         <div style={{ textAlign:"center", color:"#64748b" }}>
//           <div style={{ fontSize:32, marginBottom:12 }}>⟳</div>
//           <div>{adminLoading?"Checking permissions…":configsLoading?"Loading configurations…":"Loading farm data…"}</div>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
//         <div style={{ background:"#FCEBEB", border:"1px solid #E24B4A44", borderRadius:12, padding:"20px 28px", color:"#791F1F", maxWidth:400 }}>
//           <strong>Error:</strong> {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={s.container}>
//       <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

//       {/* ── Header ── */}
//       <div style={s.header}>
//         <div>
//           <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em", margin:0 }}>Today Crops — Your Daily Harvest</h1>
//           <p style={{ fontSize:13, color:"#94a3b8", marginTop:2, marginBottom:0 }}>Agriculture Produce Survey · Commodity &amp; Location wise Status with Monthly Trend and Area (Acres)</p>
//           {locationLabel && <p style={{ fontSize:12, color:"#60a5fa", marginTop:4, marginBottom:0 }}>📍 {locationLabel} · {filtered.length} postings</p>}
//         </div>
//         <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:16 }}>
//             <RoleBadge adminData={adminData}/>
//             <div style={{ display:"flex", gap:12, fontSize:12, fontWeight:600 }}>
//               {(["green","yellow","red"] as Zone[]).map(z => (
//                 <span key={z} style={{ display:"flex", alignItems:"center", gap:5 }}>
//                   <span style={{ width:12, height:4, borderRadius:2, background:ZONE_COLORS[z], display:"inline-block" }}/>
//                   <span style={{ color:ZONE_COLORS[z] }}>{ZONE_LABEL[z]}</span>
//                 </span>
//               ))}
//             </div>
//           </div>
//           <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//             <input style={s.input} placeholder="Search farmer, crop, village…" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
//             <select style={s.select} value={filterType} onChange={e=>{ setFilterType(e.target.value); setPage(1); }}>
//               <option value="">All farming types</option>
//               {farmingTypes.map(t => <option key={t} value={t}>{t}</option>)}
//             </select>
//             <select style={s.select} value={filterCommodity} onChange={e=>{ setFilterCommodity(e.target.value); setPage(1); }}>
//               <option value="">All commodities</option>
//               {allCommodities.map(c => <option key={c} value={c}>{getCommodityIcon(c)} {c}</option>)}
//             </select>
//             {adminData?.role==="admin" && (
//               <div style={{ display:"flex", gap:8 }}>
//                 {([
//                   { level:"state"    as const, icon:"🗺", label:"State Zones",    color:"#D85A30", bg:"#FFF3EE", bd:"#FDBA74" },
//                   { level:"district" as const, icon:"🏙", label:"District Zones", color:"#378ADD", bg:"#EFF6FF", bd:"#BFDBFE" },
//                   { level:"taluk"    as const, icon:"🏛", label:"Taluk Zones",    color:"#7F77DD", bg:"#F5F3FF", bd:"#DDD6FE" },
//                 ]).map(btn => {
//                   const count = configCount(btn.level);
//                   return (
//                     <button key={btn.level} onClick={() => setOpenModal(btn.level)}
//                       style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${btn.bd}`, background:btn.bg, color:btn.color, cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
//                       {btn.icon} {btn.label}
//                       {count>0 && <span style={{ background:btn.color, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{count}</span>}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//           {(configCount("state")+configCount("district")+configCount("taluk")) > 0 && (
//             <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
//               {(["state","district","taluk"] as const).map(level => {
//                 const count = configCount(level);
//                 if (!count) return null;
//                 const colors = { state:{c:"#D85A30",bg:"#FFF3EE",bd:"#FDBA74"}, district:{c:"#378ADD",bg:"#EFF6FF",bd:"#BFDBFE"}, taluk:{c:"#7F77DD",bg:"#F5F3FF",bd:"#DDD6FE"} };
//                 const clr = colors[level];
//                 return (
//                   <div key={level} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:clr.c, background:clr.bg, border:`1px solid ${clr.bd}`, borderRadius:20, padding:"3px 10px" }}>
//                     <span style={{ width:6, height:6, borderRadius:"50%", background:clr.c, display:"inline-block" }}/>
//                     {count} {level} override{count!==1?"s":""} active
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={s.body}>
//         <RoleInfoBanner adminData={adminData}/>

//         {allConfigs.length > 0 && (
//           <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
//             <span style={{ fontSize:13, fontWeight:600, color:"#5b21b6" }}>⚙ Zone overrides active:</span>
//             {(["state","district","taluk"] as const).map(level => {
//               const cfgs = allConfigs.filter(c=>c.level===level);
//               if (!cfgs.length) return null;
//               const colors = { state:"#D85A30", district:"#378ADD", taluk:"#7F77DD" };
//               return cfgs.map(cfg => {
//                 const locName = level==="state" ? cfg.state : level==="district" ? cfg.district : cfg.taluk;
//                 return (
//                   <span key={buildConfigKey(cfg)} style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fff", border:"1px solid #DDD6FE", borderRadius:20, padding:"2px 10px", fontSize:12, color:colors[level] }}>
//                     <span style={{ width:6, height:6, borderRadius:"50%", background:colors[level], display:"inline-block" }}/>
//                     {level}: {locName}
//                     <span style={{ color:"#94a3b8", fontSize:11 }}>({cfg.commodityRanges.length} crop{cfg.commodityRanges.length!==1?"s":""})</span>
//                   </span>
//                 );
//               });
//             })}
//           </div>
//         )}

//         <LocationFilterBar
//           selectedState={selectedState} selectedDistrict={selectedDistrict}
//           selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
//           onSelectState={handleSelectState} onSelectDistrict={handleSelectDistrict}
//           onSelectTaluk={handleSelectTaluk} onSelectVillage={v=>{ setSelectedVillage(v); setPage(1); }}
//           states={states} districts={districts} taluks={taluks} villages={villages}
//           surveyMonths={surveyMonths} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth}
//         />

//         <LocationBreadcrumb
//           selectedState={selectedState} selectedDistrict={selectedDistrict}
//           selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
//           onReset={handleBreadcrumbReset}
//         />

//         {/* Stats */}
//         <div style={s.statsGrid}>
//           <StatCard label="Total Postings"   value={filtered.length.toLocaleString()}               accent="#378ADD"/>
//           <StatCard label="Unique Farmers"   value={uniqueFarmers}                                   accent="#7F77DD"/>
//           <StatCard label="Total Acres"      value={totalAcres.toLocaleString()}                     accent="#1D9E75"/>
//           <StatCard label="Total Production" value={`${(totalProduction/1000).toFixed(1)}k`}         accent="#D85A30"/>
//           <StatCard label="Good / High"      value={filtered.filter(r=>r.zone==="green").length}     accent="#1D9E75"/>
//           <StatCard label="Moderate"         value={filtered.filter(r=>r.zone==="yellow").length}    accent="#EF9F27"/>
//           <StatCard label="Low / Poor"       value={filtered.filter(r=>r.zone==="red").length}       accent="#E24B4A"/>
//           <StatCard label="Commodities"      value={new Set(filtered.map(r=>r.commodity)).size}      accent="#4A90A4"/>
//         </div>

//         {/* Trend + Commodity status */}
//         <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, marginBottom:24, alignItems:"start" }}>
//           <div style={s.section}><MonthlyTrendTable rows={commodityRows} months={activeMonths} locationLabel={locationLabel}/></div>
//           <CommodityStatusPanel rows={commodityRows} locationLabel={locationLabel}/>
//         </div>

//         <SummaryPanel rows={commodityRows} locationLabel={locationLabel}/>

//         {/* Charts + Aggregation table */}
//         <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))", gap:24, margin:"24px 0" }}>
//           <div style={s.section}>
//             <div style={s.sectionTitle}>Production by Farming Type</div>
//             <BarChart data={[...filtered.reduce((m,r)=>{
//               if(!m.has(r.farmingType)) m.set(r.farmingType,{type:r.farmingType,production:0});
//               m.get(r.farmingType)!.production+=r.production;
//               return m;
//             },new Map<string,ChartEntry>()).values()].sort((a,b)=>b.production-a.production)}/>
//           </div>
//           <div style={s.section}>
//             <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
//               <div style={s.sectionTitle}>{aggLevelLabel}-Level Aggregation</div>
//             </div>
//             <div style={{ overflowY:"auto", maxHeight:280 }}>
//               <table style={s.table}>
//                 <thead>
//                   <tr>
//                     <th style={s.th}>{aggLevelLabel}</th>
//                     <th style={s.th}>Postings</th>
//                     <th style={{ ...s.th, textAlign:"right" }}>Total Production</th>
//                     <th style={{ ...s.th, textAlign:"center" }}>Zone</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {aggTableData.map(item => (
//                     <tr key={item.name}>
//                       <td style={s.td}>{item.name}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{item.count}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{item.production.toLocaleString()}</td>
//                       <td style={{ ...s.td, textAlign:"center" }}><ZoneBadge zone={item.zone}/></td>
//                     </tr>
//                   ))}
//                   {aggTableData.length===0 && (
//                     <tr><td colSpan={4} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"24px 0" }}>No data</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* ── THREE-PANEL ZONE MAP ── */}
//         {/* ── FOUR-PANEL ZONE MAP ── */}
//         <div style={s.section}>
//           <HierarchicalZoneMap
//             allPostings={allPostings}
//             pageSelectedState={selectedState}
//             pageSelectedDistrict={selectedDistrict}
//             pageSelectedTaluk={selectedTaluk}
//           />
//         </div>

//         {/* Postings table */}
//         <div style={s.section}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
//             <div style={s.sectionTitle}>
//               Postings Table
//               {locationLabel && <span style={{ fontSize:13, fontWeight:400, color:"#6d28d9", marginLeft:8 }}>({locationLabel})</span>}
//             </div>
//             <span style={{ fontSize:13, color:"#94a3b8" }}>{filtered.length} results · Page {page} of {totalPages||1}</span>
//           </div>
//           <div style={{ overflowX:"auto" }}>
//             <table style={s.table}>
//               <thead>
//                 <tr>
//                   {(["Farmer ID","Commodity","Farming Type","Seed Type","Village","Taluk","District","State","Month","Acres","Production","Zone"] as const).map(h => (
//                     <th key={h} style={["Production","Acres"].includes(h)?{...s.th,textAlign:"right"}:s.th}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((r,i) => {
//                   const stateKey2 = buildConfigKey({ level:"state",    state:r.state, district:"",        taluk:"" });
//                   const distKey   = buildConfigKey({ level:"district", state:r.state, district:r.district, taluk:"" });
//                   const talukKey  = buildConfigKey({ level:"taluk",    state:r.state, district:r.district, taluk:r.taluk });
//                   const overrideLevel = configsMap[talukKey]?"taluk":configsMap[distKey]?"district":configsMap[stateKey2]?"state":null;
//                   return (
//                     <tr key={r.id} style={{ background:i%2===0?"#fafafa":"#fff" }}>
//                       <td style={{ ...s.td, fontWeight:600, color:"#1e40af", fontFamily:"monospace" }}>{r.farmerId}</td>
//                       <td style={s.td}>
//                         <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
//                           <span style={{ width:8, height:8, borderRadius:"50%", background:getCommodityColor(r.commodity), display:"inline-block" }}/>
//                           <span>{getCommodityIcon(r.commodity)}</span>
//                           {r.commodity}
//                           {overrideLevel && (
//                             <span title={`${overrideLevel}-level zone override`}
//                               style={{ fontSize:9, background:overrideLevel==="taluk"?"#F5F3FF":overrideLevel==="district"?"#EFF6FF":"#FFF3EE", color:overrideLevel==="taluk"?"#7F77DD":overrideLevel==="district"?"#378ADD":"#D85A30", border:`1px solid ${overrideLevel==="taluk"?"#DDD6FE":overrideLevel==="district"?"#BFDBFE":"#FDBA74"}`, borderRadius:8, padding:"0 5px", fontWeight:700 }}>
//                               {overrideLevel.toUpperCase()[0]}
//                             </span>
//                           )}
//                         </span>
//                       </td>
//                       <td style={{ ...s.td, textTransform:"capitalize" }}>{r.farmingType}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.seedType||"—"}</td>
//                       <td style={s.td}>{r.village}</td>
//                       <td style={s.td}>{r.taluk}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.district}</td>
//                       <td style={{ ...s.td, color:"#64748b" }}>{r.state}</td>
//                       <td style={{ ...s.td, color:"#64748b", whiteSpace:"nowrap" }}>{r.month||"—"}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{r.acres.toLocaleString()}</td>
//                       <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{r.production.toLocaleString()}</td>
//                       <td style={s.td}><ZoneBadge zone={r.zone}/></td>
//                     </tr>
//                   );
//                 })}
//                 {paginated.length === 0 && (
//                   <tr><td colSpan={12} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"32px 0" }}>No postings found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalPages > 1 && (
//             <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20, flexWrap:"wrap" }}>
//               <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
//                 style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===1?"not-allowed":"pointer", fontSize:13, color:page===1?"#ccc":"#374151" }}>
//                 ← Prev
//               </button>
//               {Array.from({length:Math.min(totalPages,7)},(_,i)=>i+1).map(pg => (
//                 <button key={pg} onClick={()=>setPage(pg)}
//                   style={{ padding:"6px 12px", borderRadius:7, border:`0.5px solid ${pg===page?"#378ADD":"#d1d5db"}`, background:pg===page?"#378ADD":"#fff", color:pg===page?"#fff":"#374151", cursor:"pointer", fontSize:13, fontWeight:pg===page?600:400 }}>
//                   {pg}
//                 </button>
//               ))}
//               <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
//                 style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===totalPages?"not-allowed":"pointer", fontSize:13, color:page===totalPages?"#ccc":"#374151" }}>
//                 Next →
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Zone Manager Modal */}
//       {openModal && (
//         <ZoneRangeManager
//           modalLevel={openModal}
//           configs={allConfigs}
//           availableStates={states}
//           allPostings={allPostings}
//           allCommodities={allCommodities}
//           onSave={handleSaveConfigs}
//           onClose={() => setOpenModal(null)}
//         />
//       )}
//     </div>
//   );
// }


















//sagar

"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
// NOTE: Run `npm install react-simple-maps` in your project before using this file
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { getAdminSessionAction } from "@/app/actions/auth-actions";

// ─── GeoJSON URLs ─────────────────────────────────────────────────────────────
const INDIA_STATES_GEO    = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";
const INDIA_DISTRICTS_GEO = "https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminData {
  taluka: string;
  role: "admin" | "subadmin";
  name?: string;
  email?: string;
}
interface Posting {
  id: string; farmerId: string; farmingType: string; seedType: string;
  acres: number; production: number; zone: Zone;
  taluk: string; district: string; state: string; village: string;
  commodity: string; lat: number | null; lng: number | null; month: string;
}
interface ZoneRanges {
  green:  { min: number; max: number; color: Zone };
  yellow: { min: number; max: number; color: Zone };
  red:    { min: number; max: number; color: Zone };
}
interface CommodityRange {
  commodity: string;
  ranges: ZoneRanges;
  enabled: boolean;
}
interface ZoneConfig {
  level: "state" | "district" | "taluk";
  state: string;
  district: string;
  taluk: string;
  commodityRanges: CommodityRange[];
}
interface LocationAgg { name: string; production: number; count: number; zone: Zone; }
interface ChartEntry { type: string; production: number; }
interface CommodityRow {
  commodity: string; totalArea: number;
  status: "Good/High" | "Moderate" | "Low/Poor";
  monthlyTrend: Record<string, TrendValue>;
  lastThreeMonthTrend: TrendValue;
}
type Zone        = "red" | "yellow" | "green";
type FarmingType = "organic" | "regular" | "natural" | "hydroponic";
type TrendValue  = "up" | "slightly_up" | "stable" | "down" | "sharp_decline";
type TalukAgg    = LocationAgg;

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_ZONE_RANGES: ZoneRanges = {
  green:  { min: 1000, max: Infinity, color: "green"  },
  yellow: { min: 500,  max: 999,      color: "yellow" },
  red:    { min: 0,    max: 499,      color: "red"    },
};
const FACTORS: Record<FarmingType, number> = { organic: 1.2, regular: 1.0, natural: 0.9, hydroponic: 1.5 };
const SURVEY_MONTHS = [
  "Jun 2023","Jul 2023","Aug 2023","Sep 2023","Oct 2023","Nov 2023",
  "Dec 2023","Jan 2024","Feb 2024","Mar 2024","Apr 2024","May 2024",
];

// ─── FIX 1: Comprehensive state name map covering ALL Indian states ────────────
// Maps any spelling/variant (lowercase) → exact GeoJSON NAME_1 value
const STATE_NAME_MAP: Record<string, string> = {
  // Karnataka
  "karnataka":               "Karnataka",
  // Andhra Pradesh / Telangana (GeoJSON may still show "Andhra Pradesh" for both)
  "andhra pradesh":          "Andhra Pradesh",
  "telangana":               "Andhra Pradesh",
  // Tamil Nadu
  "tamil nadu":              "Tamil Nadu",
  "tamilnadu":               "Tamil Nadu",
  // Kerala
  "kerala":                  "Kerala",
  // Maharashtra
  "maharashtra":             "Maharashtra",
  // Gujarat
  "gujarat":                 "Gujarat",
  // Rajasthan
  "rajasthan":               "Rajasthan",
  // Madhya Pradesh
  "madhya pradesh":          "Madhya Pradesh",
  "mp":                      "Madhya Pradesh",
  // Uttar Pradesh
  "uttar pradesh":           "Uttar Pradesh",
  "up":                      "Uttar Pradesh",
  // Bihar
  "bihar":                   "Bihar",
  // West Bengal
  "west bengal":             "West Bengal",
  "westbengal":              "West Bengal",
  // Odisha — GeoJSON uses "Orissa"
  "odisha":                  "Orissa",
  "orissa":                  "Orissa",
  // Chhattisgarh
  "chhattisgarh":            "Chhattisgarh",
  "chattisgarh":             "Chhattisgarh",
  // Jharkhand
  "jharkhand":               "Jharkhand",
  // Assam
  "assam":                   "Assam",
  // Punjab
  "punjab":                  "Punjab",
  // Haryana
  "haryana":                 "Haryana",
  // Himachal Pradesh
  "himachal pradesh":        "Himachal Pradesh",
  "himachalpradesh":         "Himachal Pradesh",
  "hp":                      "Himachal Pradesh",
  // Uttarakhand — GeoJSON uses "Uttaranchal"
  "uttarakhand":             "Uttaranchal",
  "uttaranchal":             "Uttaranchal",
  "uk":                      "Uttaranchal",
  // Goa
  "goa":                     "Goa",
  // Delhi / NCT of Delhi
  "delhi":                   "Delhi",
  "nct of delhi":            "Delhi",
  "nct delhi":               "Delhi",
  // Sikkim
  "sikkim":                  "Sikkim",
  // Arunachal Pradesh
  "arunachal pradesh":       "Arunachal Pradesh",
  "arunachalpradesh":        "Arunachal Pradesh",
  // Nagaland
  "nagaland":                "Nagaland",
  // Manipur
  "manipur":                 "Manipur",
  // Mizoram
  "mizoram":                 "Mizoram",
  // Tripura
  "tripura":                 "Tripura",
  // Meghalaya
  "meghalaya":               "Meghalaya",
  // Jammu & Kashmir
  "jammu and kashmir":       "Jammu and Kashmir",
  "jammu & kashmir":         "Jammu and Kashmir",
  "j&k":                     "Jammu and Kashmir",
  "jk":                      "Jammu and Kashmir",
  // Ladakh (may not be in older GeoJSON — falls to trim)
  "ladakh":                  "Ladakh",
  // Andaman & Nicobar
  "andaman and nicobar islands": "Andaman and Nicobar",
  "andaman & nicobar":       "Andaman and Nicobar",
  "andaman":                 "Andaman and Nicobar",
  // Chandigarh
  "chandigarh":              "Chandigarh",
  // Dadra and Nagar Haveli
  "dadra and nagar haveli":  "Dadra and Nagar Haveli",
  "dadra & nagar haveli":    "Dadra and Nagar Haveli",
  // Daman and Diu
  "daman and diu":           "Daman and Diu",
  "daman & diu":             "Daman and Diu",
  // Lakshadweep
  "lakshadweep":             "Lakshadweep",
  // Puducherry / Pondicherry
  "puducherry":              "Puducherry",
  "pondicherry":             "Puducherry",
};

function normalizeStateName(name: string): string {
  const key = name.toLowerCase().trim();
  return STATE_NAME_MAP[key] ?? name.trim();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function norm(s: string): string {
  return (s ?? "").trim().toLowerCase();
}
function monthFromDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("en-US", { month: "short", year: "numeric" });
  } catch { return ""; }
}
function getProduction(acres: number, farmingType: string): number {
  return Math.round(acres * (FACTORS[farmingType as FarmingType] ?? 1.0));
}
function getZoneFromRanges(production: number, ranges: ZoneRanges, enabled: boolean): Zone {
  if (!enabled) {
    if (production >= DEFAULT_ZONE_RANGES.green.min)  return "green";
    if (production >= DEFAULT_ZONE_RANGES.yellow.min) return "yellow";
    return "red";
  }
  const { green, yellow, red } = ranges;
  const greenMax  = (green.max  as unknown) === "__INF__" || green.max  === Infinity ? Infinity : green.max;
  const yellowMax = (yellow.max as unknown) === "__INF__" || yellow.max === Infinity ? Infinity : yellow.max;
  const redMax    = (red.max    as unknown) === "__INF__" || red.max    === Infinity ? Infinity : red.max;
  if (production >= green.min  && (greenMax  === Infinity || production <= greenMax))  return "green";
  if (production >= yellow.min && (yellowMax === Infinity || production <= yellowMax)) return "yellow";
  if (production >= red.min    && (redMax    === Infinity || production <= redMax))    return "red";
  if (production >= green.min)  return "green";
  if (production >= yellow.min) return "yellow";
  return "red";
}
function buildConfigKey(cfg: { level: string; state: string; district: string; taluk: string }): string {
  return `${norm(cfg.level)}::${norm(cfg.state)}::${norm(cfg.district)}::${norm(cfg.taluk)}`;
}
function getZoneForPosting(
  production: number, commodity: string, taluk: string,
  district: string, state: string, configsMap: Record<string, ZoneConfig>
): Zone {
  const talukKey = buildConfigKey({ level: "taluk",    state, district, taluk });
  const distKey  = buildConfigKey({ level: "district", state, district, taluk: "" });
  const stateKey = buildConfigKey({ level: "state",    state, district: "", taluk: "" });
  for (const key of [talukKey, distKey, stateKey]) {
    const cfg = configsMap[key];
    if (cfg) {
      const cr = cfg.commodityRanges.find(r => norm(r.commodity) === norm(commodity));
      if (cr) return getZoneFromRanges(production, cr.ranges, cr.enabled);
    }
  }
  return getZoneFromRanges(production, DEFAULT_ZONE_RANGES, true);
}
function zoneToStatus(zone: Zone): "Good/High" | "Moderate" | "Low/Poor" {
  if (zone === "green")  return "Good/High";
  if (zone === "yellow") return "Moderate";
  return "Low/Poor";
}
function getCommodityIcon(commodity: string): string {
  const n = commodity.toLowerCase().trim();
  if (n.includes("paddy")||n.includes("rice")||n.includes("wheat"))        return "🌾";
  if (n.includes("maize")||n.includes("corn"))                             return "🌽";
  if (n.includes("sugarcane"))                                             return "🎋";
  if (n.includes("cotton"))                                                return "🌸";
  if (n.includes("groundnut")||n.includes("peanut"))                       return "🥜";
  if (n.includes("sunflower"))                                             return "🌻";
  if (n.includes("gram")||n.includes("dal")||n.includes("pulse")||n.includes("tur")) return "🫘";
  if (n.includes("tomato"))                                                return "🍅";
  if (n.includes("onion"))                                                 return "🧅";
  if (n.includes("banana")||n.includes("plantain"))                        return "🍌";
  if (n.includes("mango"))                                                 return "🥭";
  if (n.includes("coconut"))                                               return "🥥";
  if (n.includes("pepper")||n.includes("chilli"))                          return "🌶️";
  if (n.includes("ragi")||n.includes("millet")||n.includes("jowar")||n.includes("bajra")) return "🌿";
  if (n.includes("heirloom"))                                              return "🌾";
  if (n.includes("hybrid"))                                                return "🌱";
  if (n.includes("naati"))                                                 return "🌿";
  if (n.includes("gmo"))                                                   return "🧬";
  return "🌱";
}
function deriveTrend(vals: number[]): TrendValue {
  if (vals.length < 2) return "stable";
  const recent = vals.slice(-3);
  const older  = vals.slice(0, Math.max(1, vals.length - 3));
  const ra = recent.reduce((a,b)=>a+b,0) / recent.length;
  const oa = older.reduce((a,b)=>a+b,0)  / older.length;
  if (oa === 0) return "stable";
  const pct = ((ra - oa) / oa) * 100;
  if (pct > 10)  return "up";
  if (pct > 3)   return "slightly_up";
  if (pct < -15) return "sharp_decline";
  if (pct < -3)  return "down";
  return "stable";
}

// ─── FIX 2: Fuzzy name matcher for aggMap lookups ─────────────────────────────
// Tries exact norm match first, then partial containment match
function lookupAggMap<T>(
  aggMap: Record<string, T>,
  rawGeoName: string
): T | undefined {
  const key = norm(rawGeoName);
  // 1. exact match
  if (aggMap[key] !== undefined) return aggMap[key];
  // 2. partial: geo name contains DB name or vice versa
  for (const [k, v] of Object.entries(aggMap)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return undefined;
}

// ─── FIX 3: State filter matcher — robust fuzzy match ─────────────────────────
// Used inside Geographies filter to match GeoJSON NAME_1 against our selected state
function stateMatches(geoStateName: string, filterStateName: string): boolean {
  if (!filterStateName) return false;
  const gn = norm(geoStateName);
  const fn = norm(filterStateName);
  if (gn === fn) return true;
  // normalize both sides through the map
  const normalizedGeo    = norm(normalizeStateName(geoStateName));
  const normalizedFilter = norm(normalizeStateName(filterStateName));
  if (normalizedGeo === normalizedFilter) return true;
  // partial containment fallback
  if (gn.includes(fn) || fn.includes(gn)) return true;
  if (normalizedGeo.includes(normalizedFilter) || normalizedFilter.includes(normalizedGeo)) return true;
  return false;
}

// ─── Color Maps ───────────────────────────────────────────────────────────────
const ZONE_COLORS:  Record<Zone,string> = { green:"#1D9E75", yellow:"#EF9F27", red:"#E24B4A" };
const ZONE_BG:      Record<Zone,string> = { green:"#EAF3DE", yellow:"#FAEEDA", red:"#FCEBEB" };
const ZONE_TEXT:    Record<Zone,string> = { green:"#27500A", yellow:"#633806", red:"#791F1F" };
const ZONE_BORDER:  Record<Zone,string> = { green:"#C0DD97", yellow:"#FAC775", red:"#F09595" };
const ZONE_LABEL:   Record<Zone,string> = { green:"Good / High", yellow:"Moderate", red:"Low / Poor" };
const STATUS_COLORS = {
  "Good/High": { bg:"#EAF3DE", text:"#27500A", border:"#C0DD97", dot:"#1D9E75" },
  "Moderate":  { bg:"#FFF7ED", text:"#92400e", border:"#FDE68A", dot:"#F59E0B" },
  "Low/Poor":  { bg:"#FCEBEB", text:"#791F1F", border:"#F09595", dot:"#E24B4A" },
};
const TYPE_COLORS: Record<string,string> = {
  organic:"#378ADD", regular:"#1D9E75", natural:"#7F77DD", hydroponic:"#D85A30"
};
function getDynamicTypeColor(type: string, index: number): string {
  if (TYPE_COLORS[type.toLowerCase()]) return TYPE_COLORS[type.toLowerCase()];
  const p = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#6B8E23","#CD853F"];
  return p[index % p.length];
}
function getCommodityColor(commodity: string): string {
  const colors = ["#378ADD","#1D9E75","#7F77DD","#D85A30","#EF9F27","#E24B4A","#4A90A4","#5B9B9B","#F4C542","#6B8E23"];
  let hash = 0;
  for (let i = 0; i < commodity.length; i++) { hash = ((hash<<5)-hash) + commodity.charCodeAt(i); hash|=0; }
  return colors[Math.abs(hash) % colors.length];
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function TrendCell({ trend, color }: { trend: TrendValue; color: string }) {
  const map: Record<TrendValue,string> = { up:"↗", slightly_up:"↗", stable:"→", down:"↓", sharp_decline:"↘" };
  return (
    <span style={{ fontSize:16, color, fontWeight:700, display:"inline-block", textAlign:"center", width:"100%" }}>
      {map[trend] ?? map.stable}
    </span>
  );
}
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const W = 60, H = 20;
  const pts = values.map((v,i) => `${(i/(values.length-1))*W},${H-((v-min)/range)*H}`).join(" ");
  return (
    <svg width={W} height={H} style={{ display:"block", margin:"0 auto" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
    </svg>
  );
}
function ZoneBadge({ zone }: { zone: Zone }) {
  return (
    <span style={{ background:ZONE_BG[zone], color:ZONE_TEXT[zone], borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600, border:`1px solid ${ZONE_COLORS[zone]}33`, display:"inline-block", whiteSpace:"nowrap" }}>
      {ZONE_LABEL[zone]}
    </span>
  );
}
function StatCard({ label, value, accent }: { label:string; value:string|number; accent:string }) {
  return (
    <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"1rem 1.25rem", display:"flex", flexDirection:"column", gap:4, borderLeft:`3px solid ${accent}` }}>
      <span style={{ fontSize:12, color:"#888", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</span>
      <span style={{ fontSize:26, fontWeight:700, color:"#1a1a1a", letterSpacing:"-0.02em" }}>{value}</span>
    </div>
  );
}
function BarChart({ data }: { data: ChartEntry[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d=>d.production));
  return (
    <div style={{ padding:"1rem 0" }}>
      {data.map((d,i) => (
        <div key={d.type} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <span style={{ width:100, fontSize:13, color:"#555", textAlign:"right", fontWeight:500, textTransform:"capitalize" }}>{d.type}</span>
          <div style={{ flex:1, background:"#f3f4f6", borderRadius:6, overflow:"hidden", height:26 }}>
            <div style={{ width:`${(d.production/max)*100}%`, background:getDynamicTypeColor(d.type,i), height:"100%", borderRadius:6, display:"flex", alignItems:"center", paddingLeft:8 }}>
              <span style={{ fontSize:11, color:"#fff", fontWeight:600 }}>{d.production.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Zone Range Fields ────────────────────────────────────────────────────────
function ZoneRangeFields({
  enabled, setEnabled,
  greenMin, setGreenMin, greenMax, setGreenMax,
  yellowMin, setYellowMin, yellowMax, setYellowMax,
  redMin, setRedMin, redMax, setRedMax,
}: {
  enabled:boolean; setEnabled:(v:boolean)=>void;
  greenMin:number; setGreenMin:(v:number)=>void; greenMax:number; setGreenMax:(v:number)=>void;
  yellowMin:number; setYellowMin:(v:number)=>void; yellowMax:number; setYellowMax:(v:number)=>void;
  redMin:number; setRedMin:(v:number)=>void; redMax:number; setRedMax:(v:number)=>void;
}) {
  return (
    <>
      <div style={{ marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
        <label style={{ fontSize:12, fontWeight:600, color:"#333" }}>Custom ranges:</label>
        <button onClick={()=>setEnabled(!enabled)} style={{ padding:"4px 14px", borderRadius:20, border:"none", background:enabled?"#1D9E75":"#94a3b8", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>
          {enabled ? "ON" : "OFF"}
        </button>
      </div>
      {[
        { label:"🟢 Green Zone — Good / High Production", bg:ZONE_BG.green,   border:ZONE_BORDER.green,   tc:ZONE_TEXT.green,   min:greenMin,  max:greenMax,  setMin:setGreenMin,  setMax:setGreenMax,  note:"High production = Good performance"  },
        { label:"🟡 Yellow Zone — Moderate Production",   bg:ZONE_BG.yellow,  border:ZONE_BORDER.yellow,  tc:ZONE_TEXT.yellow,  min:yellowMin, max:yellowMax, setMin:setYellowMin, setMax:setYellowMax, note:"Mid-range = Moderate performance"    },
        { label:"🔴 Red Zone — Low / Poor Production",    bg:ZONE_BG.red,     border:ZONE_BORDER.red,     tc:ZONE_TEXT.red,     min:redMin,    max:redMax,    setMin:setRedMin,    setMax:setRedMax,    note:"Low production = Poor performance"   },
      ].map(z => (
        <div key={z.label} style={{ background:z.bg, borderRadius:12, padding:16, marginBottom:12, border:`1px solid ${z.border}` }}>
          <div style={{ fontWeight:700, color:z.tc, marginBottom:4 }}>{z.label}</div>
          <div style={{ fontSize:11, color:z.tc, marginBottom:10, opacity:0.8 }}>{z.note}</div>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Min Production Units</label>
              <input type="number" value={z.min ?? ""} onChange={e=>z.setMin(Number(e.target.value))} disabled={!enabled}
                style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
            </div>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11, color:z.tc, display:"block", marginBottom:4 }}>Max Production Units</label>
              <input type="number" value={z.max ?? ""} onChange={e=>z.setMax(Number(e.target.value))} disabled={!enabled}
                style={{ width:"100%", padding:"8px 12px", border:`1px solid ${z.border}`, borderRadius:8, fontSize:14, background:enabled?"#fff":"#f5f5f5", boxSizing:"border-box" }}/>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Universal Zone Range Manager ─────────────────────────────────────────────
// ─── Universal Zone Range Manager ─────────────────────────────────────────────
function ZoneRangeManager({
  modalLevel, configs, availableStates, allPostings,
  allCommodities, onSave, onClose,
}: {
  modalLevel: "state" | "district" | "taluk";
  configs: ZoneConfig[];
  availableStates: string[];
  allPostings: Posting[];
  allCommodities: string[];
  onSave: (configs: ZoneConfig[]) => void;
  onClose: () => void;
}) {
  const [localConfigs, setLocalConfigs] = useState<ZoneConfig[]>(() =>
    JSON.parse(JSON.stringify(configs, (_, v) => v === Infinity ? "__INF__" : v))
      .map((c: ZoneConfig) => ({
        ...c,
        commodityRanges: (c.commodityRanges ?? []).map((cr: CommodityRange) => ({
          ...cr,
          ranges: {
            green:  { ...cr.ranges.green,  max: (cr.ranges.green.max  as unknown) === "__INF__" ? Infinity : cr.ranges.green.max  },
            yellow: { ...cr.ranges.yellow, max: (cr.ranges.yellow.max as unknown) === "__INF__" ? Infinity : cr.ranges.yellow.max },
            red:    { ...cr.ranges.red,    max: (cr.ranges.red.max    as unknown) === "__INF__" ? Infinity : cr.ranges.red.max    },
          },
        })),
      }))
  );

  const [selParentState,    setSelParentState]    = useState(availableStates[0] ?? "");
  const [selParentDistrict, setSelParentDistrict] = useState("");
  const [selLocation,       setSelLocation]       = useState("");
  const [customInput,       setCustomInput]       = useState("");
  const [useCustom,         setUseCustom]         = useState(false);
  const [selCommodity,      setSelCommodity]      = useState(allCommodities[0]     ?? "");
  const [greenMin,  setGreenMin]  = useState(DEFAULT_ZONE_RANGES.green.min);
  const [greenMax,  setGreenMax]  = useState(999999);
  const [yellowMin, setYellowMin] = useState(DEFAULT_ZONE_RANGES.yellow.min);
  const [yellowMax, setYellowMax] = useState(DEFAULT_ZONE_RANGES.yellow.max);
  const [redMin,    setRedMin]    = useState(DEFAULT_ZONE_RANGES.red.min);
  const [redMax,    setRedMax]    = useState(DEFAULT_ZONE_RANGES.red.max);
  const [enabled,   setEnabled]   = useState(true);
  const [savedMsg,  setSavedMsg]  = useState("");

  // ── Districts/Taluks scoped STRICTLY to the state/district picked in this modal.
  // Computed live from real postings data — never from stale/unfiltered props,
  // so a district from another state can never leak into the list.
  const districtsInState = useMemo(() => {
    if (!selParentState) return [];
    const s = new Set(
      allPostings
        .filter(p => norm(p.state) === norm(selParentState))
        .map(p => p.district)
        .filter(v => v && v !== "—")
    );
    return Array.from(s).sort();
  }, [allPostings, selParentState]);

  const taluksInDistrict = useMemo(() => {
    if (!selParentState || !selParentDistrict) return [];
    const s = new Set(
      allPostings
        .filter(p => norm(p.state) === norm(selParentState) && norm(p.district) === norm(selParentDistrict))
        .map(p => p.taluk)
        .filter(v => v && v !== "Unknown")
    );
    return Array.from(s).sort();
  }, [allPostings, selParentState, selParentDistrict]);

  const activeLocation = useCustom ? customInput.trim() : selLocation;

  const activeKey = useMemo(() => {
    if (!activeLocation) return "";
    if (modalLevel === "state") {
      return buildConfigKey({ level: "state", state: activeLocation, district: "", taluk: "" });
    }
    if (modalLevel === "district") {
      return buildConfigKey({ level: "district", state: selParentState, district: activeLocation, taluk: "" });
    }
    return buildConfigKey({ level: "taluk", state: selParentState, district: selParentDistrict, taluk: activeLocation });
  }, [modalLevel, activeLocation, selParentState, selParentDistrict]);

  const currentCfg = useMemo(() =>
    activeKey ? localConfigs.find(c => buildConfigKey(c) === activeKey) ?? null : null,
    [localConfigs, activeKey]
  );

  useEffect(() => {
    if (!activeLocation || !selCommodity) return;
    const cr = currentCfg?.commodityRanges.find(r => norm(r.commodity) === norm(selCommodity));
    if (cr) {
      setGreenMin(cr.ranges.green.min);
      setGreenMax(cr.ranges.green.max === Infinity ? 999999 : cr.ranges.green.max);
      setYellowMin(cr.ranges.yellow.min);
      setYellowMax(cr.ranges.yellow.max === Infinity ? 999999 : cr.ranges.yellow.max);
      setRedMin(cr.ranges.red.min);
      setRedMax(cr.ranges.red.max === Infinity ? 999999 : cr.ranges.red.max);
      setEnabled(cr.enabled);
    } else {
      setGreenMin(DEFAULT_ZONE_RANGES.green.min); setGreenMax(999999);
      setYellowMin(DEFAULT_ZONE_RANGES.yellow.min); setYellowMax(DEFAULT_ZONE_RANGES.yellow.max);
      setRedMin(DEFAULT_ZONE_RANGES.red.min); setRedMax(DEFAULT_ZONE_RANGES.red.max);
      setEnabled(true);
    }
  }, [activeLocation, selCommodity, activeKey, currentCfg]);

  // Reset stale child selections whenever the parent context changes.
  useEffect(() => { setSelParentDistrict(""); }, [selParentState]);
  useEffect(() => { setSelLocation(""); }, [selParentState, selParentDistrict]);

  const saveCombination = (currentList: ZoneConfig[]): ZoneConfig[] => {
    if (!activeLocation) { alert("Please select or enter a location."); return currentList; }
    if (!selCommodity)   { alert("Please select a commodity."); return currentList; }
    const st = modalLevel === "state"    ? activeLocation : selParentState;
    const di = modalLevel === "district" ? activeLocation : modalLevel === "taluk" ? selParentDistrict : "";
    const tk = modalLevel === "taluk"    ? activeLocation : "";
    const newCR: CommodityRange = {
      commodity: selCommodity,
      ranges: {
        green:  { min: greenMin,  max: greenMax  === 999999 ? Infinity : greenMax,  color: "green"  },
        yellow: { min: yellowMin, max: yellowMax === 999999 ? Infinity : yellowMax, color: "yellow" },
        red:    { min: redMin,    max: redMax    === 999999 ? Infinity : redMax,    color: "red"    },
      },
      enabled,
    };
    const key      = buildConfigKey({ level: modalLevel, state: st, district: di, taluk: tk });
    const existing = currentList.find(c => buildConfigKey(c) === key);
    let next: ZoneConfig[];
    if (existing) {
      next = currentList.map(c => {
        if (buildConfigKey(c) !== key) return c;
        const filtered = c.commodityRanges.filter(r => norm(r.commodity) !== norm(selCommodity));
        return { ...c, commodityRanges: [...filtered, newCR] };
      });
    } else {
      next = [...currentList, { level: modalLevel, state: st, district: di, taluk: tk, commodityRanges: [newCR] }];
    }
    return next;
  };

  const handleSaveAndStay = () => {
    const next = saveCombination(localConfigs);
    setLocalConfigs(next);
    setSavedMsg(`✓ Saved "${activeLocation}" × "${selCommodity}"`);
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const handleRemove = () => {
    if (!activeLocation || !selCommodity || !activeKey) return;
    const next = localConfigs
      .map(c => {
        if (buildConfigKey(c) !== activeKey) return c;
        return { ...c, commodityRanges: c.commodityRanges.filter(r => norm(r.commodity) !== norm(selCommodity)) };
      })
      .filter(c => c.commodityRanges.length > 0); // drop the parent record once it has 0 ranges left
    setLocalConfigs(next);
  };

  const currentCombinationSaved = !!currentCfg?.commodityRanges.find(
    r => norm(r.commodity) === norm(selCommodity)
  );

  const savedRows = useMemo(() => {
    const rows: { cfg: ZoneConfig; cr: CommodityRange }[] = [];
    localConfigs.filter(c => c.level === modalLevel).forEach(c => {
      (c.commodityRanges ?? []).forEach(cr => rows.push({ cfg: c, cr }));
    });
    return rows.sort((a, b) => {
      const la = (a.cfg.state + a.cfg.district + a.cfg.taluk).toLowerCase();
      const lb = (b.cfg.state + b.cfg.district + b.cfg.taluk).toLowerCase();
      return la.localeCompare(lb) || a.cr.commodity.localeCompare(b.cr.commodity);
    });
  }, [localConfigs, modalLevel]);

  // Options shown in the picker — strictly real data for the selected state/district.
  // No union with "saved" locations, so a ghost/empty/mismatched record left over
  // from old data can never appear here.
  const locationOptions = useMemo(() => {
    if (modalLevel === "state") return availableStates;
    if (modalLevel === "district") return districtsInState;
    return taluksInDistrict;
  }, [modalLevel, availableStates, districtsInState, taluksInDistrict]);

  const allLocations = locationOptions;

  const levelLabel = modalLevel === "state" ? "State" : modalLevel === "district" ? "District" : "Taluk";
  const levelIcon  = modalLevel === "state" ? "🗺"   : modalLevel === "district" ? "🏙"       : "🏛";
  const levelColor = modalLevel === "state" ? "#D85A30" : modalLevel === "district" ? "#378ADD" : "#7F77DD";
  const levelBg    = modalLevel === "state" ? "#FFF3EE" : modalLevel === "district" ? "#EFF6FF" : "#F5F3FF";
  const levelBd    = modalLevel === "state" ? "#FDBA74" : modalLevel === "district" ? "#BFDBFE" : "#DDD6FE";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:16, padding:24, width:720, maxWidth:"95vw", maxHeight:"94vh", overflowY:"auto", boxShadow:"0 20px 40px rgba(0,0,0,0.2)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:700 }}>{levelIcon} {levelLabel}-Level Zone Range Manager</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#64748b", lineHeight:1 }}>×</button>
        </div>
        <p style={{ fontSize:13, color:"#64748b", marginBottom:8 }}>
          Set production zone thresholds per <strong>{levelLabel} × Commodity</strong> combination.
        </p>
        <div style={{ background:levelBg, border:`1px solid ${levelBd}`, borderRadius:10, padding:"10px 14px", marginBottom:18, fontSize:12, color:levelColor }}>
          <strong>Priority order:</strong> Taluk+Commodity &gt; District+Commodity &gt; State+Commodity &gt; Default
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
          {(["green","yellow","red"] as Zone[]).map(z => (
            <span key={z} style={{ background:ZONE_BG[z], color:ZONE_TEXT[z], border:`1px solid ${ZONE_BORDER[z]}`, borderRadius:20, padding:"3px 14px", fontSize:12, fontWeight:600 }}>
              {z==="green" ? "🟢 Good / High" : z==="yellow" ? "🟡 Moderate" : "🔴 Low / Poor"}
            </span>
          ))}
        </div>

        {(modalLevel === "district" || modalLevel === "taluk") && (
          <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>Step 1 — Select Parent Context</div>
            <div style={{ marginBottom: modalLevel === "taluk" ? 10 : 0 }}>
              <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>State (context)</label>
              <select value={selParentState} onChange={e => setSelParentState(e.target.value)}
                style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
                <option value="">-- Select state --</option>
                {availableStates.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {modalLevel === "taluk" && (
              <div style={{ marginTop:10 }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>District (context)</label>
                <select value={selParentDistrict} onChange={e => setSelParentDistrict(e.target.value)}
                  style={{ width:"100%", padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
                  <option value="">-- Select district --</option>
                  {districtsInState.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
            {modalLevel === "state" ? "Step 1" : "Step 2"} — Select {levelLabel} to Configure
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            {(["existing","custom"] as const).map(opt => (
              <button key={opt} onClick={() => setUseCustom(opt === "custom")}
                style={{ padding:"5px 14px", borderRadius:20, border:`1.5px solid ${useCustom===(opt==="custom")?levelColor:"#d1d5db"}`, background:useCustom===(opt==="custom")?levelBg:"#fff", color:useCustom===(opt==="custom")?levelColor:"#64748b", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                {opt === "existing" ? "Select existing" : "Enter name"}
              </button>
            ))}
          </div>
          {!useCustom ? (
            <select value={selLocation} onChange={e => setSelLocation(e.target.value)}
              style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
              <option value="">-- Select {levelLabel.toLowerCase()} --</option>
              {allLocations.map(l => {
                const lKey = modalLevel === "state"
                  ? buildConfigKey({ level: "state",    state: l,            district: "",              taluk: "" })
                  : modalLevel === "district"
                  ? buildConfigKey({ level: "district", state: selParentState, district: l,             taluk: "" })
                  : buildConfigKey({ level: "taluk",    state: selParentState, district: selParentDistrict, taluk: l });
                const hasCfg = localConfigs.some(c => buildConfigKey(c) === lKey && c.commodityRanges.length > 0);
                return <option key={l} value={l}>{l}{hasCfg ? " ✓" : ""}</option>;
              })}
            </select>
          ) : (
            <input type="text" value={customInput} onChange={e => setCustomInput(e.target.value)}
              placeholder={`e.g. ${modalLevel==="state"?"Karnataka":"Mandya"}…`}
              style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14, boxSizing:"border-box" }}/>
          )}
          {activeLocation && (
            <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCfg?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCfg?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCfg?ZONE_TEXT.green:"#64748b" }}>
              {currentCfg
                ? `✓ "${activeLocation}" has ${currentCfg.commodityRanges.length} commodity config(s) saved`
                : `No configs saved for "${activeLocation}" yet`}
            </div>
          )}
        </div>

        <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
            {modalLevel === "state" ? "Step 2" : "Step 3"} — Select Commodity
          </div>
          {allCommodities.length === 0 ? (
            <div style={{ color:"#94a3b8", fontSize:13 }}>No commodities found in data.</div>
          ) : (
            <>
              <select value={selCommodity} onChange={e => setSelCommodity(e.target.value)}
                style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:8, fontSize:14 }}>
                <option value="">-- Select commodity --</option>
                {allCommodities.map(c => (
                  <option key={c} value={c}>
                    {getCommodityIcon(c)} {c}
                    {currentCfg?.commodityRanges.find(r => norm(r.commodity) === norm(c)) ? " ✓" : ""}
                  </option>
                ))}
              </select>
              {selCommodity && activeLocation && (
                <div style={{ marginTop:10, fontSize:12, padding:"6px 12px", borderRadius:8, background:currentCombinationSaved?ZONE_BG.green:"#f8f9fb", border:`1px solid ${currentCombinationSaved?ZONE_BORDER.green:"#e5e7eb"}`, color:currentCombinationSaved?ZONE_TEXT.green:"#64748b" }}>
                  {currentCombinationSaved
                    ? `✓ Config exists for "${activeLocation}" + "${selCommodity}" — editing below`
                    : `No config for "${activeLocation}" + "${selCommodity}" — set ranges below`}
                </div>
              )}
            </>
          )}
        </div>

        {activeLocation && selCommodity && (
          <div style={{ background:"#f8f9fb", border:"1px solid #e5e7eb", borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#1a1a1a", marginBottom:14 }}>
              {modalLevel === "state" ? "Step 3" : "Step 4"} — Zone Ranges for{" "}
              <span style={{ color:levelColor }}>{activeLocation}</span> ×{" "}
              <span style={{ color:"#378ADD" }}>{getCommodityIcon(selCommodity)} {selCommodity}</span>
            </div>
            <ZoneRangeFields
              enabled={enabled} setEnabled={setEnabled}
              greenMin={greenMin} setGreenMin={setGreenMin} greenMax={greenMax} setGreenMax={setGreenMax}
              yellowMin={yellowMin} setYellowMin={setYellowMin} yellowMax={yellowMax} setYellowMax={setYellowMax}
              redMin={redMin} setRedMin={setRedMin} redMax={redMax} setRedMax={setRedMax}
            />
            {savedMsg && (
              <div style={{ marginBottom:12, padding:"8px 14px", background:ZONE_BG.green, border:`1px solid ${ZONE_BORDER.green}`, borderRadius:8, color:ZONE_TEXT.green, fontSize:13, fontWeight:600 }}>
                {savedMsg}
              </div>
            )}
            <div style={{ display:"flex", gap:12 }}>
              <button onClick={handleSaveAndStay}
                style={{ flex:1, padding:"10px 16px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
                Save "{activeLocation}" × "{selCommodity}"
              </button>
              <button onClick={handleRemove} disabled={!currentCombinationSaved}
                style={{ padding:"10px 16px", borderRadius:8, border:"1px solid #E24B4A", background:"#fff", color:currentCombinationSaved?"#E24B4A":"#ccc", cursor:currentCombinationSaved?"pointer":"not-allowed", fontWeight:600 }}>
                Remove
              </button>
            </div>
          </div>
        )}

        {savedRows.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:8, color:"#333" }}>Saved Configurations ({savedRows.length})</div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f1f5f9" }}>
                    <th style={{ padding:8, textAlign:"left" }}>{levelLabel}</th>
                    {modalLevel !== "state"    && <th style={{ padding:8, textAlign:"left" }}>State</th>}
                    {modalLevel === "taluk"    && <th style={{ padding:8, textAlign:"left" }}>District</th>}
                    <th style={{ padding:8, textAlign:"left" }}>Commodity</th>
                    <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.green }}>Green</th>
                    <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.yellow }}>Yellow</th>
                    <th style={{ padding:8, textAlign:"center", color:ZONE_TEXT.red }}>Red</th>
                    <th style={{ padding:8, textAlign:"center" }}>Status</th>
                    <th style={{ padding:8, textAlign:"center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {savedRows.map(({ cfg, cr }) => {
                    const locName = modalLevel==="state" ? cfg.state : modalLevel==="district" ? cfg.district : cfg.taluk;
                    const isActive = buildConfigKey(cfg) === activeKey && norm(cr.commodity) === norm(selCommodity);
                    return (
                      <tr key={`${buildConfigKey(cfg)}-${cr.commodity}`} style={{ borderBottom:"1px solid #e5e7eb", background:isActive?"#F0FDF4":"#fff" }}>
                        <td style={{ padding:8, fontWeight:600 }}>{levelIcon} {locName}</td>
                        {modalLevel !== "state"   && <td style={{ padding:8, color:"#64748b" }}>{cfg.state}</td>}
                        {modalLevel === "taluk"   && <td style={{ padding:8, color:"#64748b" }}>{cfg.district}</td>}
                        <td style={{ padding:8 }}>{getCommodityIcon(cr.commodity)} {cr.commodity}</td>
                        <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.green }}>{cr.ranges.green.min}–{cr.ranges.green.max===Infinity?"∞":cr.ranges.green.max}</td>
                        <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.yellow }}>{cr.ranges.yellow.min}–{cr.ranges.yellow.max===Infinity?"∞":cr.ranges.yellow.max}</td>
                        <td style={{ padding:8, textAlign:"center", fontSize:11, color:ZONE_TEXT.red }}>{cr.ranges.red.min}–{cr.ranges.red.max===Infinity?"∞":cr.ranges.red.max}</td>
                        <td style={{ padding:8, textAlign:"center" }}>
                          <span style={{ background:cr.enabled?"#EAF3DE":"#f1f5f9", color:cr.enabled?"#27500A":"#64748b", padding:"2px 8px", borderRadius:12, fontSize:10 }}>
                            {cr.enabled ? "Active" : "Off"}
                          </span>
                        </td>
                        <td style={{ padding:8, textAlign:"center" }}>
                          <button
                            onClick={() => {
                              setSelCommodity(cr.commodity);
                              if (!useCustom) {
                                if (modalLevel === "state")    setSelLocation(cfg.state);
                                if (modalLevel === "district") { setSelParentState(cfg.state); setSelLocation(cfg.district); }
                                if (modalLevel === "taluk")    { setSelParentState(cfg.state); setSelParentDistrict(cfg.district); setSelLocation(cfg.taluk); }
                              }
                            }}
                            style={{ fontSize:11, padding:"2px 8px", borderRadius:6, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer", color:levelColor }}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {savedRows.length === 0 && (
          <div style={{ padding:"16px", textAlign:"center", color:"#94a3b8", fontSize:13, background:"#f8f9fb", borderRadius:10, marginBottom:16 }}>
            No configurations saved yet. Select a {levelLabel.toLowerCase()} and commodity above to get started.
          </div>
        )}

        <div style={{ display:"flex", gap:12, justifyContent:"flex-end", borderTop:"1px solid #e5e7eb", paddingTop:16 }}>
          <button onClick={onClose} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #d1d5db", background:"#fff", cursor:"pointer" }}>Cancel</button>
          <button
            onClick={() => {
              const latest = (activeLocation && selCommodity) ? saveCombination(localConfigs) : localConfigs;
              onSave(latest);
            }}
            style={{ padding:"8px 20px", borderRadius:8, border:"none", background:levelColor, color:"#fff", cursor:"pointer", fontWeight:600 }}>
            Save All & Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Other sub-components ─────────────────────────────────────────────────────
function RoleBadge({ adminData }: { adminData: AdminData | null }) {
  if (!adminData) return null;
  const isAdmin = adminData.role === "admin";
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:isAdmin?"rgba(55,138,221,0.15)":"rgba(127,119,221,0.15)", border:`1px solid ${isAdmin?"#378ADD55":"#7F77DD55"}`, borderRadius:20, padding:"5px 14px 5px 10px", fontSize:12, fontWeight:600, color:isAdmin?"#378ADD":"#7F77DD" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:isAdmin?"#378ADD":"#7F77DD", display:"inline-block" }}/>
      {isAdmin ? "Administrator · All Locations" : `Subadmin · ${adminData.taluka || "Unknown"}`}
    </div>
  );
}
function RoleInfoBanner({ adminData }: { adminData: AdminData | null }) {
  if (!adminData) return null;
  const isAdmin = adminData.role === "admin";
  return (
    <div style={{ background:isAdmin?"#EFF6FF":"#F5F3FF", border:`1px solid ${isAdmin?"#BFDBFE":"#DDD6FE"}`, borderRadius:10, padding:"10px 16px", marginBottom:24, display:"flex", alignItems:"flex-start", gap:10, fontSize:13, color:isAdmin?"#1e40af":"#5b21b6" }}>
      <span style={{ width:18, height:18, borderRadius:"50%", background:isAdmin?"#BFDBFE":"#DDD6FE", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, marginTop:1, color:isAdmin?"#1d4ed8":"#6d28d9" }}>i</span>
      <div><strong>{isAdmin?"Administrator View":"Subadmin View"}:</strong>{" "}
        {isAdmin ? "You can manage zone ranges across all locations and view all postings." : <>You can only view postings from <strong style={{ color:"#6d28d9" }}>{adminData.taluka}</strong> taluka.</>}
      </div>
    </div>
  );
}

type ZoneFilter = Zone | "all";

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface MapTooltip {
  name: string;
  count: number;
  production: number;
  zone: Zone;
  x: number;
  y: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX 4: TALUK TILE PANEL — shown instead of map when a district is selected
// since no taluk-level GeoJSON is available
// ─────────────────────────────────────────────────────────────────────────────
function TalukTilePanel({
  title,
  subtitle,
  icon,
  accentColor,
  aggMap,
  activeZone,
  onZoneFilterChange,
  totalPostings,
  highlightName,
    levelLabel,

}: {
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  aggMap: Record<string, { count: number; production: number; zone: Zone }>;
  activeZone: ZoneFilter;
  onZoneFilterChange: (z: ZoneFilter) => void;
  totalPostings: number;
  highlightName?: string;
  levelLabel?: string;
}) {
  const zoneCounts = useMemo(() => {
    const c = { green: 0, yellow: 0, red: 0 };
    Object.values(aggMap).forEach(v => { c[v.zone]++; });
    return c;
  }, [aggMap]);

  const entries = useMemo(() => {
    return Object.entries(aggMap)
      .filter(([, v]) => activeZone === "all" || v.zone === activeZone)
      .sort((a, b) => b[1].production - a[1].production);
  }, [aggMap, activeZone]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="px-4 pt-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{icon}</span>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
          {highlightName && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }}
            >
              {highlightName}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">{subtitle}</p>
        {/* Zone filter pills */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {([
            { key: "all" as ZoneFilter,    label: "All",           bg: "#f1f5f9", color: "#475569" },
            { key: "green" as ZoneFilter,  label: `✓ ${zoneCounts.green}`,  bg: ZONE_BG.green,  color: ZONE_TEXT.green  },
            { key: "yellow" as ZoneFilter, label: `⚠ ${zoneCounts.yellow}`, bg: ZONE_BG.yellow, color: ZONE_TEXT.yellow },
            { key: "red" as ZoneFilter,    label: `✗ ${zoneCounts.red}`,    bg: ZONE_BG.red,    color: ZONE_TEXT.red    },
          ]).map(z => (
            <button
              key={z.key}
              onClick={() => onZoneFilterChange(z.key)}
              style={{
                background: activeZone === z.key ? z.bg : "#fff",
                color: activeZone === z.key ? z.color : "#94a3b8",
                border: `1.5px solid ${activeZone === z.key ? z.color : "#e2e8f0"}`,
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {z.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">
            {totalPostings} farmer{totalPostings !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Taluk tiles grid */}
      <div className="flex-1 p-3 overflow-y-auto" style={{ minHeight: 240, maxHeight: 340, background: "#f8fafc" }}>
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs font-medium">
               {Object.keys(aggMap).length === 0
  ? `No ${levelLabel || "item"} data`
  : `No ${levelLabel || "item"}s match filter`}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
            {entries.map(([name, data]) => (
              <div
                key={name}
                style={{
                  background: ZONE_BG[data.zone],
                  border: `1.5px solid ${ZONE_COLORS[data.zone]}44`,
                  borderRadius: 10,
                  padding: "8px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 5, marginBottom: 2,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: ZONE_COLORS[data.zone], display: "inline-block", flexShrink: 0 }}/>
                  <span style={{ fontSize: 11, fontWeight: 700, color: ZONE_TEXT[data.zone], wordBreak: "break-word", lineHeight: 1.3 }}>{name}</span>
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  {data.count} farmer{data.count !== 1 ? "s" : ""}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a" }}>
                  {data.production.toLocaleString()} units
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend footer */}
      <div className="px-4 py-2 border-t border-slate-100 flex gap-3 flex-wrap">
        {(["green", "yellow", "red"] as Zone[]).map(z => (
          <div key={z} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[z] }} />
            <span className="text-xs text-slate-500">{ZONE_LABEL[z]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE REACT-SIMPLE-MAPS PANEL
// ─────────────────────────────────────────────────────────────────────────────
interface MapPanelProps {
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  geoUrl: string;
  geoNameKey: string;
  geoFilterKey?: string;
  geoFilterValue?: string;
  aggMap: Record<string, { count: number; production: number; zone: Zone }>;
  center: [number, number];
  zoom: number;
  onRegionClick?: (name: string) => void;
  activeZone: ZoneFilter;
  onZoneFilterChange: (z: ZoneFilter) => void;
  highlightName?: string;
  totalPostings: number;
}

function MapPanel({
  title, subtitle, icon, accentColor,
  geoUrl, geoNameKey, geoFilterKey, geoFilterValue,
  aggMap, center, zoom,
  onRegionClick, activeZone, onZoneFilterChange,
  highlightName, totalPostings,
}: MapPanelProps) {
  const [tooltip, setTooltip] = useState<MapTooltip | null>(null);

  const zoneCounts = useMemo(() => {
    const c = { green: 0, yellow: 0, red: 0 };
    Object.values(aggMap).forEach(v => { c[v.zone]++; });
    return c;
  }, [aggMap]);

  // FIX 2 applied here: use lookupAggMap for fuzzy name matching
  const getGeoData = (rawName: string) => lookupAggMap(aggMap, rawName);

  const getGeoFill = (rawName: string): string => {
    const data = getGeoData(rawName);
    if (!data) return "#e2e8f0";
    if (activeZone !== "all" && data.zone !== activeZone) return "#f1f5f9";
    return ZONE_COLORS[data.zone];
  };

  const getGeoOpacity = (rawName: string): number => {
    const data = getGeoData(rawName);
    if (!data) return 0.4;
    if (activeZone !== "all" && data.zone !== activeZone) return 0.3;
    return 1;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="px-4 pt-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{icon}</span>
          <span className="font-bold text-slate-800 text-sm">{title}</span>
          {highlightName && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}44` }}
            >
              {highlightName}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">{subtitle}</p>
        {/* Zone filter pills */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {([
            { key: "all" as ZoneFilter,    label: "All",           bg: "#f1f5f9", color: "#475569" },
            { key: "green" as ZoneFilter,  label: `✓ ${zoneCounts.green}`,  bg: ZONE_BG.green,  color: ZONE_TEXT.green  },
            { key: "yellow" as ZoneFilter, label: `⚠ ${zoneCounts.yellow}`, bg: ZONE_BG.yellow, color: ZONE_TEXT.yellow },
            { key: "red" as ZoneFilter,    label: `✗ ${zoneCounts.red}`,    bg: ZONE_BG.red,    color: ZONE_TEXT.red    },
          ]).map(z => (
            <button
              key={z.key}
              onClick={() => onZoneFilterChange(z.key)}
              style={{
                background: activeZone === z.key ? z.bg : "#fff",
                color: activeZone === z.key ? z.color : "#94a3b8",
                border: `1.5px solid ${activeZone === z.key ? z.color : "#e2e8f0"}`,
                fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {z.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">
            {totalPostings} farmer{totalPostings !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1" style={{ minHeight: 240, background: "#f8fafc" }}>
        <ComposableMap
          projection="geoMercator"
          style={{ width: "100%", height: "100%", minHeight: 240 }}
          projectionConfig={{ center, scale: zoom }}
        >
          <ZoomableGroup center={center} zoom={1} minZoom={0.5} maxZoom={6}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies
                  .filter(geo => {
                    // FIX 3: use robust stateMatches() instead of simple norm() comparison
                    if (!geoFilterKey || !geoFilterValue) return true;
                    if (geoFilterValue === "__NONE__") return false;
                    const geoVal = geo.properties[geoFilterKey] as string;
                    return stateMatches(geoVal, geoFilterValue);
                  })
                  .map(geo => {
                    const rawName = geo.properties[geoNameKey] as string;
                    const geoData = getGeoData(rawName);
                    const fill    = getGeoFill(rawName);
                    const opacity = getGeoOpacity(rawName);

                    return (
                      <Geography
  key={geo.rsmKey}
  geography={geo}
  fill={fill}
  stroke="#64748b"
  strokeWidth={0.75}
  style={{
    default:  { outline: "none", fillOpacity: opacity, strokeOpacity: 1 },
    hover:    { outline: "none", fillOpacity: 1, strokeOpacity: 1, cursor: onRegionClick && geoData ? "pointer" : "default", filter: "brightness(1.1)" },
    pressed:  { outline: "none" },
  }}
  onClick={() => onRegionClick && geoData && onRegionClick(rawName)}
  onMouseEnter={e => {
                          if (geoData) {
                            setTooltip({
                              name:       rawName,
                              count:      geoData.count,
                              production: geoData.production,
                              zone:       geoData.zone,
                              x:          (e as unknown as MouseEvent).clientX,
                              y:          (e as unknown as MouseEvent).clientY,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* No-data overlay */}
        {Object.keys(aggMap).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <div className="text-2xl mb-1">🗺</div>
              <div className="text-xs font-medium">No data for current filter</div>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{ left: tooltip.x + 12, top: tooltip.y - 60, minWidth: 160 }}
          >
            <div className="rounded-xl px-3 py-2 text-xs shadow-xl" style={{ background: "#0f172a", color: "#f1f5f9" }}>
              <div className="font-bold mb-1">{tooltip.name}</div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Farmers</span>
                <span className="font-semibold">{tooltip.count.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Production</span>
                <span className="font-semibold">{tooltip.production.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4 mt-1">
                <span className="text-slate-400">Zone</span>
                <span className="font-bold" style={{ color: ZONE_COLORS[tooltip.zone] }}>
                  {ZONE_LABEL[tooltip.zone]}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend footer */}
      <div className="px-4 py-2 border-t border-slate-100 flex gap-3 flex-wrap">
        {(["green", "yellow", "red"] as Zone[]).map(z => (
          <div key={z} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: ZONE_COLORS[z] }} />
            <span className="text-xs text-slate-500">{ZONE_LABEL[z]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-xs text-slate-400">No data</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THREE-MAP HIERARCHICAL ZONE MAPS
// ─────────────────────────────────────────────────────────────────────────────
function HierarchicalZoneMap({
  allPostings,
  pageSelectedState,
  pageSelectedDistrict,
  pageSelectedTaluk,
}: {
  allPostings: Posting[];
  pageSelectedState: string;
  pageSelectedDistrict: string;
  pageSelectedTaluk: string;
}) {
  const [stateZoneFilter,    setStateZoneFilter]    = useState<ZoneFilter>("all");
  const [districtZoneFilter, setDistrictZoneFilter] = useState<ZoneFilter>("all");
  const [talukZoneFilter,    setTalukZoneFilter]    = useState<ZoneFilter>("all");
  const [villageZoneFilter,  setVillageZoneFilter]  = useState<ZoneFilter>("all");

  useEffect(() => { setDistrictZoneFilter("all"); }, [pageSelectedState]);
  useEffect(() => { setTalukZoneFilter("all"); },    [pageSelectedDistrict]);
  useEffect(() => { setVillageZoneFilter("all"); },  [pageSelectedTaluk]);

  // ── STATE-level aggregation ───────────────────────────────────────────────
  const stateAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
    const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
    allPostings.forEach(p => {
      const geoName = normalizeStateName(p.state);
      const key = norm(geoName);
      if (!key || key === "unknown") return;
      if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
      map[key].count++;
      map[key].production += p.production;
      map[key].zones.push(p.zone);
    });
    const result: Record<string, { count: number; production: number; zone: Zone }> = {};
    Object.entries(map).forEach(([k, v]) => {
      const zc = { green: 0, yellow: 0, red: 0 };
      v.zones.forEach(z => zc[z]++);
      const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
      result[k] = { count: v.count, production: v.production, zone };
    });
    return result;
  }, [allPostings]);

  // ── DISTRICT-level aggregation ────────────────────────────────────────────
  const districtAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
    if (!pageSelectedState) return {};
    const filtered = allPostings.filter(p =>
      norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState))
    );
    const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
    filtered.forEach(p => {
      const key = norm(p.district);
      if (!key || key === "—" || key === "unknown") return;
      if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
      map[key].count++;
      map[key].production += p.production;
      map[key].zones.push(p.zone);
    });
    const result: Record<string, { count: number; production: number; zone: Zone }> = {};
    Object.entries(map).forEach(([k, v]) => {
      const zc = { green: 0, yellow: 0, red: 0 };
      v.zones.forEach(z => zc[z]++);
      const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
      result[k] = { count: v.count, production: v.production, zone };
    });
    return result;
  }, [allPostings, pageSelectedState]);

  // ── TALUK-level aggregation (keyed by taluk name, for tile view) ──────────
  const talukAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
    if (!pageSelectedState) return {};
    let filtered = allPostings.filter(p =>
      norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState))
    );
    if (pageSelectedDistrict) {
      filtered = filtered.filter(p => norm(p.district) === norm(pageSelectedDistrict));
    }
    const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
    filtered.forEach(p => {
      const key = norm(p.taluk);
      if (!key || key === "—" || key === "unknown") return;
      if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
      map[key].count++;
      map[key].production += p.production;
      map[key].zones.push(p.zone);
    });
    const result: Record<string, { count: number; production: number; zone: Zone }> = {};
    Object.entries(map).forEach(([k, v]) => {
      const zc = { green: 0, yellow: 0, red: 0 };
      v.zones.forEach(z => zc[z]++);
      const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
      result[k] = { count: v.count, production: v.production, zone };
    });
    return result;
  }, [allPostings, pageSelectedState, pageSelectedDistrict]);

  // ── VILLAGE-level aggregation (only meaningful once state+district+taluk picked) ──
  const villageAggMap = useMemo<Record<string, { count: number; production: number; zone: Zone }>>(() => {
    if (!pageSelectedState || !pageSelectedDistrict || !pageSelectedTaluk) return {};
    const filtered = allPostings.filter(p =>
      norm(normalizeStateName(p.state)) === norm(normalizeStateName(pageSelectedState)) &&
      norm(p.district) === norm(pageSelectedDistrict) &&
      norm(p.taluk)    === norm(pageSelectedTaluk)
    );
    const map: Record<string, { count: number; production: number; zones: Zone[] }> = {};
    filtered.forEach(p => {
      const key = norm(p.village);
      if (!key || key === "—" || key === "unknown") return;
      if (!map[key]) map[key] = { count: 0, production: 0, zones: [] };
      map[key].count++;
      map[key].production += p.production;
      map[key].zones.push(p.zone);
    });
    const result: Record<string, { count: number; production: number; zone: Zone }> = {};
    Object.entries(map).forEach(([k, v]) => {
      const zc = { green: 0, yellow: 0, red: 0 };
      v.zones.forEach(z => zc[z]++);
      const zone = (Object.entries(zc).sort((a, b) => b[1] - a[1])[0][0]) as Zone;
      result[k] = { count: v.count, production: v.production, zone };
    });
    return result;
  }, [allPostings, pageSelectedState, pageSelectedDistrict, pageSelectedTaluk]);

  const totalStateFarmers    = useMemo(() => Object.values(stateAggMap).reduce((s, v) => s + v.count, 0),    [stateAggMap]);
  const totalDistrictFarmers = useMemo(() => Object.values(districtAggMap).reduce((s, v) => s + v.count, 0), [districtAggMap]);
  const totalTalukFarmers    = useMemo(() => Object.values(talukAggMap).reduce((s, v) => s + v.count, 0),    [talukAggMap]);
  const totalVillageFarmers  = useMemo(() => Object.values(villageAggMap).reduce((s, v) => s + v.count, 0),  [villageAggMap]);

  const INDIA_CENTER: [number, number] = [82.5, 22];
  const INDIA_ZOOM   = 800;

  const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
    "karnataka":         { center: [75.7, 14.5],  zoom: 2800 },
    "andhra pradesh":    { center: [79.5, 15.5],  zoom: 2200 },
    "telangana":         { center: [79.0, 17.5],  zoom: 3000 },
    "tamil nadu":        { center: [78.5, 11.0],  zoom: 2500 },
    "tamilnadu":         { center: [78.5, 11.0],  zoom: 2500 },
    "kerala":            { center: [76.3, 10.5],  zoom: 3000 },
    "maharashtra":       { center: [76.5, 19.0],  zoom: 1800 },
    "gujarat":           { center: [71.5, 22.5],  zoom: 2000 },
    "rajasthan":         { center: [74.0, 27.0],  zoom: 1500 },
    "madhya pradesh":    { center: [78.5, 23.5],  zoom: 1800 },
    "uttar pradesh":     { center: [80.5, 27.0],  zoom: 1800 },
    "bihar":             { center: [85.5, 25.5],  zoom: 3000 },
    "west bengal":       { center: [87.5, 23.0],  zoom: 2500 },
    "orissa":            { center: [84.0, 20.5],  zoom: 2500 },
    "odisha":            { center: [84.0, 20.5],  zoom: 2500 },
    "chhattisgarh":      { center: [81.5, 21.5],  zoom: 2400 },
    "jharkhand":         { center: [85.5, 23.5],  zoom: 2800 },
    "assam":             { center: [92.0, 26.5],  zoom: 2800 },
    "punjab":            { center: [75.5, 31.0],  zoom: 3500 },
    "haryana":           { center: [76.5, 29.5],  zoom: 3000 },
    "himachal pradesh":  { center: [77.0, 32.0],  zoom: 3000 },
    "uttaranchal":       { center: [79.5, 30.5],  zoom: 3200 },
    "uttarakhand":       { center: [79.5, 30.5],  zoom: 3200 },
    "goa":               { center: [74.1, 15.3],  zoom: 6000 },
    "delhi":             { center: [77.1, 28.7],  zoom: 8000 },
    "sikkim":            { center: [88.5, 27.5],  zoom: 5000 },
    "arunachal pradesh": { center: [94.7, 28.2],  zoom: 2000 },
    "nagaland":          { center: [94.5, 26.2],  zoom: 4000 },
    "manipur":           { center: [93.9, 24.7],  zoom: 4000 },
    "mizoram":           { center: [92.9, 23.2],  zoom: 4000 },
    "tripura":           { center: [91.9, 23.8],  zoom: 5000 },
    "meghalaya":         { center: [91.4, 25.5],  zoom: 4000 },
    "jammu and kashmir": { center: [75.3, 33.7],  zoom: 2000 },
  };

  const getStateCenterConfig = (stateName: string) => {
    const attempts = [norm(stateName), norm(normalizeStateName(stateName))];
    for (const k of attempts) {
      if (STATE_CENTERS[k]) return STATE_CENTERS[k];
    }
    return { center: INDIA_CENTER, zoom: INDIA_ZOOM };
  };

  const stateCenterConfig = pageSelectedState
    ? getStateCenterConfig(pageSelectedState)
    : { center: INDIA_CENTER, zoom: INDIA_ZOOM };

  const geoFilterStateValue = pageSelectedState
    ? normalizeStateName(pageSelectedState)
    : "__NONE__";

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-700">Production Zone Maps</span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">4 views • filter-aware</span>
        </div>
        {!pageSelectedState && (
          <span className="text-xs text-slate-400">← Select a State in the filter bar above to drill down into Districts, Taluks &amp; Villages</span>
        )}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>

        {/* PANEL 1 — State level */}
        <MapPanel
          title="State-Level Overview"
          subtitle="Farmer count & zone per state across India"
          icon="🗺"
          accentColor="#D85A30"
          geoUrl={INDIA_STATES_GEO}
          geoNameKey="NAME_1"
          aggMap={stateAggMap}
          center={INDIA_CENTER}
          zoom={INDIA_ZOOM}
          activeZone={stateZoneFilter}
          onZoneFilterChange={setStateZoneFilter}
          totalPostings={totalStateFarmers}
          highlightName={pageSelectedState || undefined}
        />

        {/* PANEL 2 — District level */}
        <MapPanel
          title={pageSelectedState ? `District View — ${pageSelectedState}` : "District View"}
          subtitle={
            pageSelectedState
              ? `Districts inside ${pageSelectedState} • farmer distribution`
              : "Select a state to see districts"
          }
          icon="🏙"
          accentColor="#378ADD"
          geoUrl={INDIA_DISTRICTS_GEO}
          geoNameKey="NAME_2"
          geoFilterKey="NAME_1"
          geoFilterValue={geoFilterStateValue}
          aggMap={pageSelectedState ? districtAggMap : {}}
          center={stateCenterConfig.center}
          zoom={stateCenterConfig.zoom}
          activeZone={districtZoneFilter}
          onZoneFilterChange={setDistrictZoneFilter}
          totalPostings={totalDistrictFarmers}
          highlightName={pageSelectedDistrict || undefined}
        />

        {/* PANEL 3 — Taluk level */}
        {pageSelectedDistrict ? (
          <TalukTilePanel
            title={`Taluk View — ${pageSelectedDistrict}`}
            subtitle={`Taluks inside ${pageSelectedDistrict} (coloured by zone)`}
            icon="🏛"
            accentColor="#7F77DD"
            levelLabel="taluk"
            aggMap={talukAggMap}
            activeZone={talukZoneFilter}
            onZoneFilterChange={setTalukZoneFilter}
            totalPostings={totalTalukFarmers}
            highlightName={pageSelectedDistrict}
          />
        ) : (
          <MapPanel
            title={pageSelectedState ? `Taluk View — ${pageSelectedState}` : "Taluk View"}
            subtitle={
              pageSelectedState
                ? `District-wise taluk rollup for ${pageSelectedState} — select a district for taluk detail`
                : "Select a state & district to see taluk breakdown"
            }
            icon="🏛"
            accentColor="#7F77DD"
            geoUrl={INDIA_DISTRICTS_GEO}
            geoNameKey="NAME_2"
            geoFilterKey="NAME_1"
            geoFilterValue={geoFilterStateValue}
            aggMap={pageSelectedState ? districtAggMap : {}}
            center={stateCenterConfig.center}
            zoom={stateCenterConfig.zoom}
            activeZone={talukZoneFilter}
            onZoneFilterChange={setTalukZoneFilter}
            totalPostings={totalTalukFarmers}
            highlightName={undefined}
          />
        )}

        {/* PANEL 4 — Village level (tile grid, only once a taluk is selected) */}
        {pageSelectedTaluk ? (
          <TalukTilePanel
            title={`Village View — ${pageSelectedTaluk}`}
            subtitle={`Villages inside ${pageSelectedTaluk} (coloured by zone)`}
            icon="🏘"
            accentColor="#D85A30"
            levelLabel="village"
            aggMap={villageAggMap}
            activeZone={villageZoneFilter}
            onZoneFilterChange={setVillageZoneFilter}
            totalPostings={totalVillageFarmers}
            highlightName={pageSelectedTaluk}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col items-center justify-center" style={{ minHeight: 240 }}>
            <div className="text-center text-slate-400 px-6">
              <div className="text-2xl mb-1">🏘</div>
              <div className="text-xs font-medium">Select a Taluk in the filter bar above to see villages</div>
            </div>
          </div>
        )}
      </div>

      {/* Legend row */}
      <div className="mt-4 flex flex-wrap gap-4 items-center px-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Zone Legend:</span>
        {(["green", "yellow", "red"] as Zone[]).map(z => (
          <div key={z} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: ZONE_COLORS[z] }} />
            <span className="text-xs text-slate-600">{ZONE_LABEL[z]}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-300" />
          <span className="text-xs text-slate-400">No data / out of filter</span>
        </div>
        <span className="ml-auto text-xs text-slate-400">Powered by react-simple-maps • GeoJSON © Natural Earth</span>
      </div>
    </div>
  );
}

// ─── Monthly Trend Table ──────────────────────────────────────────────────────
function MonthlyTrendTable({ rows, months, locationLabel }: { rows: CommodityRow[]; months: string[]; locationLabel: string }) {
  if (!rows.length) return <div style={{ padding:24, textAlign:"center", color:"#94a3b8" }}>No commodity data</div>;
  const shortMonth = (m:string) => { const p=m.split(" "); return `${p[0]} ${(p[1]||"").slice(2)}`; };
  return (
    <div style={{ overflowX:"auto" }}>
      <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:12 }}>
        Monthly Performance Trend {locationLabel && `(${locationLabel})`}
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
        <thead>
          <tr style={{ background:"#f8f9fb" }}>
            <th style={{ padding:"10px 12px", textAlign:"left", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:120 }}>Commodity</th>
            <th style={{ padding:"10px 8px", textAlign:"right", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Area (Acres)</th>
            {months.map(m=>(
              <th key={m} style={{ padding:"10px 6px", textAlign:"center", fontWeight:600, color:"#64748b", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap", minWidth:52 }}>{shortMonth(m)}</th>
            ))}
            <th style={{ padding:"10px 8px", textAlign:"center", fontWeight:700, color:"#333", borderBottom:"2px solid #e5e7eb", whiteSpace:"nowrap" }}>Trend<br/><span style={{ fontSize:10, fontWeight:400, color:"#94a3b8" }}>(Last 3 Mo)</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri) => {
            const sc = STATUS_COLORS[row.status];
            const sparkValues = months.map(m => {
              const t = row.monthlyTrend[m] || "stable";
              const sm: Record<TrendValue,number> = { up:5, slightly_up:4, stable:3, down:2, sharp_decline:1 };
              return sm[t] ?? 3;
            });
            return (
              <tr key={row.commodity} style={{ background:ri%2===0?"#fff":"#fafafa", borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:600, whiteSpace:"nowrap" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:16 }}>{getCommodityIcon(row.commodity)}</span>{row.commodity}
                  </span>
                </td>
                <td style={{ padding:"10px 8px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500 }}>{row.totalArea.toLocaleString()}</td>
                {months.map(m=>(
                  <td key={m} style={{ padding:"10px 6px", textAlign:"center" }}>
                    <TrendCell trend={row.monthlyTrend[m]||"stable"} color={sc.dot}/>
                  </td>
                ))}
                <td style={{ padding:"10px 8px", textAlign:"center" }}><Sparkline values={sparkValues} color={sc.dot}/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginTop:14, padding:"10px 0", borderTop:"1px solid #f3f4f6", fontSize:12, color:"#64748b" }}>
        <span style={{ fontWeight:600, color:"#333" }}>Trend Indication:</span>
        {[
          {icon:"↗",label:"Improving",color:"#1D9E75"},
          {icon:"↗",label:"Slightly Improving",color:"#4A90A4"},
          {icon:"→",label:"Stable",color:"#888"},
          {icon:"↓",label:"Declining",color:"#EF9F27"},
          {icon:"↘",label:"Sharp Decline",color:"#E24B4A"},
        ].map(t=>(
          <span key={t.label} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ color:t.color, fontWeight:700, fontSize:14 }}>{t.icon}</span>
            <span>{t.label}</span>
          </span>
        ))}
      </div>
      <div style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>
        Note: Area (Acres) is the cultivated area under the respective commodity during the survey month.
      </div>
    </div>
  );
}

function CommodityStatusPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
  const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
  return (
    <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px", height:"100%" }}>
      <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>Commodity Wise Status</div>
      {locationLabel && <div style={{ fontSize:12, color:"#64748b", marginBottom:16 }}>({locationLabel})</div>}
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"#f8f9fb" }}>
            <th style={{ padding:"8px 6px", textAlign:"left",   fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Commodity</th>
            <th style={{ padding:"8px 6px", textAlign:"right",  fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Area</th>
            <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Status</th>
            <th style={{ padding:"8px 6px", textAlign:"center", fontWeight:600, color:"#555", fontSize:12, borderBottom:"2px solid #e5e7eb" }}>Ind.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const sc = STATUS_COLORS[row.status];
            return (
              <tr key={row.commodity} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"9px 6px", fontWeight:500 }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                    <span>{getCommodityIcon(row.commodity)}</span>
                    <span style={{ fontSize:13 }}>{row.commodity}</span>
                  </span>
                </td>
                <td style={{ padding:"9px 6px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500, fontSize:13 }}>{row.totalArea.toLocaleString()}</td>
                <td style={{ padding:"9px 6px", textAlign:"center" }}>
                  <span style={{ background:sc.bg, color:sc.text, border:`1px solid ${sc.border}`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{row.status}</span>
                </td>
                <td style={{ padding:"9px 6px", textAlign:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:32, height:4, borderRadius:2, background:sc.dot }}/>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ background:"#f8f9fb", borderTop:"2px solid #e5e7eb" }}>
            <td colSpan={2} style={{ padding:"10px 6px", fontWeight:700, fontSize:13 }}>
              Total Area (Acres) <span style={{ marginLeft:8, color:"#1a1a1a" }}>{totalArea.toLocaleString()}</span>
            </td>
            <td colSpan={2}/>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function SummaryPanel({ rows, locationLabel }: { rows: CommodityRow[]; locationLabel: string }) {
  const groups = {
    "Good/High": rows.filter(r=>r.status==="Good/High"),
    "Moderate":  rows.filter(r=>r.status==="Moderate"),
    "Low/Poor":  rows.filter(r=>r.status==="Low/Poor"),
  } as const;
  const totalArea = rows.reduce((s,r)=>s+r.totalArea, 0);
  return (
    <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px" }}>
      <div style={{ fontSize:14, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>
        Summary {locationLabel && `(${locationLabel})`}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:20, marginTop:16 }}>
        {(["Good/High","Moderate","Low/Poor"] as const).map(status => {
          const sc   = STATUS_COLORS[status];
          const grp  = groups[status];
          const area = grp.reduce((s,r)=>s+r.totalArea, 0);
          return (
            <div key={status} style={{ borderLeft:`3px solid ${sc.dot}`, paddingLeft:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontWeight:700, color:sc.text, fontSize:13 }}>{status}</span>
              </div>
              <div style={{ fontSize:28, fontWeight:800, color:sc.dot }}>{grp.length}</div>
              <div style={{ fontSize:12, color:"#64748b" }}>Commodities</div>
              <div style={{ fontSize:18, fontWeight:700, marginTop:8, color:"#1a1a1a" }}>
                {area.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
              </div>
            </div>
          );
        })}
        <div style={{ borderLeft:"1px solid #e5e7eb", paddingLeft:14 }}>
          <div style={{ fontSize:12, color:"#64748b", marginBottom:6 }}>Total Commodities</div>
          <div style={{ fontSize:28, fontWeight:800, color:"#1a1a1a" }}>{rows.length}</div>
          <div style={{ fontSize:12, color:"#64748b", marginTop:12 }}>Total Area Surveyed</div>
          <div style={{ fontSize:18, fontWeight:700, color:"#1a1a1a" }}>
            {totalArea.toLocaleString()} <span style={{ fontSize:12, fontWeight:400, color:"#64748b" }}>Acres</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop:16, fontSize:11, color:"#94a3b8", borderTop:"1px solid #e5e7eb", paddingTop:10, display:"flex", gap:20, flexWrap:"wrap" }}>
        <span>📅 Survey Period: Jun 2023 – May 2024</span>
        <span>🗄 Source: Agriculture Department</span>
        <span>🔄 Last Updated: 20 May 2024</span>
      </div>
    </div>
  );
}

function LocationFilterBar({
  selectedState, selectedDistrict, selectedTaluk, selectedVillage,
  onSelectState, onSelectDistrict, onSelectTaluk, onSelectVillage,
  states, districts, taluks, villages,
  surveyMonths, selectedMonth, onSelectMonth,
}: {
  selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
  onSelectState:(s:string)=>void; onSelectDistrict:(s:string)=>void; onSelectTaluk:(s:string)=>void; onSelectVillage:(s:string)=>void;
  states:string[]; districts:string[]; taluks:string[]; villages:string[];
  surveyMonths:string[]; selectedMonth:string; onSelectMonth:(m:string)=>void;
}) {
  const selStyle = (active:boolean): React.CSSProperties => ({
    padding:"8px 14px", borderRadius:8, border:"1px solid #d1d5db", fontSize:13,
    background:active?"#F0FDF4":"#fff", fontWeight:active?600:400,
    color:active?"#166534":"#374151", cursor:"pointer", minWidth:140,
  });
  return (
    <div style={{ background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:12, padding:"14px 20px", marginBottom:20, display:"flex", flexWrap:"wrap", gap:12, alignItems:"flex-end" }}>
      {[
        { label:"📍 State",    value:selectedState,    onChange:onSelectState,    options:states,    placeholder:"All States",    disabled:false           },
        { label:"🏙 District", value:selectedDistrict, onChange:onSelectDistrict, options:districts, placeholder:"All Districts", disabled:!selectedState   },
        { label:"🏛 Taluk",    value:selectedTaluk,    onChange:onSelectTaluk,    options:taluks,    placeholder:"All Taluks",    disabled:!selectedDistrict},
        { label:"🏘 Village",  value:selectedVillage,  onChange:onSelectVillage,  options:villages,  placeholder:"All Villages",  disabled:!selectedTaluk  },
      ].map(f => (
        <div key={f.label} style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>{f.label}</label>
          <select value={f.value} onChange={e=>f.onChange(e.target.value)} disabled={f.disabled}
            style={{ ...selStyle(!!f.value), opacity:f.disabled?0.5:1 }}>
            <option value="">{f.placeholder}</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
      {surveyMonths.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:4, marginLeft:"auto" }}>
          <label style={{ fontSize:11, fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.05em" }}>📅 Survey Month</label>
          <select value={selectedMonth} onChange={e=>onSelectMonth(e.target.value)} style={selStyle(!!selectedMonth)}>
            <option value="">All Months</option>
            {surveyMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

function LocationBreadcrumb({
  selectedState, selectedDistrict, selectedTaluk, selectedVillage, onReset,
}: {
  selectedState:string; selectedDistrict:string; selectedTaluk:string; selectedVillage:string;
  onReset:(level:"state"|"district"|"taluk"|"village"|"all")=>void;
}) {
  const parts = [
    selectedState    && { label:selectedState,    level:"state"   as const },
    selectedDistrict && { label:selectedDistrict, level:"district"as const },
    selectedTaluk    && { label:selectedTaluk,    level:"taluk"   as const },
    selectedVillage  && { label:selectedVillage,  level:"village" as const },
  ].filter(Boolean) as { label:string; level:"state"|"district"|"taluk"|"village" }[];
  if (!parts.length) return null;
  return (
    <div style={{ background:"#EFF6FF", border:"1px solid #BFDBFE", borderRadius:8, padding:"8px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", fontSize:13 }}>
      <span style={{ color:"#64748b", fontWeight:500 }}>Viewing:</span>
      <button onClick={()=>onReset("all")} style={{ background:"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:500, fontSize:13, padding:"0 4px" }}>All</button>
      {parts.map((p,i) => (
        <span key={p.level} style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ color:"#94a3b8" }}>›</span>
          <button onClick={()=>onReset(p.level)}
            style={{ background:i===parts.length-1?"#BFDBFE":"none", border:"none", cursor:"pointer", color:"#1e40af", fontWeight:i===parts.length-1?700:500, fontSize:13, padding:"2px 8px", borderRadius:12 }}>
            {p.label}
          </button>
        </span>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function FarmDashboard() {
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState<string|null>(null);
  const [search,           setSearch]           = useState("");
  const [filterType,       setFilterType]       = useState("");
  const [filterCommodity,  setFilterCommodity]  = useState("");
  const [page,             setPage]             = useState(1);
  const [adminData,        setAdminData]        = useState<AdminData|null>(null);
  const [adminLoading,     setAdminLoading]     = useState(true);
  const [configsLoading,   setConfigsLoading]   = useState(true);
  const [allConfigs,       setAllConfigs]       = useState<ZoneConfig[]>([]);
  const [openModal,        setOpenModal]        = useState<null|"state"|"district"|"taluk">(null);
  const [rawPostings,      setRawPostings]      = useState<Omit<Posting,"zone">[]>([]);
  const [selectedState,    setSelectedState]    = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluk,    setSelectedTaluk]    = useState("");
  const [selectedVillage,  setSelectedVillage]  = useState("");
  const [selectedMonth,    setSelectedMonth]    = useState("");
  const PAGE_SIZE = 10;

  const configsMap = useMemo<Record<string, ZoneConfig>>(() => {
    const map: Record<string, ZoneConfig> = {};
    allConfigs.forEach(c => {
      const restored: ZoneConfig = {
        ...c,
        commodityRanges: (c.commodityRanges ?? []).map(cr => ({
          ...cr,
          ranges: {
            green:  { ...cr.ranges.green,  max: cr.ranges.green.max  === null || cr.ranges.green.max  > 1e15 ? Infinity : cr.ranges.green.max  },
            yellow: { ...cr.ranges.yellow, max: cr.ranges.yellow.max === null || cr.ranges.yellow.max > 1e15 ? Infinity : cr.ranges.yellow.max },
            red:    { ...cr.ranges.red,    max: cr.ranges.red.max    === null || cr.ranges.red.max    > 1e15 ? Infinity : cr.ranges.red.max    },
          },
        })),
      };
      map[buildConfigKey(c)] = restored;
    });
    return map;
  }, [allConfigs]);

  const allCommodities = useMemo(() => {
    const s = new Set(rawPostings.map(r => r.commodity).filter(v => v && v !== "Unknown"));
    return Array.from(s).sort();
  }, [rawPostings]);

  useEffect(() => {
    (async () => {
      setConfigsLoading(true);
      try {
        const res  = await fetch("/api/taluk-zone-configs");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const sanitized = (data.configs || []).map((c: ZoneConfig) => ({
          level:           c.level    ?? "taluk",
          state:           c.state    ?? "",
          district:        c.district ?? "",
          taluk:           c.taluk    ?? "",
          commodityRanges: Array.isArray(c.commodityRanges) ? c.commodityRanges : [],
        }));
        setAllConfigs(sanitized);
      } catch { setAllConfigs([]); }
      finally { setConfigsLoading(false); }
    })();
  }, []);

  const handleSaveConfigs = useCallback(async (configs: ZoneConfig[]) => {
    try {
      const serialisable = JSON.parse(JSON.stringify(configs, (_, v) =>
        v === Infinity ? 999999999 : v
      ));
      const res  = await fetch("/api/taluk-zone-configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: serialisable }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setAllConfigs(configs);
      setOpenModal(null);
      alert("Configurations saved successfully");
    } catch(e) { console.error(e); alert("Failed to save configurations"); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const session = await getAdminSessionAction();
        if (session?.admin) {
          setAdminData({ taluka:session.admin.taluka??"", role:session.admin.role??"subadmin", name:session.admin.name, email:session.admin.email });
        }
      } catch(e) { console.error(e); }
      finally { setAdminLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (adminLoading) return;
    (async () => {
      try {
        setLoading(true);
        const firstRes  = await fetch("/api/postings?page=1&limit=10");
        if (!firstRes.ok) throw new Error("Failed to fetch /api/postings");
        const firstJson = await firstRes.json();
        const total     = firstJson.total ?? firstJson.stats?.totalCrops ?? 0;
        const pageSize  = firstJson.limit ?? 10;
        const pageCount = Math.ceil(total / pageSize);
        const allPages: unknown[][] = [firstJson.data ?? []];
        if (pageCount > 1) {
          const pageNums = Array.from({ length:pageCount-1 }, (_,i)=>i+2);
          const results  = await Promise.all(pageNums.map(pg =>
            fetch(`/api/postings?page=${pg}&limit=${pageSize}`)
              .then(r=>r.ok?r.json():{data:[]})
              .then(j=>(j.data??[]) as unknown[])
          ));
          allPages.push(...results);
        }
        const source: unknown[] = allPages.flat();
        const enriched: Omit<Posting,"zone">[] = source.map((p: unknown) => {
          const posting = p as {
            _id:string; farmerId:string; farmingType:string; seedType:string; acres:number;
            commodity?:string; sowingDate?:string; createdAt?:string;
            tracking?:{cropName?:string};
            farmer?:{
              personalInfo?:{taluk?:string;taluka?:string;district?:string;state?:string;address?:string;villageGramaPanchayat?:string};
              farmLocation?:{latitude?:string;longitude?:string};
              taluka?:string; district?:string; state?:string;
            };
          };
          const pi         = posting.farmer?.personalInfo ?? {};
          const fl         = posting.farmer?.farmLocation  ?? {};
          const commodity  = (posting.commodity||posting.tracking?.cropName||posting.seedType||"Unknown").trim();
          const production = getProduction(posting.acres??0, posting.farmingType??"regular");
          const taluk      = (pi.taluk??pi.taluka??posting.farmer?.taluka??"Unknown").trim();
          const district   = (pi.district??posting.farmer?.district??"—").trim();
          const state      = (pi.state??posting.farmer?.state??"Unknown").trim();
          const village    = (pi.villageGramaPanchayat||pi.address||"—").trim() || "—";
          const month      = monthFromDate(posting.sowingDate||posting.createdAt||"");
          return {
            id:posting._id, farmerId:posting.farmerId,
            farmingType:(posting.farmingType??"regular").toLowerCase(),
            seedType:posting.seedType, acres:posting.acres??0,
            production, taluk, district, state, village, commodity,
            lat:parseFloat(fl.latitude??"")||null, lng:parseFloat(fl.longitude??"")||null, month,
          };
        });
        setRawPostings(enriched);
      } catch(e) { setError(e instanceof Error ? e.message : String(e)); }
      finally { setLoading(false); }
    })();
  }, [adminLoading]);

  useEffect(() => {
    if (adminData?.role==="subadmin" && adminData.taluka && !selectedTaluk)
      setSelectedTaluk(adminData.taluka);
  }, [adminData]);

  const allPostings = useMemo<Posting[]>(() =>
    rawPostings.map(p => ({
      ...p,
      zone: getZoneForPosting(p.production, p.commodity, p.taluk, p.district, p.state, configsMap),
    })),
    [rawPostings, configsMap]
  );

  const states = useMemo(() => {
    const s = new Set(allPostings.map(r=>r.state).filter(v=>v&&v!=="Unknown"));
    return Array.from(s).sort();
  }, [allPostings]);

  const districts = useMemo(() => {
    const base = selectedState ? allPostings.filter(r=>r.state===selectedState) : allPostings;
    const s = new Set(base.map(r=>r.district).filter(v=>v&&v!=="—"));
    return Array.from(s).sort();
  }, [allPostings, selectedState]);

  const taluks = useMemo(() => {
    let b = allPostings;
    if (selectedState)    b = b.filter(r=>r.state===selectedState);
    if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
    const s = new Set(b.map(r=>r.taluk).filter(v=>v&&v!=="Unknown"));
    return Array.from(s).sort();
  }, [allPostings, selectedState, selectedDistrict]);

  const villages = useMemo(() => {
    let b = allPostings;
    if (selectedState)    b = b.filter(r=>r.state===selectedState);
    if (selectedDistrict) b = b.filter(r=>r.district===selectedDistrict);
    if (selectedTaluk)    b = b.filter(r=>r.taluk===selectedTaluk);
    const s = new Set(b.map(r=>r.village).filter(v=>v&&v!=="—"));
    return Array.from(s).sort();
  }, [allPostings, selectedState, selectedDistrict, selectedTaluk]);

  const surveyMonths = useMemo(() => {
    const s = new Set(allPostings.map(r=>r.month).filter(Boolean));
    if (s.size === 0) return SURVEY_MONTHS;
    return Array.from(s).sort((a,b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime());
  }, [allPostings]);

  const locationFiltered = useMemo(() => {
    let data = allPostings;
    if (adminData?.role==="subadmin" && adminData.taluka)
      data = data.filter(r => norm(r.taluk) === norm(adminData.taluka));
    if (selectedState)    data = data.filter(r=>r.state===selectedState);
    if (selectedDistrict) data = data.filter(r=>r.district===selectedDistrict);
    if (selectedTaluk)    data = data.filter(r=>r.taluk===selectedTaluk);
    if (selectedVillage)  data = data.filter(r=>r.village===selectedVillage);
    if (selectedMonth)    data = data.filter(r=>r.month===selectedMonth);
    return data;
  }, [allPostings, adminData, selectedState, selectedDistrict, selectedTaluk, selectedVillage, selectedMonth]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return locationFiltered.filter(r => {
      const matchSearch = !s ||
        r.farmerId.toLowerCase().includes(s) ||
        r.farmingType.toLowerCase().includes(s) ||
        r.commodity.toLowerCase().includes(s) ||
        r.taluk.toLowerCase().includes(s) ||
        r.district.toLowerCase().includes(s) ||
        r.village.toLowerCase().includes(s);
      return matchSearch && (!filterType||r.farmingType===filterType) && (!filterCommodity||r.commodity===filterCommodity);
    });
  }, [locationFiltered, search, filterType, filterCommodity]);

  const commodityRows = useMemo<CommodityRow[]>(() => {
    const map: Record<string,{totalArea:number;monthProds:Record<string,number[]>;totalProduction:number;zones:Zone[]}> = {};
    filtered.forEach(r => {
      if (!map[r.commodity]) map[r.commodity] = { totalArea:0, monthProds:{}, totalProduction:0, zones:[] };
      map[r.commodity].totalArea       += r.acres;
      map[r.commodity].totalProduction += r.production;
      map[r.commodity].zones.push(r.zone);
      const mKey = r.month || "Unknown";
      if (!map[r.commodity].monthProds[mKey]) map[r.commodity].monthProds[mKey] = [];
      map[r.commodity].monthProds[mKey].push(r.production);
    });
    const activeMonths = surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS;
    return Object.entries(map).map(([commodity, data]) => {
      const zoneCounts = { green:0, yellow:0, red:0 };
      data.zones.forEach(z => zoneCounts[z]++);
      const dominantZone = (Object.entries(zoneCounts).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
      const monthlyTrend: Record<string,TrendValue> = {};
      activeMonths.forEach(m => {
        const vals = data.monthProds[m];
        if (!vals?.length) { monthlyTrend[m]="stable"; return; }
        const avg        = vals.reduce((a,b)=>a+b,0) / vals.length;
        const overallVals = Object.values(data.monthProds).flat();
        const overallAvg  = overallVals.reduce((a,b)=>a+b,0) / overallVals.length;
        const pct         = overallAvg > 0 ? ((avg-overallAvg)/overallAvg)*100 : 0;
        if (pct>10)       monthlyTrend[m]="up";
        else if (pct>3)   monthlyTrend[m]="slightly_up";
        else if (pct<-15) monthlyTrend[m]="sharp_decline";
        else if (pct<-3)  monthlyTrend[m]="down";
        else              monthlyTrend[m]="stable";
      });
      const allProdByMonth = activeMonths.map(m => { const vals=data.monthProds[m]||[]; return vals.reduce((a,b)=>a+b,0); });
      return { commodity, totalArea:data.totalArea, status:zoneToStatus(dominantZone), monthlyTrend, lastThreeMonthTrend:deriveTrend(allProdByMonth) };
    }).sort((a,b) => b.totalArea - a.totalArea);
  }, [filtered, surveyMonths]);

  const aggTableData = useMemo<TalukAgg[]>(() => {
    const groupField: keyof Posting =
      selectedDistrict ? "taluk"    :
      selectedState    ? "district" :
                         "state";
    const map: Record<string,{production:number;count:number;zones:Zone[]}> = {};
    filtered.forEach(r => {
      const key = (r[groupField] as string) || "";
      if (!key || key==="Unknown" || key==="—") return;
      if (!map[key]) map[key] = { production:0, count:0, zones:[] };
      map[key].production += r.production;
      map[key].count      += 1;
      map[key].zones.push(r.zone);
    });
    return Object.entries(map).map(([name, data]) => {
      const zc: Record<Zone,number> = { green:0, yellow:0, red:0 };
      data.zones.forEach(z => zc[z]++);
      const zone = (Object.entries(zc).sort((a,b)=>b[1]-a[1])[0][0]) as Zone;
      return { name, production:data.production, count:data.count, zone };
    }).sort((a,b) => b.production - a.production);
  }, [filtered, selectedState, selectedDistrict]);

  const configCount = (level:"state"|"district"|"taluk") =>
    allConfigs.filter(c=>c.level===level).reduce((sum,c)=>sum+(c.commodityRanges?.length??0), 0);

  const totalProduction = useMemo(() => filtered.reduce((s,r)=>s+r.production, 0), [filtered]);
  const totalAcres      = useMemo(() => filtered.reduce((s,r)=>s+r.acres, 0),      [filtered]);
  const uniqueFarmers   = useMemo(() => new Set(filtered.map(r=>r.farmerId)).size,  [filtered]);
  const farmingTypes    = useMemo(() => [...new Set(allPostings.map(r=>r.farmingType))].filter(Boolean).sort(), [allPostings]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const aggLevelLabel =
    selectedDistrict ? "Taluk"    :
    selectedState    ? "District" :
                       "State";

  const locationLabel =
    selectedVillage  ? `${selectedVillage} Village`    :
    selectedTaluk    ? `${selectedTaluk} Taluk`        :
    selectedDistrict ? `${selectedDistrict} District`  :
    selectedState    ? selectedState                   : "";

  const handleSelectState    = (s:string) => { setSelectedState(s); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
  const handleSelectDistrict = (d:string) => { setSelectedDistrict(d); setSelectedTaluk(""); setSelectedVillage(""); setPage(1); };
  const handleSelectTaluk    = (t:string) => { setSelectedTaluk(t); setSelectedVillage(""); setPage(1); };
  const handleBreadcrumbReset = (level:"state"|"district"|"taluk"|"village"|"all") => {
    if      (level==="all")      { setSelectedState(""); setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
    else if (level==="state")    { setSelectedDistrict(""); setSelectedTaluk(""); setSelectedVillage(""); }
    else if (level==="district") { setSelectedTaluk(""); setSelectedVillage(""); }
    else if (level==="taluk")    { setSelectedVillage(""); }
    setPage(1);
  };

  const activeMonths = selectedMonth
    ? [selectedMonth]
    : (surveyMonths.length > 0 ? surveyMonths : SURVEY_MONTHS);

  const s = {
    container:    { fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:"#f8f9fb", minHeight:"100vh", padding:"0 0 40px" } as React.CSSProperties,
    header:       { background:"#0f172a", color:"#fff", padding:"20px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" as const, gap:12 } as React.CSSProperties,
    body:         { maxWidth:1500, margin:"0 auto", padding:"28px 24px" } as React.CSSProperties,
    section:      { background:"#fff", border:"0.5px solid #e5e7eb", borderRadius:14, padding:"20px 24px", marginBottom:24 } as React.CSSProperties,
    sectionTitle: { fontSize:15, fontWeight:700, color:"#1a1a1a", marginBottom:16, letterSpacing:"-0.01em" } as React.CSSProperties,
    statsGrid:    { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:14, marginBottom:24 } as React.CSSProperties,
    table:        { width:"100%", borderCollapse:"collapse" as const, fontSize:13 } as React.CSSProperties,
    th:           { textAlign:"left" as const, padding:"10px 12px", fontSize:11, fontWeight:600, color:"#888", textTransform:"uppercase" as const, letterSpacing:"0.05em", borderBottom:"1px solid #f3f4f6", whiteSpace:"nowrap" as const } as React.CSSProperties,
    td:           { padding:"10px 12px", borderBottom:"0.5px solid #f3f4f6", color:"#1a1a1a" } as React.CSSProperties,
    input:        { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, outline:"none", background:"#fff", color:"#1a1a1a", minWidth:200 } as React.CSSProperties,
    select:       { border:"0.5px solid #d1d5db", borderRadius:8, padding:"8px 14px", fontSize:13, background:"#fff", color:"#1a1a1a", cursor:"pointer" } as React.CSSProperties,
  };

  if (adminLoading || loading || configsLoading) {
    return (
      <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", color:"#64748b" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⟳</div>
          <div>{adminLoading?"Checking permissions…":configsLoading?"Loading configurations…":"Loading farm data…"}</div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ ...s.container, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ background:"#FCEBEB", border:"1px solid #E24B4A44", borderRadius:12, padding:"20px 28px", color:"#791F1F", maxWidth:400 }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* ── Header ── */}
      <div style={s.header}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em", margin:0 }}>Today Crops — Your Daily Harvest</h1>
          <p style={{ fontSize:13, color:"#94a3b8", marginTop:2, marginBottom:0 }}>Agriculture Produce Survey · Commodity &amp; Location wise Status with Monthly Trend and Area (Acres)</p>
          {locationLabel && <p style={{ fontSize:12, color:"#60a5fa", marginTop:4, marginBottom:0 }}>📍 {locationLabel} · {filtered.length} postings</p>}
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <RoleBadge adminData={adminData}/>
            <div style={{ display:"flex", gap:12, fontSize:12, fontWeight:600 }}>
              {(["green","yellow","red"] as Zone[]).map(z => (
                <span key={z} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ width:12, height:4, borderRadius:2, background:ZONE_COLORS[z], display:"inline-block" }}/>
                  <span style={{ color:ZONE_COLORS[z] }}>{ZONE_LABEL[z]}</span>
                </span>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <input style={s.input} placeholder="Search farmer, crop, village…" value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}/>
            <select style={s.select} value={filterType} onChange={e=>{ setFilterType(e.target.value); setPage(1); }}>
              <option value="">All farming types</option>
              {farmingTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select style={s.select} value={filterCommodity} onChange={e=>{ setFilterCommodity(e.target.value); setPage(1); }}>
              <option value="">All commodities</option>
              {allCommodities.map(c => <option key={c} value={c}>{getCommodityIcon(c)} {c}</option>)}
            </select>
            {adminData?.role==="admin" && (
              <div style={{ display:"flex", gap:8 }}>
                {([
                  { level:"state"    as const, icon:"🗺", label:"State Zones",    color:"#D85A30", bg:"#FFF3EE", bd:"#FDBA74" },
                  { level:"district" as const, icon:"🏙", label:"District Zones", color:"#378ADD", bg:"#EFF6FF", bd:"#BFDBFE" },
                  { level:"taluk"    as const, icon:"🏛", label:"Taluk Zones",    color:"#7F77DD", bg:"#F5F3FF", bd:"#DDD6FE" },
                ]).map(btn => {
                  const count = configCount(btn.level);
                  return (
                    <button key={btn.level} onClick={() => setOpenModal(btn.level)}
                      style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${btn.bd}`, background:btn.bg, color:btn.color, cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6 }}>
                      {btn.icon} {btn.label}
                      {count>0 && <span style={{ background:btn.color, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{count}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {(configCount("state")+configCount("district")+configCount("taluk")) > 0 && (
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {(["state","district","taluk"] as const).map(level => {
                const count = configCount(level);
                if (!count) return null;
                const colors = { state:{c:"#D85A30",bg:"#FFF3EE",bd:"#FDBA74"}, district:{c:"#378ADD",bg:"#EFF6FF",bd:"#BFDBFE"}, taluk:{c:"#7F77DD",bg:"#F5F3FF",bd:"#DDD6FE"} };
                const clr = colors[level];
                return (
                  <div key={level} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:clr.c, background:clr.bg, border:`1px solid ${clr.bd}`, borderRadius:20, padding:"3px 10px" }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:clr.c, display:"inline-block" }}/>
                    {count} {level} override{count!==1?"s":""} active
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={s.body}>
        <RoleInfoBanner adminData={adminData}/>

        {allConfigs.length > 0 && (
          <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#5b21b6" }}>⚙ Zone overrides active:</span>
            {(["state","district","taluk"] as const).map(level => {
              const cfgs = allConfigs.filter(c=>c.level===level);
              if (!cfgs.length) return null;
              const colors = { state:"#D85A30", district:"#378ADD", taluk:"#7F77DD" };
              return cfgs.map(cfg => {
                const locName = level==="state" ? cfg.state : level==="district" ? cfg.district : cfg.taluk;
                return (
                  <span key={buildConfigKey(cfg)} style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#fff", border:"1px solid #DDD6FE", borderRadius:20, padding:"2px 10px", fontSize:12, color:colors[level] }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:colors[level], display:"inline-block" }}/>
                    {level}: {locName}
                    <span style={{ color:"#94a3b8", fontSize:11 }}>({cfg.commodityRanges.length} crop{cfg.commodityRanges.length!==1?"s":""})</span>
                  </span>
                );
              });
            })}
          </div>
        )}

        <LocationFilterBar
          selectedState={selectedState} selectedDistrict={selectedDistrict}
          selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
          onSelectState={handleSelectState} onSelectDistrict={handleSelectDistrict}
          onSelectTaluk={handleSelectTaluk} onSelectVillage={v=>{ setSelectedVillage(v); setPage(1); }}
          states={states} districts={districts} taluks={taluks} villages={villages}
          surveyMonths={surveyMonths} selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth}
        />

        <LocationBreadcrumb
          selectedState={selectedState} selectedDistrict={selectedDistrict}
          selectedTaluk={selectedTaluk} selectedVillage={selectedVillage}
          onReset={handleBreadcrumbReset}
        />

        {/* Stats */}
        <div style={s.statsGrid}>
          <StatCard label="Total Postings"   value={filtered.length.toLocaleString()}               accent="#378ADD"/>
          <StatCard label="Unique Farmers"   value={uniqueFarmers}                                   accent="#7F77DD"/>
          <StatCard label="Total Acres"      value={totalAcres.toLocaleString()}                     accent="#1D9E75"/>
          <StatCard label="Total Production" value={`${(totalProduction/1000).toFixed(1)}k`}         accent="#D85A30"/>
          <StatCard label="Good / High"      value={filtered.filter(r=>r.zone==="green").length}     accent="#1D9E75"/>
          <StatCard label="Moderate"         value={filtered.filter(r=>r.zone==="yellow").length}    accent="#EF9F27"/>
          <StatCard label="Low / Poor"       value={filtered.filter(r=>r.zone==="red").length}       accent="#E24B4A"/>
          <StatCard label="Commodities"      value={new Set(filtered.map(r=>r.commodity)).size}      accent="#4A90A4"/>
        </div>

        {/* Trend + Commodity status */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:24, marginBottom:24, alignItems:"start" }}>
          <div style={s.section}><MonthlyTrendTable rows={commodityRows} months={activeMonths} locationLabel={locationLabel}/></div>
          <CommodityStatusPanel rows={commodityRows} locationLabel={locationLabel}/>
        </div>

        <SummaryPanel rows={commodityRows} locationLabel={locationLabel}/>

        {/* Charts + Aggregation table */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))", gap:24, margin:"24px 0" }}>
          <div style={s.section}>
            <div style={s.sectionTitle}>Production by Farming Type</div>
            <BarChart data={[...filtered.reduce((m,r)=>{
              if(!m.has(r.farmingType)) m.set(r.farmingType,{type:r.farmingType,production:0});
              m.get(r.farmingType)!.production+=r.production;
              return m;
            },new Map<string,ChartEntry>()).values()].sort((a,b)=>b.production-a.production)}/>
          </div>
          <div style={s.section}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
              <div style={s.sectionTitle}>{aggLevelLabel}-Level Aggregation</div>
            </div>
            <div style={{ overflowY:"auto", maxHeight:280 }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>{aggLevelLabel}</th>
                    <th style={s.th}>Postings</th>
                    <th style={{ ...s.th, textAlign:"right" }}>Total Production</th>
                    <th style={{ ...s.th, textAlign:"center" }}>Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {aggTableData.map(item => (
                    <tr key={item.name}>
                      <td style={s.td}>{item.name}</td>
                      <td style={{ ...s.td, color:"#64748b" }}>{item.count}</td>
                      <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{item.production.toLocaleString()}</td>
                      <td style={{ ...s.td, textAlign:"center" }}><ZoneBadge zone={item.zone}/></td>
                    </tr>
                  ))}
                  {aggTableData.length===0 && (
                    <tr><td colSpan={4} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"24px 0" }}>No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── THREE-PANEL ZONE MAP ── */}
        {/* ── FOUR-PANEL ZONE MAP ── */}
        <div style={s.section}>
          <HierarchicalZoneMap
            allPostings={allPostings}
            pageSelectedState={selectedState}
            pageSelectedDistrict={selectedDistrict}
            pageSelectedTaluk={selectedTaluk}
          />
        </div>

        {/* Postings table */}
        <div style={s.section}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
            <div style={s.sectionTitle}>
              Postings Table
              {locationLabel && <span style={{ fontSize:13, fontWeight:400, color:"#6d28d9", marginLeft:8 }}>({locationLabel})</span>}
            </div>
            <span style={{ fontSize:13, color:"#94a3b8" }}>{filtered.length} results · Page {page} of {totalPages||1}</span>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {(["Farmer ID","Commodity","Farming Type","Seed Type","Village","Taluk","District","State","Month","Acres","Production","Zone"] as const).map(h => (
                    <th key={h} style={["Production","Acres"].includes(h)?{...s.th,textAlign:"right"}:s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r,i) => {
                  const stateKey2 = buildConfigKey({ level:"state",    state:r.state, district:"",        taluk:"" });
                  const distKey   = buildConfigKey({ level:"district", state:r.state, district:r.district, taluk:"" });
                  const talukKey  = buildConfigKey({ level:"taluk",    state:r.state, district:r.district, taluk:r.taluk });
                  const overrideLevel = configsMap[talukKey]?"taluk":configsMap[distKey]?"district":configsMap[stateKey2]?"state":null;
                  return (
                    <tr key={r.id} style={{ background:i%2===0?"#fafafa":"#fff" }}>
                      <td style={{ ...s.td, fontWeight:600, color:"#1e40af", fontFamily:"monospace" }}>{r.farmerId}</td>
                      <td style={s.td}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                          <span style={{ width:8, height:8, borderRadius:"50%", background:getCommodityColor(r.commodity), display:"inline-block" }}/>
                          <span>{getCommodityIcon(r.commodity)}</span>
                          {r.commodity}
                          {overrideLevel && (
                            <span title={`${overrideLevel}-level zone override`}
                              style={{ fontSize:9, background:overrideLevel==="taluk"?"#F5F3FF":overrideLevel==="district"?"#EFF6FF":"#FFF3EE", color:overrideLevel==="taluk"?"#7F77DD":overrideLevel==="district"?"#378ADD":"#D85A30", border:`1px solid ${overrideLevel==="taluk"?"#DDD6FE":overrideLevel==="district"?"#BFDBFE":"#FDBA74"}`, borderRadius:8, padding:"0 5px", fontWeight:700 }}>
                              {overrideLevel.toUpperCase()[0]}
                            </span>
                          )}
                        </span>
                      </td>
                      <td style={{ ...s.td, textTransform:"capitalize" }}>{r.farmingType}</td>
                      <td style={{ ...s.td, color:"#64748b" }}>{r.seedType||"—"}</td>
                      <td style={s.td}>{r.village}</td>
                      <td style={s.td}>{r.taluk}</td>
                      <td style={{ ...s.td, color:"#64748b" }}>{r.district}</td>
                      <td style={{ ...s.td, color:"#64748b" }}>{r.state}</td>
                      <td style={{ ...s.td, color:"#64748b", whiteSpace:"nowrap" }}>{r.month||"—"}</td>
                      <td style={{ ...s.td, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{r.acres.toLocaleString()}</td>
                      <td style={{ ...s.td, textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{r.production.toLocaleString()}</td>
                      <td style={s.td}><ZoneBadge zone={r.zone}/></td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr><td colSpan={12} style={{ ...s.td, textAlign:"center", color:"#94a3b8", padding:"32px 0" }}>No postings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20, flexWrap:"wrap" }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===1?"not-allowed":"pointer", fontSize:13, color:page===1?"#ccc":"#374151" }}>
                ← Prev
              </button>
              {Array.from({length:Math.min(totalPages,7)},(_,i)=>i+1).map(pg => (
                <button key={pg} onClick={()=>setPage(pg)}
                  style={{ padding:"6px 12px", borderRadius:7, border:`0.5px solid ${pg===page?"#378ADD":"#d1d5db"}`, background:pg===page?"#378ADD":"#fff", color:pg===page?"#fff":"#374151", cursor:"pointer", fontSize:13, fontWeight:pg===page?600:400 }}>
                  {pg}
                </button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ padding:"6px 16px", borderRadius:7, border:"0.5px solid #d1d5db", background:"#fff", cursor:page===totalPages?"not-allowed":"pointer", fontSize:13, color:page===totalPages?"#ccc":"#374151" }}>
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Zone Manager Modal */}
      {openModal && (
        <ZoneRangeManager
          modalLevel={openModal}
          configs={allConfigs}
          availableStates={states}
          allPostings={allPostings}
          allCommodities={allCommodities}
          onSave={handleSaveConfigs}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}
