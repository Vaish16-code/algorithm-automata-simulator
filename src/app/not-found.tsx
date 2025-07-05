import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Or try one of these sections:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Link href="/cn" className="text-blue-600 hover:underline">Computer Networks</Link>
              <span>•</span>
              <Link href="/daa" className="text-blue-600 hover:underline">DAA</Link>
              <span>•</span>
              <Link href="/os" className="text-blue-600 hover:underline">Operating Systems</Link>
              <span>•</span>
              <Link href="/auto" className="text-blue-600 hover:underline">Automata Theory</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
