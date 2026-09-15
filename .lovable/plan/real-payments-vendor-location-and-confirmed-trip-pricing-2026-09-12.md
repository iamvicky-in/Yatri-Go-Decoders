# Real payments, vendor location, and confirmed trip pricing

## Goal
Turn the existing prototype flows into verified, data-backed experiences while keeping the current classic YATRI GO interface.

## Build

### 1. Payment-backed bookings
- Extend bookings with payment environment, transaction ID, payment status, platform fee, and vendor net earnings.
- Create bookings in a pending state using the vendor’s stored price, never a browser-supplied amount.
- Open the built-in test checkout and confirm bookings only after a signed payment event.
- Show paid amount, payment state, and booking reference in My Trips.
- Replace hardcoded admin revenue and vendor earnings with totals from confirmed paid bookings.
- Add a visible test-payment notice in preview.

### 2. Vendor map location selection
- Add a map picker to vendor registration.
- Let vendors use their current location, click the map, or drag a marker.
- Save the selected coordinates with the pending listing.
- Keep approval as the gate before the vendor appears publicly on the services map and directions links.

### 3. Confirmed-only trip pricing
- Use the connected Google Maps service for real place discovery and route distance/time.
- Use approved vendor prices as the only monetary source for hotels, food, and transport.
- Mark categories without a confirmed vendor price as “Price unavailable” instead of inventing a value.
- Recalculate itinerary totals from confirmed priced items only and identify uncovered budget categories.
- Cache bounded place and route lookups to control cost and avoid repeated requests.

### 4. Real vendor submission and verification
- Submit and approve YatriGO only after its category, full address, phone, starting price, hours, and description are provided.
- Verify the approved listing appears in services, on the map, and opens directions.

## Validation
- Verify type checks and app health.
- Test current-location selection and manual marker movement on desktop and mobile.
- Test pending vendor submission, admin approval, public map visibility, and directions.
- Test checkout opening, signed payment confirmation, My Trips, admin revenue, and vendor earnings.
- Test a Jaipur itinerary and confirm every displayed amount comes from an approved vendor price; missing values remain clearly unavailable.

## Blockers
- Checkout catalog creation was declined, so payment checkout cannot be completed until approved.
- The real YatriGO vendor listing is missing required business details and cannot be submitted accurately yet.
