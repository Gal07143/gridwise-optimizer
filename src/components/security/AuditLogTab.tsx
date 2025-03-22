
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileDown,
  Filter
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  timestamp: Date;
  action: string;
  status: string;
  actor: string;
  details: string;
  source_ip: string;
}

interface AuditLogTabProps {
  audits: ActivityItem[];
}

const AuditLogTab: React.FC<AuditLogTabProps> = ({ audits }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Success
          </Badge>
        );
      case 'failure':
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            Failed
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            Warning
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  const filteredAudits = audits.filter(audit => {
    const matchesSearch = searchQuery === '' || 
      audit.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.details.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || audit.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const handleExportLogs = () => {
    toast.success('Audit logs export started');
    setTimeout(() => {
      toast.info('Audit logs have been exported');
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Audit Logs</CardTitle>
              <CardDescription>Comprehensive log of system security events</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExportLogs}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No matching audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAudits.map((audit) => (
                    <TableRow key={audit.id}>
                      <TableCell className="font-mono text-xs">
                        {formatDate(audit.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{audit.action}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {audit.details}
                        </div>
                      </TableCell>
                      <TableCell>{audit.actor}</TableCell>
                      <TableCell className="font-mono">{audit.source_ip}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusBadge(audit.status)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogTab;
