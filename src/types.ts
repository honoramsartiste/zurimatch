export type Gender = 'woman' | 'man' | 'non-binary' | 'other';
export type LookingFor = 'women' | 'men' | 'everyone';

export type RelationshipGoal =
  | 'marriage'
  | 'serious'
  | 'dating'
  | 'friendship'
  | 'open';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface Profile {
  id: string;
  email: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  gender: Gender;
  lookingFor: LookingFor;
  country: string;
  city: string;
  bio: string;
  photos: string[];
  primaryPhotoIndex: number;
  interests: string[];
  languages: string[];
  relationshipGoal: RelationshipGoal;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  isPremium: boolean;
  premiumExpiresAt?: string;
  isSuspended: boolean;
  isBanned: boolean;
  isPaused: boolean;
  role?: 'user' | 'admin';
  createdAt: string;
  lastActive: string;
  ageRangeMin?: number;
  ageRangeMax?: number;
  maxDistanceKm?: number;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  isSuperLike: boolean;
  createdAt: string;
}

export interface Match {
  id: string;
  userIds: [string, string];
  createdAt: string;
  lastInteractionAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  matchId: string;
  participantIds: [string, string];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount?: number;
}

export type NotificationType =
  | 'match'
  | 'message'
  | 'like'
  | 'verification'
  | 'system'
  | 'premium';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  targetId?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'resolved';
  createdAt: string;
}

export interface SubscriptionPlan {
  id: 'monthly' | 'quarterly' | 'annual' | 'boost';
  name: string;
  durationMonths: number;
  priceUSD: number;
  priceEUR: number;
  priceCDF: number;
  priceXOF: number;
  popular?: boolean;
  perks: string[];
}

export type Language = 'fr' | 'en';
export type Currency = 'USD' | 'EUR' | 'CDF' | 'XOF';

export interface FilterCriteria {
  minAge: number;
  maxAge: number;
  country?: string;
  city?: string;
  relationshipGoal?: RelationshipGoal | 'all';
  interests?: string[];
  verifiedOnly?: boolean;
}
