import { User, UserStatus } from "@prisma/client"

export function canUserPost(user: User) {
  switch (user.status) {
    case UserStatus['Blocked']:
      return { ok: false, reason: 'blocked' }
    case UserStatus['PendingVerification']:
      return { ok: false, reason: 'not_verified' }
    case UserStatus['Suspended']:
      return { ok: false, reason: 'suspended' }
    case UserStatus['Deleted']:
      return { ok: false, reason: 'deleted_account' }
    default:
      return { ok: true }
  }
}