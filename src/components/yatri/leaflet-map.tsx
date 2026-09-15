import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Vendor, VendorCategory } from "@/lib/yatri-data";

export type RoutePath = { coords: [number, number][]; from: [number, number] } | null;

const pinColor: Record<VendorCategory, string> = {
  Hotel: "#1f3a5f",
  Restaurant: "#b4762a",
  "Cloud Kitchen": "#b4762a",
  Medical: "#2f6b4f",
  Mechanic: "#5b6472",
  Transport: "#5b6472",
  Activity: "#1f3a5f",
  Emergency: "#a13b2f",
};

function pinIcon(vendor: Vendor, active: boolean) {
  const color = pinColor[vendor.category];
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:${
      active ? 30 : 24
    }px;height:${active ? 30 : 24}px;border-radius:3px;background:${color};color:#fff;
      font:600 11px/1 'Source Sans 3',sans-serif;box-shadow:0 0 0 3px rgba(255,255,255,.9);">
      ${vendor.category.slice(0, 1)}</span>`,
    iconSize: [active ? 30 : 24, active ? 30 : 24],
    iconAnchor: [active ? 15 : 12, active ? 15 : 12],
  });
}

/**
 * Real interactive map built on OpenStreetMap tiles (no API key required).
 * Routes come from the public OSRM demo router.
 */
export default function LeafletMap({
  vendors,
  selectedId,
  onSelect,
  route,
  className,
}: {
  vendors: Vendor[];
  selectedId?: string | undefined;
  onSelect: (vendor: Vendor) => void;
  route?: RoutePath;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeRef = useRef<L.Polyline | null>(null);
  const startRef = useRef<L.CircleMarker | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView([26.9124, 75.7873], 12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = vendors.map((v) => {
      const marker = L.marker([v.lat, v.lng], { icon: pinIcon(v, v.id === selectedId), title: v.name })
        .addTo(map)
        .bindTooltip(v.name, { direction: "top", offset: [0, -14] });
      marker.on("click", () => selectRef.current(v));
      return marker;
    });
    if (vendors.length && !route) {
      map.fitBounds(L.latLngBounds(vendors.map((v) => [v.lat, v.lng] as [number, number])).pad(0.25), {
        maxZoom: 14,
      });
    }
  }, [vendors, selectedId, route]);

  // Route line
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    routeRef.current?.remove();
    startRef.current?.remove();
    routeRef.current = null;
    startRef.current = null;
    if (!route) return;
    routeRef.current = L.polyline(route.coords, { color: "#1f3a5f", weight: 5, opacity: 0.85 }).addTo(map);
    startRef.current = L.circleMarker(route.from, {
      radius: 7,
      color: "#2f6b4f",
      fillColor: "#2f6b4f",
      fillOpacity: 1,
    })
      .addTo(map)
      .bindTooltip("Start", { direction: "top" });
    map.fitBounds(routeRef.current.getBounds().pad(0.2));
  }, [route]);

  return <div ref={containerRef} className={className} aria-label="Map of services" />;
}
