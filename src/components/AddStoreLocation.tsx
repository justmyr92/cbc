import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { addStoreLocation } from "../services/stores.service";

type CityType = {
    code: string;
    name: string;
};

type ProvinceType = {
    code: string;
    name: string;
};
interface AddStoreModalProps {
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    setReload: (reload: boolean) => void;
}

const AddStoreModal = ({
    showAddModal,
    setShowAddModal,
    setReload,
}: AddStoreModalProps) => {
    const [storeName, setStoreName] = useState("");
    const [building, setBuilding] = useState("");
    const [street, setStreet] = useState("");
    const [barangay, setBarangay] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [province, setProvince] = useState("");
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [PSGCProvince, setPSGCProvince] = useState([]);
    const [PSGCCities, setPSGCCities] = useState([]);
    const [PSGCBarangays, setPSGCBarangays] = useState([]);

    const resetForm = () => {
        setStoreName("");
        setBuilding("");
        setStreet("");
        setBarangay("");
        setCity("");
        setZipCode("");
        setProvince("");
        setPSGCCities([]); // Reset cities as well
        setPSGCBarangays([]); // Reset barangays
    };

    useEffect(() => {
        const modal = document.getElementById(
            "add_store_modal"
        ) as HTMLDialogElement;
        if (modal) {
            if (showAddModal) {
                modal.showModal();
            } else {
                resetForm();
                modal.close();
            }
        }
    }, [showAddModal]);

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
                setPSGCProvince(provinces); // Store provinces
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
                    setPSGCCities(cities); // Store cities
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            } else {
                setPSGCCities([]); // Clear cities if no province is selected
                setPSGCBarangays([]); // Clear barangays as well
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
                    setPSGCBarangays(barangays); // Store barangays
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            } else {
                setPSGCBarangays([]); // Clear barangays if no city is selected
            }
        };
        getPSGCBarangays();
    }, [city]);

    const fetchFullAddress = async (
        new_city: string | undefined,
        new_provice: string | undefined
    ) => {
        const address = `${barangay}, ${new_city}, ${new_provice}`;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
            );
            const data = await response.json();
            console.log(data);
            if (data) {
                setPosition([data[0].lat, data[0].lon]); // Use the first result
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleInputChange = () => {
        // Find the city and province names based on the codes
        const new_city = (PSGCCities as CityType[]).find(
            (cit: any) => cit.code === city
        )?.name;
        const new_province = (PSGCProvince as ProvinceType[]).find(
            (prov: any) => prov.code === province
        )?.name;

        console.log(new_city, new_province);
        if (barangay && city && province) {
            fetchFullAddress(new_city, new_province);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            (cit: any) => cit.code === city
        )?.name;
        const new_province = (PSGCProvince as ProvinceType[]).find(
            (prov: any) => prov.code === province
        )?.name;

        const storeData = {
            store_name: storeName,
            address: `${building}, ${street}, ${barangay}, ${new_city}, ${zipCode}, ${new_province}`,
            latitude: position[0],
            longitude: position[1],
        };

        try {
            const response = await addStoreLocation(storeData); // Call the addManager function
            if (response) {
                setReload(true);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <dialog id="add_store_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowAddModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Add New Store</h3>
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
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                    </label>

                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Province</span>
                        </div>
                        <select
                            className="input input-bordered w-full rounded-md"
                            value={province}
                            onChange={(e) => {
                                setProvince(e.target.value);
                                handleInputChange();
                            }}
                        >
                            <option value="">Select Province</option>
                            {PSGCProvince.sort((a: any, b: any) =>
                                a.name.localeCompare(b.name)
                            ).map((prov: any) => (
                                <option key={prov.code} value={prov.code}>
                                    {prov.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">
                                City/Municipality
                            </span>
                        </div>
                        <select
                            className="input input-bordered w-full rounded-md"
                            value={city}
                            disabled={province ? false : true}
                            onChange={(e) => {
                                setCity(e.target.value);

                                handleInputChange(); // Fetch full address when city changes
                            }}
                        >
                            <option value="">Select City/Municipality</option>
                            {PSGCCities.sort((a: any, b: any) =>
                                a.name.localeCompare(b.name)
                            ).map((city: any) => (
                                <option key={city.code} value={city.code}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Barangay</span>
                        </div>
                        <select
                            className="input input-bordered w-full rounded-md"
                            disabled={city ? false : true}
                            value={barangay}
                            onChange={(e) => {
                                setBarangay(e.target.value);
                                handleInputChange(); // Fetch full address when barangay changes
                            }}
                        >
                            <option value="">Select Barangay</option>
                            {PSGCBarangays.sort((a: any, b: any) =>
                                a.name.localeCompare(b.name)
                            ).map((barangay: any) => (
                                <option
                                    key={barangay.code}
                                    value={barangay.name}
                                >
                                    {barangay.name}
                                </option>
                            ))}
                        </select>
                    </label>

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
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Zip Code</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Zip Code"
                            className="input input-bordered w-full rounded-md"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </label>

                    <MapContainer
                        center={position ?? [0, 0]}
                        zoom={2}
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
                    <button type="submit" className="btn btn-primary mt-5">
                        Add Store
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default AddStoreModal;
