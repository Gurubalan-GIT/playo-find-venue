// This example creates circles on the map, representing populations in North
// America.

// First, create an object containing LatLng and population for each city.
var people = {
  ravi: {
    center: { lat: 12.9281594, lng: 77.6295864 },
    radius: 8,
    color: "#0000FF"
  },
  sakshi: {
    center: { lat: 12.9915374, lng: 77.6119656 },
    radius: 8,
    color: "#000FF0"
  },
  sunil: {
    center: { lat: 12.955567, lng: 77.656877434 },
    radius: 8,
    color: "#00FF00"
  },
  nitin: {
    center: { lat: 12.9744437, lng: 77.6986174 },
    radius: 8,
    color: "#0FF000"
  },
  punch: {
    center: { lat: 12.9204517, lng: 77.592301 },
    radius: 8,
    color: "#FF0000"
  }
};

var goldStar = {
  path:
    "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
  fillColor: "yellow",
  fillOpacity: 0.8,
  scale: 0.1,
  strokeColor: "yellow",
  strokeWeight: 2
};

var setup_search_box = function(map) {
  var searchInput = document.querySelector("#searchInput"),
    searchBox = new google.maps.places.SearchBox(searchInput);
  google.maps.event.addListener(searchBox, "places_changed", function() {
    var location = searchBox.getPlaces()[0];
    if (location) {
      draw_circle(map, location.geometry.location, 8, "#0000FF");
      searchInput.value = "";
    }
  });
};

var find_center = function() {
  var count = Object.keys(people).length;
  var center = Object.values(people).reduce(
    function(aggregate, x) {
      return {
        lat: aggregate.lat + x.center.lat / count,
        lng: aggregate.lng + x.center.lng / count
      };
    },
    { lat: 0, lng: 0 }
  );
  return center;
};

var initMap = function() {
  // Create the map.
  find_center();
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: find_center(),
    mapTypeId: "roadmap",
    mapTypeControl: false
  });
  draw_circles(map);
  mark_venues(map);
  setup_search_box(map);
};

var draw_circles = function(map) {
  // Construct the circle for each person in people.
  Object.keys(people).map(function(name) {
    var { center, radius, color } = people[name];
    draw_circle(map, center, radius, color);
  });
};

var draw_circle = function(map, center, radius, color) {
  var circle = new google.maps.Circle({
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: color,
    fillOpacity: 0.2,
    map: map,
    center: center,
    radius: radius * 1000,
    clickable: true
  });
  circle.addListener("rightclick", function() {
    circle.setMap(null);
  });
};

var mark_venues = function(map) {
  venues.map(function(venue) {
    var rating = parseFloat(venue.avgRating),
      good = rating >= 4.0;
    if (venue.active && rating >= 3.5) {
      // Add marker
      var marker = new google.maps.Marker({
        position: { lat: venue.lat, lng: venue.lng },
        map: map,
        icon: good ? goldStar : undefined
      });
      // infowindow that is shown when marker is clicked
      var info_content = `
<h3>${venue.name}</h3>
<strong>Ratings:</strong> ${venue.avgRating} [${venue.ratingCount}]<br/>
<strong>Phone:</strong> ${venue.inquiryPhone || "NA"}<br/>
<a href="${venue.deferLink}" target="_blank">${venue.deferLink}</a><br/>
`;
      var infowindow = new google.maps.InfoWindow({
        content: info_content,
        maxWidth: 200
      });
      marker.addListener("click", function() {
        infowindow.open(map, marker);
      });
    }
  });
};
