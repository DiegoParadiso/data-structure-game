import React from 'react';

export default function HeapAvailableNodes({ tree, message, gameStatus, isGameOver, onVerify }) {
  const treeToArray = (root) => {
    const result = [];
    const queue = [root];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current) {
        result.push({ id: current.id, value: current.value });
        queue.push(current.left);
        queue.push(current.right);
      } else {
        result.push(null);
      }
    }
    return result;
  };

  return (
    <div className="flex flex-col w-full md:w-[25%]">
      <div className="p-2 border rounded bg-gray-50 h-[300px] overflow-x-auto">
        <h2 className="font-bold mb-2 pt-1 pb-2">Heap:</h2>
        <div className="max-w-full overflow-x-auto">
          <table className="table-auto border-gray-400 text-[11px] whitespace-nowrap mx-auto">
            <tbody>
              {(() => {
                const nodesArray = treeToArray(tree).filter((n) => n); // filtrar nulos
                const chunkSize = 6;
                const rows = [];

                for (let i = 0; i < nodesArray.length; i += chunkSize) {
                  const chunk = nodesArray.slice(i, i + chunkSize);

                  rows.push(
                    <tr key={`index-row-${i}`}>
                      {chunk.map((_, j) => (
                        <td key={`index-${i + j}`} className="border px-2 py-1 text-center text-gray-400">
                          {i + j}
                        </td>
                      ))}
                    </tr>
                  );

                  rows.push(
                    <tr key={`value-row-${i}`}>
                      {chunk.map((node, j) => (
                        <td key={`value-${i + j}`} className="border px-2 py-1 text-center">
                          {node.value}
                        </td>
                      ))}
                    </tr>
                  );
                }

                return rows;
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {message && (
        <div className="mt-4 flex items-center justify-center">
          <span className={`font-semibold ${gameStatus === "fail" ? "text-red-700" : "text-green-700"}`}>
            {message}
          </span>
        </div>
      )}

      {!isGameOver && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onVerify}
            className="px-4 py-2 w-full rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            Verificar
          </button>
        </div>
      )}
    </div>
  );
}
