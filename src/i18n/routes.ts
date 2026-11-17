import { GradeId, Locale, TopicId } from '../math/core/types';
import { getGradeById } from '../math/curriculum';
import { TOPICS_CATALOG } from '../math/topics/generators';
import { getSkillGameMeta, type SkillGameId } from '../math/arcade/skillGames';

export function normalizeUrlLocale(param?: string): Locale {
  if (!param) return 'es-AR';
  return param.toLowerCase() === 'en-us' ? 'en-US' : 'es-AR';
}

/** Pick the best supported interface locale from an Accept-Language header. */
export function getPreferredLocale(acceptLanguage?: string | null): Locale {
  const preferences = (acceptLanguage || '')
    .split(',')
    .map((entry, index) => {
      const [tag = '', ...parameters] = entry.trim().toLowerCase().split(';');
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return { tag: tag.trim(), quality, index };
    })
    .filter(({ tag, quality }) => tag && quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { tag } of preferences) {
    const language = tag.split('-')[0];
    if (language === 'en') return 'en-US';
    if (language === 'es') return 'es-AR';
  }

  return 'es-AR';
}

export function localeToUrlPrefix(locale: Locale): 'es-ar' | 'en-us' {
  return locale === 'en-US' ? 'en-us' : 'es-ar';
}

export function getSubjectSlug(locale: Locale): 'matematicas' | 'mathematics' {
  return locale === 'en-US' ? 'mathematics' : 'matematicas';
}

export function getGradeVerbSlug(locale: Locale): 'grado' | 'grade' {
  return locale === 'en-US' ? 'grade' : 'grado';
}

export function getGradeSlug(gradeId: GradeId, locale: Locale): string {
  const grade = getGradeById(gradeId);
  return locale === 'en-US' ? grade.slugEn : grade.slugEs;
}

export function getTopicSlug(topicId: TopicId, locale: Locale): string {
  const meta = TOPICS_CATALOG.find((t) => t.id === topicId);
  if (!meta) return topicId;
  return locale === 'en-US' ? meta.slugEn : meta.slugEs;
}

export function resolveTopicFromSlug(slug: string): TopicId {
  const clean = (slug || '').trim().toLowerCase();
  const match = TOPICS_CATALOG.find(
    (t) =>
      t.id === clean ||
      t.slugEs.toLowerCase() === clean ||
      t.slugEn.toLowerCase() === clean
  );
  return match ? match.id : 'addition-subtraction';
}

export function buildHomeUrl(locale: Locale): string {
  return `/${localeToUrlPrefix(locale)}/`;
}

export function buildCatalogUrl(locale: Locale): string {
  return `/${localeToUrlPrefix(locale)}/${getSubjectSlug(locale)}/`;
}

export function buildGradeUrl(locale: Locale, gradeId: GradeId): string {
  return `/${localeToUrlPrefix(locale)}/${getSubjectSlug(locale)}/${getGradeVerbSlug(locale)}/${getGradeSlug(gradeId, locale)}/`;
}

export function buildLearnTopicUrl(locale: Locale, topicId: TopicId): string {
  return `/${localeToUrlPrefix(locale)}/${getSubjectSlug(locale)}/${getTopicSlug(topicId, locale)}/`;
}

export function buildGradeOneLessonUrl(locale: Locale, lessonId: string): string {
  return buildSchoolLessonUrl(locale, 'grade-1', lessonId);
}

export function buildSchoolLessonUrl(locale: Locale, gradeId: GradeId, lessonId: string): string {
  return `${buildGradeUrl(locale, gradeId)}${lessonId.toLowerCase()}/`;
}

export function getTrainVerbSlug(locale: Locale): 'entrenar' | 'train' {
  return locale === 'en-US' ? 'train' : 'entrenar';
}

export function getSkillSlug(skill: SkillGameId, locale: Locale): string {
  const meta = getSkillGameMeta(skill);
  return locale === 'en-US' ? meta.slugEn : meta.slugEs;
}

export function buildTrainHubUrl(locale: Locale): string {
  return `/${localeToUrlPrefix(locale)}/${getTrainVerbSlug(locale)}/`;
}

export function buildTrainSkillUrl(locale: Locale, skill: SkillGameId): string {
  return `${buildTrainHubUrl(locale)}${getSkillSlug(skill, locale)}/`;
}

export function buildProgressUrl(locale: Locale): string {
  return locale === 'en-US' ? '/en-us/progress/' : '/es-ar/progreso/';
}

export function buildPremiumUrl(locale: Locale): string {
  return `/${localeToUrlPrefix(locale)}/premium/`;
}

export function buildAccountUrl(locale: Locale): string {
  return locale === 'en-US' ? '/en-us/account/' : '/es-ar/cuenta/';
}

export function buildAboutUrl(locale: Locale): string {
  return locale === 'en-US' ? '/en-us/about/' : '/es-ar/acerca/';
}

export function buildPrivacyUrl(locale: Locale): string {
  return locale === 'en-US' ? '/en-us/privacy/' : '/es-ar/privacidad/';
}

export function buildTermsUrl(locale: Locale): string {
  return locale === 'en-US' ? '/en-us/terms/' : '/es-ar/terminos/';
}

/** Which destination the header marks as current. */
export type SiteNavId = 'home' | 'learn' | 'train' | 'progress' | 'premium' | 'account' | 'none';
