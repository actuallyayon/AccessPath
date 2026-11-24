# AccessPath API Documentation

## 1. Geocoding & Reverse Autocomplete
### `GET /api/geocode`
Server-side cached Nominatim OpenStreetMap proxy. Respects upstream rate limits and handles search queries as well as reverse coordinates.

**Query Parameters:**
- `q`: Search string (e.g. `Dhaka Medical College`)
- `lat`: (Optional) Latitude for reverse geocoding
- `lon`: (Optional) Longitude for reverse geocoding

**Response Example:**
```json
[
  {
    "place_id": 123456,
    "display_name": "Dhaka Medical College, Secretariate Road, Dhaka, Bangladesh",
    "lat": "23.7258",
    "lon": "90.3976",
    "type": "hospital"
  }
]
```

---

## 2. Route Planner Engine
### `POST /api/route-planner`
Computes up to 3 route alternatives, runs PostGIS buffer query for barriers, and scores each route with `calculateRouteScore()`.

**Request Body:**
```json
{
  "startLat": 23.7461,
  "startLng": 90.3742,
  "destLat": 23.7388,
  "destLng": 90.3956,
  "preferences": {
    "avoid_stairs": true,
    "max_incline_deg": 8
  }
}
```

**Response Example:**
```json
{
  "routes": [
    {
      "id": "route_1",
      "name": "Primary Recommended Path",
      "distance": 1420,
      "duration": 1050,
      "score": 92,
      "barrierCount": 1,
      "recommended": true,
      "warnings": ["Unverified community report: broken footpath"],
      "breakdown": [
        { "name": "Base Score", "points": 100, "reason": "Initial baseline" },
        { "name": "Ramps Available", "points": 5, "reason": "1 ramp detected" },
        { "name": "Barrier Reports Penalty", "points": -13, "reason": "1 report normalized" }
      ],
      "geometry": {
        "coordinates": [[90.3742, 23.7461], [90.3956, 23.7388]]
      }
    }
  ],
  "meta": {
    "count": 1,
    "engine": "OpenRouteService (Wheelchair)"
  }
}
```

---

## 3. Map Viewport Bounding Box
### `GET /api/map/bbox`
Returns points or server-clustered grids depending on map zoom level.

**Query Parameters:**
- `minLng`, `minLat`, `maxLng`, `maxLat`: Bounding box floats
- `zoom`: Map zoom level integer (1-19)
