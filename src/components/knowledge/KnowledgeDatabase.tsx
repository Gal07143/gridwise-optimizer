
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, FileText, HelpCircle, Search, Tag, Zap, Package, Settings, FileQuestion, Info, AlertCircle, CheckCircle, Lightbulb, LifeBuoy, BookOpenCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Knowledge database articles
const articles = [
  {
    id: 'kb-001',
    title: 'Getting Started with Energy Management System',
    category: 'guides',
    tags: ['beginner', 'setup', 'introduction'],
    summary: 'A comprehensive guide to setting up and configuring your new energy management system.',
    views: 1254,
    lastUpdated: '2023-08-15',
    content: `
      # Getting Started with Energy Management System
      
      Welcome to your new Energy Management System (EMS). This guide will help you navigate through the initial setup and configuration process.
      
      ## Initial Setup
      
      1. **Connect to your devices**: Ensure all supported devices are properly connected to your network.
      2. **Configure site settings**: Set up your location, timezone, and preferred units of measurement.
      3. **Add users**: Invite team members and assign appropriate permissions.
      
      ## Basic Navigation
      
      The main dashboard provides an overview of your energy usage and production. From there, you can access:
      
      - **Devices**: Monitor and control individual devices
      - **Analytics**: View detailed reports and insights
      - **Settings**: Configure system preferences
      
      ## Next Steps
      
      After completing the initial setup, we recommend:
      
      - Setting up alert notifications
      - Configuring scheduled reports
      - Exploring optimization features
      
      If you need additional help, please refer to our detailed documentation or contact support.
    `
  },
  {
    id: 'kb-002',
    title: 'Understanding Battery Storage Performance Metrics',
    category: 'technical',
    tags: ['battery', 'performance', 'metrics'],
    summary: 'Learn how to interpret battery performance indicators and optimize your storage system.',
    views: 876,
    lastUpdated: '2023-09-02',
    content: `
      # Understanding Battery Storage Performance Metrics
      
      Battery performance can be measured in several ways. This article explains key metrics and how to interpret them.
      
      ## Key Performance Indicators
      
      ### State of Charge (SoC)
      
      The State of Charge represents the current battery level as a percentage of its total capacity. Maintaining optimal SoC ranges can extend battery life.
      
      ### Depth of Discharge (DoD)
      
      DoD represents how deeply a battery is discharged relative to its total capacity. Most batteries have recommended DoD limits to prevent degradation.
      
      ### Cycle Efficiency
      
      This metric shows how efficiently the battery converts input energy to output energy. Higher percentages indicate better performance.
      
      ### Capacity Degradation
      
      Over time, batteries lose their ability to hold a full charge. Monitoring capacity degradation helps predict replacement needs.
      
      ## Optimizing Battery Performance
      
      - Avoid frequent deep discharges
      - Maintain appropriate temperature ranges
      - Schedule regular maintenance
      - Configure appropriate charge/discharge rates
      
      Using these metrics effectively can significantly extend the lifespan of your battery storage system and improve overall energy efficiency.
    `
  },
  {
    id: 'kb-003',
    title: 'Troubleshooting Common Communication Issues',
    category: 'troubleshooting',
    tags: ['connectivity', 'modbus', 'network'],
    summary: 'Solutions for common device communication problems and connectivity issues.',
    views: 1120,
    lastUpdated: '2023-10-10',
    content: `
      # Troubleshooting Common Communication Issues
      
      This guide addresses frequent communication issues between the energy management system and connected devices.
      
      ## Modbus Connection Failures
      
      If devices aren't responding over Modbus:
      
      1. Verify physical connections
      2. Check device address settings
      3. Confirm baud rate and parity settings
      4. Test with a Modbus scanner tool
      
      ## Network Connectivity Issues
      
      For TCP/IP communication problems:
      
      1. Verify IP address configuration
      2. Check network firewall settings
      3. Ensure ports are open (typically 502 for Modbus TCP)
      4. Confirm subnet mask settings
      
      ## Data Logging Gaps
      
      If you notice missing data:
      
      1. Check device polling frequency
      2. Verify logger service is running
      3. Inspect database storage capacity
      4. Review error logs for timeout issues
      
      ## Advanced Diagnostics
      
      For persistent issues:
      
      1. Enable debug logging
      2. Capture packet traces
      3. Verify firmware versions
      4. Test with alternative communication methods
      
      Most communication issues can be resolved by systematically checking each component in the communication chain.
    `
  },
  {
    id: 'kb-004',
    title: 'Optimizing Solar Production',
    category: 'optimization',
    tags: ['solar', 'efficiency', 'maintenance'],
    summary: 'Maximize your solar energy production with these optimization strategies and maintenance tips.',
    views: 932,
    lastUpdated: '2023-09-18',
    content: `
      # Optimizing Solar Production
      
      This guide provides practical advice for maximizing your solar energy production.
      
      ## Panel Positioning and Maintenance
      
      ### Optimal Positioning
      
      - Ensure panels face true south (northern hemisphere) or true north (southern hemisphere)
      - Set tilt angle to approximately your latitude angle
      - Consider adjustable mounts for seasonal optimization
      
      ### Regular Maintenance
      
      - Clean panels quarterly or more frequently in dusty environments
      - Remove snow accumulation promptly
      - Check for and remove debris or vegetation causing shading
      
      ## System Performance Monitoring
      
      ### Key Metrics to Track
      
      - Daily/monthly production compared to theoretical maximum
      - Performance ratio (actual vs. expected production)
      - Inverter efficiency
      - Panel degradation rate
      
      ### Alert Configuration
      
      Set up alerts for:
      - Sudden drops in production
      - Inverter errors
      - Panel string anomalies
      
      ## Advanced Optimization
      
      - Install power optimizers for partial shading conditions
      - Upgrade inverters for better efficiency
      - Consider adding tracking systems for large installations
      - Implement predictive maintenance using AI analytics
      
      Regular monitoring and maintenance can increase solar production by 10-30% compared to neglected systems.
    `
  },
  {
    id: 'kb-005',
    title: 'Energy Management System Security Best Practices',
    category: 'security',
    tags: ['security', 'privacy', 'protection'],
    summary: 'Essential security measures to protect your energy management system from unauthorized access.',
    views: 754,
    lastUpdated: '2023-10-25',
    content: `
      # Energy Management System Security Best Practices
      
      Protecting your energy management system from unauthorized access is critical. Follow these guidelines to enhance security.
      
      ## Access Control
      
      ### User Management
      
      - Implement role-based access control
      - Enforce strong password policies
      - Enable multi-factor authentication
      - Review and audit user accounts quarterly
      
      ### Network Security
      
      - Isolate energy management systems on separate VLANs
      - Implement firewall rules to restrict access
      - Use VPN for remote management
      - Disable unnecessary services and ports
      
      ## Data Protection
      
      ### Encryption
      
      - Enable TLS/SSL for all communications
      - Encrypt sensitive data at rest
      - Use secure protocols (HTTPS, SFTP, SSH)
      
      ### Backup and Recovery
      
      - Implement regular automated backups
      - Test restoration procedures
      - Store backups securely off-site
      
      ## Software Management
      
      - Keep all system components updated
      - Apply security patches promptly
      - Verify integrity of software updates
      - Maintain an inventory of all installed software
      
      ## Monitoring and Response
      
      - Enable security logging
      - Implement intrusion detection
      - Develop an incident response plan
      - Conduct regular security assessments
      
      Following these practices will significantly reduce the risk of security breaches and ensure the integrity of your energy data.
    `
  }
];

// Categories for the knowledge base
const categories = [
  {
    id: 'guides',
    name: 'Setup Guides',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Step-by-step instructions for configuring and using the system',
    count: articles.filter(a => a.category === 'guides').length,
    color: 'text-blue-500'
  },
  {
    id: 'technical',
    name: 'Technical References',
    icon: <FileText className="h-5 w-5" />,
    description: 'Detailed information about system components and specifications',
    count: articles.filter(a => a.category === 'technical').length,
    color: 'text-purple-500'
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    icon: <HelpCircle className="h-5 w-5" />,
    description: 'Solutions for common issues and problems',
    count: articles.filter(a => a.category === 'troubleshooting').length,
    color: 'text-red-500'
  },
  {
    id: 'optimization',
    name: 'Optimization Guides',
    icon: <Zap className="h-5 w-5" />,
    description: 'Tips and methods to improve system performance',
    count: articles.filter(a => a.category === 'optimization').length,
    color: 'text-green-500'
  },
  {
    id: 'security',
    name: 'Security',
    icon: <Settings className="h-5 w-5" />,
    description: 'Best practices for securing your energy management system',
    count: articles.filter(a => a.category === 'security').length,
    color: 'text-amber-500'
  }
];

// Popular tags used across articles
const popularTags = [
  'setup', 'configuration', 'battery', 'solar', 'efficiency', 
  'troubleshooting', 'maintenance', 'optimization', 'security', 'connectivity'
];

export default function KnowledgeDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  
  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleArticleSelect = (article: typeof articles[0]) => {
    setSelectedArticle(article);
  };
  
  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Book className="mr-2 h-5 w-5 text-primary" />
              Knowledge Database
            </CardTitle>
            <CardDescription>
              Browse guides, technical documentation, and troubleshooting resources
            </CardDescription>
          </div>
          
          <div className="relative w-full sm:w-64 md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {selectedArticle ? (
          <div className="space-y-4">
            <Button variant="outline" size="sm" onClick={handleBackToList} className="mb-4">
              ← Back to articles
            </Button>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">{selectedArticle.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span>Last updated: {selectedArticle.lastUpdated}</span>
                  <span>•</span>
                  <span>{selectedArticle.views} views</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {selectedArticle.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="mr-1 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {/* In a real app, you would render Markdown here */}
                <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                  {selectedArticle.content}
                </pre>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Was this article helpful?</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" /> Yes
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlertCircle className="h-4 w-4 mr-1" /> No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="tags">Popular Tags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles" className="space-y-4">
              <div className="flex gap-2 flex-wrap mb-4">
                <Button 
                  variant={activeCategory === 'all' ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </Button>
                {categories.map(category => (
                  <Button 
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {React.cloneElement(category.icon, { className: 'h-4 w-4 mr-1' })}
                    {category.name}
                  </Button>
                ))}
              </div>
              
              {filteredArticles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileQuestion className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
                  <p>No articles match your search criteria</p>
                  <Button variant="link" onClick={() => {setSearchQuery(''); setActiveCategory('all');}}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map(article => (
                    <Card key={article.id} className="group hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleArticleSelect(article)}>
                      <CardHeader className="pb-2">
                        <div>
                          {/* Icon based on category */}
                          {article.category === 'guides' && <BookOpen className="h-8 w-8 text-blue-500 mb-2" />}
                          {article.category === 'technical' && <FileText className="h-8 w-8 text-purple-500 mb-2" />}
                          {article.category === 'troubleshooting' && <HelpCircle className="h-8 w-8 text-red-500 mb-2" />}
                          {article.category === 'optimization' && <Zap className="h-8 w-8 text-green-500 mb-2" />}
                          {article.category === 'security' && <Settings className="h-8 w-8 text-amber-500 mb-2" />}
                          
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {article.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.summary}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {article.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
                        <span>{article.views} views</span>
                        <span>Updated {article.lastUpdated}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="categories">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card 
                    key={category.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setActiveCategory(category.id);
                      document.querySelector('[data-value="articles"]')?.click();
                    }}
                  >
                    <CardHeader>
                      <CardTitle className={`text-lg flex items-center ${category.color}`}>
                        {React.cloneElement(category.icon, { className: 'mr-2 h-5 w-5' })}
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <p className="mt-2 text-sm">{category.count} articles</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tags">
              <div className="flex flex-wrap gap-3 p-4">
                {popularTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="text-sm py-2 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      setSearchQuery(tag);
                      document.querySelector('[data-value="articles"]')?.click();
                    }}
                  >
                    <Tag className="h-3.5 w-3.5 mr-1.5" />
                    {tag}
                    <span className="ml-1.5 text-xs bg-background text-foreground rounded-full px-1.5">
                      {articles.filter(a => a.tags.includes(tag)).length}
                    </span>
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full text-sm text-muted-foreground">
          <div className="flex items-center">
            <Info className="h-4 w-4 mr-1.5 text-primary" />
            <span>Can't find what you're looking for?</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <LifeBuoy className="h-4 w-4 mr-1.5" />
              Contact Support
            </Button>
            <Button variant="outline" size="sm">
              <Lightbulb className="h-4 w-4 mr-1.5" />
              Suggest New Article
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
