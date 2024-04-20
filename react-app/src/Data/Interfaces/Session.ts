import { Individual } from "./Individual";

export interface SessionData {
    id?: number;
    Handle?: string | null;
    LastRequest?: Date | null;
    LastIP?: string | null;
    UserID?: number | null;
    Type?: 'web' | 'mobile' | null;
    AuthSourceID?: number | null;
    AssertionValidUntil?: Date | null;
    PendingUserID?: number | null;
    created_at?: Date;
    updated_at?: Date;
    Individual: Individual | undefined;
  };