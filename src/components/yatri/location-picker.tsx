import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

import { LocateFixed, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

type Coordinates = { lat: number; lng: number };

export function LocationPicker({
  value,
  onChange,
}: {
  value: Coordinates;
  onChange: (coordinates: Coordinates) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const observerRef = useRef<ResizeObserver | null>(null);

  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  onChangeRef.current = onChange;

  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;
    void import("leaflet").then((module) => {
      if (disposed || !containerRef.current) return;
      const L = module.default;
      map = L.map(containerRef.current).setView([value.lat, value.lng], 14);
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const markerIcon = L.divIcon({
        className: "",
        html: '<span style="display:grid;place-items:center;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#ca3d32;border:3px solid #f4f1ea;box-shadow:0 2px 8px rgba(34,40,49,.28)"><span style="width:8px;height:8px;border-radius:50%;background:#f4f1ea"></span></span>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
      const marker = L.marker([value.lat, value.lng], { draggable: true, icon: markerIcon }).addTo(map);
      markerRef.current = marker;
      const setPoint = (lat: number, lng: number) => {
        marker.setLatLng([lat, lng]);
        onChangeRef.current({ lat, lng });
      };
      map.on("click", (event) => setPoint(event.latlng.lat, event.latlng.lng));
      marker.on("dragend", () => {
        const point = marker.getLatLng();
        setPoint(point.lat, point.lng);
      });
      window.setTimeout(() => map?.invalidateSize(), 100);
      window.setTimeout(() => map?.invalidateSize(), 600);
      if (containerRef.current && typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(() => map?.invalidateSize());
        observer.observe(containerRef.current);
        observerRef.current = observer;
      }
    });
    return () => {
      disposed = true;
      observerRef.current?.disconnect();
      observerRef.current = null;
      map?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);


  useEffect(() => {
    markerRef.current?.setLatLng([value.lat, value.lng]);
    mapRef.current?.setView([value.lat, value.lng], Math.max(mapRef.current.getZoom(), 14));
  }, [value.lat, value.lng]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Current location is not available in this browser.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({ lat: coords.latitude, lng: coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Location access was not allowed. Choose the point on the map instead.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Exact business location</p>
          <p className="text-muted-foreground text-xs">Use your location, click the map, or drag the pin.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={useCurrentLocation} disabled={locating}>
          {locating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
          Use current location
        </Button>
      </div>
      <div ref={containerRef} className="h-72 overflow-hidden rounded-md border" aria-label="Choose business location on map" />
      <p className="text-muted-foreground flex items-center gap-2 text-xs">
        <MapPin className="size-3.5" /> {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
      </p>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}