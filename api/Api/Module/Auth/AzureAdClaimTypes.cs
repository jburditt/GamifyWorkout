using System.IdentityModel.Tokens.Jwt;

namespace Api
{
    public static class AzureAdClaimTypes
    {
        // TODO there are constants available for these schemas, UserName, Issuer, probably bearer token, try claim_names but maybe not so much
        public const string Id = "http://schemas.microsoft.com/identity/claims/objectidentifier";
        public const string UserName = "preferred_username";
        public const string ClaimNames = "_claim_names";
        public const string Scope = "http://schemas.microsoft.com/identity/claims/scope";
        public const string Issuer = "iss";
        public const string AuthBearerToken = "auth_bearer_token";
    }
}