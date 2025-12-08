
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function useUserSession(confirm = false) {
  useEffect(() => {
    if (!confirm) return;

    Cookies.set("lastVisit", new Date().toISOString(), { expires: 7 });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          Cookies.set("userLocation", JSON.stringify(coords), { expires: 7 });
        },
        (err) => {
          Cookies.set("userLocation", "denied", { expires: 7 });
        }
      );
    } else {
      Cookies.set("userLocation", "not_supported", { expires: 7 });
    }
  }, [confirm]);
}
