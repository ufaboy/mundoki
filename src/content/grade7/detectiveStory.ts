// Grade 7 game layer: "Agencia Lupa and the Riddles of the Sphinx".
// Scenario: docs/grade-7-detective-scenario.md. One chapter per package, one
// mission per lesson, one reward per lesson check. Introductions and rewards
// may name the chosen hero ({name}) and render through HeroText; lessons,
// prompts, hints, riddles and the final puzzles never use {name}.
// No crimes: the "candidates" are people who might be the riddle-maker.
import { GRADE_SEVEN_LESSONS, GRADE_SEVEN_PACKAGES } from './index';
import { text, check, type GradeOneCheck } from '../lessonModel';
import type { LocalizedText } from '../../math/core/types';

export type DetectiveScene =
  | 'library' | 'cafe' | 'alibi' | 'gates' | 'frames' | 'palermo'
  | 'printshop' | 'post' | 'archive' | 'fair' | 'yard';

type MissionDef = [title: string, introduction: string, firstReward: string, secondReward: string];
type RiddleDef = [prompt: string, correct: string, wrong: string, explanation: string];

interface ChapterDef {
  scene: DetectiveScene;
  icon: string;
  place: string;
  title: string;
  summary: string;
  /** Number on the back of the torn-map piece won in this chapter (main chapters only). */
  cipher?: number;
  missions: MissionDef[];
  riddle?: RiddleDef;
}

const chapters: ChapterDef[] = [
  {
    scene: 'library', icon: '✉', place: 'Biblioteca de la escuela, Boedo|School library, Boedo', cipher: 1,
    title: 'El primer sobre|The first envelope',
    summary: 'Un sobre con una esfinge dibujada aparece en la biblioteca.|An envelope with a sphinx drawn on it turns up in the library.',
    missions: [
      ['El secreto del nueve|The secret of nine',
        'Primer día de 7.º grado. En la biblioteca, {name} y Juli encuentran un sobre con una esfinge dibujada: «Si estás en séptimo, seguí los números. — La Esfinge». Adentro hay una nota y un candado con una sola rueda de cifras.|First day of 7th grade. In the library, {name} and Juli find an envelope with a sphinx drawn on it: “If you are in seventh grade, follow the numbers. — The Sphinx.” Inside are a note and a padlock with a single digit wheel.',
        'El viejo atlas se abre en la página 400: ¡otra nota de la Esfinge!|The old atlas opens at page 400: another note from the Sphinx!',
        '¡Clic! El candado se abre con el 1. Adentro hay fichas de libros.|Click! The padlock opens with 1. Inside are book cards.'],
      ['Grupos completos|Complete groups',
        'En la caja del candado hay fichas de dos carritos de libros. La Esfinge escribió: «Ordená sin contar».|The padlocked box holds cards from two book carts. The Sphinx wrote: “Sort without counting.”',
        'Los 80 libros entran en filas de 5 sin que sobre ninguno. Detrás aparece una llave.|All 80 books fit in rows of 5 with none left over. Behind them is a key.',
        'Sello rojo: PISTA FALSA. La idea de Los Halcones no resiste la prueba.|Red stamp: FALSE CLUE. The Halcones’ idea fails the test.'],
      ['El casillero que desmiente|The locker that proves it wrong',
        'La llave abre un armario con los casilleros 11 y 15. En la puerta, la Esfinge escribió una regla sospechosa.|The key opens a cabinet with lockers 11 and 15. On the door, the Sphinx wrote a suspicious rule.',
        'El casillero 15 se abre: hay una servilleta con la dirección de un café de Avenida de Mayo.|Locker 15 opens: inside is a napkin with the address of a café on Avenida de Mayo.',
        '¡Caso resuelto! {name} guarda la pieza 1 de un mapa roto. Al dorso tiene un número: 1.|Case solved! {name} keeps piece 1 of a torn map. On the back is a number: 1.'],
    ],
    riddle: ['Tres casilleros, A, B y C; uno tiene una llave. Notas: A «La llave no está aquí». B «La llave está en A». C «La llave no está en B». Solo una nota dice la verdad. ¿Dónde está la llave?|Three lockers, A, B, and C; one holds a key. Notes: A “The key is not here.” B “The key is in A.” C “The key is not in B.” Only one note is true. Where is the key?',
      'En B|In B', 'En A|In A',
      'Si estuviera en A, las notas B y C serían verdaderas. En B, solo la nota A es verdadera.|If it were in A, notes B and C would both be true. In B, only note A is true.'],
  },
  {
    scene: 'cafe', icon: '☕', place: 'Un café de Avenida de Mayo|A café on Avenida de Mayo', cipher: 3,
    title: 'El café de Avenida de Mayo|The café on Avenida de Mayo',
    summary: 'Recibos viejos, una receta y una mesa secreta.|Old receipts, a recipe, and a secret table.',
    missions: [
      ['Recibos exactos|Exact receipts',
        'Ramón, el mozo, guarda una caja de recibos viejos que dejó «un cliente para los chicos que vinieran a preguntar». Los recibos usan fracciones; las jarras del café, decimales.|Ramón the waiter keeps a box of old receipts left by “a customer, for the kids who would come asking.” The receipts use fractions; the café’s jugs use decimals.',
        'La jarra coincide con el recibo. Debajo hay otra tarjeta.|The jug matches the receipt. Under it is another card.',
        'Juli anota: «La Esfinge prueba si revisamos la exactitud».|Juli writes: “The Sphinx tests whether we check exactness.”'],
      ['La receta del submarino|The submarino recipe',
        'Una tarjeta trae la receta del submarino favorito de la Esfinge: leche caliente con una barra de chocolate. Ramón la prepara si los detectives calculan bien.|A card has the recipe of the Sphinx’s favourite submarino: hot milk with a chocolate bar. Ramón will make it if the detectives calculate correctly.',
        'Ramón sirve el submarino. En el fondo de la taza hay un dibujo: un frasco.|Ramón serves the submarino. At the bottom of the cup is a drawing: a jar.',
        'Los frascos quedan llenos. Una etiqueta dice: «mesa».|The jars are filled. One label says: “table.”'],
      ['La mesa de la Esfinge|The Sphinx’s table',
        'La nota del frasco esconde un número de mesa. Antes de dividir, conviene estimar.|The jar note hides a table number. Before dividing, it pays to estimate.',
        'Debajo de la mesa 8 hay un sobre y un recibo de mensajería.|Under table 8 there is an envelope and a courier receipt.',
        '¡Caso resuelto! Pieza 2 del mapa: al dorso, 3. Ramón recuerda: «El sobre lo dejaron a las 9:10».|Case solved! Map piece 2: on the back, 3. Ramón remembers: “The envelope was left at 9:10.”'],
    ],
    riddle: ['Ana, Beto y Caro se sientan en fila y piden café, té y submarino. Quien pidió té está en el medio. Ana no está en el medio. Ni Ana ni Beto toman café. ¿Quién pidió el té?|Ana, Beto, and Caro sit in a row and order coffee, tea, and a submarino. Whoever ordered tea is in the middle. Ana is not in the middle. Neither Ana nor Beto drinks coffee. Who ordered the tea?',
      'Beto|Beto', 'Ana|Ana',
      'Solo Caro puede tomar café. El té está en el medio y Ana no está en el medio: es de Beto. El submarino queda para Ana.|Only Caro can have coffee. Tea is in the middle and Ana is not in the middle: it is Beto’s. The submarino is left for Ana.'],
  },
  {
    scene: 'alibi', icon: '🚲', place: 'Calles del centro y Avenida Corrientes|Downtown streets and Corrientes Avenue', cipher: 6,
    title: '¿Quién pudo estar ahí?|Who could have been there?',
    summary: 'Una tabla de coartadas, un recibo de mensajería y un mapa.|An alibi table, a courier receipt, and a map.',
    missions: [
      ['La tabla de coartadas|The alibi table',
        '¿Quién dejó el sobre en el café a las 9:10? Juli arma una tabla. A las 9:00, Don Aurelio sale de la escuela en bici: 25 cuadras hasta el café. Profe Clara sale de su casa en colectivo: 30 cuadras. Señora Inés sigue en la biblioteca, a 25 cuadras. Ramón ya trabaja en el café. Una cuadra mide unos 100 m.|Who left the envelope at the café at 9:10? Juli builds a table. At 9:00, Don Aurelio leaves the school by bike: 25 blocks to the café. Profe Clara leaves home by colectivo, the city bus: 30 blocks. Señora Inés is still in the library, 25 blocks away. Ramón is already working at the café. One block (cuadra) is about 100 m.',
        'La velocidad de Aurelio va a su tarjeta: 2,5 cuadras por minuto.|Aurelio’s speed goes on his card: 2.5 blocks per minute.',
        'Tabla completa. Aurelio: 25 ÷ 2,5 = 10 min, llega 9:10, posible. Clara: 30 ÷ 2 = 15 min, llega 9:15, no. Inés: a las 9:05 seguía en la biblioteca, no. Ramón: estaba en el café, posible. Quedan dos candidatos.|Table complete. Aurelio: 25 ÷ 2.5 = 10 min, arrives 9:10, possible. Clara: 30 ÷ 2 = 15 min, arrives 9:15, no. Inés: still in the library at 9:05, no. Ramón: he was at the café, possible. Two candidates remain.'],
      ['El recibo de la mensajería|The courier receipt',
        'El recibo de la mesa 8 dice: 3 km, total 14. Dos mensajerías de la guía podrían haberlo emitido: Rayo y Cóndor.|The receipt from table 8 says: 3 km, total 14. Two courier companies in the directory could have issued it: Rayo and Cóndor.',
        'El punto (2,5; 10) está en la recta de Rayo, que sale de (0; 0). Pero Rayo cobraría 12 por 3 km, no 14.|The point (2.5; 10) is on Rayo’s line, which starts at (0; 0). But Rayo would charge 12 for 3 km, not 14.',
        'Solo la recta de Cóndor pasa por (3; 14). Su registro: firma ilegible, «vino en bicicleta». Aurelio anda en bici; Ramón usa la bici de reparto del café. Los dos siguen en la lista.|Only Cóndor’s line passes through (3; 14). Its register: unreadable signature, “came by bicycle.” Aurelio rides a bike; Ramón uses the café’s delivery bike. Both stay on the list.'],
      ['El mapa y la librería|The map and the bookshop',
        'En el sobre hay un mapa de la ciudad a escala 1:20.000 y el aviso de una librería de usados en Avenida Corrientes.|The envelope holds a city map at scale 1:20,000 and an ad for a used bookshop on Corrientes Avenue.',
        'Los detectives caminan 10 cuadras hasta la librería.|The detectives walk 10 blocks to the bookshop.',
        '¡Caso resuelto! Pieza 3 (al dorso: 6) e insignia de Aprendiz para {name}. El libro tiene una marca: «Defensa 1000, San Telmo».|Case solved! Piece 3 (on the back: 6) and the Apprentice badge for {name}. The book has a pencil mark: “Defensa 1000, San Telmo.”'],
    ],
    riddle: ['«Si alguien vino en colectivo, llegó después de las 9:10». Don Aurelio llegó antes de las 9:10. ¿Qué podemos concluir?|“If someone came by colectivo, they arrived after 9:10.” Don Aurelio arrived before 9:10. What can we conclude?',
      'Que Aurelio no vino en colectivo|That Aurelio did not come by colectivo', 'Que Aurelio vino en colectivo|That Aurelio came by colectivo',
      'Si hubiera venido en colectivo, habría llegado después de las 9:10. No fue así, entonces no vino en colectivo.|If he had come by colectivo, he would have arrived after 9:10. He did not, so he did not come by colectivo.'],
  },
  {
    scene: 'gates', icon: '🗝', place: 'Calle Defensa, San Telmo|Defensa Street, San Telmo', cipher: 10,
    title: 'Las rejas de San Telmo|The iron gates of San Telmo',
    summary: 'Rejas de cuadrados que comparten barrotes y una puerta escondida.|Gates of squares sharing bars, and a hidden door.',
    missions: [
      ['Contá los barrotes|Count the bars',
        'Domingo de feria en la calle Defensa. Las casas viejas tienen rejas de cuadrados en fila. La Esfinge escribió: «Contá mis barrotes y encontrarás mi puerta».|Sunday market on Defensa Street. The old houses have iron gates of squares in a row. The Sphinx wrote: “Count my bars and you will find my door.”',
        'El conteo coincide con la reja real: 13 barrotes.|The count matches the real gate: 13 bars.',
        'Juli anota el patrón en el cuaderno del caso: 4, 7, 10, 13.|Juli writes the pattern in the case notebook: 4, 7, 10, 13.'],
      ['La reja número 20|Gate number 20',
        'La adivinanza habla de rejas muy largas. Contarlas una por una lleva demasiado tiempo: hace falta una regla.|The riddle talks about very long gates. Counting them one by one takes too long: a rule is needed.',
        '4 + 3 × 11 = 37 barrotes: esa reja es un señuelo con la nota «Más corto».|4 + 3 × 11 = 37 bars: that gate is a decoy with the note “Shorter.”',
        'Sello: PISTA FALSA. La puerta que eligieron Los Halcones no es la correcta.|Stamp: FALSE CLUE. The door the Halcones chose is not the right one.'],
      ['La puerta 3n + 1|Door 3n + 1',
        'Nueva nota de la Esfinge: «Mi puerta es 3n + 1». La letra n cuenta los cuadrados de una reja.|A new note from the Sphinx: “My door is 3n + 1.” The letter n counts the squares of a gate.',
        'Puerta 19: el anticuario entrega un paquete para Agencia Lupa.|Door 19: the antique dealer hands over a parcel for Agencia Lupa.',
        '¡Caso resuelto! Pieza 4 (al dorso: 10). En el paquete hay un plano de Palermo y un boleto a La Boca.|Case solved! Piece 4 (on the back: 10). The parcel holds a plan of Palermo and a ticket to La Boca.'],
    ],
    riddle: ['Puertas de la calle Defensa: 2, 4, 8, … Los Halcones dicen que la próxima es 16. La Esfinge agrega: «La cuarta es 14». ¿Cuál es la quinta?|Doors on Defensa Street: 2, 4, 8, … The Halcones say the next is 16. The Sphinx adds: “The fourth is 14.” What is the fifth?',
      '22|22', '16|16',
      'Con 14 las diferencias son +2, +4, +6; la siguiente es +8: 14 + 8 = 22. Tres números solos no fijaban la regla.|With 14 the differences are +2, +4, +6; the next is +8: 14 + 8 = 22. Three numbers alone did not fix the rule.'],
  },
  {
    scene: 'frames', icon: '🖼', place: 'Taller de marcos, La Boca|Framing workshop, La Boca',
    title: 'Expediente extra: el marco sin firma|Side case: the unsigned frame',
    summary: 'Una foto vieja espera su marco en un taller de La Boca.|An old photo waits for its frame in a La Boca workshop.',
    missions: [
      ['La orden de la marquera|The framer’s order',
        'Expediente extra. En un taller de marcos cerca de Caminito guardan un pedido «para los chicos de Agencia Lupa»: una foto vieja sin marco y una orden con una fórmula.|Side case. A framing workshop near Caminito has an order “for the kids of Agencia Lupa”: an old photo without a frame and an order with a formula.',
        'La marquera asiente: la fórmula habla del listón que rodea la foto.|The framer nods: the formula is about the strip that goes around the photo.',
        'Elige el rollo de listón correcto, medido en cm.|She picks the right roll of strip, measured in cm.'],
      ['Cortar el listón|Cut the strip',
        'La foto vieja mide 7 cm de ancho. Hay que calcular cuánto listón cortar.|The old photo is 7 cm wide. We must work out how much strip to cut.',
        'Se corta el listón: 18 cm.|The strip is cut: 18 cm.',
        'Juli recorre el borde y comprueba: el marco cierra perfecto.|Juli traces the edge and checks: the frame closes perfectly.'],
      ['El cartel del taller|The workshop sign',
        'El taller tiene un cartel con tabla, fórmula y gráfico de los marcos de 2 cm de alto.|The workshop has a sign with a table, a formula, and a graph for frames 2 cm high.',
        'El gráfico del cartel queda completo.|The sign’s graph is complete.',
        'Expediente extra cerrado. Pista bonus: la foto muestra el primer 7.º grado de la escuela, hace 50 años. Un chico sostiene una caja y una pala.|Side case closed. Bonus clue: the photo shows the school’s first 7th grade, 50 years ago. A boy holds a box and a shovel.'],
    ],
    riddle: ['Tres marcos: rojo, azul y verde. El rojo es más largo que el azul. El verde no es el más corto. El verde es más corto que el rojo. ¿Cuál es el más largo?|Three frames: red, blue, and green. Red is longer than blue. Green is not the shortest. Green is shorter than red. Which is the longest?',
      'El rojo|Red', 'El verde|Green',
      'El rojo es más largo que el azul y que el verde. Orden: rojo, verde, azul.|Red is longer than both blue and green. Order: red, green, blue.'],
  },
  {
    scene: 'palermo', icon: '📐', place: 'Palermo|Palermo', cipher: 15,
    title: 'Los ángulos de Palermo|The angles of Palermo',
    summary: 'Un plano con ángulos y una orden: «No midas: deducí».|A plan with angles and an order: “Do not measure: deduce.”',
    missions: [
      ['La diagonal|The diagonal',
        'El plano del paquete lleva a Palermo. La nota tiene ángulos y una orden: «No midas: deducí».|The plan from the parcel leads to Palermo. The note has angles and an order: “Do not measure: deduce.”',
        'Los detectives eligen la vereda correcta.|The detectives choose the right sidewalk.',
        'El ángulo coincide con la esquina dibujada en la nota.|The angle matches the corner drawn on the note.'],
      ['La plazoleta triangular|The triangular square',
        'En la esquina hay una plazoleta triangular con un banco en cada vértice.|At the corner there is a small triangular square with a bench at each corner.',
        'Debajo del banco del ángulo de 60° hay una nota.|Under the bench at the 60° corner there is a note.',
        'La manzana aparece en el plano. La nota está escrita en una ficha de la biblioteca de la escuela: Señora Inés tiene algo que ver.|The block appears on the plan. The note is written on a library card from the school: Señora Inés is involved somehow.'],
      ['El punto escondido|The hidden point',
        'El último punto del plano está escondido a ciertas distancias de dos esquinas. Se marca con compás.|The last point on the plan is hidden at certain distances from two corners. It is marked with a compass.',
        'Sello: PISTA FALSA. Con cordones de 2, 4 y 7 cm no se cierra ningún triángulo.|Stamp: FALSE CLUE. Strings of 2, 4, and 7 cm do not close any triangle.',
        '¡Caso resuelto! Pieza 5 (al dorso: 15) e insignia de Detective para {name}. El vértice marca una imprenta.|Case solved! Piece 5 (on the back: 15) and the Detective badge for {name}. The vertex marks a print shop.'],
    ],
    riddle: ['La plazoleta triangular tiene esquinas de 35°, 85° y 60°. La Esfinge escribe: «Mi nota no está en el ángulo mayor ni en el de 60°». ¿En qué esquina está?|The triangular square has corners of 35°, 85°, and 60°. The Sphinx writes: “My note is not at the largest angle nor at the 60° one.” Which corner is it at?',
      'En la de 35°|At the 35° corner', 'En la de 85°|At the 85° corner',
      'El ángulo mayor es el de 85°. Si no es ese ni el de 60°, queda el de 35°.|The largest angle is 85°. If it is neither that one nor 60°, the 35° corner is left.'],
  },
  {
    scene: 'printshop', icon: '🖨', place: 'Una imprenta y una huerta comunitaria|A print shop and a community garden', cipher: 21,
    title: 'La foto ampliada|The enlarged photo',
    summary: 'Un negativo, una ampliación justa y canteros con el mismo cerco.|A negative, a fair enlargement, and beds with the same fence.',
    missions: [
      ['Ampliar con justicia|Enlarge fairly',
        'El dueño de la imprenta guarda un negativo que dejó «un señor muy amable». La instrucción de la Esfinge: «Ampliá con justicia».|The print shop owner keeps a negative left by “a very kind gentleman.” The Sphinx’s instruction: “Enlarge fairly.”',
        'La copia muestra una huerta con canteros numerados.|The print shows a garden with numbered beds.',
        'La copia estirada de Los Halcones queda a un lado.|The Halcones’ stretched copy is set aside.'],
      ['Papel y marco|Paper and frame',
        'Para imprimir la ampliación hace falta papel, y para colgarla, un marco.|To print the enlargement we need paper, and to hang it, a frame.',
        'Se compra la hoja del tamaño justo.|The right-size sheet is bought.',
        'Las dos copias están listas: la grande y la de bolsillo.|Both copies are ready: the big one and the pocket one.'],
      ['El cantero de la Esfinge|The Sphinx’s bed',
        'La foto lleva a una huerta comunitaria. Un cartel dice: «Mi cantero tiene el mismo cerco que su vecino, pero más tierra».|The photo leads to a community garden. A sign says: “My bed has the same fence as its neighbour, but more soil.”',
        'Sello: PISTA FALSA. Igual área no significa igual cerco.|Stamp: FALSE CLUE. Equal area does not mean equal fence.',
        '¡Caso resuelto! Bajo el cartel del cantero de 6 × 4 hay una pieza (al dorso: 21) y la dirección de un correo.|Case solved! Under the sign of the 6 × 4 bed there is a piece (on the back: 21) and the address of a post office.'],
    ],
    riddle: ['Canteros 1 a 4 en fila: tomate, lechuga, zapallo y albahaca. El zapallo está en el 2. La lechuga está en una punta. El tomate está al lado de la albahaca. La albahaca no está en el 4. ¿Dónde está el tomate?|Beds 1 to 4 in a row: tomato, lettuce, squash, and basil. Squash is in bed 2. Lettuce is at one end. Tomato is next to basil. Basil is not in bed 4. Where is the tomato?',
      'En el cantero 4|In bed 4', 'En el cantero 3|In bed 3',
      'Si la lechuga estuviera en el 4, quedarían el 1 y el 3, que no son vecinos. Entonces lechuga 1, albahaca 3 y tomate 4.|If lettuce were in bed 4, beds 1 and 3 would be left, and they are not neighbours. So lettuce 1, basil 3, and tomato 4.'],
  },
  {
    scene: 'post', icon: '📦', place: 'Una sucursal del correo|A post office', cipher: 28,
    title: 'La caja enigma|The puzzle box',
    summary: 'Una caja de madera llena de cerrojos y cubitos.|A wooden box full of latches and little cubes.',
    missions: [
      ['Caras gemelas|Twin faces',
        'En el correo espera un paquete para Agencia Lupa: una caja de madera de 2 × 3 × 4 y una bolsa de cubitos. El sello dice «Boedo, martes 8:15», cerca de la escuela. Ese martes Ramón trabajaba en el café desde las 7:00 y no salió: queda descartado.|At the post office a parcel waits for Agencia Lupa: a 2 × 3 × 4 wooden box and a bag of little cubes. The postmark says “Boedo, Tuesday 8:15,” near the school. That Tuesday Ramón worked at the café from 7:00 and did not leave: he is ruled out.',
        'Se abre el primer cerrojo.|The first latch opens.',
        'Juli dibuja una red que sí se pliega en cubo: se abre el segundo cerrojo.|Juli draws a net that does fold into a cube: the second latch opens.'],
      ['El compartimento|The compartment',
        'Dentro de la caja hay un compartimento secreto para los cubitos de 1 cm³.|Inside the box is a secret compartment for the 1 cm³ cubes.',
        'Juli elige la tarjeta de medida correcta: cm³.|Juli picks the right measuring card: cm³.',
        'El compartimento se llena y sale un cajón con una pieza del mapa (al dorso: 28).|The compartment fills and a drawer slides out with a map piece (on the back: 28).'],
      ['La respuesta en una caja|The reply in a box',
        'Agencia Lupa le responde a la Esfinge con una caja de 24 cubitos. Quieren usar el menor papel de envolver posible.|Agencia Lupa replies to the Sphinx with a box of 24 cubes. They want to use as little wrapping paper as possible.',
        'La caja de 2 × 3 × 4 (52 cm²) usa menos papel que la de 2 × 2 × 6.|The 2 × 3 × 4 box (52 cm²) uses less paper than the 2 × 2 × 6 one.',
        '¡Caso resuelto! La respuesta sale por correo con una pregunta: «¿Quién sos?».|Case solved! The reply goes out by post with a question: “Who are you?”'],
    ],
    riddle: ['Tres cajas tienen etiquetas «cubos», «llaves» y «cubos y llaves». Todas las etiquetas están mal. Podés sacar un solo objeto de una sola caja. ¿Cuál abrís para corregir todas las etiquetas?|Three boxes are labelled “cubes,” “keys,” and “cubes and keys.” Every label is wrong. You may take out one object from one box. Which do you open to fix all the labels?',
      'La de «cubos y llaves»|The “cubes and keys” box', 'La de «cubos»|The “cubes” box',
      'La de «cubos y llaves» tiene una sola clase de objeto: el que sale la nombra. Las otras dos etiquetas quedan obligadas.|The “cubes and keys” box holds only one kind of object: the one you draw names it. The other two labels are then forced.'],
  },
  {
    scene: 'archive', icon: '📰', place: 'Hemeroteca, archivo de diarios|Newspaper archive', cipher: 36,
    title: 'La hemeroteca|The newspaper archive',
    summary: 'Una columna de acertijos firmada «La Esfinge».|A riddle column signed “The Sphinx.”',
    missions: [
      ['La encuesta del diario|The newspaper survey',
        'La Esfinge contesta: «Buscame en los diarios viejos». En la hemeroteca, los detectives encuentran una columna de acertijos firmada «La Esfinge» y, al lado, una encuesta escolar.|The Sphinx replies: “Look for me in old newspapers.” In the newspaper archive, the detectives find a riddle column signed “The Sphinx” and, next to it, a school survey.',
        'La tabla de la encuesta queda completa.|The survey table is complete.',
        'Juli vuelve a dibujar el gráfico con el eje desde cero.|Juli redraws the chart with the axis starting at zero.'],
      ['El ritmo de la columna|The column’s rhythm',
        'La columna publicaba distinta cantidad de acertijos por semana. Los detectives cuentan un mes entero.|The column printed a different number of riddles each week. The detectives count a whole month.',
        'La media va al cuaderno: 4 acertijos por semana.|The mean goes into the notebook: 4 riddles per week.',
        '«Casi siempre dos por semana»: el mismo ritmo que los sobres de este año.|“Usually two a week”: the same rhythm as this year’s envelopes.'],
      ['Letras de máquina|Typewriter letters',
        'Juli mide las letras de dos grupos de notas. Los Halcones trajeron una nota que «encontraron».|Juli measures the letters in two groups of notes. The Halcones brought a note they “found.”',
        'El grupo B está escrito a mano: Los Halcones admiten la broma. El grupo A coincide con la máquina de escribir de la columna.|Group B is handwritten: the Halcones admit the joke. Group A matches the column’s typewriter.',
        '¡Caso resuelto! Pieza 8 (al dorso: 36) e insignia de Detective principal para {name}. Un viejo recibo de pago de la columna dice: «A. Ríos».|Case solved! Piece 8 (on the back: 36) and the Chief Detective badge for {name}. An old pay slip for the column says: “A. Ríos.”'],
    ],
    riddle: ['Cuatro diarios, A, B, C y D; uno publicaba la columna. «Si estaba en B, tenía crucigrama». El diario de la columna no tenía crucigrama. «Si no es A, es C». No es C. ¿Qué diario es?|Four newspapers, A, B, C, and D; one printed the column. “If it was in B, it had a crossword.” The column’s paper had no crossword. “If it is not A, it is C.” It is not C. Which paper is it?',
      'A|A', 'D|D',
      'No es B: tendría crucigrama. Si no fuera A, sería C, y no es C. Entonces es A.|It is not B: it would have a crossword. If it were not A, it would be C, and it is not C. So it is A.'],
  },
  {
    scene: 'fair', icon: '🎲', place: 'Kermés en Parque Centenario|School fair in Parque Centenario',
    title: 'Expediente extra: la moneda de la kermés|Side case: the coin at the school fair',
    summary: 'Un puesto de juegos de azar con una moneda vieja de premio.|A games-of-chance stall with an old coin as the prize.',
    missions: [
      ['El dado tallado|The carved die',
        'Expediente extra. En la kermés de Parque Centenario, el puesto «Los juegos de la Esfinge» pide explicar cada juego antes de jugar. El premio es una moneda vieja.|Side case. At the school fair in Parque Centenario, the stall “The Sphinx’s games” asks visitors to explain each game before playing. The prize is an old coin.',
        'La primera tarjeta del juego es correcta.|The first game card is correct.',
        'El encargado sonríe: «Bien. No todo dado es parejo».|The stall keeper smiles: “Good. Not every die is fair.”'],
      ['La bolsa de bolitas|The bag of marbles',
        'Segundo juego: una bolsa con 3 bolitas rojas y 1 azul. Se saca una sin mirar.|Second game: a bag with 3 red marbles and 1 blue. One is drawn without looking.',
        'La tarjeta del evento queda en su lugar.|The event card goes in its place.',
        'La segunda tarjeta del juego es correcta.|The second game card is correct.'],
      ['Quince lanzamientos|Fifteen tosses',
        'Último juego: lanzar una moneda 15 veces y anotar cada resultado.|Last game: toss a coin 15 times and record each result.',
        'El registro queda completo.|The record is complete.',
        'Expediente extra cerrado. Pista bonus: la moneda del premio es de hace 50 años, como la caja de la foto vieja.|Side case closed. Bonus clue: the prize coin is 50 years old, like the box in the old photo.'],
    ],
    riddle: ['Los Halcones proponen un juego con la moneda: «Si sale cara, gano yo; si sale cruz, perdés vos». ¿Es un juego justo?|The Halcones propose a coin game: “Heads, I win; tails, you lose.” Is it a fair game?',
      'No: siempre ganan Los Halcones|No: the Halcones always win', 'Sí: hay cara y cruz|Yes: there are heads and tails',
      'Si enumerás los dos resultados, en ambos ganan Los Halcones.|If you list both outcomes, the Halcones win in each.'],
  },
  {
    scene: 'yard', icon: '🏫', place: 'El patio de la escuela|The schoolyard',
    title: 'La cápsula del tiempo|The time capsule',
    summary: 'Las piezas del mapa forman el plano del patio de la escuela.|The map pieces form a plan of the schoolyard.',
    missions: [
      ['Donde no se lee, se cava|Where no one reads, dig',
        'Las 8 piezas del mapa encajan: es un plano del patio de la propia escuela, a escala 1:100, dibujado hace 50 años. Última nota: «Donde no se lee, se cava».|The 8 map pieces fit together: it is a plan of the school’s own yard, scale 1:100, drawn 50 years ago. Last note: “Where no one reads, dig.”',
        'La zona de búsqueda queda marcada con cinta.|The search area is marked with tape.',
        '¡El plano encaja con la huerta real! En una esquina aparece una caja de metal con un candado de dos cifras.|The plan lines up with the real garden! In one corner a metal box appears, with a two-digit lock.'],
      ['La fiesta de egresados|The graduation party',
        'Don Aurelio entra al patio sonriendo: «Bien deducido». Cuenta la historia del primer 7.º grado, y Señora Inés confiesa que ella dejaba los sobres. Aurelio propone abrir la cápsula en la fiesta de egresados. Hay que organizarla, pagando en lupas.|Don Aurelio walks into the yard smiling: “Well deduced.” He tells the story of the first 7th grade, and Señora Inés admits she placed the envelopes. Aurelio suggests opening the capsule at the graduation party. It must be organised, paying in lupas.',
        'Las mesas quedan reservadas.|The tables are booked.',
        'El presupuesto es correcto: ¡la fiesta está lista!|The budget is right: the party is set!'],
      ['El informe final|The final report',
        'Antes de la fiesta, Agencia Lupa y Los Halcones revisan juntos el informe del caso y buscan errores.|Before the party, Agencia Lupa and the Halcones check the case report together for mistakes.',
        'El informe queda corregido: 40 m².|The report is corrected: 40 m².',
        '¡Caso resuelto! Insignia de Detective de la Esfinge para {name}. En la fiesta se abre la cápsula: cartas del primer 7.º grado para los nuevos egresados.|Case solved! The Sphinx Detective badge for {name}. At the party the capsule opens: letters from the first 7th grade to the new graduates.'],
    ],
  },
];

export interface DetectivePuzzle extends GradeOneCheck {
  id: string;
  title: LocalizedText;
}

function riddle(id: string, def: RiddleDef): DetectivePuzzle {
  return { id, title: text('Acertijo de la Esfinge|The Sphinx’s riddle'), ...check(...def) };
}

export const DETECTIVE_CHAPTERS = GRADE_SEVEN_PACKAGES.map((p, i) => {
  const def = chapters[i];
  const lessons = GRADE_SEVEN_LESSONS.filter((l) => l.packageId === p.id);
  if (!def || lessons.length !== def.missions.length) throw new Error(`Incomplete detective chapter ${p.id}`);
  const optional = p.id === 'G07-05' || p.id === 'G07-10';
  return {
    id: p.id,
    number: i + 1,
    icon: def.icon,
    optional,
    scene: def.scene,
    place: text(def.place),
    title: text(def.title),
    summary: text(def.summary),
    cipher: def.cipher,
    riddle: def.riddle ? riddle(`${p.id}-riddle`, def.riddle) : undefined,
    missions: lessons.map((lesson, j) => {
      const [title, introduction, ...rewards] = def.missions[j];
      if (rewards.length !== lesson.checks.length) throw new Error(`Rewards must match checks: ${lesson.id}`);
      return {
        id: lesson.id,
        packageId: p.id,
        optional,
        scene: def.scene,
        title: text(title),
        introduction: text(introduction),
        objective: lesson.objective,
        checks: lesson.checks,
        rewards: rewards.map(text),
      };
    }),
  };
});

export const DETECTIVE_MISSIONS = DETECTIVE_CHAPTERS.flatMap((c) => c.missions);

/** Map-piece numbers in order: piece k shows 1 + 2 + … + k. */
export const CIPHER_SEQUENCE = DETECTIVE_CHAPTERS.flatMap((c) => (c.cipher ? [c.cipher] : []));

// Side cases stay open but never block the main case.
export function nextDetectiveMission(id: string) {
  const index = DETECTIVE_MISSIONS.findIndex((m) => m.id === id);
  if (index < 0) return undefined;
  const current = DETECTIVE_MISSIONS[index];
  return DETECTIVE_MISSIONS.slice(index + 1).find((m) => !m.optional || (current.optional && m.packageId === current.packageId));
}

export const CANDIDATES = [
  { id: 'aurelio', name: 'Don Aurelio', role: text('Encargado de la escuela; anda en bici|School caretaker; rides a bike') },
  { id: 'ines', name: 'Señora Inés', role: text('Bibliotecaria de la escuela|School librarian') },
  { id: 'ramon', name: 'Ramón', role: text('Mozo del café de Avenida de Mayo|Waiter at the Avenida de Mayo café') },
  { id: 'clara', name: 'Profe Clara', role: text('Profesora de matemática|Math teacher') },
] as const;

export type CandidateId = (typeof CANDIDATES)[number]['id'];
export type ClueMark = 'possible' | 'ruledOut' | 'linked';

/** Evidence on the candidate board, in the order the chapters reveal it. */
export const CANDIDATE_CLUES: { chapter: string; candidate: CandidateId; mark: ClueMark; note: LocalizedText }[] = [
  ['G07-03', 'aurelio', 'possible', 'En bici llega al café a las 9:10.|By bike he reaches the café at 9:10.'],
  ['G07-03', 'clara', 'ruledOut', 'En colectivo llega a las 9:15: tarde.|By colectivo she arrives at 9:15: too late.'],
  ['G07-03', 'ines', 'ruledOut', 'A las 9:05 seguía en la biblioteca: no dejó el sobre.|At 9:05 she was still in the library: she did not leave the envelope.'],
  ['G07-03', 'ramon', 'possible', 'Estaba en el café y usa la bici de reparto.|He was at the café and uses the delivery bike.'],
  ['G07-06', 'ines', 'linked', 'Una nota de Palermo está en una ficha de su biblioteca.|A Palermo note is on a card from her library.'],
  ['G07-08', 'ramon', 'ruledOut', 'Trabajaba en el café cuando se despachó la caja en Boedo.|He was working at the café when the box was posted in Boedo.'],
  ['G07-08', 'aurelio', 'possible', 'La caja salió de Boedo, cerca de la escuela.|The box was posted in Boedo, near the school.'],
  ['G07-09', 'aurelio', 'possible', 'La columna de acertijos estaba firmada «A. Ríos».|The riddle column was signed “A. Ríos.”'],
].map(([chapter, candidate, mark, note]) => ({ chapter, candidate: candidate as CandidateId, mark: mark as ClueMark, note: text(note) }));

/** Story step after G07-11-L01: the capsule's lock needs the next cipher number. */
export const CIPHER_PUZZLE: DetectivePuzzle = {
  id: 'cipher',
  title: text('El candado de la cápsula|The capsule’s lock'),
  ...check(
    'Al dorso de las piezas del mapa dice: 1, 3, 6, 10, 15, 21, 28, 36. El candado pide el número que sigue. ¿Cuál es?|The backs of the map pieces read: 1, 3, 6, 10, 15, 21, 28, 36. The lock asks for the next number. Which is it?',
    '45|45', '44|44',
    'Cada número suma uno más que el anterior: +2, +3, … +8. El próximo suma 9: 36 + 9 = 45.|Each number adds one more than the last: +2, +3, … +8. The next adds 9: 36 + 9 = 45.'
  ),
};

/** Story step after G07-11-L01: the learner names the Sphinx before the confession. */
export const DEDUCTION_PUZZLE: DetectivePuzzle = {
  id: 'deduction',
  title: text('¿Quién es la Esfinge?|Who is the Sphinx?'),
  prompt: text('Dentro de la cápsula hay una tarjeta a máquina: «¿Quién soy?». Mirá el tablero de candidatos. ¿Quién es la Esfinge?|Inside the capsule is a typed card: “Who am I?” Look at the candidate board. Who is the Sphinx?'),
  options: [text('Ramón|Ramón'), text('Don Aurelio|Don Aurelio'), text('Profe Clara|Profe Clara'), text('Señora Inés|Señora Inés')],
  answer: 1,
  explanation: text('Don Aurelio llega al café a las 9:10 en bici, la caja salió de Boedo y la columna estaba firmada «A. Ríos». Clara llegaba tarde, Ramón estaba trabajando cuando se despachó la caja e Inés no pudo dejar el sobre, aunque la ficha muestra que ayudó.|Don Aurelio reaches the café at 9:10 by bike, the box was posted in Boedo, and the column was signed “A. Ríos.” Clara arrived too late, Ramón was working when the box was posted, and Inés could not have left the envelope, although the library card shows she helped.'),
};

/** Átomo's gentle nudge after a wrong name in the final deduction. */
export const DEDUCTION_HINT = text('Buscá en el tablero a quien no tenga ninguna marca roja y sí la firma de la columna.|On the board, look for the person with no red mark and with the column’s signature.');
