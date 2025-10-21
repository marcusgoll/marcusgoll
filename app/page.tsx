export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Marcus Gollahon
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Welcome to my personal blog covering aviation, software development, education, and startups.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Aviation
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Insights and experiences from the world of flight.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Development
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Web development, coding tutorials, and tech insights.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Education
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Teaching, learning, and educational technology.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                Startups
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Entrepreneurship, innovation, and building businesses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
