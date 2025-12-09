// Test.tsx
export default function Test() {
  return (
    <div className="p-8">
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
        Test 1: Gradient background (Tailwind v4 feature)
      </div>
      <div className="mb-4 p-4 bg-blue-500 text-white rounded-lg">
        Test 2: Solid color
      </div>
      <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
        Test 3: Hover effect
      </button>
    </div>
  );
}