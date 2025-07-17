'use client';

import { useState, useEffect } from 'react';
import { Network } from '@aptos-labs/ts-sdk';
import { getNetworkOptions, getCurrentNetwork, isProductionNetwork, isTestnetNetwork, getNetworkConfig } from '@/lib/networks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function NetworkSwitcher() {
  const [currentNetwork, setCurrentNetwork] = useState<Network>(getCurrentNetwork());
  const [isProduction, setIsProduction] = useState(isProductionNetwork());
  const [isTestnet, setIsTestnet] = useState(isTestnetNetwork());

  const networkOptions = getNetworkOptions();

  // Update state when network changes
  useEffect(() => {
    setCurrentNetwork(getCurrentNetwork());
    setIsProduction(isProductionNetwork());
    setIsTestnet(isTestnetNetwork());
  }, []);

  const handleNetworkChange = (network: string) => {
    const newNetwork = network as Network;
    
    // In a real app, you'd update environment variables or use a state management solution
    // For now, we'll just update the local state and show a message
    setCurrentNetwork(newNetwork);
    setIsProduction(newNetwork === Network.MAINNET);
    setIsTestnet(newNetwork === Network.TESTNET);
    
    // Show user that they need to refresh to apply changes
    alert(`Network changed to ${network}. Please refresh the page to apply changes.`);
  };

  const getNetworkIcon = () => {
    if (isProduction) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (isTestnet) return <Info className="h-4 w-4 text-blue-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getNetworkBadgeVariant = () => {
    if (isProduction) return 'default';
    if (isTestnet) return 'secondary';
    return 'outline';
  };

  const getNetworkDescription = () => {
    if (isProduction) return 'Production network - real transactions';
    if (isTestnet) return 'Test network - for testing with test tokens';
    return 'Development network - for development and testing';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {getNetworkIcon()}
        <span className="text-sm font-medium">Network:</span>
      </div>
      
      <Select value={currentNetwork} onValueChange={handleNetworkChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {networkOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center space-x-2">
                <span>{option.label}</span>
                {option.isProduction && (
                  <Badge variant="default" className="text-xs">PROD</Badge>
                )}
                {option.isTestnet && (
                  <Badge variant="secondary" className="text-xs">TEST</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Badge variant={getNetworkBadgeVariant()} className="text-xs">
        {getNetworkDescription()}
      </Badge>
    </div>
  );
}

// Enhanced network indicator for use in headers/footers
export function NetworkIndicator() {
  const [isProduction, setIsProduction] = useState(isProductionNetwork());
  const [isTestnet, setIsTestnet] = useState(isTestnetNetwork());
  const [networkConfig, setNetworkConfig] = useState(getNetworkConfig());

  useEffect(() => {
    setIsProduction(isProductionNetwork());
    setIsTestnet(isTestnetNetwork());
    setNetworkConfig(getNetworkConfig());
  }, []);

  const getNetworkIcon = () => {
    if (isProduction) return <CheckCircle className="h-3 w-3" />;
    if (isTestnet) return <Info className="h-3 w-3" />;
    return <AlertTriangle className="h-3 w-3" />;
  };

  const getNetworkBadgeVariant = () => {
    if (isProduction) return 'default';
    if (isTestnet) return 'secondary';
    return 'outline';
  };

  const getNetworkLabel = () => {
    if (isProduction) return 'Mainnet';
    if (isTestnet) return 'Testnet';
    return 'Devnet';
  };

  const getNetworkDescription = () => {
    if (isProduction) return 'Production network - Real transactions with actual value';
    if (isTestnet) return 'Test network - Testing with free test tokens';
    return 'Development network - Free testing and development';
  };

  const getNetworkStatus = () => {
    if (isProduction) return 'Live';
    if (isTestnet) return 'Testing';
    return 'Dev';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-1">
            <Badge 
              variant={getNetworkBadgeVariant()} 
              className="text-xs font-medium px-2 py-1 cursor-help transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center space-x-1">
                {getNetworkIcon()}
                <span className="hidden sm:inline">{getNetworkLabel()}</span>
                <span className="sm:hidden">{getNetworkStatus()}</span>
              </div>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-medium">{networkConfig.displayName}</div>
            <div className="text-xs text-muted-foreground">{getNetworkDescription()}</div>
            <div className="text-xs text-muted-foreground">
              RPC: {networkConfig.fullnodeUrl.split('//')[1]}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact network indicator for mobile/small screens
export function NetworkIndicatorCompact() {
  const [isProduction, setIsProduction] = useState(isProductionNetwork());
  const [isTestnet, setIsTestnet] = useState(isTestnetNetwork());

  useEffect(() => {
    setIsProduction(isProductionNetwork());
    setIsTestnet(isTestnetNetwork());
  }, []);

  const getNetworkIcon = () => {
    if (isProduction) return <CheckCircle className="h-3 w-3 text-green-500" />;
    if (isTestnet) return <Info className="h-3 w-3 text-blue-500" />;
    return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
  };

  const getNetworkBadgeVariant = () => {
    if (isProduction) return 'default';
    if (isTestnet) return 'secondary';
    return 'outline';
  };

  const getNetworkStatus = () => {
    if (isProduction) return 'LIVE';
    if (isTestnet) return 'TEST';
    return 'DEV';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getNetworkBadgeVariant()} 
            className="text-xs font-mono px-1.5 py-0.5 cursor-help"
          >
            {getNetworkIcon()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-xs">
            <div className="font-medium">{getNetworkStatus()}</div>
            <div className="text-muted-foreground">
              {isProduction ? 'Production Network' : isTestnet ? 'Test Network' : 'Development Network'}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 