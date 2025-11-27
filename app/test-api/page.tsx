'use client';

import { useState } from 'react';
import { fetchLeads } from '@/lib/api';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/api/leads`;
      
      console.log('🧪 Testing direct fetch to:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('✅ Direct fetch response:', data);
      setResult({ method: 'Direct Fetch', url, data });
    } catch (err: any) {
      console.error('❌ Direct fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testFetchLeads = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log('🧪 Testing fetchLeads helper...');
      
      const data = await fetchLeads();
      
      console.log('✅ fetchLeads response:', data);
      setResult({ method: 'fetchLeads Helper', data });
    } catch (err: any) {
      console.error('❌ fetchLeads error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm font-semibold text-blue-900 mb-2">Configuration:</p>
        <p className="text-sm text-blue-800">
          Base URL: <code className="bg-blue-100 px-2 py-1 rounded font-mono">
            {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}
          </code>
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Direct Fetch'}
        </button>

        <button
          onClick={testFetchLeads}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test fetchLeads()'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-bold text-red-800">Error:</h3>
          <pre className="text-sm text-red-600 mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-green-800 mb-2">Success! Response:</h3>
          <p className="text-sm text-green-700 mb-2">Method: {result.method}</p>
          {result.url && (
            <p className="text-sm text-green-700 mb-2">URL: {result.url}</p>
          )}
          <pre className="text-sm mt-2 overflow-auto max-h-96 bg-white p-3 rounded border">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
        <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Open browser DevTools (F12) and go to Console tab</li>
          <li>Click "Test Direct Fetch" to test raw fetch to external API</li>
          <li>Click "Test fetchLeads()" to test using the app's API helper</li>
          <li>Check console for detailed logs</li>
          <li>If successful, data should appear below the buttons</li>
        </ol>
      </div>
    </div>
  );
}
