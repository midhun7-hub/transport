import React from "react";

function VehicleCard({ vehicle, onBook, onSelect, showSelectButton = false }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-500/5 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={vehicle.img}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                {/* Capacity Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-blue-600">
                    {vehicle.capacity}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>

                {vehicle.details && (
                    <p className="text-gray-600 text-sm mb-4">{vehicle.details}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {vehicle.wheels && (
                        <div className="flex items-center gap-1">
                            <span>🚗</span>
                            <span>{vehicle.wheels} wheels</span>
                        </div>
                    )}
                    {vehicle.rent && (
                        <div className="flex items-center gap-1">
                            <span>💰</span>
                            <span className="font-bold text-green-600">₹{vehicle.rent}/km</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                {showSelectButton && onSelect ? (
                    <button
                        onClick={() => onSelect(vehicle)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                    >
                        Select Vehicle
                    </button>
                ) : onBook ? (
                    <button
                        onClick={onBook}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                    >
                        Book Now
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default VehicleCard;
