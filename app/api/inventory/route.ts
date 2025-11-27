import { NextRequest, NextResponse } from 'next/server';

// Mock inventory data
let mockInventory = [
  {
    id: 'inv-001',
    name: 'LED Panel 4x4',
    category: 'Lighting',
    type: 'LED Panel',
    quantity: 24,
    available: 20,
    inUse: 4,
    maintenance: 0,
    status: 'available',
    condition: 'excellent',
    location: 'Warehouse A - Section 1',
    brand: 'Chauvet',
    model: 'COLORdash Par-Quad 7',
    serialNumber: 'LED-4X4-001',
    purchaseDate: '2023-01-15',
    purchasePrice: 450.00,
    dailyRate: 45.00,
    weeklyRate: 270.00,
    notes: 'High-quality LED panels for stage lighting',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-08-15',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z'
  },
  {
    id: 'inv-002',
    name: 'Shure SM58 Microphone',
    category: 'Audio',
    type: 'Microphone',
    quantity: 40,
    available: 32,
    inUse: 8,
    maintenance: 0,
    status: 'available',
    condition: 'good',
    location: 'Warehouse A - Section 2',
    brand: 'Shure',
    model: 'SM58',
    serialNumber: 'MIC-SM58-002',
    purchaseDate: '2022-11-20',
    purchasePrice: 99.00,
    dailyRate: 15.00,
    weeklyRate: 75.00,
    notes: 'Industry standard vocal microphones',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-07-10',
    createdAt: '2022-11-20T09:00:00Z',
    updatedAt: '2024-03-18T11:20:00Z'
  },
  {
    id: 'inv-003',
    name: 'Yamaha MG16XU Mixer',
    category: 'Audio',
    type: 'Mixer',
    quantity: 8,
    available: 6,
    inUse: 1,
    maintenance: 1,
    status: 'available',
    condition: 'excellent',
    location: 'Warehouse A - Section 2',
    brand: 'Yamaha',
    model: 'MG16XU',
    serialNumber: 'MIX-MG16-003',
    purchaseDate: '2023-03-10',
    purchasePrice: 599.00,
    dailyRate: 75.00,
    weeklyRate: 450.00,
    notes: '16-channel mixer with USB interface and FX',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-09-01',
    createdAt: '2023-03-10T12:00:00Z',
    updatedAt: '2024-03-22T16:45:00Z'
  },
  {
    id: 'inv-004',
    name: 'JBL PRX715 Speaker',
    category: 'Audio',
    type: 'Speaker',
    quantity: 16,
    available: 12,
    inUse: 4,
    maintenance: 0,
    status: 'available',
    condition: 'excellent',
    location: 'Warehouse B - Section 1',
    brand: 'JBL',
    model: 'PRX715',
    serialNumber: 'SPK-PRX715-004',
    purchaseDate: '2023-05-15',
    purchasePrice: 899.00,
    dailyRate: 90.00,
    weeklyRate: 540.00,
    notes: '15" powered speakers, 1500W',
    lastMaintenance: '2024-02-20',
    nextMaintenance: '2024-08-20',
    createdAt: '2023-05-15T14:00:00Z',
    updatedAt: '2024-03-19T10:15:00Z'
  },
  {
    id: 'inv-005',
    name: 'Moving Head Light',
    category: 'Lighting',
    type: 'Moving Head',
    quantity: 12,
    available: 10,
    inUse: 2,
    maintenance: 0,
    status: 'available',
    condition: 'good',
    location: 'Warehouse B - Section 2',
    brand: 'Elation',
    model: 'Platinum Spot 5R',
    serialNumber: 'MH-5R-005',
    purchaseDate: '2022-08-25',
    purchasePrice: 1299.00,
    dailyRate: 150.00,
    weeklyRate: 900.00,
    notes: 'Professional moving head spots for concerts',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-07-25',
    createdAt: '2022-08-25T11:00:00Z',
    updatedAt: '2024-03-21T13:40:00Z'
  },
  {
    id: 'inv-006',
    name: 'Pipe & Drape System',
    category: 'Staging',
    type: 'Backdrop',
    quantity: 50,
    available: 45,
    inUse: 5,
    maintenance: 0,
    status: 'available',
    condition: 'good',
    location: 'Warehouse C - Section 1',
    brand: 'Premier',
    model: 'PD-10',
    serialNumber: 'PD-SYSTEM-006',
    purchaseDate: '2022-06-10',
    purchasePrice: 75.00,
    dailyRate: 8.00,
    weeklyRate: 40.00,
    notes: '10ft adjustable pipe and drape sections',
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-07-05',
    createdAt: '2022-06-10T08:00:00Z',
    updatedAt: '2024-03-17T09:30:00Z'
  },
  {
    id: 'inv-007',
    name: 'Truss System 10ft',
    category: 'Staging',
    type: 'Truss',
    quantity: 30,
    available: 24,
    inUse: 6,
    maintenance: 0,
    status: 'available',
    condition: 'excellent',
    location: 'Warehouse C - Section 2',
    brand: 'Global Truss',
    model: 'F34',
    serialNumber: 'TRUSS-F34-007',
    purchaseDate: '2023-02-20',
    purchasePrice: 350.00,
    dailyRate: 40.00,
    weeklyRate: 240.00,
    notes: 'Heavy-duty aluminum truss sections',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-08-01',
    createdAt: '2023-02-20T13:00:00Z',
    updatedAt: '2024-03-20T15:20:00Z'
  },
  {
    id: 'inv-008',
    name: 'Wireless Microphone System',
    category: 'Audio',
    type: 'Wireless Mic',
    quantity: 15,
    available: 10,
    inUse: 5,
    maintenance: 0,
    status: 'available',
    condition: 'excellent',
    location: 'Warehouse A - Section 3',
    brand: 'Sennheiser',
    model: 'EW 135 G4',
    serialNumber: 'WM-EW135-008',
    purchaseDate: '2023-04-12',
    purchasePrice: 649.00,
    dailyRate: 65.00,
    weeklyRate: 390.00,
    notes: 'Professional wireless handheld system',
    lastMaintenance: '2024-03-05',
    nextMaintenance: '2024-09-05',
    createdAt: '2023-04-12T10:30:00Z',
    updatedAt: '2024-03-22T12:00:00Z'
  },
  {
    id: 'inv-009',
    name: 'Fog Machine',
    category: 'Effects',
    type: 'Fog/Smoke',
    quantity: 10,
    available: 8,
    inUse: 2,
    maintenance: 0,
    status: 'available',
    condition: 'good',
    location: 'Warehouse B - Section 3',
    brand: 'Antari',
    model: 'Z-1520',
    serialNumber: 'FOG-Z1520-009',
    purchaseDate: '2022-10-15',
    purchasePrice: 299.00,
    dailyRate: 35.00,
    weeklyRate: 210.00,
    notes: 'High-output fog machines with DMX control',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    createdAt: '2022-10-15T14:00:00Z',
    updatedAt: '2024-03-18T16:50:00Z'
  },
  {
    id: 'inv-010',
    name: 'Projection Screen 12x9',
    category: 'Video',
    type: 'Screen',
    quantity: 6,
    available: 4,
    inUse: 2,
    maintenance: 0,
    status: 'available',
    condition: 'excellent',
    location: 'Warehouse C - Section 3',
    brand: 'Da-Lite',
    model: 'Fast-Fold Deluxe',
    serialNumber: 'SCR-12X9-010',
    purchaseDate: '2023-06-20',
    purchasePrice: 1450.00,
    dailyRate: 120.00,
    weeklyRate: 720.00,
    notes: 'Portable projection screen with dress kit',
    lastMaintenance: '2024-02-25',
    nextMaintenance: '2024-08-25',
    createdAt: '2023-06-20T11:00:00Z',
    updatedAt: '2024-03-21T14:10:00Z'
  },
  {
    id: 'inv-011',
    name: 'Power Distribution Box',
    category: 'Power',
    type: 'Distribution',
    quantity: 20,
    available: 16,
    inUse: 4,
    maintenance: 0,
    status: 'available',
    condition: 'good',
    location: 'Warehouse A - Section 4',
    brand: 'Lex',
    model: 'PD-63A',
    serialNumber: 'PWR-PD63-011',
    purchaseDate: '2022-12-01',
    purchasePrice: 450.00,
    dailyRate: 30.00,
    weeklyRate: 180.00,
    notes: '63A power distribution with multiple outputs',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-07-20',
    createdAt: '2022-12-01T09:00:00Z',
    updatedAt: '2024-03-19T11:30:00Z'
  },
  {
    id: 'inv-012',
    name: 'DJ Controller',
    category: 'Audio',
    type: 'DJ Equipment',
    quantity: 5,
    available: 3,
    inUse: 1,
    maintenance: 1,
    status: 'available',
    condition: 'excellent',
    location: 'Warehouse A - Section 3',
    brand: 'Pioneer',
    model: 'DDJ-1000',
    serialNumber: 'DJ-DDJ1000-012',
    purchaseDate: '2023-07-10',
    purchasePrice: 1199.00,
    dailyRate: 100.00,
    weeklyRate: 600.00,
    notes: 'Professional 4-channel DJ controller',
    lastMaintenance: '2024-03-10',
    nextMaintenance: '2024-09-10',
    createdAt: '2023-07-10T15:00:00Z',
    updatedAt: '2024-03-22T17:20:00Z'
  }
];

// GET /api/inventory
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');

    // Filter inventory
    let filtered = [...mockInventory];

    if (category) {
      filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (status) {
      filtered = filtered.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    if (location) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (condition) {
      filtered = filtered.filter(item => item.condition.toLowerCase() === condition.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.brand.toLowerCase().includes(searchLower) ||
        item.model.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
      summary: {
        totalItems: mockInventory.length,
        totalQuantity: mockInventory.reduce((sum, item) => sum + item.quantity, 0),
        available: mockInventory.reduce((sum, item) => sum + item.available, 0),
        inUse: mockInventory.reduce((sum, item) => sum + item.inUse, 0),
        maintenance: mockInventory.reduce((sum, item) => sum + item.maintenance, 0),
        categories: [...new Set(mockInventory.map(item => item.category))],
        locations: [...new Set(mockInventory.map(item => item.location))]
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

// POST /api/inventory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'type', 'quantity', 'brand', 'model', 'location'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new inventory item
    const newItem = {
      id: `inv-${String(mockInventory.length + 1).padStart(3, '0')}`,
      name: body.name,
      category: body.category,
      type: body.type,
      quantity: body.quantity,
      available: body.available ?? body.quantity,
      inUse: body.inUse ?? 0,
      maintenance: body.maintenance ?? 0,
      status: body.status ?? 'available',
      condition: body.condition ?? 'good',
      location: body.location,
      brand: body.brand,
      model: body.model,
      serialNumber: body.serialNumber ?? `${body.type.toUpperCase()}-${Date.now()}`,
      purchaseDate: body.purchaseDate ?? new Date().toISOString().split('T')[0],
      purchasePrice: body.purchasePrice ?? 0,
      dailyRate: body.dailyRate ?? 0,
      weeklyRate: body.weeklyRate ?? 0,
      notes: body.notes ?? '',
      lastMaintenance: body.lastMaintenance ?? null,
      nextMaintenance: body.nextMaintenance ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockInventory.push(newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Inventory item created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
