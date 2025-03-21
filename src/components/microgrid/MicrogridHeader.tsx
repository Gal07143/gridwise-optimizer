
import React from 'react';
import { Power } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-extended';
import { useMicrogrid } from './MicrogridProvider';

const MicrogridHeader: React.FC = () => {
  const { state } = useMicrogrid();

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200/60 dark:border-slate-800/60 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Power className="mr-3 h-8 w-8 text-primary" />
            Microgrid Control
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced monitoring and management of your microgrid system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${state.gridConnection ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-3 py-1.5 flex items-center gap-1`} variant={state.gridConnection ? 'success' : 'default'}>
            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
            {state.gridConnection ? 'Grid Connected' : 'Island Mode'}
          </Badge>
          <Badge className="px-3 py-1.5 flex items-center gap-1" variant="default">
            <div className="h-3 w-3"></div>
            {state.operatingMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default MicrogridHeader;
