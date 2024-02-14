using System.ComponentModel.DataAnnotations;

namespace Core
{
    public class User : BaseEntity
    {
        public required string UserId { get; set; }
        public string? EmployeeId { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public DateTime Hired { get; set; }
        public DateTime? Terminated { get; set; }
        public bool IsAccountLocked { get; set; }
    }
}