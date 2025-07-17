"use client"; // Важно для использования console.log

export default function EnvTestPage() {
  // Проверка при загрузке компонента
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Environment Variables Test</h1>
      <p className="mb-2">
        <strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL}
      </p>
      <button
        onClick={() => console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Проверить в консоли
      </button>
    </div>
  );
}
