import { useMemo } from 'react';
import { useEnergyManagement } from '../../contexts/EnergyManagementContext';
import { FixedSizeList as List } from 'react-window';

const AssetRow = ({ data, index, style }: { data: any[]; index: number; style: React.CSSProperties }) => {
    const asset = data[index];
    return (
        <tr style={style} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{asset.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{asset.type}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{asset.capacity} kW</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    asset.status === 'active' ? 'bg-green-100 text-green-800' :
                    asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {asset.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
            </td>
        </tr>
    );
};

const AssetsPage = () => {
    const { assets, loading, error } = useEnergyManagement();

    // Memoize the table header to prevent unnecessary re-renders
    const TableHeader = useMemo(() => (
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
            </tr>
        </thead>
    ), []);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Assets Management</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add New Asset
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    {TableHeader}
                    <tbody className="bg-white divide-y divide-gray-200">
                        <List
                            height={400}
                            itemCount={assets.length}
                            itemSize={72}
                            width="100%"
                            itemData={assets}
                        >
                            {AssetRow}
                        </List>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetsPage; 