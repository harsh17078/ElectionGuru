import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { MapPin, Search, Navigation, Loader2 } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#255763" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#283d6a" }] },
];

interface BoothResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const libraries: ("places")[] = ["places"];

export default function BoothPage() {
  const { t } = useTranslation();
  const [location, setLocation] = useState("");
  const [searched, setSearched] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [booths, setBooths] = useState<BoothResult[]>([]);
  const [selectedBooth, setSelectedBooth] = useState<BoothResult | null>(null);
  const [searching, setSearching] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !mapRef.current) return;

    setSearching(true);
    setSearched(true);

    // Use Geocoder to find the location
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const loc = results[0].geometry.location;
        const center = { lat: loc.lat(), lng: loc.lng() };
        setMapCenter(center);
        mapRef.current?.panTo(center);
        mapRef.current?.setZoom(13);

        // Search with multiple queries for better coverage
        const service = new google.maps.places.PlacesService(mapRef.current!);
        const searchQueries = [
          `polling booth near ${location}`,
          `government school near ${location}`,
          `community hall near ${location}`,
          `collectorate OR tehsil office near ${location}`,
        ];

        const allResults: BoothResult[] = [];
        let completedSearches = 0;

        searchQueries.forEach((query) => {
          const request: google.maps.places.TextSearchRequest = {
            query,
            location: loc,
            radius: 10000,
          };

          service.textSearch(request, (places, placesStatus) => {
            completedSearches++;

            if (placesStatus === google.maps.places.PlacesServiceStatus.OK && places) {
              places.slice(0, 5).forEach((p) => {
                const lat = p.geometry?.location?.lat() || 0;
                const lng = p.geometry?.location?.lng() || 0;
                // Avoid duplicates by checking coordinates
                const isDuplicate = allResults.some(
                  (r) => Math.abs(r.lat - lat) < 0.0001 && Math.abs(r.lng - lng) < 0.0001
                );
                if (!isDuplicate) {
                  allResults.push({
                    name: p.name || "Polling Station",
                    address: p.formatted_address || "",
                    lat,
                    lng,
                  });
                }
              });
            }

            // When all searches complete, update state
            if (completedSearches === searchQueries.length) {
              setSearching(false);
              setBooths(allResults.slice(0, 12));
            }
          });
        });
      } else {
        setSearching(false);
        setBooths([]);
      }
    });
  };

  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-destructive">Failed to load Google Maps. Please check your API key.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3">
          <span className="gradient-text">{t("booth_page.title")}</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">{t("booth_page.subtitle")}</p>
      </motion.div>

      {/* Search */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSearch}
        className="flex items-center gap-3 p-2 rounded-2xl bg-card border border-border/60 shadow-lg max-w-xl mx-auto mb-10"
      >
        <div className="pl-3">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t("booth_page.search")}
          className="flex-1 bg-transparent outline-none text-sm py-2"
        />
        <button
          type="submit"
          disabled={!isLoaded || searching}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : t("booth_page.find")}
        </button>
      </motion.form>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden border border-border/60 bg-card"
      >
        {isLoaded ? (
          <div>
            <div className="h-[300px] sm:h-[450px]">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={searched ? 14 : 5}
              onLoad={onMapLoad}
              options={{
                styles: darkMapStyle,
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {booths.map((booth, i) => (
                <Marker
                  key={i}
                  position={{ lat: booth.lat, lng: booth.lng }}
                  onClick={() => setSelectedBooth(booth)}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
                  }}
                />
              ))}

              {selectedBooth && (
                <InfoWindow
                  position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
                  onCloseClick={() => setSelectedBooth(null)}
                >
                  <div style={{ color: "#000", maxWidth: 200 }}>
                    <h4 style={{ fontWeight: "bold", marginBottom: 4 }}>{selectedBooth.name}</h4>
                    <p style={{ fontSize: 12 }}>{selectedBooth.address}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
            </div>

            {/* Results list */}
            {searched && (
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary" />
                  {searching ? "Searching..." : `Found ${booths.length} locations near`}{" "}
                  <span className="text-primary">{location}</span>
                </h3>

                {booths.length > 0 ? (
                  <div className="space-y-3">
                    {booths.map((booth, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        onClick={() => {
                          setSelectedBooth(booth);
                          mapRef.current?.panTo({ lat: booth.lat, lng: booth.lng });
                          mapRef.current?.setZoom(16);
                        }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/40 cursor-pointer hover:border-primary/40 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trigreen to-emerald-500 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booth.name}</p>
                          <p className="text-xs text-muted-foreground">{booth.address}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  !searching && (
                    <p className="text-sm text-muted-foreground">No results found. Try a different location.</p>
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </motion.div>

      {/* Useful links */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Voter Helpline App", url: "https://play.google.com/store/apps/details?id=com.eci.citizen", desc: "Official ECI app" },
          { label: "NVSP Portal", url: "https://nvsp.in", desc: "National Voter Service" },
          { label: "Know Your Candidate", url: "https://affidavit.eci.gov.in", desc: "Candidate affidavits" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:shadow-lg transition-all text-center"
          >
            <p className="font-semibold text-sm">{link.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
          </a>
        ))}
      </motion.div>
    </div>
  );
}
