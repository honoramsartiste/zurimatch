import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAge, calculateAffinity, detectMutualMatch, filterProfiles } from './matching';
import { Profile, Like, FilterCriteria } from '../types';

test('calculateAge calculates correct age from birthdate', () => {
  const ref = new Date('2026-11-01T12:00:00Z');
  assert.equal(calculateAge('1998-05-15', ref), 28);
  assert.equal(calculateAge('2000-11-02', ref), 25); // not yet birthday in 2026
  assert.equal(calculateAge('2000-11-01', ref), 26); // exactly birthday
});

test('calculateAffinity produces higher score for shared interests and location', () => {
  const user1: Profile = {
    id: 'u1',
    email: 'u1@test.com',
    name: 'Amina',
    birthDate: '1998-01-01',
    age: 28,
    gender: 'woman',
    lookingFor: 'men',
    country: 'RDC',
    city: 'Kinshasa',
    bio: '',
    photos: [],
    primaryPhotoIndex: 0,
    interests: ['Afrobeat', 'Voyage', 'Gastronomie'],
    languages: ['Français', 'Lingala'],
    relationshipGoal: 'serious',
    isVerified: true,
    verificationStatus: 'verified',
    isPremium: false,
    isSuspended: false,
    isBanned: false,
    isPaused: false,
    createdAt: '2026-01-01',
    lastActive: '2026-11-01',
  };

  const highMatch: Profile = {
    ...user1,
    id: 'u2',
    name: 'Jean',
    gender: 'man',
    interests: ['Afrobeat', 'Voyage', 'Tech'],
    city: 'Kinshasa',
    country: 'RDC',
    languages: ['Français', 'Lingala'],
    relationshipGoal: 'serious',
  };

  const lowMatch: Profile = {
    ...user1,
    id: 'u3',
    name: 'Liam',
    gender: 'man',
    interests: ['Ski', 'Hockey'],
    city: 'Toronto',
    country: 'Canada',
    languages: ['Anglais'],
    relationshipGoal: 'open',
  };

  const scoreHigh = calculateAffinity(user1, highMatch);
  const scoreLow = calculateAffinity(user1, lowMatch);

  assert.ok(scoreHigh > scoreLow, `Expected scoreHigh (${scoreHigh}) > scoreLow (${scoreLow})`);
  assert.ok(scoreHigh >= 75, `Expected scoreHigh to be >= 75`);
});

test('detectMutualMatch accurately identifies bidirectional likes', () => {
  const likes: Like[] = [
    { id: 'l1', fromUserId: 'u1', toUserId: 'u2', isSuperLike: false, createdAt: '2026-11-01' },
    { id: 'l2', fromUserId: 'u2', toUserId: 'u1', isSuperLike: true, createdAt: '2026-11-01' },
    { id: 'l3', fromUserId: 'u1', toUserId: 'u3', isSuperLike: false, createdAt: '2026-11-01' },
  ];

  assert.equal(detectMutualMatch(likes, 'u1', 'u2'), true);
  assert.equal(detectMutualMatch(likes, 'u1', 'u3'), false); // one-way
  assert.equal(detectMutualMatch(likes, 'u2', 'u3'), false); // no likes
});

test('filterProfiles filters out blocked and out-of-range users', () => {
  const p1: Profile = {
    id: 'p1',
    email: 'p1@test.com',
    name: 'Sarah',
    birthDate: '1996-01-01',
    age: 30,
    gender: 'woman',
    lookingFor: 'men',
    country: 'France',
    city: 'Paris',
    bio: '',
    photos: [],
    primaryPhotoIndex: 0,
    interests: ['Art'],
    languages: ['Français'],
    relationshipGoal: 'serious',
    isVerified: true,
    verificationStatus: 'verified',
    isPremium: false,
    isSuspended: false,
    isBanned: false,
    isPaused: false,
    createdAt: '2026-01-01',
    lastActive: '2026-11-01',
  };

  const p2: Profile = { ...p1, id: 'p2', age: 45, city: 'Lyon' };
  const p3: Profile = { ...p1, id: 'p3', isBanned: true };

  const criteria: FilterCriteria = {
    minAge: 20,
    maxAge: 35,
    country: 'France',
  };

  const results = filterProfiles([p1, p2, p3], 'me', criteria, ['p4'], []);
  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'p1');
});
