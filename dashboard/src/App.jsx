
import { useEffect, useMemo, useState } from "react";
import { BarChart } from "@tremor/react";





function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.8-.6a8 8 0 0 1-1.7 1l-.3 1.9h-2.8l-.3-1.9a8 8 0 0 1-1.7-1l-1.8.6-1.4-2.4L7.1 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.8.6a8 8 0 0 1 1.7-1l.3-1.9h2.8l.3 1.9a8 8 0 0 1 1.7 1l1.8-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" transform="translate(-1 -1) scale(1.08)" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M4 17v4h16v-4" /></>,
  };

  return <svg {...common}>{paths[name] || paths.activity}</svg>;
}

function SidebarLink({ icon, children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon name={icon} size={18} />
      {children}
    </button>
  );
}

function KpiCard({ label, value, subtitle, icon, accent, trend }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className={`absolute left-0 top-0 h-1 w-full ${accent}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 h-9 text-3xl font-bold tracking-tight text-slate-900">
            {" "}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${accent} bg-opacity-10`}>
          <span className={accent.replace("bg-", "text-")}>
            <Icon name={icon} size={23} />
          </span>
        </div>
      </div>
      <div className="mt-4 h-6" />
    </div>
  );
}
function SourceBadge({ source }) {
  const styles = {
    GitHub: "bg-slate-900 text-white",
    IDE: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    Slack: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
        styles[source] || "bg-slate-100 text-slate-700"
      }`}
    >
      {source}
    </span>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All sources");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadActivities = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/realtime/activities?limit=100"
        );

        if (!response.ok) {
          throw new Error(`Backend returned HTTP ${response.status}`);
        }

        const data = await response.json();

        const mappedEvents = (data.activities || []).map((item) => {
          const timestamp = item.timestamp ? new Date(item.timestamp) : null;

          return {
            id: item.event_id,
            user: item.tool || "Unknown tool",
            project: item.workspace_name || "Unknown workspace",
            type: (item.event_type || "activity").replaceAll("_", " "),
            source: item.source || "IDE",
            time:
              timestamp && !Number.isNaN(timestamp.getTime())
                ? timestamp.toISOString().slice(11, 19)
                : "—",
            status: "Received",
          };
        });

        if (!cancelled) {
          setLiveEvents([]);
        }
      } catch (error) {
        console.error("Could not load backend activities:", error);
      }
    };

    loadActivities();

    const intervalId = window.setInterval(loadActivities, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredEvents = useMemo(() => {
    return liveEvents.filter((event) => {
      const matchesSearch = [
        event.id,
        event.user,
        event.project,
        event.type,
        event.source,
      ].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );

      const matchesSource =
        sourceFilter === "All sources" || event.source === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [search, sourceFilter, liveEvents]);

  const uniqueEventIds = useMemo(
    () => new Set(liveEvents.map((event) => event.id).filter(Boolean)).size,
    [liveEvents]
  );

  const sourceNames = useMemo(
    () => [...new Set(liveEvents.map((event) => event.source).filter(Boolean))].sort(),
    [liveEvents]
  );

  const activityData = useMemo(() => {
    const grouped = new Map();

    liveEvents.forEach((event) => {
      const time =
        event.time && event.time !== "—" ? event.time.slice(0, 5) : "Unknown";

      if (!grouped.has(time)) {
        const row = { time };
        sourceNames.forEach((source) => {
          row[source] = 0;
        });
        grouped.set(time, row);
      }

      const row = grouped.get(time);
      row[event.source] = (row[event.source] || 0) + 1;
    });

    return Array.from(grouped.values()).sort((a, b) =>
      a.time.localeCompare(b.time)
    );
  }, [liveEvents, sourceNames]);

  const typeData = useMemo(() => {
    const counts = new Map();

    liveEvents.forEach((event) => {
      const type = event.type || "Unknown";
      counts.set(type, (counts.get(type) || 0) + 1);
    });

    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [liveEvents]);
  const navigation = [
    { name: "Overview", icon: "grid" },
    { name: "Events", icon: "activity" },
    { name: "Data Quality", icon: "shield" },
    { name: "Data Sources", icon: "layers" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {mobileMenu && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#101827] text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-950/40">
            <Icon name="activity" size={25} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight">CogniStream</p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-slate-400">
              EVENT INTELLIGENCE
            </p>
          </div>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <SidebarLink
                key={item.name}
                icon={item.icon}
                active={activePage === item.name}
                onClick={() => {
                  setActivePage(item.name);
                  setMobileMenu(false);
                }}
              >
                {item.name}
              </SidebarLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Workspace
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              
            </p>
          </div>

          <button
            onClick={() => setActivePage("Settings")}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <Icon name="settings" size={18} />
            Settings
          </button>

          <p className="px-3 pb-2 pt-3 text-[11px] text-slate-600">
            CogniStream ┬╖ Week 2 Project
          </p>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label="Open navigation"
                onClick={() => setMobileMenu(true)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              >
                <Icon name="menu" />
              </button>

              <div className="min-w-0">
                <p className="text-xs text-slate-500">Workspace / Analytics</p>
                <p className="truncate text-sm font-semibold text-slate-900">
                  {activePage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                System ready
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 text-sm font-bold text-indigo-800 ring-2 ring-white">
                CS
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] space-y-7 px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <Icon name="activity" size={14} />
                EVENT MONITORING
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Analytics overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Monitor event activity, data quality, and source distribution from one workspace.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 shadow-sm sm:self-auto">
              <Icon name="clock" size={16} />
              <span>Demo dataset ┬╖ Oct 13, 2026</span>
            </div>
          </section>

          {activePage !== "Overview" && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
              <strong>{activePage}</strong> is selected. This demo keeps the overview visible while the other sections are being developed.
            </div>
          )}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Key performance indicators
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  
                </p>
              </div>
              <span className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="Total Events"
                value={liveEvents.length}
                subtitle="Records loaded from API"
                icon="database"
                accent="bg-blue-600"
                trend="Live API"
              />
              <KpiCard
                label="Unique Event IDs"
                value={uniqueEventIds}
                subtitle="Unique IDs in loaded records"
                icon="layers"
                accent="bg-violet-600"
                trend="Calculated"
              />
              <KpiCard
                label="Schema Validation"
                value="N/A"
                subtitle="API does not provide validation results"
                icon="shield"
                accent="bg-emerald-600"
                trend="Not reported"
              />
              <KpiCard
                label="Data Sources"
                value={sourceNames.length}
                subtitle="Sources found in API records"
                icon="activity"
                accent="bg-amber-500"
                trend="Calculated"
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Event activity
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    
                  </p>
                </div>
                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  
                </span>
              </div>

              <div className="mt-4 h-64">
                <BarChart
                  className="h-full"
                  data={activityData}
                  index="time"
                  categories={sourceNames}
                  colors={["cyan", "purple", "orange"]}
                  stack={false}
                  showLegend
                  showGridLines={false}
                  showAnimation
                  yAxisWidth={35}
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-1">
              <h2 className="text-base font-bold text-slate-900">Event types</h2>
              <p className="mt-1 text-sm text-slate-500">
                
              </p>

              <div className="mt-5 space-y-5">
                {typeData.map((item, index) => {
                  const percentage = liveEvents.length ? (item.count / liveEvents.length) * 100 : 0;

                  return (
                    <div key={item.name}>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-sm text-slate-600">
                          {item.name}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            ["bg-blue-500", "bg-violet-500", "bg-amber-500"][index]
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">
                  DATA QUALITY NOTE
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Six sample events are available in the table. KPI values and chart summaries are illustrative demo metrics.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm xl:col-span-2">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Recent events
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icon name="search" size={16} />
                    </span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search events..."
                      aria-label="Search events"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 sm:w-48"
                    />
                  </div>

                  <select
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value)}
                    aria-label="Filter by source"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  >
                    <option>All sources</option>
                    {sourceNames.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead>
                    <tr className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3.5 font-semibold">Event</th>
                      <th className="px-5 py-3.5 font-semibold">
                        Project / User
                      </th>
                      <th className="px-5 py-3.5 font-semibold">Source</th>
                      <th className="px-5 py-3.5 font-semibold">
                        Time (UTC)
                      </th>
                      <th className="px-5 py-3.5 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="transition hover:bg-blue-50/40"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-slate-800">
                            {event.type}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-slate-400">
                            {event.id}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {event.project}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {event.user}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <SourceBadge source={event.source} />
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-slate-500">
                          {event.time}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredEvents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center">
                          <p className="text-sm font-semibold text-slate-700">
                            No matching events
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Try another search or source filter.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                <p className="text-xs text-slate-500">
                  Showing {filteredEvents.length} of {liveEvents.length} API records
                </p>
                <span className="text-xs font-medium text-slate-400">
                  
                </span>
              </div>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center">
            <p>┬⌐ 2026 CogniStream ┬╖ Event Analytics Dashboard</p>
            <p>React ┬╖ Tremor ┬╖ Tailwind CSS</p>
          </footer>
        </div>
      </main>
    </div>
  );
}





