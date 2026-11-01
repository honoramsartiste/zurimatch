import { FilterCriteria, Like, Profile } from '../types';

/**
 * Calculates user age in full years from birth date (YYYY-MM-DD).
 */
export function calculateAge(birthDateString: string, referenceDate: Date = new Date()): number {
  if (!birthDateString) return 18;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 18;

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const m = referenceDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 18;
}

/**
 * Evaluates compatibility affinity (0 - 100%) between two profiles.
 * Considers:
 * - Shared interests (up to 40 pts)
 * - Same country or city (up to 25 pts)
 * - Compatible relationship goal (up to 20 pts)
 * - Common spoken languages (up to 15 pts)
 */
export function calculateAffinity(a: Profile, b: Profile): number {
  if (a.id === b.id) return 100;
  let score = 30; // base baseline score

  // 1. Shared interests
  const aInterests = new Set(a.interests.map((i) => i.toLowerCase().trim()));
  const commonInterests = b.interests.filter((i) => aInterests.has(i.toLowerCase().trim()));
  score += Math.min(35, commonInterests.length * 9);

  // 2. Location
  if (a.city && b.city && a.city.toLowerCase().trim() === b.city.toLowerCase().trim()) {
    score += 20;
  } else if (a.country && b.country && a.country.toLowerCase().trim() === b.country.toLowerCase().trim()) {
    score += 12;
  }

  // 3. Relationship goal compatibility
  if (a.relationshipGoal && b.relationshipGoal && a.relationshipGoal === b.relationshipGoal) {
    score += 15;
  }

  // 4. Common languages
  const aLangs = new Set(a.languages.map((l) => l.toLowerCase().trim()));
  const commonLangs = b.languages.filter((l) => aLangs.has(l.toLowerCase().trim()));
  score += Math.min(10, commonLangs.length * 5);

  return Math.min(99, Math.max(40, score));
}

/**
 * Checks whether userA and userB have mutually liked each other.
 */
export function detectMutualMatch(likes: Like[], userAId: string, userBId: string): boolean {
  const aLikesB = likes.some((l) => l.fromUserId === userAId && l.toUserId === userBId);
  const bLikesA = likes.some((l) => l.fromUserId === userBId && l.toUserId === userAId);
  return aLikesB && bLikesA;
}

/**
 * Filters a pool of profiles according to user criteria, exclusions, and blocks.
 */
export function filterProfiles(
  profiles: Profile[],
  currentUserId: string,
  criteria: FilterCriteria,
  blockedIds: string[] = [],
  likedOrPassedIds: string[] = []
): Profile[] {
  const blockedSet = new Set(blockedIds);
  const excludedSet = new Set([...likedOrPassedIds, currentUserId]);

  return profiles.filter((p) => {
    // Exclude current user, blocked users, or already handled
    if (excludedSet.has(p.id) || blockedSet.has(p.id)) return false;
    // Exclude suspended/banned/paused
    if (p.isBanned || p.isSuspended || p.isPaused) return false;

    // Age filter
    if (p.age < criteria.minAge || p.age > criteria.maxAge) return false;

    // Country filter
    if (criteria.country && criteria.country !== 'all' && p.country.toLowerCase() !== criteria.country.toLowerCase()) {
      return false;
    }

    // City filter
    if (criteria.city && criteria.city !== 'all' && p.city.toLowerCase() !== criteria.city.toLowerCase()) {
      return false;
    }

    // Relationship goal
    if (criteria.relationshipGoal && criteria.relationshipGoal !== 'all' && p.relationshipGoal !== criteria.relationshipGoal) {
      return false;
    }

    // Verified only
    if (criteria.verifiedOnly && !p.isVerified) {
      return false;
    }

    // Interests filter (if specified, must share at least one)
    if (criteria.interests && criteria.interests.length > 0) {
      const pInterestSet = new Set(p.interests.map((i) => i.toLowerCase()));
      const hasMatch = criteria.interests.some((i) => pInterestSet.has(i.toLowerCase()));
      if (!hasMatch) return false;
    }

    return true;
  });
}
