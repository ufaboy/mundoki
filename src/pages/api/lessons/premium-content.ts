import type { APIRoute } from 'astro';
import {
  getAuthenticatedSessionUser,
  getSubscriptionFromStore,
  isSubscriptionActive,
  jsonResponse,
} from '../../../lib/db/d1Store';
import { getRuntimeEnv } from '../../../lib/server/runtimeEnv';
import { Locale, TopicId } from '../../../math/core/types';

export const prerender = false;

const SERVER_PROTECTED_MASTERCLASS: Partial<Record<
  TopicId,
  {
    title: { 'es-AR': string; 'en-US': string };
    secretStrategy: { 'es-AR': string; 'en-US': string };
    challengeLatex: string;
    workedProof: { 'es-AR': string; 'en-US': string };
  }
>> = {
  'addition-subtraction': {
    title: {
      'es-AR': 'Laboratorio Premium: Compensación Mental Instantánea',
      'en-US': 'Premium Lab: Instant Mental Compensation',
    },
    secretStrategy: {
      'es-AR':
        'Para sumar 48 + 37 sin papel, sumá 2 al 48 (llegás a 50) y restá 2 al 37 (queda 35): 50 + 35 = 85.',
      'en-US':
        'To add 48 + 37 mentally, add 2 to 48 (making 50) and subtract 2 from 37 (leaving 35): 50 + 35 = 85.',
    },
    challengeLatex: '48 + 37 = (48 + 2) + (37 - 2) = 50 + 35 = 85',
    workedProof: {
      'es-AR': 'Sumar y restar la misma cantidad mantiene invariante la suma total.',
      'en-US': 'Adding and subtracting the same quantity preserves the total sum invariant.',
    },
  },
  'multiplication-division': {
    title: {
      'es-AR': 'Laboratorio Premium: Descomposición por Áreas',
      'en-US': 'Premium Lab: Area Model Decomposition',
    },
    secretStrategy: {
      'es-AR':
        'Para multiplicar 14 × 6, partí el rectángulo en (10 × 6) + (4 × 6) = 60 + 24 = 84.',
      'en-US':
        'To multiply 14 × 6, split the rectangle into (10 × 6) + (4 × 6) = 60 + 24 = 84.',
    },
    challengeLatex: '14 \\times 6 = (10 + 4) \\times 6 = 60 + 24 = 84',
    workedProof: {
      'es-AR': 'Aplicación directa de la propiedad distributiva sobre áreas rectangulares.',
      'en-US': 'Direct application of the distributive property over rectangular areas.',
    },
  },
  fractions: {
    title: {
      'es-AR': 'Laboratorio Premium: Comparación Cruzada por Denominador Común',
      'en-US': 'Premium Lab: Cross-Comparison via Common Denominator',
    },
    secretStrategy: {
      'es-AR':
        'Para comparar 3/4 y 4/5, llevá ambas a veinteavos: 3/4 = 15/20 y 4/5 = 16/20. ¡4/5 es mayor por 1/20!',
      'en-US':
        'To compare 3/4 and 4/5, convert both to twentieths: 3/4 = 15/20 and 4/5 = 16/20. 4/5 is greater by 1/20!',
    },
    challengeLatex: '\\frac{3}{4} = \\frac{15}{20} < \\frac{16}{20} = \\frac{4}{5}',
    workedProof: {
      'es-AR': 'Al igualar el tamaño de las partes (1/20), basta comparar los numeradores.',
      'en-US': 'Once slice sizes match (1/20), comparing numerators directly determines order.',
    },
  },
  'negative-numbers': {
    title: {
      'es-AR': 'Laboratorio Premium: Por qué Menos por Menos da Más',
      'en-US': 'Premium Lab: Why a Negative Times a Negative is Positive',
    },
    secretStrategy: {
      'es-AR':
        'Multiplicar por −1 invierte el sentido en la recta numérica. Invertir dos veces (−1 × −1) te devuelve al lado positivo (+1).',
      'en-US':
        'Multiplying by −1 flips direction on the number line. Flipping twice (−1 × −1) returns you to the positive side (+1).',
    },
    challengeLatex: '(-3) \\times (-4) = +12',
    workedProof: {
      'es-AR': 'Cada signo negativo representa una reflexión de 180° respecto del origen 0.',
      'en-US': 'Each negative sign represents a 180° reflection across the origin 0.',
    },
  },
  'percentages-proportions': {
    title: {
      'es-AR': 'Laboratorio Premium: Simetría Conmutativa de Porcentajes',
      'en-US': 'Premium Lab: Commutative Symmetry of Percentages',
    },
    secretStrategy: {
      'es-AR':
        '¡El X% de Y es siempre igual al Y% de X! Por ejemplo, el 16% de 25 es igual al 25% de 16 (la cuarta parte de 16 = 4).',
      'en-US':
        'X% of Y always equals Y% of X! For example, 16% of 25 equals 25% of 16 (one-fourth of 16 = 4).',
    },
    challengeLatex: '16\\% \\text{ of } 25 = 25\\% \\text{ of } 16 = 4',
    workedProof: {
      'es-AR': 'Porque (16 × 25) / 100 = (25 × 16) / 100 por conmutatividad del producto.',
      'en-US': 'Because (16 × 25) / 100 = (25 × 16) / 100 by commutativity of multiplication.',
    },
  },
};

export const GET: APIRoute = async ({ request }) => {
  const env = await getRuntimeEnv();
  const user = await getAuthenticatedSessionUser(request, env);
  if (!user) {
    return jsonResponse(
      {
        entitled: false,
        error: 'Authentication required to access server-protected Premium lessons.',
      },
      401
    );
  }

  const subscription = await getSubscriptionFromStore(user.id, env);
  if (!isSubscriptionActive(subscription)) {
    return jsonResponse(
      {
        entitled: false,
        error: 'Active Premium subscription required (verified on server).',
      },
      403
    );
  }

  const url = new URL(request.url);
  const requested = url.searchParams.get('topicId') ?? '';
  const locale: Locale = url.searchParams.get('locale') === 'en-US' ? 'en-US' : 'es-AR';
  // Own keys only: "constructor" or "__proto__" must fall back, not reach Object.prototype.
  const topicId: TopicId = Object.hasOwn(SERVER_PROTECTED_MASTERCLASS, requested)
    ? (requested as TopicId)
    : 'percentages-proportions';
  const masterclass = SERVER_PROTECTED_MASTERCLASS[topicId]!;

  return jsonResponse({
    entitled: true,
    topicId,
    masterclass: {
      title: masterclass.title[locale],
      secretStrategy: masterclass.secretStrategy[locale],
      challengeLatex: masterclass.challengeLatex,
      workedProof: masterclass.workedProof[locale],
    },
  });
};
