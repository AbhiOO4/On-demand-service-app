import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import post from "../assets/images/post.png";
import homefull from "../assets/images/home-full.png";
import profile from "../assets/images/profile.png";

function WorkerDashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [nearbyRequests, setNearbyRequests] = useState([]);
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        // Connect to Socket.io server
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        // Get current position and watch for changes
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    const newPosition = [pos.coords.latitude, pos.coords.longitude];
                    setPosition(newPosition);
                    if (newSocket) {
                        newSocket.emit('updateLocation', {
                            workerId: user.id,
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                        });
                    }
                },
                (err) => {
                    setError('Error getting location: ' + err.message);
                }
            );
        }

        return () => newSocket.close();
    }, [user.id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch worker profile
                const profileResponse = await axios.get(
                    `http://localhost:5000/api/workers/profile/${user.id}`
                );
                setProfile(profileResponse.data);

                // Fetch worker's current tasks
                const tasksResponse = await axios.get(
                    `http://localhost:5000/api/worker/${user.id}/tasks`
                );
                setTasks(tasksResponse.data);

                // Fetch nearby service requests
                if (position) {
                    const nearbyResponse = await axios.get(
                        `http://localhost:5000/api/worker/nearby-requests`
                    );
                    setNearbyRequests(nearbyResponse.data);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id, position]);

    const acceptRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:5000/api/worker/requests/${requestId}/accept`);
            
            // Refresh tasks and nearby requests
            const tasksResponse = await axios.get(
                `http://localhost:5000/api/worker/${user.id}/tasks`
            );
            setTasks(tasksResponse.data);
            
            setNearbyRequests(prev => 
                prev.filter(request => request.id !== requestId)
            );
        } catch (err) {
            setError('Failed to accept request');
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/worker/tasks/${taskId}`, {
                status: newStatus
            });
            
            // Refresh tasks
            const tasksResponse = await axios.get(
                `http://localhost:5000/api/worker/${user.id}/tasks`
            );
            setTasks(tasksResponse.data);
        } catch (err) {
            setError('Failed to update task status');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-100">
                {/* <Navbar posticon={post} homeicon={homefull} profileicon={profile} /> */}
                {/* <Topbar workersBg="bg-yellow-400" /> */}
                
                {/* Worker Profile Section */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {profile && (
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Name</p>
                                    <p className="font-semibold">{profile.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Email</p>
                                    <p className="font-semibold">{profile.email}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Phone</p>
                                    <p className="font-semibold">{profile.phone}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Rating</p>
                                    <p className="font-semibold">{profile.rating ? `${profile.rating}/5.0` : 'No ratings yet'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Total Jobs</p>
                                    <p className="font-semibold">{profile.total_jobs}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills && profile.skills.map((skill, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rest of the dashboard content */}
                    <div className='m-4 border border-gray-500/30 rounded-xl shadow-sm p-6'>
                        <h1 className='text-2xl font-semibold mb-4'>Current Tasks</h1>

                        {error && (
                            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                                {error}
                            </div>
                        )}

                        {tasks.length === 0 ? (
                            <p className='text-center text-gray-500 py-4'>
                                No current tasks
                            </p>
                        ) : (
                            <div className='space-y-4'>
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className='border border-gray-500/30 rounded-xl p-4'
                                    >
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='font-semibold'>{task.service_type}</h3>
                                                <p className='text-gray-600'>{task.description}</p>
                                                <p className='text-sm text-gray-500'>
                                                    {task.address}
                                                </p>
                                                <p className='text-sm text-gray-500'>
                                                    Posted: {new Date(task.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {task.status === 'assigned' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                                    className='px-4 py-2 bg-yellow-400 rounded-xl font-semibold'
                                                >
                                                    Start Work
                                                </button>
                                            )}
                                            {task.status === 'in_progress' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task.id, 'completed')}
                                                    className='px-4 py-2 bg-green-500 rounded-xl font-semibold'
                                                >
                                                    Complete Task
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <h1 className='text-2xl font-semibold mt-8 mb-4'>Nearby Requests</h1>

                        {position && (
                            <div className='mb-6 h-64 rounded-xl overflow-hidden border border-gray-300'>
                                <MapContainer
                                    center={position}
                                    zoom={13}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {/* Worker's location */}
                                    <Marker position={position}>
                                        <Popup>You are here</Popup>
                                    </Marker>
                                    {/* Service requests */}
                                    {nearbyRequests.map((request) => (
                                        <Marker
                                            key={request.id}
                                            position={[request.latitude, request.longitude]}
                                        >
                                            <Popup>
                                                <div>
                                                    <h3 className='font-semibold'>{request.service_type}</h3>
                                                    <p>{request.description}</p>
                                                    <button
                                                        onClick={() => acceptRequest(request.id)}
                                                        className='mt-2 px-4 py-1 bg-yellow-400 rounded-xl font-semibold text-sm'
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        )}

                        {nearbyRequests.length === 0 ? (
                            <p className='text-center text-gray-500 py-4'>
                                No nearby requests
                            </p>
                        ) : (
                            <div className='space-y-4'>
                                {nearbyRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className='border border-gray-500/30 rounded-xl p-4'
                                    >
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='font-semibold'>{request.service_type}</h3>
                                                <p className='text-gray-600'>{request.description}</p>
                                                <p className='text-sm text-gray-500'>
                                                    {request.address}
                                                </p>
                                                <p className='text-sm text-gray-500'>
                                                    Posted: {new Date(request.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => acceptRequest(request.id)}
                                                className='px-4 py-2 bg-yellow-400 rounded-xl font-semibold'
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default WorkerDashboard;
