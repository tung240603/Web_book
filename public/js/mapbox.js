// console.log('hello from client siide');
/* eslint-disable */

export const displayMap = (locations) => {
  document.addEventListener('DOMContentLoaded', function () {
    mapboxgl.accessToken =
      'pk.eyJ1IjoidHVuZzI0MDYwMyIsImEiOiJjbHVqeWw1d28wa215MnBudTdybHNzODV3In0.sc5PCH91XiDNGxk66JXIvA';

    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/tung240603/clumzikk4002w01mpbyg41wt1',
      scrollZoom: false,
      // center: [-118.113491, 34.111745],
      // zoom: 10,
      // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
      // Create marker
      const el = document.createElement('div');
      el.className = 'marker';

      // Add marker
      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .addTo(map);

      // Add popup
      new mapboxgl.Popup({
        offset: 30,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  });
};
