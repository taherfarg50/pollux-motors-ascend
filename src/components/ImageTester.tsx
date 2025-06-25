import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useCars } from '@/lib/supabase';

const ImageTester: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sampleUrls, setSampleUrls] = useState<string[]>([]);
  
  const { data: cars } = useCars();

  // Get first 3 image URLs as samples
  React.useEffect(() => {
    if (cars && cars.length > 0) {
      const urls = cars.slice(0, 3).map(car => car.image);
      setSampleUrls(urls);
      if (!testUrl && urls.length > 0) {
        setTestUrl(urls[0]);
      }
    }
  }, [cars, testUrl]);

  const testImageUrl = (url: string) => {
    if (!url) return;
    
    setTestResult('loading');
    
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Image loaded successfully:', url);
      setTestResult('success');
    };
    
    img.onerror = (error) => {
      console.error('❌ Image failed to load:', url, error);
      setTestResult('error');
    };
    
    // Add CORS headers test
    img.crossOrigin = 'anonymous';
    img.src = url;
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (testResult === 'loading') {
        console.warn('⏰ Image load timeout:', url);
        setTestResult('error');
      }
    }, 10000);
  };

  const getStatusIcon = () => {
    switch (testResult) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <ImageIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (testResult) {
      case 'loading':
        return 'Testing image URL...';
      case 'success':
        return 'Image loaded successfully!';
      case 'error':
        return 'Image failed to load';
      default:
        return 'Enter an image URL to test';
    }
  };

  return (
    <Card className="p-6 bg-black/80 border-gray-700">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-white">Image URL Tester</h3>
        </div>

        {/* URL Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste image URL here..."
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="flex-1 bg-gray-900 border-gray-600 text-white"
            />
            <Button
              onClick={() => testImageUrl(testUrl)}
              disabled={!testUrl || testResult === 'loading'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Test
            </Button>
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span className="text-gray-300">{getStatusText()}</span>
          </div>
        </div>

        {/* Sample URLs */}
        {sampleUrls.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Sample Car Image URLs:</h4>
            <div className="space-y-2">
              {sampleUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-900/50 rounded text-xs">
                  <span className="text-gray-400 min-w-[20px]">{index + 1}.</span>
                  <code className="flex-1 text-gray-300 break-all">{url}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setTestUrl(url)}
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResult === 'success' && testUrl && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-green-400">Preview:</h4>
            <div className="max-w-[200px] mx-auto">
              <img
                src={testUrl}
                alt="Test preview"
                className="w-full h-auto rounded border border-gray-600"
                onLoad={() => console.log('Preview loaded')}
                onError={() => console.log('Preview failed')}
              />
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="text-xs text-gray-500 space-y-1 border-t border-gray-700 pt-4">
          <p><strong>CORS:</strong> Testing with crossOrigin="anonymous"</p>
          <p><strong>Timeout:</strong> 10 seconds</p>
          <p><strong>Console:</strong> Check browser console for detailed errors</p>
          {testUrl && (
            <p><strong>Testing:</strong> <code className="text-gray-400">{testUrl.substring(0, 50)}...</code></p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ImageTester; 