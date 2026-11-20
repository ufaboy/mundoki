// Chapter 8 — The housewarming (G03-13, G03-14): asking one question to
// everyone, totals of votes, reading a chart, what the data allow us to say,
// remainders that need one more van, and two ways to count the empanadas.
import { T, choose, typed, L, oneOf, type Generator } from './kit';

const FILLINGS: [string, string][] = [['carne', 'beef'], ['jamón y queso', 'ham and cheese'], ['verdura', 'vegetable'], ['humita', 'sweetcorn']];
const TREES: [string, string][] = [['limonero', 'lemon tree'], ['naranjo', 'orange tree'], ['ceibo', 'ceibo']];

export const party: Record<string, [Generator, Generator]> = {
  'G03-13-L01': [
    r => {
      const people = r.int(5, 15), two = r.int(0, 1) === 0, answers = two ? people * 2 : people;
      return typed(
        two
          ? T(`Preguntamos a ${people} parientes dos cosas: qué comida y qué música prefieren. Cada uno elige una sola opción en cada pregunta. ¿Cuántas respuestas esperamos?`, `We ask ${people} relatives two things: which food and which music they prefer. Each one picks only one option for each question. How many answers do we expect?`)
          : T(`Para la fiesta preguntamos a ${people} parientes qué comida prefieren. Cada uno elige una sola. ¿Cuántas respuestas esperamos?`, `For the party we ask ${people} relatives which food they prefer. Each one picks only one. How many answers do we expect?`),
        answers,
        two
          ? T(`Dos respuestas por persona: ${people} × 2 = ${answers} respuestas.`, `Two answers per person: ${people} × 2 = ${answers} answers.`)
          : T(`Una respuesta por persona: ${people} personas, ${answers} respuestas.`, `One answer per person: ${people} people, ${answers} answers.`),
        L('Dibujá una marca por cada respuesta que da cada pariente.|Draw one mark for each answer each relative gives.'),
        { unit: T('respuestas', 'answers') },
      );
    },
    r => {
      const SAME = L('Hay que hacer la misma pregunta a todos|Everyone must get the same question');
      const ONCE = L('Hay que anotar una sola respuesta por persona|Only one answer per person must be written down');
      const OK = L('Está bien: las respuestas se pueden juntar|It is fine: the answers can be put together');
      const DROP = L('Hay que borrar las respuestas que no nos gustan|We must erase the answers we do not like');
      const hint = L('Pensá si las respuestas se pueden juntar en una sola tabla.|Think whether the answers can go together in one table.');
      return oneOf(r, [
        () => { const n = r.int(3, 6); return choose(r, T(`A ${n} parientes les preguntamos qué comida prefieren y a otros ${n} qué música. ¿Qué hay que corregir?`, `We asked ${n} relatives which food they prefer and another ${n} which music. What must be fixed?`), SAME, [ONCE, OK, DROP], L('Si cambiamos la pregunta, las respuestas no se pueden juntar ni comparar.|If we change the question, the answers cannot be put together or compared.'), hint); },
        () => { const n = r.int(6, 12); return choose(r, T(`Preguntamos a ${n} parientes qué comida prefieren. El tío Beto votó dos veces. ¿Qué hay que corregir?`, `We asked ${n} relatives which food they prefer. Uncle Beto voted twice. What must be fixed?`), ONCE, [SAME, OK, DROP], L('Cada persona cuenta una vez: un voto de más cambia los totales.|Each person counts once: an extra vote changes the totals.'), hint); },
        () => { const n = r.int(6, 12); return choose(r, T(`Preguntamos lo mismo a ${n} parientes y cada uno votó una vez. ¿Qué hay que corregir?`, `We asked ${n} relatives the same question and each one voted once. What must be fixed?`), OK, [SAME, ONCE, DROP], L('Misma pregunta y un voto por persona: las respuestas se pueden comparar.|Same question and one vote per person: the answers can be compared.'), hint); },
      ]);
    },
  ],
  'G03-13-L02': [
    r => {
      const [a, b, c] = [r.int(3, 12), r.int(2, 9), r.int(1, 8)];
      const [f1, f2, f3] = r.shuffle(FILLINGS).slice(0, 3);
      const total = a + b + c;
      return typed(
        T(`Votos de empanadas: ${f1[0]} ${a}, ${f2[0]} ${b}, ${f3[0]} ${c}. ¿Cuántas respuestas hay en total?`, `Empanada votes: ${f1[1]} ${a}, ${f2[1]} ${b}, ${f3[1]} ${c}. How many answers are there in all?`),
        total,
        T(`${a} + ${b} + ${c} = ${total} respuestas, sin olvidar ninguna fila.`, `${a} + ${b} + ${c} = ${total} answers, without missing any row.`),
        L('Juntá los votos de las tres filas sin contar ninguno dos veces.|Put the votes from all three rows together without counting any twice.'),
        { unit: T('respuestas', 'answers') },
      );
    },
    r => {
      const fills = r.shuffle(FILLINGS).slice(0, 3);
      const votes = r.shuffle([r.int(7, 10), r.int(4, 6), r.int(1, 3)]);
      const named = r.int(0, 2) > 0;
      const NONE = L('No se sabe: faltan los nombres de los gustos|We cannot tell: the fillings’ names are missing');
      const options = fills.map(([e, n]) => T(e[0].toUpperCase() + e.slice(1), n[0].toUpperCase() + n.slice(1)));
      const best = votes.indexOf(Math.max(...votes));
      const bars = votes.join(', ');
      return choose(r,
        named
          ? T(`El gráfico tiene tres barras: ${fills.map(([e], i) => `${e} ${votes[i]}`).join(', ')}. ¿Qué gusto ganó?`, `The chart has three bars: ${fills.map(([, n], i) => `${n} ${votes[i]}`).join(', ')}. Which filling won?`)
          : T(`Átomo dibujó tres barras de ${bars} votos, pero no escribió los gustos. ¿Qué gusto ganó?`, `Átomo drew three bars of ${bars} votes, but did not write the fillings. Which filling won?`),
        named ? options[best] : NONE,
        named ? [...options.filter((_, i) => i !== best), NONE] : options.slice(0, 3),
        named
          ? T(`La barra más alta tiene ${votes[best]} votos: ${fills[best][0]}.`, `The tallest bar has ${votes[best]} votes: ${fills[best][1]}.`)
          : T('Sin el nombre al lado de cada barra, nadie sabe qué empanada ganó.', 'Without the name next to each bar, nobody knows which empanada won.'),
        L('Buscá la barra más alta. ¿Dice a qué gusto corresponde?|Find the tallest bar. Does it say which filling it is?'),
        { reward: L('Todos pueden leer el gráfico.|Everyone can read the chart.') });
    },
  ],
  'G03-13-L03': [
    r => {
      // From 10 votes on, the lemon tree always has the most votes, so “the most” is a tempting wrong reason.
      const total = r.pick([10, 12, 14, 16, 20]), half = total / 2;
      const kind = r.pick(['more', 'less', 'equal'] as const);
      const lemon = kind === 'more' ? half + r.int(1, 2) : kind === 'equal' ? half : half - 1;
      const rest = total - lemon, orange = Math.floor(rest / 2), ceibo = rest - orange;
      const YES = T(`Sí: la mitad de ${total} es ${half} y ${lemon} es más`, `Yes: half of ${total} is ${half} and ${lemon} is more`);
      const NO = T(`No: la mitad de ${total} es ${half}`, `No: half of ${total} is ${half}`);
      const MOST = L('Sí: es el árbol con más votos|Yes: it is the tree with the most votes');
      const right = kind === 'more' ? YES : NO;
      return choose(r,
        T(`Para el jardín votaron ${total} personas: limonero ${lemon}, naranjo ${orange}, ceibo ${ceibo}. ¿El limonero tiene más de la mitad de los votos?`, `${total} people voted for the garden: lemon tree ${lemon}, orange tree ${orange}, ceibo ${ceibo}. Does the lemon tree have more than half of the votes?`),
        right, kind === 'more' ? [NO, MOST] : [YES, MOST],
        kind === 'more'
          ? T(`La mitad de ${total} es ${half}, y ${lemon} es más que ${half}.`, `Half of ${total} is ${half}, and ${lemon} is more than ${half}.`)
          : T(`La mitad de ${total} es ${half}, y ${lemon} no es más que ${half}. Tener más votos no es lo mismo que tener más de la mitad.`, `Half of ${total} is ${half}, and ${lemon} is not more than ${half}. Having the most votes is not the same as having more than half.`),
        T(`Repartí ${total} fichas en dos grupos iguales y compará un grupo con ${lemon}.`, `Share ${total} counters into two equal groups and compare one group with ${lemon}.`));
    },
    r => {
      const total = r.pick([8, 10, 12]), lemon = total / 2 + 1, orange = total - lemon;
      const YES = L('Sí: lo dicen los votos que juntamos|Yes: the votes we collected say so');
      const NO = L('No: solo sabemos lo que dijo la familia|No: we only know what the family said');
      const ALL = L('Sí: un grupo habla por todos|Yes: one group speaks for everyone');
      const tree = r.pick(TREES.slice(0, 2));
      return oneOf(r, [
        () => choose(r, T(`Votó la familia, ${total} personas: limonero ${lemon}, naranjo ${orange}. ¿Podemos decir que los vecinos también quieren un ${tree[0]}?`, `The family voted, ${total} people: lemon tree ${lemon}, orange tree ${orange}. Can we say the neighbours want a ${tree[1]} too?`),
          NO, [YES, ALL], T(`Los datos son de las ${total} personas que votaron, no de los vecinos.`, `The data come from the ${total} people who voted, not from the neighbours.`), L('Pensá de quiénes tenemos respuestas y de quiénes no.|Think about whose answers we have and whose we do not.')),
        () => choose(r, T(`Votó la familia, ${total} personas: limonero ${lemon}, naranjo ${orange}. ¿Podemos decir que en la familia el limonero tuvo más votos que el naranjo?`, `The family voted, ${total} people: lemon tree ${lemon}, orange tree ${orange}. Can we say the lemon tree got more votes than the orange tree in the family?`),
          YES, [NO, ALL], T(`En la familia, ${lemon} votos son más que ${orange}: eso sí lo dicen los datos.`, `In the family, ${lemon} votes are more than ${orange}: the data do say that.`), L('Pensá de quiénes tenemos respuestas y qué dicen esas respuestas.|Think about whose answers we have and what those answers say.')),
      ]);
    },
  ],
  'G03-14-L01': [
    r => {
      let guests = 0, seats = 0;
      do { guests = r.int(30, 95); seats = r.pick([10, 12, 15, 20, 25]); } while (guests % seats === 0);
      const full = Math.floor(guests / seats), vans = full + 1, left = guests - full * seats;
      return typed(
        T(`Vienen ${guests} invitados. Cada combi tiene ${seats} asientos. ¿Cuántas combis hacen falta?`, `${guests} guests are coming. Each van has ${seats} seats. How many vans are needed?`),
        vans,
        T(`${full} combis llevan ${full * seats} personas; faltan ${left}. Hacen falta ${vans} combis.`, `${full} vans carry ${full * seats} people; ${left} are left. ${vans} vans are needed.`),
        T(`Contá de ${seats} en ${seats} hasta tener lugar para los ${guests} invitados.`, `Count by ${seats}s until there is room for all ${guests} guests.`),
        { unit: T('combis', 'vans'), reward: T(`Las ${vans} combis quedan reservadas.`, `The ${vans} vans are booked.`) },
      );
    },
    r => {
      const ONE_MORE = L('Hace falta una más para lo que sobra|One more is needed for what is left');
      const NOT_FULL = L('Lo que sobra no alcanza para llenar otra|What is left is not enough to fill another');
      const DROP = L('Lo que sobra se borra: no importa|What is left is erased: it does not matter');
      return oneOf(r, [
        () => {
          const seats = r.pick([10, 15, 20]), full = r.int(2, 4), left = r.int(1, seats - 1);
          return choose(r, T(`Con ${full} combis llenas de ${seats} quedan ${left} invitados sin lugar. ¿Qué hacemos?`, `With ${full} full vans of ${seats}, ${left} guests have no seat. What do we do?`),
            ONE_MORE, [NOT_FULL, DROP], T(`Las ${left} personas que quedan también vienen a la fiesta: hacen falta ${full + 1} combis.`, `The ${left} people left are coming to the party too: ${full + 1} vans are needed.`),
            L('Después de llenar las combis, mirá si queda alguien esperando.|After filling the vans, see whether anyone is still waiting.'));
        },
        () => {
          const per = r.pick([10, 12]), full = r.int(3, 6), left = r.int(2, per - 1), total = per * full + left;
          return choose(r, T(`Hay ${total} empanadas. Cada bandeja lleva ${per}. ¿Cuántas bandejas llenas salen? Sobran ${left}.`, `There are ${total} empanadas. Each tray holds ${per}. How many full trays can we make? ${left} are left over.`),
            NOT_FULL, [ONE_MORE, DROP], T(`Salen ${full} bandejas llenas. Las ${left} que sobran no llenan otra bandeja.`, `That makes ${full} full trays. The ${left} left over do not fill another tray.`),
            L('Leé la pregunta: ¿pide bandejas llenas o lugar para todas?|Read the question: does it ask for full trays or room for all of them?'));
        },
      ]);
    },
  ],
  'G03-14-L02': [
    r => {
      const round = r.int(3, 9) * 10, d = r.int(1, 3), under = r.int(0, 1) === 0, n = under ? round - d : round + d, k = r.int(3, 9);
      const sign = under ? '−' : '+', other = under ? '+' : '−';
      return choose(r,
        T(`Hay ${k} bandejas con ${n} empanadas cada una. ¿Qué cuenta da ${n} × ${k}?`, `There are ${k} trays with ${n} empanadas each. Which calculation gives ${n} × ${k}?`),
        T(`${round} × ${k} ${sign} ${d} × ${k}`, `${round} × ${k} ${sign} ${d} × ${k}`),
        [T(`${round} × ${k} ${sign} ${d}`, `${round} × ${k} ${sign} ${d}`), T(`${round} × ${k} ${other} ${d} × ${k}`, `${round} × ${k} ${other} ${d} × ${k}`), T(`${n} × ${k} ${sign} ${d} × ${k}`, `${n} × ${k} ${sign} ${d} × ${k}`)],
        under
          ? T(`A cada una de las ${k} bandejas le faltan ${d} para ${round}: ${round * k} − ${d * k} = ${n * k} empanadas.`, `Each of the ${k} trays is ${d} short of ${round}: ${round * k} − ${d * k} = ${n * k} empanadas.`)
          : T(`Cada una de las ${k} bandejas tiene ${d} más que ${round}: ${round * k} + ${d * k} = ${n * k} empanadas.`, `Each of the ${k} trays has ${d} more than ${round}: ${round * k} + ${d * k} = ${n * k} empanadas.`),
        T(`${n} es ${round} ${sign} ${d}. ¿A cuántas bandejas hay que ${under ? 'quitarles' : 'sumarles'} ${d}?`, `${n} is ${round} ${sign} ${d}. How many trays need ${d} ${under ? 'taken away' : 'added'}?`),
        { reward: T(`Las ${n * k} empanadas quedan contadas: hay para todos.`, `The ${n * k} empanadas are counted: there are enough for everyone.`) });
    },
    r => {
      const round = r.int(3, 9) * 10, d = r.int(1, 3), n = round - d, k = r.int(3, 9), atomoOk = r.int(0, 1) === 0;
      const tita = `${r.int(0, 1) ? `${round - 10} × ${k} + ${10 - d} × ${k}` : `${round} × ${k} − ${d} × ${k}`}`;
      const atomo = atomoOk ? `${k} × ${n} = ${n * k}` : `${round} × ${k} − ${d} = ${round * k - d}`;
      const CLEAR = L('Las dos sirven: elegimos la más clara|Both work: we choose the clearer one');
      const TITA = L('Usamos la de la abuela: la de Átomo da otro resultado|We use Abuela’s: Átomo’s gives a different result');
      const STEPS = L('Elegimos la que tiene más pasos|We choose the one with more steps');
      return choose(r,
        T(`Para ${n} × ${k}, la abuela Tita hace ${tita} y Átomo hace ${atomo}. ¿Qué hacemos?`, `For ${n} × ${k}, Abuela Tita does ${tita} and Átomo does ${atomo}. What do we do?`),
        atomoOk ? CLEAR : TITA, atomoOk ? [TITA, STEPS] : [CLEAR, STEPS],
        atomoOk
          ? T(`Las dos dan ${n * k}. Un buen método se entiende y respeta la situación.`, `Both give ${n * k}. A good method is easy to follow and respects the situation.`)
          : T(`${n} × ${k} = ${n * k}. Átomo restó ${d} una sola vez y no en cada bandeja.`, `${n} × ${k} = ${n * k}. Átomo took away ${d} only once, not from every tray.`),
        L('Probá los dos métodos y fijate si dan lo mismo.|Try both methods and see whether they give the same result.'));
    },
  ],
};
