export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative mb-6">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <img 
              src="/image.png" 
              alt="AptoTip Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          
          {/* Spinning ring */}
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          
          {/* Pulsing dot in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Loading AptoTip...
        </h2>
        
        <p className="text-gray-600">
          Getting things ready for you
        </p>
      </div>
    </div>
  )
}
