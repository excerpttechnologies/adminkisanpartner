
'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Vehicle {
  _id: string;
  type: string;
  pricePerKm: number;
  capacity: number;
  createdAt?: string;
  updatedAt?: string;
}

const AdminVehicle: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
  const [otherType, setOtherType] = useState<string>('');
  const [pricePerKm, setPricePerKm] = useState<string>('');
  const [capacity, setCapacity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const vehicleTypes = [
    'Tractor',
    'Omni',
    'Lorry',
    'Truck',
    'Mini Truck',
    'Pickup Van',
    'Container Truck',
    'Flatbed Truck',
    'Tempo',
    'Auto Rickshaw',
    'Mini Van',
    'Cargo Van',
    'Box Truck',
    'Refrigerated Truck',
    'Tanker',
    'Other'
  ];

  const filteredVehicles = vehicleTypes.filter(v =>
    v.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch vehicles from database
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      console.log('Fetching vehicles...');
      const response = await fetch('/api/vehicles');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vehicles');
      }
      
      console.log('Fetched vehicles:', data);
      setVehicles(data);
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowOtherInput(type === 'Other');
    setShowDropdown(false);
    setSearchTerm('');
    if (type !== 'Other') {
      setOtherType('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalType = showOtherInput ? otherType : selectedType;

    if (!finalType || !pricePerKm || !capacity) {
      alert('Please fill all fields');
      return;
    }

    // Convert to numbers
    const price = parseFloat(pricePerKm);
    const cap = parseFloat(capacity);
    
    if (isNaN(price) || isNaN(cap) || price <= 0 || cap <= 0) {
      alert('Please enter valid positive numbers for price and capacity');
      return;
    }

    const vehicleData = {
      type: finalType,
      pricePerKm: price,
      capacity: cap
    };

    try {
      setFormLoading(true);
      
      if (editingId) {
        console.log('Updating vehicle with ID:', editingId);
        console.log('Update data:', vehicleData);
        
        const response = await fetch(`/api/vehicles/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicleData)
        });

        const result = await response.json();
        console.log('Update response:', result);
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to update vehicle');
        }

        // Update the vehicle in state
        setVehicles(prev => prev.map(v => 
          v._id === editingId ? result : v
        ));
        
        setEditingId(null);
        alert('✅ Vehicle updated successfully!');
      } else {
        console.log('Creating new vehicle:', vehicleData);
        
        const response = await fetch('/api/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicleData)
        });

        const result = await response.json();
        console.log('Create response:', result);
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create vehicle');
        }

        // Add new vehicle to the beginning of the list
        setVehicles(prev => [result, ...prev]);
        alert('✅ Vehicle added successfully!');
      }

      // Reset form
      setSelectedType('');
      setShowOtherInput(false);
      setOtherType('');
      setPricePerKm('');
      setCapacity('');
      
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      alert('❌ ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    console.log('Editing vehicle:', vehicle);
    
    setEditingId(vehicle._id);
    const isCustomType = !vehicleTypes.includes(vehicle.type);
    
    if (isCustomType) {
      setSelectedType('Other');
      setShowOtherInput(true);
      setOtherType(vehicle.type);
    } else {
      setSelectedType(vehicle.type);
      setShowOtherInput(false);
    }
    
    setPricePerKm(vehicle.pricePerKm.toString());
    setCapacity(vehicle.capacity.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    console.log('Deleting vehicle ID:', id);
    
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      console.log('Delete response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete vehicle');
      }

      // Remove vehicle from state
      setVehicles(prev => prev.filter(v => v._id !== id));
      alert('✅ Vehicle deleted successfully!');
      
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedType('');
    setShowOtherInput(false);
    setOtherType('');
    setPricePerKm('');
    setCapacity('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: '0',
            fontSize: 'clamp(24px, 5vw, 36px)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'black-transparent',
            fontWeight: '700'
          }}>
            🚚 Vehicle Management
          </h1>
          <p style={{
            margin: '10px 0 0 0',
            color: '#020202',
            fontSize: 'clamp(14px, 3vw, 16px)'
          }}>
            Add and manage your fleet vehicles
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 40px)',
          marginBottom: '30px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Vehicle Type Dropdown */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#333',
                fontSize: 'clamp(14px, 3vw, 16px)'
              }}>
                Vehicle Type *
              </label>
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    cursor: 'pointer',
                    background: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    ...(showDropdown && {
                      borderColor: '#667eea',
                      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    })
                  }}
                >
                  <span style={{ color: selectedType ? '#333' : '#999' }}>
                    {selectedType || 'Select vehicle type...'}
                  </span>
                  <span style={{ color: '#667eea' }}>▼</span>
                </div>

                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    marginTop: '8px',
                    background: '#fff',
                    border: '2px solid #667eea',
                    borderRadius: '12px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{ padding: '12px' }}>
                      <input
                        type="text"
                        placeholder="🔍 Search vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: 'clamp(14px, 3vw, 15px)',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                    </div>
                    <div>
                      {filteredVehicles.map((type) => (
                        <div
                          key={type}
                          onClick={() => handleTypeSelect(type)}
                          style={{
                            padding: '14px 16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: 'clamp(14px, 3vw, 15px)',
                            borderLeft: selectedType === type ? '4px solid #667eea' : '4px solid transparent'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f5f5ff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Other Input */}
            {showOtherInput && (
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: '600',
                  color: '#333',
                  fontSize: 'clamp(14px, 3vw, 16px)'
                }}>
                  Specify Vehicle Type *
                </label>
                <input
                  type="text"
                  value={otherType}
                  onChange={(e) => setOtherType(e.target.value)}
                  placeholder="Enter vehicle type..."
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Price per KM */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#333',
                fontSize: 'clamp(14px, 3vw, 16px)'
              }}>
                Price per Kilometer (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pricePerKm}
                onChange={(e) => setPricePerKm(e.target.value)}
                placeholder="Enter price per km..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Capacity */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: '#333',
                fontSize: 'clamp(14px, 3vw, 16px)'
              }}>
                Vehicle Capacity (kg/tons) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter vehicle capacity..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  flex: '1',
                  minWidth: '150px',
                  padding: '16px 32px',
                  background: formLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: 'clamp(15px, 3vw, 17px)',
                  fontWeight: '600',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  opacity: formLoading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: formLoading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                onMouseEnter={(e) => {
                  if (!formLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!formLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                {formLoading ? '⏳ Processing...' : editingId ? '✓ Update Vehicle' : '+ Add Vehicle'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={formLoading}
                  style={{
                    flex: '1',
                    minWidth: '150px',
                    padding: '16px 32px',
                    background: '#fff',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    fontSize: 'clamp(15px, 3vw, 17px)',
                    fontWeight: '600',
                    cursor: formLoading ? 'not-allowed' : 'pointer',
                    opacity: formLoading ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!formLoading) {
                      e.currentTarget.style.borderColor = '#999';
                      e.currentTarget.style.color = '#333';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formLoading) {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.color = '#666';
                    }
                  }}
                >
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Vehicle List */}
        {loading && vehicles.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <p style={{
              fontSize: 'clamp(16px, 3vw, 20px)',
              color: '#999',
              margin: '0'
            }}>
              Loading vehicles...
            </p>
          </div>
        ) : vehicles.length > 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 40px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <h2 style={{
                margin: '0',
                fontSize: 'clamp(20px, 4vw, 28px)',
                color: '#333',
                fontWeight: '700'
              }}>
                📋 Vehicle List ({vehicles.length})
              </h2>
              <button
                onClick={fetchVehicles}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading ? '#ccc' : '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(13px, 2.5vw, 15px)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '600px'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff'
                  }}>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      borderRadius: '12px 0 0 0'
                    }}>
                      Vehicle Type
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600'
                    }}>
                      Price/KM
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600'
                    }}>
                      Capacity
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontSize: 'clamp(13px, 2.5vw, 15px)',
                      fontWeight: '600',
                      borderRadius: '0 12px 0 0'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => (
                    <tr
                      key={vehicle._id}
                      style={{
                        background: index % 2 === 0 ? '#f8f9ff' : '#fff',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e8ebff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? '#f8f9ff' : '#fff';
                      }}
                    >
                      <td style={{
                        padding: '16px',
                        fontSize: 'clamp(13px, 2.5vw, 15px)',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        {vehicle.type}
                      </td>
                      <td style={{
                        padding: '16px',
                        fontSize: 'clamp(13px, 2.5vw, 15px)',
                        color: '#667eea',
                        fontWeight: '600'
                      }}>
                        ₹{vehicle.pricePerKm.toFixed(2)}
                      </td>
                      <td style={{
                        padding: '16px',
                        fontSize: 'clamp(13px, 2.5vw, 15px)',
                        color: '#333'
                      }}>
                        {vehicle.capacity}
                      </td>
                      <td style={{
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          display: 'flex',
                          gap: '10px',
                          justifyContent: 'center',
                          flexWrap: 'wrap'
                        }}>
                          <button
                            onClick={() => {
                              console.log('Edit vehicle ID:', vehicle._id);
                              handleEdit(vehicle);
                            }}
                            style={{
                              padding: '8px 16px',
                              background: '#4CAF50',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: 'clamp(12px, 2.5vw, 14px)',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#45a049';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#4CAF50';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              console.log('Delete vehicle ID:', vehicle._id);
                              handleDelete(vehicle._id);
                            }}
                            style={{
                              padding: '8px 16px',
                              background: '#f44336',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: 'clamp(12px, 2.5vw, 14px)',
                              cursor: 'pointer',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#da190b';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#f44336';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚛</div>
            <p style={{
              fontSize: 'clamp(16px, 3vw, 20px)',
              color: '#999',
              margin: '0'
            }}>
              No vehicles added yet. Start by adding your first vehicle!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVehicle;