import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EquipmentGroup } from '@/types/equipment';
import { equipmentService } from '@/services/equipmentService';

export const EquipmentGroups: React.FC = () => {
  const [groups, setGroups] = useState<EquipmentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState<Partial<EquipmentGroup>>({
    name: '',
    description: '',
    parentId: null,
    type: 'FUNCTIONAL',
    equipmentIds: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const fetchedGroups = await equipmentService.getEquipmentGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      setError('Failed to fetch equipment groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await equipmentService.createEquipmentGroup(newGroup as EquipmentGroup);
      setIsDialogOpen(false);
      fetchGroups();
      setNewGroup({
        name: '',
        description: '',
        parentId: null,
        type: 'FUNCTIONAL',
        equipmentIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (err) {
      setError('Failed to create equipment group');
      console.error(err);
    }
  };

  const renderGroupHierarchy = (parentId: string | null = null, level: number = 0) => {
    const childGroups = groups.filter(group => group.parentId === parentId);
    
    if (childGroups.length === 0) return null;

    return (
      <div style={{ marginLeft: `${level * 20}px` }}>
        {childGroups.map(group => (
          <div key={group.id}>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{group.description}</p>
                <p>Type: {group.type}</p>
                <p>Equipment Count: {group.equipmentIds.length}</p>
              </CardContent>
            </Card>
            {renderGroupHierarchy(group.id, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment Groups</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Group</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Equipment Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={e => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newGroup.description}
                  onChange={e => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newGroup.type}
                  onValueChange={value => setNewGroup(prev => ({ ...prev, type: value as EquipmentGroup['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FUNCTIONAL">Functional</SelectItem>
                    <SelectItem value="LOCATION">Location</SelectItem>
                    <SelectItem value="SYSTEM">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parentId">Parent Group</Label>
                <Select
                  value={newGroup.parentId || ''}
                  onValueChange={value => setNewGroup(prev => ({ ...prev, parentId: value || null }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Parent</SelectItem>
                    {groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Group Hierarchy</CardTitle>
          </CardHeader>
          <CardContent>
            {renderGroupHierarchy()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Groups Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Equipment Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map(group => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.type}</TableCell>
                    <TableCell>{group.equipmentIds.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentGroups; 