namespace Api
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public required string OAuthId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
    }
}
