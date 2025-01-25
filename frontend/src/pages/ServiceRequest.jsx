import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import Navbar from "../components/Navbar";
import post from "../assets/images/post.png";
import homefull from "../assets/images/home-full.png";
import profile from "../assets/images/profile.png";
import axios from 'axios';

function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

function ServiceRequest() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        service_type: '',
        description: '',
        address: '',
    });
    const [position, setPosition] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!position) {
            setError('Please select a location on the map');
            return;
        }

        try {
            const requestData = {
                ...formData,
                customer_id: user.id,
                latitude: position.lat,
                longitude: position.lng
            };

            await axios.post('http://localhost:5000/api/services', requestData);
            navigate('/customer/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className='m-4 border border-gray-500/30 rounded-xl shadow-sm p-6'>
                <h1 className='text-2xl font-semibold mb-4'>Request Service</h1>
                {error && (
                    <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Service Type
                        </label>
                        <select
                            name="service_type"
                            value={formData.service_type}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-xl'
                            required
                        >
                            <option value="">Select a service</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="electrical">Electrical</option>
                            <option value="cleaning">Cleaning</option>
                            <option value="landscaping">Landscaping</option>
                        </select>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-xl'
                            rows="3"
                            required
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-xl'
                            required
                        />
                    </div>

                    <div className='mb-6'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Select Location on Map
                        </label>
                        <div className='h-64 rounded-xl overflow-hidden border border-gray-300'>
                            <MapContainer
                                center={[12.9716, 77.5946]}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker position={position} setPosition={setPosition} />
                            </MapContainer>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className='w-full px-6 py-2 bg-yellow-400 rounded-xl font-semibold'
                    >
                        Submit Request
                    </button>
                </form>
            </div>
            <Navbar posticon={post} homeicon={homefull} profileicon={profile} />
        </div>
    );
}

export default ServiceRequest;
