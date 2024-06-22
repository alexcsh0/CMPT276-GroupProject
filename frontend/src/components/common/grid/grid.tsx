import React from 'react';

interface GridProps {
  rows: number
  columns: number
}

/**
 * Grid Component
 * @param props - GridProps
 * @returns grid element
 */
export function Grid(props: GridProps) {
  const { rows, columns } = props;

  return (
    <div>
      <h1>Grid</h1>
      <p>Rows: {rows}</p>
      <p>Columns: {columns}</p>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              style={{
                border: '1px solid black',
                width: '50px',
                height: '50px'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
