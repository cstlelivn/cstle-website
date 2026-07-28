export function LogoTest() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-8">BIMI Logo Preview</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <img 
          src="/logo-bimi.svg" 
          alt="Cstle Livn BIMI Logo" 
          className="w-[300px] h-[300px]"
        />
      </div>
      
      <div className="mt-8 max-w-2xl bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold mb-4">Deployment Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Download the file from <code className="bg-gray-100 px-2 py-1 rounded">/public/logo-bimi.svg</code></li>
          <li>Upload it to your web hosting root directory</li>
          <li>Verify it's accessible at <code className="bg-gray-100 px-2 py-1 rounded">https://cstlelivn.ca/logo-bimi.svg</code></li>
          <li>Test with BIMI validation tools</li>
        </ol>
        
        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm"><strong>Note:</strong> The SVG is correctly formatted for BIMI compliance. Once uploaded to your domain, it will work with DMARC email authentication.</p>
        </div>
      </div>
    </div>
  );
}
