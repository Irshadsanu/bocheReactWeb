
import React, { useEffect, useState, useRef } from "react";
import "./StoreList.css";
import serchIcn from "../Assets/Images/Vector_search.png";
import location_logo from "../Assets/Images/location.svg";
import location_green from "../Assets/Images/image 80.png";
import { firestore } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const StoreList = () => {
  const [shopGroups, setShopGroups] = useState({}); // Stores grouped shops by district
  const [selectedState, setSelectedState] = useState("Kerala"); // Initially select Kerala
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Keeps track of selected district
  const [searchTerm, setSearchTerm] = useState(""); // Stores search term for filtering
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLong, setCurrentLong] = useState(0);
  const [isState, setIsState] = useState({}); // State for storing shops grouped by states

  const addressContainerRef = useRef(null); // Ref for the address container
  let placeSearchMatch;

  // Fetch shops and group them by district and state
  const fetchShopsAndGroupByDistrict = async () => {
    try {
      const querySnapshotMain = collection(firestore, "STORE");
      const querySnapshot = await getDocs(querySnapshotMain);

      let shops = {};
      let states = {};

      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        const shop = {
          name: shopData.STORE_NAME || "",
          district: shopData.DISTRICT || "",
          address: shopData.STORE_ADDRESS || "",
          state: shopData.STATE,
          storeLat: shopData.LATITUDE,
          storeLong: shopData.LONGITUDE,
        };

        // Group shops by district and state
        if (!shops[shop.district]) {
          shops[shop.district] = [];
        }
        shops[shop.district].push(shop);

        if (!states[shop.state]) {
          states[shop.state] = [];
        }
        states[shop.state].push(shop);
      });

      setShopGroups(shops);
      setIsState(states);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  useEffect(() => {
    fetchShopsAndGroupByDistrict();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Convert input to lowercase for case-insensitive search
    setSelectedDistrict(null); // Reset selected district on new search
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedDistrict(null); // Reset selected district when state changes
  };

  const handleDistrictClick = (district) => {
    setSelectedDistrict(district); // Update selected district on click
    setSearchTerm(""); // Clear search term when a district is clicked
    if (addressContainerRef.current) {
      addressContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const launchMaps = (latitude, longitude, storeLatitude, storeLongitude) => {
    const googleUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${storeLatitude},${storeLongitude}`;
    const appleUrl = `https://maps.apple.com/?sll=${latitude},${longitude}`;

    // Attempt to open Google Maps URL
    window.open(googleUrl, "_blank") ||
      window.open(appleUrl, "_blank") ||
      alert("Could not launch URL");
  };

  const requestLocationPermission = async () => {
    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation",
        });
        if (result.state === "granted") {
          return true;
        } else if (result.state === "prompt") {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              () => resolve(true),
              () => resolve(false)
            );
          });
        } else {
          return false;
        }
      } catch (error) {
        console.error("Error checking geolocation permission", error);
        return false;
      }
    }
    return false;
  };

  const getCurrentPosition = async (storeLat, storeLong) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      alert("Location permissions are denied");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLat(position.coords.latitude);
          setCurrentLong(position.coords.longitude);
          launchMaps(
            position.coords.latitude,
            position.coords.longitude,
            storeLat,
            storeLong
          );
        },
        (error) => {
          console.error("Error fetching location", error);
          alert("Error fetching location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="store">
      <div className="Store_search_bar">
        <input
          placeholder="Search places here"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="icon_box">
          <img src={serchIcn} alt="Search Icon" />
          <p>Search</p>
        </div>
      </div>

      <div className="content_container">
        <div className="content_head">
          <h4>Working Hours:</h4>
          <p>10:00 am - 06:00 pm</p>
        </div>

        <div className="location-stateselect">
          <h5>Select Your State</h5>
          <select onChange={handleStateChange} value={selectedState}>
            {isState &&
              Object.keys(isState).map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
          </select>
        </div>

        <div className="location_container">
          <h5>Select Your District</h5>
          <div className="district">
            {shopGroups &&
              Object.keys(shopGroups)
                .filter((district) => {
                  const districtMatch =
                    selectedState &&
                    shopGroups[district][0].state === selectedState;

                  const districtSearchMatch = district
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                  placeSearchMatch = shopGroups[district].some((shop) =>
                    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );

                  return districtMatch && (districtSearchMatch || placeSearchMatch);
                })
                .map((district, index) => (
                  <div
                    key={index}
                    className={`district_item ${
                      selectedDistrict === district ? "active" : ""
                    }`}
                    onClick={() => handleDistrictClick(district)}
                  >
                    <img src={location_logo} alt="Location Logo" />
                    <p>{district}</p>
                  </div>
                ))}
          </div>

          {/* Show selected district or search results */}
          {(selectedDistrict || searchTerm) && (
            <div className="address_container" ref={addressContainerRef}>
              <div className="address_container_head">
                <div className="Head_text_1">Branch Name</div>
                <div className="Head_text_2">Address</div>
              </div>

              <div className="address_items_container">
                {(searchTerm ? shopGroups : { [selectedDistrict]: shopGroups[selectedDistrict] })[selectedDistrict || Object.keys(shopGroups).find((district) =>
                  shopGroups[district].some((shop) =>
                    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                )]?.map((shop, shopIndex) => (
                  <div className="address_items" key={`${shopIndex}`}>
                    <div className="address_logo_container">
                      <div className="item_1">
                        <p>{shop.name}</p>
                      </div>
                      <div className="item_2">
                        <p>{shop.address}</p>
                      </div>
                    </div>
                    <div className="item_3">
                      <img
                        onClick={() => {
                          if (shop.storeLat && shop.storeLong) {
                            getCurrentPosition(shop.storeLat, shop.storeLong);
                          } else {
                            alert(
                              "Location information is not available for this shop."
                            );
                          }
                        }}
                        src={location_green}
                        alt="Location Green"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreList;