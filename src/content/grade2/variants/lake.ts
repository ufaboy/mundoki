// Chapter 3 — Mirror Lake (G02-05, G02-06): mental addition and subtraction to
// 100, checking with the inverse, doubles and halves.
import { T, choose, typed, type Generator } from './kit';

export const lake: Record<string, [Generator, Generator]> = {
  'G02-05-L01': [
    r => {
      const a = r.int(2, 6) * 10 + r.int(1, 5), b = r.int(1, 3) * 10 + r.int(1, 4);
      const tens = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10, ones = (a % 10) + (b % 10);
      return typed(
        T(`Hay ${a} gotas azules y ${b} blancas. ¿Cuántas gotas hay?`, `There are ${a} blue drops and ${b} white ones. How many drops are there?`),
        a + b,
        T(`${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${tens} y ${a % 10} + ${b % 10} = ${ones}. Son ${a + b}.`, `${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${tens} and ${a % 10} + ${b % 10} = ${ones}. That is ${a + b}.`),
        T(`Sumá primero las decenas de ${a} y ${b}. Después las unidades.`, `Add the tens of ${a} and ${b} first. Then the ones.`),
        { unit: T('gotas', 'drops') },
      );
    },
    r => {
      const a = r.int(2, 5) * 10 + r.int(1, 9), tens = r.int(1, 4), ones = r.int(2, 9), b = tens * 10 + ones;
      return choose(r,
        T(`¿Por qué ${a} + ${b} se puede hacer como ${a} + ${tens * 10} + ${ones}?`, `Why can ${a} + ${b} be done as ${a} + ${tens * 10} + ${ones}?`),
        T(`Porque ${b} es ${tens * 10} y ${ones}`, `Because ${b} is ${tens * 10} and ${ones}`),
        [T('Porque así da más', 'Because that gives more'), T(`Porque ${b} es ${tens} y ${ones}`, `Because ${b} is ${tens} and ${ones}`)],
        T(`Separamos ${b} en ${tens * 10} y ${ones}. Juntos siguen siendo ${b}.`, `We split ${b} into ${tens * 10} and ${ones}. Together they are still ${b}.`),
        T(`Juntá ${tens * 10} y ${ones}. Compará ese número con ${b}.`, `Put ${tens * 10} and ${ones} together. Compare that number with ${b}.`));
    },
  ],
  'G02-05-L02': [
    r => {
      const a = r.int(2, 8) * 10 + r.int(5, 9), k = r.int(11 - (a % 10), 9), toTen = 10 - (a % 10);
      return typed(
        T(`La vela tiene ${a} estrellas. Pegamos ${k} más. ¿Cuántas hay?`, `The sail has ${a} stars. We stick on ${k} more. How many are there?`),
        a + k,
        T(`${a} + ${toTen} = ${a + toTen} y ${a + toTen} + ${k - toTen} = ${a + k}.`, `${a} + ${toTen} = ${a + toTen} and ${a + toTen} + ${k - toTen} = ${a + k}.`),
        T(`Usá una parte del ${k} para llegar de ${a} a ${a + toTen}. Después sumá lo que queda.`, `Use part of the ${k} to get from ${a} to ${a + toTen}. Then add what is left.`),
        { unit: T('estrellas', 'stars'), reward: T(`La vela brilla con ${a + k} estrellas.`, `The sail shines with ${a + k} stars.`) },
      );
    },
    r => {
      const u = r.int(1, 4), a = r.int(3, 9) * 10 + u, k = u + r.int(2, 5), rest = k - u, round = a - u;
      return choose(r,
        T(`Había ${a} estrellas. Usamos ${k}. ¿Por qué conviene hacer ${a} − ${u} − ${rest}?`, `There were ${a} stars. We used ${k}. Why is it handy to do ${a} − ${u} − ${rest}?`),
        T(`Primero llegamos a ${round}`, `First we reach ${round}`),
        [T('Así restamos menos', 'That way we take away less'), T(`Porque ${u} + ${rest} = ${k + 1}`, `Because ${u} + ${rest} = ${k + 1}`)],
        T(`Quitamos ${k} en dos pasos: ${u} y ${rest}. Pasamos por ${round}.`, `We take away ${k} in two steps: ${u} and ${rest}. We pass through ${round}.`),
        T(`Sumá lo que sacaste en los dos pasos: ${u} y ${rest}.`, `Add what you took away in the two steps: ${u} and ${rest}.`));
    },
  ],
  'G02-05-L03': [
    r => {
      const b = r.int(12, 25), c = r.pick([12, 13, 14, 15, 16, 17, 18, 19, 26, 27, 28, 29, 34, 35, 36, 41, 42, 45].filter(n => n !== b)), a = b + c;
      return choose(r,
        T(`En el agua dice ${a} − ${b} = ${c}. ¿Qué cuenta lo comprueba?`, `The water says ${a} − ${b} = ${c}. Which calculation checks it?`),
        T(`${c} + ${b} = ${a}`, `${c} + ${b} = ${a}`),
        [T(`${a} + ${b} = ${a + b}`, `${a} + ${b} = ${a + b}`), T(`${c} + ${c} = ${2 * c}`, `${c} + ${c} = ${2 * c}`)],
        T('Lo que quedó más lo que sacamos da el número del comienzo.', 'What is left plus what we took away gives the starting number.'),
        T(`A los ${c} que quedaron, volvé a sumarles los ${b} que sacaste.`, `Add the ${b} you took away back to the ${c} that are left.`));
    },
    r => {
      const b = r.int(12, 29), c = r.int(20, 59), a = b + c, lie = r.int(0, 1) === 0;
      const shown = lie ? c - r.pick([10, 8, 2]) : c, back = shown + b;
      const options = lie
        ? [T(`Que ${a} − ${b} no es ${shown}`, `That ${a} − ${b} is not ${shown}`), T('Que la suma está mal', 'That the addition is wrong'), T(`Que ${a} − ${b} es ${back}`, `That ${a} − ${b} is ${back}`)]
        : [T(`Que ${a} − ${b} = ${shown} es verdad`, `That ${a} − ${b} = ${shown} is true`), T(`Que ${a} − ${b} no es ${shown}`, `That ${a} − ${b} is not ${shown}`), T('Que la suma está mal', 'That the addition is wrong')];
      return choose(r,
        T(`En el agua dice ${a} − ${b} = ${shown}. Y ${shown} + ${b} = ${back}. ¿Qué significa?`, `The water says ${a} − ${b} = ${shown}. And ${shown} + ${b} = ${back}. What does it mean?`),
        options[0], options.slice(1),
        lie ? T(`Para comprobar, tenemos que volver a ${a}. ${back} no es ${a}.`, `To check, we must get back to ${a}. ${back} is not ${a}.`) : T(`Volvimos a ${a}: la resta está bien.`, `We got back to ${a}: the subtraction is right.`),
        T(`Compará ${back} con el número del comienzo, ${a}. ¿Son iguales?`, `Compare ${back} with the starting number, ${a}. Are they equal?`),
        lie ? undefined : { reward: T('¡Es verdad! La cuenta brilla sobre el agua. Se ve el camino hacia Mora.', 'It is true! The calculation shines on the water. The way to Mora appears.') });
    },
  ],
  'G02-06-L01': [
    r => {
      const n = r.int(11, 45);
      return typed(
        T(`Un escudo tiene ${n} luciérnagas. El reflejo tiene las mismas. ¿Cuántas hay en total?`, `A shield has ${n} fireflies. The reflection has the same. How many are there in all?`),
        2 * n,
        T(`${n} + ${n} = ${2 * n}. Es el doble de ${n}.`, `${n} + ${n} = ${2 * n}. That is double ${n}.`),
        T(`Armá dos grupos de ${n} luciérnagas. Sumá las decenas y después las unidades.`, `Make two groups of ${n} fireflies. Add the tens and then the ones.`),
        { unit: T('luciérnagas', 'fireflies') },
      );
    },
    r => {
      const a = r.int(5, 12), fake = r.int(0, 2) > 0, b = fake ? a + r.pick([-1, 1]) : a;
      const options = fake
        ? [T(`No, el doble de ${a} es ${a} + ${a}`, `No, double ${a} is ${a} + ${a}`), T(`Sí, ${a} y ${b} son casi iguales`, `Yes, ${a} and ${b} are almost equal`), T(`Sí, el doble de ${a} es ${a} + 2`, `Yes, double ${a} is ${a} + 2`)]
        : [T(`Sí, ${a} + ${a} es el doble de ${a}`, `Yes, ${a} + ${a} is double ${a}`), T(`No, el doble de ${a} es ${a} + 2`, `No, double ${a} is ${a} + 2`), T('No, un reflejo tiene uno más', 'No, a reflection has one more')];
      return choose(r,
        T(`Arriba hay ${a} peces y en el reflejo hay ${b}. ¿${a} + ${b} es el doble de ${a}?`, `There are ${a} fish above and ${b} in the reflection. Is ${a} + ${b} double ${a}?`),
        options[0], options.slice(1),
        T('En el doble, las dos partes son iguales.', 'In a double, both parts are equal.'),
        T(`Compará los ${a} peces de arriba con los ${b} del reflejo: ¿son la misma cantidad?`, `Compare the ${a} fish above with the ${b} in the reflection: are they the same amount?`),
        fake ? undefined : { reward: T('Ese reflejo es verdadero. El falso desaparece.', 'That reflection is real. The fake one disappears.') });
    },
  ],
  'G02-06-L02': [
    r => {
      const half = r.int(6, 30);
      return typed(
        T(`Hay ${2 * half} piedras de luna para dos orillas. ¿Cuántas van a cada orilla?`, `There are ${2 * half} moon stones for two shores. How many go on each shore?`),
        half,
        T(`${half} + ${half} = ${2 * half}. Las dos partes son iguales.`, `${half} + ${half} = ${2 * half}. Both parts are equal.`),
        T(`Repartí las ${2 * half} piedras entre las dos orillas, de a una por turno.`, `Share the ${2 * half} stones between the two shores, one at a time.`),
        { unit: T('piedras', 'stones'), reward: T(`Cada orilla tiene ${half} piedras. El lago se calma.`, `Each shore has ${half} stones. The lake calms down.`) },
      );
    },
    r => {
      const half = r.int(5, 20), n = 2 * half, equal = r.int(0, 2) === 0, gap = r.int(1, 4);
      const x = equal ? half : half - gap, y = equal ? half : half + gap;
      const options = equal
        ? [T(`Sí, son iguales y suman ${n}`, `Yes, they are equal and make ${n}`), T(`No, porque ${x} + ${y} no da ${n}`, `No, because ${x} + ${y} does not make ${n}`), T(`No, la mitad de ${n} es 2`, `No, half of ${n} is 2`)]
        : [T(`No, las mitades son iguales: ${half} y ${half}`, `No, halves are equal: ${half} and ${half}`), T(`No, porque ${x} + ${y} no da ${n}`, `No, because ${x} + ${y} does not make ${n}`), T(`Sí, porque ${x} + ${y} da ${n}`, `Yes, because ${x} + ${y} makes ${n}`)];
      return choose(r,
        T(`¿${x} y ${y} son las mitades de ${n}?`, `Are ${x} and ${y} the halves of ${n}?`),
        options[0], options.slice(1),
        equal ? T(`${half} + ${half} = ${n} y las dos partes son iguales.`, `${half} + ${half} = ${n}, and both parts are equal.`) : T(`${x} + ${y} da ${n}, pero las mitades tienen que ser iguales.`, `${x} + ${y} makes ${n}, but halves must be equal.`),
        T(`Para que sean mitades, las dos partes tienen que ser iguales. Compará ${x} y ${y}.`, `For halves, both parts must be equal. Compare ${x} and ${y}.`),
        { reward: T(`Ahora hay ${half} piedras en cada orilla. Se oye a Mora.`, `Now there are ${half} stones on each shore. Mora can be heard.`) });
    },
  ],
  'G02-06-L03': [
    r => {
      const a = r.int(11, 45), up = r.int(0, 1) === 0, b = up ? a + 1 : a - 1;
      return typed(
        T(`En una orilla hay ${a} piedras y en la otra ${b}. Si ${a} + ${a} = ${2 * a}, ¿cuántas hay en total?`, `One shore has ${a} stones and the other has ${b}. If ${a} + ${a} = ${2 * a}, how many are there in all?`),
        a + b,
        up ? T(`Una parte creció 1: ${2 * a} + 1 = ${a + b}.`, `One part grew by 1: ${2 * a} + 1 = ${a + b}.`) : T(`Una parte tiene 1 menos: ${2 * a} − 1 = ${a + b}.`, `One part has 1 fewer: ${2 * a} − 1 = ${a + b}.`),
        T(`Compará ${a} + ${a} con ${a} + ${b}. ¿Cuánto cambió una de las partes?`, `Compare ${a} + ${a} with ${a} + ${b}. How much did one part change?`),
        { unit: T('piedras', 'stones') },
      );
    },
    r => {
      const k = r.int(11, 45);
      return typed(
        T(`El doble de ${k} es ${2 * k}. ¿Cuál es la mitad de ${2 * k}?`, `Double ${k} is ${2 * k}. What is half of ${2 * k}?`),
        k,
        T(`Dos partes de ${k} forman ${2 * k}. La mitad es ${k}.`, `Two parts of ${k} make ${2 * k}. Half is ${k}.`),
        T(`Dibujá dos grupos de ${k}. Mirá cuántos hay en un grupo.`, `Draw two groups of ${k}. Look at how many are in one group.`),
      );
    },
  ],
};
