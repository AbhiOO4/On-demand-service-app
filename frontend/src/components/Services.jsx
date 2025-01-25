import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceApi } from '../services/api';

const API_URL = 'http://localhost:5000';
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+';

function Services({ searchQuery = '' }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                let data;
                if (searchQuery) {
                    data = await serviceApi.searchServices(searchQuery);
                } else {
                    data = await serviceApi.getAllServices();
                }
                console.log('Fetched services:', data);
                setServices(data);
                setError(null);
            } catch (err) {
                console.error('Error in Services component:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [searchQuery]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {services && services.length > 0 ? (
                services.map((service) => (
                    <div
                        key={service.service_id}
                        className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col max-w-sm mx-auto"
                        style={{ maxHeight: '500px' }}
                    >
                        <div 
                            className="relative overflow-hidden" 
                            style={{ 
                                height: '200px',
                                minHeight: '200px',
                                maxHeight: '200px'
                            }}
                        >
                            <img
                                src={service.image_url.startsWith('http') ? service.image_url : `${API_URL}${service.image_url}`}
                                alt={service.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.log('Image load error:', e.target.src);
                                    if (e.target.src !== FALLBACK_IMAGE) {
                                        e.target.src = FALLBACK_IMAGE;
                                    }
                                }}
                            />
                            <div className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 m-2 rounded-full font-medium">
                                ₹{service.base_price}
                            </div>
                        </div>
                        <div className="p-4 flex-1 overflow-hidden">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800 truncate">{service.title}</h3>
                            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{service.description}</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {service.category}
                                </span>
                                <Link
                                    to={`/service/request/${service.service_id}`}
                                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors font-medium text-sm"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 text-center text-gray-500 py-8">
                    No services found
                </div>
            )}
        </div>
    );
}

export default Services;
