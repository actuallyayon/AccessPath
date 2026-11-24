# AccessPath Database Architecture

## 1. Overview
AccessPath utilizes PostgreSQL with PostGIS (`postgis`), Trigram matching (`pg_trgm`), and UUID generation (`uuid-ossp`) to store geospatial facilities, community-reported barriers, and user trust reputations.

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    PROFILES ||--o{ LOCATIONS : creates
    PROFILES ||--o{ BARRIER_REPORTS : reports
    PROFILES ||--o{ FEEDBACK : writes
    PROFILES ||--o{ FAVORITES : saves
    CATEGORIES ||--o{ LOCATIONS : classifies
    LOCATIONS ||--|| ACCESSIBILITY_FEATURES : has
    LOCATIONS ||--o{ LOCATION_PHOTOS : contains
    LOCATIONS ||--o{ FEEDBACK : receives
    LOCATIONS ||--o{ FAVORITES : favorited_by

    PROFILES {
        uuid id PK
        text full_name
        user_role role
        int trust_score
        jsonb preferences
        timestamptz created_at
    }

    LOCATIONS {
        uuid id PK
        text name
        text address
        geography coordinates
        uuid category_id FK
        numeric accessibility_score
        verification_status verification_status
        tsvector search_vector
    }

    ACCESSIBILITY_FEATURES {
        uuid location_id PK_FK
        boolean wheelchair_access
        boolean ramp_available
        boolean elevator_available
        boolean accessible_restroom
        boolean accessible_parking
        boolean stair_free_entry
        boolean door_accessible
        boolean verified
    }

    BARRIER_REPORTS {
        uuid id PK
        barrier_category category
        text description
        text image_url
        geography coordinates
        barrier_status status
        uuid reporter_id FK
    }

    FEEDBACK {
        uuid id PK
        uuid location_id FK
        uuid user_id FK
        int rating
        text comment
    }
```

---

## 3. Stored PostGIS RPCs
1. **`search_locations()`**: Paginated full-text + spatial distance search with accessibility features filter.
2. **`locations_in_bbox()`**: Map viewport clustering via `ST_SnapToGrid` at lower zoom levels, individual points at zoom ≥ 14.
3. **`barriers_near_line()`**: Buffers a route LineString by 30 meters and returns intersecting barriers.
4. **`recompute_location_score()`**: Recalculates 0–100 accessibility score from feature attributes, feedback ratings, and nearby barrier density.
