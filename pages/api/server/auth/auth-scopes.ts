import { UnauthorizedException, mixin, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AzureAdResponse } from './azure-ad-strategy';

export function AuthScopes(
  authScopesParam: AuthScopesParam,
  type?: string | string[]
) {
  return mixin(
    class ScopesAuth extends AuthGuard(type) {
      readonly scopes: string[] = authScopesParam.scopes;
      readonly roles: string[] = authScopesParam.roles;

      handleRequest<TUser = any>(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
        status?: any
      ): TUser {
        if (err || !user) {
          throw err || new UnauthorizedException();
        }
        const response = user as AzureAdResponse;
        if (
          !this.scopes.some((s) =>
            (response.scp || '').split(' ').includes(s)
          ) &&
          !this.roles.some((s) => (response.roles || []).includes(s))
        ) {
          throw new UnauthorizedException(
            `Bearer does not possess one of the required scopes (${this.scopes.join(
              ','
            )}) - or roles (${this.roles.join(',')}))`
          );
        }
        return user;
      }
    }
  );
}

export type AuthScopesParam = { scopes: string[]; roles: string[] };
