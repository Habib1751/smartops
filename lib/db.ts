

export const prisma = undefined as unknown as null;

export function prismaUnavailable() {
  throw new Error(
    'Prisma has been removed. Use your external backend endpoints instead of importing prisma.'
  );
}

export default prisma;
