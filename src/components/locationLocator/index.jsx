import React, { useEffect, useRef } from "react";

const LocationLocator = () => {
    const address1Ref = useRef(null);
    const address2Ref = useRef(null);
    const localityRef = useRef(null);
    const stateRef = useRef(null);
    const postcodeRef = useRef(null);
    const countryRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        const loadScript = (url, callback) => {
            let script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = () => callback();
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        };

        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=AIzaSyC-EMzn0bH90q_a07T3VaDh8dhzHVwzbf8&libraries=places`,
            () => {
                const google = window.google;
                autocompleteRef.current = new google.maps.places.Autocomplete(address1Ref.current, {
                    componentRestrictions: { country: ["us", "ca"] },
                    fields: ["address_components", "geometry"],
                    types: ["address"],
                });
                autocompleteRef.current.addListener("place_changed", fillInAddress);
            }
        );
    }, []);

    const fillInAddress = () => {
        const place = autocompleteRef.current.getPlace();
        let address1 = "";
        let postcode = "";

        for (const component of place.address_components) {
            const componentType = component.types[0];

            switch (componentType) {
                case "street_number":
                    address1 = `${component.long_name} ${address1}`;
                    break;
                case "route":
                    address1 += component.short_name;
                    break;
                case "postal_code":
                    postcode = `${component.long_name}${postcode}`;
                    break;
                case "postal_code_suffix":
                    postcode = `${postcode}-${component.long_name}`;
                    break;
                case "locality":
                    localityRef.current.value = component.long_name;
                    break;
                case "administrative_area_level_1":
                    stateRef.current.value = component.short_name;
                    break;
                case "country":
                    countryRef.current.value = component.long_name;
                    break;
                default:
                    break;
            }
        }

        address1Ref.current.value = address1;
        postcodeRef.current.value = postcode;
        address2Ref.current.focus();
    };

    return (
        <form id="address-form" action="" method="get" autoComplete="off">
            <p className="title">Sample address form for North America</p>
            <p className="note"><em>* = required field</em></p>
            <label className="full-field">
                <span className="form-label">Deliver to*</span>
                <input id="ship-address" name="ship-address" ref={address1Ref} required autoComplete="off" />
            </label>
            <label className="full-field">
                <span className="form-label">Apartment, unit, suite, or floor #</span>
                <input id="address2" name="address2" ref={address2Ref} />
            </label>
            <label className="full-field">
                <span className="form-label">City*</span>
                <input id="locality" name="locality" ref={localityRef} required />
            </label>
            <label className="slim-field-start">
                <span className="form-label">State/Province*</span>
                <input id="state" name="state" ref={stateRef} required />
            </label>
            <label className="slim-field-end" htmlFor="postal_code">
                <span className="form-label">Postal code*</span>
                <input id="postcode" name="postcode" ref={postcodeRef} required />
            </label>
            <label className="full-field">
                <span className="form-label">Country/Region*</span>
                <input id="country" name="country" ref={countryRef} required />
            </label>
            <button type="button" className="my-button">Save address</button>
            <input type="reset" value="Clear form" />
        </form>
    );
};

export default LocationLocator;
