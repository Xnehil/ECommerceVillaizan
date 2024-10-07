import React from 'react';

const TrackingPage: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Order Tracking</h1>
            <p>Enter your order number to track your shipment:</p>
            <form>
                <input type="text" placeholder="Order Number" style={{ marginRight: '10px' }} />
                <button type="submit">Track</button>
            </form>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                {/* Driver Image */}
                <div style={{ flex: '1', textAlign: 'center' }}>
                    <img
                        src="driver-image-url" // Replace with actual image URL
                        alt="Driver"
                        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                    />
                </div>
                {/* Driver Name and Vehicle Number */}
                <div style={{ flex: '1', textAlign: 'center' }}>
                    <p>Driver Name</p>
                    <p>Vehicle Number</p>
                </div>
                {/* Cart Products */}
                <div style={{ flex: '1', textAlign: 'center' }}>
                    <p>Cart Products:</p>
                    <ul>
                        <li>Product 1</li>
                        <li>Product 2</li>
                        <li>Product 3</li>
                        {/* Add more products as needed */}
                    </ul>
                </div>
                {/* State and State Image */}
                <div style={{ flex: '1', textAlign: 'center' }}>
                    <p>Order State</p>
                    <img
                        src="state-image-url" // Replace with actual image URL
                        alt="State"
                        style={{ width: '50px', height: '50px' }}
                    />
                </div>
            </div>
            <div style={{ marginTop: '40px', height: '500px', border: '1px solid #ccc' }}>
                {/* Tracking map will be displayed here */}
                <p>Tracking Map Placeholder</p>
            </div>
        </div>
    );
};

export default TrackingPage;