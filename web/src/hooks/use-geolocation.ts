import { useLocationActions, useLocationStore } from "@/stores/location-store";
import { useEffect } from "react";

const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export function useGeolocation() {
  const { city } = useLocationStore();
  const { setLoading, setLocation, setError } = useLocationActions();

  useEffect(() => {
    // Eğer konum bilgisi zaten store'da varsa veya API anahtarı yoksa, işlemi başlatma
    if (city || !API_KEY) {
      if (!API_KEY) {
        // Bu hatayı sadece geliştirme ortamında göster
        if (import.meta.env.DEV) {
          console.error("OpenCage API anahtarı bulunamadı. Lütfen .env dosyasını kontrol edin.");
        }
      }
      return;
    }

    const getLocation = () => {
      if (!navigator.geolocation) {
        setError("Tarayıcınız konum özelliğini desteklemiyor.");
        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}&language=tr`;

          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`API isteği başarısız: ${response.status}`);
            }
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const components = data.results[0].components;
              const foundCity =
                components.city || components.town || components.village || "Bilinmiyor";
              const foundDistrict =
                components.suburb ||
                components.county ||
                components.state_district ||
                "Bilinmiyor";
              setLocation(foundCity, foundDistrict);
            } else {
              throw new Error("Adres bilgisi bulunamadı.");
            }
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error("Adres çözümleme hatası:", errorMessage);
            setError("Adres bilgisi alınamadı.");
          }
        },
        (geoError) => {
          console.error("Konum alma hatası:", geoError.message);
          setError(`Konum alınamadı: ${geoError.message}`);
        }
      );
    };

    getLocation();
    // district store'dan kaldırıldı, bu yüzden bağımlılıklardan da çıkarıldı.
  }, [city, setLoading, setLocation, setError]);
}
