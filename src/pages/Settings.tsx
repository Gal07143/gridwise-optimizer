import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { SecuritySettings } from '../types/settings';
import { useAuth } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  Book, 
  Cloud, 
  Cog, 
  Database, 
  Globe, 
  Key, 
  Lock, 
  RefreshCw, 
  Server, 
  Shield, 
  User, 
  Zap,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassPanel from '@/components/ui/GlassPanel';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { settingCategories } from '@/config/settings';

export default function Settings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                if (!user) {
                    navigate('/login');
                    return;
                }

                const settings = await supabaseService.getSecuritySettings(user.id);
                if (settings) {
                    setSecuritySettings({
                        authentication: {
                            twoFactorEnabled: settings.two_factor_enabled,
                            sessionTimeout: settings.session_timeout,
                            passwordPolicy: settings.password_policy
                        },
                        encryption: {
                            enabled: settings.encryption_enabled,
                            algorithm: settings.encryption_algorithm,
                            keyRotation: settings.key_rotation
                        },
                        apiSecurity: {
                            rateLimiting: settings.rate_limiting,
                            allowedOrigins: settings.allowed_origins,
                            tokenExpiration: settings.token_expiration
                        },
                        auditLogging: {
                            enabled: settings.audit_logging_enabled,
                            retentionPeriod: settings.retention_period,
                            logLevel: settings.log_level
                        }
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, [user, navigate]);

    const handleSaveSettings = async (settings: SecuritySettings) => {
        try {
            if (!user) return;
            await supabaseService.updateSecuritySettings(user.id, settings);
            setSecuritySettings(settings);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save settings');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const SettingItem = ({ name, description, path }: { name: string; description: string; path: string }) => (
        <Link 
            to={path} 
            className="flex justify-between items-center p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border/30 last:border-0"
        >
            <div>
                <div className="font-medium text-sm">{name}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
            </div>
            <div className="text-primary">
                <ChevronRight size={20} />
            </div>
        </Link>
    );

    const QuickActionItem = ({ icon, title, description, path }: 
        { icon: React.ReactNode; title: string; description: string; path: string }) => (
        <Link to={path}>
            <GlassPanel className="p-4 flex items-center space-x-4 hover:bg-secondary/10 transition-colors">
                <div className="rounded-full p-3 bg-primary/10 text-primary">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </GlassPanel>
        </Link>
    );

    return (
        <ErrorBoundary>
            <AppLayout>
                <div className="space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <p className="text-muted-foreground">
                            Configure your system settings and preferences
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {settingCategories.map((category) => (
                            <GlassPanel key={category.id} className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    {category.icon}
                                    <div>
                                        <h2 className="text-lg font-semibold">{category.name}</h2>
                                        <p className="text-sm text-muted-foreground">{category.description}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {category.settings.map((setting) => (
                                        <SettingItem
                                            key={setting.id}
                                            name={setting.name}
                                            description={setting.description}
                                            path={setting.path}
                                        />
                                    ))}
                                </div>
                            </GlassPanel>
                        ))}
                    </div>

                    {securitySettings && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Two-Factor Authentication</span>
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.authentication.twoFactorEnabled}
                                        onChange={(e) => handleSaveSettings({
                                            ...securitySettings,
                                            authentication: {
                                                ...securitySettings.authentication,
                                                twoFactorEnabled: e.target.checked
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </ErrorBoundary>
    );
}
