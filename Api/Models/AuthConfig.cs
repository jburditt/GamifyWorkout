﻿public class AuthConfig
{
    public const string Name = "Authentication";
    public const string AuthSchemeName = "defaultScheme";

    public required string Authority { get; set; }
    public required string Issuer { get; set; }
    public required List<string> Audiences { get; set; }
}