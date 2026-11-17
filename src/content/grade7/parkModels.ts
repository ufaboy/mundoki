import {text} from '../lessonModel';
import {GRADE_SEVEN_LESSONS} from './index';
const rows:string[][][]=[
 [
  [
   "2405",
   "2 × 1000 + 4 × 100 + 0 × 10 + 5"
  ],
  [
   "451 ÷ 9",
   "4 + 5 + 1"
  ]
 ],
 [
  [
   "35 = 5 × 7",
   "45 = 5 × 9"
  ],
  [
   "2 + 4 = 6",
   "2 ÷ 3",
   "4 ÷ 3"
  ]
 ],
 [
  [
   "15",
   "11"
  ],
  [
   "2",
   "Divisores positivos: 1, 2|Positive divisors: 1, 2"
  ]
 ],
 [
  [
   "7/8",
   "7 ÷ 8"
  ],
  [
   "0.33 + 0.33 + 0.33",
   "1"
  ]
 ],
 [
  [
   "1/2 + 3 × 1/6"
  ],
  [
   "(0.6 + 0.4) ÷ 2"
  ]
 ],
 [
  [
   "2.4 ÷ 0.3",
   "0.3 × ? = 2.4"
  ],
  [
   "5 × 0.2",
   "0.2 = 1/5"
  ]
 ],
 [
  [
   "20 cuadras → 8 min|20 blocks → 8 min",
   "1 min → ?"
  ],
  [
   "Clara: 30 cuadras → 15 min|Clara: 30 blocks → 15 min",
   "Aurelio: 20 cuadras → 8 min|Aurelio: 20 blocks → 8 min"
  ]
 ],
 [
  [
   "y = 4x",
   "x = 2.5"
  ],
  [
   "y = 4x + 2",
   "x = 1 → y = 6",
   "x = 2 → y = 10"
  ]
 ],
 [
  [
   "80 lupas",
   "Descuento: 25%|Discount: 25%"
  ],
  [
   "5 cm",
   "1:20.000|1:20,000",
   "1 km = 100.000 cm|1 km = 100,000 cm"
  ]
 ],
 [
  [
   "Reja de 4 cuadrados|Gate of 4 squares"
  ],
  [
   "Un barrote compartido|One shared bar"
  ]
 ],
 [
  [
   "Reja de 12 cuadrados|Gate of 12 squares",
   "Primero + agregados|First + additions"
  ],
  [
   "4, 7, 10, …",
   "¿Cómo continúa?|How does it continue?"
  ]
 ],
 [
  [
   "3n + 1",
   "n = 6"
  ],
  [
   "n: cuadrados completos|n: whole squares",
   "n = 2.5 ?"
  ]
 ],
 [
  [
   "P = 2w + 4",
   "Altura: 2 cm|Height: 2 cm",
   "Ancho: w cm|Width: w cm"
  ],
  [
   "P = 2w + 4",
   "P: perímetro|P: perimeter"
  ]
 ],
 [
  [
   "P = 2w + 4",
   "w = 7 cm"
  ],
  [
   "w + 2 + w + 2",
   "Longitudes en cm|Lengths in cm"
  ]
 ],
 [
  [
   "P = 2w + 4",
   "w = 4"
  ],
  [
   "w = 1 → P = 6",
   "w = 2 → P = 8",
   "P / w"
  ]
 ],
 [
  [
   "72° + ? = 180°"
  ],
  [
   "72°",
   "Ángulos opuestos por el vértice|Vertically opposite angles"
  ]
 ],
 [
  [
   "35° + 85° + ? = 180°"
  ],
  [
   "Cuadrilátero convexo|Convex quadrilateral",
   "Una diagonal|One diagonal"
  ]
 ],
 [
  [
   "2 cm",
   "4 cm",
   "7 cm"
  ],
  [
   "Radio: 4 cm|Radius: 4 cm",
   "Distancia al centro|Distance to the center"
  ]
 ],
 [
  [
   "2 × 7",
   "Factor: 3"
  ],
  [
   "2 × 4 → 5 × 7",
   "+3 ≠ ×3"
  ]
 ],
 [
  [
   "Factor en los lados: 3|Side-length factor: 3"
  ],
  [
   "Cada lado ÷ 2|Each side ÷ 2",
   "P = lado + lado + lado + lado|P = side + side + side + side"
  ]
 ],
 [
  [
   "3 × 4",
   "2 × 6"
  ],
  [
   "6 × 4",
   "8 × 2"
  ]
 ],
 [
  [
   "Caja: 2 × 3 × 4 cm|Box: 2 × 3 × 4 cm",
   "Cara: 2 × 4 cm|Face: 2 × 4 cm"
  ],
  [
   "Red de cubo: seis caras|Cube net: six faces",
   "Debe cerrar sin superponerse|Must close without overlaps"
  ]
 ],
 [
  [
   "Cubito: 1 cm × 1 cm × 1 cm|Unit cube: 1 cm × 1 cm × 1 cm"
  ],
  [
   "2 × 2 × 3",
   "3 capas de 2 × 2|3 layers of 2 × 2"
  ]
 ],
 [
  [
   "Caja cerrada: 2 × 2 × 6 cm|Closed box: 2 × 2 × 6 cm",
   "2 caras de cada tipo|2 faces of each type"
  ],
  [
   "2 × 3 × 4 cm",
   "1 × 4 × 6 cm",
   "Sin espesor ni solapas|No thickness or tabs"
  ]
 ],
 [
  [
   "Lectura: 8|Reading: 8",
   "Dibujo: 6|Drawing: 6",
   "Deporte: 6|Sport: 6",
   "Total: 20"
  ],
  [
   "Valores reales: 8 y 6|Actual values: 8 and 6",
   "Eje truncado: comienza en 5|Truncated axis: starts at 5"
  ]
 ],
 [
  [
   "2, 2, 4, 8",
   "Total ÷ cantidad|Total ÷ count"
  ],
  [
   "2, 2, 4, 8",
   "¿Qué valor se repite más?|Which value occurs most?"
  ]
 ],
 [
  [
   "A: 4, 4, 4, 4",
   "B: 2, 3, 5, 6"
  ],
  [
   "4 observaciones|4 observations",
   "¿Cómo se eligieron?|How were they selected?"
  ]
 ],
 [
  [
   "1, 2, 3, 4, 5, 6",
   "Menor que 3|Less than 3"
  ],
  [
   "6 caras|6 faces",
   "¿Cómo funciona el dado?|How does the die work?"
  ]
 ],
 [
  [
   "3 rojas + 1 azul|3 red + 1 blue"
  ],
  [
   "3 rojas + 1 azul|3 red + 1 blue"
  ]
 ],
 [
  [
   "9 caras / 15 ensayos|9 heads / 15 trials"
  ],
  [
   "Cara, cara, cara, ?|Heads, heads, heads, ?",
   "Lanzamientos independientes|Independent tosses"
  ]
 ],
 [
  [
   "Huerta: 8 × 6 m|Garden: 8 × 6 m",
   "Franja de lectura: 2 × 6 m|Reading strip: 2 × 6 m"
  ],
  [
   "6 m",
   "1:100",
   "1 m = 100 cm"
  ]
 ],
 [
  [
   "Descuento: 30%|Discount: 30%",
   "Total original: 100%|Original total: 100%"
  ],
  [
   "Mesas + otros gastos|Tables + other expenses",
   "Descuento: solo mesas|Discount: tables only"
  ]
 ],
 [
  [
   "Área original: 10 m²|Original area: 10 m²",
   "Cada lado × 2|Each side × 2"
  ],
  [
   "Costo / cantidad|Cost / quantity",
   "¿Hay cargo fijo?|Is there a fixed fee?"
  ]
 ]
];
export const PARK_MODELS=Object.fromEntries(GRADE_SEVEN_LESSONS.map((lesson,i)=>{
 if(rows[i]?.length!==lesson.checks.length)throw new Error(`Missing park model ${lesson.id}`);
 return [lesson.id,rows[i].map(row=>row.map(value=>text(value.includes('|')?value:`${value}|${value}`)))];
}));
