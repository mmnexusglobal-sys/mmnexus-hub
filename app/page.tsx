export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">MMNexus Hub</h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Welcome to the MMNexus Hub. Integrate with Firebase and Gemma AI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Firebase Integration</h2>
            <p className="text-gray-600">
              Connect to Firebase for authentication and database services.
            </p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Gemma AI</h2>
            <p className="text-gray-600">
              Use Google&apos;s Gemma model for AI-powered features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
