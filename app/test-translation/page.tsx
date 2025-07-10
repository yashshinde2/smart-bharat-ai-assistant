export default function TestTranslationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Translation Test Page</h1>
      
      <div className="space-y-6">
        <section className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">About Smart Bharat</h2>
          <p className="mb-4">
            Smart Bharat is an AI-powered assistant designed specifically for rural users in India. 
            It helps bridge the digital divide by providing accessible technology solutions.
          </p>
          <p>
            Our mission is to empower rural communities with technology that understands their needs, 
            speaks their language, and works even with limited internet connectivity.
          </p>
        </section>
        
        <section className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Voice-enabled interface for easy interaction</li>
            <li>Multi-language support for diverse Indian languages</li>
            <li>Offline capabilities for areas with poor connectivity</li>
            <li>Healthcare information and emergency alerts</li>
            <li>Agricultural guidance and weather updates</li>
          </ul>
        </section>
        
        <section className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">How to Use</h2>
          <p className="mb-4">
            Simply click the microphone button and speak in your preferred language. 
            The assistant will understand your request and provide relevant information.
          </p>
          <p>
            You can also use the language selector in the top right corner to change the interface language.
          </p>
        </section>
      </div>
    </div>
  )
} 