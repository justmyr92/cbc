import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { updateStoreLocation } from "../services/stores.service";

type CityType = {
    code: string;
    name: string;
};

type ProvinceType = {
    code: string;
    name: string;
};

interface UpdateStoreModalProps {
    showUpdateModal: boolean;
    setShowUpdateModal: (show: boolean) => void;
    store: any; // Assuming store object with the necessary fields
    setReload: (reload: boolean) => void;
}

const UpdateStoreModal = ({
    showUpdateModal,
    setShowUpdateModal,
    store,
    setReload,
}: UpdateStoreModalProps) => {
    console.log(store);
    const [storeName, setStoreName] = useState(store?.store_name || "");
    const [building, setBuilding] = useState(store?.address?.building || "");
    const [street, setStreet] = useState(store?.address?.street || "");
    const [barangay, setBarangay] = useState(store?.address?.barangay || "");
    const [city, setCity] = useState(store?.address?.city || "");
    const [zipCode, setZipCode] = useState(store?.address?.zipCode || "");
    const [province, setProvince] = useState(store?.address?.province || "");
    const [position, setPosition] = useState<[number, number] | null>(
        store?.position || null
    );
    const [PSGCProvince, setPSGCProvince] = useState([]);
    const [PSGCCities, setPSGCCities] = useState([]);
    const [PSGCBarangays, setPSGCBarangays] = useState([]);

    useEffect(() => {
        if (!showUpdateModal) {
            return;
        }
        // Preload the data of the selected store into the form
        setStoreName(store?.store_name || "");
        setBuilding(store?.address?.building || "");
        setStreet(store?.address?.street || "");
        setBarangay(store?.address?.barangay || "");
        setCity(store?.address?.city || "");
        setZipCode(store?.address?.zipCode || "");
        setProvince(store?.address?.province || "");
        setPosition(store?.position || null);
    }, [showUpdateModal, store]);

    const resetForm = () => {
        setStoreName("");
        setBuilding("");
        setStreet("");
        setBarangay("");
        setCity("");
        setZipCode("");
        setProvince("");
        setPSGCCities([]);
        setPSGCBarangays([]);
    };

    useEffect(() => {
        const modal = document.getElementById(
            "update_store_modal"
        ) as HTMLDialogElement;

        if (modal) {
            if (showUpdateModal) {
                modal.showModal();
            } else {
                resetForm();
                modal.close();
            }
        }
    }, [showUpdateModal]);

    useEffect(() => {
        const getPSGCProvince = async () => {
            try {
                const response = await fetch(
                    `https://psgc.gitlab.io/api/provinces`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const provinces = await response.json();
                setPSGCProvince(provinces);
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        getPSGCProvince();
    }, []);

    useEffect(() => {
        const getPSGCCities = async () => {
            if (province) {
                try {
                    const response = await fetch(
                        `https://psgc.gitlab.io/api/provinces/${province}/cities-municipalities/`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    const cities = await response.json();
                    setPSGCCities(cities);
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            } else {
                setPSGCCities([]);
                setPSGCBarangays([]);
            }
        };
        getPSGCCities();
    }, [province]);

    useEffect(() => {
        const getPSGCBarangays = async () => {
            if (city) {
                try {
                    const response = await fetch(
                        `https://psgc.gitlab.io/api/cities-municipalities/${city}/barangays/`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    const barangays = await response.json();
                    setPSGCBarangays(barangays);
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            } else {
                setPSGCBarangays([]);
            }
        };
        getPSGCBarangays();
    }, [city]);

    const fetchFullAddress = async (
        barangay: string | undefined,
        new_city: string | undefined,
        new_province: string | undefined
    ) => {
        const address = `${barangay}, ${new_city}, ${new_province}`;
        console.log(address);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
            );
            const data = await response.json();
            if (data) {
                setPosition([data[0].lat, data[0].lon]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleInputChange = () => {
        const new_city = (PSGCCities as CityType[]).find(
            (cit) => cit.code === city
        )?.name;
        const new_province = (PSGCProvince as ProvinceType[]).find(
            (prov) => prov.code === province
        )?.name;

        if (barangay && new_city && new_province) {
            fetchFullAddress(barangay, new_city, new_province);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(position);
        if (
            !barangay ||
            !city ||
            !province ||
            !building ||
            !street ||
            !zipCode ||
            !position
        ) {
            alert("Please fill in all fields");
            return;
        }

        const new_city = (PSGCCities as CityType[]).find(
            (cit) => cit.code === city
        )?.name;
        const new_province = (PSGCProvince as ProvinceType[]).find(
            (prov) => prov.code === province
        )?.name;

        const storeData = {
            store_name: storeName,
            address: `${building}, ${street}, ${barangay}, ${new_city}, ${zipCode}, ${new_province}`,
            latitude: position[0],
            longitude: position[1],
        };

        try {
            const response = await updateStoreLocation({
                id: store.store_id,
                ...storeData,
            });

            if (response) {
                setReload(true);
                setShowUpdateModal(false);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <dialog id="update_store_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowUpdateModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Update Store</h3>
                <form className="py-4 flex flex-col" onSubmit={handleSubmit}>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Store Name</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Store Name"
                            className="input input-bordered w-full rounded-md"
                            value={storeName}
                            onChange={(e) => {
                                setStoreName(e.target.value);
                                handleInputChange();
                            }}
                        />
                    </label>

                    {/* Province Input */}
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Province</span>
                        </div>
                        <select
                            value={province}
                            onChange={(e) => {
                                setProvince(e.target.value);
                                handleInputChange();
                            }}
                            className="select select-bordered w-full rounded-md"
                        >
                            <option value="">Select Province</option>
                            {PSGCProvince.map((prov: ProvinceType) => (
                                <option key={prov.code} value={prov.code}>
                                    {prov.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* City Input */}
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">City</span>
                        </div>
                        <select
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                handleInputChange();
                            }}
                            className="select select-bordered w-full rounded-md"
                            disabled={!province}
                        >
                            <option value="">Select City</option>
                            {PSGCCities.map((cit: CityType) => (
                                <option key={cit.code} value={cit.code}>
                                    {cit.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Barangay Input */}
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Barangay</span>
                        </div>
                        <select
                            value={barangay}
                            onChange={(e) => {
                                setBarangay(e.target.value);
                                handleInputChange();
                            }}
                            className="select select-bordered w-full rounded-md"
                            disabled={!city}
                        >
                            <option value="">Select Barangay</option>
                            {PSGCBarangays.map((bar: any) => (
                                <option key={bar.code} value={bar.name}>
                                    {bar.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Building Input */}
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Building</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Building"
                            className="input input-bordered w-full rounded-md"
                            value={building}
                            onChange={(e) => {
                                setBuilding(e.target.value);
                                handleInputChange();
                            }}
                        />
                    </label>

                    {/* Street Input */}
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Street</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Street"
                            className="input input-bordered w-full rounded-md"
                            value={street}
                            onChange={(e) => {
                                setStreet(e.target.value);
                                handleInputChange();
                            }}
                        />
                    </label>

                    {/* Zip Code Input */}
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Zip Code</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Zip Code"
                            className="input input-bordered w-full rounded-md"
                            value={zipCode}
                            onChange={(e) => {
                                setZipCode(e.target.value);
                                handleInputChange();
                            }}
                        />
                    </label>

                    {/* Map for Location */}
                    <MapContainer
                        center={position ?? [0, 0]}
                        zoom={13}
                        style={{ height: "400px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {position && (
                            <Marker position={position}>
                                <Popup>Your Store Location</Popup>
                            </Marker>
                        )}
                    </MapContainer>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary mt-5">
                        Update Store
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default UpdateStoreModal;
