using System.ComponentModel.DataAnnotations;

namespace Core
{
    public abstract class BaseEntity : Identifier
    {
        [Key]
        public Guid Id { get; set; }
    }
}