import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hike, WishlistHike } from '../types';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const goldIcon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#c9a84c;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -32],
});

const purpleIcon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#8b5cf6;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -32],
});

interface Props {
  hikes: Hike[];
  wishlist: WishlistHike[];
  onHikeClick: (hike: Hike) => void;
}

export function MapView({ hikes, wishlist, onHikeClick }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 140px)', border: '1px solid rgba(106, 171, 122, 0.15)' }}>
      <MapContainer
        center={[31.5, 35.0]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {hikes.map(hike => (
          <Marker key={hike.id} position={hike.coordinates} icon={goldIcon}>
            <Popup>
              <div className="p-1" style={{ minWidth: '180px' }}>
                {hike.coverPhoto && (
                  <img src={hike.coverPhoto} alt={hike.name} className="w-full rounded-lg mb-2 object-cover" style={{ height: '90px' }} />
                )}
                <h4 className="font-serif font-bold mb-1" style={{ color: '#e8f0e9', fontSize: '15px' }}>{hike.name}</h4>
                <p className="text-xs mb-2" style={{ color: '#8aab8f' }}>{hike.difficulty} · {hike.duration}</p>
                <button
                  onClick={() => onHikeClick(hike)}
                  className="w-full py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(201, 168, 76, 0.25)', color: '#c9a84c', border: '1px solid rgba(201, 168, 76, 0.4)' }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {wishlist.map(hike => (
          <Marker key={hike.id} position={hike.coordinates} icon={purpleIcon}>
            <Popup>
              <div className="p-1" style={{ minWidth: '180px' }}>
                {hike.coverPhoto && (
                  <img src={hike.coverPhoto} alt={hike.name} className="w-full rounded-lg mb-2 object-cover" style={{ height: '90px' }} />
                )}
                <h4 className="font-serif font-bold mb-1" style={{ color: '#e8f0e9', fontSize: '15px' }}>{hike.name}</h4>
                <p className="text-xs mb-1" style={{ color: '#8aab8f' }}>{hike.difficulty} · {hike.duration}</p>
                <p className="text-xs px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>
                  Wishlist · {hike.priority}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
